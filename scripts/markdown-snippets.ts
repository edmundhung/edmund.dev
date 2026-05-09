import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { applyPatch, structuredPatch, type StructuredPatchHunk } from 'diff';

type TransformMode = 'diff' | 'snapshot';

interface FenceSegment {
  type: 'fence';
  body: string;
  closeLine: string;
  indent: string;
  info: string;
  marker: string;
  raw: string;
  openingLineEnding: string;
}

interface SnapshotBlock {
  filename: string;
  lang: string;
}

interface DiffBlock {
  filename: string;
}

interface StateEntry {
  body: string;
  lang: string;
}

type Segment = FenceSegment | { type: 'text'; content: string };

/**
 * Transform markdown in place between two authoring formats:
 * repeated `<lang> <filename>` snapshot fences and `diff <filename>` fences.
 *
 * The state map tracks the latest snapshot body for each filename as we walk
 * through the document, which lets us either generate the next diff hunk or
 * reconstruct the next snapshot from an existing diff.
 */
export function transformMarkdown(source: string, mode: TransformMode) {
  let segments = parseMarkdownSegments(source);
  let state = new Map<string, StateEntry>();

  return segments
    .map(segment => {
      if (segment.type === 'text') return segment.content;

      let snapshot = parseSnapshotInfo(segment.info);
      if (snapshot) {
        let previous = state.get(snapshot.filename);

        if (!previous) {
          state.set(snapshot.filename, {
            body: segment.body,
            lang: snapshot.lang,
          });
          return segment.raw;
        }

        if (previous.lang !== snapshot.lang) {
          throw new Error(
            `Expected ${snapshot.filename} to keep language ${previous.lang}, received ${snapshot.lang}.`,
          );
        }

        state.set(snapshot.filename, {
          body: segment.body,
          lang: snapshot.lang,
        });

        if (mode === 'diff') {
          return renderFence(
            segment,
            `diff ${snapshot.filename}`,
            createUnifiedDiff(previous.body, segment.body),
          );
        }

        return segment.raw;
      }

      let diff = parseDiffInfo(segment.info);
      if (!diff) return segment.raw;

      let previous = state.get(diff.filename);
      if (!previous) {
        throw new Error(
          `Cannot apply diff for ${diff.filename} before a snapshot block.`,
        );
      }

      let nextBody = applyUnifiedDiff(previous.body, segment.body);
      state.set(diff.filename, { body: nextBody, lang: previous.lang });

      if (mode === 'snapshot') {
        return renderFence(
          segment,
          `${previous.lang} ${diff.filename}`,
          nextBody,
        );
      }

      return segment.raw;
    })
    .join('');
}

function parseMarkdownSegments(source: string): Segment[] {
  let lines = source.match(/[^\n]*\n|[^\n]+$/g) ?? [];
  let segments: Segment[] = [];
  let textBuffer = '';

  for (let index = 0; index < lines.length; index++) {
    let opening = parseOpeningFence(stripLineEnding(lines[index]));
    if (!opening) {
      textBuffer += lines[index];
      continue;
    }

    let closingIndex = findClosingFence(lines, index + 1, opening.marker);
    if (closingIndex === -1) {
      textBuffer += lines[index];
      continue;
    }

    if (textBuffer) {
      segments.push({ type: 'text', content: textBuffer });
      textBuffer = '';
    }

    segments.push({
      type: 'fence',
      body: lines.slice(index + 1, closingIndex).join(''),
      closeLine: lines[closingIndex],
      indent: opening.indent,
      info: opening.info,
      marker: opening.marker,
      openingLineEnding: lines[index].endsWith('\n') ? '\n' : '',
      raw: lines.slice(index, closingIndex + 1).join(''),
    });

    index = closingIndex;
  }

  if (textBuffer) {
    segments.push({ type: 'text', content: textBuffer });
  }

  return segments;
}

function parseOpeningFence(line: string) {
  let match = line.match(/^( {0,3})(`{3,}|~{3,})([^\n]*)$/);
  if (!match) return null;

  return {
    indent: match[1],
    info: match[3].trim(),
    marker: match[2],
  };
}

function findClosingFence(lines: string[], startIndex: number, marker: string) {
  let char = marker[0];
  let escapedChar = char === '`' ? '\\`' : '~';
  let closingPattern = new RegExp(
    `^ {0,3}${escapedChar}{${marker.length},}[ \t]*$`,
  );

  for (let index = startIndex; index < lines.length; index++) {
    if (closingPattern.test(stripLineEnding(lines[index]))) {
      return index;
    }
  }

  return -1;
}

function parseSnapshotInfo(info: string): SnapshotBlock | null {
  let parts = info.split(/\s+/).filter(Boolean);
  if (parts.length !== 2 || parts[0] === 'diff') return null;

  return { filename: parts[1], lang: parts[0] };
}

function parseDiffInfo(info: string): DiffBlock | null {
  let parts = info.split(/\s+/).filter(Boolean);
  if (parts.length !== 2 || parts[0] !== 'diff') return null;

  return { filename: parts[1] };
}

function renderFence(segment: FenceSegment, info: string, body: string) {
  let normalizedBody = body && !body.endsWith('\n') ? `${body}\n` : body;

  return `${segment.indent}${segment.marker}${info}${segment.openingLineEnding}${normalizedBody}${segment.closeLine}`;
}

function stripLineEnding(line: string) {
  return line.endsWith('\n') ? line.slice(0, -1) : line;
}

function createUnifiedDiff(previous: string, next: string) {
  let patch = structuredPatch('previous', 'next', previous, next, '', '', {
    context: 3,
  });

  return patch.hunks
    .map(trimBlankContextLines)
    .flatMap(hunk => [
      `@@ -${formatRange(hunk.oldStart, hunk.oldLines)} +${formatRange(
        hunk.newStart,
        hunk.newLines,
      )} @@`,
      ...hunk.lines,
    ])
    .join('\n');
}

function applyUnifiedDiff(previous: string, diff: string) {
  if (!diff.trim()) return previous;

  let patch = `--- previous\n+++ next\n${
    diff.endsWith('\n') ? diff : `${diff}\n`
  }`;
  let result = applyPatch(previous, patch);

  if (result === false) {
    throw new Error('Failed to apply generated diff.');
  }

  return result;
}

function formatRange(start: number, count: number) {
  if (count === 0) return `${Math.max(start - 1, 0)},0`;
  if (count === 1) return `${start}`;
  return `${start},${count}`;
}

function trimBlankContextLines(hunk: StructuredPatchHunk): StructuredPatchHunk {
  let lines = [...hunk.lines];
  let oldStart = hunk.oldStart;
  let newStart = hunk.newStart;
  let oldLines = hunk.oldLines;
  let newLines = hunk.newLines;

  /** Keep tutorial diffs focused by dropping unchanged blank lines at hunk edges. */
  while (lines[0] === ' ') {
    lines.shift();
    oldStart += 1;
    newStart += 1;
    oldLines -= 1;
    newLines -= 1;
  }

  while (lines.at(-1) === ' ') {
    lines.pop();
    oldLines -= 1;
    newLines -= 1;
  }

  return {
    lines,
    newLines,
    newStart,
    oldLines,
    oldStart,
  };
}

/** Rewrite one markdown file in place as either snapshot or diff blocks. */
async function main(args: string[]) {
  let options = parseCliArgs(args);
  let filePath = resolve(options.filePath);
  let source = await readFile(filePath, 'utf8');
  let output = transformMarkdown(source, options.to);

  if (output !== source) await writeFile(filePath, output);
}

function parseCliArgs(args: string[]) {
  let filePath = '';
  let to: TransformMode | null = null;

  for (let index = 0; index < args.length; index++) {
    let arg = args[index];

    if (!to && (arg === 'diff' || arg === 'snapshot')) {
      to = arg;
      continue;
    }

    if (!filePath) {
      filePath = arg;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!to) throw new Error('Expected transform mode: diff or snapshot.');
  if (!filePath) throw new Error('Expected a markdown file path.');

  return { filePath, to };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await main(process.argv.slice(2));
}
