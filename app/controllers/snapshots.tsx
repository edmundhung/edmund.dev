import type { BuildAction } from 'remix/fetch-router';
import { env } from 'cloudflare:workers';

import type { routes } from '../routes.ts';
import { Layout } from '../ui/layout.tsx';
import { render } from '../utils/render.tsx';

const snapshotsOrigin = 'https://snapshots.edmund.dev';

interface Snapshot {
  alt: string;
  key: string;
  url: string;
}

export const snapshots: BuildAction<'GET', typeof routes.snapshots> = {
  async handler({ request, url }) {
    return render(
      <SnapshotsPage
        pathname={url.pathname}
        snapshots={await getSnapshots()}
      />,
      request,
    );
  },
};

function SnapshotsPage() {
  return ({
    pathname,
    snapshots,
  }: {
    pathname: string;
    snapshots: Snapshot[];
  }) => (
    <Layout
      title="Snapshots"
      description="A quiet collection of photos Edmund Hung has taken over the years."
      pathname={pathname}
    >
      <section className="mb-16 mt-16 sm:mt-32">
        <div className="mx-auto flex w-full max-w-5xl flex-col px-4">
          <header className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Snapshots
            </h1>
            <p className="mt-4 text-base leading-8 text-zinc-600 sm:mt-6">
              A small collection of photos I&apos;ve taken along the way.
            </p>
          </header>
          <div className="snapshots-grid mt-12 sm:mt-16">
            {snapshots.map(snapshot => (
              <article key={snapshot.key} className="snapshots-grid-item">
                <img
                  alt={snapshot.alt}
                  className="block w-full rounded-2xl bg-zinc-100 ring-1 ring-black/10"
                  loading="lazy"
                  src={snapshot.url}
                />
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

async function getSnapshots(): Promise<Snapshot[]> {
  let objects: R2Object[] = [];
  let cursor: string | undefined;

  do {
    let result = await env.SNAPSHOTS.list({ cursor });
    objects.push(...result.objects);
    cursor = result.truncated ? result.cursor : undefined;
  } while (cursor);

  return objects
    .filter(object => isImageKey(object.key))
    .sort((left, right) => right.uploaded.valueOf() - left.uploaded.valueOf())
    .flatMap((object, index, array) => {
      if (index % 4 !== 0) return [];

      let group = array.slice(index, index + 4);

      for (
        let currentIndex = group.length - 1;
        currentIndex > 0;
        currentIndex--
      ) {
        let randomIndex = Math.floor(Math.random() * (currentIndex + 1));
        [group[currentIndex], group[randomIndex]] = [
          group[randomIndex],
          group[currentIndex],
        ];
      }

      return group;
    })
    .map(object => ({
      alt: toSnapshotAlt(object.key),
      key: object.key,
      url: `${snapshotsOrigin}/${object.key}`,
    }));
}

function isImageKey(key: string) {
  return /\.(avif|jpe?g|png|webp)$/i.test(key);
}

function toSnapshotAlt(key: string) {
  return key
    .replace(/\.[^.]+$/, '')
    .replace(/-v\d+$/i, '')
    .split('-')
    .map(segment => segment[0]?.toUpperCase() + segment.slice(1))
    .join(' ');
}
