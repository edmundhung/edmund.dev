import type { BuildAction } from 'remix/fetch-router';

import type { routes } from '../routes.ts';
import { Icon } from '../ui/icon.tsx';
import { Layout } from '../ui/layout.tsx';
import { render } from '../utils/render.tsx';

export const about: BuildAction<'GET', typeof routes.about> = {
  handler({ request, url }) {
    return render(<AboutPage pathname={url.pathname} />, request);
  },
};

function AboutPage() {
  return ({ pathname }: { pathname: string }) => (
    <Layout
      title="About Edmund Hung"
      description="Here's a little bit more about Edmund Hung, his work, and where to find him online."
      pathname={pathname}
    >
      <section className="mb-16 mt-16 sm:mt-32">
        <div className="container mx-auto xl:max-w-6xl">
          <div className="flex flex-col gap-8 md:flex-row-reverse">
            <div className="px-4">
              <div className="mx-auto max-w-xs md:h-64 md:w-64">
                <img
                  alt="My profile"
                  src="/profile.png"
                  className="aspect-square rounded-lg bg-zinc-100 object-cover"
                />
              </div>
            </div>
            <div className="px-4">
              <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl">
                I'm Edmund Hung,{' '}
                <span className="lg:inline-block">a web developer</span> from{' '}
                <span className="inline-block">Hong Kong</span>
              </h1>
              <p>
                Currently, I am a senior software engineer in{' '}
                <a href="https://deliveryhero.com">Delivery Hero</a>, where I
                build the next generation fraud detection system for our food
                ordering and delivery services.
              </p>
              <address className="mb-4 mt-8 space-y-3 not-italic">
                <a
                  className="flex items-center gap-2"
                  href="mailto:contact@edmund.dev"
                >
                  <Icon className="inline-block h-4 w-4" symbol="email" />{' '}
                  Email: contact@edmund.dev
                </a>
                <a
                  className="flex items-center gap-2"
                  href="https://github.com/edmundhung"
                >
                  <Icon className="inline-block h-4 w-4" symbol="github" />{' '}
                  GitHub: edmundhung
                </a>
                <a
                  className="flex items-center gap-2"
                  href="https://twitter.com/_edmundhung"
                >
                  <Icon className="inline-block h-4 w-4" symbol="twitter" />{' '}
                  Twitter: @_edmundhung
                </a>
                <a
                  className="flex items-center gap-2"
                  href="https://linkedin.com/in/edmundhungtikman"
                >
                  <Icon className="inline-block h-4 w-4" symbol="linkedin" />{' '}
                  Linkedin: edmundhungtikman
                </a>
              </address>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
