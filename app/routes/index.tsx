import type { Query, Reference } from '@workaholic/core';
import type { HeadersFunction, LoaderFunction, MetaFunction } from 'remix';
import { json, useLoaderData } from 'remix';
import Masonry from '~/components/Masonry';
import Card from '~/components/Card';
import type { Context, Entry, WithContext } from '~/types';
import { enhanceMeta } from '~/utils/meta';

export let meta: MetaFunction = ({ location }) => {
  const baseMeta = {
    description: `I'm Edmund, a web engineer specialised in frontend development. Currently working as a frontend developer at @PPRO. Enjoy biking and photography in my leisure time.`,
    keywords: ['web', 'engineer', 'react'].join(','),
  };

  return enhanceMeta(baseMeta, {
    pathname: location.pathname,
  });
};

export let headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control'),
  };
};

export let loader: WithContext<LoaderFunction, Context> = async ({
  context,
}) => {
  const references = await context.query('list', '', {
    includeSubfolders: true,
  });

  return json(references ?? [], {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

export default function Index() {
  const references = useLoaderData<Reference[]>();

  return (
    <Masonry>
      {references.map(({ slug, metadata }) => (
        <Card key={slug} name={slug} metadata={metadata} />
      ))}
    </Masonry>
  );
}
