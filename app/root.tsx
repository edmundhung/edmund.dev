import { type LinksFunction, type MetaFunction } from '@remix-run/cloudflare';
import {
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from '@remix-run/react';
import * as React from 'react';
import stylesUrl from '~/styles/global.css';
import Hyperlink from './components/Hyperlink';
import Icon from './components/Icon';

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export let meta: MetaFunction = () => {
  return {
    viewport: 'width=device-width, initial-scale=1',
  };
};

export default function App() {
  return (
    <Document>
      <header className="container mx-auto flex flex-row justify-between gap-4 p-4">
        <Link
          className="flex flex-row items-center no-underline"
          to="/"
          prefetch="intent"
        >
          <Icon
            className="w-12 h-12 rounded-full text-[#52524e] bg-white"
            symbol="logo"
          />
          <span className="px-4 sr-only">Edmund Hung</span>
        </Link>
        <nav className="flex flex-row items-center gap-4">
          <Hyperlink to="https://github.com/edmundhung">GitHub</Hyperlink>/
          <Hyperlink to="https://twitter.com/_edmundhung">Twitter</Hyperlink>/
          <Hyperlink to="/rss.xml">RSS</Hyperlink>
        </nav>
      </header>
      <main className="flex flex-col flex-1">
        <Outlet />
      </main>
      <nav className="sticky bottom-0 font-light text-sm bg-black text-white z-30 ">
        <div className="container mx-auto text-center flex flex-row justify-end gap-4 items-center shadow px-4">
          <Hyperlink className="flex-1 lg:flex-none block py-4" to="/about">
            About
          </Hyperlink>
          /
          <Hyperlink className="flex-1 lg:flex-none block py-4" to="/blog">
            Blog
          </Hyperlink>
          /
          <Hyperlink className="flex-1 lg:flex-none block py-4" to="/contact">
            Contact
          </Hyperlink>
        </div>
      </nav>
      <footer className="bg-white font-light text-sm">
        <div className="container mx-auto text-center lg:text-left p-4">
          All rights reserved &copy; Edmund Hung {new Date().getFullYear()}
        </div>
      </footer>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        {title ? <title>{title}</title> : null}
        <meta charSet="utf-8" />
        <meta name="apple-mobile-web-app-title" content="Edmund.dev" />
        <meta name="application-name" content="Edmund.dev" />
        <meta name="msapplication-TileColor" content="#ebece5" />
        <meta name="theme-color" content="#383835" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ebece5" />
        <Links />
      </head>
      <body className="min-h-screen bg-primary font-open-sans text-primary flex flex-col">
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const message = `${caught.status} ${caught.statusText}`;

  switch (caught.status) {
    case 404:
      return (
        <Document title={caught.statusText}>
          <div className="flex-1 flex flex-col justify-center items-center">
            <Link to="/" prefetch="intent">
              <Icon className="w-16 h-16 rounded-full bg-white" symbol="logo" />
            </Link>
            <h1 className="p-4">{message}</h1>
          </div>
        </Document>
      );
    default:
      throw new Error(`${caught.status} ${caught.statusText}`);
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <Document title="Internal server error">
      <div className="flex-1 flex flex-col justify-center items-center">
        <Link to="/" prefetch="intent">
          <Icon className="w-16 h-16 rounded-full bg-white" symbol="logo" />
        </Link>
        <h1 className="p-4">500 Internal server error</h1>
      </div>
    </Document>
  );
}
