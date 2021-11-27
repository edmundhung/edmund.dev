import { createEventHandler } from './adapter';
import query from './query';
import * as build from '../build/index.js';

const handleEvent = createEventHandler({
  build,
  getLoadContext() {
    return {
      query,
    };
  },
  getCache() {
    return caches.open(process.env.VERSION);
  },
});

addEventListener('fetch', handleEvent);
