import type { MetaFunction } from 'remix';
import type { Metadata } from '~/types';

function clearMeta(meta: Record<string, string>): Record<string, string> {
  const entries = Object.entries(meta).filter(
    ([key, value]) => typeof value !== 'undefined' && value.trim() !== '',
  );

  return Object.fromEntries(entries);
}

export function deriveMetaFromMetadata(
  metadata: Metadata,
): Record<string, string> {
  return clearMeta({
    title: metadata.title,
    description: metadata.description,
    image: metadata.image,
    author: metadata.author,
    keywords: metadata.tags?.join(','),
  });
}

interface EnhanceMetaOptions {
  siteName: string;
  baseURL: string;
  pathname: string;
  author: string;
  type: string;
  twitterCard: string;
  twitterSite: string;
}

export function createMetaEnhancer(
  defaultOptions: Omit<EnhanceMetaOptions, 'pathname'>,
) {
  return (
    meta: Record<string, string>,
    options: Partial<EnhanceMetaOptions> = {},
  ): Record<string, string> => {
    const {
      siteName,
      baseURL,
      pathname,
      author,
      type,
      twitterCard,
      twitterSite,
    } = { ...defaultOptions, ...options };

    const title = meta.title ? `${meta.title} - ${siteName}` : siteName;
    const url = pathname === '/' ? baseURL : `${baseURL}${pathname}`;

    return clearMeta({
      ...meta,
      'author': meta.author ?? author,
      'og:title': title,
      'og:description': meta.description,
      'og:image': meta.image,
      'og:type': type,
      'og:site_name': siteName,
      'og:url': url,
      'twitter:card': twitterCard,
      'twitter:site': twitterSite,
      'twitter:title': title,
      'twitter:description': meta.description,
      'twitter:image': meta.image,
    });
  };
}

export const enhanceMeta = createMetaEnhancer({
  siteName: 'Edmund.dev',
  baseURL: 'https://edmund.dev',
  author: 'Edmund Hung',
  type: 'website',
  twitterCard: 'summary',
  twitterSite: '@ed____hung',
});
