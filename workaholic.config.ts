import type { Entry, SetupBuildFunction } from '@workaholic/core';
import yaml from 'js-yaml';
import Fuse from 'fuse.js';
import matter from 'gray-matter';
import { getLinkPreview } from 'link-preview-js';
import { ImagePool } from '@squoosh/lib';
import { cpus } from 'os';
import fetch, { Response } from 'cross-fetch';

export let setupBuild: SetupBuildFunction = () => {
  const extensions = ['.jpg', '.png', '.webp', '.avif'];
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

  async function getPreviewMetadata(url: string): Promise<any> {
    const preview = (await getLinkPreview(url)) as any;

    switch (preview.siteName) {
      case 'Flickr':
        return {
          title: preview.title,
          image: preview.images[0],
        };
      case 'GitHub': {
        const [repo, description] = preview.title
          .replace('GitHub - ', '')
          .split(':');

        return {
          description,
        };
      }
      default:
        return {
          title: preview.title,
          description: preview.description,
        };
    }
  }

  function normalise(tag: string): string {
    return tag.toLowerCase().replace(/\s/g, '-');
  }

  async function downloadImage(entry: Entry): Promise<Entry | null> {
    if (typeof entry.metadata?.image === 'undefined') {
      return null;
    }

    const response = await fetch(entry.metadata.image);
    const image = await response.arrayBuffer();
    let extension = response.url.slice(response.url.lastIndexOf('.'));

    if (!extensions.includes(extension)) {
      const contentType = response.headers.get('content-type');

      if (!contentType || !/images*\//.test(contentType)) {
        throw new Error(
          `Unknown image content-type (${contentType}) from ${response.url}`,
        );
      }

      extension = contentType.replace(/images*\//, '.');
    }

    return {
      key: `${entry.key.replace(/\//g, '-')}${extension}`,
      value: Buffer.from(image).toString('base64'),
      base64: true,
    };
  }

  async function createImagePreviews(entries: Entry[]) {
    const result = await Promise.all(
      entries.map(async entry => {
        let image = await downloadImage(entry);

        return {
          data: !image
            ? entry
            : {
                ...entry,
                metadata: {
                  ...entry.metadata,
                  image: `/images/${entry.key.replace(/\//g, '-')}`,
                },
              },
          image,
        };
      }),
    );

    return {
      data: result.map(item => item.data),
      images: result.map(item => item.image).filter(image => image !== null),
    };
  }

  function createListEntries(entries: Entry[]): Entry[] {
    let referencesByKey: Record<string, Reference[]> = {};

    for (const entry of entries) {
      let key = entry.key;

      while (key !== '') {
        key = key.includes('/') ? key.slice(0, key.lastIndexOf('/')) : '';

        if (typeof referencesByKey[key] === 'undefined') {
          referencesByKey[key] = [];
        }

        referencesByKey[key].push({
          slug: entry.key,
          metadata: entry.metadata ?? null,
        });
      }
    }

    return Object.entries(referencesByKey).map(([key, references]) => ({
      key,
      value: JSON.stringify(
        references.sort(
          (prev, next) =>
            (next.metadata?.date ?? 0) - (prev.metadata?.date ?? 0),
        ),
      ),
    }));
  }

  function createTagEntries(entries: Entry[]): Entry[] {
    const dictionary = {};

    for (const entry of entries) {
      if (typeof entry.metadata?.tags === 'undefined') {
        continue;
      }

      const reference = {
        slug: entry.key,
        metadata: entry.metadata,
      };

      for (const tag of [].concat(entry.metadata.tags).map(normalise)) {
        dictionary[tag] = [].concat(dictionary[tag] ?? [], reference);
      }
    }

    return [
      {
        key: 'data',
        value: JSON.stringify(dictionary),
      },
    ];
  }

  async function formatImages(files: Entry[]): Promise<Entry[]> {
    const imagePool = new ImagePool(cpus().length);

    let result = [];

    try {
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

      result = images.flat();
    } catch (e) {
      console.log(`Error caught when processing images; ${e.message}`);
    } finally {
      await imagePool.close();
    }

    return result;
  }

  return async (entries: Entry[]): Record<string, Entry[]> => {
    const items = await Promise.all(
      entries
        .flatMap<Entry>(entry => {
          if (entry.key.startsWith('articles/')) {
            const { content, data } = matter(
              Buffer.from(entry.value).toString('utf-8'),
            );

            return [
              {
                key: entry.key.replace(/\.md$/, ''),
                value: content,
                metadata: data,
              },
            ];
          }

          const key = entry.key.replace(/.yml$/, '');
          const data = yaml.load(Buffer.from(entry.value).toString('utf-8'));
          const list = Object.entries(data).map(([slug, details]) => ({
            key: `${key}/${slug}`,
            value: '',
            metadata: details,
          }));

          return list;
        })
        .map<Entry>(async entry => {
          if (typeof entry.metadata?.url === 'undefined') {
            return entry;
          }

          const preview = await getPreviewMetadata(entry.metadata.url);
          const updated: Entry = {
            ...entry,
            metadata: {
              ...entry.metadata,
              ...preview,
            },
          };

          return updated;
        }),
    );

    const { data, images } = await createImagePreviews(items);

    return {
      data,
      images: await formatImages(images),
      list: createListEntries(data),
      tags: createTagEntries(data),
    };
  };
};
