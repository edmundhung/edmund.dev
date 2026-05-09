import { createRouter } from 'remix/fetch-router';

import { about } from './controllers/about.tsx';
import { blog } from './controllers/blog/controller.tsx';
import { home } from './controllers/home.tsx';
import { rss } from './controllers/rss.tsx';
import { sitemap } from './controllers/sitemap.tsx';
import { routes } from './routes.ts';
import { NotFoundPage } from './ui/not-found-page.tsx';
import { render } from './utils/render.tsx';

export const router = createRouter({
  defaultHandler({ request, url }) {
    return render(<NotFoundPage pathname={url.pathname} />, request, {
      status: 404,
    });
  },
});

router.map(routes.home, home);
router.map(routes.about, about);
router.map(routes.blog, blog);
router.map(routes.rss, rss);
router.map(routes.sitemap, sitemap);
