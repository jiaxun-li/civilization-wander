(function startCivilizationAtlas(root, documentRef) {
  'use strict';

  const LAST_READ_STORAGE_KEY = 'civilization-wander:v5:last-read';
  const HOME_SECTIONS = Object.freeze([
    Object.freeze({
      eyebrow: '四个古代世界',
      title: '从一个文明开始',
      cardIds: Object.freeze([
        'sumer-measuring-land-time',
        'ancient-egypt-gift-of-nile',
        'indus-civilization-network',
        'china-early-bronze-connected-worlds'
      ])
    }),
    Object.freeze({
      eyebrow: '史诗与神话',
      title: '从一个故事开始',
      cardIds: Object.freeze([
        'gilgamesh-mortality',
        'tower-of-babel-story-and-etemenanki',
        'odyssey-name-and-home',
        'greek-gods-leave-palaces'
      ])
    }),
    Object.freeze({
      eyebrow: '遗物与奇观',
      title: '从一个遗存开始',
      cardIds: Object.freeze([
        'hammurabi-code-justice',
        'egypt-pyramids-kingdom-at-work',
        'sanxingdui-ritual-world',
        'troy-layered-city'
      ])
    })
  ]);

  const BRAND_CONFIG = Object.freeze({
    name: '文明漫游',
    tagline: '从一个人物、城市、信仰或作品出发，沿着关联漫游人类文明。',
    shortTagline: '沿着关联漫游人类文明',
    startCardId: 'sumer-measuring-land-time'
  });

  function normalizeLastReadSnapshot(snapshot, queries) {
    if (!snapshot?.atlasV5 || !queries) return null;
    const card = queries.getCard(snapshot.cardId);
    const scene = queries.getScene(snapshot.sceneId);
    if (!card || !scene || !card.sceneIds.includes(scene.id)) return null;
    const navigationStack = Array.isArray(snapshot.navigationStack)
      ? snapshot.navigationStack.filter(entry => {
        const entryCard = queries.getCard(entry?.cardId);
        const entryScene = queries.getScene(entry?.sceneId);
        return Boolean(entryCard && entryScene && entryCard.sceneIds.includes(entryScene.id));
      }).map(entry => ({
        cardId: entry.cardId,
        sceneId: entry.sceneId,
        scrollY: Number.isFinite(entry.scrollY) && entry.scrollY >= 0 ? entry.scrollY : 0,
        navigationId: typeof entry.navigationId === 'string' ? entry.navigationId : null
      }))
      : [];
    return {
      atlasV5: true,
      cardId: card.id,
      sceneId: scene.id,
      scrollY: Number.isFinite(snapshot.scrollY) && snapshot.scrollY >= 0 ? snapshot.scrollY : 0,
      navigationStack
    };
  }

  function parseLastReadSnapshot(serialized, queries) {
    if (typeof serialized !== 'string' || serialized.length === 0) return null;
    try {
      return normalizeLastReadSnapshot(JSON.parse(serialized), queries);
    } catch (_error) {
      return null;
    }
  }

  function shouldSaveCardSnapshot(cardView, historyState) {
    return Boolean(
      cardView &&
      cardView.hidden === false &&
      historyState?.atlasV5
    );
  }

  function saveCardSnapshotBeforeTransition(cardView, historyState, reader) {
    if (!shouldSaveCardSnapshot(cardView, historyState)) return false;
    reader?.replaceHistorySnapshot?.();
    return true;
  }

  function pushHistoryEntryAfterSavingCard(cardView, history, reader, nextState, hash) {
    const savedCardSnapshot = saveCardSnapshotBeforeTransition(
      cardView,
      history.state,
      reader
    );
    history.pushState(nextState, '', hash);
    return savedCardSnapshot;
  }

  function shouldResetMediaCard(activeMediaCardId, nextCardId) {
    return activeMediaCardId !== nextCardId;
  }

  function storyBackMode(historyState) {
    return historyState?.entrySource === 'card' ? 'story' : 'home';
  }

  function storyTrailEntityNames(readerState, queries) {
    if (!readerState?.activeCardId || !Array.isArray(readerState.navigationStack) || readerState.navigationStack.length === 0) return [];
    return readerState.navigationStack
      .map(entry => entry.cardId)
      .concat(readerState.activeCardId)
      .slice(-5)
      .map(cardId => {
        const card = queries.getCard(cardId);
        return queries.getEntity(card?.primaryEntityId)?.name || card?.title || '';
      })
      .filter(Boolean);
  }

  root.ATLAS_V5_APP_INTERNALS = Object.freeze({
    homeSections: HOME_SECTIONS,
    normalizeLastReadSnapshot,
    parseLastReadSnapshot,
    shouldSaveCardSnapshot,
    saveCardSnapshotBeforeTransition,
    pushHistoryEntryAfterSavingCard,
    shouldResetMediaCard,
    storyBackMode,
    storyTrailEntityNames
  });
  if (!documentRef) return;

  function initialize() {
    const data = root.ATLAS_V5_DATA;
    const queries = root.ATLAS_V5_QUERIES;
    const cardsModule = root.ATLAS_V5_CARDS;
    const readerModule = root.ATLAS_V5_CARD_READER;
    const mapModule = root.ATLAS_V5_MAP;
    const naturalEarth = root.ATLAS_NATURAL_EARTH?.base;
    if (!data || !queries || !cardsModule || !readerModule || !mapModule || !naturalEarth) {
      throw new Error('V5 runtime modules failed to load');
    }
    const validation = queries.validateAtlasData();
    if (!validation.valid) throw new Error(`V5 data validation failed: ${validation.errors.join('; ')}`);

    const homeView = documentRef.getElementById('home-view');
    const cardView = documentRef.getElementById('card-view');
    const cardRoot = documentRef.getElementById('card-root');
    const homeSectionsRoot = documentRef.querySelector('[data-home-sections]');
    const homePrimaryAction = documentRef.querySelector('[data-home-primary-action]');
    const storyBackBar = documentRef.querySelector('[data-story-back-bar]');
    const storyBackButton = documentRef.querySelector('[data-story-back]');
    const storyBackDesktop = documentRef.querySelector('[data-story-back-desktop]');
    const storyBackMobile = documentRef.querySelector('[data-story-back-mobile]');
    const storyTrail = documentRef.querySelector('[data-story-trail]');
    const components = cardsModule.createCardComponents({ data, queries });

    let reader = null;
    let readerStarted = false;
    let map = null;
    let mapContainer = null;
    let activeMediaCardId = null;
    let activeImageAssetId = null;
    let mediaImageTransitionSequence = 0;
    let mediaImageTransitionTimer = null;
    let homeResumeSnapshot = null;

    documentRef.querySelector('[data-brand-name]').textContent = BRAND_CONFIG.name;
    documentRef.querySelector('[data-brand-tagline]').textContent = BRAND_CONFIG.shortTagline;

    function entityTypeLabel(entity) {
      return queries.getEntityTypeLabel(entity.type);
    }

    function renderHomeCard(cardId) {
      const card = queries.getCard(cardId);
      if (!card) throw new Error(`Unknown home story: ${cardId}`);
      const entity = queries.getEntity(card.primaryEntityId);
      if (!entity) throw new Error(`Missing primary Entity for home story: ${cardId}`);
      const firstSceneId = card.sceneIds[0];
      return `
        <a class="home-entity-card" href="${readerModule.buildCardHash(card.id, firstSceneId)}"
          data-start-card="${cardsModule.escapeHtml(card.id)}">
          <span>${cardsModule.escapeHtml(entityTypeLabel(entity))}</span>
          <strong>${cardsModule.escapeHtml(entity.name)}</strong>
          <p>${cardsModule.escapeHtml(entity.canonicalSummary)}</p>
          <small>${cardsModule.escapeHtml(card.title)}</small>
          <b aria-hidden="true">开始阅读 →</b>
        </a>`;
    }

    function renderHomeSections() {
      homeSectionsRoot.innerHTML = HOME_SECTIONS.map((section, index) => {
        const headingId = `home-section-${index + 1}-title`;
        return `
          <section class="home-entities" aria-labelledby="${headingId}">
            <header>
              <p class="home-hero__eyebrow">${cardsModule.escapeHtml(section.eyebrow)}</p>
              <h2 id="${headingId}">${cardsModule.escapeHtml(section.title)}</h2>
            </header>
            <div class="home-card-grid">
              ${section.cardIds.map(renderHomeCard).join('')}
            </div>
          </section>`;
      }).join('');
    }

    function readLastReadSnapshot() {
      try {
        return parseLastReadSnapshot(root.localStorage?.getItem(LAST_READ_STORAGE_KEY), queries);
      } catch (_error) {
        return null;
      }
    }

    function storeLastReadSnapshot(snapshot) {
      const normalized = normalizeLastReadSnapshot(snapshot, queries);
      if (!normalized) return false;
      try {
        root.localStorage?.setItem(LAST_READ_STORAGE_KEY, JSON.stringify(normalized));
        return true;
      } catch (_error) {
        return false;
      }
    }

    function currentReadingSnapshot() {
      if (!readerStarted || cardView.hidden || !reader?.state.activeCardId) return null;
      return normalizeLastReadSnapshot({
        atlasV5: true,
        cardId: reader.state.activeCardId,
        sceneId: reader.state.activeSceneId,
        scrollY: Number(root.scrollY || 0),
        navigationStack: reader.state.navigationStack
      }, queries);
    }

    function updateHomePrimaryAction(snapshot = readLastReadSnapshot()) {
      homeResumeSnapshot = normalizeLastReadSnapshot(snapshot, queries);
      const card = homeResumeSnapshot
        ? queries.getCard(homeResumeSnapshot.cardId)
        : queries.getCard(BRAND_CONFIG.startCardId);
      const sceneId = homeResumeSnapshot?.sceneId || card.sceneIds[0];
      homePrimaryAction.href = readerModule.buildCardHash(card.id, sceneId);
      homePrimaryAction.dataset.startCard = card.id;
      homePrimaryAction.innerHTML = homeResumeSnapshot
        ? `继续上次阅读：${cardsModule.escapeHtml(card.title)} <span aria-hidden="true">→</span>`
        : '从苏美尔开始 <span aria-hidden="true">→</span>';
    }

    function updateStoryBackControl({ visible = false } = {}) {
      storyBackBar.hidden = !visible;
      if (!visible) return;
      const returnsToStory = storyBackMode(root.history.state) === 'story';
      const desktopLabel = returnsToStory ? '返回上一个故事' : '返回首页';
      const mobileLabel = returnsToStory ? '返回' : '返回首页';
      storyBackDesktop.textContent = desktopLabel;
      storyBackMobile.textContent = mobileLabel;
      storyBackButton.setAttribute('aria-label', desktopLabel);
      storyBackButton.dataset.backMode = returnsToStory ? 'story' : 'home';
      const trailNames = storyTrailEntityNames(reader?.state, queries);
      storyTrail.hidden = trailNames.length < 2;
      storyTrail.textContent = trailNames.join(' → ');
      storyTrail.title = storyTrail.textContent;
    }

    function showHome({ push = false } = {}) {
      const lastReadSnapshot = currentReadingSnapshot();
      if (lastReadSnapshot) storeLastReadSnapshot(lastReadSnapshot);
      if (push) {
        pushHistoryEntryAfterSavingCard(
          cardView,
          root.history,
          readerStarted ? reader : null,
          { atlasHome: true },
          '#home'
        );
      }
      homeView.hidden = false;
      cardView.hidden = true;
      documentRef.title = `${BRAND_CONFIG.name} · 连续阅读文明知识网络`;
      updateStoryBackControl();
      updateHomePrimaryAction(lastReadSnapshot || undefined);
      root.scrollTo(0, 0);
      documentRef.getElementById('home-title')?.focus?.({ preventScroll: true });
    }

    function directMediaImage(container) {
      return Array.from(container?.children || []).find(child =>
        child.tagName === 'IMG' && !child.hasAttribute('data-media-image-transition')
      ) || null;
    }

    function clearMediaImageTransition() {
      mediaImageTransitionSequence += 1;
      if (mediaImageTransitionTimer) root.clearTimeout?.(mediaImageTransitionTimer);
      mediaImageTransitionTimer = null;
      cardRoot.querySelectorAll?.('[data-media-image-transition]').forEach(node => node.remove?.());
    }

    function transitionMediaImage(container, incomingImage, outgoingImage) {
      clearMediaImageTransition();
      if (!incomingImage && !outgoingImage) return;
      if (root.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        outgoingImage?.remove?.();
        return;
      }
      const sequence = mediaImageTransitionSequence;

      incomingImage?.classList.add('is-media-image-entering');
      if (outgoingImage) {
        outgoingImage.classList.remove('is-media-image-entering', 'is-media-image-entering-active');
        outgoingImage.classList.add('is-media-image-leaving');
        outgoingImage.setAttribute('data-media-image-transition', 'leaving');
        outgoingImage.setAttribute('aria-hidden', 'true');
        container.append(outgoingImage);
      }

      const activate = () => {
        if (sequence !== mediaImageTransitionSequence) return;
        incomingImage?.classList.add('is-media-image-entering-active');
        outgoingImage?.classList.add('is-media-image-leaving-active');
      };
      if (root.requestAnimationFrame) root.requestAnimationFrame(activate);
      else activate();

      mediaImageTransitionTimer = root.setTimeout?.(() => {
        if (sequence !== mediaImageTransitionSequence) return;
        incomingImage?.classList.remove('is-media-image-entering', 'is-media-image-entering-active');
        outgoingImage?.remove?.();
        mediaImageTransitionTimer = null;
      }, 260) || null;
    }

    function ensureMap() {
      const nextContainer = cardRoot.querySelector('[data-map-slot]');
      if (!nextContainer) return null;
      if (map && mapContainer === nextContainer) {
        const outgoingImage = activeImageAssetId
          ? directMediaImage(nextContainer)
          : null;
        activeImageAssetId = null;
        nextContainer.querySelector('[data-v4-map]')?.removeAttribute('aria-hidden');
        transitionMediaImage(nextContainer, null, outgoingImage);
        return map;
      }
      const outgoingImage = activeImageAssetId
        ? directMediaImage(nextContainer)?.cloneNode(true)
        : null;
      map?.destroy();
      activeImageAssetId = null;
      mapContainer = nextContainer;
      map = mapModule.createNaturalEarthMap({
        container: mapContainer,
        data,
        queries,
        naturalEarth,
        documentRef,
        windowRef: root,
        onNavigate(navigationId) {
          reader.followNavigation(navigationId);
        }
      });
      mapContainer.querySelector('[data-v4-map]')?.removeAttribute('aria-hidden');
      transitionMediaImage(mapContainer, null, outgoingImage);
      return map;
    }

    function setMediaVisibility(presentation) {
      const article = cardRoot.querySelector('[data-card-id]');
      const media = cardRoot.querySelector('[data-card-media]');
      if (!article || !media) return;
      const hasMedia = presentation.kind !== 'textOnly';
      article.classList.toggle('is-media-hidden', !hasMedia);
      media.hidden = !hasMedia;
    }

    function renderImagePresentation(presentation) {
      const asset = queries.getAsset(presentation.assetId);
      const nextContainer = cardRoot.querySelector('[data-map-slot]');
      if (!asset || asset.type !== 'image' || !nextContainer) return;
      if (activeImageAssetId === asset.id && mapContainer === nextContainer) return;
      const outgoingImage = activeImageAssetId
        ? directMediaImage(nextContainer)
        : null;
      mapContainer = nextContainer;
      activeImageAssetId = asset.id;
      const incomingImage = documentRef.createElement('img');
      incomingImage.src = asset.src;
      incomingImage.alt = asset.alt;
      nextContainer.append(incomingImage);
      nextContainer.querySelector('[data-v4-map]')?.setAttribute('aria-hidden', 'true');
      transitionMediaImage(nextContainer, incomingImage, outgoingImage);
      const caption = cardRoot.querySelector('[data-media-caption]');
      if (caption) caption.textContent = asset.title;
    }

    reader = readerModule.createCardReader({
      data,
      queries,
      components,
      root: cardRoot,
      windowRef: root,
      onPresentationChange(presentation) {
        setMediaVisibility(presentation);
        if (presentation.kind === 'textOnly') {
          const caption = cardRoot.querySelector('[data-media-caption]');
          if (caption) caption.textContent = '';
        } else if (presentation.kind === 'image' || presentation.kind === 'imageAndText') {
          renderImagePresentation(presentation);
        }
      },
      onMapStateChange(mapState, scene, mapConfig, context) {
        if (!mapState || !mapConfig) return;
        const activeMap = ensureMap();
        activeMap?.renderMapState(
          mapState,
          context?.presentationScene || scene,
          mapConfig,
          context
        );
        const caption = cardRoot.querySelector('[data-media-caption]');
        if (caption) caption.textContent = mapConfig.caption || '范围、选点与路线均为近似教学表达。';
      },
      onStructureViewsChange(views, scene, context) {
        if (context?.presentationScene?.presentation?.map) {
          ensureMap()?.setStructureViews(
            views,
            context.presentationScene,
            context
          );
        }
      },
      onCardChange(card) {
        if (shouldResetMediaCard(activeMediaCardId, card.id)) {
          clearMediaImageTransition();
          map?.destroy();
          map = null;
          mapContainer = null;
          activeImageAssetId = null;
          activeMediaCardId = card.id;
        }
        homeView.hidden = true;
        cardView.hidden = false;
        documentRef.title = `${card.title} · ${BRAND_CONFIG.name}`;
        updateStoryBackControl({ visible: true });
      }
    });

    function openCard(cardId, sceneId = null, { resumeSnapshot = null } = {}) {
      const card = queries.getCard(cardId);
      if (!card) return false;
      const requested = queries.getScene(sceneId);
      const resolvedSceneId = requested && card.sceneIds.includes(requested.id)
        ? requested.id
        : card.sceneIds[0];
      const normalizedResume = normalizeLastReadSnapshot(resumeSnapshot, queries);
      const resume = normalizedResume?.cardId === card.id && normalizedResume.sceneId === resolvedSceneId
        ? normalizedResume
        : null;
      const scrollY = resume?.scrollY || 0;
      const navigationStack = resume?.navigationStack || [];
      const hash = readerModule.buildCardHash(card.id, resolvedSceneId);
      const enteringFromHome = cardView.hidden;
      const nextState = {
        atlasV5: true,
        cardId: card.id,
        sceneId: resolvedSceneId,
        scrollY,
        entrySource: enteringFromHome ? 'home' : 'card',
        navigationStack: resume ? navigationStack : (enteringFromHome ? [] : reader.state.navigationStack)
      };
      if (!readerStarted) {
        root.history.pushState(nextState, '', hash);
        reader.start(card.id);
        readerStarted = true;
        if (resume) {
          root.history.replaceState(nextState, '', hash);
          reader.renderCard(card.id, resolvedSceneId, {
            restoreScrollY: scrollY,
            focusHeading: true,
            preserveHistorySnapshot: true,
            navigationStack,
            trigger: 'history'
          });
        }
      } else {
        pushHistoryEntryAfterSavingCard(
          cardView,
          root.history,
          reader,
          nextState,
          hash
        );
        reader.renderCard(card.id, resolvedSceneId, {
          restoreScrollY: scrollY,
          focusHeading: true,
          navigationStack: nextState.navigationStack,
          trigger: resume ? 'history' : 'navigation'
        });
      }
      return true;
    }

    function bindHomeLinks(scope = documentRef) {
      scope.querySelectorAll('[data-home-link]').forEach(link => {
        if (link.dataset.bound === 'true') return;
        link.dataset.bound = 'true';
        link.addEventListener('click', event => {
          event.preventDefault();
          showHome({ push: true });
        });
      });
    }

    function bindStartCards() {
      documentRef.querySelectorAll('[data-start-card]').forEach(link => {
        link.addEventListener('click', event => {
          if (event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          const resumeSnapshot = link === homePrimaryAction ? homeResumeSnapshot : null;
          openCard(link.dataset.startCard, resumeSnapshot?.sceneId || null, { resumeSnapshot });
        });
      });
    }

    storyBackButton.addEventListener('click', () => {
      if (storyBackMode(root.history.state) === 'story') {
        reader?.replaceHistorySnapshot?.();
        root.history.back();
        return;
      }
      showHome({ push: true });
    });

    root.addEventListener('popstate', event => {
      if (event.state?.atlasHome || root.location.hash === '#home' || !root.location.hash) {
        showHome();
      } else if (event.state?.atlasV5 || readerModule.parseCardHash(root.location.hash)) {
        homeView.hidden = true;
        cardView.hidden = false;
      }
    });

    root.addEventListener('pagehide', () => {
      const snapshot = currentReadingSnapshot();
      if (snapshot) storeLastReadSnapshot(snapshot);
    });

    renderHomeSections();
    updateHomePrimaryAction();
    bindHomeLinks();
    bindStartCards();
    root.history.replaceState({ atlasHome: true }, '', root.location.hash || '#home');

    const direct = readerModule.parseCardHash(root.location.hash);
    if (direct && queries.getCard(direct.cardId)) {
      reader.start(BRAND_CONFIG.startCardId);
      readerStarted = true;
    } else {
      showHome();
    }

    const api = {
      brand: BRAND_CONFIG,
      data,
      queries,
      reader,
      openCard,
      showHome,
      getMap: () => map,
      getState: () => ({
        view: cardView.hidden ? 'home' : 'card',
        cardId: reader.state.activeCardId,
        sceneId: reader.state.activeSceneId,
        mapStateId: map?.getActiveMapState()?.id || null
      })
    };
    root.ATLAS_V5_APP = api;
    return api;
  }

  root.ATLAS_BRAND = BRAND_CONFIG;
  if (documentRef.readyState === 'loading') {
    documentRef.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}(
  typeof window !== 'undefined' ? window : globalThis,
  typeof document !== 'undefined' ? document : null
));
