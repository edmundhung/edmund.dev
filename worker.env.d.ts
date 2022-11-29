/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare" />
/// <reference types="@cloudflare/workers-types" />

import '@remix-run/server-runtime';
import type GitHubService from 'worker/github';

// Required by the worker adapter
declare module '__STATIC_CONTENT_MANIFEST' {
  const value: string;
  export default value;
}

interface Env {
  // Required by the worker adapter
  __STATIC_CONTENT: string;

  // Custom env
  CACHE: KVNamespace;
}

declare module '@remix-run/server-runtime' {
  interface AppLoadContext {
    github: GitHubService;
    env: Env;
    ctx: ExecutionContext;
  }
}
