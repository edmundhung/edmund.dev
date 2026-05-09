import { describe, expect, it } from 'vitest';

import { transformMarkdown } from './markdown-snippets.ts';

describe('transformMarkdown', () => {
  it('converts later snapshots into diffs', () => {
    let source = [
      '# Demo',
      '',
      '```tsx progress.tsx',
      'const a = 1;',
      '```',
      '',
      '```tsx progress.tsx',
      'const a = 2;',
      '```',
      '',
    ].join('\n');

    let expected = [
      '# Demo',
      '',
      '```tsx progress.tsx',
      'const a = 1;',
      '```',
      '',
      '```diff progress.tsx',
      '@@ -1 +1 @@',
      '-const a = 1;',
      '+const a = 2;',
      '```',
      '',
    ].join('\n');

    expect(transformMarkdown(source, 'diff')).toBe(expected);
  });

  it('restores snapshots from generated diffs', () => {
    let source = [
      '# Demo',
      '',
      '```tsx progress.tsx',
      'const a = 1;',
      '```',
      '',
      '```diff progress.tsx',
      '@@ -1 +1 @@',
      '-const a = 1;',
      '+const a = 2;',
      '```',
      '',
    ].join('\n');

    let expected = [
      '# Demo',
      '',
      '```tsx progress.tsx',
      'const a = 1;',
      '```',
      '',
      '```tsx progress.tsx',
      'const a = 2;',
      '```',
      '',
    ].join('\n');

    expect(transformMarkdown(source, 'snapshot')).toBe(expected);
  });

  it('tracks separate histories for interleaved filenames', () => {
    let source = [
      '```ts alpha.ts',
      'export const alpha = 1;',
      '```',
      '',
      '```ts beta.ts',
      'export const beta = 1;',
      '```',
      '',
      '```ts alpha.ts',
      'export const alpha = 2;',
      '```',
      '',
      '```ts beta.ts',
      'export const beta = 2;',
      '```',
      '',
    ].join('\n');

    let expected = [
      '```ts alpha.ts',
      'export const alpha = 1;',
      '```',
      '',
      '```ts beta.ts',
      'export const beta = 1;',
      '```',
      '',
      '```diff alpha.ts',
      '@@ -1 +1 @@',
      '-export const alpha = 1;',
      '+export const alpha = 2;',
      '```',
      '',
      '```diff beta.ts',
      '@@ -1 +1 @@',
      '-export const beta = 1;',
      '+export const beta = 2;',
      '```',
      '',
    ].join('\n');

    expect(transformMarkdown(source, 'diff')).toBe(expected);
  });

  it('leaves non-matching fences unchanged', () => {
    let source = '```ts\nconst a = 1;\n```\n';

    expect(transformMarkdown(source, 'diff')).toBe(source);
  });

  it('errors when applying a diff without a snapshot', () => {
    expect(() =>
      transformMarkdown(
        '```diff progress.tsx\n@@ -1 +1 @@\n-const a = 1;\n+const a = 2;\n```\n',
        'snapshot',
      ),
    ).toThrow(/Cannot apply diff for progress\.tsx before a snapshot block\./);
  });
});
