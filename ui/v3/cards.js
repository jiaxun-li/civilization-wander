(function exposeV3Cards(root, factory) {
  const api = factory();
  if (root) root.ATLAS_V3_CARDS = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
}(typeof window !== 'undefined' ? window : globalThis, function buildV3Cards() {
  'use strict';

  const TYPE_LABELS = {
    person: '人物',
    polity: '政治实体',
    institution: '制度',
    peopleGroup: '人群',
    culturalTradition: '文化传统',
    languageSystem: '语言系统',
    religiousTradition: '宗教传统',
    region: '地区',
    routeNetwork: '路线网络',
    event: '事件',
    technologyPractice: '技术实践',
    writingSystem: '文字系统',
    artStyle: '艺术风格'
  };

  function escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function createCardComponents({ data, queries }) {
    if (!data || !queries) throw new TypeError('V3 data and queries are required');
    const navById = new Map(data.navigationOptions.map(item => [item.id, item]));
    const entityById = new Map(data.entities.map(item => [item.id, item]));

    function targetContext(navigationId) {
      const navigation = navById.get(navigationId);
      if (!navigation) return null;
      const card = queries.getCard(navigation.targetCardId);
      const entity = card ? entityById.get(card.entityId) : null;
      return card && entity ? { navigation, card, entity } : null;
    }

    function renderSmallCard(navigationId, options = {}) {
      const context = targetContext(navigationId);
      if (!context) return '';
      const { navigation, card, entity } = context;
      const label = TYPE_LABELS[entity.type] || entity.type;
      return `
        <a class="v3-small-card" href="#card/${escapeHtml(card.id)}/${escapeHtml(card.sceneIds[0])}"
          data-navigation-id="${escapeHtml(navigation.id)}"
          data-preview-navigation-id="${escapeHtml(navigation.id)}"
          aria-label="${escapeHtml(`${navigation.label}：${navigation.hook}`)}">
          <span class="v3-small-card__eyebrow">${escapeHtml(options.eyebrow || label)}</span>
          <strong class="v3-small-card__title">${escapeHtml(navigation.label || card.title)}</strong>
          <span class="v3-small-card__hook">${escapeHtml(navigation.hook)}</span>
          <span class="v3-small-card__summary">${escapeHtml(navigation.summary || entity.canonicalSummary)}</span>
          <span class="v3-small-card__action" aria-hidden="true">进入 →</span>
        </a>`;
    }

    function renderPreviewCard(navigationId) {
      const context = targetContext(navigationId);
      if (!context) return '';
      const { navigation, card, entity } = context;
      const edge = navigation.basis?.kind === 'structuralEdge'
        ? queries.getStructuralEdge(navigation.basis.id)
        : null;
      return `
        <aside class="v3-preview-card" role="tooltip" data-preview-card="${escapeHtml(navigationId)}">
          <span class="v3-preview-card__eyebrow">${escapeHtml(TYPE_LABELS[entity.type] || entity.type)}</span>
          <strong>${escapeHtml(entity.name)}</strong>
          <span>${escapeHtml(edge?.label?.forward || navigation.label)}</span>
          <p>${escapeHtml(edge?.canonicalSummary || navigation.summary || entity.canonicalSummary)}</p>
          <small>下一张 Card · ${escapeHtml(card.title)}</small>
        </aside>`;
    }

    function renderContentBlock(block) {
      if (block.type === 'paragraph') return `<p>${escapeHtml(block.text)}</p>`;
      if (block.type === 'asset') {
        const asset = data.assets.find(item => item.id === block.assetId);
        if (!asset) return '';
        return `<figure class="v3-scene__asset"><figcaption>${escapeHtml(block.alt || asset.alt)}</figcaption></figure>`;
      }
      return '';
    }

    function renderScene(scene, activeSceneId) {
      const navigations = queries.getNavigationOptionsForScene(scene.id);
      return `
        <section class="v3-scene${scene.id === activeSceneId ? ' is-active' : ''}"
          id="scene-${escapeHtml(scene.id)}"
          data-scene-id="${escapeHtml(scene.id)}"
          data-map-state-id="${escapeHtml(scene.mapStateId || '')}"
          tabindex="-1"
          aria-labelledby="scene-title-${escapeHtml(scene.id)}">
          <div class="v3-scene__inner">
            <p class="v3-scene__eyebrow">${escapeHtml(scene.eyebrow || scene.time?.label || '')}</p>
            <h2 id="scene-title-${escapeHtml(scene.id)}">${escapeHtml(scene.title)}</h2>
            <div class="v3-scene__copy">${scene.contentBlocks.map(renderContentBlock).join('')}</div>
            ${scene.takeaway ? `<p class="v3-scene__takeaway"><span>带走一句</span>${escapeHtml(scene.takeaway)}</p>` : ''}
            ${navigations.length ? `
              <div class="v3-scene__navigation" aria-label="从本段继续探索">
                ${navigations.map(navigation => renderSmallCard(navigation.id)).join('')}
              </div>` : ''}
          </div>
        </section>`;
    }

    function renderMainCard(cardId, options = {}) {
      const card = queries.getCard(cardId);
      if (!card) return '';
      const entity = queries.getEntity(card.entityId);
      const scenes = queries.getScenesForCard(card.id);
      const activeSceneId = options.activeSceneId && scenes.some(scene => scene.id === options.activeSceneId)
        ? options.activeSceneId
        : scenes[0]?.id;
      const closing = (card.closingNavigationIds || [])
        .map(id => navById.get(id))
        .filter(Boolean)
        .slice(0, 4);
      return `
        <article class="v3-main-card" data-card-id="${escapeHtml(card.id)}">
          <header class="v3-main-card__header">
            <p class="v3-main-card__eyebrow">${escapeHtml(`${TYPE_LABELS[entity.type] || entity.type} · ${card.kind}`)}</p>
            <h1 tabindex="-1">${escapeHtml(card.title)}</h1>
            ${card.question ? `<p class="v3-main-card__question">${escapeHtml(card.question)}</p>` : ''}
            <p class="v3-main-card__introduction">${escapeHtml(card.introduction)}</p>
          </header>
          <div class="v3-main-card__layout">
            <div class="v3-main-card__media" data-card-media aria-live="polite">
              <div class="v3-main-card__map-slot" data-map-slot
                aria-label="随当前叙事段落更新的历史空间示意图"></div>
              <p class="v3-main-card__media-caption" data-media-caption></p>
            </div>
            <div class="v3-main-card__scenes">
              ${scenes.map(scene => renderScene(scene, activeSceneId)).join('')}
              <footer class="v3-main-card__closing">
                <p class="v3-main-card__eyebrow">继续漫游</p>
                <h2>从这里进入下一张 Card</h2>
                <div class="v3-main-card__recommendations">
                  ${closing.map(navigation => renderSmallCard(navigation.id)).join('')}
                </div>
              </footer>
            </div>
          </div>
          <div class="v3-preview-layer" data-preview-layer aria-live="polite"></div>
        </article>`;
    }

    return {
      renderSmallCard,
      renderPreviewCard,
      renderMainCard,
      targetContext
    };
  }

  return {
    TYPE_LABELS,
    escapeHtml,
    createCardComponents
  };
}));
