import type { RemixNode } from 'remix/ui';

import { routes } from '../routes.ts';
import { Document } from './document.tsx';
import { Icon } from './icon.tsx';
import { ProgressBar } from './progress-bar.client.tsx';

export interface LayoutProps {
  children?: RemixNode;
  description?: string;
  pathname?: string;
  title?: string;
}

function navLinkClass(active: boolean) {
  return `flex-1 md:flex-none block py-3 decoration underline-offset-6 ${
    active ? 'text-white' : 'hover:underline'
  }`;
}

export function Layout() {
  return ({ title, description, pathname = '/', children }: LayoutProps) => (
    <Document title={title} description={description} pathname={pathname}>
      <div className="flex min-h-screen flex-col">
        <ProgressBar />
        <header className="container mx-auto flex flex-row justify-between gap-8 p-4">
          <a
            className="flex flex-row items-center no-underline"
            href={routes.home.href()}
          >
            <Icon
              className="h-12 w-12 rounded-full bg-white text-[#52524e]"
              symbol="logo"
            />
            <span className="sr-only px-4">Edmund Hung</span>
          </a>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
        <nav className="sticky bottom-0 z-30 text-sm font-light bg-black text-white/70 border-white border-y-2 py-1">
          <div className="container mx-auto flex justify-between px-4">
            <div className="hidden items-center gap-6 md:flex">
              <a
                className="underline-offset-4 decoration-dotted decoration-current hover:decoration-2"
                href="https://github.com/edmundhung"
              >
                <Icon className="h-4 w-4 hover:text-white" symbol="github" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                className="underline-offset-4 decoration-dotted decoration-current hover:decoration-2"
                href="https://twitter.com/_edmundhung"
              >
                <Icon className="h-4 w-4 hover:text-white" symbol="twitter" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                className="underline-offset-4 decoration-dotted decoration-current hover:decoration-2"
                href={routes.rss.href()}
              >
                <Icon className="h-4 w-4 hover:text-white" symbol="rss" />
                <span className="sr-only">RSS</span>
              </a>
            </div>
            <div className="flex flex-1 items-center justify-end gap-6 text-center">
              <a
                aria-current={
                  pathname === routes.home.href() ? 'page' : undefined
                }
                className={navLinkClass(pathname === routes.home.href())}
                href={routes.home.href()}
              >
                Home
              </a>
              <span>/</span>
              <a
                aria-current={
                  pathname === routes.about.href() ? 'page' : undefined
                }
                className={navLinkClass(pathname === routes.about.href())}
                href={routes.about.href()}
              >
                About
              </a>
              <span>/</span>
              <a
                aria-current={pathname.startsWith('/blog') ? 'page' : undefined}
                className={navLinkClass(pathname.startsWith('/blog'))}
                href={routes.blog.index.href()}
              >
                Blog
              </a>
            </div>
          </div>
        </nav>
        <footer className="bg-white text-sm font-light">
          <div className="container mx-auto p-4 text-center lg:text-left">
            All rights reserved &copy; Edmund Hung {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </Document>
  );
}
