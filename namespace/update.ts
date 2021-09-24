import * as fs from 'fs/promises';
import matter from 'gray-matter';
import { getLinkPreview } from 'link-preview-js';
import TOML from '@iarna/toml';
import { preview } from './preview';

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

async function parseDirectory(root: string, path = root): Promise<any[]> {
  const list = [];

  for (const dirent of await fs.readdir(path, { withFileTypes: true })) {
    if (dirent.isDirectory()) {
      list.push(...(await parseDirectory(root, `${path}/${dirent.name}`)));
    } else if (dirent.isFile()) {
      list.push(await parseFile(root, `${path}/${dirent.name}`));
    }
  }

  return list;
}

async function main(root: string, binding: string): Promise<void> {
  console.log(`Start updating KV`);
  const entries = await parseDirectory(root);
  console.log(`KV Generated, total: ${entries.length}`);

  if (process.env.MINIFLARE) {
    await preview(binding, entries);
    return;
  }

  console.log('Reading wrangler.toml...');
  const wranglerTOML = await fs.readFile('wrangler.toml');
  const config = TOML.parse(wranglerTOML.toString('utf8'));
  const accountId = config['account_id'];
  const kvNamespaces = (config['kv_namespaces'] ?? []) as any[];
  const kv = kvNamespaces.find(namespace => namespace.binding === binding);
  const namespaceId =
    process.env.NODE_ENV === 'production' ? kv?.id : kv?.preview_id;

  console.log(
    `Updating KV with binding "${binding}" for account "${accountId}" and namespace "${namespaceId}"`,
  );

  const fetch = (url: string, init?: any) =>
    import('node-fetch').then(({ default: fetch }) => fetch(url, init));
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/bulk`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
      },
      body: JSON.stringify(entries),
    },
  );
  const result = await response.text();

  console.log(
    `Update finish with status ${response.status} and result ${result}`,
  );
}

main('content', 'Content');
