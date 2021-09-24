import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
} from '@cloudflare/kv-asset-handler';
import type { ServerBuild } from 'remix';
import { createRequestHandler } from './remix-cloudflare-workers';
import * as build from '../build/index.js';

async function handleAsset(event: FetchEvent): Promise<Response> {
  try {
    if (process.env.NODE_ENV === 'development') {
      return await getAssetFromKV(event, {
        cacheControl: {
          bypassCache: true,
        },
      });
    }

    return await getAssetFromKV(event, {
      cacheControl: {
        browserTTL: 365 * 60 * 60 * 24,
        edgeTTL: 365 * 60 * 60 * 24,
      },
    });
  } catch (error) {
    if (
      error instanceof MethodNotAllowedError ||
      error instanceof NotFoundError
    ) {
      return new Response('Not Found', { status: 404 });
    }

    throw error;
  }
}

const orders = [
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

function createEventHandler(build: ServerBuild): (event: FetchEvent) => void {
  const handleRequest = createRequestHandler({
    build,
    getLoadContext() {
      return {
        async listContent(category?: string, cursor?: string) {
          const result = await Content.list({
            prefix: category ? `${category}/` : '',
            cursor,
          });

          return [
            result.keys.sort(
              (prev, next) =>
                orders.indexOf(prev.name) - orders.indexOf(next.name),
            ),
            !result.list_complete ? result.cursor : null,
          ];
        },
        async getContent(category: string, slug: string) {
          const content = await Content.getWithMetadata(`${category}/${slug}`);

          return [content.value, content.metadata];
        },
      };
    },
  });

  const handleEvent = async (
    event: FetchEvent,
    cache: Cache,
  ): Promise<Response> => {
    let response = await handleAsset(event);

    if (response.status === 404) {
      response = await cache.match(event.request);

      if (!response) {
        response = await handleRequest(event.request);
        event.waitUntil(cache.put(event.request, response.clone()));
      }
    }

    return response;
  };

  return (event: FetchEvent): void => {
    try {
      event.respondWith(handleEvent(event, caches.default));
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        event.respondWith(
          new Response(e.message || e.toString(), {
            status: 500,
          }),
        );
        return;
      }

      event.respondWith(new Response('Internal Error', { status: 500 }));
    }
  };
}

addEventListener('fetch', createEventHandler(build));
