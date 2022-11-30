import {
  type LoaderArgs,
  type HtmlMetaDescriptor,
  json,
} from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import { Hyperlink } from '~/components';
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
    <div className="flex-1 flex flex-col items-start justify-center">
      <div className="mx-auto mb-6 sm:mb-8 p-4 flex justify-center">
        {latestPost ? (
          <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            <span className="text-gray-600">
              {`${latestPost.title} `}
              <Link
                to={`/blog/${latestPost.slug}`}
                className="inline-block font-semibold text-red-600"
              >
                <span className="absolute inset-0" aria-hidden="true" />
                Learn more <span aria-hidden="true">&rarr;</span>
              </Link>
            </span>
          </div>
        ) : null}
      </div>
      <div className="relative max-w-5xl mx-auto px-4 pb-12">
        <h1 className="text-4xl font-bold tracking-tight text-center sm:text-6xl">
          Web developer, amateur photographer and traveler.
        </h1>
        <p className="mt-4 sm:mt-6 text-lg leading-8 text-gray-600 text-center">
          I'm Edmund, a senior software engineer currently based in Berlin.
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
