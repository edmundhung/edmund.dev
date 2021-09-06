import * as fs from 'fs/promises';
import matter from 'gray-matter';
import { Miniflare } from "miniflare";
import { getLinkPreview } from "link-preview-js";

async function getPreviewMetadata(url) {
  if (!url) {
    return {};
  }

  const preview = await getLinkPreview(url);

  switch (preview.siteName) {
    case 'Flickr':
      return {
        title: preview.title,
        image: preview.images[0],
      };
    case 'GitHub':
      return {
        image: preview.images[0],
      };
    default:
      return {
        title: preview.title,
        description: preview.description,
        image: preview.images[0],
      };
  }
}

async function parseFile(root, path) {
  const content = await fs.readFile(path);
  const result = matter(content.toString('utf8'));
  const preview = await getPreviewMetadata(result.data?.url);

  return {
    key: path.replace(new RegExp(`^${root}/`), '').replace(/\.md$/, ''),
    value: result.content,
    metadata: {
      ...preview,
      ...result.data,
    },
  };
}

async function parseDirectory(root, path = root) {
  const list = [];

  for (const dirent of await fs.readdir(path, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      list.push(...await parseDirectory(root, `${path}/${dirent.name}`));
    } else if (dirent.isFile()) {
      list.push(await parseFile(root, `${path}/${dirent.name}`));
    }
  }

  return list;
}

async function main() {
  const mf = new Miniflare({
    kvPersist: true,
  });

  const Content = await mf.getKVNamespace('Content');
  const entries = await parseDirectory('content');

  await Promise.all(entries.map(entry => Content.put(entry.key, entry.value, { metadata: entry.metadata })));
}

await main();
