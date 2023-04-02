import { type LinksFunction } from '@remix-run/cloudflare';
import resetCSS from 'reveal.js/dist/reset.css';
import baseCSS from 'reveal.js/dist/reveal.css';
import themeCSS from 'reveal.js/dist/theme/serif.css';
import monokaiCSS from 'reveal.js/plugin/highlight/monokai.css';
import { useEffect } from 'react';
import { TalkLayout } from '~/components';
import { initialize } from '~/reveal.client';

export let links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: resetCSS },
    { rel: 'stylesheet', href: baseCSS },
    { rel: 'stylesheet', href: themeCSS },
    { rel: 'stylesheet', href: monokaiCSS },
  ];
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
