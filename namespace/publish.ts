import TOML from '@iarna/toml';
import * as fs from 'fs/promises';

async function publish(binding: string, entries: any[]): Promise<void> {
  console.log('Reading wrangler.toml...');
  const wranglerTOML = await fs.readFile('../wrangler.toml');
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

export default publish;
