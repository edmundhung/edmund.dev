import type { HeadersFunction, MetaFunction, LoaderFunction } from "remix";
import { json, useRouteData } from "remix";
import Masonry from '~/components/Masonry';
import Card from '~/components/Card';
import type { Entry } from '~/types';
import { enhanceMeta } from '~/meta';

export let headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control'),
  };
};

export let meta: MetaFunction = ({ params, location }) => {
  const { category } = params;
  const baseMeta = {
    title: `${category.slice(0, 1).toUpperCase()}${category.slice(1).toLowerCase()}`,
  };

  return enhanceMeta(baseMeta, {
    pathname: location.pathname,
  });
};

export let loader: LoaderFunction = async ({ params, context }) => {
  const { category } = params;
  const [entries] = await context.listContent(category);

  return json({ entries }, {
    status: entries.length > 0 ? 200 : 404,
    headers: {
      'Cache-Control': 'max-age=3600',
    },
  });
};

export default function Category() {
  const data = useRouteData<{ entries: Entry[] }>();

  return (
    <Masonry>
      {data.entries.map(({ name, metadata }) => <Card key={name} name={name} metadata={metadata} />)}
    </Masonry>
  );
}
