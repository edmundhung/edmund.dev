import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
} from "@cloudflare/kv-asset-handler";
import { createRequestHandler, ServerBuild } from "@remix-run/node";
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
        async list(category?: string) {
          const entries = [
          ];

          if (!category) {
            return entries;
          }

          return entries.filter(entry => entry.key.startsWith(`${category}/`));
        },
        async listPosts() {
          const result = await POSTS.list();

          return result.keys.map<[string, {}]>(key => [key.name, key.metadata]);
        },
        async getPost(slug) {
          const post = await POSTS.getWithMetadata(slug);

          if (post.value === null) {
            return null;
          }

          return post;
        },
      };
    }
  });

  const handleEvent = async (event: FetchEvent): Promise<Response> => {
    let response = await handleRequest(event.request);

    if (response.status === 404) {
      response = await handleAsset(event);
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
          })
        );
        return;
      }

      event.respondWith(new Response('Internal Error', { status: 500 }));
    };
  };
}

addEventListener('fetch', createEventHandler(build));
