import type { Entry, Build, Query } from '@workaholic/core';

function normalise(tag: string): string {
  return tag.toLowerCase().replace(/\s/g, '-');
}

export async function setupBuild(options?: { key: string }): Build {
  return {
    namespace: 'tags',
    async index(entries: Entry[]): Entry[] {
      const dictionary = {};

      for (const entry of entries) {
        const tags = entry.metadata?.[options?.key ?? 'tags'];

        if (typeof tags === 'undefined') {
          continue;
        }

        const reference = {
          slug: entry.key,
          metadata: entry.metadata,
        };

        for (const tag of [].concat(tags).map(normalise)) {
          dictionary[tag] = [].concat(dictionary[tag] ?? [], reference);
        }
      }

      return [
        {
          key: '',
          value: JSON.stringify(dictionary),
        },
      ];
    },
  };
}

export function setupQuery(): Query {
  return {
    namespace: 'tags',
    handlerFactory: kvNamespace => async (tag: string) => {
      const dictionary = await kvNamespace.get(`tags/`, 'json');
      const references = dictionary[normalise(tag)] ?? [];

      return references;
    },
  };
}
