import type { LoaderFunction } from 'remix';
import { useLoaderData } from 'remix';
import type { Context, WithContext } from '~/types';

export let loader: WithContext<LoaderFunction, Context, 'slug'> = async ({
  request,
  params,
  context,
}) => {
  const accept = request.headers.get('accept');
  const image = await context.query('images', params.slug, { accept });

  if (!image) {
    return null;
  }

  return new Response(image.data, {
    headers: {
      'content-type': image.mimeType,
      'cache-control': 'public, max-age=31536000',
    },
  });
};
