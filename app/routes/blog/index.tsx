import type { LoaderFunction } from "remix";
import { redirect } from 'remix';

export let loader: LoaderFunction = async ({ params, context }) => {
  const posts = await context.listPosts();

  if (posts.length === 0) {
    return new Response("Not Found", { status: 404 });
  }

  const [[slug]] = posts;

  return redirect(`/blog/${slug}`);
};

export default function BlogIndex() {
  return null;
}
