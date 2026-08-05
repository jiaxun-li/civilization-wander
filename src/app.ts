import { atlasData } from './data/atlas-data.ts';
import { queriesModule } from './data/queries.ts';
import { cardsModule } from './reader/card-components.ts';
import { cardReaderModule } from './reader/card-reader.ts';
import { naturalEarthModule } from './map/natural-earth-base.ts';
import { mapModule } from './map/map-renderer.ts';
import {
  mountHomeView,
  type HomeActionViewModel,
  type HomeCardViewModel,
  type HomeSectionViewModel
} from './home/home-view.ts';
import { mountSiteHeader } from './shell/site-header.ts';
import type {
  AssetId,
  AtlasApp,
  AtlasHistoryState,
  AtlasMap,
  AtlasQueries,
  AtlasWindow,
  BrandConfig,
  Card,
  CardId,
  CardReader,
  CardReaderModule,
  Entity,
  ImageAsset,
  ImagePresentation,
  LastReadSnapshot,
  MapPresentationConfig,
  MapState,
  NavigationTrailEntry,
  ReaderContext,
  ReaderState,
  Scene,
  SceneId,
  ScenePresentation,
  StructureView
} from './types/runtime.ts';

interface HomeSection {
  readonly eyebrow: string;
  readonly title: string;
  readonly cardIds: readonly CardId[];
}

type SnapshotCandidate = Record<string, unknown>;

function record(value: unknown): SnapshotCandidate | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as SnapshotCandidate
    : null;
}

function requiredElement<T extends Element>(
  documentRef: Document,
  selector: string
): T {
  const element = documentRef.querySelector<T>(selector);
  if (!element) throw new Error(`Required interface element is missing: ${selector}`);
  return element;
}

function requiredElementById<T extends HTMLElement>(
  documentRef: Document,
  id: string
): T {
  const element = documentRef.getElementById(id);
  if (!element) throw new Error(`Required interface element is missing: #${id}`);
  return element as T;
}

export let atlasApp: AtlasApp | null = null;

export const appInternals = (function startCivilizationAtlas(root: AtlasWindow, documentRef: Document | null) {
  'use strict';

  const LAST_READ_STORAGE_KEY = 'civilization-wander:v5:last-read';
  const HOME_SECTIONS: readonly HomeSection[] = Object.freeze([
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

  const BRAND_CONFIG: BrandConfig = Object.freeze({
    name: '文明漫游',
    tagline: '从一个人物、城市、信仰或作品出发，沿着关联漫游人类文明。',
    shortTagline: '沿着关联漫游人类文明',
    startCardId: 'sumer-measuring-land-time'
  });

  function normalizeLastReadSnapshot(snapshot: unknown, queries: AtlasQueries): LastReadSnapshot | null {
    const candidate = record(snapshot);
    if (candidate?.atlasV5 !== true || !queries) return null;
    const cardId = typeof candidate.cardId === 'string' ? candidate.cardId : null;
    const sceneId = typeof candidate.sceneId === 'string' ? candidate.sceneId : null;
    const card = queries.getCard(cardId);
    const scene = queries.getScene(sceneId);
    if (!card || !scene || !card.sceneIds.includes(scene.id)) return null;
    const navigationStack: NavigationTrailEntry[] = Array.isArray(candidate.navigationStack)
      ? candidate.navigationStack.map(record).filter((entry): entry is SnapshotCandidate => Boolean(entry)).filter(entry => {
        const entryCardId = typeof entry.cardId === 'string' ? entry.cardId : null;
        const entrySceneId = typeof entry.sceneId === 'string' ? entry.sceneId : null;
        const entryCard = queries.getCard(entryCardId);
        const entryScene = queries.getScene(entrySceneId);
        return Boolean(entryCard && entryScene && entryCard.sceneIds.includes(entryScene.id));
      }).map(entry => ({
        cardId: entry.cardId as string,
        sceneId: entry.sceneId as string,
        scrollY: typeof entry.scrollY === 'number' && Number.isFinite(entry.scrollY) && entry.scrollY >= 0
          ? entry.scrollY
          : 0,
        navigationId: typeof entry.navigationId === 'string' ? entry.navigationId : null
      } as NavigationTrailEntry))
      : [];
    return {
      atlasV5: true,
      cardId: card.id,
      sceneId: scene.id,
      scrollY: Number.isFinite(candidate.scrollY) && (candidate.scrollY as number) >= 0
        ? candidate.scrollY as number
        : 0,
      navigationStack
    };
  }

  function parseLastReadSnapshot(serialized: unknown, queries: AtlasQueries): LastReadSnapshot | null {
    if (typeof serialized !== 'string' || serialized.length === 0) return null;
    try {
      return normalizeLastReadSnapshot(JSON.parse(serialized), queries);
    } catch (_error) {
      return null;
    }
  }

  function shouldSaveCardSnapshot(cardView: HTMLElement | null, historyState: AtlasHistoryState | null) {
    return Boolean(
      cardView &&
      cardView.hidden === false &&
      historyState?.atlasV5
    );
  }

  function saveCardSnapshotBeforeTransition(
    cardView: HTMLElement | null,
    historyState: AtlasHistoryState | null,
    reader: CardReader | null
  ) {
    if (!shouldSaveCardSnapshot(cardView, historyState)) return false;
    reader?.replaceHistorySnapshot?.();
    return true;
  }

  function pushHistoryEntryAfterSavingCard(
    cardView: HTMLElement | null,
    history: History,
    reader: CardReader | null,
    nextState: AtlasHistoryState,
    hash: string
  ) {
    const savedCardSnapshot = saveCardSnapshotBeforeTransition(
      cardView,
      history.state,
      reader
    );
    history.pushState(nextState, '', hash);
    return savedCardSnapshot;
  }

  function shouldResetMediaCard(activeMediaCardId: CardId | null, nextCardId: CardId) {
    return activeMediaCardId !== nextCardId;
  }

  function adjacentSceneImageAssets(
    queries: AtlasQueries,
    readerModule: CardReaderModule,
    cardId: CardId,
    sceneId: SceneId,
    excludedAssetId: AssetId | null = null
  ): ImageAsset[] {
    const card = queries?.getCard?.(cardId);
    const sceneIndex = card?.sceneIds.indexOf(sceneId) ?? -1;
    if (!card || sceneIndex < 0 || !readerModule?.resolveSceneMedia) return [];
    const assets: ImageAsset[] = [];
    const seen = new Set(excludedAssetId ? [excludedAssetId] : []);
    for (const direction of [-1, 1]) {
      for (let index = sceneIndex + direction;
        index >= 0 && index < card.sceneIds.length;
        index += direction) {
        const resolved = readerModule.resolveSceneMedia(queries, cardId, card.sceneIds[index]);
        const presentation = resolved?.presentation;
        if (presentation?.kind !== 'image' && presentation?.kind !== 'imageAndText') continue;
        const asset = queries.getAsset(presentation.assetId);
        if (!asset || asset.type !== 'image' || seen.has(asset.id)) continue;
        seen.add(asset.id);
        assets.push(asset);
        break;
      }
    }
    return assets;
  }

  async function waitForImageReady(image: HTMLImageElement): Promise<HTMLImageElement> {
    if (!image) throw new TypeError('image is required');
    if (!image.complete) {
      await new Promise((resolve, reject) => {
        image.addEventListener('load', () => resolve(undefined), { once: true });
        image.addEventListener('error', () => reject(new Error('Image failed to load')), { once: true });
      });
    }
    if (!image.naturalWidth) throw new Error('Image failed to load');
    if (typeof image.decode === 'function') {
      try {
        await image.decode();
      } catch (_error) {
        if (!image.complete || !image.naturalWidth) throw _error;
      }
    }
    return image;
  }

  function storyBackMode(historyState: AtlasHistoryState | null): 'story' | 'home' {
    return historyState?.entrySource === 'card' ? 'story' : 'home';
  }

  function storyTrailEntityNames(readerState: ReaderState | null | undefined, queries: AtlasQueries): string[] {
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

  const internals = Object.freeze({
    homeSections: HOME_SECTIONS,
    normalizeLastReadSnapshot,
    parseLastReadSnapshot,
    shouldSaveCardSnapshot,
    saveCardSnapshotBeforeTransition,
    pushHistoryEntryAfterSavingCard,
    shouldResetMediaCard,
    adjacentSceneImageAssets,
    waitForImageReady,
    storyBackMode,
    storyTrailEntityNames
  });
  if (!documentRef) return internals;
  const runtimeDocument = documentRef;

  function initialize() {
    const data = atlasData;
    const queries = queriesModule;
    const readerModule = cardReaderModule;
    const naturalEarth = naturalEarthModule.base;
    if (!naturalEarth) throw new Error('Natural Earth base failed to initialize');
    const verifiedNaturalEarth = naturalEarth;
    const validation = queries.validateAtlasData();
    if (!validation.valid) throw new Error(`V5 data validation failed: ${validation.errors.join('; ')}`);

    mountSiteHeader(requiredElement<HTMLElement>(runtimeDocument, '.site-header'), BRAND_CONFIG);
    const homeView = requiredElementById<HTMLElement>(runtimeDocument, 'home-view');
    const cardView = requiredElementById<HTMLElement>(runtimeDocument, 'card-view');
    const cardRoot = requiredElementById<HTMLElement>(runtimeDocument, 'card-root');
    const homeViewController = mountHomeView(homeView, {
      primaryAction: homeActionViewModel(BRAND_CONFIG.startCardId, '从苏美尔开始'),
      featuredActions: [
        homeActionViewModel('odyssey-name-and-home', '从《奥德赛》开始'),
        homeActionViewModel('egypt-pyramids-kingdom-at-work', '从金字塔开始')
      ],
      sections: HOME_SECTIONS.map(homeSectionViewModel)
    });
    const homePrimaryAction = requiredElement<HTMLAnchorElement>(runtimeDocument, '[data-home-primary-action]');
    const storyBackBar = requiredElement<HTMLElement>(runtimeDocument, '[data-story-back-bar]');
    const storyBackButton = requiredElement<HTMLButtonElement>(runtimeDocument, '[data-story-back]');
    const storyBackDesktop = requiredElement<HTMLElement>(runtimeDocument, '[data-story-back-desktop]');
    const storyBackMobile = requiredElement<HTMLElement>(runtimeDocument, '[data-story-back-mobile]');
    const storyTrail = requiredElement<HTMLElement>(runtimeDocument, '[data-story-trail]');
    const components = cardsModule.createCardComponents({ data, queries });

    let reader: CardReader | null = null;
    let readerStarted = false;
    let map: AtlasMap | null = null;
    let mapContainer: HTMLElement | null = null;
    let activeMediaCardId: CardId | null = null;
    let activeImageAssetId: AssetId | null = null;
    let mediaImageRequestSequence = 0;
    let mediaImageTransitionSequence = 0;
    let mediaImageTransitionTimer: number | null = null;
    const imagePreloads = new Map<AssetId, HTMLImageElement>();
    const preloadedImageAssetIds = new Set<AssetId>();
    let homeResumeSnapshot: LastReadSnapshot | null = null;

    function entityTypeLabel(entity: Entity): string {
      return queries.getEntityTypeLabel(entity.type) || entity.type;
    }

    function homeActionViewModel(cardId: CardId, label: string): HomeActionViewModel {
      const card = queries.getCard(cardId);
      if (!card) throw new Error(`Unknown home action story: ${cardId}`);
      return {
        cardId: card.id,
        href: readerModule.buildCardHash(card.id, card.sceneIds[0]),
        label
      };
    }

    function homeCardViewModel(cardId: CardId): HomeCardViewModel {
      const card = queries.getCard(cardId);
      if (!card) throw new Error(`Unknown home story: ${cardId}`);
      const entity = queries.getEntity(card.primaryEntityId);
      if (!entity) throw new Error(`Missing primary Entity for home story: ${cardId}`);
      return {
        cardId: card.id,
        href: readerModule.buildCardHash(card.id, card.sceneIds[0]),
        entityType: entityTypeLabel(entity),
        entityName: entity.name,
        summary: entity.canonicalSummary,
        cardTitle: card.title
      };
    }

    function homeSectionViewModel(section: HomeSection): HomeSectionViewModel {
      return {
        eyebrow: section.eyebrow,
        title: section.title,
        cards: section.cardIds.map(homeCardViewModel)
      };
    }

    function readLastReadSnapshot() {
      try {
        return parseLastReadSnapshot(root.localStorage?.getItem(LAST_READ_STORAGE_KEY), queries);
      } catch (_error) {
        return null;
      }
    }

    function storeLastReadSnapshot(snapshot: unknown): boolean {
      const normalized = normalizeLastReadSnapshot(snapshot, queries);
      if (!normalized) return false;
      try {
        root.localStorage?.setItem(LAST_READ_STORAGE_KEY, JSON.stringify(normalized));
        return true;
      } catch (_error) {
        return false;
      }
    }

    function currentReadingSnapshot(): LastReadSnapshot | null {
      if (!readerStarted || cardView.hidden || !reader?.state.activeCardId) return null;
      return normalizeLastReadSnapshot({
        atlasV5: true,
        cardId: reader.state.activeCardId,
        sceneId: reader.state.activeSceneId,
        scrollY: Number(root.scrollY || 0),
        navigationStack: reader.state.navigationStack
      }, queries);
    }

    function updateHomePrimaryAction(snapshot: unknown = readLastReadSnapshot()): void {
      homeResumeSnapshot = normalizeLastReadSnapshot(snapshot, queries);
      const card = homeResumeSnapshot
        ? queries.getCard(homeResumeSnapshot.cardId)
        : queries.getCard(BRAND_CONFIG.startCardId);
      if (!card) throw new Error(`Unknown start story: ${BRAND_CONFIG.startCardId}`);
      const sceneId = homeResumeSnapshot?.sceneId || card.sceneIds[0];
      homeViewController.updatePrimaryAction({
        cardId: card.id,
        href: readerModule.buildCardHash(card.id, sceneId),
        label: homeResumeSnapshot ? `继续上次阅读：${card.title}` : '从苏美尔开始'
      });
    }

    function updateStoryBackControl({ visible = false }: { visible?: boolean } = {}): void {
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

    function showHome({ push = false }: { push?: boolean } = {}): void {
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
      runtimeDocument.title = `${BRAND_CONFIG.name} · 连续阅读文明知识网络`;
      updateStoryBackControl();
      updateHomePrimaryAction(lastReadSnapshot || undefined);
      root.scrollTo(0, 0);
      runtimeDocument.getElementById('home-title')?.focus?.({ preventScroll: true });
    }

    function directMediaImage(container: Element | null): HTMLImageElement | null {
      const image = Array.from(container?.children || []).find(child =>
        child.tagName === 'IMG' && !child.hasAttribute('data-media-image-transition')
      );
      return image ? image as HTMLImageElement : null;
    }

    function clearMediaImageTransition() {
      mediaImageTransitionSequence += 1;
      if (mediaImageTransitionTimer) root.clearTimeout?.(mediaImageTransitionTimer);
      mediaImageTransitionTimer = null;
      cardRoot.querySelectorAll?.('[data-media-image-transition]').forEach(node => node.remove?.());
    }

    function invalidateMediaImageRequest() {
      mediaImageRequestSequence += 1;
    }

    function preloadImageAsset(asset: ImageAsset): void {
      if (!asset || asset.type !== 'image' || activeImageAssetId === asset.id ||
          preloadedImageAssetIds.has(asset.id) || imagePreloads.has(asset.id)) return;
      const image = runtimeDocument.createElement('img');
      image.decoding = 'async';
      image.fetchPriority = 'low';
      image.addEventListener('load', () => {
        imagePreloads.delete(asset.id);
        preloadedImageAssetIds.add(asset.id);
        image.decode?.().catch?.(() => {});
      }, { once: true });
      image.addEventListener('error', () => imagePreloads.delete(asset.id), { once: true });
      imagePreloads.set(asset.id, image);
      image.src = asset.src;
    }

    function preloadAdjacentSceneImages(
      cardId: CardId | undefined,
      sceneId: SceneId | undefined,
      currentAssetId: AssetId
    ): void {
      if (!cardId || !sceneId) return;
      if (root.navigator?.connection?.saveData) return;
      adjacentSceneImageAssets(queries, readerModule, cardId, sceneId, currentAssetId)
        .forEach(preloadImageAsset);
    }

    function transitionMediaImage(
      container: HTMLElement,
      incomingImage: HTMLImageElement | null,
      outgoingImage: HTMLImageElement | null
    ): void {
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

    function ensureMap(): AtlasMap | null {
      invalidateMediaImageRequest();
      const nextContainer = cardRoot.querySelector<HTMLElement>('[data-map-slot]');
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
        ? directMediaImage(nextContainer)?.cloneNode(true) as HTMLImageElement | null
        : null;
      map?.destroy();
      activeImageAssetId = null;
      mapContainer = nextContainer;
      map = mapModule.createNaturalEarthMap({
        container: nextContainer,
        data,
        queries,
        naturalEarth: verifiedNaturalEarth,
        documentRef: runtimeDocument,
        windowRef: root,
        onNavigate(navigationId: string) {
          reader?.followNavigation(navigationId);
        }
      });
      nextContainer.querySelector('[data-v4-map]')?.removeAttribute('aria-hidden');
      transitionMediaImage(nextContainer, null, outgoingImage);
      return map;
    }

    function setMediaVisibility(presentation: ScenePresentation): void {
      const article = cardRoot.querySelector<HTMLElement>('[data-card-id]');
      const media = cardRoot.querySelector<HTMLElement>('[data-card-media]');
      if (!article || !media) return;
      const hasMedia = presentation.kind !== 'textOnly';
      article.classList.toggle('is-media-hidden', !hasMedia);
      media.hidden = !hasMedia;
    }

    function renderImagePresentation(
      presentation: ImagePresentation,
      scene: Scene,
      context: ReaderContext
    ): void {
      const asset = queries.getAsset(presentation.assetId);
      const nextContainer = cardRoot.querySelector<HTMLElement>('[data-map-slot]');
      if (!asset || asset.type !== 'image' || !nextContainer) return;
      preloadAdjacentSceneImages(context?.cardId, scene?.id, asset.id);
      if (activeImageAssetId === asset.id && mapContainer === nextContainer) return;
      const outgoingImage = activeImageAssetId
        ? directMediaImage(nextContainer)
        : null;
      const outgoingAssetId = activeImageAssetId;
      mapContainer = nextContainer;
      activeImageAssetId = asset.id;
      const requestSequence = ++mediaImageRequestSequence;
      const incomingImage = runtimeDocument.createElement('img');
      incomingImage.src = asset.src;
      incomingImage.alt = asset.alt;
      incomingImage.decoding = 'async';
      incomingImage.fetchPriority = 'high';
      waitForImageReady(incomingImage).then(() => {
        if (requestSequence !== mediaImageRequestSequence || activeImageAssetId !== asset.id) return;
        nextContainer.append(incomingImage);
        nextContainer.querySelector('[data-v4-map]')?.setAttribute('aria-hidden', 'true');
        transitionMediaImage(nextContainer, incomingImage, outgoingImage);
        const caption = cardRoot.querySelector<HTMLElement>('[data-media-caption]');
        if (caption) caption.textContent = asset.title;
      }).catch(() => {
        if (requestSequence !== mediaImageRequestSequence || activeImageAssetId !== asset.id) return;
        activeImageAssetId = outgoingAssetId;
      });
    }

    reader = readerModule.createCardReader({
      data,
      queries,
      components,
      root: cardRoot,
      windowRef: root,
      onPresentationChange(presentation: ScenePresentation, scene: Scene, context: ReaderContext) {
        setMediaVisibility(presentation);
        if (presentation.kind === 'textOnly') {
          invalidateMediaImageRequest();
          const caption = cardRoot.querySelector<HTMLElement>('[data-media-caption]');
          if (caption) caption.textContent = '';
        } else if (presentation.kind === 'image' || presentation.kind === 'imageAndText') {
          renderImagePresentation(presentation, scene, context);
        }
      },
      onMapStateChange(
        mapState: MapState | null,
        scene: Scene,
        mapConfig: MapPresentationConfig | null,
        context: ReaderContext
      ) {
        if (!mapState || !mapConfig) return;
        const activeMap = ensureMap();
        activeMap?.renderMapState(
          mapState,
          context?.presentationScene || scene,
          mapConfig,
          context
        );
        const caption = cardRoot.querySelector<HTMLElement>('[data-media-caption]');
        if (caption) caption.textContent = mapConfig.caption || '范围、选点与路线均为近似教学表达。';
      },
      onStructureViewsChange(views: readonly StructureView[], scene: Scene, context: ReaderContext) {
        const presentationScene = context?.presentationScene;
        const presentation = presentationScene?.presentation;
        if (presentationScene && (presentation?.kind === 'map' || presentation?.kind === 'mapAndText')) {
          ensureMap()?.setStructureViews(
            views,
            presentationScene,
            context
          );
        }
      },
      onCardChange(card: Card) {
        if (shouldResetMediaCard(activeMediaCardId, card.id)) {
          invalidateMediaImageRequest();
          clearMediaImageTransition();
          map?.destroy();
          map = null;
          mapContainer = null;
          activeImageAssetId = null;
          activeMediaCardId = card.id;
        }
        homeView.hidden = true;
        cardView.hidden = false;
        runtimeDocument.title = `${card.title} · ${BRAND_CONFIG.name}`;
        updateStoryBackControl({ visible: true });
      }
    });

    function openCard(
      cardId: CardId,
      sceneId: SceneId | null = null,
      { resumeSnapshot = null }: { resumeSnapshot?: LastReadSnapshot | null } = {}
    ): boolean {
      const card = queries.getCard(cardId);
      const activeReader = reader;
      if (!card || !activeReader) return false;
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
      const nextState: AtlasHistoryState = {
        atlasV5: true,
        cardId: card.id,
        sceneId: resolvedSceneId,
        scrollY,
        entrySource: enteringFromHome ? 'home' : 'card',
        navigationStack: resume ? navigationStack : (enteringFromHome ? [] : activeReader.state.navigationStack)
      };
      if (!readerStarted) {
        root.history.pushState(nextState, '', hash);
        activeReader.start(card.id);
        readerStarted = true;
        if (resume) {
          root.history.replaceState(nextState, '', hash);
          activeReader.renderCard(card.id, resolvedSceneId, {
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
          activeReader,
          nextState,
          hash
        );
        activeReader.renderCard(card.id, resolvedSceneId, {
          restoreScrollY: scrollY,
          focusHeading: true,
          navigationStack: nextState.navigationStack,
          trigger: resume ? 'history' : 'navigation'
        });
      }
      return true;
    }

    function bindHomeLinks(scope: ParentNode = runtimeDocument): void {
      scope.querySelectorAll<HTMLElement>('[data-home-link]').forEach(link => {
        if (link.dataset.bound === 'true') return;
        link.dataset.bound = 'true';
        link.addEventListener('click', event => {
          event.preventDefault();
          showHome({ push: true });
        });
      });
    }

    function bindStartCards(): void {
      runtimeDocument.querySelectorAll<HTMLAnchorElement>('[data-start-card]').forEach(link => {
        link.addEventListener('click', (event: MouseEvent) => {
          if (event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          const resumeSnapshot = link === homePrimaryAction ? homeResumeSnapshot : null;
          const cardId = link.dataset.startCard;
          if (cardId) openCard(cardId, resumeSnapshot?.sceneId || null, { resumeSnapshot });
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

    if (!reader) throw new Error('V5 Card Reader failed to initialize');
    const api: AtlasApp = {
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
    atlasApp = api;
    return api;
  }

  if (runtimeDocument.readyState === 'loading') {
    runtimeDocument.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
  return internals;
}(
  (typeof window !== 'undefined' ? window : globalThis) as unknown as AtlasWindow,
  typeof document !== 'undefined' ? document : null
));
