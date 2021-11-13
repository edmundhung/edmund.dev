import type { Entry, Build } from '@workaholic/core';
import * as plugin from '@workaholic/core/dist/plugins/plugin-list';

const orders = [
  'bookmarks/dan-abramov-goodbye-clean-code',
  'articles/setting-up-a-global-loading-indicator-in-remix',
  'bookmarks/swyx-client-server-battle',
  'snapshots/the-bridge',
  'projects/remix-sandbox',
  'articles/deploying-remix-app-on-cloudflare-workers',
  'snapshots/maple-tree',
  'projects/remix-worker-template',
  'snapshots/childhood',
  'bookmarks/kentcdodds-testing-implementation-details',
  'projects/maildog',
  'snapshots/quokka-at-rottnest-island',
  'bookmarks/pomb-us-build-your-own-react',
  'snapshots/bondi-beach',
];

export function setupBuild(): Build {
  const build = plugin.setupBuild();

  return {
    ...build,
    async index(entries: Entry[]): Promise<Entry[]> {
      const list = await build.index(
        entries
          .filter(entry => entry.key.endsWith('.md'))
          .map(entry => ({ ...entry, key: entry.key.replace(/.md$/, '') })),
      );
      const result = list.map(entry => {
        const references = JSON.parse(entry.value);

        return {
          ...entry,
          value: JSON.stringify(
            references.sort(
              (prev, next) =>
                orders.indexOf(prev.slug) - orders.indexOf(next.slug),
            ),
          ),
        };
      });

      return result;
    },
  };
}

export const setupQuery = plugin.setupQuery;
