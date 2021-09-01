import { NavLink } from "react-router-dom";
import { LoaderFunction } from "remix";
import { redirect } from "remix";
import stylesUrl from "../styles/index.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
  return (
    <div className="grid grid-cols-12 bg-secondary font-open-sans">
      <aside className="py-4 pl-4 col-start-1 col-end-3">
        <div className="sticky top-4">
          <header className="text-center">
            <img className="mx-auto w-32" src="logo.svg" alt="logo" />
            <h1 className="my-4 uppercase">Edmund.dev</h1>
            <address className="my-8">
              <a className="inline-block rounded-full border border-black p-2 mx-1" href="mailto:contact@edmund.dev">
                <img src="email.svg" className="w-6 h-6" alt="email" />
              </a>
              <a className="inline-block rounded-full border border-black p-2 mx-1" href="https://github.com/edmundhung">
                <img src="github.svg" className="w-6 h-6" alt="Github" />
              </a>
              <a className="inline-block rounded-full border border-black p-2 mx-1" href="https://www.linkedin.com/in/edhung">
                <img src="linkedin.svg" className="w-6 h-6" alt="LinkedIn" />
              </a>
            </address>
          </header>
          <nav className="text-center font-light">
            <NavLink className="block no-underline py-1" activeClassName="font-normal" to="/">Home</NavLink>
            <NavLink className="block no-underline py-1" activeClassName="font-normal" to="/blog">Blog</NavLink>
            <NavLink className="block no-underline py-1" activeClassName="font-normal" to="/bookmarks">Bookmarks</NavLink>
            <NavLink className="block no-underline py-1" activeClassName="font-normal" to="/projects">Projects</NavLink>
            <NavLink className="block no-underline py-1" activeClassName="font-normal" to="/snapshots">Snapshots</NavLink>
          </nav>
        </div>
      </aside>
      <main className="col-start-3 col-end-13 masonry">
        <article className="bg-white rounded"></article>
        <article className="bg-white rounded"></article>
        <article className="bg-white rounded w2h2"></article>
        <article className="bg-white rounded w1h2"></article>
        <article className="bg-white rounded w1h2"></article>
        <article className="bg-white rounded"></article>
      </main>
    </div>
  );
}
