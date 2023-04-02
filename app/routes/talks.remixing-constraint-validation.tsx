import { type LinksFunction, type MetaFunction } from '@remix-run/cloudflare';
import resetCSS from 'reveal.js/dist/reset.css';
import baseCSS from 'reveal.js/dist/reveal.css';
import { useEffect } from 'react';
import codeCSS from '~/styles/code.css';
import themeCSS from '~/styles/reveal-theme.css';
import { TalkLayout } from '~/components';
import { initialize } from '~/reveal.client';
import { generateMetaDescriptor } from '~/utils/meta';

export let links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: resetCSS },
    { rel: 'stylesheet', href: baseCSS },
    { rel: 'stylesheet', href: themeCSS },
    { rel: 'stylesheet', href: codeCSS },
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
    return initialize();
  }, []);

  return (
    <TalkLayout
      title="Remixing Constraint Validation"
      description="Remix Conf 2023"
    >
      <div className="slides">
        <section>
          <h3>Remixing Constraint Validation</h3>
        </section>
        <section>
          <section data-auto-animate>
            <pre style={{ width: 'max-content' }}>
              <code data-trim>{`<input type="email" required />`}</code>
            </pre>
          </section>
        </section>
        <section>
          <section data-auto-animate>
            <pre data-id="code-animation">
              <code data-trim data-line-numbers>
                {`
import { Form } from "@remix-run/react";

export default function LoginForm() {
  return (
    <Form
      method="post"
    >
      <div>
        <label>Email</label>
        <input
          name="email"
          type="email"
          required
          pattern="[^@]+@[A-Za-z0-9]+.[A-Za-z0-9]+"
        />
      </div>
      <div>
        <label>Password</label>
        <input
          name="password"
          type="password"
          required
        />
      </div>
      <button>Login</button>
    </Form>
  );
}
                `}
              </code>
            </pre>
          </section>
          <section data-auto-animate>
            <pre data-id="code-animation">
              <code data-trim data-line-numbers="7-14">
                {`
import { Form } from "@remix-run/react";

export default function LoginForm() {
  return (
    <Form
      method="post"
      onSubmit={(event) => {
        // Check validity of each field
        if (!event.currentTarget.reportValidity()) {
          // Prevent default form submission
          event.preventDefault();
        }
      }}
      noValidate
    >
      <div>
        <label>Email</label>
        <input
          name="email"
          type="email"
          required
          pattern="[^@]+@[A-Za-z0-9]+.[A-Za-z0-9]+"
        />
      </div>
      <div>
        <label>Password</label>
        <input
          name="password"
          type="password"
          required
        />
      </div>
      <button>Login</button>
    </Form>
  );
}
                `}
              </code>
            </pre>
          </section>
        </section>
      </div>
    </TalkLayout>
  );
}
