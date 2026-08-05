import { createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import type { BrandConfig } from '../types/runtime.ts';

export function SiteHeader({ brand }: { readonly brand: BrandConfig }) {
  return createElement(
    'a',
    {
      className: 'site-brand',
      href: '#home',
      'data-home-link': '',
      'aria-label': `${brand.name}首页`
    },
    createElement('span', { className: 'site-brand__mark', 'aria-hidden': 'true' }, '游'),
    createElement(
      'span',
      null,
      createElement('strong', { 'data-brand-name': '' }, brand.name),
      createElement('small', { 'data-brand-tagline': '' }, brand.shortTagline)
    )
  );
}

export function mountSiteHeader(container: HTMLElement, brand: BrandConfig): void {
  const reactRoot = createRoot(container);
  flushSync(() => reactRoot.render(createElement(SiteHeader, { brand })));
}
