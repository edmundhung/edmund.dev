// Required for installGlobals();
import '@remix-run/cloudflare-pages';

// Required for custom adapters
import type {
  AppLoadContext,
  ServerBuild,
  ServerPlatform,
} from '@remix-run/server-runtime';
import { createRequestHandler as createRemixRequestHandler } from '@remix-run/server-runtime';

export interface GetLoadContextFunction<Env = unknown> {
  (request: Request, env: Env, ctx: ExecutionContext): AppLoadContext;
}

export type RequestHandler = ReturnType<typeof createRequestHandler>;

export function createRequestHandler<Env>({
  build,
  getLoadContext,
  mode,
}: {
  build: ServerBuild;
  getLoadContext?: GetLoadContextFunction<Env>;
  mode?: string;
}): ExportedHandlerFetchHandler<Env> {
  let platform: ServerPlatform = {};
  let handleRequest = createRemixRequestHandler(build, platform, mode);

  return (request: Request, env: Env, ctx: ExecutionContext) => {
    let loadContext =
      typeof getLoadContext === 'function'
        ? getLoadContext(request, env, ctx)
        : undefined;

    return handleRequest(request, loadContext);
  };
}

export function createFetchHandler<Env>({
  build,
  getCache,
  getLoadContext,
  handleAsset,
  mode,
}: {
  build: ServerBuild;
  getCache?: () => Promise<Cache>;
  getLoadContext?: GetLoadContextFunction<Env>;
  handleAsset: (
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ) => Promise<Response>;
  mode?: string;
}): ExportedHandlerFetchHandler<Env> {
  const handleRequest = createRequestHandler<Env>({
    build,
    getLoadContext,
    mode,
  });

  return async (request: Request, env: Env, ctx: ExecutionContext) => {
    try {
      let isHeadOrGetRequest =
        request.method === 'HEAD' || request.method === 'GET';
      let cache = await getCache?.();
      let response: Response | undefined;

      if (isHeadOrGetRequest) {
        response = await handleAsset(request.clone(), env, ctx);
      }

      if (response?.ok) {
        return response;
      }

      if (cache && isHeadOrGetRequest) {
        response = await cache?.match(request);
      }

      if (!response || !response.ok) {
        response = await handleRequest(request, env, ctx);
      }

      if (cache && isHeadOrGetRequest && response.ok) {
        ctx.waitUntil(cache?.put(request, response.clone()));
      }

      return response;
    } catch (e: any) {
      console.log('Error caught', e.message, e);

      if (process.env.NODE_ENV === 'development' && e instanceof Error) {
        return new Response(e.message || e.toString(), {
          status: 500,
        });
      }

      return new Response(`Error: ${e.toString()}`, { status: 200 });
    }
  };
}

export function createPageAssetHandler() {
  async function handleAsset<Env>(
    request: Request,
    env: Env,
  ): Promise<Response> {
    if (process.env.NODE_ENV === 'development') {
      request.headers.delete('if-none-match');
    }

    let response = await (env as any).ASSETS.fetch(request.url, request);

    if (process.env.NODE_ENV === 'development') {
      response = new Response(response.body, response);
    }

    return response;
  }

  return handleAsset;
}
