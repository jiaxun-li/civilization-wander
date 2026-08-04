(function exposeV4Cards(root, factory) {
  const api = factory();
  if (root) root.ATLAS_V5_CARDS = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
}(typeof window !== 'undefined' ? window : globalThis, function buildV4Cards() {
  'use strict';

  function escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function formatTimeSpan(timeSpan = {}) {
    const start = Number.isInteger(timeSpan.start) ? timeSpan.start : null;
    const end = Number.isInteger(timeSpan.end) ? timeSpan.end : null;
    const prefix = timeSpan.approximate ? '约' : '';
    const singleYear = year => year < 0 ? `公元前${Math.abs(year)}年` : `公元${year}年`;
    if (start === null && end === null) return '';
    if (start !== null && end === null) return `${prefix}${singleYear(start)}以后`;
    if (start === null && end !== null) return `${prefix}${singleYear(end)}以前`;
    if (start === end) return `${prefix}${singleYear(start)}`;
    if (start < 0 && end < 0) return `${prefix}公元前${Math.abs(start)}—前${Math.abs(end)}年`;
    if (start > 0 && end > 0) return `${prefix}公元${start}—${end}年`;
    return `${prefix}${singleYear(start).replace(/年$/, '')}—${singleYear(end)}`;
  }

  function createCardComponents({ data, queries }) {
    if (!data || !queries) throw new TypeError('V5 data and queries are required');

    function entityForCard(card) {
      return queries.getEntity(card?.primaryEntityId) || null;
    }

    function targetContext(navigationId) {
      const navigation = queries.getNavigationOption(navigationId);
      if (!navigation) return null;
      const card = queries.getCard(navigation.target.cardId);
      const entity = entityForCard(card);
      const sceneId = queries.getNavigationEntrySceneId(navigation);
      return card ? { navigation, card, entity, sceneId } : null;
    }

    function renderSmallCard(navigationId, options = {}) {
      const placement = options.placement;
      if (placement && placement.visible === false) return '';
      const context = targetContext(navigationId);
      if (!context) return '';
      const { navigation, card, sceneId } = context;
      const content = `<strong class="v4-small-card__title">${escapeHtml(navigation.label || card.title)}</strong>`;
      if (placement && placement.interactive === false) {
        return `
          <article class="v4-small-card is-noninteractive" aria-disabled="true">
            ${content}
          </article>`;
      }
      return `
        <a class="v4-small-card" href="#card/${escapeHtml(card.id)}/${escapeHtml(sceneId)}"
          data-navigation-id="${escapeHtml(navigation.id)}"
          data-preview-navigation-id="${escapeHtml(navigation.id)}"
          aria-label="${escapeHtml(`${navigation.label}：${navigation.description}`)}"
          aria-controls="v4-navigation-preview" aria-expanded="false">
          ${content}
        </a>`;
    }

    function renderPreviewCard(navigationId) {
      const context = targetContext(navigationId);
      if (!context) return '';
      const { navigation, card, entity } = context;
      const edge = navigation.basis?.kind === 'structuralEdge'
        ? queries.getStructuralEdge(navigation.basis.structuralEdgeId)
        : null;
      return `
        <aside class="v4-preview-card" role="tooltip" data-preview-card="${escapeHtml(navigationId)}">
          <span class="v4-preview-card__eyebrow">${escapeHtml(entity ? queries.getEntityTypeLabel(entity.type) : '延伸阅读')}</span>
          <strong>${escapeHtml(entity?.name || card.title)}</strong>
          <span>${escapeHtml(edge?.label?.forward || navigation.label)}</span>
          <p>${escapeHtml(edge?.summaries?.canonical || navigation.description || entity?.canonicalSummary || '')}</p>
          <small>${escapeHtml(card.title)}</small>
        </aside>`;
    }

    function renderContentBlock(block) {
      switch (block.kind) {
        case 'historicalCase':
          return `<p class="v4-scene__case"><strong>${escapeHtml(block.title)}</strong> ${escapeHtml(block.text)}</p>`;
        case 'mechanism':
          return `
            <div class="v4-scene__mechanism">
              <p><strong>${escapeHtml(block.statement)}</strong></p>
              <ol>${block.steps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
            </div>`;
        case 'asset': {
          const asset = queries.getAsset(block.assetId);
          if (!asset) return '';
          if (asset.type === 'image') {
            return `
              <figure class="v4-scene__asset">
                <img src="${escapeHtml(asset.src)}" alt="${escapeHtml(asset.alt)}" loading="lazy" decoding="async">
                ${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ''}
              </figure>`;
          }
          return `<figure class="v4-scene__asset"><figcaption>${escapeHtml(block.caption || asset.alt)}</figcaption></figure>`;
        }
        case 'geographyObservation':
        case 'historicalFact':
        case 'interpretation':
        case 'editorialSynthesis':
        case 'narrativeTransition':
        case 'sourceNote':
          return `<p>${escapeHtml(block.text)}</p>`;
        default:
          throw new TypeError(`ClaimBlock kind ${String(block.kind)} is not valid public Scene content`);
      }
    }

    function renderScene(scene, activeSceneId, sceneIndex, sceneCount) {
      const inlinePlacements = queries.getNavigationPlacementsForScene(scene.id, 'inline')
        .filter(placement => placement.visible);
      const publicTimeLabel = scene.timeDisplay === 'undatedNarrative'
        ? '叙事时间 · 无可考年份'
        : scene.timeSpan.label;
      const progressLabel = `${String(sceneIndex + 1).padStart(2, '0')} / ${String(sceneCount).padStart(2, '0')}`;
      return `
        <section class="v4-scene${scene.id === activeSceneId ? ' is-active' : ''}"
          id="scene-${escapeHtml(scene.id)}"
          data-scene-id="${escapeHtml(scene.id)}"
          data-presentation-kind="${escapeHtml(scene.presentation.kind)}"
          tabindex="-1"
          aria-labelledby="scene-title-${escapeHtml(scene.id)}">
          <div class="v4-scene__inner">
            <p class="v4-scene__time">${escapeHtml(publicTimeLabel)} <span class="v4-scene__progress">· ${escapeHtml(progressLabel)}</span></p>
            <h2 id="scene-title-${escapeHtml(scene.id)}">${escapeHtml(scene.title)}</h2>
            <div class="v4-scene__copy">${scene.contentBlocks.map(renderContentBlock).join('')}</div>
            ${inlinePlacements.length ? `
              <nav class="v4-scene__navigation" aria-label="从本段继续探索">
                ${inlinePlacements.map(placement => renderSmallCard(placement.navigationOptionId, { placement })).join('')}
              </nav>` : ''}
          </div>
        </section>`;
    }

    function renderMainCard(cardId, options = {}) {
      const card = queries.getCard(cardId);
      if (!card) return '';
      const entity = entityForCard(card);
      const scenes = queries.getScenesForCard(card.id);
      const activeSceneId = options.activeSceneId && card.sceneIds.includes(options.activeSceneId)
        ? options.activeSceneId
        : scenes[0]?.id;
      const closingPlacements = queries.getNavigationPlacementsForCard(card.id, 'closing')
        .filter(placement => placement.visible)
        .slice(0, 4);
      const hasOptionalMedia = scenes.some(scene => scene.presentation.kind !== 'textOnly');
      const coordinate = [
        entity?.name || '',
        formatTimeSpan(entity?.timeSpan || card.timeSpan)
      ].filter(Boolean).join(' · ');
      return `
        <article class="v4-main-card${hasOptionalMedia ? '' : ' is-text-only-card'}" data-card-id="${escapeHtml(card.id)}">
          <header class="v4-main-card__header">
            <p class="v4-main-card__coordinate">${escapeHtml(coordinate)}</p>
            <h1 tabindex="-1">${escapeHtml(card.title)}</h1>
            <p class="v4-main-card__introduction">${escapeHtml(card.introduction)}</p>
          </header>
          <div class="v4-main-card__layout">
            ${hasOptionalMedia ? `
              <aside class="v4-main-card__media" data-card-media aria-live="polite">
                <div class="v4-main-card__map-slot" data-map-slot
                  aria-label="随当前阅读内容更新的辅助图像"></div>
                <p class="v4-main-card__media-caption" data-media-caption></p>
              </aside>` : ''}
            <div class="v4-main-card__scenes">
              ${scenes.map((scene, index) => renderScene(scene, activeSceneId, index, scenes.length)).join('')}
              ${closingPlacements.length ? `<footer class="v4-main-card__closing">
                <p class="v4-main-card__eyebrow">继续漫游</p>
                <h2>换一个历史视角</h2>
                <div class="v4-main-card__recommendations">
                  ${closingPlacements.map(placement => renderSmallCard(placement.navigationOptionId, { placement })).join('')}
                </div>
              </footer>` : ''}
            </div>
          </div>
          <div class="v4-preview-layer" id="v4-navigation-preview"
            data-preview-layer aria-live="polite"></div>
        </article>`;
    }

    return {
      renderContentBlock,
      renderSmallCard,
      renderPreviewCard,
      renderMainCard,
      targetContext
    };
  }

  return {
    escapeHtml,
    formatTimeSpan,
    createCardComponents
  };
}));
