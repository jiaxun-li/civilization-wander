import { Fragment, createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';

export interface MediaCaptionController {
  attach(container: HTMLElement | null): void;
  update(text: string): void;
  detach(): void;
}

export function MediaCaption({ text }: { readonly text: string }) {
  return createElement(Fragment, null, text);
}

export function createMediaCaptionController(): MediaCaptionController {
  let activeRoot: Root | null = null;
  let caption = '';

  function render(): void {
    if (!activeRoot) return;
    flushSync(() => activeRoot?.render(createElement(MediaCaption, { text: caption })));
  }

  function detach(): void {
    activeRoot?.unmount();
    activeRoot = null;
  }

  return Object.freeze({
    attach(container: HTMLElement | null): void {
      detach();
      caption = '';
      if (!container) return;
      activeRoot = createRoot(container);
      render();
    },
    update(text: string): void {
      caption = text;
      render();
    },
    detach
  });
}
