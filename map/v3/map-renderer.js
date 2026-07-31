(function exposeV3Map(root, factory) {
  const api = factory();
  if (root) root.ATLAS_V3_MAP = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
}(typeof window !== 'undefined' ? window : globalThis, function buildV3MapRenderer() {
  'use strict';

  const VIEW_FAMILIES = new Set(['lineage', 'composition', 'context', 'historicalNetwork']);

  function escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function projectPoint([lon, lat], size = 4096) {
    const safeLat = Math.max(-85.05112878, Math.min(85.05112878, Number(lat)));
    const sin = Math.sin(safeLat * Math.PI / 180);
    return [
      ((Number(lon) + 180) / 360) * size,
      (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * size
    ];
  }

  function geometryToPath(geometry, size = 4096) {
    if (!geometry?.type || !geometry.coordinates) return '';
    const point = coordinates => {
      const [x, y] = projectPoint(coordinates, size);
      return `${x.toFixed(1)} ${y.toFixed(1)}`;
    };
    const line = coordinates => coordinates.map((coordinates, index) => `${index ? 'L' : 'M'}${point(coordinates)}`).join('');
    const polygon = coordinates => coordinates.map(ring => `${line(ring)}Z`).join('');
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

  function cameraTransform(camera, size = 4096) {
    const [x, y] = projectPoint(camera?.center || [0, 0], size);
    const scale = Math.max(0.7, Math.min(12, Number(camera?.scale || 1)));
    const normalized = scale * (1000 / size);
    return `translate(500 350) scale(${normalized.toFixed(5)}) translate(${-x.toFixed(2)} ${-y.toFixed(2)})`;
  }

  function createNaturalEarthMap(options) {
    const {
      container,
      data,
      queries,
      naturalEarth,
      documentRef = typeof document !== 'undefined' ? document : null,
      onNavigate = () => {}
    } = options;
    if (!container || !data || !queries || !naturalEarth || !documentRef) {
      throw new TypeError('container, V3 data, queries, local Natural Earth data and document are required');
    }
    const geometryById = new Map(data.geometries.map(item => [item.id, item]));
    const entityById = new Map(data.entities.map(item => [item.id, item]));
    const navigationById = new Map(data.navigationOptions.map(item => [item.id, item]));
    const geometryPathCache = new Map();
    let activeMapState = null;
    let activeViews = [];

    container.innerHTML = `
      <div class="v3-map" data-v3-map>
        <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice"
          role="img" aria-labelledby="v3-map-title v3-map-description">
          <title id="v3-map-title">当前 Scene 的历史空间示意</title>
          <desc id="v3-map-description">本地 Natural Earth 矢量背景。范围与方向为近似教学表达，地图不能缩放或拖动。</desc>
          <defs>
            <marker id="v3-map-arrow" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z"></path>
            </marker>
          </defs>
          <g class="v3-map__camera" data-map-camera>
            <path class="v3-map__land" d="${escapeHtml(naturalEarth.landPath)}"></path>
            <g class="v3-map__lakes">${naturalEarth.lakes.map(item => `<path d="${escapeHtml(item.d)}"></path>`).join('')}</g>
            <g class="v3-map__rivers">${naturalEarth.rivers.map(item => `<path d="${escapeHtml(item.d)}"></path>`).join('')}</g>
            <g class="v3-map__historical" data-map-historical></g>
          </g>
        </svg>
        <div class="v3-map__nodes" data-map-nodes aria-label="当前可进入节点"></div>
        <div class="v3-map__legend" data-map-legend></div>
        <p class="v3-map__approximation">近似教学示意 · 非精确疆界或路线</p>
      </div>`;

    const mapRoot = container.querySelector('[data-v3-map]');
    const cameraGroup = container.querySelector('[data-map-camera]');
    const historicalGroup = container.querySelector('[data-map-historical]');
    const nodes = container.querySelector('[data-map-nodes]');
    const legend = container.querySelector('[data-map-legend]');

    function cachedGeometryPath(geometry) {
      if (!geometryPathCache.has(geometry.id)) {
        geometryPathCache.set(geometry.id, geometryToPath(geometry.geometry, naturalEarth.size));
      }
      return geometryPathCache.get(geometry.id);
    }

    function renderGeometryLayers(mapState) {
      const geometryLayers = mapState.layerIds.filter(layer => layer.geometryId);
      historicalGroup.innerHTML = geometryLayers.map(layer => {
        const geometry = geometryById.get(layer.geometryId);
        if (!geometry) return '';
        const path = cachedGeometryPath(geometry);
        const geometryType = geometry.geometry.type.toLowerCase();
        const directional = geometryType.includes('line') && activeViews.some(view => view.family === 'historicalNetwork');
        return `<path class="v3-map__geometry v3-map__geometry--${escapeHtml(geometryType)}${geometry.approximate ? ' is-approximate' : ''}"
          data-geometry-id="${escapeHtml(geometry.id)}"
          d="${escapeHtml(path)}"
          ${directional ? 'marker-end="url(#v3-map-arrow)"' : ''}>
          <title>${escapeHtml(geometry.label || geometry.id)}</title>
        </path>`;
      }).join('');
    }

    function renderNodes(mapState) {
      const navigationLayers = mapState.layerIds.filter(layer => layer.navigationId);
      const entityLayers = mapState.layerIds.filter(layer => layer.entityId);
      const navigationTargets = new Set(
        navigationLayers.map(layer => navigationById.get(layer.navigationId)?.targetCardId).filter(Boolean)
      );
      const items = [
        ...navigationLayers.map((layer, index) => {
          const navigation = navigationById.get(layer.navigationId);
          const card = navigation ? queries.getCard(navigation.targetCardId) : null;
          const entity = card ? entityById.get(card.entityId) : null;
          return navigation && entity ? {
            kind: 'navigation',
            id: navigation.id,
            label: navigation.label,
            detail: navigation.hook,
            index
          } : null;
        }),
        ...entityLayers.map((layer, index) => {
          const entity = entityById.get(layer.entityId);
          if (!entity || navigationTargets.has(entity.defaultCardId)) return null;
          return {
            kind: 'entity',
            id: entity.id,
            label: entity.name,
            detail: '当前情境实体（示意节点）',
            index: navigationLayers.length + index
          };
        })
      ].filter(Boolean);
      nodes.innerHTML = items.map((item, index) => {
        const column = index % 2;
        const row = Math.floor(index / 2);
        const left = 8 + column * 54;
        const top = 12 + row * 16;
        if (item.kind === 'navigation') {
          return `<button class="v3-map__node is-navigable" type="button"
            style="--node-left:${left}%;--node-top:${top}%"
            data-map-navigation-id="${escapeHtml(item.id)}"
            aria-label="${escapeHtml(`${item.label}：${item.detail}`)}">
            <span>${escapeHtml(item.label)}</span><small>点击进入 →</small>
          </button>`;
        }
        return `<span class="v3-map__node is-context"
          style="--node-left:${left}%;--node-top:${top}%"
          aria-label="${escapeHtml(`${item.label}，${item.detail}`)}">
          <span>${escapeHtml(item.label)}</span><small>情境节点</small>
        </span>`;
      }).join('');
      nodes.querySelectorAll('[data-map-navigation-id]').forEach(button => {
        button.addEventListener('click', () => onNavigate(button.dataset.mapNavigationId));
      });
    }

    function renderMapState(mapState, scene = null) {
      if (!mapState) return false;
      activeMapState = mapState;
      cameraGroup.setAttribute('transform', cameraTransform(mapState.camera, naturalEarth.size));
      mapRoot.dataset.mapStateId = mapState.id;
      mapRoot.dataset.sceneId = scene?.id || '';
      renderGeometryLayers(mapState);
      renderNodes(mapState);
      const description = container.querySelector('#v3-map-description');
      if (description) description.textContent = mapState.caption || '近似教学示意。';
      return true;
    }

    function setStructureViews(views = [], scene = null) {
      activeViews = views.filter(view => VIEW_FAMILIES.has(view.family));
      mapRoot.dataset.structureFamilies = activeViews.map(view => view.family).join(' ');
      mapRoot.classList.remove(...Array.from(VIEW_FAMILIES, family => `is-${family}`));
      activeViews.forEach(view => mapRoot.classList.add(`is-${view.family}`));
      legend.innerHTML = activeViews.map(view => `
        <span class="v3-map__legend-item v3-map__legend-item--${escapeHtml(view.family)}">
          <strong>${escapeHtml(view.title)}</strong>
          <small>${escapeHtml(view.family === 'lineage' ? '仅直接一级' :
            view.family === 'composition' ? '组成关系' :
            view.family === 'context' ? '异质情境集合' : '近似方向与阶段')}</small>
        </span>`).join('');
      if (activeMapState) renderGeometryLayers(activeMapState);
      mapRoot.dataset.sceneId = scene?.id || mapRoot.dataset.sceneId || '';
    }

    function destroy() {
      container.innerHTML = '';
      geometryPathCache.clear();
      activeMapState = null;
      activeViews = [];
    }

    return {
      renderMapState,
      setStructureViews,
      destroy,
      getActiveMapState: () => activeMapState,
      getGeometryCacheSize: () => geometryPathCache.size
    };
  }

  return {
    VIEW_FAMILIES,
    projectPoint,
    geometryToPath,
    cameraTransform,
    createNaturalEarthMap
  };
}));
