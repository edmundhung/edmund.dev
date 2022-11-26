import { Link } from '@remix-run/react';
import type { ReactElement } from 'react';

interface HyperlinkProps {
  to: string;
  className?: string;
  children: ReactElement;
}

function Hyperlink({ to, className, children }: HyperlinkProps): ReactElement {
  const isAbsoluteURL =
    to.startsWith('https://') ||
    to.startsWith('http://') ||
    to.startsWith('//');

  if (isAbsoluteURL) {
    return (
      <a className={className} href={to}>
        {children}
      </a>
    );
  }

  return (
    <Link className={className} to={to} prefetch="intent">
      {children}
    </Link>
  );
}

export default Hyperlink;
