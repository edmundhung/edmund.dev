import React from 'react';
import ReactMarkdown from 'react-markdown';
import type {
  MetaFunction,
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
} from 'remix';
import { useRouteData, json } from 'remix';
import SyntaxHighlighter from '~/components/SyntaxHighlighter';
import Hyperlink from '~/components/Hyperlink';
import { deriveMetaFromMetadata, enhanceMeta } from '~/meta';

export let headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control'),
  };
};

export let meta: MetaFunction = ({ data, location }) => {
  const meta = deriveMetaFromMetadata(data?.metadata);

  return enhanceMeta(meta, {
    pathname: location.pathname,
    type: 'article',
  });
};

export let loader: LoaderFunction = async ({ params, context }) => {
  const [content, metadata] = await context.getContent('articles', params.slug);
  const data = {
    content,
    metadata,
  };

  return json(data, {
    status: content !== null ? 200 : 404,
    headers: {
      'Cache-Control': 'max-age=3600',
    },
  });
};

export default function ArticleSlug() {
  const { content } = useRouteData();

  return (
    <ReactMarkdown
      className="prose prose-sm"
      components={{
        a({ node, href, ...props }) {
          return <Hyperlink to={href} {...props} />;
        },
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');

          if (inline || !match) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }

          return (
            <SyntaxHighlighter language={match[1]} {...props}>
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
