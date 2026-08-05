import { createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import type {
  AtlasQueries,
  CardComponents,
  NavigationPreviewRenderer
} from '../types/runtime.ts';

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

export function createNavigationPreviewRenderer({
  components,
  queries
}: {
  readonly components: CardComponents;
  readonly queries: AtlasQueries;
}): NavigationPreviewRenderer {
  let activeRoot: Root | null = null;
  let activeLayer: HTMLElement | null = null;

  function close(layer: HTMLElement | null = activeLayer): void {
    if (activeRoot) activeRoot.unmount();
    activeRoot = null;
    (layer || activeLayer)?.removeAttribute('data-open');
    activeLayer = null;
  }

  function open(layer: HTMLElement, navigationId: string): boolean {
    close();
    const context = components.targetContext(navigationId);
    if (!context) return false;
    const { navigation, card, entity } = context;
    const edge = navigation.basis?.kind === 'structuralEdge'
      ? queries.getStructuralEdge(navigation.basis.structuralEdgeId)
      : null;
    const model: NavigationPreviewProps = {
      navigationId,
      eyebrow: entity ? queries.getEntityTypeLabel(entity.type) || entity.type : '延伸阅读',
      name: entity?.name || card.title,
      relation: edge?.label?.forward || navigation.label,
      summary: edge?.summaries?.canonical || navigation.description || entity?.canonicalSummary || '',
      cardTitle: card.title
    };
    activeLayer = layer;
    activeRoot = createRoot(layer);
    flushSync(() => activeRoot?.render(createElement(NavigationPreview, model)));
    layer.setAttribute('data-open', 'true');
    return true;
  }

  return Object.freeze({ open, close });
}
