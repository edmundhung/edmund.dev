import type { Controller } from 'remix/fetch-router';

import {
  getPosts,
  getPost,
  type BlogPostMetadata,
} from '../../data/blog.server.ts';
import { routes } from '../../routes.ts';
import { BlogPosts, formatDate } from '../../ui/blog-posts.tsx';
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
          html={await renderMarkdown(post.markdown)}
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
        <div className="mx-auto flex w-full max-w-5xl flex-col px-4">
          <header className="max-w-3xl">
            <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
              Things I learn while building
            </h1>
          </header>
          <div className="mt-12 sm:mt-16">
            <BlogPosts posts={posts} />
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
