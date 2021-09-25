import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { usePendingLocation } from 'remix';

let firstRender = true;

if (
  typeof window !== 'undefined' &&
  window.history.scrollRestoration !== 'manual'
) {
  window.history.scrollRestoration = 'manual';
}

const useSSRLayoutEffect =
  typeof window === 'undefined' ? () => {} : useLayoutEffect;

// FIXME: Remove this when remix ship it officially
// Modified based on https://github.com/remix-run/remix/issues/186#issuecomment-880257502
export function useScrollRestoration() {
  let positions = useRef<Map<string, number>>(new Map()).current;
  let location = useLocation();
  let pendingLocation = usePendingLocation();

  useEffect(() => {
    if (pendingLocation) {
      positions.set(location.key, window.scrollY);
    }
  }, [pendingLocation, location]);

  useSSRLayoutEffect(() => {
    // don't restore scroll on initial render
    if (firstRender) {
      firstRender = false;
      return;
    }
    let y = positions.get(location.key);
    window.scrollTo(0, y || 0);
  }, [location]);
}
