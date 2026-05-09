import type { BuildAction } from 'remix/fetch-router';

import type { BlogPostMetadata } from '../data/blog.server.ts';
import { getPosts } from '../data/blog.server.ts';
import type { routes } from '../routes.ts';
import { Icon } from '../ui/icon.tsx';
import { Layout } from '../ui/layout.tsx';
import { render } from '../utils/render.tsx';

export const home: BuildAction<'GET', typeof routes.home> = {
  async handler({ request, url }) {
    let latestPost = (await getPosts()).at(0) ?? null;
    return render(
      <HomePage latestPost={latestPost} pathname={url.pathname} />,
      request,
    );
  },
};

function HomePage() {
  return ({
    latestPost,
    pathname,
  }: {
    latestPost: BlogPostMetadata | null;
    pathname: string;
  }) => (
    <Layout pathname={pathname}>
      <div className="flex flex-1 flex-col-reverse justify-center md:flex-col">
        <div className="mx-auto my-4 max-w-full p-4">
          {latestPost ? (
            <a
              href={`/blog/${latestPost.slug}`}
              className="flex items-center rounded-full bg-secondary p-1 pr-2 text-base no-underline hover:text-black"
            >
              <span className="rounded-full bg-[#52524e] px-3 py-0.5 text-sm font-semibold leading-5 text-white">
                New
              </span>
              <span className="mx-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                {latestPost.title}
              </span>
              <Icon aria-hidden className="h-5 w-5" symbol="chevron-right" />
            </a>
          ) : null}
        </div>
        <div className="relative mx-auto flex flex-1 max-w-5xl flex-col items-center justify-center px-4 py-6 md:flex-none">
          <h1 className="text-center text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome to my <span className="inline-block">little corner</span>.{' '}
            <span className="inline-block">I'm Edmund Hung.</span>
          </h1>
          <p className="mt-4 text-center text-lg leading-8 text-gray-600 sm:mt-6">
            I'm a web developer currently based in Berlin.
            <br /> I maintain serveral open source projects, such as{' '}
            <a
              className="underline decoration-current decoration-dotted underline-offset-4 hover:decoration-2"
              href="https://github.com/edmundhung/conform"
            >
              Conform
            </a>{' '}
            and{' '}
            <a
              className="underline decoration-current decoration-dotted underline-offset-4 hover:decoration-2"
              href="https://github.com/edmundhung/remix-guide"
            >
              Remix Guide
            </a>
            .
          </p>
          <div className="mt-4 flex justify-center gap-x-4 sm:mt-8">
            <a
              href="/blog"
              className="inline-block rounded-lg bg-[#52524e] px-4 py-1.5 text-base font-semibold leading-7 text-white no-underline shadow-sm ring-1 ring-[#52524e] transition-colors hover:bg-black hover:ring-black"
            >
              Read the Blog
            </a>
            <a
              href="/about"
              className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 no-underline ring-1 ring-[#52524e]/50 hover:ring-black"
            >
              About me
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
