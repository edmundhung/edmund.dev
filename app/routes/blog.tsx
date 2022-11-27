import { type HtmlMetaDescriptor, json } from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import { generateMetaDescriptor } from '~/utils/meta';

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
}

export function loader() {
  const posts: Post[] = [
    {
      slug: 'deploying-remix-app-on-cloudflare-workers',
      title: 'Deploying Remix app on Cloudflare Workers',
      description:
        'Step by step guide on how to deploy your remix app to Cloudflare Workers using the `remix-worker-template`',
      date: '2021-11-27',
    },
    {
      slug: 'setting-up-a-global-loading-indicator-in-remix',
      title: 'Setting up a global loading indicator in Remix',
      description:
        'Tutorial for making you own loading progress bar with tailwindcss',
      date: '2021-09-15',
    },
    // {
    //   slug: 'setting-up-a-global-loading-indicator-in-remix1',
    //   title: 'Setting up a global loading indicator in Remix',
    //   description:
    //     'Tutorial for making you own loading progress bar with tailwindcss',
    //   date: '2021-09-15',
    // },
    // {
    //   slug: 'setting-up-a-global-loading-indicator-in-remix2',
    //   title: 'Setting up a global loading indicator in Remix',
    //   description:
    //     'Tutorial for making you own loading progress bar with tailwindcss',
    //   date: '2021-09-15',
    // },
    // {
    //   slug: 'setting-up-a-global-loading-indicator-in-remix3',
    //   title: 'Setting up a global loading indicator in Remix',
    //   description:
    //     'Tutorial for making you own loading progress bar with tailwindcss',
    //   date: '2021-09-15',
    // },
    // {
    //   slug: 'setting-up-a-global-loading-indicator-in-remix4',
    //   title: 'Setting up a global loading indicator in Remix',
    //   description:
    //     'Tutorial for making you own loading progress bar with tailwindcss',
    //   date: '2021-09-15',
    // },
    // {
    //   slug: 'setting-up-a-global-loading-indicator-in-remix5',
    //   title: 'Setting up a global loading indicator in Remix',
    //   description:
    //     'Tutorial for making you own loading progress bar with tailwindcss',
    //   date: '2021-09-15',
    // },
  ];

  return json(posts);
}

export function meta(): HtmlMetaDescriptor {
  return generateMetaDescriptor({
    title: "Edmund's Blog",
    description:
      'All of my thoughts on web standard, practice, tips and more, collected in chronological order.',
    url: '/blog',
  });
}

export default function Blog() {
  const posts = useLoaderData<typeof loader>();

  return (
    <section className="mt-16 mb-16 sm:mt-32">
      <div className="mx-auto container">
        <div className="relative">
          <div className="flex flex-col xl:flex-row gap-16">
            <header className="max-w-4xl xl:max-w-xl px-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Writing on web standard, progressive enhancement, and remix.
              </h1>
              <p className="mt-6 text-base text-zinc-600">
                All of my thoughts on web development, practice, tips and more,
                collected in chronological order.
              </p>
            </header>
            <div className="px-4">
              <div className="md:border-l-2 md:border-[#d4d6c8] md:pl-6">
                <div className="flex max-w-3xl flex-col space-y-16">
                  {posts.map(post => (
                    <article
                      key={post.slug}
                      className="md:grid md:grid-cols-4 md:items-baseline gap-8"
                    >
                      <div className="md:col-span-3 group relative flex flex-col items-start">
                        <h2 className="text-base font-semibold tracking-tight">
                          <div className="absolute -inset-y-6 -inset-x-4 z-0 scale-95 bg-white opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl"></div>
                          <Link to={post.slug} title={post.title}>
                            <span className="absolute -inset-y-6 -inset-x-4 z-20 sm:-inset-x-6 sm:rounded-2xl"></span>
                            <span className="relative z-10">{post.title}</span>
                          </Link>
                        </h2>
                        <time
                          className="md:hidden relative z-10 order-first mb-3 flex items-center text-sm pl-3.5"
                          dateTime={post.date}
                        >
                          <span
                            className="absolute inset-y-0 left-0 flex items-center"
                            aria-hidden="true"
                          >
                            <span className="h-4 w-0.5 rounded-full bg-[#d4d6c8]"></span>
                          </span>
                          {new Date(post.date).toLocaleDateString('en', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                        <p className="relative z-10 mt-2 text-sm text-zinc-600">
                          {post.description}
                        </p>
                        <div
                          aria-hidden="true"
                          className="relative z-10 mt-4 flex items-center text-sm font-medium"
                        >
                          Learn more
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden="true"
                            className="ml-1 h-4 w-4 stroke-current"
                          >
                            <path
                              d="M6.75 5.75 9.25 8l-2.5 2.25"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <time
                        className="hidden mt-1 md:block relative z-10 order-first mb-3 text-sm"
                        dateTime="2022-09-05"
                      >
                        {new Date(post.date).toLocaleDateString('en', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
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
  );
}
