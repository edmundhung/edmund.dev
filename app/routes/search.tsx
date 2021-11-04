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

export let meta: MetaFunction = ({ location }) => {
  const searchParams = new URLSearchParams(location.search);
  const baseMeta = {
    title: `Search: ${searchParams.get('tag')}`,
  };

  return enhanceMeta(baseMeta, {
    pathname: location.pathname,
  });
};

export let loader: LoaderFunction = async ({ context, request }) => {
  const { query } = context as { query: Query };
  const url = new URL(request.url);
  const tag = url.searchParams.get('tag');
  const references = await query('tags', tag);
  const data = {
    tag,
    references: references ?? [],
  };

  return json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

export default function Search() {
  const { tag, references } = useLoaderData();

  if (references.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className="p-4">
          Sorry, no matching result has been found based on your criteria.
        </h1>
      </div>
    );
  }

  return (
    <Masonry>
      {references.map(({ slug, metadata }) => (
        <Card key={slug} name={slug} metadata={metadata} />
      ))}
    </Masonry>
  );
}
