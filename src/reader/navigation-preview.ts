import { createElement } from 'react';

interface NavigationPreviewProps {
  readonly navigationId: string;
  readonly eyebrow: string;
  readonly name: string;
  readonly relation: string;
  readonly summary: string;
  readonly cardTitle: string;
}

export function NavigationPreview({
  navigationId,
  eyebrow,
  name,
  relation,
  summary,
  cardTitle
}: NavigationPreviewProps) {
  return createElement(
    'aside',
    {
      className: 'v4-preview-card',
      role: 'tooltip',
      'data-preview-card': navigationId
    },
    createElement('span', { className: 'v4-preview-card__eyebrow' }, eyebrow),
    createElement('strong', null, name),
    createElement('span', null, relation),
    createElement('p', null, summary),
    createElement('small', null, cardTitle)
  );
}
