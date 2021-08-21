import {
  getAssetFromKV,
  MethodNotAllowedError,
  NotFoundError,
} from "@cloudflare/kv-asset-handler";
import {
  createRequestHandler as createNodeRequestHandler,
  ServerBuild,
  Request as NodeRequest,
} from "@remix-run/node";

async function handleAsset(event: FetchEvent, mode: string): Promise<Response | null> {
  try {
    if (mode === 'development') {
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

function createRequestHandler(build: ServerBuild, mode?: string): (request: Request, loadContext?: any) => Promise<Response> {
  const handleNodeRequest = createNodeRequestHandler(build, mode);

  return async (request: Request, loadContext?: any) => {
    const nodeRequest: NodeRequest = request as any;
    const nodeResponse = await handleNodeRequest(nodeRequest, loadContext);

    return nodeResponse as any;
  };
}

function createEventHandler(build: ServerBuild, mode?: string): (event: FetchEvent, loadContext?: any) => Promise<Response> {
  const handleRequest = createRequestHandler(build, mode);

  return async (event: FetchEvent, loadContext?: any): Promise<Response> => {
    let response = await handleAsset(event, mode);

    if (!response) {
      response = await handleRequest(event.request, loadContext);
    }

    return response;
  };
}

export function createEventListener({
  build,
  getLoadContext,
  mode = process.env.NODE_ENV,
}: {
  build: ServerBuild;
  getLoadContext?: (event: FetchEvent) => {};
  mode?: string;
}): (event: FetchEvent) => void {
  const handleEvent = createEventHandler(build, mode);

  return (event: FetchEvent) => {
    try {
      event.respondWith(handleEvent(event, getLoadContext?.(event)));
    } catch (e) {
      if (mode === "development") {
        event.respondWith(
          new Response(e.message || e.toString(), {
            status: 500,
          })
        );
        return;
      }

      event.respondWith(new Response("Internal Error", { status: 500 }));
    }
  };
};
