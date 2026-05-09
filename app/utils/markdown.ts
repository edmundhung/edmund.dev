import bash from '@shikijs/langs/bash';
import css from '@shikijs/langs/css';
import diff from '@shikijs/langs/diff';
import tsx from '@shikijs/langs/tsx';
import typescript from '@shikijs/langs/typescript';
import githubDarkDefault from '@shikijs/themes/github-dark-default';
import MarkdownIt, { type Options } from 'markdown-it';
import type Renderer from 'markdown-it/lib/renderer.mjs';
import type Token from 'markdown-it/lib/token.mjs';
import { applyPatch } from 'diff';
import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';

const SHIKI_THEME = 'github-dark-default';
const SHIKI_BACKGROUND =
  githubDarkDefault.colors?.['editor.background'] ?? '#0d1117';
const SHIKI_FOREGROUND =
  githubDarkDefault.colors?.['editor.foreground'] ?? '#e6edf3';

interface HighlightToken {
  bgColor?: string;
  color?: string;
  content: string;
  fontStyle?: number;
  htmlAttrs?: Record<string, string>;
  htmlStyle?: Record<string, string>;
}

interface DiffPosition {
  newLine: number | null;
  oldLine: number | null;
}

interface DiffRenderedBlock {
  html: string;
  next: string;
}

interface DiffRow {
  body: string;
  kind: DiffLineKind;
  newLine: number | null;
  oldLine: number | null;
  prefix: string;
}

interface SnapshotState {
  code: string;
  language: string;
}

type DiffLineKind = 'addition' | 'context' | 'deletion' | 'meta';

let currentSnapshots = new Map<string, SnapshotState>();

/** Initialize the Worker-safe highlighter once and keep markdown rendering sync. */
const highlighter = await createHighlighterCore({
  engine: createOnigurumaEngine(import('shiki/onig.wasm')),
  langAlias: {
    cjs: 'typescript',
    cts: 'typescript',
    javascript: 'typescript',
    js: 'typescript',
    jsx: 'tsx',
    mjs: 'typescript',
    mts: 'typescript',
    sh: 'bash',
    shell: 'bash',
    ts: 'typescript',
  },
  langs: [bash, css, diff, tsx, typescript],
  themes: [githubDarkDefault],
});

let markdown = new MarkdownIt({
  highlight(code: string, language: string, attrs: string) {
    let filename = parseSnippetFilename(attrs);

    if (language === 'diff') {
      let innerLanguage = resolveDiffLanguageFromFilename(attrs);
      let previous = filename ? currentSnapshots.get(filename) : null;

      if (filename && innerLanguage && previous) {
        try {
          let rendered = renderDiffBlock(code, innerLanguage, previous.code);
          currentSnapshots.set(filename, {
            code: rendered.next,
            language: previous.language,
          });
          return rendered.html;
        } catch {}
      }

      return highlighter.codeToHtml(code, {
        lang: 'diff',
        theme: SHIKI_THEME,
      });
    }

    if (language) {
      try {
        let html = highlighter.codeToHtml(code, {
          lang: language,
          theme: SHIKI_THEME,
        });

        if (filename) {
          currentSnapshots.set(filename, { code, language });
        }

        return html;
      } catch {}
    }

    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  },
  html: false,
  linkify: true,
  typographer: true,
});

markdown.renderer.rules.heading_open = (
  tokens: Token[],
  index: number,
  options: Options,
  _env: unknown,
  self: Renderer,
) => {
  let title = tokens[index + 1]?.content ?? '';
  tokens[index].attrSet('id', slugify(title));
  tokens[index].attrJoin('class', 'scroll-mt-10');
  return self.renderToken(tokens, index, options);
};

export async function renderMarkdown(markdownSource: string) {
  currentSnapshots = new Map();

  try {
    return markdown.render(markdownSource);
  } finally {
    currentSnapshots.clear();
  }
}

function renderDiffBlock(
  code: string,
  language: string,
  previous: string,
): DiffRenderedBlock {
  let next = applyUnifiedDiff(previous, code);
  let oldTokens = highlighter.codeToTokensBase(previous, {
    lang: language,
    theme: SHIKI_THEME,
  });
  let newTokens = highlighter.codeToTokensBase(next, {
    lang: language,
    theme: SHIKI_THEME,
  });
  let rows = parseDiffRows(code, previous, next);

  return {
    html: `<pre class="shiki shiki-diff ${SHIKI_THEME}" style="background-color:${SHIKI_BACKGROUND};color:${SHIKI_FOREGROUND}" tabindex="0"><code>${rows
      .map(row => renderDiffRow(row, oldTokens, newTokens))
      .join('')}</code></pre>`,
    next,
  };
}

function renderDiffRow(
  row: DiffRow,
  oldTokens: HighlightToken[][],
  newTokens: HighlightToken[][],
) {
  let content = getDiffRowContent(row, oldTokens, newTokens);

  return `<span class="line diff-line ${getDiffLineClassName(
    row.kind,
  )}"><span class="diff-line-number">${
    row.oldLine ?? ''
  }</span><span class="diff-line-number">${
    row.newLine ?? ''
  }</span><span class="diff-prefix">${escapeHtml(
    row.prefix,
  )}</span><span class="diff-content">${content || '&#8203;'}</span></span>`;
}

function getDiffRowContent(
  row: DiffRow,
  oldTokens: HighlightToken[][],
  newTokens: HighlightToken[][],
) {
  if (row.kind === 'addition') {
    return renderTokens(newTokens[(row.newLine ?? 1) - 1] ?? []);
  }

  if (row.kind === 'deletion') {
    return renderTokens(oldTokens[(row.oldLine ?? 1) - 1] ?? []);
  }

  if (row.kind === 'context') {
    return renderTokens(newTokens[(row.newLine ?? 1) - 1] ?? []);
  }

  return escapeHtml(row.body);
}

function parseDiffRows(code: string, previous: string, next: string) {
  let lines = code.endsWith('\n')
    ? code.slice(0, -1).split('\n')
    : code.split('\n');
  let previousLines = previous.endsWith('\n')
    ? previous.slice(0, -1).split('\n')
    : previous.split('\n');
  let nextLines = next.endsWith('\n')
    ? next.slice(0, -1).split('\n')
    : next.split('\n');
  let position: DiffPosition = { oldLine: null, newLine: null };
  let rows: DiffRow[] = [];

  for (let line of lines) {
    let hunkHeader = parseDiffHunkHeader(line);
    if (hunkHeader) {
      position.oldLine = hunkHeader.oldStart;
      position.newLine = hunkHeader.newStart;
      continue;
    }

    let { body, kind, prefix } = classifyDiffLine(
      line,
      position,
      previousLines,
      nextLines,
    );
    let numbers = getDiffLineNumbers(kind, position);

    rows.push({
      body,
      kind,
      newLine: numbers.newLine,
      oldLine: numbers.oldLine,
      prefix,
    });
  }

  return rows;
}

function classifyDiffLine(
  line: string,
  position: DiffPosition,
  previousLines: string[],
  nextLines: string[],
) {
  if (
    line === '' &&
    position.oldLine &&
    position.newLine &&
    previousLines[position.oldLine - 1] === '' &&
    nextLines[position.newLine - 1] === ''
  ) {
    return {
      body: '',
      kind: 'context' as const,
      prefix: ' ',
    };
  }

  if (
    line.startsWith('diff ') ||
    line.startsWith('index ') ||
    line.startsWith('+++') ||
    line.startsWith('---')
  ) {
    return {
      body: line,
      kind: 'meta' as const,
      prefix: '',
    };
  }

  if (line.startsWith('+')) {
    return {
      body: line.slice(1),
      kind: 'addition' as const,
      prefix: '+',
    };
  }

  if (line.startsWith('-')) {
    return {
      body: line.slice(1),
      kind: 'deletion' as const,
      prefix: '-',
    };
  }

  if (line.startsWith(' ')) {
    return {
      body: line.slice(1),
      kind: 'context' as const,
      prefix: ' ',
    };
  }

  return {
    body: line,
    kind: 'meta' as const,
    prefix: '',
  };
}

function parseDiffHunkHeader(line: string) {
  let match = line.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@(?: .*)?$/);
  if (!match) return null;

  return {
    newStart: Number(match[2]),
    oldStart: Number(match[1]),
  };
}

function getDiffLineNumbers(kind: DiffLineKind, position: DiffPosition) {
  if (kind === 'addition') {
    let current = { oldLine: null, newLine: position.newLine };
    position.newLine = (position.newLine ?? 0) + 1;
    return current;
  }

  if (kind === 'deletion') {
    let current = { oldLine: position.oldLine, newLine: null };
    position.oldLine = (position.oldLine ?? 0) + 1;
    return current;
  }

  if (kind === 'context') {
    let current = { oldLine: position.oldLine, newLine: position.newLine };
    position.oldLine = (position.oldLine ?? 0) + 1;
    position.newLine = (position.newLine ?? 0) + 1;
    return current;
  }

  return { oldLine: null, newLine: null };
}

function getDiffLineClassName(kind: DiffLineKind) {
  switch (kind) {
    case 'addition':
      return 'diff-addition';
    case 'context':
      return 'diff-context';
    case 'deletion':
      return 'diff-deletion';
    case 'meta':
      return 'diff-meta';
  }
}

function applyUnifiedDiff(previous: string, diffCode: string) {
  if (!diffCode.trim()) return previous;

  let patch = `--- previous\n+++ next\n${
    diffCode.endsWith('\n') ? diffCode : `${diffCode}\n`
  }`;
  let result = applyPatch(previous, patch);

  if (result === false) {
    throw new Error('Failed to apply diff block while rendering markdown.');
  }

  return result;
}

function renderTokens(tokens: HighlightToken[]) {
  return tokens
    .map(token => {
      let attributes = renderHtmlAttributes(token.htmlAttrs);
      let style = renderTokenStyle(token);
      let content = escapeHtml(token.content);

      if (!attributes && !style) return content;

      return `<span${attributes ? ` ${attributes}` : ''}${
        style ? ` style="${style}"` : ''
      }>${content}</span>`;
    })
    .join('');
}

function renderTokenStyle(token: HighlightToken) {
  if (token.htmlStyle) {
    return Object.entries(token.htmlStyle)
      .map(([property, value]) => `${property}:${value}`)
      .join(';');
  }

  let styles: string[] = [];

  if (token.color) styles.push(`color:${token.color}`);
  if (token.bgColor) styles.push(`background-color:${token.bgColor}`);
  if (token.fontStyle && (token.fontStyle & 1) !== 0) {
    styles.push('font-style:italic');
  }
  if (token.fontStyle && (token.fontStyle & 2) !== 0) {
    styles.push('font-weight:bold');
  }
  if (token.fontStyle && (token.fontStyle & 4) !== 0) {
    styles.push('text-decoration:underline');
  }
  if (token.fontStyle && (token.fontStyle & 8) !== 0) {
    styles.push('text-decoration:line-through');
  }

  return styles.join(';');
}

function renderHtmlAttributes(attributes: Record<string, string> | undefined) {
  if (!attributes) return '';

  return Object.entries(attributes)
    .map(([name, value]) => `${name}="${escapeHtml(value)}"`)
    .join(' ');
}

function parseSnippetFilename(attrs: string) {
  let filename = attrs.trim().split(/\s+/, 1)[0];
  return filename ? filename.toLowerCase() : null;
}

function resolveDiffLanguageFromFilename(attrs: string) {
  let filename = parseSnippetFilename(attrs);
  if (!filename) return null;

  let basename = filename.replace(/^.*\//, '');
  let extension = basename.match(/\.([a-z0-9]+)$/)?.[1];
  if (!extension) return null;

  return resolveConfiguredLanguage(extension);
}

function resolveConfiguredLanguage(value: string) {
  let language = highlighter.resolveLangAlias(value);
  return highlighter.getLoadedLanguages().includes(language) ? language : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
