(() => {
  const TILE_SIZE = 256;
  const stories = window.ATLAS_STORIES || [];
  const knowledge = window.ATLAS_KNOWLEDGE || {};
  const entityNetwork = window.ATLAS_ENTITY_NETWORK || { entities: [], relations: [], explorations: [] };
  const entityQueries = window.ATLAS_ENTITY_QUERIES || {};
  const curation = window.ATLAS_CURATION || {};
  const knowledgeStories = knowledge.stories || [];
  const legacyRelations = knowledge.relations || [];
  const explorations = entityNetwork.explorations || [];
  const sourceCatalog = new Map((knowledge.sources || []).map(source => [source.id, source]));
  const tabs = document.getElementById('story-tabs');
  const svg = document.getElementById('atlas-map');
  const mapFrame = document.querySelector('.map-frame');
  const tileLayer = document.getElementById('tile-layer');
  const vectorLayer = document.getElementById('vector-layer');
  const overlay = document.getElementById('map-overlay');
  const mapUiOverlay = document.getElementById('map-ui-overlay');
  const mapCaption = document.getElementById('map-caption');
  const entityTimeline = document.getElementById('entity-timeline');
  const entityPreviewCard = document.getElementById('entity-preview-card');
  const article = document.getElementById('story-content');
  const worldMapTools = document.getElementById('world-map-tools');
  const mapViewActions = document.getElementById('map-view-actions');
  const resetWorldMap = document.getElementById('reset-world-map');
  const zoomWorldOut = document.getElementById('zoom-world-out');
  const zoomWorldIn = document.getElementById('zoom-world-in');
  const worldZoomLevel = document.getElementById('world-zoom-level');
  const worldStyleButtons = worldMapTools.querySelectorAll('[data-world-style]');
  const appShell = document.querySelector('.app-shell');
  const mobileContextLead = document.getElementById('mobile-context-lead');
  const worldVector = window.ATLAS_WORLD_VECTOR || {};
  const regionHydro = window.ATLAS_REGION_HYDRO || {};
  const TILE_SERVICES = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile',
    vector: 'https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile'
  };
  const REGION_ASPECT_RATIO = 16 / 10;

  let activeZoom = 5;
  let isWorldOverview = false;
  let activeStory = null;
  let activeKnowledgeStory = null;
  let activeChapterIndex = 0;
  let worldCenterX = 0;
  let worldCenterY = 0;
  let worldZoom = 2;
  let worldStyle = 'satellite';
  let worldTileKey = '';
  let dragState = null;
  let suppressMarkerClickUntil = 0;
  let lastSelectedStoryId = null;
  let worldLabelEntries = [];
  let resizeFrame = 0;
  let activeEntityId = null;
  let activeEntityYear = null;
  let activeExplorationId = null;
  let explorationPath = [];
  let lastEntityMapView = null;
  let previewEntityId = null;
  let previewRelation = null;
  let previewPinned = false;
  let previewOpenTimer = 0;
  let previewCloseTimer = 0;
  let previewSwipeStartY = null;

  const legacyEntities = stories.map(story => ({
    id: story.id,
    type: 'region',
    name: story.shortTitle,
    shortDescription: story.thesis,
    coordinates: [
      (story.view.lonMin + story.view.lonMax) / 2,
      (story.view.latMin + story.view.latMax) / 2
    ],
    tags: [story.mechanism, '历史地理'],
    legacyStoryId: story.id,
    relatedStoryIds: curation.getRegionExplorationIds?.(story.id) || [],
    contentStatus: 'reviewed'
  }));
  const networkEntityCatalog = new Map(
    (entityNetwork.entities || []).map(entity => [entity.id, entity])
  );
  const networkExplorerEntities = (entityNetwork.entities || []).map(entity => {
    const firstPoint = entity.moments
      .flatMap(moment => moment.map?.features || [])
      .find(feature => feature.geometry?.type === 'Point');
    return {
      ...entity,
      startYear: entity.existence?.start,
      endYear: entity.existence?.end,
      shortDescription: entity.content.summary,
      description: entity.content.overview,
      coordinates: firstPoint?.geometry.coordinates,
      contentStatus: 'reviewed',
      schemaVersion: 2
    };
  });
  const entityCatalog = new Map(
    [...legacyEntities, ...(knowledge.entities || []), ...networkExplorerEntities]
      .map(entity => [entity.id, entity])
  );

  const entityTypeLabels = {
    region: '地区',
    geographicFeature: '地理要素',
    civilization: '文明',
    polity: '政治实体',
    empire: '帝国',
    peopleGroup: '人群',
    religion: '宗教',
    philosophy: '思想',
    language: '语言',
    languageFamily: '语系',
    writingSystem: '文字',
    technology: '技术',
    tradeRoute: '贸易路线',
    commodity: '商品',
    artStyle: '艺术风格',
    architectureStyle: '建筑与艺术',
    event: '事件',
    person: '人物',
    city: '城市',
    story: '专题',
    pattern: '文明规律'
  };

  const relationTypeLabels = {
    originated_in: '发端于',
    located_in: '位于',
    part_of: '属于',
    controlled_by: '受控于',
    influenced: '影响',
    influenced_by: '受到影响',
    spread_from: '从此传播',
    spread_to: '传播至',
    passed_through: '途经',
    traded_along: '沿此流动',
    introduced_to: '传入',
    translated_into: '翻译为',
    associated_with: '相关',
    enabled: '促成',
    contributed_to: '推动',
    used_by: '为其使用',
    built_by: '由其营建'
  };

  const entityDisplayNames = {
    'silk-roads': '丝绸之路',
    'mogao-caves': '莫高窟',
    'gandharan-art': '犍陀罗艺术'
  };

  function entityDisplayName(entityOrId) {
    const entity = typeof entityOrId === 'string' ? entityCatalog.get(entityOrId) : entityOrId;
    if (!entity) return typeof entityOrId === 'string' ? entityOrId : '';
    return entityDisplayNames[entity.id] || entity.name;
  }

  function entitySummary(entity) {
    return entity?.content?.summary || entity?.shortDescription || '';
  }

  function entityOverview(entity) {
    return entity?.content?.overview || entity?.description || entitySummary(entity);
  }

  function activeNetworkEntity(entityId) {
    return networkEntityCatalog.get(entityId) || null;
  }

  function entityMoment(entityId, year = activeEntityYear) {
    if (!activeNetworkEntity(entityId)) return null;
    return entityQueries.getEntityMomentAt?.(entityId, year)
      || entityQueries.getNearestEntityMoment?.(entityId, year)
      || null;
  }

  function getExploration(explorationId) {
    return explorations.find(exploration => exploration.id === explorationId) || null;
  }

  function activeExploration() {
    return getExploration(activeExplorationId);
  }

  function entityLeadCopy(entityId) {
    const entity = entityCatalog.get(entityId);
    const exploration = activeExploration();
    if (exploration) {
      return {
        question: exploration.contextQuestion || exploration.question,
        explanation: exploration.introduction || entityOverview(entity)
      };
    }
    return {
      question: '',
      explanation: entityOverview(entity)
    };
  }

  function escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function formatYearRange(entity) {
    const format = year => {
      if (!Number.isFinite(year)) return '';
      if (year < 0) return `前${Math.abs(year)}年`;
      return `${year}年`;
    };
    if (!Number.isFinite(entity.startYear) && !Number.isFinite(entity.endYear)) return '时间待补充';
    if (Number.isFinite(entity.startYear) && !Number.isFinite(entity.endYear)) return `${format(entity.startYear)}起`;
    return `${format(entity.startYear)}—${format(entity.endYear)}`;
  }

  function formatTimeSpan(time) {
    if (!time) return '时间待补充';
    return time.label || formatYearRange({ startYear: time.start, endYear: time.end });
  }

  function formatYearLabel(year) {
    if (!Number.isFinite(year)) return '时间待补充';
    return year < 0 ? `前${Math.abs(year)}年` : `${year}年`;
  }

  function setPageMode(mode) {
    if (mode !== 'entity') {
      closeEntityPreview({ updateTimeline: false });
      entityTimeline.hidden = true;
      entityTimeline.innerHTML = '';
    }
    [...appShell.classList]
      .filter(className => className.startsWith('page-'))
      .forEach(className => appShell.classList.remove(className));
    appShell.classList.add(`page-${mode}`);
    document.querySelectorAll('.site-nav [data-route-link]').forEach(link => {
      const isCurrent = (
        link.dataset.routeLink === mode
        || (mode === 'region' && link.dataset.routeLink === 'map')
        || ((mode === 'story' || mode === 'entity') && link.dataset.routeLink === 'explorations')
      );
      if (isCurrent) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function resetContentScroll({ focusSelector = '' } = {}) {
    article.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    requestAnimationFrame(() => {
      article.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      if (focusSelector) {
        article.querySelector(focusSelector)?.focus?.({ preventScroll: true });
      }
    });
  }

  function renderMobileLead(question = '', explanation = '') {
    if (!question) {
      mobileContextLead.hidden = true;
      mobileContextLead.innerHTML = '';
      return;
    }
    mobileContextLead.hidden = false;
    mobileContextLead.innerHTML = `
      <div class="eyebrow">当前问题</div>
      <h1>${escapeHtml(question)}</h1>
      <p>${escapeHtml(explanation)}</p>
    `;
  }

  function renderMobileEntityLead(entityId) {
    const entity = entityCatalog.get(entityId);
    if (!entity) {
      renderMobileLead();
      return;
    }
    const copy = entityLeadCopy(entityId);
    mobileContextLead.hidden = false;
    mobileContextLead.innerHTML = `
      ${copy.question ? `
        <div class="mobile-exploration-context">
          <div class="eyebrow">正在探索：${escapeHtml(copy.question)}</div>
          <button type="button" data-exploration-exit>退出当前问题</button>
        </div>
      ` : ''}
      <h1>${escapeHtml(entityDisplayName(entity))}</h1>
      <p>${escapeHtml(entitySummary(entity))}</p>
    `;
    mobileContextLead.querySelector('[data-exploration-exit]')?.addEventListener('click', exitActiveExploration);
  }

  function exitActiveExploration() {
    if (!activeExplorationId || !activeEntityId) return;
    renderEntityExplorer(activeEntityId, {
      historyMode: 'push',
      path: explorationPath,
      year: activeEntityYear,
      explorationId: null
    });
  }

  function relationVerb(relation, currentEntityId = relation.sourceId) {
    if (relation.perspective?.verb) return relation.perspective.verb;
    if (typeof relation.verb === 'string') return relation.verb;
    if (relation.verb?.forward) {
      return relation.sourceId === currentEntityId
        ? relation.verb.forward
        : (relation.verb.reverse || relation.verb.forward);
    }
    return relationTypeLabels[relation.type] || relation.type;
  }

  function otherEntityId(relation, entityId) {
    if (relation.sourceId === entityId) return relation.targetId;
    if (relation.targetId === entityId) return relation.sourceId;
    return null;
  }

  function normalizeActiveRelation(active) {
    return {
      id: active.relationId,
      episodeId: active.episodeId,
      sourceId: active.sourceId,
      targetId: active.targetId,
      type: active.type,
      verb: active.verb,
      summary: active.summary,
      explanation: active.detail,
      geometry: active.mapOverlay?.geometry,
      approximate: active.mapOverlay?.approximate,
      time: active.time,
      perspective: active,
      sourceIds: active.sourceIds
    };
  }

  function relationByIdForEntity(relationId, entityId, year = activeEntityYear) {
    if (activeNetworkEntity(entityId)) {
      const active = entityQueries.getActiveRelationEpisodes?.(entityId, year)
        ?.find(item => item.relationId === relationId);
      if (active) return normalizeActiveRelation(active);
    }
    return legacyRelations.find(relation => relation.id === relationId) || null;
  }

  function relationForEntities(sourceId, targetId, year = activeEntityYear) {
    if (activeNetworkEntity(sourceId) && activeNetworkEntity(targetId)) {
      const active = entityQueries.getRelationEpisodeBetween?.(sourceId, targetId, year);
      if (active) return normalizeActiveRelation(active);
    }
    return legacyRelations.find(relation => (
      (relation.sourceId === sourceId && relation.targetId === targetId)
      || (relation.sourceId === targetId && relation.targetId === sourceId)
    ));
  }

  function explorationRelations(entityId, { legacyMode = false, year = activeEntityYear } = {}) {
    if (!legacyMode && activeNetworkEntity(entityId)) {
      const active = (entityQueries.getActiveRelationEpisodes?.(entityId, year) || [])
        .map(normalizeActiveRelation);
      const moment = entityMoment(entityId, year);
      const exploration = activeExploration();
      const explorationRelationIds = exploration?.featuredMoments
        ?.find(item => item.entityId === entityId && item.momentId === moment?.id)
        ?.relationIds || [];
      const prioritized = [...explorationRelationIds, ...(moment?.featuredRelationIds || [])]
        .map(id => active.find(relation => relation.id === id))
        .filter(Boolean);
      return [...new Map([...prioritized, ...active].map(relation => [relation.id, relation])).values()]
        .filter(relation => entityCatalog.has(otherEntityId(relation, entityId)))
        .slice(0, 5);
    }

    const connected = legacyRelations.filter(relation => (
      relation.sourceId === entityId || relation.targetId === entityId
    ));
    const prioritized = curation.prioritizeLegacyRelations?.(entityId, connected) || connected;
    return prioritized
      .filter(relation => entityCatalog.has(otherEntityId(relation, entityId)))
      .slice(0, 4);
  }

  function relationQuestion(entityId, targetId, relation) {
    return curation.getLegacyRelationQuestion?.(entityId, targetId)
      || `${entityDisplayName(entityId)}为什么${relationVerb(relation, entityId)}${entityDisplayName(targetId)}？`;
  }

  function normalizedExplorationPath(path, entityId, relationId = null) {
    const validPath = Array.isArray(path)
      ? path.filter(step => step && entityCatalog.has(step.entityId)).map(step => ({
        entityId: step.entityId,
        relationId: step.relationId || null
      }))
      : [];
    if (validPath.at(-1)?.entityId === entityId) return validPath;
    return [...validPath, { entityId, relationId }];
  }

  const worldOverview = {
    minZoom: 2,
    maxZoom: 6,
    viewWidth: 820,
    viewHeight: 560,
    centerLon: 105,
    centerLat: 30
  };

  function xy(lon, lat, zoom = activeZoom) {
    const scale = TILE_SIZE * (2 ** zoom);
    const sinLatitude = Math.sin(lat * Math.PI / 180);
    return {
      x: ((lon + 180) / 360) * scale,
      y: (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * scale
    };
  }

  function regionViewBounds(view) {
    const topLeft = xy(view.lonMin, view.latMax);
    const bottomRight = xy(view.lonMax, view.latMin);
    let width = bottomRight.x - topLeft.x;
    let height = bottomRight.y - topLeft.y;
    const centerX = topLeft.x + width / 2;
    const centerY = topLeft.y + height / 2;

    if (width / height < REGION_ASPECT_RATIO) {
      width = height * REGION_ASPECT_RATIO;
    } else {
      height = width / REGION_ASPECT_RATIO;
    }

    return {
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height
    };
  }

  function regionViewBox(view) {
    const bounds = regionViewBounds(view);
    return `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`;
  }

  function svgEl(name, attrs = {}) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  function renderTiles(view, zoom, style = 'satellite') {
    tileLayer.innerHTML = '';
    const sourceZoom = style === 'vector' ? Math.max(0, zoom - 1) : zoom;
    const tileScale = 2 ** (zoom - sourceZoom);
    const tileSpan = TILE_SIZE * tileScale;
    const bounds = regionViewBounds(view);
    const xMin = Math.floor(bounds.x / tileSpan);
    const xMax = Math.floor((bounds.x + bounds.width) / tileSpan);
    const yMin = Math.floor(bounds.y / tileSpan);
    const yMax = Math.floor((bounds.y + bounds.height) / tileSpan);
    for (let tileY = yMin; tileY <= yMax; tileY += 1) {
      for (let tileX = xMin; tileX <= xMax; tileX += 1) {
        tileLayer.appendChild(svgEl('image', {
          href: `${TILE_SERVICES[style]}/${sourceZoom}/${tileY}/${tileX}`,
          x: tileX * tileSpan - 0.5,
          y: tileY * tileSpan - 0.5,
          width: tileSpan + 1,
          height: tileSpan + 1,
          class: style === 'vector' ? 'hillshade-tile' : 'satellite-tile'
        }));
      }
    }
  }

  function renderWorldTiles() {
    const zoom = worldZoom;
    const sourceZoom = worldStyle === 'vector' ? Math.max(0, zoom - 1) : zoom;
    const tileScale = 2 ** (zoom - sourceZoom);
    const tileSpan = TILE_SIZE * tileScale;
    const tileCount = 2 ** sourceZoom;
    const xLeft = worldCenterX - worldOverview.viewWidth / 2;
    const xRight = worldCenterX + worldOverview.viewWidth / 2;
    const yTop = worldViewportTop();
    const yBottom = yTop + worldOverview.viewHeight;
    const xMin = Math.floor(xLeft / tileSpan) - 1;
    const xMax = Math.floor(xRight / tileSpan) + 1;
    const yMin = Math.max(0, Math.floor(yTop / tileSpan));
    const yMax = Math.min(tileCount - 1, Math.floor(yBottom / tileSpan));
    const nextTileKey = `${worldStyle}/${zoom}/${sourceZoom}/${xMin}/${xMax}/${yMin}/${yMax}`;
    if (nextTileKey === worldTileKey) return;

    worldTileKey = nextTileKey;
    tileLayer.innerHTML = '';
    for (let tileY = yMin; tileY <= yMax; tileY += 1) {
      for (let tileX = xMin; tileX <= xMax; tileX += 1) {
        const sourceX = ((tileX % tileCount) + tileCount) % tileCount;
        tileLayer.appendChild(svgEl('image', {
          href: `${TILE_SERVICES[worldStyle]}/${sourceZoom}/${tileY}/${sourceX}`,
          x: tileX * tileSpan - 0.5,
          y: tileY * tileSpan - 0.5,
          width: tileSpan + 1,
          height: tileSpan + 1,
          class: worldStyle === 'vector' ? 'hillshade-tile' : 'satellite-tile'
        }));
      }
    }
  }

  function worldViewportTop() {
    return clampWorldCenterY(worldCenterY) - worldOverview.viewHeight / 2;
  }

  function mapUnitsPerPixel(viewWidth) {
    const bounds = svg.getBoundingClientRect();
    return bounds.width ? viewWidth / bounds.width : 1;
  }

  function boxesOverlap(a, b) {
    return (
      a.left < b.right
      && a.right > b.left
      && a.top < b.bottom
      && a.bottom > b.top
    );
  }

  function worldLabelBox(text, x, y, fontSize, anchor = 'middle') {
    const width = Math.max(2, [...text].length) * fontSize * 0.92;
    const height = fontSize * 1.35;
    let left = x - width / 2;
    if (anchor === 'start') left = x;
    if (anchor === 'end') left = x - width;
    return {
      left,
      right: left + width,
      top: y - height * 0.8,
      bottom: y + height * 0.2
    };
  }

  function reserveWorldLabel(box, priority, node) {
    const conflicts = worldLabelEntries.filter(entry => boxesOverlap(box, entry.box));
    if (conflicts.some(entry => entry.priority >= priority)) return false;
    conflicts.forEach(entry => entry.node.remove());
    worldLabelEntries = worldLabelEntries.filter(entry => !conflicts.includes(entry));
    worldLabelEntries.push({ box, priority, node });
    return true;
  }

  function appendWorldPhysicalLabel(feature, copyIndex, options) {
    const worldSize = TILE_SIZE * (2 ** worldZoom);
    const point = xy(feature.label[0], feature.label[1], worldZoom);
    const unit = options.unit;
    const x = point.x + copyIndex * worldSize;
    const y = point.y + (options.dy || 0) * unit;
    const node = label(
      feature.name,
      x,
      y,
      'middle',
      0,
      0,
      options.className
    );
    const box = worldLabelBox(feature.name, x, y, options.fontSize * unit);
    if (reserveWorldLabel(box, options.priority, node)) vectorLayer.appendChild(node);
  }

  function renderWorldVector() {
    vectorLayer.innerHTML = '';
    if (worldStyle !== 'vector' || !worldVector.landPath) return;

    const worldSize = TILE_SIZE * (2 ** worldZoom);
    const sourceSize = worldVector.size || 4096;
    const scale = worldSize / sourceSize;

    const appendScaledCopies = (features, className, predicate) => {
      for (let copyIndex = 0; copyIndex < 3; copyIndex += 1) {
        const group = svgEl('g', {
          transform: `translate(${copyIndex * worldSize} 0) scale(${scale})`
        });
        features
          .filter(predicate)
          .forEach(feature => {
            group.appendChild(svgEl('path', {
              d: feature.d,
              class: typeof className === 'function' ? className(feature) : className,
              'fill-rule': 'evenodd'
            }));
          });
        vectorLayer.appendChild(group);
      }
    };

    for (let copyIndex = 0; copyIndex < 3; copyIndex += 1) {
      const landGroup = svgEl('g', {
        transform: `translate(${copyIndex * worldSize} 0) scale(${scale})`
      });
      landGroup.appendChild(svgEl('path', {
        d: worldVector.landPath,
        class: 'vector-land',
        'fill-rule': 'evenodd'
      }));
      vectorLayer.appendChild(landGroup);
    }

    appendScaledCopies(
      worldVector.lakes || [],
      'vector-lake',
      feature => feature.minZoom <= worldZoom
    );
    appendScaledCopies(
      worldVector.rivers || [],
      'vector-river',
      feature => feature.minZoom <= worldZoom
    );

    const graticule = svgEl('g', { class: 'vector-graticule' });
    for (let copyIndex = 0; copyIndex < 3; copyIndex += 1) {
      for (let longitude = -150; longitude <= 180; longitude += 30) {
        const x = xy(longitude, 0, worldZoom).x + copyIndex * worldSize;
        graticule.appendChild(svgEl('line', {
          x1: x,
          x2: x,
          y1: 0,
          y2: worldSize
        }));
      }
      for (let latitude = -60; latitude <= 60; latitude += 20) {
        const y = xy(0, latitude, worldZoom).y;
        graticule.appendChild(svgEl('line', {
          x1: copyIndex * worldSize,
          x2: (copyIndex + 1) * worldSize,
          y1: y,
          y2: y,
          class: latitude === 0 ? 'vector-equator' : ''
        }));
      }
    }
    vectorLayer.appendChild(graticule);

    const unit = mapUnitsPerPixel(worldOverview.viewWidth);
    vectorLayer.style.setProperty('--world-terrain-label-size', `${12.5 * unit}px`);
    vectorLayer.style.setProperty('--world-river-label-size', `${11.5 * unit}px`);
    vectorLayer.style.setProperty('--world-label-stroke', `${1.4 * unit}px`);
    const terrainRankLimit = worldZoom < 4 ? 1 : worldZoom - 2;
    const riverRankLimit = worldZoom < 4 ? 0 : (worldZoom - 2) * 2;
    for (let copyIndex = 0; copyIndex < 3; copyIndex += 1) {
      (worldVector.terrain || [])
        .filter(feature => feature.name && feature.rank <= terrainRankLimit)
        .forEach(feature => {
          appendWorldPhysicalLabel(feature, copyIndex, {
            className: 'vector-physical-label vector-terrain-label',
            fontSize: 12.5,
            priority: 2,
            unit
          });
        });
      (worldVector.rivers || [])
        .filter(feature => feature.name && feature.rank <= riverRankLimit)
        .forEach(feature => {
          appendWorldPhysicalLabel(feature, copyIndex, {
            className: 'vector-physical-label vector-river-label',
            fontSize: 11.5,
            priority: 1,
            dy: -6,
            unit
          });
        });
    }
  }

  function label(text, x, y, anchor = 'start', dx = 0, dy = 0, className = 'feature-label') {
    const t = svgEl('text', { x, y, class: className, 'text-anchor': anchor });
    if (dx) t.setAttribute('dx', dx);
    if (dy) t.setAttribute('dy', dy);
    t.textContent = text;
    return t;
  }

  function riverPathPoints(path, scale) {
    const points = [];
    const matcher = /[ML](-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g;
    let match = matcher.exec(path);
    while (match) {
      points.push({
        x: Number(match[1]) * scale,
        y: Number(match[2]) * scale
      });
      match = matcher.exec(path);
    }
    return points;
  }

  function riverLabelPoint(feature, view) {
    const paths = regionHydro.rivers?.[feature.label] || [];
    if (!paths.length) return null;

    const bounds = regionViewBounds(view);
    const sourceSize = regionHydro.size || 4096;
    const scale = (TILE_SIZE * (2 ** activeZoom)) / sourceSize;
    let bestSegments = [];
    let bestLength = 0;

    paths.forEach(path => {
      const points = riverPathPoints(path, scale);
      const visibleSegments = [];
      let visibleLength = 0;

      for (let index = 1; index < points.length; index += 1) {
        const start = points[index - 1];
        const end = points[index];
        const midpoint = {
          x: (start.x + end.x) / 2,
          y: (start.y + end.y) / 2
        };
        const isVisible = (
          midpoint.x >= bounds.x
          && midpoint.x <= bounds.x + bounds.width
          && midpoint.y >= bounds.y
          && midpoint.y <= bounds.y + bounds.height
        );
        if (!isVisible) continue;

        const length = Math.hypot(end.x - start.x, end.y - start.y);
        if (!length) continue;
        visibleSegments.push({ start, end, length });
        visibleLength += length;
      }

      if (visibleLength > bestLength) {
        bestLength = visibleLength;
        bestSegments = visibleSegments;
      }
    });

    if (!bestSegments.length) return null;

    const targetLength = bestLength / 2;
    let traversed = 0;
    for (const segment of bestSegments) {
      if (traversed + segment.length >= targetLength) {
        const ratio = (targetLength - traversed) / segment.length;
        let angle = Math.atan2(
          segment.end.y - segment.start.y,
          segment.end.x - segment.start.x
        ) * 180 / Math.PI;
        if (angle > 90) angle -= 180;
        if (angle < -90) angle += 180;
        return {
          x: segment.start.x + (segment.end.x - segment.start.x) * ratio,
          y: segment.start.y + (segment.end.y - segment.start.y) * ratio,
          angle: Math.max(-28, Math.min(28, angle))
        };
      }
      traversed += segment.length;
    }

    return bestSegments[bestSegments.length - 1].end;
  }

  function updateRegionLabelScale(story) {
    const bounds = regionViewBounds(story.view);
    const unit = mapUnitsPerPixel(bounds.width);
    overlay.style.setProperty('--map-area-size', `${18 * unit}px`);
    overlay.style.setProperty('--map-ridge-size', `${15 * unit}px`);
    overlay.style.setProperty('--map-river-size', `${14 * unit}px`);
    overlay.style.setProperty('--map-label-stroke', `${1.35 * unit}px`);
  }

  function renderFeature(feature, story) {
    let point = null;
    if (feature.type === 'area') {
      point = xy(feature.lon, feature.lat);
    }

    if (feature.type === 'ridge') {
      const pts = feature.points.map(([lon, lat]) => xy(lon, lat));
      point = pts[Math.floor(pts.length / 2)];
    }

    if (feature.type === 'river') {
      point = riverLabelPoint(feature, story.view);
    }

    if (point) {
      const labelOffsetScale = mapUnitsPerPixel(regionViewBounds(story.view).width) * 0.6;
      const featureLabel = label(
        feature.label,
        point.x,
        point.y,
        feature.anchor || 'middle',
        (feature.dx || 0) * labelOffsetScale,
        (feature.dy || 0) * labelOffsetScale,
        `feature-label feature-label--${feature.type}`
      );
      if (feature.type === 'river' && Number.isFinite(point.angle)) {
        featureLabel.setAttribute(
          'transform',
          `rotate(${point.angle} ${point.x} ${point.y})`
        );
      }
      featureLabel.dataset.rank = String(feature.rank || 3);
      overlay.appendChild(featureLabel);
    }
  }

  function entityLocationLabel(entity) {
    if (entity.legacyStoryId) {
      const region = stories.find(item => item.id === entity.legacyStoryId);
      if (region) return region.shortTitle;
    }
    if (!entity.coordinates) return '跨区域或地点待补充';
    return `${entity.coordinates[1].toFixed(1)}°N · ${entity.coordinates[0].toFixed(1)}°E`;
  }

  function renderEntityCard(entityId, { compact = false } = {}) {
    const entity = entityCatalog.get(entityId);
    if (!entity) return '';
    if (compact) {
      return `
        <article class="entity-card entity-card--compact" data-entity-id="${escapeHtml(entity.id)}">
          <div class="entity-card-meta"><span>${escapeHtml(entityTypeLabels[entity.type] || entity.type)}</span></div>
          <h3>${escapeHtml(entityDisplayName(entity))}</h3>
        </article>
      `;
    }
    const relatedIds = activeNetworkEntity(entityId)
      ? (entityQueries.getRelatedEntitiesAt?.(
        entityId,
        entityMoment(entityId)?.cursorYear ?? activeEntityYear
      ) || []).map(item => item.entity.id)
      : (entity.relatedEntityIds || []);
    const relatedNames = relatedIds
      .map(id => entityCatalog.get(id)?.name)
      .filter(Boolean)
      .slice(0, 3);
    const relatedExplorationTitles = (entity.relatedStoryIds || [])
      .map(id => getExploration(id)?.title)
      .filter(Boolean);
    const detailRoute = entity.legacyStoryId ? entity.legacyStoryId : `entity-${entity.id}`;
    return `
      <article class="entity-card" data-entity-id="${escapeHtml(entity.id)}">
        <div class="entity-card-meta">
          <span>${escapeHtml(entityTypeLabels[entity.type] || entity.type)}</span>
          <span>${escapeHtml(formatYearRange(entity))}</span>
        </div>
        <h3>${escapeHtml(entityDisplayName(entity))}</h3>
        <p>${escapeHtml(entitySummary(entity))}</p>
        <dl>
          <div><dt>地点</dt><dd>${escapeHtml(entityLocationLabel(entity))}</dd></div>
          ${relatedNames.length ? `<div><dt>关联</dt><dd>${relatedNames.map(escapeHtml).join(' · ')}</dd></div>` : ''}
          ${relatedExplorationTitles.length ? `<div><dt>探索</dt><dd>${relatedExplorationTitles.map(escapeHtml).join(' · ')}</dd></div>` : ''}
        </dl>
        <a href="#${detailRoute}" ${entity.legacyStoryId ? `data-story-link="${escapeHtml(entity.legacyStoryId)}"` : `data-entity-open="${escapeHtml(entity.id)}"`}>${entity.legacyStoryId ? '进入地区页' : '查看实体详情'}</a>
      </article>
    `;
  }

  function renderRelationOption(relation, currentEntityId) {
    const targetId = otherEntityId(relation, currentEntityId);
    const current = entityCatalog.get(currentEntityId);
    const target = entityCatalog.get(targetId);
    if (!targetId || !current || !target) return '';
    return `
      <button type="button" class="relation-option" data-entity-open="${escapeHtml(targetId)}" data-from-entity="${escapeHtml(currentEntityId)}" data-relation-id="${escapeHtml(relation.id)}">
        <strong>${escapeHtml(relationQuestion(currentEntityId, targetId, relation))}</strong>
        <span class="relation-option-chain">
          ${escapeHtml(entityDisplayName(current))} <i>→ ${escapeHtml(relationVerb(relation, currentEntityId))} →</i> ${escapeHtml(entityDisplayName(target))}
        </span>
        <span class="relation-option-why">${escapeHtml(relation.summary)}</span>
      </button>
    `;
  }

  function renderVisitedPath() {
    return explorationPath.map((step, index) => {
      const entity = entityCatalog.get(step.entityId);
      return `
        ${index ? '<i aria-hidden="true">→</i>' : ''}
        <span ${index === explorationPath.length - 1 ? 'aria-current="step"' : ''}>${escapeHtml(entityDisplayName(entity || step.entityId))}</span>
      `;
    }).join('');
  }

  function renderEntityHubArticle(entityId) {
    const entity = entityCatalog.get(entityId);
    if (!entity) return;
    const networkEntity = activeNetworkEntity(entityId);
    const moment = entityMoment(entityId);
    const copy = entityLeadCopy(entityId);
    const previousStep = explorationPath.at(-2);
    const sources = (entity.sourceIds || []).map(id => sourceCatalog.get(id)).filter(Boolean);
    const previousEntity = previousStep ? entityCatalog.get(previousStep.entityId) : null;

    article.innerHTML = `
      <section class="focus-panel" aria-labelledby="entity-hub-title">
        <header class="focus-panel-header">
          ${copy.question ? `
            <div class="focus-panel-context">
              <span>正在探索：</span>
              <strong>${escapeHtml(copy.question)}</strong>
              <button type="button" data-exploration-exit>退出当前问题</button>
            </div>
          ` : ''}
          <h1 id="entity-hub-title" tabindex="-1">${escapeHtml(entityDisplayName(entity))}</h1>
          <p class="focus-panel-meta">
            ${escapeHtml(entityTypeLabels[entity.type] || entity.type)}
            <span aria-hidden="true">·</span>
            ${escapeHtml(networkEntity?.existence ? formatTimeSpan(networkEntity.existence) : formatYearRange(entity))}
          </p>
          <p class="focus-panel-overview">${escapeHtml(entityOverview(entity))}</p>
          ${previousEntity ? `
            <button type="button" class="focus-panel-back" data-explore-back>← 返回${escapeHtml(entityDisplayName(previousEntity))}</button>
          ` : ''}
        </header>
        ${moment ? `
          <section class="focus-panel-moment" aria-label="当前时间状态">
            <div class="eyebrow">当前状态 · ${escapeHtml(formatTimeSpan(moment.time))}</div>
            <h2>${escapeHtml(moment.title)}</h2>
            <p>${escapeHtml(moment.summary)}</p>
          </section>
        ` : ''}
        <details class="focus-panel-notes">
          <summary>来源与说明</summary>
          <p>时间状态是离散教学节点；标为“近似”的范围和路线不代表固定疆界、单一路径或地理决定论。</p>
          ${sources.length ? `
            <div class="sources">
              ${sources.map(item => `<a href="${item.url}" target="_blank" rel="noreferrer">${escapeHtml(item.title)}</a>`).join('')}
            </div>
          ` : '<p>来源待补充。</p>'}
        </details>
      </section>
    `;
    article.querySelector('[data-explore-back]')?.addEventListener('click', () => {
      history.back();
    });
    article.querySelector('[data-exploration-exit]')?.addEventListener('click', exitActiveExploration);
  }

  function timelineDomainFor(entity) {
    const moments = (entity?.moments || []).slice(0, 7);
    const years = moments.flatMap(moment => [
      moment.time?.start,
      moment.cursorYear,
      moment.time?.end
    ]).filter(Number.isFinite);
    const min = Math.min(...years);
    const max = Math.max(...years);
    return {
      min,
      max: max === min ? min + 1 : max
    };
  }

  function timelinePosition(year, domain) {
    if (!Number.isFinite(year)) return 0;
    const clamped = Math.max(domain.min, Math.min(domain.max, year));
    return ((clamped - domain.min) / (domain.max - domain.min)) * 100;
  }

  function updateTimelineSelection() {
    const entity = activeNetworkEntity(activeEntityId);
    const moment = entityMoment(activeEntityId);
    if (!entity || !moment || entityTimeline.hidden) return;
    const range = entityTimeline.querySelector('[data-entity-timeline-range]');
    const output = entityTimeline.querySelector('[data-entity-timeline-output]');
    if (range) {
      range.value = String(moment.cursorYear);
      range.setAttribute('aria-valuetext', `${formatYearLabel(moment.cursorYear)}，${moment.title}`);
    }
    if (output) output.textContent = formatYearLabel(moment.cursorYear);
    entityTimeline.querySelectorAll('[data-timeline-year]').forEach(button => {
      const selected = Number(button.dataset.timelineYear) === moment.cursorYear;
      button.classList.toggle('is-current', selected);
      if (selected) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  }

  function renderEntityTimeline() {
    const entity = activeNetworkEntity(activeEntityId);
    const moments = (entity?.moments || [])
      .slice(0, 7)
      .sort((a, b) => a.cursorYear - b.cursorYear);
    const currentMoment = entityMoment(activeEntityId);
    if (!entity || !currentMoment || !moments.length) {
      entityTimeline.hidden = true;
      entityTimeline.innerHTML = '';
      return;
    }

    const domain = timelineDomainFor(entity);
    const relationTime = previewRelation?.time;
    const relationStart = relationTime
      ? timelinePosition(relationTime.start ?? domain.min, domain)
      : 0;
    const relationEnd = relationTime
      ? timelinePosition(relationTime.end ?? domain.max, domain)
      : 0;
    const relationWidth = Math.max(1.5, relationEnd - relationStart);
    const hasMultipleMoments = moments.length > 1;

    entityTimeline.hidden = false;
    entityTimeline.classList.toggle('is-static', !hasMultipleMoments);
    entityTimeline.innerHTML = `
      <header class="entity-timeline-header">
        <div>
          <span>实体时间轴</span>
          <small>离散节点</small>
        </div>
        <output data-entity-timeline-output>${escapeHtml(formatYearLabel(currentMoment.cursorYear))}</output>
      </header>
      <div class="entity-timeline-track-wrap">
        <div class="entity-timeline-track" aria-hidden="true"></div>
        ${relationTime ? `
          <div class="entity-timeline-relation" style="left:${relationStart}%;width:${relationWidth}%">
            <span>${escapeHtml(formatTimeSpan(relationTime))}</span>
          </div>
        ` : ''}
        ${hasMultipleMoments ? `
          <input
            type="range"
            min="${domain.min}"
            max="${domain.max}"
            step="1"
            value="${currentMoment.cursorYear}"
            aria-label="${escapeHtml(entity.name)}时间状态"
            aria-valuetext="${escapeHtml(`${formatYearLabel(currentMoment.cursorYear)}，${currentMoment.title}`)}"
            data-entity-timeline-range
          >
        ` : ''}
        <div class="entity-timeline-nodes">
          ${moments.map(moment => `
            <button
              type="button"
              class="entity-timeline-node${moment.id === currentMoment.id ? ' is-current' : ''}"
              style="left:${timelinePosition(moment.cursorYear, domain)}%"
              data-timeline-year="${moment.cursorYear}"
              ${moment.id === currentMoment.id ? 'aria-current="true"' : ''}
              aria-label="切换到${escapeHtml(moment.time.label)}：${escapeHtml(moment.title)}"
            >
              <i aria-hidden="true"></i>
              <span>${escapeHtml(formatYearLabel(moment.cursorYear))}</span>
            </button>
          `).join('')}
        </div>
      </div>
      <p class="entity-timeline-hint">${hasMultipleMoments ? '拖动手柄、点击节点，或使用左右方向键切换。' : '该实体当前只有一个离散时间状态。'}</p>
    `;

    const range = entityTimeline.querySelector('[data-entity-timeline-range]');
    range?.addEventListener('input', event => {
      const nearest = entityQueries.getNearestEntityMoment?.(activeEntityId, Number(event.target.value));
      if (!nearest) return;
      event.target.value = String(nearest.cursorYear);
      if (nearest.cursorYear !== activeEntityYear) {
        setEntityYear(nearest.cursorYear, { historyMode: 'replace', renderTimeline: false });
      }
      updateTimelineSelection();
    });
    range?.addEventListener('change', () => renderEntityTimeline());
    range?.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      const currentIndex = moments.findIndex(moment => moment.cursorYear === activeEntityYear);
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(moments.length - 1, currentIndex + direction));
      event.preventDefault();
      if (nextIndex !== currentIndex) {
        setEntityYear(moments[nextIndex].cursorYear, { historyMode: 'replace' });
      }
    });
    entityTimeline.querySelectorAll('[data-timeline-year]').forEach(button => {
      button.addEventListener('click', () => {
        setEntityYear(Number(button.dataset.timelineYear), { historyMode: 'replace' });
      });
    });
  }

  function clearPreviewTimers() {
    window.clearTimeout(previewOpenTimer);
    window.clearTimeout(previewCloseTimer);
    previewOpenTimer = 0;
    previewCloseTimer = 0;
  }

  function closeEntityPreview({ updateTimeline = true } = {}) {
    clearPreviewTimers();
    previewEntityId = null;
    previewRelation = null;
    previewPinned = false;
    previewSwipeStartY = null;
    entityPreviewCard.hidden = true;
    entityPreviewCard.innerHTML = '';
    entityPreviewCard.classList.remove('is-pinned', 'is-left', 'is-above');
    if (updateTimeline) renderEntityTimeline();
  }

  function previewSummary(entity) {
    const summary = entitySummary(entity).trim();
    return summary.length > 100 ? `${summary.slice(0, 99)}…` : summary;
  }

  function openEntityPreview(entityId, relation, {
    pinned = false,
    anchorX = 50,
    anchorY = 50
  } = {}) {
    const entity = entityCatalog.get(entityId);
    const networkEntity = activeNetworkEntity(entityId);
    if (!entity || !networkEntity || !relation) return;
    clearPreviewTimers();
    previewEntityId = entityId;
    previewRelation = relation;
    previewPinned = pinned;

    entityPreviewCard.style.setProperty('--preview-x', `${anchorX}%`);
    entityPreviewCard.style.setProperty('--preview-y', `${anchorY}%`);
    entityPreviewCard.classList.toggle('is-pinned', pinned);
    entityPreviewCard.classList.toggle('is-left', anchorX > 62);
    entityPreviewCard.classList.toggle('is-above', anchorY > 58);
    entityPreviewCard.hidden = false;
    entityPreviewCard.innerHTML = `
      <div class="entity-preview-drag-handle" aria-hidden="true"></div>
      <header>
        <div>
          <h2>${escapeHtml(entityDisplayName(entity))}</h2>
          <p>${escapeHtml(entityTypeLabels[entity.type] || entity.type)} · ${escapeHtml(formatTimeSpan(networkEntity.existence))}</p>
        </div>
        <button type="button" class="entity-preview-close" data-preview-close aria-label="关闭${escapeHtml(entityDisplayName(entity))}预览">×</button>
      </header>
      <p class="entity-preview-summary">${escapeHtml(previewSummary(entity))}</p>
      <section class="entity-preview-relation" aria-label="当前关系">
        <div>与${escapeHtml(entityDisplayName(activeEntityId))}的关系 · ${escapeHtml(formatTimeSpan(relation.time))}</div>
        <p>${escapeHtml(relation.summary)}</p>
      </section>
      <button
        type="button"
        class="entity-preview-enter"
        data-preview-enter
        data-entity-id="${escapeHtml(entityId)}"
        data-relation-id="${escapeHtml(relation.id)}"
      >进入${escapeHtml(entityDisplayName(entity))}主视角</button>
    `;

    entityPreviewCard.querySelector('[data-preview-close]')?.addEventListener('click', () => closeEntityPreview());
    entityPreviewCard.querySelector('[data-preview-enter]')?.addEventListener('click', event => {
      const target = event.currentTarget;
      const targetId = target.dataset.entityId;
      const relationId = target.dataset.relationId;
      closeEntityPreview({ updateTimeline: false });
      navigateEntity(targetId, relationId, { historyMode: 'push' });
    });
    entityPreviewCard.onmouseenter = () => window.clearTimeout(previewCloseTimer);
    entityPreviewCard.onmouseleave = () => {
      if (!previewPinned) schedulePreviewClose();
    };
    entityPreviewCard.onfocusin = () => window.clearTimeout(previewCloseTimer);
    entityPreviewCard.onfocusout = event => {
      if (!previewPinned && !entityPreviewCard.contains(event.relatedTarget)) schedulePreviewClose();
    };
    entityPreviewCard.onpointerdown = event => {
      previewSwipeStartY = event.pointerType === 'mouse' ? null : event.clientY;
    };
    entityPreviewCard.onpointerup = event => {
      if (previewSwipeStartY !== null && event.clientY - previewSwipeStartY > 60) {
        closeEntityPreview();
      }
      previewSwipeStartY = null;
    };
    renderEntityTimeline();
  }

  function schedulePreviewOpen(entityId, relation, anchor) {
    if (window.matchMedia('(max-width: 920px)').matches) return;
    clearPreviewTimers();
    previewOpenTimer = window.setTimeout(() => {
      openEntityPreview(entityId, relation, { ...anchor, pinned: false });
    }, 200);
  }

  function schedulePreviewClose() {
    window.clearTimeout(previewOpenTimer);
    previewCloseTimer = window.setTimeout(() => {
      if (!previewPinned) closeEntityPreview();
    }, 160);
  }

  function bindMapChip(button, entityId, relation, anchor) {
    button.addEventListener('mouseenter', () => schedulePreviewOpen(entityId, relation, anchor));
    button.addEventListener('mouseleave', schedulePreviewClose);
    button.addEventListener('focus', () => schedulePreviewOpen(entityId, relation, anchor));
    button.addEventListener('blur', schedulePreviewClose);
    button.addEventListener('click', event => {
      event.stopPropagation();
      openEntityPreview(entityId, relation, { ...anchor, pinned: true });
    });
  }

  function defaultEntityEntryYear(entityId) {
    const exploration = activeExploration();
    if (exploration?.entry?.entityId === entityId) return exploration.entry.year;
    return activeNetworkEntity(entityId)?.moments?.[0]?.cursorYear ?? null;
  }

  function setEntityYear(year, {
    historyMode = 'replace',
    renderTimeline = true
  } = {}) {
    if (!activeEntityId || !activeNetworkEntity(activeEntityId)) return;
    const moment = entityQueries.getNearestEntityMoment?.(activeEntityId, year);
    if (!moment) return;
    closeEntityPreview({ updateTimeline: false });
    activeEntityYear = moment.cursorYear;
    renderEntityMap(activeEntityId);
    renderEntityHubArticle(activeEntityId);
    renderMobileEntityLead(activeEntityId);
    if (renderTimeline) renderEntityTimeline();
    updateRouteHash(`entity-${activeEntityId}/${activeEntityYear}`, historyMode, {
      explorationPath,
      activeEntityYear,
      activeExplorationId
    });
  }

  function navigateEntity(entityId, relationId = null, {
    historyMode = 'push',
    path = null,
    year = null,
    explorationId = undefined
  } = {}) {
    if (!entityCatalog.has(entityId)) return;
    const basePath = path || (activeEntityId ? explorationPath : []);
    const nextPath = normalizedExplorationPath(basePath, entityId, relationId);
    let entryYear = Number.isFinite(year) ? year : null;
    const targetNetworkEntity = activeNetworkEntity(entityId);
    if (targetNetworkEntity && !Number.isFinite(entryYear)) {
      const activeEpisode = relationId && activeEntityId
        ? entityQueries.getActiveRelationEpisodes?.(activeEntityId, activeEntityYear)
          ?.find(item => item.relationId === relationId)
        : null;
      entryYear = activeEpisode
        ? entityQueries.resolveEntityEntryYear?.(entityId, activeEntityYear, activeEpisode)
        : defaultEntityEntryYear(entityId);
    }
    renderEntityExplorer(entityId, {
      historyMode,
      path: nextPath,
      year: entryYear,
      explorationId
    });
  }

  function openExploration(explorationId, { historyMode = 'push' } = {}) {
    const exploration = getExploration(explorationId);
    if (!exploration || !entityCatalog.has(exploration.entry?.entityId)) return;
    renderEntityExplorer(exploration.entry.entityId, {
      historyMode,
      path: [],
      year: exploration.entry.year,
      explorationId: exploration.id
    });
  }

  function openEntityPanel(entityId, relationId = null) {
    navigateEntity(entityId, relationId, { historyMode: 'push' });
  }

  function bindEntityControls(root) {
    root.querySelectorAll('[data-entity-open]').forEach(control => {
      control.addEventListener('click', event => {
        if (control.tagName === 'A') event.preventDefault();
        const fromEntityId = control.dataset.fromEntity;
        const path = fromEntityId && activeEntityId !== fromEntityId
          ? [{ entityId: fromEntityId, relationId: null }]
          : null;
        navigateEntity(control.dataset.entityOpen, control.dataset.relationId || null, {
          historyMode: 'push',
          path
        });
      });
    });
  }

  function bindExplorationControls(root) {
    root.querySelectorAll('[data-exploration-open]').forEach(control => {
      control.addEventListener('click', event => {
        if (!isUnmodifiedActivation(event)) return;
        event.preventDefault();
        openExploration(control.dataset.explorationOpen, { historyMode: 'push' });
      });
    });
  }

  function renderRegionNetwork(story) {
    const prompts = curation.getRegionQuestionPrompts?.(story.id) || [];
    if (!prompts.length) return '';
    const headingId = `${story.id}-network-title`;
    return `
      <section class="article-zone region-network" aria-labelledby="${escapeHtml(headingId)}">
        <div class="article-zone-heading">
          <div class="eyebrow">地区 × 文明网络</div>
          <h2 id="${escapeHtml(headingId)}">${escapeHtml(story.shortTitle)}与文明网络</h2>
        </div>
        <p>选择一个已有内容的问题，沿地区关系继续探索；尚未迁移的实体仍使用兼容页面。</p>
        <div class="region-question-list">
          ${prompts.map(prompt => `
            <button type="button" data-entity-open="${escapeHtml(prompt.targetId)}" data-from-entity="${escapeHtml(story.id)}" data-relation-id="${escapeHtml(prompt.relationId)}">
              <strong>${escapeHtml(prompt.question)}</strong>
              <span>沿关系继续探索 →</span>
            </button>
          `).join('')}
        </div>
      </section>
    `;
  }

  function renderArticle(story) {
    const geographyHistory = story.sections.slice(1).map(section => `
      <section class="mechanism-subsection">
        <h3>${section.heading}</h3>
        ${section.themes ? `
          <div class="mechanism-themes">
            ${section.themes.map(theme => `
              <div class="mechanism-theme">
                <h4>${theme.heading}</h4>
                <p>${theme.body}</p>
              </div>
            `).join('')}
          </div>
        ` : section.body.map(paragraph => `<p>${paragraph}</p>`).join('')}
      </section>
    `).join('');
    const timeline = story.timeline?.map(event => `
      <li class="timeline-event">
        <div class="timeline-marker" aria-hidden="true"></div>
        <div class="timeline-card">
          <div class="timeline-heading">
            <time>${event.date}</time>
            <h3>${event.title}</h3>
          </div>
          <p>${event.summary}</p>
          <p class="timeline-meaning"><span>为何重要</span>${event.significance}</p>
          ${event.sourceIds?.length ? `
            <div class="timeline-sources" aria-label="本条事件来源">
              ${event.sourceIds.map(id => {
                const source = story.sources.find(item => item.id === id);
                return source ? `<a href="${source.url}" target="_blank" rel="noreferrer">来源：${source.shortTitle || source.title}</a>` : '';
              }).join('')}
            </div>
          ` : ''}
        </div>
      </li>
    `).join('') || '';

    article.innerHTML = `
      <header class="story-header">
        <div class="eyebrow">${story.eyebrow}</div>
        <h1 class="story-title">${story.title}</h1>
        <p class="thesis">${story.thesis}</p>
      </header>
      ${renderRegionNetwork(story)}
      <nav class="article-section-nav" aria-label="${story.title}内容分区">
        <a href="#geography-${story.id}">地理</a>
        <a href="#mechanism-${story.id}">地理与历史</a>
        <a href="#history-${story.id}">历史</a>
      </nav>
      <section id="geography-${story.id}" class="article-zone geography-zone">
        <div class="article-zone-heading">
          <h2>地理</h2>
        </div>
        <div class="geography-sections">
          <section>
            <h3>地形</h3>
            <p>${story.geography.topography}</p>
          </section>
          <section>
            <h3>地质</h3>
            <p>${story.geography.geology}</p>
          </section>
          <section>
            <h3>气候</h3>
            <p>${story.geography.climate}</p>
          </section>
        </div>
        <a class="zone-source" href="${story.geography.sourceUrl}" target="_blank" rel="noreferrer">地理摘要来源：${story.geography.sourceTitle}</a>
      </section>
      <section id="mechanism-${story.id}" class="article-zone mechanism-zone">
        <div class="article-zone-heading">
          <h2>地理与历史</h2>
        </div>
        ${geographyHistory}
        <div class="takeaway">${story.takeaway}</div>
        <div class="caveat">
          <strong>避免地理决定论</strong>
          ${story.caveat}
        </div>
      </section>
      <details id="history-${story.id}" class="article-zone timeline-section region-timeline-details">
        <summary>
          <span>后续阅读</span>
          <strong>完整历史年表 · ${story.timeline.length} 个关键转折</strong>
        </summary>
        <p class="timeline-intro">${story.timelineNote}</p>
        <ol class="timeline">${timeline}</ol>
      </details>
      <details class="editorial-details">
        <summary>来源与编辑说明</summary>
        <div class="editorial-meta">
          <span>解释信心：${story.confidence}</span>
          <span>内容状态：人工策展初稿</span>
        </div>
        <p>这是内容验证版，不是最终学术结论。下一版应逐条增加脚注、史料争议和不同学者解释。</p>
        <h3>完整参考来源</h3>
        <div class="sources">
          ${story.sources.map(source => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.title}</a>`).join('')}
        </div>
      </details>
    `;
    bindStoryLinks(article);
    bindRouteLinks(article);
    bindEntityControls(article);
    article.querySelectorAll('.article-section-nav a').forEach(link => {
      link.addEventListener('click', event => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function setWorldMode(enabled) {
    isWorldOverview = enabled;
    mapFrame.classList.toggle('is-world', enabled);
    mapFrame.classList.toggle('is-region', !enabled);
    worldMapTools.hidden = false;
    mapViewActions.hidden = !enabled;
    if (!enabled) {
      mapFrame.classList.remove('is-dragging');
      dragState = null;
      worldTileKey = '';
    }
    svg.setAttribute('role', enabled ? 'group' : 'img');
    svg.setAttribute('tabindex', enabled ? '0' : '-1');
    svg.setAttribute(
      'aria-label',
      enabled
        ? '可缩放和拖动的世界平面地图。东西方向循环，上下方向在地图范围内移动；红色节点标出可进入的历史地理区域。'
        : '可切换卫星影像与地理简图的区域自然地理地图'
    );
  }

  function isUnmodifiedActivation(event) {
    return (
      event.button === 0
      && !event.metaKey
      && !event.ctrlKey
      && !event.shiftKey
      && !event.altKey
    );
  }

  function updateRouteHash(route, mode, state = {}) {
    if (mode === 'none') return;
    const nextHash = `#${route}`;
    const nextState = { route, ...state };
    try {
      if (mode === 'push' && location.hash !== nextHash) {
        history.pushState(nextState, '', nextHash);
      } else if (mode === 'push') {
        history.pushState(nextState, '', nextHash);
      } else {
        history.replaceState(nextState, '', nextHash);
      }
    } catch (error) {
      if (location.hash !== nextHash) location.hash = route;
    }
  }

  function scrollToRegionDirectory({ updateHash = false } = {}) {
    if (updateHash) updateRouteHash('region-directory', 'push');
    requestAnimationFrame(() => {
      const target = document.getElementById('region-directory');
      if (!target) return;
      if (window.matchMedia('(max-width: 920px)').matches) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      const articleBounds = article.getBoundingClientRect();
      const targetBounds = target.getBoundingClientRect();
      article.scrollTo({
        top: article.scrollTop + targetBounds.top - articleBounds.top,
        behavior: 'smooth'
      });
    });
  }

  function bindStoryLinks(root) {
    root.querySelectorAll('[data-story-link]').forEach(link => {
      link.addEventListener('click', event => {
        if (!isUnmodifiedActivation(event)) return;
        event.preventDefault();
        const id = link.dataset.storyLink;
        if (id === 'overview') renderOverview({ historyMode: 'push' });
        else selectStory(id, { historyMode: 'push' });
      });
    });
  }

  function navigateToRoute(route, { historyMode = 'push' } = {}) {
    if (route === 'home') renderHome({ historyMode });
    else if (route === 'map' || route === 'overview') renderOverview({ historyMode });
    else if (route === 'explorations' || route === 'stories') renderExplorationsIndex({ historyMode });
    else if (route.startsWith('exploration-')) openExploration(route.slice(12), { historyMode });
    else if (route.startsWith('entity-')) {
      const [entityId, routeYear] = route.slice(7).split('/');
      navigateEntity(entityId, null, {
        historyMode,
        path: [],
        year: routeYear === undefined ? null : Number(routeYear),
        explorationId: null
      });
    }
    else if (route.startsWith('story-')) {
      const [storyId, chapterId] = route.slice(6).split('/');
      if (getExploration(storyId)) {
        openExploration(storyId, { historyMode });
        return;
      }
      const story = knowledgeStories.find(item => item.id === storyId);
      const chapterIndex = chapterId ? story?.chapters.findIndex(chapter => chapter.id === chapterId) : 0;
      if (story) renderCivilizationStory(story, { historyMode, chapterIndex: Math.max(0, chapterIndex) });
    } else if (stories.some(story => story.id === route)) {
      selectStory(route, { historyMode });
    }
  }

  function bindRouteLinks(root) {
    root.querySelectorAll('[data-route-link]').forEach(link => {
      link.addEventListener('click', event => {
        if (!isUnmodifiedActivation(event)) return;
        event.preventDefault();
        navigateToRoute(link.dataset.routeLink, { historyMode: 'push' });
      });
    });
  }

  function renderTopNavigation(current = 'home') {
    const currentId = typeof current === 'string' ? current : current?.id;
    const region = typeof current === 'object' ? current : stories.find(item => item.id === currentId);
    let trail = [];
    if (currentId === 'home') trail = [];
    else if (currentId === 'map') trail = [
      ['首页', 'home'],
      ['地图', 'map']
    ];
    else if (region) trail = [
      ['首页', 'home'],
      ['地图', 'map'],
      [region.shortTitle, '']
    ];
    else if (currentId === 'explorations') trail = [
      ['首页', 'home'],
      ['探索', 'explorations']
    ];
    else if (String(currentId).startsWith('story-')) trail = [
      ['首页', 'home'],
      ['探索', 'explorations'],
      [activeKnowledgeStory?.chapters?.[activeChapterIndex]?.title || '探索步骤', '']
    ];
    else if (String(currentId).startsWith('entity-')) {
      const exploration = activeExploration();
      trail = [
        ['首页', 'home'],
        ...(exploration ? [[exploration.title, `exploration-${exploration.id}`]] : []),
        [entityDisplayName(String(currentId).slice(7)) || '实体', '']
      ];
    }
    tabs.innerHTML = `
      ${trail.map(([label, route], index) => `
        ${index ? '<span class="breadcrumb-separator" aria-hidden="true">/</span>' : ''}
        ${route
          ? `<a class="breadcrumb-link" href="#${escapeHtml(route)}" data-route-link="${escapeHtml(route)}">${escapeHtml(label)}</a>`
          : `<span class="breadcrumb-current" aria-current="page">${escapeHtml(label)}</span>`}
      `).join('')}
    `;
    bindRouteLinks(tabs);
  }

  function updateMapStyleControls() {
    worldStyleButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.worldStyle === worldStyle));
    });
  }

  function updateWorldControls() {
    updateMapStyleControls();
    zoomWorldOut.disabled = worldZoom === worldOverview.minZoom;
    zoomWorldIn.disabled = worldZoom === worldOverview.maxZoom;
    worldZoomLevel.value = `${2 ** (worldZoom - worldOverview.minZoom)}×`;
    worldZoomLevel.textContent = worldZoomLevel.value;
  }

  function updateWorldCaption() {
    const source = worldStyle === 'satellite'
      ? '<span class="map-credit">影像：<a href="https://www.esri.com/" target="_blank" rel="noreferrer">Esri</a>、Maxar、Earthstar Geographics、GIS User Community</span>'
      : '<span class="map-credit">地形阴影：<a href="https://www.esri.com/" target="_blank" rel="noreferrer">Esri</a> World Hillshade · 海陆与水系：<a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">Natural Earth</a> 1:50m</span>';
    const vectorCaveat = worldStyle === 'vector'
      ? '简图只呈现自然地形与水系，不含历史或现代疆界。'
      : '';
    mapCaption.innerHTML = `
      <span class="map-note">Web Mercator · 1×—16× · 拖动平移 · Ctrl/⌘ + 滚轮缩放。${vectorCaveat}红点为近似定位。</span>
      ${source}
    `;
  }

  function renderWorldBase() {
    mapUiOverlay.innerHTML = '';
    worldLabelEntries = [];
    mapFrame.classList.toggle('is-vector', worldStyle === 'vector');
    worldTileKey = '';
    renderWorldTiles();
    if (worldStyle === 'satellite') vectorLayer.innerHTML = '';
    else renderWorldVector();
    updateWorldControls();
    updateWorldCaption();
  }

  function renderRegionVector(story) {
    vectorLayer.innerHTML = '';
    if (!worldVector.landPath) return;

    const worldSize = TILE_SIZE * (2 ** activeZoom);
    const sourceSize = worldVector.size || 4096;
    const scale = worldSize / sourceSize;
    const physicalGroup = svgEl('g', { transform: `scale(${scale})` });

    physicalGroup.appendChild(svgEl('path', {
      d: worldVector.landPath,
      class: 'vector-land region-vector-land',
      'fill-rule': 'evenodd'
    }));
    (worldVector.lakes || []).forEach(feature => {
      physicalGroup.appendChild(svgEl('path', {
        d: feature.d,
        class: 'vector-lake',
        'fill-rule': 'evenodd'
      }));
    });
    (worldVector.rivers || []).forEach(feature => {
      physicalGroup.appendChild(svgEl('path', {
        d: feature.d,
        class: 'vector-river'
      }));
    });
    vectorLayer.appendChild(physicalGroup);

    const detailedRivers = regionHydro.rivers || {};
    const riverNames = story.features
      .filter(feature => feature.type === 'river')
      .map(feature => feature.label);
    const detailGroup = svgEl('g', {
      transform: `scale(${worldSize / (regionHydro.size || 4096)})`
    });
    riverNames.forEach(name => {
      (detailedRivers[name] || []).forEach(path => {
        detailGroup.appendChild(svgEl('path', {
          d: path,
          class: 'region-river-data',
          'data-river': name
        }));
      });
    });
    vectorLayer.appendChild(detailGroup);
  }

  function updateRegionCaption(story) {
    const source = worldStyle === 'satellite'
      ? '<span class="map-credit">影像：<a href="https://www.esri.com/" target="_blank" rel="noreferrer">Esri</a>、Maxar 等 · 河名定位：<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a></span>'
      : '<span class="map-credit">地形阴影：<a href="https://www.esri.com/" target="_blank" rel="noreferrer">Esri</a> · 水系：<a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">Natural Earth</a> 与 <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a></span>';
    const note = worldStyle === 'vector'
      ? '山名定位于地形阴影，河名对应真实水系数据；不绘制教学椭圆、山形线或近似河线。'
      : story.mapNote;
    mapCaption.innerHTML = `<span class="map-note">${note}</span>${source}`;
  }

  function renderRegionBase(story) {
    mapUiOverlay.innerHTML = '';
    mapFrame.classList.toggle('is-vector', worldStyle === 'vector');
    updateMapStyleControls();
    if (worldStyle === 'satellite') {
      vectorLayer.innerHTML = '';
      renderTiles(story.view, activeZoom, 'satellite');
    } else {
      renderTiles(story.view, activeZoom, 'vector');
      renderRegionVector(story);
    }
    updateRegionCaption(story);
  }

  function selectStory(id, { historyMode = 'replace' } = {}) {
    const story = stories.find(item => item.id === id);
    if (!story) return;

    activeStory = story;
    activeKnowledgeStory = null;
    activeEntityId = null;
    activeEntityYear = null;
    activeExplorationId = null;
    explorationPath = [];
    lastSelectedStoryId = story.id;
    setPageMode('region');
    renderMobileLead();
    setWorldMode(false);
    renderTopNavigation(story);

    activeZoom = story.tileZoom || 8;
    overlay.innerHTML = '';
    mapFrame.style.aspectRatio = String(REGION_ASPECT_RATIO);
    svg.setAttribute('viewBox', regionViewBox(story.view));
    updateRegionLabelScale(story);
    renderRegionBase(story);
    story.features.forEach(feature => renderFeature(feature, story));
    renderArticle(story);
    updateRouteHash(story.id, historyMode);
    resetContentScroll({ focusSelector: '.story-title' });
  }

  function wrapWorldCenter(value) {
    const worldSize = TILE_SIZE * (2 ** worldZoom);
    let wrapped = value;
    while (wrapped < worldSize) wrapped += worldSize;
    while (wrapped >= worldSize * 2) wrapped -= worldSize;
    return wrapped;
  }

  function clampWorldCenterY(value) {
    const worldSize = TILE_SIZE * (2 ** worldZoom);
    const halfHeight = worldOverview.viewHeight / 2;
    return Math.max(halfHeight, Math.min(worldSize - halfHeight, value));
  }

  function updateWorldViewBox() {
    const x = worldCenterX - worldOverview.viewWidth / 2;
    const y = worldViewportTop();
    renderWorldTiles();
    svg.setAttribute(
      'viewBox',
      `${x} ${y} ${worldOverview.viewWidth} ${worldOverview.viewHeight}`
    );
  }

  function resetWorldPosition(focusMap = false) {
    const worldSize = TILE_SIZE * (2 ** worldZoom);
    worldCenterX = xy(worldOverview.centerLon, 0, worldZoom).x + worldSize;
    worldCenterY = xy(0, worldOverview.centerLat, worldZoom).y;
    renderWorldBase();
    renderWorldMarkers();
    updateWorldViewBox();
    if (focusMap) svg.focus({ preventScroll: true });
  }

  function renderWorldMarker(story, copyIndex) {
    const worldSize = TILE_SIZE * (2 ** worldZoom);
    const unit = mapUnitsPerPixel(worldOverview.viewWidth);
    const center = xy(
      (story.view.lonMin + story.view.lonMax) / 2,
      (story.view.latMin + story.view.latMax) / 2,
      worldZoom
    );
    const offsets = {
      hexi: { dx: -15, dy: -14, anchor: 'end' },
      guanzhong: { dx: 17, dy: -9, anchor: 'start' },
      sichuan: { dx: 17, dy: 18, anchor: 'start' }
    };
    const offset = offsets[story.id] || { dx: 14, dy: -12, anchor: 'start' };
    const x = center.x + worldSize * copyIndex;
    const isSelected = story.id === lastSelectedStoryId;
    const labelRankLimit = Math.max(0, worldZoom - 2);
    const shouldPersistLabel = isSelected || (
      worldZoom >= 3
      && (story.overviewRank || 3) <= labelRankLimit
    );
    const link = svgEl('a', {
      class: `overview-marker${isSelected ? ' is-selected' : ''}`,
      href: `#${story.id}`,
      tabindex: copyIndex === 1 ? '0' : '-1',
      'aria-label': `进入${story.shortTitle}历史地理专题`
    });
    link.style.setProperty('--marker-radius', `${6.5 * unit}px`);
    link.style.setProperty('--marker-focus-radius', `${8.5 * unit}px`);
    link.appendChild(svgEl('circle', { cx: x, cy: center.y, r: 6.5 * unit }));
    const markerLabel = label(
      story.shortTitle,
      x + offset.dx * unit,
      center.y + offset.dy * unit,
      offset.anchor,
      0,
      0,
      'feature-label overview-marker-label'
    );
    if (shouldPersistLabel) {
      const fontSize = 14 * unit;
      const box = worldLabelBox(
        story.shortTitle,
        x + offset.dx * unit,
        center.y + offset.dy * unit,
        fontSize,
        offset.anchor
      );
      if (reserveWorldLabel(box, 3, markerLabel)) link.classList.add('is-label-visible');
    }
    link.appendChild(markerLabel);
    link.addEventListener('click', event => {
      if (!isUnmodifiedActivation(event)) return;
      if (performance.now() < suppressMarkerClickUntil) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      selectStory(story.id, { historyMode: 'push' });
    });
    overlay.appendChild(link);
  }

  function renderWorldMarkers() {
    overlay.innerHTML = '';
    const unit = mapUnitsPerPixel(worldOverview.viewWidth);
    overlay.style.setProperty('--world-marker-label-size', `${14 * unit}px`);
    overlay.style.setProperty('--map-label-stroke', `${1.35 * unit}px`);
    stories.forEach(story => {
      [0, 1, 2].forEach(copyIndex => renderWorldMarker(story, copyIndex));
    });
  }

  function zoomWorld(direction) {
    const nextZoom = Math.max(
      worldOverview.minZoom,
      Math.min(worldOverview.maxZoom, worldZoom + direction)
    );
    if (nextZoom === worldZoom) return;

    const oldWorldSize = TILE_SIZE * (2 ** worldZoom);
    const longitudeRatio = (worldCenterX - oldWorldSize) / oldWorldSize;
    const latitudeRatio = worldCenterY / oldWorldSize;
    worldZoom = nextZoom;
    activeZoom = worldZoom;
    const newWorldSize = TILE_SIZE * (2 ** worldZoom);
    worldCenterX = newWorldSize + longitudeRatio * newWorldSize;
    worldCenterY = clampWorldCenterY(latitudeRatio * newWorldSize);
    renderWorldBase();
    renderWorldMarkers();
    updateWorldViewBox();
  }

  function switchWorldStyle(nextStyle) {
    if (!['satellite', 'vector'].includes(nextStyle) || nextStyle === worldStyle) return;
    worldStyle = nextStyle;
    if (isWorldOverview) {
      renderWorldBase();
      renderWorldMarkers();
      updateWorldViewBox();
    } else if (activeStory) {
      renderRegionBase(activeStory);
    } else if (activeEntityId) {
      renderEntityMap(activeEntityId);
    } else if (activeKnowledgeStory) {
      renderKnowledgeStoryMap(activeKnowledgeStory, activeChapterIndex);
    }
  }

  function prepareWorldPage(currentRoute) {
    activeStory = null;
    activeKnowledgeStory = null;
    activeEntityId = null;
    activeEntityYear = null;
    activeExplorationId = null;
    explorationPath = [];
    activeZoom = worldZoom;
    setPageMode(currentRoute === 'home' ? 'home' : currentRoute);
    renderMobileLead();
    setWorldMode(true);
    renderTopNavigation(currentRoute);
    mapFrame.style.aspectRatio = String(worldOverview.viewWidth / worldOverview.viewHeight);
    resetWorldPosition();
  }

  function renderHome({ historyMode = 'replace' } = {}) {
    prepareWorldPage('home');
    const featuredExploration = explorations[0];
    article.innerHTML = `
      <header class="story-header home-hero">
        <div class="eyebrow">山河与文明 · 第一次探索</div>
        <h1 class="story-title" tabindex="-1">${escapeHtml(featuredExploration?.question || '从实体与关系进入历史地理')}</h1>
        <p class="thesis">${escapeHtml(featuredExploration?.introduction || '从实体出发，在离散时间状态中查看关系如何变化。')}</p>
        ${featuredExploration ? `<a class="primary-link home-primary-action" href="#exploration-${escapeHtml(featuredExploration.id)}" data-exploration-open="${escapeHtml(featuredExploration.id)}">开始探索</a>` : ''}
      </header>
      <section class="home-secondary-entries" aria-label="其他入口">
        <div class="eyebrow">也可以从地理进入</div>
        <div>
          <a href="#map" data-route-link="map">地图总览</a>
          <a href="#hexi" data-story-link="hexi">河西走廊</a>
          <a href="#guanzhong" data-story-link="guanzhong">关中</a>
          <a href="#sichuan" data-story-link="sichuan">四川盆地</a>
        </div>
      </section>
    `;
    bindRouteLinks(article);
    bindStoryLinks(article);
    bindExplorationControls(article);
    updateRouteHash('home', historyMode);
    resetContentScroll({ focusSelector: '.story-title' });
  }

  function renderExplorationsIndex({ historyMode = 'replace' } = {}) {
    prepareWorldPage('explorations');
    const featured = explorations[0];
    article.innerHTML = `
      <header class="story-header overview-header">
        <div class="eyebrow">EXPLORATION · 策展探索</div>
        <h1 class="story-title overview-title">从一个问题进入实体网络</h1>
        <p class="thesis overview-intro">策展问题只确定入口实体、初始时间与推荐关系；实体正文、地图状态和关系说明仍来自核心数据层。</p>
      </header>
      ${featured ? `
        <section class="story-feature-card">
          <div class="story-feature-number">01</div>
          <div>
            <div class="eyebrow">当前探索</div>
            <h2>${escapeHtml(featured.title)}</h2>
            <p>${escapeHtml(featured.question)}</p>
            <a class="primary-link" href="#exploration-${escapeHtml(featured.id)}" data-exploration-open="${escapeHtml(featured.id)}">进入实体主视角</a>
          </div>
        </section>
      ` : ''}
    `;
    bindRouteLinks(article);
    bindExplorationControls(article);
    updateRouteHash('explorations', historyMode);
    resetContentScroll({ focusSelector: '.story-title' });
  }

  function renderKnowledgeVector() {
    vectorLayer.innerHTML = '';
    if (!worldVector.landPath) return;
    const worldSize = TILE_SIZE * (2 ** activeZoom);
    const sourceSize = worldVector.size || 4096;
    const scale = worldSize / sourceSize;
    const group = svgEl('g', { transform: `scale(${scale})` });
    group.appendChild(svgEl('path', {
      d: worldVector.landPath,
      class: 'vector-land region-vector-land',
      'fill-rule': 'evenodd'
    }));
    (worldVector.lakes || []).forEach(feature => {
      group.appendChild(svgEl('path', { d: feature.d, class: 'vector-lake', 'fill-rule': 'evenodd' }));
    });
    (worldVector.rivers || []).forEach(feature => {
      group.appendChild(svgEl('path', { d: feature.d, class: 'vector-river' }));
    });
    vectorLayer.appendChild(group);
  }

  function entityCoordinatesAt(entityId, year = activeEntityYear) {
    const moment = entityMoment(entityId, year);
    const point = moment?.map?.features?.find(feature => feature.geometry?.type === 'Point');
    return point?.geometry?.coordinates || entityCatalog.get(entityId)?.coordinates || null;
  }

  function entityMapChipCoordinates(entityId, index = 0, year = activeEntityYear) {
    const moment = entityMoment(entityId, year);
    const points = (moment?.map?.features || [])
      .filter(feature => feature.geometry?.type === 'Point')
      .map(feature => feature.geometry.coordinates);
    return points.length ? points[index % points.length] : entityCoordinatesAt(entityId, year);
  }

  function viewFromMoment(moment) {
    const view = moment?.map?.view;
    if (!view) return null;
    const lonSpan = (360 / (2 ** view.zoom)) * 1.35;
    const latSpan = lonSpan / REGION_ASPECT_RATIO;
    return {
      lonMin: Math.max(-178, view.center[0] - lonSpan / 2),
      lonMax: Math.min(178, view.center[0] + lonSpan / 2),
      latMin: Math.max(-75, view.center[1] - latSpan / 2),
      latMax: Math.min(75, view.center[1] + latSpan / 2)
    };
  }

  function entityView(entityId, nextRelations, fallbackView, moment = null) {
    const entity = entityCatalog.get(entityId);
    const momentView = viewFromMoment(moment);
    if (momentView) {
      lastEntityMapView = momentView;
      return momentView;
    }
    const entityCoordinates = entityCoordinatesAt(entityId);
    if (!entityCoordinates) {
      lastEntityMapView = explorationPath.length > 1 && lastEntityMapView
        ? lastEntityMapView
        : (fallbackView || lastEntityMapView);
      return lastEntityMapView;
    }
    const previousCoordinates = explorationPath
      .slice(-2)
      .map(step => entityCoordinatesAt(step.entityId))
      .filter(Boolean);
    const adjacentCoordinates = nextRelations
      .map(relation => entityCoordinatesAt(otherEntityId(relation, entityId)))
      .filter(Boolean);
    const points = [entityCoordinates, ...previousCoordinates, ...adjacentCoordinates];
    const longitudes = points.map(point => point[0]);
    const latitudes = points.map(point => point[1]);
    const lonSpan = Math.max(8, Math.max(...longitudes) - Math.min(...longitudes));
    const latSpan = Math.max(6, Math.max(...latitudes) - Math.min(...latitudes));
    const centerLon = entityCoordinates[0];
    const centerLat = entityCoordinates[1];
    const view = {
      lonMin: Math.max(-178, Math.min(centerLon - 6, Math.min(...longitudes) - lonSpan * 0.18)),
      lonMax: Math.min(178, Math.max(centerLon + 6, Math.max(...longitudes) + lonSpan * 0.18)),
      latMin: Math.max(-75, Math.min(centerLat - 4, Math.min(...latitudes) - latSpan * 0.2)),
      latMax: Math.min(75, Math.max(centerLat + 4, Math.max(...latitudes) + latSpan * 0.2))
    };
    lastEntityMapView = view;
    return view;
  }

  function geometryPath(geometry) {
    if (!geometry?.coordinates) return '';
    const linePath = coordinates => coordinates
      .map(([lon, lat], index) => {
        const point = xy(lon, lat, activeZoom);
        return `${index ? 'L' : 'M'} ${point.x} ${point.y}`;
      })
      .join(' ');
    if (geometry.type === 'LineString') return linePath(geometry.coordinates);
    if (geometry.type === 'Polygon') {
      return geometry.coordinates.map(ring => `${linePath(ring)} Z`).join(' ');
    }
    return '';
  }

  function renderEntityMomentFeatures(moment, unit) {
    (moment?.map?.features || []).forEach((feature, index) => {
      const geometry = feature.geometry;
      if (geometry?.type === 'Point') {
        const point = xy(geometry.coordinates[0], geometry.coordinates[1], activeZoom);
        const graphic = svgEl('g', {
          class: `entity-moment-feature entity-moment-feature--${feature.kind}`,
          'aria-hidden': 'true'
        });
        graphic.appendChild(svgEl('circle', {
          cx: point.x,
          cy: point.y,
          r: (feature.kind === 'origin' ? 10 : 7) * unit
        }));
        if (feature.label) {
          graphic.appendChild(label(
            feature.label,
            point.x,
            point.y,
            index % 2 ? 'end' : 'start',
            (index % 2 ? -12 : 12) * unit,
            -10 * unit,
            'entity-moment-label'
          ));
        }
        overlay.appendChild(graphic);
        return;
      }
      const d = geometryPath(geometry);
      if (!d) return;
      const shape = svgEl('path', {
        d,
        class: `entity-moment-feature entity-moment-feature--${feature.kind}${feature.approximate ? ' is-approximate' : ''}`,
        'fill-rule': 'evenodd'
      });
      const title = svgEl('title');
      title.textContent = `${feature.label || moment.title}${feature.approximate ? '（近似教学叠加）' : ''}`;
      shape.appendChild(title);
      overlay.appendChild(shape);
    });
  }

  function coordinatesInsideView(coordinates, view) {
    return coordinates
      && coordinates[0] >= view.lonMin
      && coordinates[0] <= view.lonMax
      && coordinates[1] >= view.latMin
      && coordinates[1] <= view.latMax;
  }

  function renderEntityMap(entityId, { fallbackView = null, legacyMode = false } = {}) {
    const entity = entityCatalog.get(entityId);
    if (!entity) return;
    const networkEntity = !legacyMode ? activeNetworkEntity(entityId) : null;
    const moment = networkEntity ? entityMoment(entityId) : null;
    const story = legacyMode ? (activeKnowledgeStory || knowledgeStories[0]) : null;
    const chapter = story?.chapters.find(item => item.entityIds.includes(entityId)) || story?.chapters[0];
    const nextRelations = explorationRelations(entityId, { legacyMode });
    const view = entityView(entityId, nextRelations, fallbackView || chapter?.view || {
      lonMin: 78, lonMax: 89, latMin: 22, latMax: 29.5
    }, moment);
    activeZoom = moment?.map?.view?.zoom
      || (view.lonMax - view.lonMin > 30 ? 3 : (view.lonMax - view.lonMin > 18 ? 4 : 5));
    mapFrame.style.aspectRatio = String(REGION_ASPECT_RATIO);
    svg.setAttribute('viewBox', regionViewBox(view));
    overlay.innerHTML = '';
    mapUiOverlay.innerHTML = '';
    mapFrame.classList.toggle('is-vector', worldStyle === 'vector');
    updateMapStyleControls();
    renderTiles(view, activeZoom, worldStyle);
    if (worldStyle === 'vector') renderKnowledgeVector();
    else vectorLayer.innerHTML = '';

    const bounds = regionViewBounds(view);
    const unit = mapUnitsPerPixel(bounds.width);
    overlay.style.setProperty('--story-node-size', `${7.5 * unit}px`);
    overlay.style.setProperty('--story-node-label-size', `${13 * unit}px`);
    overlay.style.setProperty('--story-node-label-stroke', `${1.2 * unit}px`);
    overlay.style.setProperty('--story-route-width', `${2.4 * unit}px`);
    renderEntityMomentFeatures(moment, unit);

    if (!networkEntity) {
      const pathPoints = explorationPath
        .map(step => entityCoordinatesAt(step.entityId))
        .filter(coordinates => coordinatesInsideView(coordinates, view))
        .map(([lon, lat]) => xy(lon, lat, activeZoom));
      if (pathPoints.length > 1) {
        overlay.appendChild(svgEl('path', {
          d: pathPoints.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' '),
          class: 'exploration-path'
        }));
      }
    }

    nextRelations.forEach(relation => {
      if (!relation.geometry?.coordinates?.length) return;
      const route = svgEl('path', {
        d: geometryPath(relation.geometry),
        class: 'story-route is-adjacent'
      });
      const title = svgEl('title');
      title.textContent = `${relation.summary}（近似教学路线）`;
      route.appendChild(title);
      overlay.appendChild(route);
    });

    const adjacent = new Map(nextRelations.map(relation => [otherEntityId(relation, entityId), relation]));
    if (networkEntity) {
      [...adjacent.entries()].forEach(([nodeId, relation], chipIndex) => {
        const nodeEntity = entityCatalog.get(nodeId);
        const nodeCoordinates = entityMapChipCoordinates(nodeId, chipIndex);
        if (!nodeEntity || !coordinatesInsideView(nodeCoordinates, view)) return;
        const point = xy(nodeCoordinates[0], nodeCoordinates[1], activeZoom);
        const left = ((point.x - bounds.x) / bounds.width) * 100;
        const top = ((point.y - bounds.y) / bounds.height) * 100;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'map-chip';
        button.style.left = `${left}%`;
        button.style.top = `${top}%`;
        button.dataset.entityId = nodeId;
        button.setAttribute('aria-label', `预览${entityDisplayName(nodeEntity)}，${entityTypeLabels[nodeEntity.type] || nodeEntity.type}`);
        button.innerHTML = `
          <strong>${escapeHtml(entityDisplayName(nodeEntity))}</strong>
          <span>${escapeHtml(entityTypeLabels[nodeEntity.type] || nodeEntity.type)}</span>
        `;
        bindMapChip(button, nodeId, relation, { anchorX: left, anchorY: top });
        mapUiOverlay.appendChild(button);
      });
    } else {
      const visitedIds = new Set(explorationPath.map(step => step.entityId));
      const subduedIds = chapter?.nodeEntityIds || [];
      const nodeIds = [...new Set([entityId, ...adjacent.keys(), ...visitedIds, ...subduedIds])]
        .filter(id => coordinatesInsideView(entityCoordinatesAt(id), view))
        .sort((a, b) => {
          const rank = id => (
            id === entityId ? 3
              : (adjacent.has(id) ? 2 : (visitedIds.has(id) ? 1 : 0))
          );
          return rank(a) - rank(b);
        });

      nodeIds.forEach((nodeId, nodeIndex) => {
        const nodeEntity = entityCatalog.get(nodeId);
        const nodeCoordinates = entityCoordinatesAt(nodeId);
        const point = xy(nodeCoordinates[0], nodeCoordinates[1], activeZoom);
        const stateClass = nodeId === entityId
          ? 'is-current'
          : (adjacent.has(nodeId) ? 'is-adjacent' : (visitedIds.has(nodeId) ? 'is-visited' : 'is-subdued'));
        const graphic = svgEl('g', {
          class: `story-node-graphic ${stateClass}`,
          'aria-hidden': 'true'
        });
        graphic.appendChild(svgEl('circle', { cx: point.x, cy: point.y, r: 7.5 * unit }));
        graphic.appendChild(label(
          entityDisplayName(nodeEntity),
          point.x,
          point.y,
          nodeIndex % 2 ? 'end' : 'start',
          (nodeIndex % 2 ? -12 : 12) * unit,
          -10 * unit,
          'story-node-label'
        ));
        overlay.appendChild(graphic);

        const button = document.createElement('button');
        button.type = 'button';
        button.className = `story-node-button ${stateClass}`;
        button.style.left = `${((point.x - bounds.x) / bounds.width) * 100}%`;
        button.style.top = `${((point.y - bounds.y) / bounds.height) * 100}%`;
        button.setAttribute('aria-label', nodeId === entityId ? `当前实体：${entityDisplayName(nodeEntity)}` : `沿关系探索${entityDisplayName(nodeEntity)}`);
        button.innerHTML = `<span>${escapeHtml(entityDisplayName(nodeEntity))}</span>`;
        if (nodeId === entityId) button.disabled = true;
        else {
          const relation = adjacent.get(nodeId) || relationForEntities(entityId, nodeId);
          button.addEventListener('click', () => navigateEntity(nodeId, relation?.id || null, { historyMode: 'push' }));
        }
        mapUiOverlay.appendChild(button);
      });
    }

    if (!networkEntity && !entityCoordinatesAt(entityId)) {
      const status = document.createElement('div');
      status.className = 'map-entity-status';
      status.textContent = `${entityDisplayName(entity)}没有单一坐标；地图保持上一空间状态`;
      mapUiOverlay.appendChild(status);
    }
    mapCaption.innerHTML = `
      <span class="map-note"><strong>${escapeHtml(entityDisplayName(entity))}</strong> · ${moment ? `${escapeHtml(moment.title)}；带“近似”的范围与路线均为教学叠加。` : `当前节点、相邻关系与已访问路径。${escapeHtml(story?.mapNote || '')}`}</span>
      <span class="map-credit">${worldStyle === 'satellite' ? '影像：Esri、Maxar 等' : '地形阴影：Esri · 海陆与水系：Natural Earth'}</span>
    `;
  }

  function renderKnowledgeStoryMap(story, chapterIndex) {
    const chapter = story.chapters[chapterIndex];
    const coreEntityId = curation.getLegacyChapterEntityId?.(chapter) || chapter.entityIds[0];
    renderEntityMap(coreEntityId, { fallbackView: chapter.view, legacyMode: true });
  }

  function renderStoryArticle(story, chapterIndex) {
    const chapter = story.chapters[chapterIndex];
    const statusLabel = knowledge.contentStatuses?.[chapter.contentStatus] || chapter.contentStatus;
    const sources = chapter.sourceIds.map(id => sourceCatalog.get(id)).filter(Boolean);
    const coreEntityId = curation.getLegacyChapterEntityId?.(chapter) || chapter.entityIds[0];
    const coreEntity = entityCatalog.get(coreEntityId);
    const copy = curation.getLegacyEntityCopy?.(coreEntityId, {
      question: chapter.title,
      explanation: chapter.introduction
    }) || {
      question: chapter.title,
      explanation: chapter.introduction
    };
    const nextRelations = explorationRelations(coreEntityId, { legacyMode: true });
    article.innerHTML = `
      <header class="story-header knowledge-story-header story-step-lead">
        <div class="eyebrow">当前问题 · ${escapeHtml(chapter.period)}</div>
        <h1 id="active-chapter-title" class="story-title" tabindex="-1">${escapeHtml(copy.question)}</h1>
        <p class="thesis">${escapeHtml(copy.explanation)}</p>
      </header>
      <section class="story-core-entity" aria-labelledby="story-core-entity-title">
        <div class="eyebrow">当前核心实体</div>
        <button type="button" data-entity-open="${escapeHtml(coreEntityId)}">
          <span>${escapeHtml(entityTypeLabels[coreEntity?.type] || coreEntity?.type || '')} · ${escapeHtml(formatYearRange(coreEntity || {}))}</span>
          <strong id="story-core-entity-title">${escapeHtml(entityDisplayName(coreEntity || coreEntityId))}</strong>
          <p>${escapeHtml(coreEntity?.shortDescription || chapter.introduction)}</p>
          <em>打开探索枢纽 →</em>
        </button>
      </section>
      <section class="next-relations story-next-relations" aria-labelledby="story-next-title">
        <div class="section-heading-row">
          <h2 id="story-next-title">接下来想知道什么？</h2>
          <span>选择一条关系</span>
        </div>
        <div class="relation-options">
          ${nextRelations.map(relation => renderRelationOption(relation, coreEntityId)).join('')}
        </div>
      </section>
      <details class="story-more">
        <summary>了解更多：证据、机制、案例与限制</summary>
        <div class="evidence-mechanism-grid">
          <section>
            <div class="eyebrow">可观察地理与证据</div>
            <ul>${chapter.observation.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
          </section>
          <section>
            <div class="eyebrow">历史机制推断</div>
            <ul>${chapter.mechanism.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
          </section>
        </div>
        <div class="chapter-cases">
          <span>历史案例</span>
          ${chapter.cases.map(item => `<strong>${escapeHtml(item)}</strong>`).join('')}
        </div>
        <div class="caveat"><strong>避免地理决定论</strong>${escapeHtml(chapter.caveat)}</div>
        <p class="story-status-note">内容状态：${escapeHtml(statusLabel)}。路线为近似教学叠加层，不代表固定疆界或单一路线。</p>
        <div class="sources">${sources.map(source => `<a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a>`).join('')}</div>
      </details>
      <nav class="chapter-switcher" aria-label="切换专题步骤">
        <label for="chapter-select">切换问题</label>
        <select id="chapter-select">
          ${story.chapters.map((item, index) => `
            <option value="${index}" ${index === chapterIndex ? 'selected' : ''}>${index + 1}. ${escapeHtml(item.title)}</option>
          `).join('')}
        </select>
        <div>
          <button type="button" data-chapter-direction="-1" ${chapterIndex === 0 ? 'disabled' : ''}>← 上一步</button>
          <span>${chapterIndex + 1} / ${story.chapters.length}</span>
          <button type="button" data-chapter-direction="1" ${chapterIndex === story.chapters.length - 1 ? 'disabled' : ''}>下一步 →</button>
        </div>
      </nav>
    `;

    bindEntityControls(article);
    article.querySelector('#chapter-select')?.addEventListener('change', event => {
      setKnowledgeStoryChapter(Number(event.target.value), { historyMode: 'push' });
    });
    article.querySelectorAll('[data-chapter-direction]').forEach(button => {
      button.addEventListener('click', () => {
        setKnowledgeStoryChapter(chapterIndex + Number(button.dataset.chapterDirection), { historyMode: 'push' });
      });
    });
  }

  function setKnowledgeStoryChapter(chapterIndex, { historyMode = 'push', focusHeading = true } = {}) {
    if (!activeKnowledgeStory) return;
    const nextIndex = Math.max(0, Math.min(activeKnowledgeStory.chapters.length - 1, chapterIndex));
    activeChapterIndex = nextIndex;
    activeEntityId = null;
    activeEntityYear = null;
    activeExplorationId = null;
    explorationPath = [];
    renderKnowledgeStoryMap(activeKnowledgeStory, activeChapterIndex);
    renderStoryArticle(activeKnowledgeStory, activeChapterIndex);
    renderTopNavigation(`story-${activeKnowledgeStory.id}`);
    const chapter = activeKnowledgeStory.chapters[activeChapterIndex];
    const coreEntityId = curation.getLegacyChapterEntityId?.(chapter) || chapter.entityIds[0];
    const copy = curation.getLegacyEntityCopy?.(
      coreEntityId,
      { question: chapter.title, explanation: chapter.introduction }
    ) || { question: chapter.title, explanation: chapter.introduction };
    renderMobileLead(copy.question, copy.explanation);
    updateRouteHash(`story-${activeKnowledgeStory.id}/${chapter.id}`, historyMode, { chapterIndex: activeChapterIndex });
    resetContentScroll({ focusSelector: focusHeading ? '#active-chapter-title' : '' });
  }

  function renderCivilizationStory(story, { historyMode = 'replace', chapterIndex = 0 } = {}) {
    activeStory = null;
    activeKnowledgeStory = story;
    activeEntityId = null;
    activeEntityYear = null;
    activeExplorationId = null;
    explorationPath = [];
    activeChapterIndex = Math.max(0, Math.min(story.chapters.length - 1, chapterIndex));
    setPageMode('story');
    setWorldMode(false);
    renderTopNavigation(`story-${story.id}`);
    renderKnowledgeStoryMap(story, activeChapterIndex);
    renderStoryArticle(story, activeChapterIndex);
    const chapter = story.chapters[activeChapterIndex];
    const coreEntityId = curation.getLegacyChapterEntityId?.(chapter) || chapter.entityIds[0];
    const copy = curation.getLegacyEntityCopy?.(
      coreEntityId,
      { question: chapter.title, explanation: chapter.introduction }
    ) || { question: chapter.title, explanation: chapter.introduction };
    renderMobileLead(copy.question, copy.explanation);
    updateRouteHash(`story-${story.id}/${chapter.id}`, historyMode, { chapterIndex: activeChapterIndex });
    resetContentScroll({ focusSelector: '#active-chapter-title' });
  }

  function renderEntityExplorer(entityId, {
    historyMode = 'replace',
    path = null,
    year = null,
    explorationId = undefined
  } = {}) {
    const entity = entityCatalog.get(entityId);
    if (!entity) return;
    closeEntityPreview({ updateTimeline: false });
    const networkEntity = activeNetworkEntity(entityId);
    const requestedExplorationId = explorationId === undefined
      ? activeExplorationId
      : explorationId;
    const exploration = getExploration(requestedExplorationId);
    activeStory = null;
    activeKnowledgeStory = networkEntity
      ? null
      : (knowledgeStories.find(story => (
        story.chapters.some(chapter => chapter.entityIds.includes(entityId))
      )) || knowledgeStories[0] || null);
    activeEntityId = entityId;
    activeExplorationId = exploration?.id || null;
    if (networkEntity) {
      const requestedYear = Number.isFinite(year) ? year : defaultEntityEntryYear(entityId);
      activeEntityYear = entityQueries.getNearestEntityMoment?.(entityId, requestedYear)?.cursorYear
        ?? networkEntity.moments[0]?.cursorYear
        ?? null;
    } else {
      activeEntityYear = null;
    }
    explorationPath = normalizedExplorationPath(path, entityId);
    setPageMode('entity');
    setWorldMode(false);
    renderTopNavigation(`entity-${entityId}`);
    renderEntityMap(entityId);
    renderEntityTimeline();
    renderEntityHubArticle(entityId);
    renderMobileEntityLead(entityId);
    updateRouteHash(
      networkEntity ? `entity-${entityId}/${activeEntityYear}` : `entity-${entityId}`,
      historyMode,
      {
      explorationPath,
      activeEntityYear,
      activeExplorationId
      }
    );
    resetContentScroll({ focusSelector: '#entity-hub-title' });
  }

  function renderOverview({ historyMode = 'replace' } = {}) {
    prepareWorldPage('map');
    const featuredExploration = explorations[0] || null;

    const mechanismOrder = ["核心区", "通道", "盆地", "屏障", "河流系统", "草原带", "海峡"];
    const extraMechanisms = stories
      .map(story => story.mechanism)
      .filter(mechanism => mechanism && !mechanismOrder.includes(mechanism));
    const directoryGroups = [...mechanismOrder, ...new Set(extraMechanisms)]
      .map(mechanism => ({
        mechanism,
        stories: stories.filter(story => story.mechanism === mechanism)
      }))
      .filter(group => group.stories.length);

    article.innerHTML = `
      <header class="story-header overview-header">
        <div class="eyebrow">MAP · 地理底座</div>
        <h1 class="story-title overview-title">从世界尺度进入地区</h1>
        <p class="thesis overview-intro">卫星影像与自然地理简图是所有文明关系的空间底座。选择一个核心区、通道或盆地，先理解可观察地理，再判断历史机制。</p>
      </header>
      <section id="region-directory" class="overview-directory">
        <div class="overview-directory-heading">
          <div class="eyebrow">策展目录</div>
          <h2>按地理机制进入</h2>
        </div>
        ${directoryGroups.map(group => `
          <section class="region-directory-group" aria-labelledby="directory-${group.mechanism}">
            <h3 id="directory-${group.mechanism}">${group.mechanism}</h3>
            <div class="region-directory-list">
              ${group.stories.map(story => `
                <a href="#${story.id}" data-story-link="${story.id}">
                  <strong>${story.shortTitle}</strong>
                  <span>${story.question || story.thesis}</span>
                </a>
              `).join('')}
            </div>
          </section>
        `).join('')}
      </section>
      ${featuredExploration ? `
        <aside class="map-story-bridge">
          <div><div class="eyebrow">从问题进入实体网络</div><strong>${escapeHtml(featuredExploration.question)}</strong></div>
          <a href="#exploration-${escapeHtml(featuredExploration.id)}" data-exploration-open="${escapeHtml(featuredExploration.id)}">开始探索 →</a>
        </aside>
      ` : ''}
      <p class="footer-note">世界底图是定位层，不是国家知识图或旅游地图。当前地区内容按核心区、通道与盆地等地理机制组织。</p>
    `;
    bindStoryLinks(article);
    bindRouteLinks(article);
    bindExplorationControls(article);
    updateRouteHash('map', historyMode);
    resetContentScroll({ focusSelector: '.story-title' });
  }

  function finishWorldDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    if (dragState.moved) suppressMarkerClickUntil = performance.now() + 220;
    dragState = null;
    mapFrame.classList.remove('is-dragging');
    if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
  }

  svg.addEventListener('click', () => {
    if (activeNetworkEntity(activeEntityId) && previewEntityId) closeEntityPreview();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && previewEntityId) {
      closeEntityPreview();
      event.preventDefault();
    }
  });

  svg.addEventListener('pointerdown', event => {
    if (!isWorldOverview || (event.pointerType === 'mouse' && event.button !== 0)) return;
    dragState = {
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
      distance: 0,
      moved: false
    };
  });

  svg.addEventListener('pointermove', event => {
    if (!isWorldOverview || !dragState || event.pointerId !== dragState.pointerId) return;
    const deltaX = event.clientX - dragState.lastX;
    const deltaY = event.clientY - dragState.lastY;
    const bounds = svg.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    dragState.lastX = event.clientX;
    dragState.lastY = event.clientY;
    dragState.distance += Math.hypot(deltaX, deltaY);
    if (!dragState.moved && dragState.distance > 4) {
      dragState.moved = true;
      svg.setPointerCapture(event.pointerId);
      mapFrame.classList.add('is-dragging');
    }
    if (!dragState.moved) return;
    worldCenterX = wrapWorldCenter(
      worldCenterX - deltaX * (worldOverview.viewWidth / bounds.width)
    );
    worldCenterY = clampWorldCenterY(
      worldCenterY - deltaY * (worldOverview.viewHeight / bounds.height)
    );
    updateWorldViewBox();
  });

  svg.addEventListener('pointerup', finishWorldDrag);
  svg.addEventListener('pointercancel', finishWorldDrag);

  svg.addEventListener('wheel', event => {
    if (!isWorldOverview || (!event.ctrlKey && !event.metaKey)) return;
    event.preventDefault();
    zoomWorld(event.deltaY > 0 ? -1 : 1);
  }, { passive: false });

  svg.addEventListener('keydown', event => {
    if (!isWorldOverview) return;
    const step = worldOverview.viewWidth * 0.08;
    const verticalStep = worldOverview.viewHeight * 0.08;
    if (event.key === 'ArrowLeft') worldCenterX = wrapWorldCenter(worldCenterX - step);
    else if (event.key === 'ArrowRight') worldCenterX = wrapWorldCenter(worldCenterX + step);
    else if (event.key === 'ArrowUp') worldCenterY = clampWorldCenterY(worldCenterY - verticalStep);
    else if (event.key === 'ArrowDown') worldCenterY = clampWorldCenterY(worldCenterY + verticalStep);
    else if (event.key === '+' || event.key === '=') {
      zoomWorld(1);
      event.preventDefault();
      return;
    } else if (event.key === '-' || event.key === '_') {
      zoomWorld(-1);
      event.preventDefault();
      return;
    } else if (event.key === 'Home') {
      resetWorldPosition();
      event.preventDefault();
      return;
    } else return;
    updateWorldViewBox();
    event.preventDefault();
  });

  resetWorldMap.addEventListener('click', () => resetWorldPosition(true));
  zoomWorldOut.addEventListener('click', () => zoomWorld(-1));
  zoomWorldIn.addEventListener('click', () => zoomWorld(1));
  worldStyleButtons.forEach(button => {
    button.addEventListener('click', () => switchWorldStyle(button.dataset.worldStyle));
  });

  function renderRouteFromLocation(event = null) {
    const route = location.hash.slice(1);
    if (stories.some(story => story.id === route)) {
      selectStory(route, { historyMode: 'none' });
      return;
    }
    if (route.startsWith('story-')) {
      const [storyId, chapterId] = route.slice(6).split('/');
      if (getExploration(storyId)) {
        openExploration(storyId, { historyMode: 'replace' });
        return;
      }
      const story = knowledgeStories.find(item => item.id === storyId);
      if (story) {
        const chapterIndex = chapterId
          ? Math.max(0, story.chapters.findIndex(chapter => chapter.id === chapterId))
          : Math.max(0, Number(event?.state?.chapterIndex) || 0);
        renderCivilizationStory(story, { historyMode: 'none', chapterIndex });
        return;
      }
    }
    if (route.startsWith('exploration-')) {
      const explorationId = route.slice(12);
      if (getExploration(explorationId)) {
        openExploration(explorationId, { historyMode: 'replace' });
        return;
      }
    }
    if (getExploration(route)) {
      openExploration(route, { historyMode: 'replace' });
      return;
    }
    if (knowledgeStories.some(story => story.id === route)) {
      const story = knowledgeStories.find(item => item.id === route);
      renderCivilizationStory(story, { historyMode: 'none' });
      return;
    }
    if (route.startsWith('entity-')) {
      const [entityId, routeYear] = route.slice(7).split('/');
      const entity = entityCatalog.get(entityId);
      if (entity) {
        renderEntityExplorer(entityId, {
          historyMode: 'none',
          path: event?.state?.explorationPath || [{ entityId, relationId: null }],
          year: Number.isFinite(event?.state?.activeEntityYear)
            ? event.state.activeEntityYear
            : (routeYear === undefined ? undefined : Number(routeYear)),
          explorationId: event?.state && Object.prototype.hasOwnProperty.call(event.state, 'activeExplorationId')
            ? event.state.activeExplorationId
            : null
        });
        return;
      }
    }
    const sectionRoute = route.match(/^(geography|mechanism|history)-(.+)$/);
    if (sectionRoute && stories.some(story => story.id === sectionRoute[2])) {
      selectStory(sectionRoute[2], { historyMode: 'none' });
      requestAnimationFrame(() => {
        document.getElementById(route)?.scrollIntoView({ block: 'start' });
      });
      return;
    }
    if (!route || route === 'home') {
      renderHome({ historyMode: 'none' });
      return;
    }
    if (route === 'explorations') {
      renderExplorationsIndex({ historyMode: 'none' });
      return;
    }
    if (route === 'stories') {
      renderExplorationsIndex({ historyMode: 'replace' });
      return;
    }
    if (route === 'map' || route === 'overview' || route === 'region-directory') {
      renderOverview({ historyMode: 'none' });
      if (route === 'region-directory') scrollToRegionDirectory();
      return;
    }
    renderHome({ historyMode: 'none' });
  }

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.addEventListener('popstate', renderRouteFromLocation);
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      if (isWorldOverview) {
        renderWorldBase();
        renderWorldMarkers();
        updateWorldViewBox();
      } else if (activeEntityId) {
        renderEntityMap(activeEntityId);
      } else if (activeKnowledgeStory) {
        renderKnowledgeStoryMap(activeKnowledgeStory, activeChapterIndex);
      } else if (activeStory) {
        overlay.innerHTML = '';
        updateRegionLabelScale(activeStory);
        activeStory.features.forEach(feature => renderFeature(feature, activeStory));
      }
    });
  });

  bindRouteLinks(document.querySelector('.site-nav'));
  renderRouteFromLocation();
})();
