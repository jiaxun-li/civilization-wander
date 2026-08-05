const test = require('node:test');
const assert = require('node:assert/strict');
const { createElement } = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const { HomeView } = require('../../src/home/home-view.ts');
const { SiteHeader } = require('../../src/shell/site-header.ts');
const { StoryNavigation } = require('../../src/shell/story-navigation.ts');
const { NavigationPreview } = require('../../src/reader/navigation-preview.ts');
const { MediaCaption } = require('../../src/media/media-caption.ts');
const { CardHeader } = require('../../src/reader/card-header.ts');

test('React home markup keeps stable navigation attributes and escapes content', () => {
  const markup = renderToStaticMarkup(createElement(HomeView, {
    primaryAction: {
      cardId: 'card-primary',
      href: '#card/card-primary/scene-primary',
      label: '继续<script>'
    },
    featuredActions: [],
    sections: [{
      eyebrow: '文明',
      title: '从这里开始',
      cards: [{
        cardId: 'card-one',
        href: '#card/card-one/scene-one',
        entityType: '文本',
        entityName: '<em>实体</em>',
        summary: '摘要 & 关系',
        cardTitle: '故事标题'
      }]
    }],
    onOpenCard() {}
  }));

  assert.match(markup, /data-home-primary-action=""/);
  assert.match(markup, /data-start-card="card-primary"/);
  assert.match(markup, /data-start-card="card-one"/);
  assert.match(markup, /继续&lt;script&gt;/);
  assert.match(markup, /&lt;em&gt;实体&lt;\/em&gt;/);
  assert.match(markup, /摘要 &amp; 关系/);
  assert.doesNotMatch(markup, /<script>|<em>实体<\/em>/);
});

test('React site header preserves the enhanced home-link contract', () => {
  const markup = renderToStaticMarkup(createElement(SiteHeader, {
    brand: {
      name: '文明漫游',
      tagline: '完整标语',
      shortTagline: '短标语',
      startCardId: 'card-one'
    },
    onGoHome() {}
  }));

  assert.match(markup, /class="site-brand"/);
  assert.match(markup, /href="#home"/);
  assert.match(markup, /data-home-link=""/);
  assert.match(markup, /aria-label="文明漫游首页"/);
});

test('React story navigation exposes back mode and hides short trails', () => {
  const homeMarkup = renderToStaticMarkup(createElement(StoryNavigation, {
    visible: true,
    returnsToStory: false,
    trailNames: ['苏美尔文明'],
    onBack() {}
  }));
  const storyMarkup = renderToStaticMarkup(createElement(StoryNavigation, {
    visible: true,
    returnsToStory: true,
    trailNames: ['苏美尔文明', '阿卡德王朝'],
    onBack() {}
  }));

  assert.match(homeMarkup, /data-back-mode="home"/);
  assert.match(homeMarkup, /aria-label="返回首页"/);
  assert.match(homeMarkup, /data-story-trail="" hidden=""/);
  assert.match(storyMarkup, /data-back-mode="story"/);
  assert.match(storyMarkup, /苏美尔文明 → 阿卡德王朝/);
  assert.doesNotMatch(storyMarkup, /data-story-trail="" hidden=""/);
});

test('React navigation preview preserves tooltip semantics and escapes prose', () => {
  const markup = renderToStaticMarkup(createElement(NavigationPreview, {
    navigationId: 'nav-one',
    eyebrow: '政治实体',
    name: '目标 <城>',
    relation: '通向',
    summary: '关系 & 摘要',
    cardTitle: '目标故事'
  }));

  assert.match(markup, /role="tooltip"/);
  assert.match(markup, /data-preview-card="nav-one"/);
  assert.match(markup, /目标 &lt;城&gt;/);
  assert.match(markup, /关系 &amp; 摘要/);
});

test('React media caption renders text without interpreting markup', () => {
  const markup = renderToStaticMarkup(createElement(MediaCaption, { text: '<img src=x>' }));
  assert.equal(markup, '&lt;img src=x&gt;');
});

test('React Card header preserves its semantic structure and escaping', () => {
  const markup = renderToStaticMarkup(createElement(CardHeader, {
    coordinate: '实体 · 公元前3000年',
    title: '故事 <标题>',
    introduction: '导语 & 说明'
  }));

  assert.match(markup, /class="v4-main-card__coordinate"/);
  assert.match(markup, /<h1 tabindex="-1">故事 &lt;标题&gt;<\/h1>/);
  assert.match(markup, /class="v4-main-card__introduction"/);
  assert.match(markup, /导语 &amp; 说明/);
});
