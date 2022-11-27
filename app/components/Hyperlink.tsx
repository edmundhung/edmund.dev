import { Link, useLocation } from '@remix-run/react';
import type { ReactElement, ReactNode } from 'react';

interface HyperlinkProps {
  to: string;
  className?: string;
  active?: boolean;
  children: ReactElement | ReactNode;
}

const linkStyle = {
  default: 'hover:underline underline-offset-4 decoration-dotted decoration-2',
  active: 'underline',
};

function Hyperlink({
  to,
  className,
  active,
  children,
}: HyperlinkProps): ReactElement {
  const location = useLocation();
  const linkClass = `${className} ${linkStyle.default} ${
    active || location.pathname === to ? linkStyle.active : ''
  }`.trim();
  const isAbsoluteURL =
    to.startsWith('https://') ||
    to.startsWith('http://') ||
    to.startsWith('//');

  if (isAbsoluteURL) {
    return (
      <a className={linkClass} href={to}>
        {children}
      </a>
    );
  }

  return (
    <Link className={linkClass} to={to} prefetch="intent">
      {children}
    </Link>
  );
}

export default Hyperlink;
