import { Hyperlink } from '~/components';

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
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              I'm Edmund Hung,{' '}
              <span className="lg:inline-block">a web developer</span> from{' '}
              <span className="inline-block">Hong Kong</span>
            </h1>
            <p></p>
            <p></p>
            <p></p>
            <p className="my-4">
              Today, I am a senior software engineer in{' '}
              <Hyperlink href="https://deliveryhero.com" active>
                Delivery Hero
              </Hyperlink>
              , where we build the next generation fraud detection system for
              our food ordering and delivery services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
