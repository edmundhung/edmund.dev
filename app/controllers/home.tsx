import type { BuildAction } from 'remix/fetch-router';

import type { BlogPostMetadata } from '../data/blog.server.ts';
import { getPosts } from '../data/blog.server.ts';
import { routes } from '../routes.ts';
import { Layout } from '../ui/layout.tsx';
import { render } from '../utils/render.tsx';

export const home: BuildAction<'GET', typeof routes.home> = {
  async handler({ request, url }) {
    let posts = (await getPosts()).slice(0, 5);
    return render(<HomePage pathname={url.pathname} posts={posts} />, request);
  },
};

function HomePage() {
  return ({
    pathname,
    posts,
  }: {
    pathname: string;
    posts: BlogPostMetadata[];
  }) => (
    <Layout pathname={pathname}>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            <span className="inline-block">Edmund Hung</span>
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600 sm:mt-6">
            I'm a software engineer at Cloudflare. This is where I write about
            the web, developer tooling, and building in open source.
          </p>
        </div>
        {posts.length > 0 ? (
          <section className="mt-12 border-t border-black/10 pt-8 sm:mt-16 sm:pt-10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Recent writing
              </h2>
              <a
                className="text-sm font-semibold no-underline hover:underline"
                href={routes.blog.index.href()}
              >
                View all posts
              </a>
            </div>
            <div className="mt-6 flex flex-col divide-y divide-black/10">
              {posts.map(post => (
                <article
                  key={post.slug}
                  className="py-6 md:grid md:grid-cols-4 md:gap-8"
                >
                  <time
                    className="mb-2 text-sm text-zinc-500 md:mb-0"
                    dateTime={post.date}
                  >
                    {formatDate(post.date)}
                  </time>
                  <div className="md:col-span-3">
                    <h3 className="text-lg font-semibold tracking-tight">
                      <a
                        className="no-underline hover:underline"
                        href={routes.blog.show.href({ slug: post.slug })}
                      >
                        {post.title}
                      </a>
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-zinc-600 sm:text-base">
                      {post.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </Layout>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
