(function exposeV4CardReader(root, factory) {
  const api = factory();
  if (root) root.ATLAS_V5_CARD_READER = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
}(typeof window !== 'undefined' ? window : globalThis, function buildCardReader() {
  'use strict';

  function buildCardHash(cardId, sceneId) {
    return `#card/${encodeURIComponent(cardId)}/${encodeURIComponent(sceneId)}`;
  }

  function parseCardHash(hash = '') {
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

  function deriveSceneDirection(queries, cardId, fromSceneId, toSceneId) {
    if (!fromSceneId || fromSceneId === toSceneId) return 'stationary';
    const card = queries.getCard(cardId);
    const fromIndex = card?.sceneIds.indexOf(fromSceneId) ?? -1;
    const toIndex = card?.sceneIds.indexOf(toSceneId) ?? -1;
    if (fromIndex < 0 || toIndex < 0) return 'stationary';
    return toIndex > fromIndex ? 'forward' : 'backward';
  }

  function resolveSceneMedia(queries, cardId, sceneId) {
    const card = queries.getCard(cardId);
    const scene = queries.getScene(sceneId);
    if (!card || !scene || !card.sceneIds.includes(scene.id)) return null;
    if (scene.presentation.kind !== 'textOnly') {
      return { presentation: scene.presentation, presentationScene: scene, inherited: false };
    }
    const sceneIndex = card.sceneIds.indexOf(scene.id);
    for (let index = sceneIndex - 1; index >= 0; index -= 1) {
      const previousScene = queries.getScene(card.sceneIds[index]);
      if (previousScene?.presentation?.kind !== 'textOnly') {
        return {
          presentation: previousScene.presentation,
          presentationScene: previousScene,
          inherited: true
        };
      }
    }
    return { presentation: scene.presentation, presentationScene: scene, inherited: false };
  }

  function createCardReader(options) {
    const {
      data,
      queries,
      components,
      root,
      windowRef = typeof window !== 'undefined' ? window : null,
      onPresentationChange = () => {},
      onMapStateChange = () => {},
      onStructureViewsChange = () => {},
      onCardChange = () => {}
    } = options;
    if (!data || !queries || !components || !root || !windowRef) {
      throw new TypeError('data, queries, components, root and windowRef are required');
    }

    const state = {
      activeCardId: null,
      activeSceneId: null,
      entryContext: null,
      navigationStack: []
    };
    let observer = null;
    let previewTimer = null;
    let tapPreviewNavigationId = null;
    let started = false;
    let announcedSceneId = null;
    let restoringHistorySnapshot = false;
    let entryTransitionTimer = null;
    let entryTransitionArticle = null;
    let entryTransitionSequence = 0;
    let renderSequence = 0;
    let lifecycleGeneration = 0;

    function activeScene() {
      return queries.getScene(state.activeSceneId);
    }

    function sceneBelongsToCard(scene, cardId) {
      return Boolean(scene && queries.getCard(cardId)?.sceneIds.includes(scene.id));
    }

    function normalizeNavigationStack(value) {
      if (!Array.isArray(value)) return [];
      return value.filter(item => {
        if (!item || typeof item !== 'object') return false;
        const card = queries.getCard(item.cardId);
        return Boolean(card && card.sceneIds.includes(item.sceneId));
      }).map(item => ({
        cardId: item.cardId,
        sceneId: item.sceneId,
        scrollY: Number.isFinite(item.scrollY) ? item.scrollY : 0,
        navigationId: typeof item.navigationId === 'string' ? item.navigationId : null
      }));
    }

    function replaceHistorySnapshot() {
      if (restoringHistorySnapshot) return;
      const scene = activeScene();
      if (!scene) return;
      const snapshot = {
        atlasV5: true,
        cardId: state.activeCardId,
        sceneId: state.activeSceneId,
        scrollY: Number(windowRef.scrollY || 0),
        entrySource: windowRef.history.state?.entrySource === 'card' ? 'card' : 'home',
        navigationStack: normalizeNavigationStack(state.navigationStack)
      };
      windowRef.history.replaceState(snapshot, '', buildCardHash(snapshot.cardId, snapshot.sceneId));
    }

    function announceScene(scene, updateHistory = true, trigger = 'scroll') {
      if (!sceneBelongsToCard(scene, state.activeCardId)) return;
      if (scene.id === announcedSceneId) return;
      const fromSceneId = announcedSceneId;
      const direction = deriveSceneDirection(
        queries,
        state.activeCardId,
        fromSceneId,
        scene.id
      );
      const resolvedMedia = resolveSceneMedia(queries, state.activeCardId, scene.id);
      const context = {
        cardId: state.activeCardId,
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
      root.querySelectorAll?.('[data-scene-id]').forEach(element => {
        const active = element.dataset.sceneId === scene.id;
        element.classList?.toggle('is-active', active);
        element.setAttribute?.('aria-current', active ? 'step' : 'false');
      });
      const presentation = resolvedMedia.presentation;
      const mapConfig = presentation.map || null;
      const mapState = mapConfig ? queries.getMapState(mapConfig.mapStateId) : null;
      const views = mapConfig
        ? mapConfig.structureViewIds.map(id => queries.getStructureView(id)).filter(Boolean)
        : [];
      onPresentationChange(presentation, scene, context);
      onStructureViewsChange(views, scene, context);
      onMapStateChange(mapState, scene, mapConfig, context);
      if (updateHistory) replaceHistorySnapshot();
    }

    function bindSceneObserver({ updateInitialHistory = true, initialTrigger = 'direct' } = {}) {
      observer?.disconnect?.();
      const sceneElements = Array.from(root.querySelectorAll?.('[data-scene-id]') || []);
      const first = queries.getScene(state.activeSceneId) || queries.getScenesForCard(state.activeCardId)[0];
      if (!windowRef.IntersectionObserver) {
        announceScene(first, updateInitialHistory, initialTrigger);
        return;
      }
      observer = new windowRef.IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        const anchor = Number(windowRef.innerHeight || 800) * 0.44;
        const visible = sceneElements
          .map(element => ({ element, rect: element.getBoundingClientRect?.() }))
          .filter(item => item.rect && item.rect.top <= anchor && item.rect.bottom >= anchor)
          .sort((left, right) =>
            Math.abs((left.rect.top + left.rect.bottom) / 2 - anchor) -
            Math.abs((right.rect.top + right.rect.bottom) / 2 - anchor)
          )[0];
        if (visible?.element?.dataset?.sceneId) {
          announceScene(queries.getScene(visible.element.dataset.sceneId), true, 'scroll');
        }
      }, { rootMargin: '-28% 0px -52% 0px', threshold: [0, 0.2, 0.6] });
      sceneElements.forEach(element => observer.observe(element));
      announceScene(first, updateInitialHistory, initialTrigger);
    }

    function prefersReducedMotion() {
      return Boolean(windowRef.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
    }

    function scheduleLifecycleFrame(callback) {
      const generation = lifecycleGeneration;
      const guardedCallback = () => {
        if (generation !== lifecycleGeneration) return;
        callback();
      };
      if (windowRef.requestAnimationFrame) return windowRef.requestAnimationFrame(guardedCallback);
      guardedCallback();
      return null;
    }

    function clearEntryTransition() {
      entryTransitionSequence += 1;
      if (entryTransitionTimer) windowRef.clearTimeout?.(entryTransitionTimer);
      entryTransitionTimer = null;
      entryTransitionArticle?.classList?.remove(
        'is-entering-forward',
        'is-entering-forward-active'
      );
      entryTransitionArticle = null;
    }

    function restoreScrollInstant(scrollY) {
      const targetScrollY = Number.isFinite(scrollY) ? scrollY : 0;
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

    function replaceCardMarkup(markup, scrollY = null) {
      if (!Number.isFinite(scrollY)) {
        root.innerHTML = markup;
        return;
      }
      const documentElement = windowRef.document?.documentElement;
      documentElement?.classList?.add?.('is-v4-card-replacing');
      try {
        restoreScrollInstant(scrollY);
        root.innerHTML = markup;
        restoreScrollInstant(scrollY);
      } finally {
        documentElement?.classList?.remove?.('is-v4-card-replacing');
      }
    }

    function applyForwardEntryTransition(trigger) {
      clearEntryTransition();
      if (trigger !== 'navigation' || prefersReducedMotion()) return;
      const article = root.querySelector?.('[data-card-id]');
      if (!article) return;
      const generation = lifecycleGeneration;
      const transitionSequence = entryTransitionSequence;
      entryTransitionArticle = article;
      article.classList?.add('is-entering-forward');
      scheduleLifecycleFrame(() => {
        if (transitionSequence !== entryTransitionSequence) return;
        article.classList?.add('is-entering-forward-active');
      });
      let timerCompleted = false;
      const timer = windowRef.setTimeout?.(() => {
        timerCompleted = true;
        if (
          generation !== lifecycleGeneration ||
          transitionSequence !== entryTransitionSequence
        ) return;
        article.classList?.remove('is-entering-forward', 'is-entering-forward-active');
        if (entryTransitionArticle === article) entryTransitionArticle = null;
        entryTransitionTimer = null;
      }, 200) || null;
      entryTransitionTimer = timerCompleted ? null : timer;
    }

    function closePreview() {
      if (previewTimer) windowRef.clearTimeout(previewTimer);
      previewTimer = null;
      const layer = root.querySelector?.('[data-preview-layer]');
      if (layer) {
        layer.innerHTML = '';
        layer.removeAttribute?.('data-open');
      }
      tapPreviewNavigationId = null;
      root.querySelectorAll?.('[data-preview-navigation-id]').forEach(trigger => {
        trigger.setAttribute?.('aria-expanded', 'false');
      });
    }

    function openPreview(navigationId) {
      const layer = root.querySelector?.('[data-preview-layer]');
      if (!layer) return;
      layer.innerHTML = components.renderPreviewCard(navigationId);
      layer.setAttribute?.('data-open', 'true');
      root.querySelectorAll?.('[data-preview-navigation-id]').forEach(trigger => {
        trigger.setAttribute?.(
          'aria-expanded',
          String(trigger.dataset.previewNavigationId === navigationId)
        );
      });
    }

    function requiresTapPreview() {
      return Boolean(windowRef.matchMedia?.('(hover: none), (pointer: coarse)').matches);
    }

    function bindPreviewTriggers() {
      root.querySelectorAll?.('[data-preview-navigation-id]').forEach(trigger => {
        const show = () => {
          if (previewTimer) windowRef.clearTimeout(previewTimer);
          const generation = lifecycleGeneration;
          previewTimer = windowRef.setTimeout(() => {
            if (generation !== lifecycleGeneration) return;
            openPreview(trigger.dataset.previewNavigationId);
          }, 120);
        };
        trigger.addEventListener?.('mouseenter', show);
        trigger.addEventListener?.('focus', show);
        trigger.addEventListener?.('mouseleave', closePreview);
        trigger.addEventListener?.('blur', closePreview);
      });
    }

    function renderCard(cardId, sceneId, {
      restoreScrollY = null,
      replaceScrollY = null,
      focusHeading = false,
      preserveHistorySnapshot = false,
      navigationStack,
      trigger = 'direct'
    } = {}) {
      const card = queries.getCard(cardId);
      if (!card) throw new Error(`Unknown story: ${cardId}`);
      const scenes = queries.getScenesForCard(card.id);
      const requested = queries.getScene(sceneId);
      const resolvedScene = sceneBelongsToCard(requested, card.id) ? requested : scenes[0];
      const currentRenderSequence = ++renderSequence;
      state.activeCardId = card.id;
      state.activeSceneId = resolvedScene.id;
      if (navigationStack !== undefined) {
        state.navigationStack = normalizeNavigationStack(navigationStack);
      }
      announcedSceneId = null;
      restoringHistorySnapshot = preserveHistorySnapshot || Number.isFinite(restoreScrollY);
      replaceCardMarkup(
        components.renderMainCard(card.id, { activeSceneId: resolvedScene.id }),
        replaceScrollY
      );
      root.querySelectorAll?.('[data-navigation-id]').forEach(control => {
        control.addEventListener?.('click', event => {
          if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          const navigationId = control.dataset.navigationId;
          if (requiresTapPreview() && tapPreviewNavigationId !== navigationId) {
            event.preventDefault?.();
            tapPreviewNavigationId = navigationId;
            openPreview(navigationId);
            return;
          }
          event.preventDefault?.();
          tapPreviewNavigationId = null;
          followNavigation(navigationId);
        });
      });
      bindPreviewTriggers();
      onCardChange(card, resolvedScene);
      bindSceneObserver({
        updateInitialHistory: !restoringHistorySnapshot,
        initialTrigger: trigger
      });
      if (focusHeading) root.querySelector?.('h1')?.focus?.({ preventScroll: true });
      applyForwardEntryTransition(trigger);
      const shouldAddressRequestedScene = !Number.isFinite(restoreScrollY) &&
        resolvedScene.id !== scenes[0]?.id &&
        ['direct', 'navigation'].includes(trigger);
      const requestedSceneElement = shouldAddressRequestedScene
        ? Array.from(root.querySelectorAll?.('[data-scene-id]') || [])
          .find(element => element.dataset.sceneId === resolvedScene.id)
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

    function followNavigation(navigationId) {
      const navigation = queries.getNavigationOption(navigationId);
      if (!navigation) return false;
      const target = queries.getCard(navigation.target.cardId);
      if (!target) return false;
      const targetSceneId = queries.getNavigationEntrySceneId(navigation);
      if (!targetSceneId) return false;
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

    function handlePopState(event) {
      const stateSnapshot = event.state;
      const snapshot = stateSnapshot?.atlasV5
        ? stateSnapshot
        : parseCardHash(windowRef.location.hash);
      if (!snapshot || !queries.getCard(snapshot.cardId)) return;
      renderCard(snapshot.cardId, snapshot.sceneId, {
        restoreScrollY: Number.isFinite(snapshot.scrollY) ? snapshot.scrollY : 0,
        preserveHistorySnapshot: true,
        navigationStack: snapshot.navigationStack,
        trigger: 'history'
      });
    }

    function start(startCardId = 'sumer-measuring-land-time') {
      if (started) return state;
      started = true;
      const parsed = parseCardHash(windowRef.location.hash);
      const card = queries.getCard(parsed?.cardId) || queries.getCard(startCardId);
      const scene = queries.getScene(parsed?.sceneId);
      renderCard(card.id, sceneBelongsToCard(scene, card.id) ? scene.id : card.sceneIds[0], {
        navigationStack: windowRef.history.state?.navigationStack || []
      });
      replaceHistorySnapshot();
      windowRef.addEventListener?.('popstate', handlePopState);
      windowRef.addEventListener?.('beforeunload', replaceHistorySnapshot);
      return state;
    }

    function destroy() {
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

  return {
    buildCardHash,
    parseCardHash,
    deriveSceneDirection,
    resolveSceneMedia,
    createCardReader
  };
}));
