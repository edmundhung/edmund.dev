import type { HeadersFunction, MetaFunction, LoaderFunction } from 'remix';
import { json, useLoaderData } from 'remix';
import Masonry from '~/components/Masonry';
import Card from '~/components/Card';
import type { Context, Entry, WithContext } from '~/types';
import { enhanceMeta } from '~/utils/meta';

export let headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control'),
  };
};

export let meta: MetaFunction = ({ params, location }) => {
  const { category } = params;
  const baseMeta = {
    title: `${category.slice(0, 1).toUpperCase()}${category
      .slice(1)
      .toLowerCase()}`,
  };

  return enhanceMeta(baseMeta, {
    pathname: location.pathname,
  });
};

export let loader: WithContext<LoaderFunction, Context, 'category'> = async ({
  params,
  context,
}) => {
  const references = await context.query('list', params.category);
  const data = {
    references: references ?? [],
  };

  return json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

export default function Category() {
  const { references } = useLoaderData();

  return (
    <Masonry>
      {references.map(({ slug, metadata }) => (
        <Card key={slug} name={slug} metadata={metadata} />
      ))}
    </Masonry>
  );
}
