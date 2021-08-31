import type { LoaderFunction } from "remix";
import { redirect } from "remix";
import stylesUrl from "../styles/index.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
  return (
    <main className="masonry">
      <aside className="w1h2">
        <div className="logo">
          <img src="logo.svg" width="100px" height="100px" alt="logo" />
          <h1>Edmund.dev</h1>
        </div>
      </aside>
      <article></article>
      <article className="w1h2"></article>
      <article className="w2h2"></article>
      <article className="w1h2"></article>
      <article></article>
    </main>
  );
}
