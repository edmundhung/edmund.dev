import { type MetaFunction } from '@remix-run/cloudflare';
import { Hyperlink, Icon } from '~/components';
import { generateMetaDescriptor } from '~/utils/meta';

export const meta: MetaFunction = () => {
  return generateMetaDescriptor({
    title: 'About Edmund Hung',
    description: "Here's a little bit more details about me.",
    url: '/about',
  });
};

export default function About() {
  return (
    <section className="mt-16 mb-16 sm:mt-32">
      <div className="mx-auto container xl:max-w-6xl">
        <div className="flex flex-col md:flex-row-reverse gap-8">
          <div className="px-4">
            <div className="mx-auto max-w-xs md:w-64 md:h-64">
              <img
                className="aspect-square rounded-lg bg-zinc-100 object-cover dark:bg-zinc-800"
                src="/profile.png"
                alt="My profile"
              />
            </div>
          </div>
          <div className="px-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-8">
              I'm Edmund Hung,{' '}
              <span className="lg:inline-block">a web developer</span> from{' '}
              <span className="inline-block">Hong Kong</span>
            </h1>
            <p>
              Currently, I am a senior software engineer in{' '}
              <Hyperlink href="https://deliveryhero.com" active>
                Delivery Hero
              </Hyperlink>
              , where we build the next generation fraud detection system for
              our food ordering and delivery services.
            </p>
            <address className="mt-8 mb-4 not-italic space-y-3">
              <Hyperlink
                className="flex items-center gap-2"
                href="mailto:contact@edmund.dev"
              >
                <Icon symbol="email" className="w-4 h-4 inline-block" /> Email:
                contact@edmund.dev
              </Hyperlink>
              <Hyperlink
                className="flex items-center gap-2"
                href="https://github.com/edmundhung"
              >
                <Icon symbol="github" className="w-4 h-4 inline-block" />{' '}
                GitHub: edmundhung
              </Hyperlink>
              <Hyperlink
                className="flex items-center gap-2"
                href="https://twitter.com/_edmundhung"
              >
                <Icon symbol="twitter" className="w-4 h-4 inline-block" />{' '}
                Twitter: @_edmundhung
              </Hyperlink>
              <Hyperlink
                className="flex items-center gap-2"
                href="https://linkedin.com/in/edmundhungtikman"
              >
                <Icon symbol="linkedin" className="w-4 h-4 inline-block" />{' '}
                Linkedin: edmundhungtikman
              </Hyperlink>
            </address>
          </div>
        </div>
      </div>
    </section>
  );
}
