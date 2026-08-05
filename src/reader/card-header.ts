import { Fragment, createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';

export interface CardHeaderViewModel {
  readonly coordinate: string;
  readonly title: string;
  readonly introduction: string;
}

export interface CardHeaderController {
  attach(container: HTMLElement | null, model: CardHeaderViewModel): void;
  detach(): void;
}

export function CardHeader({ coordinate, title, introduction }: CardHeaderViewModel) {
  return createElement(
    Fragment,
    null,
    createElement('p', { className: 'v4-main-card__coordinate' }, coordinate),
    createElement('h1', { tabIndex: -1 }, title),
    createElement('p', { className: 'v4-main-card__introduction' }, introduction)
  );
}

export function createCardHeaderController(): CardHeaderController {
  let activeRoot: Root | null = null;

  function detach(): void {
    activeRoot?.unmount();
    activeRoot = null;
  }

  return Object.freeze({
    attach(container: HTMLElement | null, model: CardHeaderViewModel): void {
      detach();
      if (!container) return;
      activeRoot = createRoot(container);
      flushSync(() => activeRoot?.render(createElement(CardHeader, model)));
    },
    detach
  });
}
