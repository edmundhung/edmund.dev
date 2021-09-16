import type { ReactElement, MutableRefObject } from 'react';
import { useState, useEffect, useRef } from 'react';
import { usePendingLocation } from 'remix';

export function useProgress(): MutableRefObject<HTMLElement> {
  const pendingLocation = usePendingLocation();
  const el = useRef<HTMLElement>();
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!pendingLocation) {
      return;
    }

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    el.current.style.width = `0%`;
    el.current.style.opacity = ``;

    let interval = setInterval(() => {
      if (!el.current) {
        return;
      }

      let width = parseFloat(el.current.style.width);
      let percent = !isNaN(width) ? width : 0;

      el.current.style.width = `${percent * 1.1}%`;
    }, 200);

    return () => {
      clearInterval(interval);
      el.current.style.width = `100%`;
      timeout.current = setTimeout(() => {
        if (el.current?.style.width !== '100%') {
          return;
        }

        el.current.style.width = ``;
        el.current.style.opacity = `0%`;
      }, 200);
    };
  }, [pendingLocation]);

  return el;
}

function Progress(): ReactElement {
  const progress = useProgress();

  return (
    <div className="fixed top-0 left-0 right-0">
      <div className="h-1 flex">
        <div
          ref={progress}
          className="transition-all ease-out bg-gradient-to-r from-green-400 via-blue-500 to-pink-500"
        />
      </div>
    </div>
  );
}

export default Progress;
