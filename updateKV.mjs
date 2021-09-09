import * as fs from 'fs/promises';
import matter from 'gray-matter';
import { Miniflare } from 'miniflare';
import { getLinkPreview } from 'link-preview-js';
import fetch from 'node-fetch';
import TOML from '@iarna/toml';

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

async function main(root, binding) {
  console.log(`Start updating KV`);
  const entries = await parseDirectory(root);
  console.log(`KV Generated, total: ${entries.length}`);

  if (process.env.MINIFLARE) {
    console.log('Persisting KV on Miniflare');
    const mf = new Miniflare({
      kvPersist: true,
    });
    const Content = await mf.getKVNamespace(binding);

    await Promise.all(entries.map(entry => Content.put(entry.key, entry.value, { metadata: entry.metadata })));
    console.log('KV persisted on Miniflare');
    return;
  }

  console.log('Reading wrangler.toml...');
  const wranglerTOML = await fs.readFile('wrangler.toml');
  const config = TOML.parse(wranglerTOML.toString('utf8'));
  const accountId = config['account_id'];
  const kvNamespaces = config['kv_namespaces'] ?? [];
  const kv = kvNamespaces.find(namespace => namespace.binding === binding);
  const namespaceId = process.env.NODE_ENV === 'production' ? kv?.id : kv?.preview_id;

  console.log(`Updating KV with binding "${binding}" for account "${accountId}" and namespace "${namespaceId}"`);

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/bulk`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
    },
    body: JSON.stringify(entries),
  });
  const result = await response.text();

  console.log(`Update finish with status ${response.status} and result ${result}`);
}

await main('content', 'Content');
