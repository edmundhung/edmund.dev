import type { ReactElement, SVGAttributes } from 'react';
import iconURL from '~/icons.svg';

interface IconProps extends SVGAttributes<SVGElement> {
  symbol: 'logo' | 'email' | 'github' | 'linkedin';
}

function Icon({ symbol, ...rest }: IconProps): ReactElement {
  return (
    <svg {...rest}>
      <use href={`${iconURL}#${symbol}`} />
    </svg>
  );
}

export default Icon;
