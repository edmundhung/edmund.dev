import { createQuery, SetupQueryFunction } from '@workaholic/core';

let setupQuery: SetupQueryFunction = () => {
  const extensionByMimeType = {
    'image/avif': 'avif',
    'image/webp': 'webp',
  };

  function normalise(tag: string): string {
    return tag.toLowerCase().replace(/\s/g, '-');
  }

  return query =>
    async (namespace: string, slug: string, options?: Record<string, any>) => {
      switch (namespace) {
        case 'data': {
          const { value, metadata } = await query(namespace, slug, {
            type: 'text',
            metadata: true,
          });

          if (value === null && metadata === null) {
            return null;
          }

          return {
            content: value,
            metadata,
          };
        }
        case 'images': {
          const [mimeType, extension] = Object.entries(
            extensionByMimeType,
          ).find(([mimeType]) => options?.accept.includes(mimeType)) ?? [
            'image/jpeg',
            'jpg',
          ];
          const data = await query(namespace, `${slug}.${extension}`, {
            type: 'stream',
          });

          if (!data) {
            return null;
          }

          return {
            data,
            mimeType,
          };
        }
        case 'list': {
          const references = await query(namespace, slug, { type: 'json' });

          if (!references) {
            return null;
          }

          return references;
        }
        case 'tags': {
          const dictionary = await query(namespace, 'data', { type: 'json' });
          const references = dictionary[normalise(slug)] ?? [];

          return references;
        }
        default:
          throw new Error(`Unknwon namespace found; Recevied: ${namespace}`);
      }
    };
};

export default createQuery(Content, setupQuery());
