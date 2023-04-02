import type { RenderableTreeNodes } from '@markdoc/markdoc';
import { renderers } from '@markdoc/markdoc';
import { Link, NavLink, useLocation } from '@remix-run/react';
import * as React from 'react';
import ReactSyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism-light';
import ts from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import diff from 'react-syntax-highlighter/dist/cjs/languages/prism/diff';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import sh from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import style from 'react-syntax-highlighter/dist/cjs/styles/prism/gruvbox-dark';
import iconURL from '~/icons.svg';
import { getChildren, isTag } from '~/markdoc';

ReactSyntaxHighlighter.registerLanguage('ts', ts);
ReactSyntaxHighlighter.registerLanguage('tsx', tsx);
ReactSyntaxHighlighter.registerLanguage('css', css);
ReactSyntaxHighlighter.registerLanguage('diff', diff);
ReactSyntaxHighlighter.registerLanguage('sh', sh);

export function Fence({
  language,
  children,
}: {
  language: string;
  children: string;
}): React.ReactElement {
  return (
    <ReactSyntaxHighlighter
      language={language}
      style={style}
      showLineNumbers={language === 'tsx' || language === 'css'}
    >
      {children}
    </ReactSyntaxHighlighter>
  );
}

export function Heading({
  level,
  children,
}: {
  level: number;
  children: React.ReactNode;
}) {
  const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const id =
    typeof children === 'string'
      ? children.replace(/[?]/g, '').replace(/\s+/g, '-').toLowerCase()
      : '';

  return (
    <HeadingTag id={id} className="-mt-20 pt-20 prose-a:inline-block">
      {children}
    </HeadingTag>
  );
}

interface HyperlinkProps {
  href: string;
  className?: string;
  active?: boolean;
  children: React.ReactElement | React.ReactNode;
}

const linkStyle = {
  default:
    'underline-offset-4 decoration-dotted decoration-current hover:decoration-2',
  active: 'underline',
  inactive: 'no-underline hover:underline',
};

export function Hyperlink({
  href,
  className,
  active,
  children,
}: HyperlinkProps): React.ReactElement {
  const location = useLocation();
  const linkClass = `${className ?? ''} ${linkStyle.default} ${
    active || location.pathname === href ? linkStyle.active : linkStyle.inactive
  }`.trim();
  const isAbsoluteURL =
    href.startsWith('https://') ||
    href.startsWith('http://') ||
    href.startsWith('mailto:') ||
    href.startsWith('//') ||
    href.endsWith('/rss.xml');

  if (isAbsoluteURL) {
    return (
      <a className={linkClass} href={href}>
        {children}
      </a>
    );
  }

  return (
    <Link className={linkClass} to={href} prefetch="intent">
      {children}
    </Link>
  );
}

export function Markdown({ content }: { content: RenderableTreeNodes }) {
  const hasSidebar =
    typeof getChildren(content).find(
      node => isTag(node) && node.name === 'Aside',
    ) !== 'undefined';

  return (
    <section
      className={`prose prose-headings:text-primary prose-p:text-primary prose-a:text-primary max-w-none ${
        hasSidebar ? 'xl:pr-72' : ''
      }`.trim()}
    >
      {renderers.react(content, React, {
        components: {
          Fence,
          Heading,
          Hyperlink,
        },
      })}
    </section>
  );
}

interface IconProps extends React.SVGAttributes<SVGElement> {
  symbol:
    | 'logo'
    | 'email'
    | 'github'
    | 'linkedin'
    | 'twitter'
    | 'rss'
    | 'arrow'
    | 'chevron-right';
}

export function Icon({ symbol, ...rest }: IconProps): React.ReactElement {
  return (
    <svg {...rest}>
      <use href={`${iconURL}#${symbol}`} />
    </svg>
  );
}

interface HeaderProps {
  reloadDocument?: boolean;
}

export function Header({ reloadDocument }: HeaderProps) {
  return (
    <header className="container mx-auto flex flex-row justify-between gap-8 p-4">
      <Link
        className="flex flex-row items-center no-underline"
        to="/"
        prefetch="intent"
        reloadDocument={reloadDocument}
      >
        <Icon
          className="w-12 h-12 rounded-full text-[#52524e] bg-white"
          symbol="logo"
        />
        <span className="px-4 sr-only">Edmund Hung</span>
      </Link>
    </header>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className="flex flex-col flex-1">{children}</main>
      <nav className="sticky bottom-0 font-light text-sm bg-black text-white/70 z-30 ">
        <div className="container mx-auto flex justify-between shadow px-4">
          <div className="hidden md:flex gap-6 items-center">
            <Hyperlink href="https://github.com/edmundhung">
              <Icon className="w-4 h-4 hover:text-white" symbol="github" />
              <span className="sr-only">GitHub</span>
            </Hyperlink>
            <Hyperlink href="https://twitter.com/_edmundhung">
              <Icon className="w-4 h-4 hover:text-white" symbol="twitter" />
              <span className="sr-only">Twitter</span>
            </Hyperlink>
            <Hyperlink href="/rss.xml">
              <Icon className="w-4 h-4 hover:text-white" symbol="rss" />
              <span className="sr-only">RSS</span>
            </Hyperlink>
          </div>
          <div className="text-center flex flex-1 gap-6 justify-end items-center">
            <NavLink
              className={({ isActive }) =>
                `flex-1 md:flex-none block py-4 decoration-dotted underline-offset-4 ${
                  isActive ? 'text-white' : 'hover:underline'
                }`
              }
              to="/"
            >
              Home
            </NavLink>
            /
            <NavLink
              className={({ isActive }) =>
                `flex-1 md:flex-none block py-4 decoration-dotted underline-offset-4 ${
                  isActive ? 'text-white' : 'hover:underline'
                }`
              }
              to="/about"
            >
              About
            </NavLink>
            /
            <NavLink
              className={({ isActive }) =>
                `flex-1 md:flex-none block py-4 decoration-dotted underline-offset-4 ${
                  isActive ? 'text-white' : 'hover:underline'
                }`
              }
              to="/blog"
            >
              Blog
            </NavLink>
          </div>
        </div>
      </nav>
      <footer className="bg-white font-light text-sm">
        <div className="container mx-auto text-center lg:text-left p-4">
          All rights reserved &copy; Edmund Hung {new Date().getFullYear()}
        </div>
      </footer>
    </>
  );
}

interface TalkLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function TalkLayout({ title, description, children }: TalkLayoutProps) {
  return (
    <>
      <Header reloadDocument />
      <main className="flex flex-col flex-1 reveal">{children}</main>
      <footer className="bg-white font-light text-sm">
        <div className="container mx-auto text-center lg:text-left p-4">
          <div className="flex justify-between">
            <div>{title}</div>
            <div>{description}</div>
          </div>
        </div>
      </footer>
    </>
  );
}
