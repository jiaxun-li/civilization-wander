const { createElement } = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const {
  CardView,
  NavigationCard,
  PublicContentBlock,
  createCardViewModel,
  createNavigationCardViewModel,
  createPreviewViewModel,
  createPublicBlockViewModel
} = require('../../src/reader/card-view.ts');
const { NavigationPreview } = require('../../src/reader/navigation-preview.ts');

function createStaticCardComponents(queries) {
  return {
    renderMainCard(cardId, options = {}) {
      const model = createCardViewModel(queries, cardId);
      if (!model) return '';
      const activeSceneId = options.activeSceneId && model.scenes.some(scene => scene.id === options.activeSceneId)
        ? options.activeSceneId
        : model.scenes[0]?.id;
      if (!activeSceneId) return '';
      return renderToStaticMarkup(createElement(CardView, {
        model,
        activeSceneId,
        mediaVisible: model.hasOptionalMedia,
        mediaCaption: '',
        preview: null,
        entryTransition: null
      }));
    },
    renderContentBlock(block) {
      const model = createPublicBlockViewModel(queries, block);
      return renderToStaticMarkup(createElement(PublicContentBlock, { block: model }));
    },
    renderSmallCard(navigationId, options = {}) {
      if (options.placement?.visible === false) return '';
      const model = createNavigationCardViewModel(
        queries,
        navigationId,
        options.placement?.interactive !== false
      );
      if (!model) return '';
      return renderToStaticMarkup(createElement(NavigationCard, {
        model,
        expanded: false
      }));
    },
    renderPreviewCard(navigationId) {
      const model = createPreviewViewModel(queries, navigationId);
      return model ? renderToStaticMarkup(createElement(NavigationPreview, model)) : '';
    }
  };
}

function createFakeCardView(queries, { onScrollIntoView } = {}) {
  const state = {
    actions: null,
    activeSceneId: null,
    cardId: null,
    caption: '',
    entryTransition: null,
    mediaVisible: false,
    previewNavigationId: null,
    sceneElements: []
  };

  function sceneElement(sceneId) {
    return {
      dataset: { sceneId },
      getBoundingClientRect() { return { top: 0, bottom: 1000 }; },
      scrollIntoView(options) { onScrollIntoView?.(sceneId, options); }
    };
  }

  return {
    state,
    renderCard(cardId, activeSceneId, actions) {
      const card = queries.getCard(cardId);
      if (!card) throw new Error(`Unknown story: ${cardId}`);
      state.cardId = cardId;
      state.activeSceneId = activeSceneId;
      state.actions = actions;
      state.previewNavigationId = null;
      state.entryTransition = null;
      state.sceneElements = card.sceneIds.map(sceneElement);
    },
    setActiveScene(sceneId) { state.activeSceneId = sceneId; },
    setMediaVisible(visible) { state.mediaVisible = visible; },
    setMediaCaption(text) { state.caption = text; },
    openPreview(navigationId) { state.previewNavigationId = navigationId; return true; },
    closePreview() { state.previewNavigationId = null; },
    setEntryTransition(phase) { state.entryTransition = phase; },
    getSceneElements() { return state.sceneElements; },
    getSceneElement(sceneId) {
      return state.sceneElements.find(element => element.dataset.sceneId === sceneId) || null;
    },
    getMapSlot() { return null; },
    focusHeading() {},
    destroy() {}
  };
}

module.exports = { createFakeCardView, createStaticCardComponents };
