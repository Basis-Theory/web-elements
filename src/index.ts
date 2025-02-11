import { basistheory } from './BasisTheory';

declare global {
  interface Window {
    basistheory?: typeof basistheory;
  }
}

/**
 * Attaches to window when importing via `<script>` tags.
 */
if (
  typeof window !== 'undefined' &&
  document.currentScript &&
  !window.basistheory
) {
  window.basistheory = basistheory;
}

export * from './BasisTheory';
export * from './types';
