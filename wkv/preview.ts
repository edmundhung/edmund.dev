import * as fs from 'fs/promises';
import { Miniflare } from 'miniflare';
import rimraf from 'rimraf';

async function preview(source: string, binding: string): Promise<void> {
  console.log('[wkv] Empty ./.mf/kv');
  rimraf.sync('./.mf/kv');
  console.log('[wkv] Cleanup done');

  console.log('[wkv] Persisting KV on Miniflare');

  const mf = new Miniflare({
    script: `addEventListener("fetch", () => {});`,
    buildCommand: '',
    kvPersist: true,
  });

  const content = await fs.readFile(source, 'utf-8');
  const namespace = await mf.getKVNamespace(binding);

  const entries = JSON.parse(content);

  if (!Array.isArray(entries)) {
    throw new Error('[wkv] source json must be an array');
  }

  await Promise.all(
    entries.map(entry =>
      namespace.put(entry.key, entry.value, { metadata: entry.metadata }),
    ),
  );
  console.log('[wkv] KV persisted on Miniflare');
}

export default preview;
