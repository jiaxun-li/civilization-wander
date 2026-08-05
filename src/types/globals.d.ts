import type { GeneratedNaturalEarthVector } from './runtime';

declare global {
  interface Window {
    ATLAS_WORLD_VECTOR?: GeneratedNaturalEarthVector;
  }
}

export {};
