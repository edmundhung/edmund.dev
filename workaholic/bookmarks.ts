import type { Entry, Build } from '@workaholic/core';

const keys = ['bookmarks', 'projects', 'snapshots'];

export function setupBuild(): Build {
  return {
    async transform(entry: Entry): Entry[] {
      const isBookmarks = keys.some(key => entry.key === `${key}.json`);

      if (!isBookmarks) {
        return entry;
      }

      const value = JSON.parse(entry.value);
      console.log(entry.key, value);

      const entries = Object.entries(value).map(([slug, metadata]) => ({
        key: entry.key.replace(/\.json$/, `/${slug}.md`),
        value: '',
        metadata,
      }));

      return entries;
    },
  };
}
