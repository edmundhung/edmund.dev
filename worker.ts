import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
} from "@cloudflare/kv-asset-handler";
import { createRequestHandler, ServerBuild } from "@remix-run/node";
import build from "./build/index.js";

async function handleAsset(event: FetchEvent): Promise<Response | null> {
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
      return null;
    }

    console.log('handleAssetRequest throw error', error.message);
    throw error;
  }
};

function createEventHandler(build: ServerBuild): (event: FetchEvent) => void {
  const handleRequest = createRequestHandler({
    build,
    getLoadContext() {
      return {
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
    let response = await handleAsset(event);

    if (!response) {
      response = await handleRequest(event.request);
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
