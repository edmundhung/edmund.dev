import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { useRouteData, json } from "remix";
import { parse } from '../markdown.server';

export let meta: MetaFunction = ({ data }) => {
  return {
    title: `${data?.metadata?.title ?? 'Blog'} - Edmund.dev`,
  };
};

export let loader: LoaderFunction = async ({ params, context }) => {
  const [content, metadata] = await context.getContent('blog', params.slug);

  if (content === null) {
    return json({}, 404);
  }

  return {
    content: await parse(content),
    metadata,
  };
};

export default function BlogSlug() {
  const { content } = useRouteData();

  return (
    <div className="p-4" dangerouslySetInnerHTML={{ __html: content }} />
  );
}
