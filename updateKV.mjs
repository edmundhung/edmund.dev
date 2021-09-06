import fs from 'fs';
import matter from 'gray-matter';
import { Miniflare } from "miniflare";

function parseFile(root, path) {
  const content = fs.readFileSync(path).toString('utf8');
  const result = matter(content);

  return {
    key: path.replace(new RegExp(`^${root}/`), '').replace(/\.md$/, ''),
    value: result.content,
    metadata: result.data,
  };
}

function parseDirectory(root, path = root) {
  const list = [];

  for (const dirent of fs.readdirSync(path, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      list.push(...parseDirectory(root, `${path}/${dirent.name}`));
    } else if (dirent.isFile()) {
      list.push(parseFile(root, `${path}/${dirent.name}`));
    }
  }

  return list;
}

async function main() {
  const mf = new Miniflare({
    kvPersist: true,
  });

  const Content = await mf.getKVNamespace('Content');

  await Promise.all(parseDirectory('content').map(entry => Content.put(entry.key, entry.value, { metadata: entry.metadata })));
}

await main();
