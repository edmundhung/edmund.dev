import type { LoaderArgs } from '@remix-run/cloudflare';

interface FeedEntry {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
}

export async function loader({ request, context }: LoaderArgs) {
  const url = new URL(request.url);
  const posts = await context.github.getPosts();
  const entries = posts.map<FeedEntry>(post => ({
    title: post.title,
    pubDate: new Date(post.date).toUTCString(),
    guid: `${url.origin}/blog/${post.slug}`,
    link: `${url.origin}/blog/${post.slug}`,
  }));

  const rss = `
        <?xml version="1.0" encoding="utf-8"?>
        <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
            <channel>
                <title>Edmund's Blog</title>
                <description>All of my thoughts on web standard, practice, tips and more, collected in chronological order.</description>
                <link>${url.origin}/blog</link>
                <language>en-us</language>
				<generator>edmundhung</generator>
                <ttl>60</ttl>
                <atom:link href="${
                  url.origin
                }/rss.xml" rel="self" type="application/rss+xml" />
                ${entries
                  .map(entry =>
                    `
					<item>
						<title><![CDATA[${entry.title}]]></title>
						<pubDate>${entry.pubDate}</pubDate>
						<link>${entry.link}</link>
						<guid>${entry.guid}</guid>
					</item>
				`.trim(),
                  )
                  .join('\n')}
            </channel>
        </rss>
    `.trim();

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Content-Length': String(new TextEncoder().encode(rss).length),
    },
  });
}
