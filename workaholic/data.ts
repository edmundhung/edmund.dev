import type {
  Entry,
  SetupBuildFunction,
  SetupQueryFunction,
} from '@workaholic/core';

export const setupBuild: SetupBuildFunction = (options?: { key: string }) => {
  return {
    async index(entries: Entry[]): Entry[] {
      return entries.filter(entry => entry.key.endsWith('.md'));
    },
  };
};

export const setupQuery: SetupQueryFunction = () => {
  return kvNamespace => async (namespace: string, slug: string) => {
    const { value, metadata } = await kvNamespace.getWithMetadata(
      `${namespace}/${slug}.md`,
      'text',
    );

    if (value === null && metadata === null) {
      return null;
    }

    return {
      content: value,
      metadata,
    };
  };
};
