import type { BuildAction } from 'remix/fetch-router';

import { getPosts } from '../data/blog.server.ts';
import type { routes } from '../routes.ts';

interface SitemapEntry {
  changefreq?: 'monthly' | 'weekly';
  lastmod?: string;
  loc: string;
  priority?: number;
}

export const sitemap: BuildAction<'GET', typeof routes.sitemap> = {
  async handler({ request }) {
    let url = new URL(request.url);
    let posts = await getPosts();
    let entries: SitemapEntry[] = [
      { changefreq: 'weekly', loc: url.origin, priority: 1 },
      { changefreq: 'monthly', loc: `${url.origin}/about`, priority: 0.5 },
      { changefreq: 'weekly', loc: `${url.origin}/blog`, priority: 0.8 },
      ...posts.map(post => ({
        changefreq: 'weekly' as const,
        lastmod: post.date,
        loc: `${url.origin}/blog/${post.slug}`,
        priority: 0.7,
      })),
    ];

    let body = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${entries
          .map(entry =>
            `
              <url>
                <loc>${entry.loc}</loc>
                ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
                ${
                  entry.changefreq
                    ? `<changefreq>${entry.changefreq}</changefreq>`
                    : ''
                }
                ${
                  entry.priority ? `<priority>${entry.priority}</priority>` : ''
                }
              </url>`.trim(),
          )
          .join('\n')}
      </urlset>
    `.trim();

    return new Response(body, {
      headers: {
        'Content-Length': String(new TextEncoder().encode(body).length),
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  },
};
