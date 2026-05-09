import type { BuildAction } from 'remix/fetch-router';

import { getPosts } from '../data/blog.server.ts';
import type { routes } from '../routes.ts';

export const rss: BuildAction<'GET', typeof routes.rss> = {
  async handler({ request }) {
    let url = new URL(request.url);
    let posts = await getPosts();
    let entries = posts
      .map(post =>
        `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <link>${url.origin}/blog/${post.slug}</link>
          <guid>${url.origin}/blog/${post.slug}</guid>
        </item>`.trim(),
      )
      .join('\n');

    let body = `
      <?xml version="1.0" encoding="utf-8"?>
      <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
          <title>Edmund's Blog</title>
          <description>Thoughts on web standards, practice, tips, and more.</description>
          <link>${url.origin}/blog</link>
          <language>en-us</language>
          <generator>edmundhung</generator>
          <ttl>60</ttl>
          <atom:link href="${url.origin}/rss.xml" rel="self" type="application/rss+xml" />
          ${entries}
        </channel>
      </rss>
    `.trim();

    return new Response(body, {
      headers: {
        'Content-Length': String(new TextEncoder().encode(body).length),
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  },
};
