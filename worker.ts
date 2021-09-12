import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
} from "@cloudflare/kv-asset-handler";
import type { ServerBuild } from "remix";
import { createRequestHandler } from "./remix-cloudflare-workers";
import build from "./build/index.js";

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
    if (error instanceof MethodNotAllowedError || error instanceof NotFoundError) {
      return new Response('Not Found', { status: 404 });
    }

    throw error;
  }
};

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

          return [result.keys, !result.list_complete ? result.cursor : null];
        },
        async getContent(category: string, slug: string) {
          const content = await Content.getWithMetadata(`${category}/${slug}`);

          return [content.value, content.metadata];
        },
      };
    }
  });

  const handleEvent = async (event: FetchEvent, cache: Cache): Promise<Response> => {
    let response = await handleAsset(event);

    if (response.status === 404) {
      response = await cache.match(event.request);

      if (!response) {
        response = handleRequest(event.request);
        event.waitUntil(cache.put(event.request, response));
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
          })
        );
        return;
      }

      event.respondWith(new Response('Internal Error', { status: 500 }));
    };
  };
}

addEventListener('fetch', createEventHandler(build));
