import React from 'react';
import ReactMarkdown from 'react-markdown';
import type {
  MetaFunction,
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
} from 'remix';
import { useRouteData, json } from 'remix';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
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
        a: ({ node, href, ...props }) => <Hyperlink to={href} {...props} />,
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');

          if (inline) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }

          const language = match ? match[1] : null;

          return (
            <SyntaxHighlighter
              style={github}
              showLineNumbers={language === 'tsx'}
              language={language}
              PreTag="div"
              wrapLongLines
              {...props}
            >
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
