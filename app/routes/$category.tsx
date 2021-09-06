import type { LoaderFunction } from "remix";
import { json, useRouteData } from "remix";
import Masonry from '../components/Masonry';
import Card from '../components/Card';
import type { Entry } from '../types';

export let loader: LoaderFunction = async ({ params, context }) => {
  const { category } = params;
  const [entries] = await context.listContent(category);

  return json({ entries }, entries.length > 0 ? 200 : 404);
};

export default function Category() {
  const data = useRouteData<{ entries: Entry[] }>();

  return (
    <Masonry>
      {data.entries.map(({ name, metadata }) => <Card key={name} name={name} metadata={metadata} />)}
    </Masonry>
  );
}
