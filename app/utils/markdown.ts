import bash from '@shikijs/langs/bash';
import css from '@shikijs/langs/css';
import diff from '@shikijs/langs/diff';
import tsx from '@shikijs/langs/tsx';
import typescript from '@shikijs/langs/typescript';
import githubDarkDefault from '@shikijs/themes/github-dark-default';
import MarkdownIt, { type Options } from 'markdown-it';
import type Renderer from 'markdown-it/lib/renderer.mjs';
import type Token from 'markdown-it/lib/token.mjs';
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

type DiffLineKind = 'addition' | 'context' | 'deletion' | 'meta';

interface DiffLineDescriptor {
  body: string;
  className: string;
  kind: DiffLineKind;
  prefix: string;
  syntax: boolean;
}

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
    if (language === 'diff') {
      let innerLanguage = resolveDiffLanguageFromFilename(attrs);

      if (innerLanguage) {
        try {
          return highlightDiff(code, innerLanguage);
        } catch {}
      }
    }

    if (language) {
      try {
        if (attrs.trim()) {
          return highlightCodeWithLineNumbers(code, language);
        }

        return highlighter.codeToHtml(code, {
          lang: language,
          theme: SHIKI_THEME,
        });
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
  return markdown.render(markdownSource);
}

function highlightDiff(code: string, language: string) {
  let lines = code.endsWith('\n')
    ? code.slice(0, -1).split('\n')
    : code.split('\n');
  let position: DiffPosition = { oldLine: null, newLine: null };

  return `<pre class="shiki shiki-diff ${SHIKI_THEME}" style="background-color:${SHIKI_BACKGROUND};color:${SHIKI_FOREGROUND}" tabindex="0"><code>${lines
    .map(line => renderDiffLine(line, language, position))
    .join('')}</code></pre>`;
}

function highlightCodeWithLineNumbers(code: string, language: string) {
  let lines = highlighter.codeToTokensBase(code, {
    lang: language,
    theme: SHIKI_THEME,
  });

  return `<pre class="shiki shiki-lines ${SHIKI_THEME}" style="background-color:${SHIKI_BACKGROUND};color:${SHIKI_FOREGROUND}" tabindex="0"><code>${lines
    .map((tokens, index) => renderCodeLine(tokens ?? [], index + 1))
    .join('')}</code></pre>`;
}

function renderCodeLine(tokens: HighlightToken[], lineNumber: number) {
  return `<span class="line code-line"><span class="code-line-number">${lineNumber}</span><span class="code-line-content">${
    renderTokens(tokens) || '&#8203;'
  }</span></span>`;
}

function renderDiffLine(
  line: string,
  language: string,
  position: DiffPosition,
) {
  let hunkHeader = parseDiffHunkHeader(line);
  if (hunkHeader) {
    position.oldLine = hunkHeader.oldStart;
    position.newLine = hunkHeader.newStart;
    return '';
  }

  let { body, className, kind, prefix, syntax } = classifyDiffLine(line);
  let lineNumber = getDiffLineNumbers(kind, position);
  let content = syntax
    ? renderHighlightedLine(body, language)
    : escapeHtml(body);

  return `<span class="line diff-line ${className}"><span class="diff-line-number">${
    lineNumber.oldLine ?? ''
  }</span><span class="diff-line-number">${
    lineNumber.newLine ?? ''
  }</span><span class="diff-prefix">${escapeHtml(
    prefix,
  )}</span><span class="diff-content">${content || '&#8203;'}</span></span>`;
}

function classifyDiffLine(line: string): DiffLineDescriptor {
  if (
    line.startsWith('diff ') ||
    line.startsWith('index ') ||
    line.startsWith('+++') ||
    line.startsWith('---')
  ) {
    return {
      body: line,
      className: 'diff-meta',
      kind: 'meta',
      prefix: '',
      syntax: false,
    };
  }

  if (line.startsWith('+')) {
    return {
      body: line.slice(1),
      className: 'diff-addition',
      kind: 'addition',
      prefix: '+',
      syntax: true,
    };
  }

  if (line.startsWith('-')) {
    return {
      body: line.slice(1),
      className: 'diff-deletion',
      kind: 'deletion',
      prefix: '-',
      syntax: true,
    };
  }

  if (line.startsWith(' ')) {
    return {
      body: line.slice(1),
      className: 'diff-context',
      kind: 'context',
      prefix: ' ',
      syntax: true,
    };
  }

  return {
    body: line,
    className: 'diff-context',
    kind: 'meta',
    prefix: '',
    syntax: false,
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

function renderHighlightedLine(line: string, language: string) {
  let [tokens] = highlighter.codeToTokensBase(line, {
    lang: language,
    theme: SHIKI_THEME,
  });

  return renderTokens(tokens ?? []);
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
  if (token.fontStyle && (token.fontStyle & 1) !== 0)
    styles.push('font-style:italic');
  if (token.fontStyle && (token.fontStyle & 2) !== 0)
    styles.push('font-weight:bold');
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

function resolveDiffLanguageFromFilename(attrs: string) {
  let filename = attrs.trim().split(/\s+/, 1)[0]?.toLowerCase();
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
