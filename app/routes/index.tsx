import {
  type LoaderArgs,
  type HtmlMetaDescriptor,
  json,
} from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import { Hyperlink, Icon } from '~/components';
import { generateMetaDescriptor } from '~/utils/meta';

export async function loader({ context }: LoaderArgs) {
  const posts = await context.github.getPosts();

  return json({
    latestPost: posts.at(0) ?? null,
  });
}

export function meta(): HtmlMetaDescriptor {
  return generateMetaDescriptor({
    title: 'Edmund.dev',
    description:
      "I'm passionate about Progressive Enhacement, especially with Remix. I'm also maintaining serveral open source projects, such as Conform and Remix Guide.",
  });
}

export default function Index() {
  const { latestPost } = useLoaderData<typeof loader>();

  return (
    <div className="flex-1 flex flex-col-reverse md:flex-col justify-center">
      <div className="max-w-full mx-auto my-4 p-4">
        {latestPost ? (
          <Link
            to={`/blog/${latestPost.slug}`}
            className="flex items-center rounded-full bg-[#d4d6c8] p-1 pr-2 hover:text-black text-base"
          >
            <span className="rounded-full bg-[#52524e] px-3 py-0.5 text-sm font-semibold leading-5 text-white">
              New
            </span>
            <span className="mx-2 text-sm text-ellipsis overflow-hidden whitespace-nowrap">
              {latestPost.title}
            </span>
            {/* <Icon symbol="arrow" className="h-5 w-5 stroke-current" aria-hidden="true" /> */}
            <Icon
              symbol="chevron-right"
              className="h-5 w-5"
              aria-hidden="true"
            />
          </Link>
        ) : null}
      </div>
      <div className="relative max-w-5xl mx-auto px-4 py-6 flex-1 md:flex-none flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold tracking-tight text-center sm:text-6xl">
          Welcome to my <span className="inline-block">little corner</span>.{' '}
          <span className="inline-block">I'm Edmund Hung.</span>
        </h1>
        <p className="mt-4 sm:mt-6 text-lg leading-8 text-gray-600 text-center">
          I'm a web developer currently based in Berlin.
          <br /> I maintain serveral open source projects, such as{' '}
          <Hyperlink href="https://github.com/edmundhung/conform" active>
            Conform
          </Hyperlink>{' '}
          and{' '}
          <Hyperlink href="https://github.com/edmundhung/remix-guide" active>
            Remix Guide
          </Hyperlink>
          .
        </p>
        <div className="mt-4 sm:mt-8 flex gap-x-4 justify-center">
          <Link
            to="/blog"
            className="inline-block rounded-lg bg-[#52524e] px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-[#52524e] hover:bg-black hover:ring-black transition-colors"
          >
            Read the Blog
          </Link>
          <Link
            to="/about"
            className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 ring-1 ring-[#52524e]/50 hover:ring-black"
          >
            About me
          </Link>
        </div>
      </div>
    </div>
  );
}
