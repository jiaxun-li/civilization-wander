import type {
  AtlasHistoryState,
  AtlasQueries,
  Card,
  CardId,
  CardViewActions,
  CardReader,
  CardReaderModule,
  LastReadSnapshot,
  MapPresentationConfig,
  MapState,
  NavigationInteractionEvent,
  NavigationTrailEntry,
  ReaderContext,
  ReaderState,
  RenderCardOptions,
  ResolvedSceneMedia,
  Scene,
  SceneDirection,
  SceneId,
  ScenePresentation,
  StructureView
} from '../types/runtime.ts';

type CreateCardReaderOptions = Parameters<CardReaderModule['createCardReader']>[0];
type UnknownRecord = Record<string, unknown>;
type SceneObserverOptions = {
  updateInitialHistory?: boolean;
  initialTrigger?: string;
};
type RenderedCard = { card: Card; scene: Scene };

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === 'object' ? value as UnknownRecord : null;
}

export function buildCardHash(cardId: CardId, sceneId: SceneId): string {
    return `#card/${encodeURIComponent(cardId)}/${encodeURIComponent(sceneId)}`;
  }

export function parseCardHash(hash = ''): { cardId: CardId; sceneId: SceneId | null } | null {
    const match = String(hash).match(/^#card\/([^/]+)(?:\/([^/]+))?$/);
    if (!match) return null;
    try {
      return {
        cardId: decodeURIComponent(match[1]),
        sceneId: match[2] ? decodeURIComponent(match[2]) : null
      };
    } catch {
      return null;
    }
  }

export function deriveSceneDirection(
  queries: AtlasQueries,
  cardId: CardId,
  fromSceneId: SceneId | null,
  toSceneId: SceneId
): SceneDirection {
    if (!fromSceneId || fromSceneId === toSceneId) return 'stationary';
    const card = queries.getCard(cardId);
    const fromIndex = card?.sceneIds.indexOf(fromSceneId) ?? -1;
    const toIndex = card?.sceneIds.indexOf(toSceneId) ?? -1;
    if (fromIndex < 0 || toIndex < 0) return 'stationary';
    return toIndex > fromIndex ? 'forward' : 'backward';
  }

export function resolveSceneMedia(
  queries: AtlasQueries,
  cardId: CardId,
  sceneId: SceneId
): ResolvedSceneMedia | null {
    const card = queries.getCard(cardId);
    const scene = queries.getScene(sceneId);
    if (!card || !scene || !card.sceneIds.includes(scene.id)) return null;
    if (scene.presentation.kind !== 'textOnly') {
      return { presentation: scene.presentation, presentationScene: scene, inherited: false };
    }
    const sceneIndex = card.sceneIds.indexOf(scene.id);
    for (let index = sceneIndex - 1; index >= 0; index -= 1) {
      const previousScene = queries.getScene(card.sceneIds[index]);
      if (previousScene && previousScene.presentation.kind !== 'textOnly') {
        return {
          presentation: previousScene.presentation,
          presentationScene: previousScene,
          inherited: true
        };
      }
    }
    return { presentation: scene.presentation, presentationScene: scene, inherited: false };
  }

export function createCardReader(options: CreateCardReaderOptions): CardReader {
    const {
      queries,
      view,
      windowRef,
      onBeforeCardChange = () => {},
      onPresentationChange = () => {},
      onMapStateChange = () => {},
      onStructureViewsChange = () => {},
      onCardChange = () => {}
    } = options;
    if (!queries || !view || !windowRef) {
      throw new TypeError('queries, view and windowRef are required');
    }

    const state: ReaderState = {
      activeCardId: null,
      activeSceneId: null,
      entryContext: null,
      navigationStack: []
    };
    let observer: IntersectionObserver | null = null;
    let previewTimer: number | null = null;
    let tapPreviewNavigationId: string | null = null;
    let started = false;
    let announcedSceneId: SceneId | null = null;
    let restoringHistorySnapshot = false;
    let entryTransitionTimer: number | null = null;
    let entryTransitionSequence = 0;
    let renderSequence = 0;
    let lifecycleGeneration = 0;

    function activeScene(): Scene | null | undefined {
      return queries.getScene(state.activeSceneId);
    }

    function sceneBelongsToCard(
      scene: Scene | null | undefined,
      cardId: CardId | null
    ): scene is Scene {
      return Boolean(scene && cardId && queries.getCard(cardId)?.sceneIds.includes(scene.id));
    }

    function normalizeNavigationStack(value: unknown): NavigationTrailEntry[] {
      if (!Array.isArray(value)) return [];
      return value.flatMap(item => {
        const record = asRecord(item);
        if (!record || typeof record.cardId !== 'string' || typeof record.sceneId !== 'string') {
          return [];
        }
        const card = queries.getCard(record.cardId);
        if (!card?.sceneIds.includes(record.sceneId)) return [];
        return [{
          cardId: record.cardId,
          sceneId: record.sceneId,
          scrollY: typeof record.scrollY === 'number' && Number.isFinite(record.scrollY)
            ? record.scrollY
            : 0,
          navigationId: typeof record.navigationId === 'string' ? record.navigationId : null
        }];
      });
    }

    function replaceHistorySnapshot(): void {
      if (restoringHistorySnapshot) return;
      const scene = activeScene();
      const cardId = state.activeCardId;
      if (!scene || !cardId) return;
      const historyState = asRecord(windowRef.history.state);
      const snapshot: LastReadSnapshot & Pick<AtlasHistoryState, 'entrySource'> = {
        atlasV5: true,
        cardId,
        sceneId: scene.id,
        scrollY: Number(windowRef.scrollY || 0),
        entrySource: historyState?.entrySource === 'card' ? 'card' : 'home',
        navigationStack: normalizeNavigationStack(state.navigationStack)
      };
      windowRef.history.replaceState(snapshot, '', buildCardHash(snapshot.cardId, snapshot.sceneId));
    }

    function announceScene(
      scene: Scene | null | undefined,
      updateHistory = true,
      trigger = 'scroll'
    ): void {
      const cardId = state.activeCardId;
      if (!cardId || !sceneBelongsToCard(scene, cardId)) return;
      if (scene.id === announcedSceneId) return;
      const fromSceneId = announcedSceneId;
      const direction = deriveSceneDirection(
        queries,
        cardId,
        fromSceneId,
        scene.id
      );
      const resolvedMedia = resolveSceneMedia(queries, cardId, scene.id);
      if (!resolvedMedia) return;
      const context: ReaderContext = {
        cardId,
        fromSceneId,
        toSceneId: scene.id,
        direction,
        trigger,
        inheritedMedia: resolvedMedia.inherited,
        presentationSceneId: resolvedMedia.presentationScene.id,
        presentationScene: resolvedMedia.presentationScene,
        sourcePresentation: scene.presentation
      };
      announcedSceneId = scene.id;
      state.activeSceneId = scene.id;
      state.entryContext = context;
      view.setActiveScene(scene.id);
      const presentation = resolvedMedia.presentation;
      const mapConfig: MapPresentationConfig | null =
        presentation.kind === 'map' || presentation.kind === 'mapAndText'
          ? presentation.map
          : null;
      const mapState: MapState | null = mapConfig
        ? queries.getMapState(mapConfig.mapStateId) ?? null
        : null;
      const views = mapConfig
        ? mapConfig.structureViewIds
          .map(id => queries.getStructureView(id))
          .filter((view): view is StructureView => Boolean(view))
        : [];
      onPresentationChange(presentation, scene, context);
      onStructureViewsChange(views, scene, context);
      onMapStateChange(mapState, scene, mapConfig, context);
      if (updateHistory) replaceHistorySnapshot();
    }

    function bindSceneObserver({
      updateInitialHistory = true,
      initialTrigger = 'direct'
    }: SceneObserverOptions = {}): void {
      observer?.disconnect?.();
      const sceneElements = Array.from(view.getSceneElements());
      const first = queries.getScene(state.activeSceneId) || queries.getScenesForCard(state.activeCardId)[0];
      const Observer = windowRef.IntersectionObserver;
      if (!Observer) {
        announceScene(first, updateInitialHistory, initialTrigger);
        return;
      }
      observer = new Observer((entries: IntersectionObserverEntry[]) => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        const anchor = Number(windowRef.innerHeight || 800) * 0.44;
        const visible = sceneElements
          .map(element => ({ element, rect: element.getBoundingClientRect() }))
          .filter(item => item.rect.top <= anchor && item.rect.bottom >= anchor)
          .sort((left, right) =>
            Math.abs((left.rect.top + left.rect.bottom) / 2 - anchor) -
            Math.abs((right.rect.top + right.rect.bottom) / 2 - anchor)
          )[0];
        if (visible?.element?.dataset?.sceneId) {
          announceScene(queries.getScene(visible.element.dataset.sceneId), true, 'scroll');
        }
      }, { rootMargin: '-28% 0px -52% 0px', threshold: [0, 0.2, 0.6] });
      sceneElements.forEach(element => observer?.observe(element));
      announceScene(first, updateInitialHistory, initialTrigger);
    }

    function prefersReducedMotion(): boolean {
      return Boolean(windowRef.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
    }

    function scheduleLifecycleFrame(callback: () => void): number | null {
      const generation = lifecycleGeneration;
      const guardedCallback = () => {
        if (generation !== lifecycleGeneration) return;
        callback();
      };
      if (windowRef.requestAnimationFrame) return windowRef.requestAnimationFrame(guardedCallback);
      guardedCallback();
      return null;
    }

    function clearEntryTransition(): void {
      entryTransitionSequence += 1;
      if (entryTransitionTimer) windowRef.clearTimeout?.(entryTransitionTimer);
      entryTransitionTimer = null;
      view.setEntryTransition(null);
    }

    function restoreScrollInstant(scrollY: number | null | undefined): void {
      const targetScrollY = typeof scrollY === 'number' && Number.isFinite(scrollY) ? scrollY : 0;
      const documentRef = windowRef.document;
      const scrollContainers = new Set([
        documentRef?.scrollingElement,
        documentRef?.documentElement,
        documentRef?.body
      ]);
      scrollContainers.forEach(element => {
        if (element) element.scrollTop = targetScrollY;
      });
      windowRef.scrollTo(0, targetScrollY);
    }

    function applyForwardEntryTransition(trigger: string): void {
      clearEntryTransition();
      if (trigger !== 'navigation' || prefersReducedMotion()) return;
      const generation = lifecycleGeneration;
      const transitionSequence = entryTransitionSequence;
      view.setEntryTransition('initial');
      scheduleLifecycleFrame(() => {
        if (transitionSequence !== entryTransitionSequence) return;
        view.setEntryTransition('active');
      });
      let timerCompleted = false;
      const timer = windowRef.setTimeout?.(() => {
        timerCompleted = true;
        if (
          generation !== lifecycleGeneration ||
          transitionSequence !== entryTransitionSequence
        ) return;
        view.setEntryTransition(null);
        entryTransitionTimer = null;
      }, 200) || null;
      entryTransitionTimer = timerCompleted ? null : timer;
    }

    function closePreview(): void {
      if (previewTimer) windowRef.clearTimeout(previewTimer);
      previewTimer = null;
      view.closePreview();
      tapPreviewNavigationId = null;
    }

    function openPreview(navigationId: string): void {
      view.openPreview(navigationId);
    }

    function requiresTapPreview(): boolean {
      return Boolean(windowRef.matchMedia?.('(hover: none), (pointer: coarse)').matches);
    }

    function requestPreview(navigationId: string): void {
      if (previewTimer) windowRef.clearTimeout(previewTimer);
      const generation = lifecycleGeneration;
      previewTimer = windowRef.setTimeout(() => {
        if (generation !== lifecycleGeneration) return;
        openPreview(navigationId);
      }, 120) || null;
    }

    function handleNavigationClick(
      navigationId: string,
      event: NavigationInteractionEvent
    ): void {
      if (
        event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey ||
        event.shiftKey || event.altKey
      ) return;
      if (requiresTapPreview() && tapPreviewNavigationId !== navigationId) {
        event.preventDefault();
        tapPreviewNavigationId = navigationId;
        openPreview(navigationId);
        return;
      }
      event.preventDefault();
      tapPreviewNavigationId = null;
      followNavigation(navigationId);
    }

    const cardViewActions: CardViewActions = {
      onNavigationClick: handleNavigationClick,
      onPreviewRequest: requestPreview,
      onPreviewClose: closePreview
    };

    function renderCard(cardId: CardId, sceneId: SceneId | null = null, {
      restoreScrollY = null,
      replaceScrollY = null,
      focusHeading = false,
      preserveHistorySnapshot = false,
      navigationStack,
      trigger = 'direct'
    }: RenderCardOptions = {}): RenderedCard {
      const card = queries.getCard(cardId);
      if (!card) throw new Error(`Unknown story: ${cardId}`);
      const scenes = queries.getScenesForCard(card.id);
      const requested = queries.getScene(sceneId);
      const resolvedScene = sceneBelongsToCard(requested, card.id) ? requested : scenes[0];
      if (!resolvedScene) throw new Error(`Story has no scenes: ${card.id}`);
      const currentRenderSequence = ++renderSequence;
      state.activeCardId = card.id;
      state.activeSceneId = resolvedScene.id;
      if (navigationStack !== undefined) {
        state.navigationStack = normalizeNavigationStack(navigationStack);
      }
      announcedSceneId = null;
      restoringHistorySnapshot = preserveHistorySnapshot || Number.isFinite(restoreScrollY);
      onBeforeCardChange(card);
      closePreview();
      const documentElement = windowRef.document?.documentElement;
      const replacingAtScroll = typeof replaceScrollY === 'number' && Number.isFinite(replaceScrollY);
      if (replacingAtScroll) documentElement?.classList?.add?.('is-v4-card-replacing');
      try {
        if (replacingAtScroll) restoreScrollInstant(replaceScrollY);
        view.renderCard(card.id, resolvedScene.id, cardViewActions);
        if (replacingAtScroll) restoreScrollInstant(replaceScrollY);
      } finally {
        if (replacingAtScroll) documentElement?.classList?.remove?.('is-v4-card-replacing');
      }
      onCardChange(card, resolvedScene);
      bindSceneObserver({
        updateInitialHistory: !restoringHistorySnapshot,
        initialTrigger: trigger
      });
      if (focusHeading) view.focusHeading();
      applyForwardEntryTransition(trigger);
      const shouldAddressRequestedScene = !Number.isFinite(restoreScrollY) &&
        resolvedScene.id !== scenes[0]?.id &&
        ['direct', 'navigation'].includes(trigger);
      const requestedSceneElement = shouldAddressRequestedScene
        ? view.getSceneElement(resolvedScene.id)
        : null;
      if (requestedSceneElement) {
        scheduleLifecycleFrame(() => {
          if (currentRenderSequence !== renderSequence) return;
          requestedSceneElement.scrollIntoView?.({ behavior: 'auto', block: 'start' });
          windowRef.setTimeout?.(() => {
            if (currentRenderSequence !== renderSequence) return;
            requestedSceneElement.scrollIntoView?.({ behavior: 'auto', block: 'start' });
            announceScene(resolvedScene, true, trigger);
          }, 160);
        });
      }
      if (Number.isFinite(restoreScrollY)) {
        scheduleLifecycleFrame(() => {
          if (currentRenderSequence !== renderSequence) return;
          restoreScrollInstant(restoreScrollY);
          restoringHistorySnapshot = false;
        });
      } else {
        restoringHistorySnapshot = false;
      }
      return { card, scene: resolvedScene };
    }

    function followNavigation(navigationId: string): boolean {
      const navigation = queries.getNavigationOption(navigationId);
      if (!navigation) return false;
      const target = queries.getCard(navigation.target.cardId);
      if (!target) return false;
      const targetSceneId = queries.getNavigationEntrySceneId(navigation);
      if (!targetSceneId) return false;
      if (!state.activeCardId || !state.activeSceneId) return false;
      replaceHistorySnapshot();
      state.navigationStack.push({
        cardId: state.activeCardId,
        sceneId: state.activeSceneId,
        scrollY: Number(windowRef.scrollY || 0),
        navigationId
      });
      windowRef.history.pushState({
        atlasV5: true,
        cardId: target.id,
        sceneId: targetSceneId,
        scrollY: 0,
        navigationId,
        entrySource: 'card',
        navigationStack: normalizeNavigationStack(state.navigationStack)
      }, '', buildCardHash(target.id, targetSceneId));
      renderCard(target.id, targetSceneId, {
        replaceScrollY: 0,
        focusHeading: true,
        preserveHistorySnapshot: true,
        trigger: 'navigation'
      });
      return true;
    }

    function handlePopState(event: PopStateEvent): void {
      const stateSnapshot = asRecord(event.state);
      const hashSnapshot = parseCardHash(windowRef.location.hash);
      const snapshot: UnknownRecord | null = stateSnapshot?.atlasV5 === true
        ? stateSnapshot
        : hashSnapshot
          ? { ...hashSnapshot }
          : null;
      if (
        !snapshot ||
        typeof snapshot.cardId !== 'string' ||
        (snapshot.sceneId !== null && typeof snapshot.sceneId !== 'string') ||
        !queries.getCard(snapshot.cardId)
      ) return;
      renderCard(snapshot.cardId, snapshot.sceneId, {
        restoreScrollY: typeof snapshot.scrollY === 'number' && Number.isFinite(snapshot.scrollY)
          ? snapshot.scrollY
          : 0,
        preserveHistorySnapshot: true,
        navigationStack: normalizeNavigationStack(snapshot.navigationStack),
        trigger: 'history'
      });
    }

    function start(startCardId: CardId = 'sumer-measuring-land-time'): ReaderState {
      if (started) return state;
      started = true;
      const parsed = parseCardHash(windowRef.location.hash);
      const card = queries.getCard(parsed?.cardId) || queries.getCard(startCardId);
      if (!card) throw new Error(`Unknown story: ${parsed?.cardId || startCardId}`);
      const scene = queries.getScene(parsed?.sceneId);
      renderCard(card.id, sceneBelongsToCard(scene, card.id) ? scene.id : card.sceneIds[0], {
        navigationStack: normalizeNavigationStack(asRecord(windowRef.history.state)?.navigationStack)
      });
      replaceHistorySnapshot();
      windowRef.addEventListener?.('popstate', handlePopState);
      windowRef.addEventListener?.('beforeunload', replaceHistorySnapshot);
      return state;
    }

    function destroy(): void {
      lifecycleGeneration += 1;
      clearEntryTransition();
      observer?.disconnect?.();
      observer = null;
      closePreview();
      windowRef.removeEventListener?.('popstate', handlePopState);
      windowRef.removeEventListener?.('beforeunload', replaceHistorySnapshot);
      windowRef.document?.documentElement?.classList?.remove?.('is-v4-card-replacing');
      restoringHistorySnapshot = false;
      started = false;
    }

    return {
      state,
      start,
      destroy,
      renderCard,
      announceScene,
      followNavigation,
      handlePopState,
      replaceHistorySnapshot
    };
  }

export const cardReaderModule = {
  buildCardHash,
  parseCardHash,
  deriveSceneDirection,
  resolveSceneMedia,
  createCardReader
} satisfies CardReaderModule;
