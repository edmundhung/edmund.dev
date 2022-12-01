import type { RenderableTreeNodes } from '@markdoc/markdoc';
import { renderers } from '@markdoc/markdoc';
import { Link, useLocation } from '@remix-run/react';
import * as React from 'react';
import ReactSyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism-light';
import ts from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import diff from 'react-syntax-highlighter/dist/cjs/languages/prism/diff';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import sh from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import style from 'react-syntax-highlighter/dist/cjs/styles/prism/night-owl';
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
  default: 'underline-offset-4 decoration-dotted decoration-current',
  active: 'underline hover:decoration-2',
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
    href.startsWith('//');

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
