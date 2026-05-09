import { run } from 'remix/ui';

import './app/styles/global.css';

const clientModules = import.meta.glob('/app/**/*.client.{ts,tsx}');

run({
  async loadModule(moduleUrl, exportName) {
    let load = clientModules[moduleUrl];

    if (!load) {
      throw new Error(`Unknown client entry module: ${moduleUrl}`);
    }

    let mod = await load();

    if (!mod || typeof mod !== 'object') {
      throw new Error(`Invalid client entry module: ${moduleUrl}`);
    }

    let entry = Reflect.get(mod, exportName);

    if (typeof entry !== 'function') {
      throw new Error(
        `Missing client entry export ${exportName} in ${moduleUrl}`,
      );
    }

    return entry;
  },
  async resolveFrame(src, signal, target) {
    let headers = new Headers({ accept: 'text/html' });
    if (target) headers.set('x-remix-target', target);

    let response = await fetch(src, {
      credentials: 'same-origin',
      headers,
      signal,
    });

    return response.body ?? response.text();
  },
});
