import * as fs from 'fs/promises';
import matter from 'gray-matter';
import { getLinkPreview } from 'link-preview-js';

async function getPreviewMetadata(url: string): Promise<any> {
  if (!url) {
    return {};
  }

  const preview = (await getLinkPreview(url)) as any;

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

async function parseFile(root: string, path: string): Promise<any> {
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

async function parseDirectory(source: string, path: string): Promise<any[]> {
  let list = [];

  for (const dirent of await fs.readdir(path, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      list.push(...(await parseDirectory(source, `${path}/${dirent.name}`)));
    } else if (dirent.isFile()) {
      list.push(await parseFile(source, `${path}/${dirent.name}`));
    }
  }

  return list;
}

async function generate(source: string, path = source): Promise<void> {
  const entries = await parseDirectory(source, path);

  process.stdout.write(JSON.stringify(entries, null, 2));
}

export default generate;
