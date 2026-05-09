import type { Controller } from 'remix/fetch-router';

import {
  getPosts,
  getPost,
  type BlogPostMetadata,
} from '../../data/blog.server.ts';
import { routes } from '../../routes.ts';
import { Icon } from '../../ui/icon.tsx';
import { Layout } from '../../ui/layout.tsx';
import { MarkdownArticle } from '../../ui/markdown-article.tsx';
import { NotFoundPage } from '../../ui/not-found-page.tsx';
import { render } from '../../utils/render.tsx';
import { renderMarkdown } from '../../utils/markdown.ts';

export const blog = {
  actions: {
    async index({ request, url }) {
      let posts = await getPosts();
      return render(
        <BlogIndexPage pathname={url.pathname} posts={posts} />,
        request,
      );
    },
    async show({ params, request, url }) {
      let post = await getPost(params.slug);

      if (!post) {
        return render(<NotFoundPage pathname={url.pathname} />, request, {
          status: 404,
        });
      }

      return render(
        <PostPage
          date={post.date}
          description={post.description}
          html={renderMarkdown(post.markdown)}
          pathname={url.pathname}
          title={post.title}
        />,
        request,
      );
    },
  },
} satisfies Controller<typeof routes.blog>;

function BlogIndexPage() {
  return ({
    pathname,
    posts,
  }: {
    pathname: string;
    posts: BlogPostMetadata[];
  }) => (
    <Layout
      title="Edmund's Blog"
      description="Thoughts on web standards, progressive enhancement, Remix, and developer tooling."
      pathname={pathname}
    >
      <section className="mb-16 mt-16 sm:mt-32">
        <div className="container mx-auto">
          <div className="relative">
            <div className="flex flex-col gap-16 xl:flex-row">
              <header className="max-w-4xl px-4 xl:max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Writing on web standard, progressive enhancement, and remix.
                </h1>
                <p className="mt-6 text-base text-zinc-600">
                  All of my thoughts on web development, practice, tips and
                  more, collected in chronological order.
                </p>
              </header>
              <div className="px-4">
                <div className="md:pl-6">
                  <div className="flex max-w-3xl flex-col space-y-16">
                    {posts.map(post => (
                      <article
                        key={post.slug}
                        className="gap-8 md:grid md:grid-cols-4 md:items-baseline"
                      >
                        <div className="group relative flex flex-col items-start md:col-span-3">
                          <h2 className="text-base font-semibold tracking-tight">
                            <div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-white opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl"></div>
                            <a
                              href={routes.blog.show.href({ slug: post.slug })}
                              title={post.title}
                            >
                              <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl"></span>
                              <span className="relative z-10">
                                {post.title}
                              </span>
                            </a>
                          </h2>
                          <time
                            className="relative z-10 order-first mb-3 flex items-center pl-3.5 text-sm md:hidden"
                            dateTime={post.date}
                          >
                            <span
                              className="absolute inset-y-0 left-0 flex items-center"
                              aria-hidden="true"
                            >
                              <span className="h-4 w-0.5 rounded-full bg-[#d4d6c8]"></span>
                            </span>
                            {formatDate(post.date)}
                          </time>
                          <p className="relative z-10 mt-2 text-sm text-zinc-600">
                            {post.description}
                          </p>
                          <div
                            aria-hidden="true"
                            className="relative z-10 mt-4 flex items-center text-sm font-medium"
                          >
                            Learn more
                            <Icon
                              aria-hidden
                              className="ml-1 h-4 w-4 stroke-current"
                              symbol="arrow"
                            />
                          </div>
                        </div>
                        <time
                          className="relative z-10 order-first mt-1 mb-3 hidden text-sm md:block"
                          dateTime={post.date}
                        >
                          {formatDate(post.date)}
                        </time>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function PostPage() {
  return ({
    date,
    description,
    html,
    pathname,
    title,
  }: {
    date: string;
    description: string;
    html: string;
    pathname: string;
    title: string;
  }) => (
    <Layout description={description} title={title} pathname={pathname}>
      <div className="mb-16 mt-16 sm:mt-32">
        <div className="container mx-auto px-4 xl:max-w-4xl">
          <time className="mb-4 block" dateTime={date}>
            {formatDate(date)}
          </time>
          <MarkdownArticle html={html} />
        </div>
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
