import type { Env } from 'worker.env';
import * as build from '../build/index.js';
import { createRequestHandler, handleAsset } from './adapter';
import GitHubService from './github.js';

const handleRequest = createRequestHandler<Env>({
  build,
  getLoadContext(request, env, ctx) {
    return {
      github: new GitHubService({
        owner: 'edmundhung',
        repo: 'blog',
        env,
        ctx,
      }),
      env,
      ctx,
    };
  },
});

const worker: ExportedHandler<Env> = {
  async fetch(request, env, ctx): Promise<Response> {
    try {
      let response = await handleAsset(request, env, ctx);

      if (response.status === 404) {
        response = await handleRequest(request, env, ctx);
      }

      return response;
    } catch (exception) {
      if (process.env.NODE_ENV === 'development') {
        return new Response(`${exception}`, { status: 500 });
      }

      return new Response('Internal Server Error', { status: 500 });
    }
  },
};

export default worker;
