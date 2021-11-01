import type { LinksFunction } from 'remix';
import {
  Meta,
  Links,
  Scripts,
  useCatch,
  useLoaderData,
  LiveReload,
  Link,
  NavLink,
  Outlet,
} from 'remix';
import Progress from '~/components/Progress';
import stylesUrl from '~/styles/global.css';
import { useScrollRestoration } from '~/utils/scroll';

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="apple-mobile-web-app-title" content="Edmund.dev" />
        <meta name="application-name" content="Edmund.dev" />
        <meta name="msapplication-TileColor" content="#ebece5" />
        <meta name="theme-color" content="#383835" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
        <Meta />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ebece5" />
        <Links />
      </head>
      <body>
        {children}

        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

export default function App() {
  let data = useLoaderData();

  useScrollRestoration();

  return (
    <Document>
      <Progress />
      <div className="min-h-screen grid md:grid-cols-layout auto-rows-min bg-primary font-open-sans text-primary py-4 md:py-0 md:pl-4 gap-4">
        <header className="px-4 md:px-0 flex flex-row md:flex-col items-center">
          <Link className="block no-underline" to="/" prefetch="intent">
            <img
              className="w-12 md:w-24 lg:w-32 md:py-4"
              src="/assets/logo.svg"
              alt="logo"
            />
          </Link>
          <Link className="block no-underline" to="/" prefetch="intent">
            <h1 className="p-4 md:p-0 uppercase">Edmund.dev</h1>
          </Link>
        </header>
        <main className="px-4 md:px-0 md:py-4 md:pr-4 md:row-span-4 md:h-screen overflow-y-scroll">
          <Outlet />
        </main>
        <nav className="sticky bottom-0 md:static font-light text-center text-xs md:text-base bg-white md:bg-transparent flex flex-row md:flex-col items-center shadow md:shadow-none">
          <NavLink
            className={isActive =>
              `flex-1 md:flex-none block no-underline py-4 md:py-1 md:hover:underline ${
                isActive ? 'font-normal' : ''
              }`.trim()
            }
            to="/articles"
            prefetch="intent"
          >
            Articles
          </NavLink>
          <NavLink
            className={isActive =>
              `flex-1 md:flex-none block no-underline py-4 md:py-1 md:hover:underline ${
                isActive ? 'font-normal' : ''
              }`.trim()
            }
            to="/bookmarks"
            prefetch="intent"
          >
            Bookmarks
          </NavLink>
          <NavLink
            className={isActive =>
              `flex-1 md:flex-none block no-underline py-4 md:py-1 md:hover:underline ${
                isActive ? 'font-normal' : ''
              }`.trim()
            }
            to="/projects"
            prefetch="intent"
          >
            Projects
          </NavLink>
          <NavLink
            className={isActive =>
              `flex-1 md:flex-none block no-underline py-4 md:py-1 md:hover:underline ${
                isActive ? 'font-normal' : ''
              }`.trim()
            }
            to="/snapshots"
            prefetch="intent"
          >
            Snapshots
          </NavLink>
        </nav>
        <footer className="text-center">
          <address>
            <a
              className="inline-block rounded-full p-2 mx-1 border border-secondary hover:border-primary text-secondary hover:text-primary"
              href="mailto:contact@edmund.dev"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="at"
                className="w-6 h-6"
                role="img"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M504 232C504 95.751 394.053 8 256 8 118.94 8 8 118.919 8 256c0 137.059 110.919 248 248 248 52.926 0 104.681-17.079 147.096-48.321 5.501-4.052 6.423-11.924 2.095-17.211l-15.224-18.597c-4.055-4.954-11.249-5.803-16.428-2.041C339.547 442.517 298.238 456 256 456c-110.28 0-200-89.72-200-200S145.72 56 256 56c109.469 0 200 65.02 200 176 0 63.106-42.478 98.29-83.02 98.29-19.505 0-20.133-12.62-16.366-31.463l28.621-148.557c1.426-7.402-4.245-14.27-11.783-14.27h-39.175a12.005 12.005 0 0 0-11.784 9.735c-1.102 5.723-1.661 8.336-2.28 13.993-11.923-19.548-35.878-31.068-65.202-31.068C183.412 128.66 120 191.149 120 281.53c0 61.159 32.877 102.11 93.18 102.11 29.803 0 61.344-16.833 79.749-42.239 4.145 30.846 28.497 38.01 59.372 38.01C451.467 379.41 504 315.786 504 232zm-273.9 97.35c-28.472 0-45.47-19.458-45.47-52.05 0-57.514 39.56-93.41 74.61-93.41 30.12 0 45.471 21.532 45.471 51.58 0 46.864-33.177 93.88-74.611 93.88z"
                ></path>
              </svg>
            </a>
            <a
              className="inline-block rounded-full p-2 mx-1 border border-secondary hover:border-primary text-secondary hover:text-primary"
              href="https://github.com/edmundhung"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="github"
                className="w-6 h-6"
                role="img"
                viewBox="0 0 496 512"
              >
                <path
                  fill="currentColor"
                  d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                ></path>
              </svg>
            </a>
            <a
              className="inline-block rounded-full p-2 mx-1 border border-secondary hover:border-primary text-secondary hover:text-primary"
              href="https://www.linkedin.com/in/edhung"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="linkedin"
                className="w-6 h-6"
                role="img"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"
                ></path>
              </svg>
            </a>
          </address>
        </footer>
      </div>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  switch (caught.status) {
    case 404:
      return (
        <Document>
          <div className="min-h-screen bg-primary font-open-sans text-primary py-4 flex flex-col justify-center items-center">
            <img className="w-32 py-4" src="/assets/logo.svg" alt="logo" />
            <p>Ooops!</p>
            <h1 className="p-4">{`${caught.status} ${caught.statusText}`}</h1>
          </div>
        </Document>
      );
    default:
      throw new Error(
        `Unexpected caught response with status: ${caught.status}`,
      );
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <div className="min-h-screen bg-primary font-open-sans text-primary py-4 flex flex-col justify-center items-center">
        <img className="w-32 py-4" src="/assets/logo.svg" alt="logo" />
        <p>Ooops!</p>
        <h1 className="p-4">500 Internal server error</h1>
      </div>
    </Document>
  );
}
