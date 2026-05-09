import type { RemixNode } from 'remix/ui';

import { siteDescription, siteOrigin, siteTitle } from '../utils/site.ts';

export interface DocumentProps {
  children?: RemixNode;
  description?: string;
  pathname?: string;
  title?: string;
}

const CLIENT_ENTRY_SRC = import.meta.env.DEV
  ? '/client.ts'
  : '/assets/client.js';
const GLOBAL_STYLES_HREF = import.meta.env.DEV
  ? '/app/styles/global.css'
  : '/assets/client.css';

export function Document() {
  return ({
    title = siteTitle,
    description = siteDescription,
    pathname = '/',
    children,
  }: DocumentProps) => (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>
          {title === siteTitle ? siteTitle : `${title} | ${siteTitle}`}
        </title>
        <meta name="description" content={description} />
        <meta name="apple-mobile-web-app-title" content={siteTitle} />
        <meta name="application-name" content={siteTitle} />
        <meta name="msapplication-TileColor" content="#ebece5" />
        <meta name="theme-color" content="#383835" />
        <meta property="og:site_name" content={siteTitle} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${siteOrigin}${pathname}`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@_edmundhung" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
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
        <link rel="mask-icon" href="/safari-pinned-tab.svg" />
        <link rel="stylesheet" href={GLOBAL_STYLES_HREF} />
      </head>
      <body className="min-h-screen bg-primary font-open-sans text-primary">
        {children}
        <script type="module" src={CLIENT_ENTRY_SRC}></script>
      </body>
    </html>
  );
}
