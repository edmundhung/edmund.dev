import type {
  Entry,
  SetupBuildFunction,
  SetupQueryFunction,
} from '@workaholic/core';

function normalise(tag: string): string {
  return tag.toLowerCase().replace(/\s/g, '-');
}

export const setupBuild: SetupBuildFunction = (options?: { key: string }) => {
  return {
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
};

export const setupQuery: SetupQueryFunction = () => {
  return kvNamespace => async (namespace: string, tag: string) => {
    const dictionary = await kvNamespace.get(`${namespace}/`, 'json');
    const references = dictionary[normalise(tag)] ?? [];

    return references;
  };
};
