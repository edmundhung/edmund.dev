import { type HtmlMetaDescriptor } from '@remix-run/cloudflare';

interface MetaOptions {
  title?: string;
  description: string;
  url?: string;
  image?: string;
}

export function generateMetaDescriptor(
  options: MetaOptions,
): HtmlMetaDescriptor {
  const entries = Object.entries({
    'title': options.title ?? 'Edmund.dev',
    'og:title': options.title,
    'og:description': options.description,
    'og:image': options.image,
    'og:type': 'website',
    'og:site_name': 'Edmund.dev',
    'og:url': `https://edmund.dev${options.url}`,
    'twitter:card': 'summary',
    'twitter:site': '@_edmundhung',
    'twitter:title': options.title,
    'twitter:description': options.description,
    'twitter:image': options.image,
  }).filter(
    ([key, value]) => typeof value !== 'undefined' && value.trim() !== '',
  );

  return Object.fromEntries(entries);
}
