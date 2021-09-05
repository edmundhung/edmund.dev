import { ReactElement } from "react";

interface MasonryProps {
  children: ReactElement;
}

function Masonry({ children }: MasonryProps): ReactElement {
  return (
    <div className="grid grid-cols-masonry grid-flow-row-dense auto-rows-fr gap-4 p-4">
      {children}
    </div>
  );
}

export default Masonry;
