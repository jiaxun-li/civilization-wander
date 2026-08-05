import { createElement, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import type {
  AtlasQueries,
  CardViewActions,
  CardViewController,
  CardId,
  ClaimBlock,
  NavigationInteractionEvent,
  NavigationPlacement,
  Scene,
  SceneId,
  TimeSpan
} from '../types/runtime.ts';
import { CardHeader, type CardHeaderViewModel } from './card-header.ts';
import { MediaCaption } from '../media/media-caption.ts';
import { NavigationPreview } from './navigation-preview.ts';

export interface NavigationCardViewModel {
  readonly id: string;
  readonly href: string;
  readonly label: string;
  readonly description: string;
  readonly interactive: boolean;
}

export type PublicBlockViewModel =
  | { readonly id: string; readonly kind: 'historicalCase'; readonly title: string; readonly text: string }
  | { readonly id: string; readonly kind: 'mechanism'; readonly statement: string; readonly steps: readonly string[] }
  | { readonly id: string; readonly kind: 'imageAsset'; readonly src: string; readonly alt: string; readonly caption: string }
  | { readonly id: string; readonly kind: 'assetCaption'; readonly caption: string }
  | { readonly id: string; readonly kind: 'paragraph'; readonly text: string };

export interface SceneViewModel {
  readonly id: SceneId;
  readonly title: string;
  readonly timeLabel: string;
  readonly progressLabel: string;
  readonly presentationKind: Scene['presentation']['kind'];
  readonly blocks: readonly PublicBlockViewModel[];
  readonly navigation: readonly NavigationCardViewModel[];
}

export interface CardViewModel {
  readonly id: CardId;
  readonly header: CardHeaderViewModel;
  readonly hasOptionalMedia: boolean;
  readonly scenes: readonly SceneViewModel[];
  readonly closingNavigation: readonly NavigationCardViewModel[];
}

export interface PreviewViewModel {
  readonly navigationId: string;
  readonly eyebrow: string;
  readonly name: string;
  readonly relation: string;
  readonly summary: string;
  readonly cardTitle: string;
}

export type { CardViewActions, CardViewController, NavigationInteractionEvent } from '../types/runtime.ts';

const EMPTY_ACTIONS: CardViewActions = Object.freeze({
  onNavigationClick() {},
  onPreviewRequest() {},
  onPreviewClose() {}
});

export function formatTimeSpan(timeSpan: TimeSpan = {}): string {
  const start = Number.isInteger(timeSpan.start) ? timeSpan.start ?? null : null;
  const end = Number.isInteger(timeSpan.end) ? timeSpan.end ?? null : null;
  const prefix = timeSpan.approximate ? '约' : '';
  const singleYear = (year: number): string => year < 0
    ? `公元前${Math.abs(year)}年`
    : `公元${year}年`;
  if (start === null && end === null) return '';
  if (start !== null && end === null) return `${prefix}${singleYear(start)}以后`;
  if (start === null && end !== null) return `${prefix}${singleYear(end)}以前`;
  if (start === null || end === null) return '';
  if (start === end) return `${prefix}${singleYear(start)}`;
  if (start < 0 && end < 0) return `${prefix}公元前${Math.abs(start)}—前${Math.abs(end)}年`;
  if (start > 0 && end > 0) return `${prefix}公元${start}—${end}年`;
  return `${prefix}${singleYear(start).replace(/年$/, '')}—${singleYear(end)}`;
}

export function createNavigationCardViewModel(
  queries: AtlasQueries,
  navigationId: string,
  interactive = true
): NavigationCardViewModel | null {
  const navigation = queries.getNavigationOption(navigationId);
  if (!navigation) return null;
  const card = queries.getCard(navigation.target.cardId);
  const sceneId = queries.getNavigationEntrySceneId(navigation);
  if (!card || !sceneId) return null;
  return {
    id: navigation.id,
    href: `#card/${encodeURIComponent(card.id)}/${encodeURIComponent(sceneId)}`,
    label: navigation.label || card.title,
    description: navigation.description,
    interactive
  };
}

function navigationModel(
  queries: AtlasQueries,
  placement: NavigationPlacement
): NavigationCardViewModel | null {
  if (!placement.visible) return null;
  return createNavigationCardViewModel(
    queries,
    placement.navigationOptionId,
    placement.interactive
  );
}

export function createPublicBlockViewModel(
  queries: AtlasQueries,
  block: ClaimBlock
): PublicBlockViewModel {
  switch (block.kind) {
    case 'historicalCase':
      return { id: block.id, kind: 'historicalCase', title: block.title, text: block.text };
    case 'mechanism':
      return { id: block.id, kind: 'mechanism', statement: block.statement, steps: block.steps };
    case 'asset': {
      const asset = queries.getAsset(block.assetId);
      if (!asset) return { id: block.id, kind: 'assetCaption', caption: block.caption || '' };
      if (asset.type === 'image') {
        return {
          id: block.id,
          kind: 'imageAsset',
          src: asset.src,
          alt: asset.alt,
          caption: block.caption || ''
        };
      }
      return { id: block.id, kind: 'assetCaption', caption: block.caption || asset.alt };
    }
    case 'geographyObservation':
    case 'historicalFact':
    case 'interpretation':
    case 'editorialSynthesis':
    case 'narrativeTransition':
    case 'sourceNote':
      return { id: block.id, kind: 'paragraph', text: block.text };
    default:
      throw new TypeError(
        `ClaimBlock kind ${String((block as ClaimBlock).kind)} is not valid public Scene content`
      );
  }
}

export function createCardViewModel(
  queries: AtlasQueries,
  cardId: CardId
): CardViewModel | null {
  const card = queries.getCard(cardId);
  if (!card) return null;
  const entity = queries.getEntity(card.primaryEntityId);
  const scenes = queries.getScenesForCard(card.id);
  const coordinate = [
    entity?.name || '',
    formatTimeSpan(entity?.timeSpan || card.timeSpan)
  ].filter(Boolean).join(' · ');
  const sceneModels = scenes.map((scene, index): SceneViewModel => ({
    id: scene.id,
    title: scene.title,
    timeLabel: scene.timeDisplay === 'undatedNarrative'
      ? '叙事时间 · 无可考年份'
      : scene.timeSpan.label,
    progressLabel: `${String(index + 1).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`,
    presentationKind: scene.presentation.kind,
    blocks: scene.contentBlocks.map(block => createPublicBlockViewModel(queries, block)),
    navigation: queries.getNavigationPlacementsForScene(scene.id, 'inline')
      .map(placement => navigationModel(queries, placement))
      .filter((item): item is NavigationCardViewModel => Boolean(item))
  }));
  return {
    id: card.id,
    header: {
      coordinate,
      title: card.title,
      introduction: card.introduction
    },
    hasOptionalMedia: scenes.some(scene => scene.presentation.kind !== 'textOnly'),
    scenes: sceneModels,
    closingNavigation: queries.getNavigationPlacementsForCard(card.id, 'closing')
      .filter(placement => placement.visible)
      .slice(0, 4)
      .map(placement => navigationModel(queries, placement))
      .filter((item): item is NavigationCardViewModel => Boolean(item))
  };
}

export function createPreviewViewModel(
  queries: AtlasQueries,
  navigationId: string
): PreviewViewModel | null {
  const navigation = queries.getNavigationOption(navigationId);
  if (!navigation) return null;
  const card = queries.getCard(navigation.target.cardId);
  if (!card) return null;
  const entity = queries.getEntity(card.primaryEntityId) ?? null;
  const edge = navigation.basis.kind === 'structuralEdge'
    ? queries.getStructuralEdge(navigation.basis.structuralEdgeId)
    : null;
  return {
    navigationId,
    eyebrow: entity ? queries.getEntityTypeLabel(entity.type) || entity.type : '延伸阅读',
    name: entity?.name || card.title,
    relation: edge?.label.forward || navigation.label,
    summary: edge?.summaries.canonical || navigation.description || entity?.canonicalSummary || '',
    cardTitle: card.title
  };
}

export function PublicContentBlock({ block }: { readonly block: PublicBlockViewModel }): ReactNode {
  switch (block.kind) {
    case 'historicalCase':
      return createElement(
        'p',
        { className: 'v4-scene__case' },
        createElement('strong', null, block.title),
        ` ${block.text}`
      );
    case 'mechanism':
      return createElement(
        'div',
        { className: 'v4-scene__mechanism' },
        createElement('p', null, createElement('strong', null, block.statement)),
        createElement('ol', null, ...block.steps.map((step, index) => createElement('li', { key: index }, step)))
      );
    case 'imageAsset':
      return createElement(
        'figure',
        { className: 'v4-scene__asset' },
        createElement('img', { src: block.src, alt: block.alt, loading: 'lazy', decoding: 'async' }),
        block.caption ? createElement('figcaption', null, block.caption) : null
      );
    case 'assetCaption':
      return createElement('figure', { className: 'v4-scene__asset' }, createElement('figcaption', null, block.caption));
    case 'paragraph':
      return createElement('p', null, block.text);
  }
}

export function NavigationCard({
  model,
  expanded,
  actions = EMPTY_ACTIONS
}: {
  readonly model: NavigationCardViewModel;
  readonly expanded: boolean;
  readonly actions?: CardViewActions;
}) {
  const content = createElement('strong', { className: 'v4-small-card__title' }, model.label);
  if (!model.interactive) {
    return createElement('article', { className: 'v4-small-card is-noninteractive', 'aria-disabled': 'true' }, content);
  }
  return createElement(
    'a',
    {
      className: 'v4-small-card',
      href: model.href,
      'data-navigation-id': model.id,
      'data-preview-navigation-id': model.id,
      'aria-label': `${model.label}：${model.description}`,
      'aria-controls': 'v4-navigation-preview',
      'aria-expanded': expanded,
      onClick(event: ReactMouseEvent<HTMLAnchorElement>) {
        actions.onNavigationClick(model.id, event);
      },
      onMouseEnter() { actions.onPreviewRequest(model.id); },
      onFocus() { actions.onPreviewRequest(model.id); },
      onMouseLeave() { actions.onPreviewClose(); },
      onBlur() { actions.onPreviewClose(); }
    },
    content
  );
}

function SceneView({
  model,
  active,
  previewNavigationId,
  actions
}: {
  readonly model: SceneViewModel;
  readonly active: boolean;
  readonly previewNavigationId: string | null;
  readonly actions: CardViewActions;
}) {
  return createElement(
    'section',
    {
      className: `v4-scene${active ? ' is-active' : ''}`,
      id: `scene-${model.id}`,
      'data-scene-id': model.id,
      'data-presentation-kind': model.presentationKind,
      tabIndex: -1,
      'aria-labelledby': `scene-title-${model.id}`,
      'aria-current': active ? 'step' : 'false'
    },
    createElement(
      'div',
      { className: 'v4-scene__inner' },
      createElement(
        'p',
        { className: 'v4-scene__time' },
        model.timeLabel,
        ' ',
        createElement('span', { className: 'v4-scene__progress' }, `· ${model.progressLabel}`)
      ),
      createElement('h2', { id: `scene-title-${model.id}` }, model.title),
      createElement(
        'div',
        { className: 'v4-scene__copy' },
        ...model.blocks.map(block => createElement(PublicContentBlock, { key: block.id, block }))
      ),
      model.navigation.length
        ? createElement(
            'nav',
            { className: 'v4-scene__navigation', 'aria-label': '从本段继续探索' },
            ...model.navigation.map(item => createElement(NavigationCard, {
              key: item.id,
              model: item,
              expanded: previewNavigationId === item.id,
              actions
            }))
          )
        : null
    )
  );
}

export function CardView({
  model,
  activeSceneId,
  mediaVisible,
  mediaCaption,
  preview,
  entryTransition,
  actions = EMPTY_ACTIONS
}: {
  readonly model: CardViewModel;
  readonly activeSceneId: SceneId;
  readonly mediaVisible: boolean;
  readonly mediaCaption: string;
  readonly preview: PreviewViewModel | null;
  readonly entryTransition: 'initial' | 'active' | null;
  readonly actions?: CardViewActions;
}) {
  const articleClasses = [
    'v4-main-card',
    model.hasOptionalMedia ? '' : 'is-text-only-card',
    model.hasOptionalMedia && !mediaVisible ? 'is-media-hidden' : '',
    entryTransition ? 'is-entering-forward' : '',
    entryTransition === 'active' ? 'is-entering-forward-active' : ''
  ].filter(Boolean).join(' ');
  return createElement(
    'article',
    { className: articleClasses, 'data-card-id': model.id },
    createElement('header', { className: 'v4-main-card__header' }, createElement(CardHeader, model.header)),
    createElement(
      'div',
      { className: 'v4-main-card__layout' },
      model.hasOptionalMedia
        ? createElement(
            'aside',
            {
              className: 'v4-main-card__media',
              'data-card-media': '',
              'aria-live': 'polite',
              hidden: !mediaVisible
            },
            createElement('div', {
              className: 'v4-main-card__map-slot',
              'data-map-slot': '',
              'aria-label': '随当前阅读内容更新的辅助图像'
            }),
            createElement(
              'p',
              { className: 'v4-main-card__media-caption', 'data-media-caption': '' },
              createElement(MediaCaption, { text: mediaCaption })
            )
          )
        : null,
      createElement(
        'div',
        { className: 'v4-main-card__scenes' },
        ...model.scenes.map(scene => createElement(SceneView, {
          key: scene.id,
          model: scene,
          active: scene.id === activeSceneId,
          previewNavigationId: preview?.navigationId || null,
          actions
        })),
        model.closingNavigation.length
          ? createElement(
              'footer',
              { className: 'v4-main-card__closing' },
              createElement('p', { className: 'v4-main-card__eyebrow' }, '继续漫游'),
              createElement('h2', null, '换一个历史视角'),
              createElement(
                'div',
                { className: 'v4-main-card__recommendations' },
                ...model.closingNavigation.map(item => createElement(NavigationCard, {
                  key: item.id,
                  model: item,
                  expanded: preview?.navigationId === item.id,
                  actions
                }))
              )
            )
          : null
      )
    ),
    createElement(
      'div',
      {
        className: 'v4-preview-layer',
        id: 'v4-navigation-preview',
        'data-preview-layer': '',
        'data-open': preview ? 'true' : undefined,
        'aria-live': 'polite'
      },
      preview ? createElement(NavigationPreview, preview) : null
    )
  );
}

export function createCardViewController({
  root,
  queries
}: {
  readonly root: HTMLElement;
  readonly queries: AtlasQueries;
}): CardViewController {
  const reactRoot: Root = createRoot(root);
  let model: CardViewModel | null = null;
  let activeSceneId: SceneId | null = null;
  let mediaVisible = false;
  let mediaCaption = '';
  let preview: PreviewViewModel | null = null;
  let entryTransition: 'initial' | 'active' | null = null;
  let actions: CardViewActions = EMPTY_ACTIONS;

  function render(): void {
    if (!model || !activeSceneId) return;
    const currentModel = model;
    const currentSceneId = activeSceneId;
    flushSync(() => reactRoot.render(createElement(CardView, {
      model: currentModel,
      activeSceneId: currentSceneId,
      mediaVisible,
      mediaCaption,
      preview,
      entryTransition,
      actions
    })));
  }

  return Object.freeze({
    renderCard(cardId: CardId, nextActiveSceneId: SceneId, nextActions: CardViewActions): void {
      const nextModel = createCardViewModel(queries, cardId);
      if (!nextModel) throw new Error(`Unknown story: ${cardId}`);
      model = nextModel;
      activeSceneId = nextActiveSceneId;
      mediaVisible = nextModel.hasOptionalMedia;
      mediaCaption = '';
      preview = null;
      entryTransition = null;
      actions = nextActions;
      render();
    },
    setActiveScene(sceneId: SceneId): void {
      if (!model?.scenes.some(scene => scene.id === sceneId) || activeSceneId === sceneId) return;
      activeSceneId = sceneId;
      render();
    },
    setMediaVisible(visible: boolean): void {
      if (!model?.hasOptionalMedia || mediaVisible === visible) return;
      mediaVisible = visible;
      render();
    },
    setMediaCaption(text: string): void {
      if (mediaCaption === text) return;
      mediaCaption = text;
      render();
    },
    openPreview(navigationId: string): boolean {
      const nextPreview = createPreviewViewModel(queries, navigationId);
      if (!nextPreview) return false;
      preview = nextPreview;
      render();
      return true;
    },
    closePreview(): void {
      if (!preview) return;
      preview = null;
      render();
    },
    setEntryTransition(phase: 'initial' | 'active' | null): void {
      if (entryTransition === phase) return;
      entryTransition = phase;
      render();
    },
    getSceneElements(): readonly HTMLElement[] {
      return Array.from(root.querySelectorAll<HTMLElement>('[data-scene-id]'));
    },
    getSceneElement(sceneId: SceneId): HTMLElement | null {
      return Array.from(root.querySelectorAll<HTMLElement>('[data-scene-id]'))
        .find(element => element.dataset.sceneId === sceneId) || null;
    },
    getMapSlot(): HTMLElement | null {
      return root.querySelector<HTMLElement>('[data-map-slot]');
    },
    focusHeading(): void {
      root.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
    },
    destroy(): void {
      reactRoot.unmount();
      model = null;
      activeSceneId = null;
      preview = null;
    }
  });
}
