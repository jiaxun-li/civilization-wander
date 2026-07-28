(() => {
  const TILE_SIZE = 256;
  const stories = window.ATLAS_STORIES || [];
  const tabs = document.getElementById('story-tabs');
  const svg = document.getElementById('atlas-map');
  const mapFrame = document.querySelector('.map-frame');
  const tileLayer = document.getElementById('tile-layer');
  const vectorLayer = document.getElementById('vector-layer');
  const overlay = document.getElementById('map-overlay');
  const mapCaption = document.getElementById('map-caption');
  const article = document.getElementById('story-content');
  const worldMapTools = document.getElementById('world-map-tools');
  const mapViewActions = document.getElementById('map-view-actions');
  const resetWorldMap = document.getElementById('reset-world-map');
  const zoomWorldOut = document.getElementById('zoom-world-out');
  const zoomWorldIn = document.getElementById('zoom-world-in');
  const worldZoomLevel = document.getElementById('world-zoom-level');
  const worldStyleButtons = worldMapTools.querySelectorAll('[data-world-style]');
  const worldVector = window.ATLAS_WORLD_VECTOR || {};
  const regionHydro = window.ATLAS_REGION_HYDRO || {};
  const TILE_SERVICES = {
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile',
    vector: 'https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile'
  };

  let activeZoom = 5;
  let isWorldOverview = false;
  let activeStory = null;
  let worldCenterX = 0;
  let worldCenterY = 0;
  let worldZoom = 2;
  let worldStyle = 'satellite';
  let worldTileKey = '';
  let dragState = null;
  let suppressMarkerClickUntil = 0;

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

  function viewBox(view) {
    const topLeft = xy(view.lonMin, view.latMax);
    const bottomRight = xy(view.lonMax, view.latMin);
    return `${topLeft.x} ${topLeft.y} ${bottomRight.x - topLeft.x} ${bottomRight.y - topLeft.y}`;
  }

  function svgEl(name, attrs = {}) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  function renderTiles(view, zoom, style = 'satellite') {
    tileLayer.innerHTML = '';
    const topLeft = xy(view.lonMin, view.latMax, zoom);
    const bottomRight = xy(view.lonMax, view.latMin, zoom);
    const xMin = Math.floor(topLeft.x / TILE_SIZE);
    const xMax = Math.floor(bottomRight.x / TILE_SIZE);
    const yMin = Math.floor(topLeft.y / TILE_SIZE);
    const yMax = Math.floor(bottomRight.y / TILE_SIZE);
    for (let tileY = yMin; tileY <= yMax; tileY += 1) {
      for (let tileX = xMin; tileX <= xMax; tileX += 1) {
        tileLayer.appendChild(svgEl('image', {
          href: `${TILE_SERVICES[style]}/${zoom}/${tileY}/${tileX}`,
          x: tileX * TILE_SIZE - 0.5,
          y: tileY * TILE_SIZE - 0.5,
          width: TILE_SIZE + 1,
          height: TILE_SIZE + 1,
          class: style === 'vector' ? 'hillshade-tile' : 'satellite-tile'
        }));
      }
    }
  }

  function renderWorldTiles() {
    const zoom = worldZoom;
    const tileCount = 2 ** worldZoom;
    const worldSize = TILE_SIZE * tileCount;
    const xLeft = worldCenterX - worldOverview.viewWidth / 2;
    const xRight = worldCenterX + worldOverview.viewWidth / 2;
    const yTop = worldViewportTop();
    const yBottom = yTop + worldOverview.viewHeight;
    const xMin = Math.floor(xLeft / TILE_SIZE) - 1;
    const xMax = Math.floor(xRight / TILE_SIZE) + 1;
    const yMin = Math.max(0, Math.floor(yTop / TILE_SIZE));
    const yMax = Math.min(tileCount - 1, Math.floor(yBottom / TILE_SIZE));
    const nextTileKey = `${worldStyle}/${zoom}/${xMin}/${xMax}/${yMin}/${yMax}`;
    if (nextTileKey === worldTileKey) return;

    worldTileKey = nextTileKey;
    tileLayer.innerHTML = '';
    for (let tileY = yMin; tileY <= yMax; tileY += 1) {
      for (let tileX = xMin; tileX <= xMax; tileX += 1) {
        const sourceX = ((tileX % tileCount) + tileCount) % tileCount;
        tileLayer.appendChild(svgEl('image', {
          href: `${TILE_SERVICES[worldStyle]}/${zoom}/${tileY}/${sourceX}`,
          x: tileX * TILE_SIZE - 0.5,
          y: tileY * TILE_SIZE - 0.5,
          width: TILE_SIZE + 1,
          height: TILE_SIZE + 1,
          class: worldStyle === 'vector' ? 'hillshade-tile' : 'satellite-tile'
        }));
      }
    }
  }

  function worldViewportTop() {
    return clampWorldCenterY(worldCenterY) - worldOverview.viewHeight / 2;
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

    const labelRankLimit = Math.max(1, worldZoom - 3);
    for (let copyIndex = 0; copyIndex < 3; copyIndex += 1) {
      (worldVector.terrain || [])
        .filter(feature => feature.name && feature.rank <= labelRankLimit)
        .forEach(feature => {
          const point = xy(feature.label[0], feature.label[1], worldZoom);
          vectorLayer.appendChild(label(
            feature.name,
            point.x + copyIndex * worldSize,
            point.y,
            'middle',
            0,
            0,
            'vector-physical-label vector-terrain-label'
          ));
        });
      (worldVector.rivers || [])
        .filter(feature => feature.name && feature.minLabel <= worldZoom)
        .forEach(feature => {
          const point = xy(feature.label[0], feature.label[1], worldZoom);
          vectorLayer.appendChild(label(
            feature.name,
            point.x + copyIndex * worldSize,
            point.y,
            'middle',
            0,
            -6,
            'vector-physical-label vector-river-label'
          ));
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

  function renderFeature(feature) {
    let point = null;
    if (feature.type === 'area') {
      point = xy(feature.lon, feature.lat);
    }

    if (['ridge', 'river'].includes(feature.type)) {
      const pts = feature.points.map(([lon, lat]) => xy(lon, lat));
      point = pts[Math.floor(pts.length / 2)];
    }

    if (point) {
      overlay.appendChild(label(
        feature.label,
        point.x,
        point.y,
        feature.anchor || 'middle',
        feature.dx,
        feature.dy,
        `feature-label feature-label--${feature.type}`
      ));
    }
  }

  function renderArticle(story) {
    const geographyHistory = story.sections.slice(1).map(section => `
      <section class="mechanism-subsection">
        <h3>${section.heading}</h3>
        ${section.body.map(paragraph => `<p>${paragraph}</p>`).join('')}
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
      <div class="eyebrow">${story.eyebrow}</div>
      <h1 class="story-title">${story.title}</h1>
      <p class="thesis">${story.thesis}</p>
      <div class="meta-row">
        <span class="badge">解释信心：${story.confidence}</span>
        <span class="badge">内容状态：人工策展初稿</span>
      </div>
      <nav class="article-section-nav" aria-label="${story.title}内容分区">
        <a href="#geography-${story.id}"><span>01</span>地理</a>
        <a href="#mechanism-${story.id}"><span>02</span>地理与历史</a>
        <a href="#history-${story.id}"><span>03</span>历史</a>
      </nav>
      <section id="geography-${story.id}" class="article-zone geography-zone">
        <div class="article-zone-heading">
          <span>01</span>
          <h2>地理</h2>
        </div>
        <div class="geography-grid">
          <article>
            <h3>地形</h3>
            <p>${story.geography.topography}</p>
          </article>
          <article>
            <h3>地质</h3>
            <p>${story.geography.geology}</p>
          </article>
          <article>
            <h3>气候</h3>
            <p>${story.geography.climate}</p>
          </article>
        </div>
        <a class="zone-source" href="${story.geography.sourceUrl}" target="_blank" rel="noreferrer">地理摘要来源：${story.geography.sourceTitle}</a>
      </section>
      <section id="mechanism-${story.id}" class="article-zone mechanism-zone">
        <div class="article-zone-heading">
          <span>02</span>
          <h2>地理与历史</h2>
        </div>
        ${geographyHistory}
        <div class="takeaway">${story.takeaway}</div>
        <div class="caveat">
          <strong>避免地理决定论</strong>
          ${story.caveat}
        </div>
        <details class="source-details">
          <summary>本节参考来源</summary>
          <div class="sources">
            ${story.sources.map(source => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.title}</a>`).join('')}
          </div>
        </details>
      </section>
      <section id="history-${story.id}" class="article-zone timeline-section">
        <div class="article-zone-heading">
          <span>03</span>
          <h2>历史</h2>
        </div>
        <div class="section-heading-row">
          <h2>重大历史事件年表</h2>
          <span>${story.timeline.length} 个关键转折</span>
        </div>
        <p class="timeline-intro">${story.timelineNote}</p>
        <ol class="timeline">${timeline}</ol>
      </section>
      <p class="footer-note">这是内容验证版，不是最终学术结论。下一版应逐条增加脚注、史料争议和不同学者解释。</p>
    `;
  }

  function setWorldMode(enabled) {
    isWorldOverview = enabled;
    mapFrame.classList.toggle('is-world', enabled);
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
      ? '<span class="map-credit">影像：Esri、Maxar、Earthstar Geographics、GIS User Community</span>'
      : '<span class="map-credit">地形阴影：Esri World Hillshade；海陆与水系：Natural Earth 1:50m</span>';
    const vectorCaveat = worldStyle === 'vector'
      ? '简图只呈现自然地形与水系，不含历史或现代疆界。'
      : '';
    mapCaption.innerHTML = `Web Mercator · 1×—16× · 拖动平移 · Ctrl/Command + 滚轮缩放 · 东西循环。${vectorCaveat}红点为近似定位。${source}`;
  }

  function renderWorldBase() {
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
      ? '<span class="map-credit">影像：Esri、Maxar、Earthstar Geographics、GIS User Community</span>'
      : '<span class="map-credit">地形阴影：Esri；水系：Natural Earth 与 <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a></span>';
    const note = worldStyle === 'vector'
      ? '山名定位于地形阴影，河名对应真实水系数据；不绘制教学椭圆、山形线或近似河线。'
      : story.mapNote;
    mapCaption.innerHTML = `${note} ${source}`;
  }

  function renderRegionBase(story) {
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

  function selectStory(id) {
    const story = stories.find(item => item.id === id) || stories[0];
    if (!story) return;

    activeStory = story;
    setWorldMode(false);
    tabs.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-selected', String(button.dataset.story === story.id));
    });

    activeZoom = story.tileZoom || 8;
    overlay.style.setProperty('--map-label-size', activeZoom >= 8 ? '28px' : '12px');
    overlay.style.setProperty('--map-label-stroke', activeZoom >= 8 ? '7px' : '3px');
    overlay.innerHTML = '';
    const box = viewBox(story.view);
    const [, , width, height] = box.split(' ').map(Number);
    mapFrame.style.aspectRatio = String(width / height);
    svg.setAttribute('viewBox', box);
    renderRegionBase(story);
    story.features.forEach(renderFeature);
    renderArticle(story);
    history.replaceState(null, '', `#${story.id}`);
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
    updateWorldViewBox();
    if (focusMap) svg.focus({ preventScroll: true });
  }

  function renderWorldMarker(story, copyIndex) {
    const worldSize = TILE_SIZE * (2 ** worldZoom);
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
    const group = svgEl('g', {
      class: 'overview-marker',
      role: 'button',
      tabindex: copyIndex === 1 ? '0' : '-1',
      'aria-label': `进入${story.shortTitle}`
    });
    group.appendChild(svgEl('circle', { cx: x, cy: center.y, r: 8 }));
    group.appendChild(label(
      story.shortTitle,
      x + offset.dx,
      center.y + offset.dy,
      offset.anchor
    ));
    group.addEventListener('click', () => {
      if (performance.now() >= suppressMarkerClickUntil) selectStory(story.id);
    });
    group.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectStory(story.id);
      }
    });
    overlay.appendChild(group);
  }

  function renderWorldMarkers() {
    overlay.innerHTML = '';
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
      updateWorldViewBox();
    } else if (activeStory) {
      renderRegionBase(activeStory);
    }
  }

  function renderOverview() {
    activeStory = null;
    activeZoom = worldZoom;
    setWorldMode(true);
    overlay.style.setProperty('--map-label-size', '15px');
    overlay.style.setProperty('--map-label-stroke', '4px');
    tabs.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-selected', String(button.dataset.story === 'overview'));
    });
    mapFrame.style.aspectRatio = String(worldOverview.viewWidth / worldOverview.viewHeight);
    renderWorldMarkers();
    resetWorldPosition();

    article.innerHTML = `
      <div class="eyebrow">山河与历史 · 世界总览</div>
      <h1 class="story-title">从世界尺度进入</h1>
      <p class="thesis">在卫星影像与山川纹理地理简图之间切换；地图可放大至16倍并拖动浏览，再进入区域理解地理机制与历史实例。</p>
      <section class="section">
        <h2>当前策展区域</h2>
        <div class="overview-list">
          ${stories.map(story => `
            <button type="button" data-overview-story="${story.id}">
              <strong>${story.shortTitle}</strong>
              <span>${story.thesis}</span>
            </button>
          `).join('')}
        </div>
      </section>
      <p class="footer-note">世界底图是定位层，不是国家知识图或旅游地图。当前先用三个中国区域验证二级交互；未来新增内容仍将按核心区、通道、盆地、屏障、河流系统、草原带与海峡等地理机制组织。</p>
    `;
    article.querySelectorAll('[data-overview-story]').forEach(button => {
      button.addEventListener('click', () => selectStory(button.dataset.overviewStory));
    });
    history.replaceState(null, '', location.pathname);
  }

  function finishWorldDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    if (dragState.moved) suppressMarkerClickUntil = performance.now() + 220;
    dragState = null;
    mapFrame.classList.remove('is-dragging');
    if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
  }

  svg.addEventListener('pointerdown', event => {
    if (!isWorldOverview || (event.pointerType === 'mouse' && event.button !== 0)) return;
    dragState = {
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
      distance: 0,
      moved: false
    };
    svg.setPointerCapture(event.pointerId);
    mapFrame.classList.add('is-dragging');
    if (event.pointerType === 'mouse') event.preventDefault();
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
    dragState.moved = dragState.distance > 4;
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

  [{ id: 'overview', shortTitle: '总览' }, ...stories].forEach((story, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'story-tab';
    button.dataset.story = story.id;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    button.textContent = story.shortTitle || story.title;
    button.addEventListener('click', () => story.id === 'overview' ? renderOverview() : selectStory(story.id));
    tabs.appendChild(button);
  });

  const initial = location.hash.slice(1);
  if (stories.some(story => story.id === initial)) selectStory(initial);
  else renderOverview();
})();
