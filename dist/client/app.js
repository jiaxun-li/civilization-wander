(() => {
  const TILE_SIZE = 256;
  const stories = window.ATLAS_STORIES || [];
  const tabs = document.getElementById('story-tabs');
  const svg = document.getElementById('atlas-map');
  const mapFrame = document.querySelector('.map-frame');
  const tileLayer = document.getElementById('tile-layer');
  const overlay = document.getElementById('map-overlay');
  const mapCaption = document.getElementById('map-caption');
  const article = document.getElementById('story-content');
  const worldMapTools = document.getElementById('world-map-tools');
  const resetWorldMap = document.getElementById('reset-world-map');

  let activeZoom = 5;
  let isWorldOverview = false;
  let worldCenterX = 0;
  let dragState = null;
  let suppressMarkerClickUntil = 0;

  const worldOverview = {
    zoom: 2,
    viewWidth: 820,
    viewHeight: 560,
    centerLon: 105
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

  function renderTiles(view, zoom) {
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
          href: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${tileY}/${tileX}`,
          x: tileX * TILE_SIZE - 0.5,
          y: tileY * TILE_SIZE - 0.5,
          width: TILE_SIZE + 1,
          height: TILE_SIZE + 1
        }));
      }
    }
  }

  function renderWorldTiles() {
    tileLayer.innerHTML = '';
    const zoom = worldOverview.zoom;
    const tileCount = 2 ** zoom;
    const worldSize = TILE_SIZE * tileCount;
    const yTop = (worldSize - worldOverview.viewHeight) / 2;
    const yBottom = yTop + worldOverview.viewHeight;
    const yMin = Math.max(0, Math.floor(yTop / TILE_SIZE));
    const yMax = Math.min(tileCount - 1, Math.floor(yBottom / TILE_SIZE));

    for (let tileY = yMin; tileY <= yMax; tileY += 1) {
      for (let tileX = 0; tileX < tileCount * 3; tileX += 1) {
        tileLayer.appendChild(svgEl('image', {
          href: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${tileY}/${tileX % tileCount}`,
          x: tileX * TILE_SIZE - 0.5,
          y: tileY * TILE_SIZE - 0.5,
          width: TILE_SIZE + 1,
          height: TILE_SIZE + 1
        }));
      }
    }
  }

  function label(text, x, y, anchor = 'start', dx = 0, dy = 0) {
    const t = svgEl('text', { x, y, class: 'feature-label', 'text-anchor': anchor });
    if (dx) t.setAttribute('dx', dx);
    if (dy) t.setAttribute('dy', dy);
    t.textContent = text;
    return t;
  }

  function renderFeature(feature) {
    if (feature.type === 'area') {
      const p = xy(feature.lon, feature.lat);
      overlay.appendChild(label(feature.label, p.x, p.y, feature.anchor || 'middle', feature.dx, feature.dy));
      return;
    }

    if (['ridge', 'river', 'corridor'].includes(feature.type)) {
      if (feature.type === 'corridor') return;
      const pts = feature.points.map(([lon, lat]) => xy(lon, lat));
      const mid = pts[Math.floor(pts.length / 2)];
      overlay.appendChild(label(feature.label, mid.x, mid.y, feature.anchor || 'middle', feature.dx, feature.dy));
      return;
    }

    const p = xy(feature.lon, feature.lat);
    const className = feature.type === 'gate' ? 'feature-gate' : 'feature-place';
    const radius = activeZoom >= 8 ? (feature.type === 'gate' ? 16 : 13) : (feature.type === 'gate' ? 5 : 4);
    overlay.appendChild(svgEl('circle', { cx: p.x, cy: p.y, r: radius, class: className }));
    const labelOffset = activeZoom >= 8 ? 22 : 6;
    overlay.appendChild(label(feature.label, p.x + labelOffset, p.y - labelOffset * 0.7, feature.anchor || 'start', feature.dx, feature.dy));
  }

  function renderArticle(story) {
    const sections = story.sections.map(section => `
      <section class="section">
        <h2>${section.heading}</h2>
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
      ${sections}
      <section class="section timeline-section">
        <div class="section-heading-row">
          <h2>重大历史事件年表</h2>
          <span>${story.timeline.length} 个关键转折</span>
        </div>
        <p class="timeline-intro">${story.timelineNote}</p>
        <ol class="timeline">${timeline}</ol>
      </section>
      <section class="section">
        <h2>总结</h2>
        <div class="takeaway">${story.takeaway}</div>
      </section>
      <section class="section">
        <h2>避免地理决定论</h2>
        <div class="caveat">${story.caveat}</div>
      </section>
      <section class="section">
        <h2>参考来源</h2>
        <div class="sources">
          ${story.sources.map(source => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.title}</a>`).join('')}
        </div>
      </section>
      <p class="footer-note">这是内容验证版，不是最终学术结论。下一版应逐条增加脚注、史料争议和不同学者解释。</p>
    `;
  }

  function setWorldMode(enabled) {
    isWorldOverview = enabled;
    mapFrame.classList.toggle('is-world', enabled);
    worldMapTools.hidden = !enabled;
    svg.setAttribute('role', enabled ? 'group' : 'img');
    svg.setAttribute('tabindex', enabled ? '0' : '-1');
    svg.setAttribute(
      'aria-label',
      enabled
        ? '可循环横向拖动的世界平面地图。上下方向固定，红色节点标出当前可进入的历史地理区域。'
        : '区域卫星影像地图与历史地理教学标注'
    );
  }

  function selectStory(id) {
    const story = stories.find(item => item.id === id) || stories[0];
    if (!story) return;

    setWorldMode(false);
    tabs.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-selected', String(button.dataset.story === story.id));
    });

    activeZoom = story.tileZoom || 8;
    overlay.style.setProperty('--map-label-size', activeZoom >= 8 ? '28px' : '12px');
    overlay.style.setProperty('--map-label-stroke', activeZoom >= 8 ? '7px' : '3px');
    overlay.innerHTML = '';
    renderTiles(story.view, activeZoom);
    const box = viewBox(story.view);
    const [, , width, height] = box.split(' ').map(Number);
    mapFrame.style.aspectRatio = String(width / height);
    story.features.forEach(renderFeature);
    svg.setAttribute('viewBox', box);
    mapCaption.innerHTML = `${story.mapNote} <span class="map-credit">影像：Esri、Maxar、Earthstar Geographics、GIS User Community</span>`;
    renderArticle(story);
    history.replaceState(null, '', `#${story.id}`);
  }

  function wrapWorldCenter(value) {
    const worldSize = TILE_SIZE * (2 ** worldOverview.zoom);
    let wrapped = value;
    while (wrapped < worldSize) wrapped += worldSize;
    while (wrapped >= worldSize * 2) wrapped -= worldSize;
    return wrapped;
  }

  function updateWorldViewBox() {
    const worldSize = TILE_SIZE * (2 ** worldOverview.zoom);
    const x = worldCenterX - worldOverview.viewWidth / 2;
    const y = (worldSize - worldOverview.viewHeight) / 2;
    svg.setAttribute(
      'viewBox',
      `${x} ${y} ${worldOverview.viewWidth} ${worldOverview.viewHeight}`
    );
  }

  function resetWorldPosition(focusMap = false) {
    const worldSize = TILE_SIZE * (2 ** worldOverview.zoom);
    worldCenterX = xy(worldOverview.centerLon, 0, worldOverview.zoom).x + worldSize;
    updateWorldViewBox();
    if (focusMap) svg.focus({ preventScroll: true });
  }

  function renderWorldMarker(story, copyIndex) {
    const worldSize = TILE_SIZE * (2 ** worldOverview.zoom);
    const center = xy(
      (story.view.lonMin + story.view.lonMax) / 2,
      (story.view.latMin + story.view.latMax) / 2,
      worldOverview.zoom
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

  function renderOverview() {
    activeZoom = worldOverview.zoom;
    setWorldMode(true);
    overlay.style.setProperty('--map-label-size', '15px');
    overlay.style.setProperty('--map-label-stroke', '4px');
    tabs.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-selected', String(button.dataset.story === 'overview'));
    });
    overlay.innerHTML = '';
    renderWorldTiles();
    mapFrame.style.aspectRatio = String(worldOverview.viewWidth / worldOverview.viewHeight);
    stories.forEach(story => {
      [0, 1, 2].forEach(copyIndex => renderWorldMarker(story, copyIndex));
    });
    resetWorldPosition();

    mapCaption.innerHTML = 'Web Mercator 平面投影；拖动只改变经度，世界地图可水平循环。红点为近似教学定位，不表示精确边界。<span class="map-credit">影像：Esri、Maxar、Earthstar Geographics、GIS User Community</span>';
    article.innerHTML = `
      <div class="eyebrow">山河与历史 · 世界总览</div>
      <h1 class="story-title">从世界尺度进入</h1>
      <p class="thesis">横向拖动平面世界图，在全球尺度上定位区域；再进入当地，区分可观察的地理事实、机制推论、历史实例与限制。</p>
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
    const mapWidth = svg.getBoundingClientRect().width;
    if (!mapWidth) return;
    dragState.lastX = event.clientX;
    dragState.distance += Math.abs(deltaX);
    dragState.moved = dragState.distance > 4;
    worldCenterX = wrapWorldCenter(
      worldCenterX - deltaX * (worldOverview.viewWidth / mapWidth)
    );
    updateWorldViewBox();
  });

  svg.addEventListener('pointerup', finishWorldDrag);
  svg.addEventListener('pointercancel', finishWorldDrag);

  svg.addEventListener('wheel', event => {
    if (!isWorldOverview) return;
    const horizontalDelta = event.shiftKey ? event.deltaY : event.deltaX;
    if (!event.shiftKey && Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    const mapWidth = svg.getBoundingClientRect().width;
    if (!mapWidth) return;
    worldCenterX = wrapWorldCenter(
      worldCenterX + horizontalDelta * (worldOverview.viewWidth / mapWidth)
    );
    updateWorldViewBox();
  }, { passive: false });

  svg.addEventListener('keydown', event => {
    if (!isWorldOverview) return;
    const step = worldOverview.viewWidth * 0.08;
    if (event.key === 'ArrowLeft') worldCenterX = wrapWorldCenter(worldCenterX - step);
    else if (event.key === 'ArrowRight') worldCenterX = wrapWorldCenter(worldCenterX + step);
    else if (event.key === 'Home') {
      resetWorldPosition();
      event.preventDefault();
      return;
    } else return;
    updateWorldViewBox();
    event.preventDefault();
  });

  resetWorldMap.addEventListener('click', () => resetWorldPosition(true));

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
