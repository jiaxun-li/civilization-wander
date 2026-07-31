(function startCivilizationAtlas(root, documentRef) {
  'use strict';

  const BRAND_CONFIG = Object.freeze({
    name: '文明漫游',
    tagline: '从一个人物、城市、信仰或作品出发，沿着关联漫游人类文明。',
    shortTagline: '沿着关联漫游人类文明',
    defaultCardId: 'buddhism-overview',
    featuredEntityIds: ['buddhism', 'shakyamuni', 'ashoka', 'maurya']
  });

  function initialize() {
    const data = root.ATLAS_V3_DATA;
    const queries = root.ATLAS_V3_QUERIES;
    const cardsModule = root.ATLAS_V3_CARDS;
    const readerModule = root.ATLAS_V3_CARD_READER;
    const mapModule = root.ATLAS_V3_MAP;
    const naturalEarth = root.ATLAS_NATURAL_EARTH?.base;
    if (!data || !queries || !cardsModule || !readerModule || !mapModule || !naturalEarth) {
      throw new Error('V3 runtime modules failed to load');
    }
    const validation = queries.validateAtlasData();
    if (!validation.valid) throw new Error(`V3 data validation failed: ${validation.errors.join('; ')}`);

    const homeView = documentRef.getElementById('home-view');
    const cardView = documentRef.getElementById('card-view');
    const cardRoot = documentRef.getElementById('card-root');
    const homeGrid = documentRef.getElementById('home-card-grid');
    const pathList = documentRef.getElementById('reading-path-list');
    const components = cardsModule.createCardComponents({ data, queries });

    let reader = null;
    let readerStarted = false;
    let map = null;
    let mapContainer = null;

    documentRef.querySelector('[data-brand-name]').textContent = BRAND_CONFIG.name;
    documentRef.querySelector('[data-brand-tagline]').textContent = BRAND_CONFIG.shortTagline;

    function entityTypeLabel(entity) {
      return cardsModule.TYPE_LABELS[entity.type] || entity.type;
    }

    function renderHomeCards() {
      homeGrid.innerHTML = BRAND_CONFIG.featuredEntityIds.map(entityId => {
        const entity = queries.getEntity(entityId);
        const card = queries.getTargetCardForEntity(entityId);
        const firstSceneId = card.sceneIds[0];
        return `
          <a class="home-entity-card" href="${readerModule.buildCardHash(card.id, firstSceneId)}"
            data-start-card="${cardsModule.escapeHtml(card.id)}">
            <span>${cardsModule.escapeHtml(entityTypeLabel(entity))}</span>
            <strong>${cardsModule.escapeHtml(entity.name)}</strong>
            <p>${cardsModule.escapeHtml(entity.canonicalSummary)}</p>
            <small>${cardsModule.escapeHtml(card.question || card.title)}</small>
            <b aria-hidden="true">开始阅读 →</b>
          </a>`;
      }).join('');
    }

    function setReadingPath(card = null) {
      const items = ['<li><a href="#home" data-home-link>首页</a></li>'];
      if (card) {
        const entity = queries.getEntity(card.entityId);
        const stack = reader?.state.navigationStack || [];
        const previous = stack.slice(-2).map(entry => queries.getCard(entry.cardId)).filter(Boolean);
        previous.forEach(previousCard => {
          const previousEntity = queries.getEntity(previousCard.entityId);
          items.push(`<li>${cardsModule.escapeHtml(previousEntity.name)}</li>`);
        });
        items.push(`<li aria-current="page">${cardsModule.escapeHtml(entity.name)}</li>`);
      } else {
        items[0] = '<li aria-current="page">首页</li>';
      }
      pathList.innerHTML = items.join('');
      bindHomeLinks(pathList);
    }

    function showHome({ push = false } = {}) {
      if (push) root.history.pushState({ atlasHome: true }, '', '#home');
      homeView.hidden = false;
      cardView.hidden = true;
      documentRef.title = `${BRAND_CONFIG.name} · 连续阅读文明知识网络`;
      setReadingPath();
      root.scrollTo(0, 0);
      documentRef.getElementById('home-title')?.focus?.({ preventScroll: true });
    }

    function ensureMap() {
      const nextContainer = cardRoot.querySelector('[data-map-slot]');
      if (!nextContainer) return null;
      if (map && mapContainer === nextContainer) return map;
      map?.destroy();
      mapContainer = nextContainer;
      map = mapModule.createNaturalEarthMap({
        container: mapContainer,
        data,
        queries,
        naturalEarth,
        documentRef,
        onNavigate(navigationId) {
          reader.followNavigation(navigationId);
        }
      });
      return map;
    }

    reader = readerModule.createCardReader({
      data,
      queries,
      components,
      root: cardRoot,
      windowRef: root,
      onMapStateChange(mapState, scene) {
        const activeMap = ensureMap();
        activeMap?.renderMapState(mapState, scene);
        const caption = cardRoot.querySelector('[data-media-caption]');
        if (caption) caption.textContent = mapState?.caption || '';
      },
      onStructureViewsChange(views, scene) {
        ensureMap()?.setStructureViews(views, scene);
      },
      onCardChange(card) {
        homeView.hidden = true;
        cardView.hidden = false;
        const entity = queries.getEntity(card.entityId);
        documentRef.title = `${card.title} · ${BRAND_CONFIG.name}`;
        setReadingPath(card);
      }
    });

    function openCard(cardId, sceneId = null) {
      const card = queries.getCard(cardId);
      if (!card) return false;
      const resolvedSceneId = queries.getScene(sceneId)?.cardId === card.id ? sceneId : card.sceneIds[0];
      const hash = readerModule.buildCardHash(card.id, resolvedSceneId);
      if (!readerStarted) {
        root.history.pushState({
          atlasV3: true,
          cardId: card.id,
          sceneId: resolvedSceneId,
          scrollY: 0
        }, '', hash);
        reader.start(card.id);
        readerStarted = true;
      } else {
        reader.replaceHistorySnapshot();
        root.history.pushState({
          atlasV3: true,
          cardId: card.id,
          sceneId: resolvedSceneId,
          scrollY: 0
        }, '', hash);
        reader.renderCard(card.id, resolvedSceneId, { restoreScrollY: 0, focusHeading: true });
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
          openCard(link.dataset.startCard);
        });
      });
    }

    root.addEventListener('popstate', event => {
      if (event.state?.atlasHome || root.location.hash === '#home' || !root.location.hash) {
        showHome();
      } else if (event.state?.atlasV3 || readerModule.parseCardHash(root.location.hash)) {
        homeView.hidden = true;
        cardView.hidden = false;
      }
    });

    renderHomeCards();
    bindHomeLinks();
    bindStartCards();
    root.history.replaceState({ atlasHome: true }, '', root.location.hash || '#home');

    const direct = readerModule.parseCardHash(root.location.hash);
    if (direct && queries.getCard(direct.cardId)) {
      reader.start(BRAND_CONFIG.defaultCardId);
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
    root.ATLAS_V3_APP = api;
    return api;
  }

  root.ATLAS_BRAND = BRAND_CONFIG;
  if (documentRef.readyState === 'loading') {
    documentRef.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}(window, document));
