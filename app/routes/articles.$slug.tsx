import type {
  MetaFunction,
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
} from 'remix';
import { useRouteData, json } from 'remix';
import { parse } from '~/markdown.server';
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
    content: content ? await parse(content) : null,
    metadata,
  };

  return json(data, {
    status: content !== null ? 200 : 404,
    headers: {
      'Cache-Control': 'max-age=3600',
    },
  });
};

export default function BlogSlug() {
  const { content } = useRouteData();

  return (
    <div
      className="prose prose-sm"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
