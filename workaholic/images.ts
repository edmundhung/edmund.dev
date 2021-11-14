import type { Entry, Build } from '@workaholic/core';
import { ImagePool } from '@squoosh/lib';
import { cpus } from 'os';
import fetch, { Response } from 'cross-fetch';

function getImageExtension(response: Response): string {
  let extension = response.url.slice(response.url.lastIndexOf('.'));

  if (!extensions.includes(extension)) {
    const contentType = response.headers.get('content-type');

    if (!contentType || !/images*\//.test(contentType)) {
      throw new Error(
        `[plugin-images] Unknown image content-type (${contentType}) from ${response.url}`,
      );
    }

    extension = contentType.replace(/images*\//, '.');
  }

  return extension;
}

async function downloadImage(url: string, filename: string): Promise<Entry> {
  const response = await fetch(url);
  const image = await response.arrayBuffer();
  const extension = getImageExtension(response);

  return {
    key: `${filename}${extension}`,
    value: Buffer.from(image).toString('base64'),
    base64: true,
  };
}

let extensions = ['.jpg', '.png', '.webp', '.avif'];

export function setupBuild(): Build {
  const preprocessOptions = {
    resize: {
      enabled: true,
      width: 500,
    },
  };
  const encodeOptions = {
    avif: 'auto',
    webp: 'auto',
    mozjpeg: 'auto',
  };

  return {
    async transform(entry: Entry): Promise<Entry[]> {
      if (
        !entry.key.endsWith('.md') ||
        typeof entry.metadata?.image === 'undefined'
      ) {
        return [entry];
      }

      const key = entry.key.replace(/\.md$/, '');
      const image = await downloadImage(entry.metadata.image, key);

      return [
        {
          ...entry,
          metadata: {
            ...entry.metadata,
            image: `/images/${key}`,
          },
        },
        image,
      ];
    },
    async index(entries: Entry[]): Entry[] {
      const imagePool = new ImagePool(cpus().length);
      const files = entries.filter(entry =>
        extensions.some(extension => entry.key.endsWith(extension)),
      );
      const images = await Promise.all(
        files.map(async file => {
          const image = imagePool.ingestImage(
            Buffer.from(file.value, 'base64'),
          );

          await image.decoded;
          await image.preprocess(preprocessOptions);
          await image.encode(encodeOptions);
          const encodedImages = await Promise.all(
            Object.values(image.encodedWith),
          );
          const result = encodedImages.map(encodedImage => {
            return {
              key: `${file.key.slice(0, file.key.lastIndexOf('.'))}.${
                encodedImage.extension
              }`,
              value: Buffer.from(encodedImage.binary).toString('base64'),
              base64: true,
            };
          });

          return result;
        }),
      );

      await imagePool.close();

      return images.flat();
    },
  };
}
