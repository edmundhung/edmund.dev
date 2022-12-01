import {
  type LoaderArgs,
  type MetaFunction,
  json,
} from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { Markdown } from '~/components';
import { parse } from '~/markdoc';
import { generateMetaDescriptor } from '~/utils/meta';

export async function loader({ context, params }: LoaderArgs) {
  const post = await context.github.getPost(params.slug as string);

  return json({
    ...post.metadata,
    content: parse(post.value),
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return generateMetaDescriptor({
    title: data.title,
    description: data.description,
  });
};

export default function Post() {
  const { date, content } = useLoaderData<typeof loader>();

  return (
    <div className="mt-16 mb-16 sm:mt-32">
      <div className="mx-auto xl:max-w-4xl container px-4">
        <time className="block mb-4" dateTime={date}>
          {new Date(date).toLocaleDateString('en', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <Markdown content={content} />
      </div>
    </div>
  );
}
