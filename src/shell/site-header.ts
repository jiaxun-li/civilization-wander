import { createElement, type MouseEvent as ReactMouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import type { BrandConfig } from '../types/runtime.ts';

interface SiteHeaderProps {
  readonly brand: BrandConfig;
  readonly onGoHome: () => void;
}

export function SiteHeader({ brand, onGoHome }: SiteHeaderProps) {
  return createElement(
    'a',
    {
      className: 'site-brand',
      href: '#home',
      'data-home-link': '',
      'aria-label': `${brand.name}首页`,
      onClick(event: ReactMouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        onGoHome();
      }
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

export function mountSiteHeader(
  container: HTMLElement,
  brand: BrandConfig,
  onGoHome: () => void
): void {
  const reactRoot = createRoot(container);
  flushSync(() => reactRoot.render(createElement(SiteHeader, { brand, onGoHome })));
}
