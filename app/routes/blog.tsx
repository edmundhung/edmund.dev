import { Link, Outlet } from "react-router-dom";
import type { MetaFunction, LoaderFunction } from "remix";
import { useRouteData } from "remix";

export let meta: MetaFunction = () => {
  return {
    title: "Blog - EdStudio",
  };
};

export let loader: LoaderFunction = async ({ context }) => {
  const posts = await context.listPosts();

  return {
    posts: posts.slice(0, 5),
  };
};

export default function Blog() {
  let { posts } = useRouteData();

  return (
    <main className="grid grid-cols-2 gap-x-8 gap-y-32">
      <article className="pt-6 row-start-1 row-end-auto col-start-2 col-end-3">
        <Outlet />
      </article>
      <nav className="row-start-1 row-end-auto col-start-1 col-end-2">
        <div className="sticky top-0 pt-6">
          <h2 className="mt-0 mb-16">Archive</h2>
          <ul className="list-outside">
            {posts.map(([slug, metadata]) => (
              <li key={slug}>
                <Link to={slug}>{metadata?.title ?? slug}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <address className="not-italic">
        <h2 className="mt-0 mb-16">Contact me</h2>
        <a className="block" href="mailto:contact@edmund.dev">Email</a>
        <a className="block" href="https://github.com/edmund-dev" rel="noopener noreferrer" target="_blank">Github</a>
        <a className="block" href="https://www.linkedin.com/in/edhung/" rel="noopener noreferrer" target="_blank">LinkedIn</a>
      </address>
      <aside>
        <h2 className="mt-0 mb-16">About</h2>
        <p>I'm Edmund, a web engineer specialised in frontend development.</p>
        <p>Currently working as a frontend developer at @PPRO. Enjoy biking and photography in my leisure time.</p>
      </aside>
    </main>
  );
}
