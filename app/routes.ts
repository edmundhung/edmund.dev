import { route } from 'remix/fetch-router/routes';

export const routes = route({
  home: '/',
  about: '/about',
  snapshots: '/snapshots',
  blog: {
    index: '/blog',
    show: '/blog/:slug',
  },
  rss: '/rss.xml',
  sitemap: '/sitemap.xml',
});
