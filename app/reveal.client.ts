import Reveal from 'reveal.js';
import RevealHighlight from 'reveal.js/plugin/highlight/highlight';

export function initialize() {
  Reveal.initialize({
    hash: true,
    // embedded: true,
    plugins: [RevealHighlight],
  });
}
