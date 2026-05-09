import { clientEntry, type Handle } from 'remix/ui';

const FINISH_DELAY_MS = 180;
const MIN_VISIBLE_MS = 420;
const START_WIDTH = 12;
const TRICKLE_DELAY_MS = 120;

let finishTimer: number | undefined;
let listenersStarted = false;
let startedAt = 0;
let trickleTimer: number | undefined;
let visible = false;
let width = 0;
let rerender: (() => void) | undefined;

function updateView() {
  rerender?.();
}

function clearTimers() {
  if (finishTimer !== undefined) {
    window.clearTimeout(finishTimer);
    finishTimer = undefined;
  }

  if (trickleTimer !== undefined) {
    window.clearTimeout(trickleTimer);
    trickleTimer = undefined;
  }
}

function trickle() {
  if (!visible) return;

  trickleTimer = window.setTimeout(() => {
    if (!visible) return;

    width = Math.min(90, width + 10);
    updateView();
    trickle();
  }, TRICKLE_DELAY_MS);
}

function start() {
  clearTimers();
  visible = true;
  startedAt = performance.now();
  width = 0;
  updateView();

  window.requestAnimationFrame(() => {
    if (!visible) return;

    width = START_WIDTH;
    updateView();
    trickle();
  });
}

function finish() {
  if (!visible) return;

  clearTimers();

  let complete = () => {
    width = 100;
    updateView();

    finishTimer = window.setTimeout(() => {
      visible = false;
      width = 0;
      startedAt = 0;
      updateView();
    }, FINISH_DELAY_MS);
  };

  let elapsed = performance.now() - startedAt;
  let remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

  if (remaining > 0) {
    finishTimer = window.setTimeout(complete, remaining);
    return;
  }

  complete();
}

function reset() {
  clearTimers();
  visible = false;
  width = 0;
  startedAt = 0;
  updateView();
}

function startListeners() {
  if (listenersStarted) return;
  if (!Reflect.has(window, 'navigation')) return;

  listenersStarted = true;
  window.navigation.addEventListener('navigate', start);
  window.navigation.addEventListener('navigatesuccess', finish);
  window.navigation.addEventListener('navigateerror', reset);
}

export const ProgressBar = clientEntry(
  '/app/ui/progress-bar.client.tsx#ProgressBar',
  function ProgressBar(handle: Handle) {
    let initialized = false;

    return () => {
      if (!initialized) {
        initialized = true;

        handle.queueTask(() => {
          rerender = () => {
            void handle.update();
          };

          startListeners();

          handle.signal.addEventListener(
            'abort',
            () => {
              if (rerender) {
                rerender = undefined;
              }
            },
            { once: true },
          );
        });
      }

      return (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-50 h-1 bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 transition-[width,opacity] duration-200 ease-out"
          style={{ opacity: visible ? '1' : '0', width: `${width}%` }}
        />
      );
    };
  },
);
