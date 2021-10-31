import type { Entry, Build } from '@workaholic/core';
import { getLinkPreview } from 'link-preview-js';

async function getPreviewMetadata(url: string): Promise<any> {
  const preview = (await getLinkPreview(url)) as any;

  switch (preview.siteName) {
    case 'Flickr':
      return {
        title: preview.title,
        image: preview.images[0],
      };
    case 'GitHub':
      return {
        image: preview.images[0],
      };
    default:
      return {
        title: preview.title,
        description: preview.description,
        image: preview.images[0],
      };
  }
}

export async function setupBuild(options?: { key: string }): Build {
  return {
    async transform(entry: Entry): Promise<Entry> {
      if (typeof entry.metadata?.[options?.key] === 'undefined') {
        return entry;
      }

      const preview = await getPreviewMetadata(entry.metadata[options?.key]);
      const updated: Entry = {
        ...entry,
        metadata: {
          ...entry.metadata,
          ...preview,
        },
      };

      return updated;
    },
  };
}
