import type { MetaFunction, HeadersFunction, LinksFunction, LoaderFunction } from "remix";
import { useRouteData, json } from "remix";
import { parse } from '../markdown.server';

export let headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control'),
  };
};

export let meta: MetaFunction = ({ data }) => {
  return {
    title: `${data?.metadata?.title ?? 'Blog'} - Edmund.dev`,
  };
};

export let loader: LoaderFunction = async ({ params, context }) => {
  const [content, metadata] = await context.getContent('blog', params.slug);
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
    <div className="p-4 prose prose-sm" dangerouslySetInnerHTML={{ __html: content }} />
  );
}
