export interface IconProps {
  'aria-hidden'?: boolean | 'true';
  'className'?: string;
  'symbol':
    | 'logo'
    | 'email'
    | 'github'
    | 'linkedin'
    | 'twitter'
    | 'rss'
    | 'arrow'
    | 'chevron-right';
}

export function Icon() {
  return ({ className, symbol, ...rest }: IconProps) => (
    <svg className={className} {...rest}>
      <use href={`/icons.svg#${symbol}`} />
    </svg>
  );
}
