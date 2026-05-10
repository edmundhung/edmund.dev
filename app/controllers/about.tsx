import type { BuildAction } from 'remix/fetch-router';

import type { routes } from '../routes.ts';
import { Layout } from '../ui/layout.tsx';
import { render } from '../utils/render.tsx';

const projects = [
  {
    description:
      'Progressively enhance HTML forms with React and build resilient, type-safe forms with web standards.',
    name: 'Conform',
    url: 'https://github.com/edmundhung/conform',
  },
  {
    description: 'A platform for sharing everything about Remix.',
    name: 'Remix Guide',
    url: 'https://github.com/edmundhung/remix-guide',
  },
] as const;

const events = [
  {
    description:
      'A talk at Remix Conf 2023 on using the Constraint Validation API for client-side validation in Remix.',
    href: 'https://www.youtube.com/watch?v=Y7G6n3kZC9E',
    meta: 'Remix Conf 2023',
    title: 'Remixing Constraint Validation',
  },
  {
    description:
      'Co-host of the London meetup, where I also gave a talk on Conform fundamentals.',
    href: 'https://www.meetup.com/remix-london/',
    meta: 'Co-host & Speaker',
    title: 'Remix London Meetup',
  },
] as const;

export const about: BuildAction<'GET', typeof routes.about> = {
  handler({ request, url }) {
    return render(<AboutPage pathname={url.pathname} />, request);
  },
};

function AboutPage() {
  return ({ pathname }: { pathname: string }) => (
    <Layout
      title="About Edmund Hung"
      description="A little more about Edmund Hung, his work on developer tooling and open source, and where to find him online."
      pathname={pathname}
    >
      <section class="mb-16 mt-16 sm:mt-32">
        <div class="container mx-auto xl:max-w-6xl">
          <div class="flex flex-col gap-8 md:flex-row">
            <div class="px-4">
              <h1 class="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
                I'm Edmund Hung,
                <br />
                <span class="lg:inline-block">a software engineer</span> based
                in <span class="inline-block">London</span>
              </h1>
              <div class="space-y-6 text-base leading-8 text-zinc-600">
                <p>
                  I was born in Hong Kong and have spent the last couple years
                  exploring Munich, Berlin, and now London. I've been building
                  for the web for over a decade, and working as an software
                  engineer since 2015, mostly on the frontend.
                </p>
                <p>
                  Today I work at{' '}
                  <a class="hover:underline" href="https://cloudflare.com">
                    Cloudflare
                  </a>{' '}
                  as a core maintainer of{' '}
                  <a
                    class="hover:underline font-bold"
                    href="https://github.com/cloudflare/workers-sdk"
                  >
                    workers-sdk
                  </a>
                  , which includes developer tooling like the{' '}
                  <a
                    class="hover:underline"
                    href="https://www.npmjs.com/package/wrangler"
                  >
                    Wrangler
                  </a>{' '}
                  CLI and the{' '}
                  <a
                    class="hover:underline"
                    href="https://www.npmjs.com/package/@cloudflare/vite-plugin"
                  >
                    Cloudflare Vite plugin
                  </a>
                  . Some of that work has also led me to contribute to projects
                  and frameworks like{' '}
                  <a
                    class="hover:underline"
                    href="https://github.com/vitejs/vite"
                  >
                    Vite
                  </a>
                  ,{' '}
                  <a
                    class="hover:underline"
                    href="https://github.com/remix-run/react-router"
                  >
                    React Router
                  </a>
                  , and{' '}
                  <a
                    class="hover:underline"
                    href="https://github.com/TanStack/router"
                  >
                    TanStack Start
                  </a>
                  , usually to improve the developer experience and hosting
                  story on Cloudflare.
                </p>
                <p>
                  I care a lot about open source and enjoy building in public.
                  I'm the creator of{' '}
                  <a
                    class="hover:underline font-bold"
                    href="https://github.com/edmundhung/conform"
                  >
                    Conform
                  </a>
                  , a library for building resilient forms with web standards,
                  and I also run{' '}
                  <a
                    class="hover:underline font-bold"
                    href="https://github.com/edmundhung/remix-guide"
                  >
                    Remix Guide
                  </a>
                  , a site for sharing everything about Remix.
                </p>
                <p>
                  When I'm away from the keyboard, I enjoy cycling and
                  photography.
                </p>
              </div>
            </div>
            <div class="px-4 py-8">
              <div class="mx-auto max-w-xs md:w-80">
                <img
                  alt="Me speaking at Remix Conf 2023"
                  src="/remix-conf-2023.jpg"
                  class="bg-zinc-100 object-cover object-center border-white border-8 shadow-2xl"
                />
              </div>
            </div>
          </div>
          <div class="px-4">
            <section class="mt-10 border-t border-black/10 pt-8">
              <h2 class="text-lg font-semibold tracking-tight">Projects</h2>
              <div class="mt-4 grid gap-6 md:grid-cols-2">
                {projects.map(project => (
                  <article key={project.name}>
                    <h3 class="text-base font-semibold">
                      <a href={project.url}>{project.name}</a>
                    </h3>
                    <p class="mt-1 text-sm leading-7 text-zinc-600">
                      {project.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
            <section class="mt-10 border-t border-black/10 pt-8">
              <h2 class="text-lg font-semibold tracking-tight">
                Talks and Events
              </h2>
              <div class="mt-4 grid gap-6 md:grid-cols-2">
                {events.map(event => (
                  <article key={event.title}>
                    <p class="text-sm text-zinc-500">{event.meta}</p>
                    <h3 class="mt-1 text-base font-semibold">
                      <a href={event.href}>{event.title}</a>
                    </h3>
                    <p class="mt-1 text-sm leading-7 text-zinc-600">
                      {event.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </Layout>
  );
}
