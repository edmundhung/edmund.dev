import { type LinksFunction, type MetaFunction } from '@remix-run/cloudflare';
import resetCSS from 'reveal.js/dist/reset.css';
import baseCSS from 'reveal.js/dist/reveal.css';
import themeCSS from 'reveal.js/dist/theme/serif.css';
import monokaiCSS from 'reveal.js/plugin/highlight/monokai.css';
import { useEffect } from 'react';
import { TalkLayout } from '~/components';
import { initialize } from '~/reveal.client';
import { generateMetaDescriptor } from '~/utils/meta';

export let links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: resetCSS },
    { rel: 'stylesheet', href: baseCSS },
    { rel: 'stylesheet', href: themeCSS },
    { rel: 'stylesheet', href: monokaiCSS },
  ];
};

export const meta: MetaFunction = () => {
  return generateMetaDescriptor({
    title: 'Remixing Constraint Validation',
    description: [
      'The Remix Form and Action have drastically simplified our forms',
      "While it's easy to validate form data on the server, people have always been searching for a good client-side form validation solution.",
      'What if we could use the platform to implement simple client-side validation without adding another dependency?',
      "In this talk, we'll explore how to utilize the Constraint Validation API to provide a modern form validation experience in Remix.",
    ].join(' '),
  });
};

export default function Talk() {
  useEffect(() => {
    initialize();
  }, []);

  return (
    <TalkLayout
      title="Remixing Constraint Validation"
      description="Remix Conf 2023"
    >
      <div className="slides">
        <section>Slide 1</section>
        <section>Slide 2</section>
      </div>
    </TalkLayout>
  );
}
