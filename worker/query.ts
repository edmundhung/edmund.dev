import { createQuery, SetupQueryFunction } from '@workaholic/core';
import { setupQuery as setupListQuery } from '@workaholic/core/dist/plugins/plugin-list';
import { setupQuery as setupTagQuery } from '../workaholic/tags';
import { setupQuery as setupDataQuery } from '../workaholic/data';

const setupImageQuery: SetupQueryFunction = () => {
  const extensionByMimeType = {
    'image/avif': 'avif',
    'image/webp': 'webp',
  };

  return kvNamespace =>
    async (namespace, slug, { accept }) => {
      const [mimeType, extension] = Object.entries(extensionByMimeType).find(
        ([mimeType]) => accept.includes(mimeType),
      ) ?? ['image/jpeg', 'jpg'];
      const data = await kvNamespace.get(
        `${namespace}/${slug}.${extension}`,
        'stream',
      );

      if (!data) {
        return null;
      }

      return {
        data,
        mimeType,
      };
    };
};

const query = createQuery(Content, [
  { namespace: 'data', handlerFactory: setupDataQuery() },
  { namespace: 'list', handlerFactory: setupListQuery() },
  { namespace: 'tags', handlerFactory: setupTagQuery() },
  { namespace: 'images', handlerFactory: setupImageQuery() },
]);

export default query;
