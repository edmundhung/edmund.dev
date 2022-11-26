import { type MetaFunction } from '@remix-run/cloudflare';
import { enhanceMeta } from '~/utils/meta';

export let meta: MetaFunction = ({ location }) => {
  const baseMeta = {
    description: `I'm Edmund, a web engineer specialised in frontend development. Currently working as a frontend developer at @PPRO. Enjoy biking and photography in my leisure time.`,
    keywords: ['web', 'engineer', 'react'].join(','),
  };

  return enhanceMeta(baseMeta, {
    pathname: location.pathname,
  });
};

export default function Index() {
  return <div />;
}
