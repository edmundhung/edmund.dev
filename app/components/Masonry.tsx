import { ReactElement } from 'react';

interface MasonryProps {
  children: ReactElement;
}

function Masonry({ children }: MasonryProps): ReactElement {
  return (
    <div className="grid lg:grid-cols-masonry lg:grid-flow-row-dense lg:auto-rows-fr gap-4">
      {children}
    </div>
  );
}

export default Masonry;
