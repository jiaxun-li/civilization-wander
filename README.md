# 文明漫游 V5

这是一个依赖为零、可以直接通过 `file://` 或 GitHub Pages 打开的静态文明知识网络原型。

> 从一个人物、城市、信仰或作品出发，沿着经过策展的关联漫游人类文明。

V5 以 Card-first 的连续阅读为核心，地图只是按需出现的支持媒体。产品只有两个核心动作：

1. 向下滚动，连续阅读当前 Card 的 Scenes；Scene 激活时，地图和结构视图自动更新。
2. 点击正文入口或推荐小卡片，统一通过 NavigationOption 进入下一张 Card。

滚动不会自动换页；点击才进入下一张 Card。浏览器返回会恢复上一张 Card 的 Scene 和滚动位置。

## 当前内容范围

正式内容由 `data/` 下的独立内容模块组成，并由 `data/atlas-data.js` 聚合。首页与聚合后的运行时数据是当前故事范围的权威来源，不在 README 手工维护容易漂移的故事清单或数量。

首页用三组策展入口组织起点，配置只保存稳定 Card ID，公共实体名、摘要和标题从聚合数据实时读取。首屏同时给出文明、古老故事和遗物奇观三个代表性快速起点；离开故事时会在本地保存经过校验的阅读位置，记录可用时首个动作替换为“继续上次阅读”。

查看实时集合数量：

```powershell
npm run report:counts
```

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

`data/atlas-data.js` 汇总 V5 内容模块并输出 `schemaVersion: 5` 的十四类对象。各内容模块在主数据文件之前加载，再由主数据文件合并。`index.html` 是实际入口，聚合器与语法清单必须保持同序；`npm run check:manifests` 会只读检查三者是否漂移：

- `Entity`：稳定知识身份，不保存默认 Card；需要索引时由 Card 的主/相关 Entity 反向推导；
- `StructuralEdge`：关系事实的唯一来源；
- `Event`：可独立查询、带类型、证据与内部审校的历史事件、过程或文本传统；
- `Card`：围绕有限问题策展一个 Entity 的关系子图；
- `Scene`：Card 内的连续叙事段落；每个 Scene 明确关联至少一个时间相交的 Event，Card 的 Event 集合由其 Scenes 推导；
- `StructureView`：Lineage、Composition、Context 或 Historical Network；
- `NavigationOption`：正文入口和推荐卡共用的跳转身份；地图 placement 目前仅保留内部数据路径，不作为公开入口；
- `NavigationPlacement`：一个跳转在特定 Scene/Card 中的本地展示位置与顺序；
- `CameraPreset`：可复用的地图视口；
- `MapState`：Scene 驱动的相机和图层引用；
- `Geometry`：独立、可缓存的 GeoJSON-like 几何；
- `MapAnnotation`：区分 locatedAt、associatedWith 与 screenCallout 的地图标注；
- `Asset`：本地媒体或数据资产；
- `Source`：可复用来源。

`data/queries.js` 负责索引、查询和严格验证。完整字段、所有权与编辑约束见
`docs/ARCHITECTURE_AND_DATA_MODEL.md`。

### 阅读层

V5 是当前数据契约；本次升级没有重写已经稳定的表现层，因此 `ui/v4`、`map/v4` 与 `styles/v4` 目录名暂时保留，不能据此把运行时误判为 schema V4。

- `ui/v4/cards.js`：Small Card、Preview Card、Main Card；
- `ui/v4/card-reader.js`：IntersectionObserver、Scene 激活、媒体继承、统一导航、hash 路由及返回恢复；
- `styles/v4/cards.css`：桌面 sticky 媒体/正文双栏，以及移动端普通纵向阅读。

运行时 Scene 图片统一为本地 WebP，单图严格小于 500 KB（500,000 bytes），编码后任一边不超过 2560 像素；模块级门禁同时检查格式、体积和 version-2 Asset manifest。
阅读器只预加载当前故事前后最近的不同图片；切换时保留旧媒体，直到新图片下载并解码完成后再淡入，避免把网络等待暴露为空白画面。
阅读器只预加载当前故事前后最近的不同图片；切换时保留旧媒体，直到新图片下载并解码完成后再淡入，避免把网络等待暴露为空白画面。

桌面通过 hover/focus 打开 Preview。粗指针设备不依赖 hover：第一次点击打开 Preview 并保留在当前 Card，第二次点击同一入口才进入目标 Card。

### 地图层

- `data/world-physical.js`：由项目现有生成流程产生的本地 Natural Earth 1:50m 矢量；
- `assets/natural-earth/base.js`：只读取并缓存本地陆地、湖泊和简化河流；
- `map/v4/map-renderer.js`：由 MapState 与当前 Scene presentation 驱动的 SVG 表现；
- `styles/v4/map.css`：四种 StructureView 的差异化、低对比样式。

地图没有远程 tile、卫星影像、hillshade、用户缩放、拖动、重置或底图切换。近似疆域、路线和选点均明确标注为教学示意。

### 集成层

- `index.html`：唯一 V5 静态入口；
- `app.js`：品牌配置、首页策展与继续阅读、Card reader 与地图连接；
- `styles.css`：全局编辑视觉；
- `tests/integration/**`：运行时、资源与 GitHub Pages 检查；
- `tests/e2e/**`：规定用户流程的状态回归。

## URL

```text
#card/sumer-measuring-land-time/sumer-clay-records
#card/egypt-old-kingdom-overview/egypt-old-two-lands
```

直接打开或刷新 Card/Scene URL，会恢复相同页面、Scene 和 MapState。

## 内容编辑

正式内容按 `docs/CONTENT_PACK_AND_AUTHORING_WORKFLOW.md` 的三阶段流程推进，并可复用 `docs/CONTENT_PACK_TEMPLATE.md` 记录每阶段审稿结果。

### 添加新人物 Entity

1. 先按 `docs/CONTENT_PACK_AND_AUTHORING_WORKFLOW.md` 与用户确认数据存放文件，以及新建还是复用现有文件。
2. 在获批准的数据文件中增加 `type: 'person'` 的 Entity，提供稳定 ID、摘要和可信 `sourceIds`；不要在 Entity 上保存默认 Card。
3. 创建以该人物为 `primaryEntityId` 的 Card，提出一个精确问题，并按完整叙事需要组织 Scenes；通常为 `3–11` 个，但不是数量门禁，不得机械凑数或压缩。人物索引由这些 Card 关系反向生成。
4. 创建 Scenes：每个 Scene 包含叙事、来源和非空 `eventIds`；至少一个 Event 的时间必须与 Scene 相交。可按需要使用 MapState、StructureView 或 NavigationOption。
5. 用 StructuralEdge 建立人物与其他 Entity 的关系。不要把角色、赞助或传播误写成 lineage。
6. 创建 NavigationOptions；正文和结尾推荐引用这些对象。地图 placement 当前可以保留在数据中供校验和未来呈现使用，但不构成公开可点击入口。
7. 创建 MapStates，并引用独立 Geometry。教学覆盖必须 `approximate: true`，标签明确写“近似/示意”。
8. 在每张 Card 的非公开 `editorialReview` 中加入可信的限制、反例、不确定性或替代解释；不要默认渲染为公共模块。
9. 运行全部测试。

### 建立关系

关系事实只写在 StructuralEdge：

```js
{
  id: 'edge-example',
  family: 'role',
  type: 'ruled',
  source: { kind: 'entity', id: 'person-id' },
  target: { kind: 'entity', id: 'polity-id' },
  label: { forward: '统治', reverse: '由其统治' },
  summaries: { canonical: '统一的关系事实。' },
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
npm run check:manifests
npm run check:pages
```

覆盖范围：

- schema、ID、类型、引用、来源和无孤立对象；
- StructuralEdge 过滤、直接一级 lineage、Context 和 Historical Network；
- 三种 Card、Scene 激活、MapState、Navigation、direct URL 和 back restoration；
- 无时间轴、远程地图请求、缩放/拖动/底图控件；
- 移动端、键盘、ARIA 与 reduced motion；
- GitHub Pages 相对资源路径；
- 苏美尔 → 阿卡德王朝 → 乌尔第三王朝以及返回恢复等用户流程。

## GitHub Pages

仓库根目录即发布目录：

1. 保留 `.nojekyll`；
2. 发布经过验证的当前分支内容；
3. 不需要构建器或依赖安装；
4. 入口和运行时不得改为根路径 `/...`；
5. 运行 `npm run check:pages` 验证所有入口资源存在且使用相对路径。

本次任务不会擅自部署生产，也不会合并 `main`。

## 设计约束

- 这是文明知识网络，不是旅游地图、国家竞猜或通用 POI 产品。
- 观察到的地理与历史推论必须分开表达。
- 中国和其他非西方历史是一等内容，不作为象征性补充。
- StructuralEdge 是关系事实唯一来源。
- PeopleGroup 不是 LanguageSystem 的语言分支。
- 相似地理条件不会自动产生相同历史结果。
