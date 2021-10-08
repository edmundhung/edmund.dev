import type { HeadersFunction, LoaderFunction, MetaFunction } from 'remix';
import { json, useLoaderData } from 'remix';
import Masonry from '~/components/Masonry';
import Card from '~/components/Card';
import type { Entry } from '~/types';
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

export let loader: LoaderFunction = async ({ params, context }) => {
  const [entries] = await context.listContent();

  return json(
    { entries },
    {
      status: entries.length > 0 ? 200 : 404,
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    },
  );
};

export default function Index() {
  const data = useLoaderData<{ entries: Entry[] }>();

  return (
    <Masonry>
      {data.entries.map(({ name, metadata }) => (
        <Card key={name} name={name} metadata={metadata} />
      ))}
    </Masonry>
  );
}
