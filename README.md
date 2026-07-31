# 文明漫游 V3

这是一个依赖为零、可以直接通过 `file://` 或 GitHub Pages 打开的静态文明知识网络原型。

> 从一个人物、城市、信仰或作品出发，沿着经过策展的关联漫游人类文明。

V3 不再把地图或时间轴当作主要操作面板。产品只有两个核心动作：

1. 向下滚动，连续阅读当前 Card 的 Scenes；Scene 激活时，地图和结构视图自动更新。
2. 点击正文、地图节点或推荐小卡片，统一通过 NavigationOption 进入下一张 Card。

滚动不会自动换页；点击才进入下一张 Card。浏览器返回会恢复上一张 Card 的 Scene 和滚动位置。

## 当前迁移范围

完整 V3 示例：

- 佛教：概览 Card 与“传播网络”facet Card；
- 释迦牟尼：历史人物与传统记忆；
- 阿育王：敕令、道德治理与佛教支持；
- 孔雀帝国：政治尺度、行政组成与多元宗教环境。

支持性示例：

- 孔雀帝国行政网络：Composition；
- 印欧语系 → 印度—伊朗语支：只展开直接一级的 Lineage；
- 佛教早期环境：Context；
- 人物、传统与政治环境：Historical Network。

未迁移的关中、河西走廊、四川和 V1/V2 佛教故事仍保留在 `data/content.js`、`data/knowledge.js`、`data/entity-network.js` 等 legacy 数据文件中，但 V3 入口、查询和导航不会读取它们。

## 运行

最简单：

```text
双击 index.html
```

或使用任意静态服务器：

```powershell
python -m http.server 8000
```

然后打开 `http://localhost:8000/`。所有运行时路径都是相对路径，因此仓库子路径下的 GitHub Pages 部署同样可用。

## 架构

### 数据层

`data/v3/atlas-data.js` 的 `schemaVersion` 固定为 `3`，包含十类对象：

- `Entity`：稳定知识身份；
- `StructuralEdge`：关系事实的唯一来源；
- `Card`：围绕有限问题策展一个 Entity 的关系子图；
- `Scene`：Card 内的连续叙事段落；
- `StructureView`：Lineage、Composition、Context 或 Historical Network；
- `NavigationOption`：正文、地图节点和推荐卡共用的跳转；
- `MapState`：Scene 驱动的相机和图层引用；
- `Geometry`：独立、可缓存的 GeoJSON-like 几何；
- `Asset`：本地媒体或数据资产；
- `Source`：可复用来源。

`data/v3/queries.js` 是纯 V3 查询层，不会回退读取 V1/V2。完整字段和约束见 `docs/V3_DATA_MODEL.md`。

### 阅读层

- `ui/v3/cards.js`：Small Card、Preview Card、Main Card；
- `ui/v3/card-reader.js`：IntersectionObserver、Scene 激活、统一导航、hash 路由及返回恢复；
- `styles/v3/cards.css`：桌面 sticky 地图/正文双栏，以及移动端普通纵向阅读。

Preview 只在桌面 hover/focus 提供补充上下文。点击不会被 Preview 阻断，移动端不依赖 hover。

### 地图层

- `data/world-physical.js`：由项目现有生成流程产生的本地 Natural Earth 1:50m 矢量；
- `assets/natural-earth/base.js`：只读取并缓存本地陆地、湖泊和简化河流；
- `map/v3/map-renderer.js`：由 MapState 完全驱动的 SVG 表现；
- `styles/v3/map.css`：四种 StructureView 的差异化、低对比样式。

地图没有远程 tile、卫星影像、hillshade、用户缩放、拖动、重置或底图切换。近似疆域、路线和选点均明确标注为教学示意。

### 集成层

- `index.html`：唯一 V3 静态入口；
- `app.js`：品牌配置、首页、Card reader 与地图连接；
- `styles.css`：全局编辑视觉；
- `tests/integration/**`：运行时、资源与 GitHub Pages 检查；
- `tests/e2e/**`：四条规定用户流程的状态回归。

## URL

```text
#card/buddhism-overview/buddhism-ashoka-period
#card/ashoka-overview/ashoka-edicts
```

直接打开或刷新 Card/Scene URL，会恢复相同页面、Scene 和 MapState。

## 内容编辑

### 添加新人物 Entity

1. 在 `data/v3/atlas-data.js` 的 `entities` 增加 `type: 'person'`，提供稳定 ID、摘要、`defaultCardId` 和可信 `sourceIds`。
2. 创建默认 Card，提出一个精确问题，并把 `sceneIds` 限制为 4–7 个策展段落。
3. 创建 Scenes：每个 Scene 包含叙事、来源、MapState、可选 StructureView 与 NavigationOption。
4. 用 StructuralEdge 建立人物与其他 Entity 的关系。不要把角色、赞助或传播误写成 lineage。
5. 创建 NavigationOptions；正文、地图节点和结尾推荐都引用这些对象。
6. 创建 MapStates，并引用独立 Geometry。教学覆盖必须 `approximate: true`，标签明确写“近似/示意”。
7. 在每张 Card 加入反决定论限制：地理和网络提供条件，不自动决定历史结果。
8. 运行全部测试。

### 建立关系

关系事实只写在 StructuralEdge：

```js
{
  id: 'edge-example',
  family: 'role',
  type: 'ruled',
  sourceId: 'person-id',
  targetId: 'polity-id',
  label: { forward: '统治', reverse: '由其统治' },
  canonicalSummary: '统一的关系事实。',
  sourceIds: ['source-id']
}
```

Scene 可以按 Card 视角重写叙述，但不能创建互相矛盾的第二套关系事实。Context 是 Card 的查询与策展结果，不是 StructuralEdge family。

## 测试

项目使用 Node 内置 test runner，没有依赖安装步骤。

```powershell
npm test
npm run test:data
npm run test:ui
npm run test:map
npm run test:integration
npm run test:e2e
npm run check:syntax
npm run check:pages
```

覆盖范围：

- schema、ID、类型、引用、来源和无孤立对象；
- StructuralEdge 过滤、直接一级 lineage、Context 和 Historical Network；
- 三种 Card、Scene 激活、MapState、Navigation、direct URL 和 back restoration；
- 无时间轴、远程地图请求、缩放/拖动/底图控件；
- 移动端、键盘、ARIA 与 reduced motion；
- GitHub Pages 相对资源路径；
- 佛教 → 阿育王 → 孔雀帝国以及返回恢复等四条用户流程。

## GitHub Pages

仓库根目录即发布目录：

1. 保留 `.nojekyll`；
2. 发布 `codex/v3-refactor` 的仓库内容；
3. 不需要构建器或依赖安装；
4. 入口和运行时不得改为根路径 `/...`；
5. 运行 `npm run check:pages` 验证所有入口资源存在且使用相对路径。

本次任务不会擅自部署生产，也不会合并 `main`。

## 设计约束

- 这是文明知识网络，不是旅游地图、国家竞猜或通用 POI 产品。
- 观察到的地理与历史推论必须分开表达。
- 中国和非西方内容是一等内容；现有中国地区资料保留为后续 V3 迁移来源。
- StructuralEdge 是关系事实唯一来源。
- 阿育王不是孔雀帝国的 lineage child。
- PeopleGroup 不是 LanguageSystem 的语言分支。
- 相似地理条件不会自动产生相同历史结果。
