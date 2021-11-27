import type { GetLoadContextFunction } from '@remix-run/cloudflare-workers';
import {
  createRequestHandler,
  handleAsset,
} from '@remix-run/cloudflare-workers';

export function createEventHandler({
  build,
  getLoadContext,
  getCache,
}: {
  build: ServerBuild;
  getLoadContext: GetLoadContextFunction;
  getCache: Promise<Cache>;
}): (event: FetchEvent) => void {
  const handleRequest = createRequestHandler({
    build,
    getLoadContext,
  });

  const handleEvent = async (event: FetchEvent): Promise<Response> => {
    let cache = await getCache();
    let isHeadOrGetRequest =
      event.request.method === 'HEAD' || event.request.method === 'GET';
    let response;

    if (isHeadOrGetRequest) {
      response = await handleAsset(event, build);
    }

    if (!response) {
      if (isHeadOrGetRequest) {
        response = await cache.match(event.request);
      }

      if (!response) {
        response = await handleRequest(event);
      }

      if (isHeadOrGetRequest) {
        event.waitUntil(cache.put(event.request, response.clone()));
      }
    }

    return response;
  };

  return (event: FetchEvent): void => {
    try {
      event.respondWith(handleEvent(event));
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
