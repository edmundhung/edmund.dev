import type { Query, Reference } from '@workaholic/core';
import type { HeadersFunction, MetaFunction, LoaderFunction } from 'remix';
import { json, useLoaderData } from 'remix';
import Masonry from '~/components/Masonry';
import Card from '~/components/Card';
import type { Entry } from '~/types';
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

export let loader: LoaderFunction = async ({ params, context }) => {
  const { query } = context as { query: Query };
  const references = await query('list', params.category);

  return json(references ?? [], {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

export default function Category() {
  const references = useLoaderData<Reference[]>();

  return (
    <Masonry>
      {references.map(({ slug, metadata }) => (
        <Card key={slug} name={slug} metadata={metadata} />
      ))}
    </Masonry>
  );
}
