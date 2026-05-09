import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import shell from 'highlight.js/lib/languages/shell';
import typescript from 'highlight.js/lib/languages/typescript';
import MarkdownIt, { type Options } from 'markdown-it';
import type Renderer from 'markdown-it/lib/renderer.mjs';
import type Token from 'markdown-it/lib/token.mjs';

hljs.registerLanguage('css', css);
hljs.registerLanguage('diff', diff);
hljs.registerLanguage('sh', shell);
hljs.registerLanguage('tsx', typescript);
hljs.registerLanguage('ts', typescript);

let markdown = new MarkdownIt({
  highlight(code: string, language: string, _attrs: string) {
    if (language && hljs.getLanguage(language)) {
      return `<pre class="hljs"><code>${
        hljs.highlight(code, { language }).value
      }</code></pre>`;
    }

    return `<pre class="hljs"><code>${escapeHtml(code)}</code></pre>`;
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
  tokens[index].attrJoin('class', 'scroll-mt-20');
  return self.renderToken(tokens, index, options);
};

export function renderMarkdown(markdownSource: string) {
  return markdown.render(markdownSource);
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
