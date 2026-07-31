(function exposeV3CardReader(root, factory) {
  const api = factory();
  if (root) root.ATLAS_V3_CARD_READER = api;
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

  function createCardReader(options) {
    const {
      data,
      queries,
      components,
      root,
      windowRef = typeof window !== 'undefined' ? window : null,
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
    let started = false;

    function activeScene() {
      return queries.getScene(state.activeSceneId);
    }

    function replaceHistorySnapshot() {
      const scene = activeScene();
      if (!scene) return;
      const snapshot = {
        atlasV3: true,
        cardId: state.activeCardId,
        sceneId: state.activeSceneId,
        scrollY: Number(windowRef.scrollY || 0)
      };
      windowRef.history.replaceState(snapshot, '', buildCardHash(snapshot.cardId, snapshot.sceneId));
    }

    function announceScene(scene, updateHistory = true) {
      if (!scene || scene.cardId !== state.activeCardId) return;
      state.activeSceneId = scene.id;
      root.querySelectorAll?.('[data-scene-id]').forEach(element => {
        element.classList?.toggle('is-active', element.dataset.sceneId === scene.id);
        element.setAttribute?.('aria-current', element.dataset.sceneId === scene.id ? 'step' : 'false');
      });
      onMapStateChange(data.mapStates.find(item => item.id === scene.mapStateId) || null, scene);
      onStructureViewsChange(
        (scene.activeStructureViewIds || []).map(id => data.structureViews.find(item => item.id === id)).filter(Boolean),
        scene
      );
      if (updateHistory) replaceHistorySnapshot();
    }

    function bindSceneObserver() {
      observer?.disconnect?.();
      const sceneElements = Array.from(root.querySelectorAll?.('[data-scene-id]') || []);
      const first = queries.getScene(state.activeSceneId) || queries.getScenesForCard(state.activeCardId)[0];
      if (!windowRef.IntersectionObserver) {
        announceScene(first);
        return;
      }
      observer = new windowRef.IntersectionObserver(entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
        if (visible?.target?.dataset?.sceneId) announceScene(queries.getScene(visible.target.dataset.sceneId));
      }, { rootMargin: '-28% 0px -52% 0px', threshold: [0, 0.2, 0.6] });
      sceneElements.forEach(element => observer.observe(element));
      announceScene(first);
    }

    function closePreview() {
      if (previewTimer) windowRef.clearTimeout(previewTimer);
      previewTimer = null;
      const layer = root.querySelector?.('[data-preview-layer]');
      if (layer) {
        layer.innerHTML = '';
        layer.removeAttribute?.('data-open');
      }
    }

    function openPreview(navigationId) {
      const layer = root.querySelector?.('[data-preview-layer]');
      if (!layer) return;
      layer.innerHTML = components.renderPreviewCard(navigationId);
      layer.setAttribute?.('data-open', 'true');
    }

    function bindPreviewTriggers() {
      root.querySelectorAll?.('[data-preview-navigation-id]').forEach(trigger => {
        const show = () => {
          if (previewTimer) windowRef.clearTimeout(previewTimer);
          previewTimer = windowRef.setTimeout(() => openPreview(trigger.dataset.previewNavigationId), 120);
        };
        trigger.addEventListener?.('mouseenter', show);
        trigger.addEventListener?.('focus', show);
        trigger.addEventListener?.('mouseleave', closePreview);
        trigger.addEventListener?.('blur', closePreview);
      });
    }

    function renderCard(cardId, sceneId, { restoreScrollY = null, focusHeading = false } = {}) {
      const card = queries.getCard(cardId);
      if (!card) throw new Error(`Unknown Card: ${cardId}`);
      const scenes = queries.getScenesForCard(card.id);
      const scene = queries.getScene(sceneId);
      const resolvedScene = scene?.cardId === card.id ? scene : scenes[0];
      state.activeCardId = card.id;
      state.activeSceneId = resolvedScene.id;
      root.innerHTML = components.renderMainCard(card.id, { activeSceneId: resolvedScene.id });
      root.querySelectorAll?.('[data-navigation-id]').forEach(control => {
        control.addEventListener?.('click', event => {
          if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault?.();
          followNavigation(control.dataset.navigationId);
        });
      });
      bindPreviewTriggers();
      bindSceneObserver();
      onCardChange(card, resolvedScene);
      if (focusHeading) root.querySelector?.('h1')?.focus?.({ preventScroll: true });
      if (Number.isFinite(restoreScrollY)) {
        windowRef.requestAnimationFrame
          ? windowRef.requestAnimationFrame(() => windowRef.scrollTo(0, restoreScrollY))
          : windowRef.scrollTo(0, restoreScrollY);
      }
      return { card, scene: resolvedScene };
    }

    function followNavigation(navigationId) {
      const navigation = data.navigationOptions.find(item => item.id === navigationId);
      if (!navigation) return false;
      replaceHistorySnapshot();
      const target = queries.getCard(navigation.targetCardId);
      const firstScene = queries.getScenesForCard(target.id)[0];
      state.navigationStack.push({
        cardId: state.activeCardId,
        sceneId: state.activeSceneId,
        scrollY: Number(windowRef.scrollY || 0),
        navigationId
      });
      windowRef.history.pushState({
        atlasV3: true,
        cardId: target.id,
        sceneId: firstScene.id,
        scrollY: 0,
        navigationId
      }, '', buildCardHash(target.id, firstScene.id));
      renderCard(target.id, firstScene.id, { restoreScrollY: 0, focusHeading: true });
      return true;
    }

    function handlePopState(event) {
      const snapshot = event.state?.atlasV3 ? event.state : parseCardHash(windowRef.location.hash);
      if (!snapshot) return;
      renderCard(snapshot.cardId, snapshot.sceneId, {
        restoreScrollY: Number.isFinite(snapshot.scrollY) ? snapshot.scrollY : 0
      });
    }

    function start(defaultCardId = 'buddhism-overview') {
      if (started) return state;
      started = true;
      const parsed = parseCardHash(windowRef.location.hash);
      const card = queries.getCard(parsed?.cardId) || queries.getCard(defaultCardId);
      const scene = queries.getScene(parsed?.sceneId);
      renderCard(card.id, scene?.cardId === card.id ? scene.id : card.sceneIds[0]);
      replaceHistorySnapshot();
      windowRef.addEventListener?.('popstate', handlePopState);
      windowRef.addEventListener?.('beforeunload', replaceHistorySnapshot);
      return state;
    }

    function destroy() {
      observer?.disconnect?.();
      closePreview();
      windowRef.removeEventListener?.('popstate', handlePopState);
      windowRef.removeEventListener?.('beforeunload', replaceHistorySnapshot);
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
    createCardReader
  };
}));
