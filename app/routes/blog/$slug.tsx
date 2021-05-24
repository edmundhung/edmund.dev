import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { useRouteData, redirect } from "remix";
import { parse } from '../../markdown.server';

export let meta: MetaFunction = ({ data }) => {
  return {
    title: `${data?.metadata?.title ?? 'Blog'} - EdStudio`,
  };
};

export let loader: LoaderFunction = async ({ params, context }) => {
  const post = await context.getPost(params.slug);

  if (post === null) {
    return redirect('/blog');
  }

  return {
    content: await parse(post.value),
    metadata: post.metadata,
  };
};

export default function BlogSlug() {
  const { content } = useRouteData();

  return (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
}
