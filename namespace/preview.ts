import { Miniflare } from 'miniflare';

export async function preview(binding: string, entries: any[]): Promise<void> {
  console.log('Persisting KV on Miniflare');
  const mf = new Miniflare({
    script: `addEventListener("fetch", () => {});`,
    buildCommand: '',
    kvPersist: true,
  });
  const namespace = await mf.getKVNamespace(binding);

  await Promise.all(
    entries.map(entry =>
      namespace.put(entry.key, entry.value, { metadata: entry.metadata }),
    ),
  );
  console.log('KV persisted on Miniflare');
}
