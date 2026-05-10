import type { BuildAction } from 'remix/fetch-router';

import type { BlogPostMetadata } from '../data/blog.server.ts';
import { getPosts } from '../data/blog.server.ts';
import { BlogPosts } from '../ui/blog-posts.tsx';
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
          <section className="mt-12 sm:mt-16">
            <BlogPosts posts={posts} />
          </section>
        ) : null}
      </div>
    </Layout>
  );
}
