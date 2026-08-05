import type {
  AtlasQueries,
  AtlasRuntimeGlobal,
  Bounds,
  CameraPreset,
  CameraTransition,
  GeometryShape,
  HistoricalGeometry,
  MapAnnotation,
  MapModule,
  MapPresentationConfig,
  MapState,
  NaturalEarthData,
  NaturalEarthPath,
  Position,
  ReaderContext,
  Scene,
  ScreenPlacement,
  StructureView
} from '../types/runtime.ts';

type CreateNaturalEarthMapOptions = Parameters<MapModule['createNaturalEarthMap']>[0];
type RegionalPaths = { land: string; lakes: string; rivers: string };
type RegionalPathKey = keyof RegionalPaths;

const VIEW_FAMILIES = new Set(['lineage', 'composition', 'context', 'historicalNetwork']);
const SCREEN_POSITIONS = {
    auto: [50, 50],
    above: [50, 18],
    below: [50, 82],
    left: [14, 50],
    right: [86, 50],
    topLeft: [13, 16],
    topRight: [74, 16],
    bottomLeft: [13, 76],
    bottomRight: [74, 76]
} satisfies Record<ScreenPlacement, Position>;

function escapeHtml(value: unknown = ''): string {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

export function projectPoint([longitude, latitude]: Position, size = 4096): [number, number] {
    const safeLatitude = Math.max(-85.05112878, Math.min(85.05112878, Number(latitude)));
    const sin = Math.sin(safeLatitude * Math.PI / 180);
    return [
      ((Number(longitude) + 180) / 360) * size,
      (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * size
    ];
  }

export function geometryToPath(geometry: GeometryShape | null | undefined, size = 4096): string {
    if (!geometry?.type || !geometry.coordinates) return '';
    const point = (coordinates: Position): string => {
      const [x, y] = projectPoint(coordinates, size);
      return `${x.toFixed(1)} ${y.toFixed(1)}`;
    };
    const line = (coordinates: readonly Position[]): string => coordinates
      .map((position, index) => `${index ? 'L' : 'M'}${point(position)}`)
      .join('');
    const polygon = (coordinates: readonly (readonly Position[])[]): string => coordinates
      .map(ring => `${line(ring)}Z`)
      .join('');
    if (geometry.type === 'Point') {
      const [x, y] = projectPoint(geometry.coordinates, size);
      return `M${(x - 7).toFixed(1)} ${y.toFixed(1)}a7 7 0 1 0 14 0a7 7 0 1 0-14 0`;
    }
    if (geometry.type === 'MultiPoint') {
      return geometry.coordinates.map(coordinates => {
        const [x, y] = projectPoint(coordinates, size);
        return `M${(x - 6).toFixed(1)} ${y.toFixed(1)}a6 6 0 1 0 12 0a6 6 0 1 0-12 0`;
      }).join('');
    }
    if (geometry.type === 'LineString') return line(geometry.coordinates);
    if (geometry.type === 'MultiLineString') return geometry.coordinates.map(line).join('');
    if (geometry.type === 'Polygon') return polygon(geometry.coordinates);
    if (geometry.type === 'MultiPolygon') return geometry.coordinates.map(polygon).join('');
    return '';
  }

export function cameraTransform(cameraPreset: CameraPreset | null | undefined, size = 4096): string {
    const [x, y] = projectPoint(cameraPreset?.center || [0, 0], size);
    const scale = Number(cameraPreset?.scale ?? 1);
    const normalized = scale * (1000 / size);
    return `translate(500 350) scale(${normalized.toFixed(5)}) translate(${-x.toFixed(2)} ${-y.toFixed(2)})`;
  }

export function cameraViewportBounds(
  cameraPreset: CameraPreset | null | undefined,
  size = 4096,
  padding = 0.25
): Bounds {
    const [centerX, centerY] = projectPoint(cameraPreset?.center || [0, 0], size);
    const scale = Math.max(Number(cameraPreset?.scale) || 1, 0.01);
    const padded = 1 + Math.max(Number(padding) || 0, 0);
    const halfWidth = (size / scale / 2) * padded;
    const halfHeight = (size * 0.7 / scale / 2) * padded;
    return [
      centerX - halfWidth,
      centerY - halfHeight,
      centerX + halfWidth,
      centerY + halfHeight
    ];
  }

export function boundsIntersect(left: unknown, right: unknown): boolean {
    return Boolean(
      Array.isArray(left) && left.length === 4 &&
      Array.isArray(right) && right.length === 4 &&
      left.every(value => typeof value === 'number') &&
      right.every(value => typeof value === 'number') &&
      left[2] >= right[0] && left[0] <= right[2] &&
      left[3] >= right[1] && left[1] <= right[3]
    );
  }

export function selectRegionalPaths(
  items: readonly NaturalEarthPath[] = [],
  cameraPresets: readonly CameraPreset[] | CameraPreset = [],
  size = 4096
): NaturalEarthPath[] {
    const presets = (Array.isArray(cameraPresets) ? cameraPresets : [cameraPresets]).filter(Boolean);
    if (!presets.length) return [];
    const viewports = presets.map(preset => cameraViewportBounds(preset, size));
    return items.filter(item =>
      !Array.isArray(item?.bounds) || viewports.some(viewport => boundsIntersect(item.bounds, viewport))
    );
  }

export function cameraPresetsForCard(
  queries: AtlasQueries,
  cardId: string | null,
  fallbackPreset: CameraPreset | null = null
): CameraPreset[] {
    const card = cardId ? queries.getCard(cardId) : null;
    const presets: CameraPreset[] = [];
    const seen = new Set<string | undefined>();
    for (const sceneId of card?.sceneIds || []) {
      const presentation = queries.getScene(sceneId)?.presentation;
      const mapConfig = presentation?.kind === 'map' || presentation?.kind === 'mapAndText'
        ? presentation.map
        : null;
      const mapState = mapConfig ? queries.getMapState(mapConfig.mapStateId) : null;
      const preset = mapState ? queries.getCameraPreset(mapState.cameraPresetId) : null;
      if (!preset || seen.has(preset.id)) continue;
      seen.add(preset.id);
      presets.push(preset);
    }
    if (!presets.length && fallbackPreset) presets.push(fallbackPreset);
    return presets;
  }

export function projectAnnotation(
  annotation: Pick<MapAnnotation, 'anchor'> | null | undefined,
  cameraPreset: CameraPreset,
  size = 4096
): [number, number] | null {
    if (annotation?.anchor?.kind !== 'geo') return null;
    const [pointX, pointY] = projectPoint(annotation.anchor.coordinates, size);
    const [centerX, centerY] = projectPoint(cameraPreset.center, size);
    const scale = Number(cameraPreset.scale ?? 1) * (1000 / size);
    return [
      ((500 + (pointX - centerX) * scale) / 1000) * 100,
      ((350 + (pointY - centerY) * scale) / 700) * 100
    ];
  }

export function createNaturalEarthMap(options: CreateNaturalEarthMapOptions) {
    const {
      container,
      data,
      queries,
      naturalEarth,
      documentRef,
      windowRef,
      onNavigate = () => {}
    } = options;
    if (!container || !data || !queries || !naturalEarth || !documentRef) {
      throw new TypeError('container, V5 data, queries, local Natural Earth data and document are required');
    }

    const geometryPathCache = new Map<string, string>();
    let activeMapState: MapState | null = null;
    let activeScene: Scene | null = null;
    let activeMapConfig: MapPresentationConfig | null = null;
    let activeViews: StructureView[] = [];
    let activeCameraTransform = '';
    let activeCameraPreset: CameraPreset | null = null;
    const overlayTimers = new Map<string, number>();
    const overlayCommitted = new Map<string, string>();
    const overlayDesired = new Map<string, string>();
    const regionalBaseCache = new Map<string, RegionalPaths>();
    const activeBasePaths: RegionalPaths = { land: '', lakes: '', rivers: '' };

    container.innerHTML = `
      <div class="v4-map" data-v4-map>
        <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice"
          role="img" aria-labelledby="v4-map-title v4-map-description">
          <title id="v4-map-title">当前内容的历史空间示意</title>
          <desc id="v4-map-description">本地矢量背景。范围与方向为近似教学表达，地图不能缩放或拖动。</desc>
          <defs>
            <marker id="v4-map-arrow" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z"></path>
            </marker>
          </defs>
          <g class="v4-map__camera" data-map-camera>
            <path class="v4-map__land" data-map-land d=""></path>
            <g class="v4-map__lakes"><path data-map-lakes d=""></path></g>
            <g class="v4-map__rivers"><path data-map-rivers d=""></path></g>
            <g class="v4-map__historical" data-map-historical></g>
          </g>
        </svg>
        <div class="v4-map__nodes" data-map-nodes aria-label="当前内容的相关人物与延伸阅读"></div>
        <div class="v4-map__legend" data-map-legend></div>
        <p class="v4-map__approximation">近似教学示意 · 非精确疆界或路线</p>
      </div>`;

    const mapRoot = container.querySelector<HTMLElement>('[data-v4-map]')!;
    const cameraGroup = container.querySelector<SVGElement>('[data-map-camera]')!;
    const landPath = container.querySelector<SVGPathElement>('[data-map-land]')!;
    const lakePath = container.querySelector<SVGPathElement>('[data-map-lakes]')!;
    const historicalGroup = container.querySelector<SVGElement>('[data-map-historical]')!;
    const riverPath = container.querySelector<SVGPathElement>('[data-map-rivers]')!;
    const nodes = container.querySelector<HTMLElement>('[data-map-nodes]')!;
    const legend = container.querySelector<HTMLElement>('[data-map-legend]')!;

    function prefersReducedMotion(): boolean {
      return Boolean(windowRef?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
    }

    function cachedGeometryPath(geometry: HistoricalGeometry): string {
      if (!geometryPathCache.has(geometry.id)) {
        geometryPathCache.set(geometry.id, geometryToPath(geometry.geometry, naturalEarth.size));
      }
      return geometryPathCache.get(geometry.id) ?? '';
    }

    function geometryMarkup(mapState: MapState): string {
      return mapState.layers.map(layer => {
        const geometry = queries.getGeometry(layer.geometryId);
        if (!geometry) return '';
        const geometryType = geometry.geometry.type.toLowerCase();
        const directional = geometryType.includes('line') && activeViews.some(view => view.family === 'historicalNetwork');
        return `<path class="v4-map__geometry v4-map__geometry--${escapeHtml(geometryType)}${geometry.approximate ? ' is-approximate' : ''}"
          data-geometry-id="${escapeHtml(geometry.id)}"
          d="${escapeHtml(cachedGeometryPath(geometry))}"
          ${directional ? 'marker-end="url(#v4-map-arrow)"' : ''}>
          <title>${escapeHtml(geometry.label)}</title>
        </path>`;
      }).join('');
    }

    function shouldCrossfade(context: ReaderContext | null | undefined): boolean {
      return Boolean(
        activeMapState &&
        !context?.inheritedMedia &&
        context?.trigger === 'scroll' &&
        (context.direction === 'forward' || context.direction === 'backward') &&
        !prefersReducedMotion()
      );
    }

    function replaceOverlay(
      element: HTMLElement | SVGElement,
      markup: string,
      key: string,
      context: ReaderContext | null | undefined,
      afterCommit: () => void = () => {}
    ): boolean {
      if (overlayDesired.get(key) === markup) return false;
      const priorTimer = overlayTimers.get(key);
      if (priorTimer) windowRef.clearTimeout?.(priorTimer);
      overlayTimers.delete(key);
      overlayDesired.set(key, markup);
      if (overlayCommitted.get(key) === markup) {
        element.classList?.remove('is-overlay-leaving', 'is-overlay-entering');
        if (!overlayTimers.size) mapRoot.dataset.overlayTransition = 'stable';
        return false;
      }
      const animate = shouldCrossfade(context);
      mapRoot.dataset.overlayTransition = animate ? 'crossfade' : 'none';
      mapRoot.dataset.overlayDirection = context?.direction || 'stationary';
      const commit = () => {
        element.innerHTML = markup;
        overlayCommitted.set(key, markup);
        afterCommit();
      };
      if (!animate) {
        element.classList?.remove('is-overlay-leaving', 'is-overlay-entering');
        commit();
        return true;
      }
      element.classList?.add('is-overlay-leaving');
      let committed = false;
      const timer = windowRef.setTimeout?.(() => {
        if (overlayDesired.get(key) !== markup) return;
        committed = true;
        overlayTimers.delete(key);
        commit();
        element.classList?.remove('is-overlay-leaving');
        element.classList?.add('is-overlay-entering');
        const reveal = () => {
          element.classList?.remove('is-overlay-entering');
          if (!overlayTimers.size) mapRoot.dataset.overlayTransition = 'stable';
        };
        if (windowRef.requestAnimationFrame) windowRef.requestAnimationFrame(reveal);
        else reveal();
      }, 150);
      if (timer && !committed) overlayTimers.set(key, timer);
      else if (!committed) {
        commit();
        element.classList?.remove('is-overlay-leaving', 'is-overlay-entering');
      }
      return true;
    }

    function renderGeometryLayers(
      mapState: MapState,
      context: ReaderContext | null | undefined
    ): void {
      replaceOverlay(historicalGroup, geometryMarkup(mapState), 'geometry', context);
    }

    function positionForAnnotation(annotation: MapAnnotation, cameraPreset: CameraPreset): {
      left: number;
      top: number;
      geographic: boolean;
    } {
      if (annotation.anchor.kind === 'geo') {
        const projected = projectAnnotation(annotation, cameraPreset, naturalEarth.size);
        return { left: projected?.[0] ?? 50, top: projected?.[1] ?? 50, geographic: true };
      }
      const [left, top] = SCREEN_POSITIONS[annotation.placement] || SCREEN_POSITIONS.auto;
      return { left, top, geographic: false };
    }

    function nodeMarkup(
      mapConfig: MapPresentationConfig | null | undefined,
      cameraPreset: CameraPreset,
      scene: Scene | null | undefined
    ): string {
      const layers = mapConfig?.layers || [];
      const placements = scene
        ? queries.getNavigationPlacementsForScene(scene.id, 'map')
        : [];
      return layers.map(layer => {
        const annotation = queries.getMapAnnotation(layer.annotationId);
        if (!annotation) return '';
        const position = positionForAnnotation(annotation, cameraPreset);
        const style = `--node-left:${position.left.toFixed(2)}%;--node-top:${position.top.toFixed(2)}%`;
        const placementClass = ` is-placement-${escapeHtml(annotation.placement || 'auto')}`;
        if (layer.kind === 'navigation') {
          const navigation = queries.getNavigationOption(layer.navigationOptionId);
          const placement = placements.find(candidate =>
            candidate.navigationOptionId === layer.navigationOptionId
          );
          if (!navigation || !placement || placement.visible === false) return '';
          if (placement.interactive === false) {
            return `
              <span class="v4-map__node is-navigable is-noninteractive${position.geographic ? ' is-geographic' : ' is-screen-callout'}${placementClass}"
                style="${style}"
                data-annotation-id="${escapeHtml(annotation.id)}"
                aria-disabled="true">
                <span>${escapeHtml(annotation.label || navigation.label)}</span>
              </span>`;
          }
          return `
            <button class="v4-map__node is-navigable${position.geographic ? ' is-geographic' : ' is-screen-callout'}${placementClass}"
              type="button" style="${style}"
              data-map-navigation-id="${escapeHtml(navigation.id)}"
              data-annotation-id="${escapeHtml(annotation.id)}"
              aria-label="${escapeHtml(`${navigation.label}：${navigation.description}`)}">
              <span>${escapeHtml(annotation.label || navigation.label)}</span>
            </button>`;
        }
        const entity = queries.getEntity(layer.entityId);
        return entity ? `
          <span class="v4-map__node is-context${position.geographic ? ' is-geographic' : ' is-screen-callout'}${placementClass}"
            style="${style}"
            data-annotation-id="${escapeHtml(annotation.id)}"
            aria-label="${escapeHtml(annotation.label || entity.name)}">
            <span>${escapeHtml(annotation.label || entity.name)}</span>
          </span>` : '';
      }).join('');
    }

    function bindNodeNavigation(): void {
      nodes.querySelectorAll<HTMLElement>('[data-map-navigation-id]').forEach(button => {
        button.addEventListener('click', () => {
          const navigationId = button.dataset.mapNavigationId;
          if (navigationId) onNavigate(navigationId);
        });
      });
    }

    function renderNodes(
      mapConfig: MapPresentationConfig,
      cameraPreset: CameraPreset,
      scene: Scene | null,
      context: ReaderContext | null | undefined
    ): void {
      const hasGeographicLabels = (mapConfig?.layers || []).some(layer =>
        queries.getMapAnnotation(layer.annotationId)?.anchor?.kind === 'geo'
      );
      mapRoot.classList?.[hasGeographicLabels ? 'add' : 'remove']('has-geographic-labels');
      replaceOverlay(
        nodes,
        nodeMarkup(mapConfig, cameraPreset, scene),
        'nodes',
        context,
        bindNodeNavigation
      );
    }

    function applyCamera(
      cameraPreset: CameraPreset,
      transition: CameraTransition | undefined,
      context: ReaderContext | null | undefined
    ): CameraPreset {
      const requested = transition || 'cut';
      const firstRender = !activeCameraTransform;
      const adjacentReading = context?.trigger === 'scroll' &&
        (context.direction === 'forward' || context.direction === 'backward');
      const promotedCut = adjacentReading && requested === 'cut';
      const directional = promotedCut ? 'ease' : requested;
      const historyOrDirectEntry = context?.trigger === 'direct' || context?.trigger === 'history';
      const selected = historyOrDirectEntry ? 'cut' : directional;
      const effective = firstRender
        ? 'cut'
        : (prefersReducedMotion()
            ? (selected === 'hold' ? 'hold' : 'cut')
            : selected);
      mapRoot.dataset.cameraTransition = requested;
      mapRoot.dataset.effectiveCameraTransition = effective;
      mapRoot.dataset.sceneDirection = context?.direction || 'stationary';
      mapRoot.dataset.transitionTrigger = context?.trigger || 'direct';
      const transitionDuration = promotedCut ? 200 : 420;
      cameraGroup.style.transition = effective === 'ease'
        ? `transform ${transitionDuration}ms cubic-bezier(0.2, 0.72, 0.2, 1)`
        : 'none';
      if (effective === 'hold' && !firstRender) return activeCameraPreset ?? cameraPreset;
      const nextTransform = cameraTransform(cameraPreset, naturalEarth.size);
      cameraGroup.setAttribute('transform', nextTransform);
      activeCameraTransform = nextTransform;
      activeCameraPreset = cameraPreset;
      return cameraPreset;
    }

    function setBasePath(
      element: SVGPathElement | null,
      key: RegionalPathKey,
      pathData: string
    ): void {
      if (!element || activeBasePaths[key] === pathData) return;
      element.setAttribute('d', pathData);
      activeBasePaths[key] = pathData;
    }

    function renderRegionalBase(cardId: string | null, fallbackPreset: CameraPreset): void {
      const presets = cameraPresetsForCard(queries, cardId, fallbackPreset);
      const cacheKey = cardId || presets
        .map(preset => preset.id || `${preset.center?.join(',')}:${preset.scale}`)
        .sort()
        .join('|');
      let regional = regionalBaseCache.get(cacheKey);
      if (!regional) {
        const landItems: readonly NaturalEarthPath[] = naturalEarth.land?.length
          ? naturalEarth.land
          : [{ d: naturalEarth.landPath ?? '' }];
        regional = {
          land: selectRegionalPaths(landItems, presets, naturalEarth.size).map(item => item.d).join(' '),
          lakes: selectRegionalPaths(naturalEarth.lakes, presets, naturalEarth.size).map(item => item.d).join(' '),
          rivers: selectRegionalPaths(naturalEarth.rivers, presets, naturalEarth.size).map(item => item.d).join(' ')
        };
        regionalBaseCache.set(cacheKey, regional);
      }
      setBasePath(landPath, 'land', regional.land);
      setBasePath(lakePath, 'lakes', regional.lakes);
      setBasePath(riverPath, 'rivers', regional.rivers);
      mapRoot.dataset.baseRegion = cacheKey;
    }

    function renderMapState(
      mapState: MapState | null,
      scene: Scene | null = null,
      mapConfig: MapPresentationConfig | null = null,
      context: ReaderContext | null = null
    ): boolean {
      if (!mapState || !mapConfig) {
        clear();
        return false;
      }
      const targetPreset = queries.getCameraPreset(mapState.cameraPresetId);
      if (!targetPreset) return false;
      const sameRenderedPresentation = Boolean(
        activeMapState?.id === mapState.id &&
        activeScene?.id === scene?.id &&
        activeMapConfig === mapConfig
      );
      const sameInheritedMedia = Boolean(
        context?.inheritedMedia &&
        activeMapState?.id === mapState.id &&
        activeScene?.id === scene?.id
      );
      mapRoot.dataset.readingSceneId = context?.toSceneId || scene?.id || '';
      if (sameInheritedMedia || sameRenderedPresentation) {
        mapRoot.dataset.overlayTransition = 'retain';
        return true;
      }
      const displayedPreset = applyCamera(targetPreset, mapConfig.transition, context);
      const ownerCard = scene ? queries.getOwnerCardForScene(scene.id) : null;
      renderRegionalBase(context?.cardId || ownerCard?.id || null, displayedPreset);
      activeMapState = mapState;
      activeScene = scene;
      activeMapConfig = mapConfig;
      mapRoot.dataset.mapStateId = mapState.id;
      mapRoot.dataset.sceneId = scene?.id || '';
      renderGeometryLayers(mapState, context);
      renderNodes(mapConfig, displayedPreset, scene, context);
      const description = container.querySelector('#v4-map-description');
      if (description) {
        description.textContent = '本地矢量背景；范围、选点和路线均为明确标注的近似教学表达。';
      }
      return true;
    }

    function setStructureViews(
      views: readonly StructureView[] = [],
      scene: Scene | null = null,
      context: ReaderContext | null = null
    ): void {
      const sameInheritedMedia = Boolean(
        context?.inheritedMedia &&
        activeScene?.id === scene?.id
      );
      if (sameInheritedMedia) return;
      activeViews = views.filter(view => VIEW_FAMILIES.has(view.family));
      mapRoot.dataset.structureFamilies = activeViews.map(view => view.family).join(' ');
      mapRoot.classList.remove(...Array.from(VIEW_FAMILIES, family => `is-${family}`));
      activeViews.forEach(view => mapRoot.classList.add(`is-${view.family}`));
      const ownerCard = scene ? queries.getOwnerCardForScene(scene.id) : null;
      const focus = ownerCard?.primaryEntityId
        ? { kind: 'entity', id: ownerCard.primaryEntityId }
        : null;
      const markup = activeViews.map(view => {
        const items = queries.getStructureViewItems(view.id, focus);
        return `
          <span class="v4-map__legend-item v4-map__legend-item--${escapeHtml(view.family)}"
            data-structure-view-id="${escapeHtml(view.id)}"
            data-structure-item-count="${items.length}">
            <strong>${escapeHtml(view.title)}</strong>
            <small>${escapeHtml(
              view.family === 'lineage' ? `直接关系 · ${items.length}` :
              view.family === 'composition' ? `组成关系 · ${items.length}` :
              view.family === 'context' ? `精选情境 · ${items.length}` :
              `历史网络 · ${items.length}`
            )}</small>
          </span>`;
      }).join('');
      replaceOverlay(legend, markup, 'legend', context);
      mapRoot.dataset.sceneId = scene?.id || mapRoot.dataset.sceneId || '';
      if (activeMapState) renderGeometryLayers(activeMapState, context);
    }

    function clear(): void {
      overlayTimers.forEach(timer => windowRef.clearTimeout?.(timer));
      overlayTimers.clear();
      overlayCommitted.clear();
      overlayDesired.clear();
      activeMapState = null;
      activeScene = null;
      activeMapConfig = null;
      historicalGroup.innerHTML = '';
      nodes.innerHTML = '';
      legend.innerHTML = '';
      mapRoot.classList?.remove('has-geographic-labels');
      historicalGroup.classList?.remove('is-overlay-leaving', 'is-overlay-entering');
      nodes.classList?.remove('is-overlay-leaving', 'is-overlay-entering');
      legend.classList?.remove('is-overlay-leaving', 'is-overlay-entering');
      mapRoot.dataset.mapStateId = '';
      mapRoot.dataset.sceneId = '';
    }

    function destroy(): void {
      overlayTimers.forEach(timer => windowRef.clearTimeout?.(timer));
      overlayTimers.clear();
      overlayCommitted.clear();
      overlayDesired.clear();
      container.innerHTML = '';
      geometryPathCache.clear();
      regionalBaseCache.clear();
      activeBasePaths.land = '';
      activeBasePaths.lakes = '';
      activeBasePaths.rivers = '';
      activeMapState = null;
      activeScene = null;
      activeMapConfig = null;
      activeViews = [];
      activeCameraTransform = '';
      activeCameraPreset = null;
    }

    return {
      renderMapState,
      setStructureViews,
      clear,
      destroy,
      getActiveMapState: () => activeMapState,
      getActiveScene: () => activeScene,
      getActiveMapConfig: () => activeMapConfig,
      getActiveCameraTransform: () => activeCameraTransform,
      getGeometryCacheSize: () => geometryPathCache.size
    };
  }

export const mapModule = {
  VIEW_FAMILIES,
  SCREEN_POSITIONS,
  projectPoint,
  geometryToPath,
  cameraTransform,
  cameraViewportBounds,
  boundsIntersect,
  selectRegionalPaths,
  cameraPresetsForCard,
  projectAnnotation,
  createNaturalEarthMap
} satisfies MapModule;

(globalThis as unknown as AtlasRuntimeGlobal).ATLAS_V5_MAP = mapModule;
