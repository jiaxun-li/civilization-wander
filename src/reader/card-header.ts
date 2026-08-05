import { Fragment, createElement } from 'react';

export interface CardHeaderViewModel {
  readonly coordinate: string;
  readonly title: string;
  readonly introduction: string;
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
