import type { BlogPostMetadata } from '../data/blog.server.ts';
import { routes } from '../routes.ts';

export interface BlogPostsProps {
  posts: BlogPostMetadata[];
}

export function BlogPosts() {
  return ({ posts }: BlogPostsProps) => (
    <div className="flex flex-col">
      {posts.map(post => (
        <article
          key={post.slug}
          className="border-t border-black/10 py-6 md:grid md:grid-cols-4 md:gap-8"
        >
          <time
            className="mb-2 text-sm text-zinc-500 md:mb-0"
            dateTime={post.date}
          >
            {formatDate(post.date)}
          </time>
          <div className="md:col-span-3">
            <h2 className="text-lg font-semibold tracking-tight">
              <a
                className="no-underline hover:underline"
                href={routes.blog.show.href({ slug: post.slug })}
                title={post.title}
              >
                {post.title}
              </a>
            </h2>
            <p className="mt-2 text-sm leading-7 text-zinc-600 sm:text-base">
              {post.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
