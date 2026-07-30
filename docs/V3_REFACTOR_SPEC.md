# 山河与文明 V3 重构：多 Agent 工作提示词

项目仓库：

https://github.com/jiaxun-li/history-geography

本轮重构的目标不是继续修补现有页面，而是把产品从“历史地理地图”正式转为一个以连续阅读和连续点击为核心的文明知识网络。

产品只保留两个主要交互：

1. 用户向下滚动，阅读当前 Card；不同 Scene 随滚动进入，地图和图片自动更新。
2. 用户点击一个相关实体或专题入口，进入下一张 Card。

不再把时间作为独立交互控件。删除时间轴滑块、时间节点按钮、任意年份选择、卫星图切换和地图缩放等功能。

------

# Prompt 0：总控架构与多 Agent 协调

你是本项目的 lead architect 和 implementation coordinator。

请检查并重构以下仓库：

https://github.com/jiaxun-li/history-geography

首先完整阅读：

- `README.md`
- `index.html`
- `styles.css`
- `app.js`
- `data/content.js`
- `data/knowledge.js`
- `data/entity-network.js`
- `data/entity-queries.js`
- `data/curation.js`
- `data/world-physical.js`
- 现有测试和生成脚本

不要立即大规模改代码。先输出一份简洁的架构审计，说明：

1. 当前 Entity、EntityMoment、RelationEpisode、Exploration 和地图状态如何工作。
2. 哪些旧结构需要删除、迁移或暂时保留。
3. 哪些模块可以继续使用。
4. 本轮重构的风险点和迁移顺序。

然后协调多个专门 Agent，按以下顺序工作：

1. 数据结构与查询层；
2. Card、Scene 和三种卡片呈现；
3. Natural Earth 矢量地图和整体视觉；
4. 集成、迁移和自动化测试。

## 不可改变的产品原则

### 核心对象

第一版必须实现：

- `Entity`
- `StructuralEdge`
- `Card`
- `Scene`
- `StructureView`
- `NavigationOption`
- `MapState`
- `Geometry`
- `Asset`
- `Source`

第一版暂不实现完整的 `Exploration` 系统，但数据结构应避免阻碍未来加入 Exploration。

### 第一版 Entity 类型

必须支持：

- `person`
- `polity`
- `institution`
- `peopleGroup`
- `culturalTradition`
- `languageSystem`
- `religiousTradition`
- `region`
- `routeNetwork`
- `event`
- `technologyPractice`
- `writingSystem`
- `artStyle`

必须明确区分：

- 人群与语言；
- 政治实体与文明；
- 宗教与宗教机构；
- 语言与文字系统；
- 艺术风格与具体作品；
- 地区与政治领土。

### 四种结构呈现

前端必须支持四种 `StructureView`：

1. `lineage`：谱系层级；
2. `composition`：组成结构；
3. `context`：情境集合；
4. `historicalNetwork`：历史序列与网络。

其中：

- `lineage`、`composition` 和 `historicalNetwork` 来源于 `StructuralEdge`；
- `context` 是 Card 根据当前问题，查询并组合多种 StructuralEdge 后形成的策展集合；
- 谱系视图默认只展示直接下一级，不能递归展开所有后代。

### Entity、Card 与 Scene 的边界

- `Entity` 保存一个对象稳定的知识身份。
- `Card` 围绕一个有限问题呈现该 Entity 的一个视角。
- `Scene` 是 Card 内随滚动激活的一个叙事段落。
- 大 Entity 可以拥有多张 Card。
- 用户不需要感知 Entity、Card、Scene 的内部数据层级。
- 用户只感知自己在阅读一页，并可以点击进入下一页。

### 关系文案原则

`StructuralEdge` 保存统一的关系事实，例如：

- `canonicalSummary`
- `forwardSummary`
- `reverseSummary`
- `sourceIds`

不同 Card 中的 Scene 文案可以从不同角度重写同一关系，但不能复制维护互相独立的事实版本。

### 交互原则

- 滚动只在当前 Card 的 Scenes 之间前进。
- 点击才进入下一张 Card。
- 不允许滚动到底后自动进入另一张 Card。
- 地图节点、正文链接和 Scene 末尾推荐都统一使用 `NavigationOption`。
- 点击地图节点应直接进入目标 Card，不再先打开一个必须二次点击的 preview 弹窗。
- 浏览器返回必须恢复上一张 Card 原来的 Scene 和滚动位置。

### 技术约束

- 保持静态网站和 GitHub Pages 可部署。
- 优先使用现有原生 JavaScript、HTML 和 CSS。
- 不要无理由迁移到 React、Vue 或大型框架。
- 可以增加轻量的构建或测试依赖，但必须说明理由。
- 不得删除仍有价值的旧内容；未迁移内容可以移动到 legacy 目录。
- 不要把旧数据和新数据混合在同一查询路径中。
- 新架构必须有明确的 schema version。
- 所有引用必须可验证，禁止存在孤立的 Card、Scene、Edge、MapState 或 NavigationOption。

## 总体验收条件

完成后必须满足：

1. 默认入口可以打开一个新的 Card 页面。
2. Card 内包含多个 Scene。
3. 滚动进入不同 Scene 时，地图状态自动变化。
4. 时间只作为 Scene 的内容标签，不再有时间轴控件。
5. 点击节点可以直接进入下一张 Card。
6. 返回后恢复之前的滚动位置。
7. 至少完成佛教、阿育王、孔雀帝国和释迦牟尼的 V3 示例迁移。
8. 至少展示一次谱系结构、一次情境集合和一次历史网络。
9. 页面不再加载任何卫星或 hillshade 瓦片。
10. 地图不再提供用户缩放、平移或底图切换。
11. 所有测试通过。
12. README 清楚描述新架构、运行方法和内容编辑方法。

每个 Agent 完成后都必须提交：

- 修改文件列表；
- 关键设计决策；
- 尚未完成的事项；
- 自动化测试结果；
- 人工验证步骤。

不要只提交设计文档。最终必须完成可运行的实现。

------

# Prompt 1：数据结构、Schema 和查询层 Agent

你负责 V3 的数据架构、迁移接口和测试，不负责最终视觉设计。

仓库：

https://github.com/jiaxun-li/history-geography

请先阅读总控架构要求以及现有 V1/V2 数据文件。然后设计并实现 V3 数据层。

## 目标

建立一套明确、可扩展、可验证的数据结构：

```text
Entity
StructuralEdge
Card
Scene
StructureView
NavigationOption
MapState
Geometry
Asset
Source
```

## 1. Entity

第一版支持：

```js
[
  'person',
  'polity',
  'institution',
  'peopleGroup',
  'culturalTradition',
  'languageSystem',
  'religiousTradition',
  'region',
  'routeNetwork',
  'event',
  'technologyPractice',
  'writingSystem',
  'artStyle'
]
```

建议字段至少包括：

```js
{
  id,
  type,
  subtype?,
  level?,
  name,
  alternativeNames?,
  canonicalSummary,
  existence?,
  defaultCardId,
  featuredCardIds?,
  tags?,
  sourceIds
}
```

`level` 可以用于：

- LanguageSystem：family、branch、language、dialect；
- ReligiousTradition：religion、tradition、school、sect；
- WritingSystem：family、script、variant。

Entity 不应直接保存完整关系列表、Scene 文案或地图状态。

## 2. StructuralEdge

建议字段：

```js
{
  id,

  family:
    'lineage'
    | 'composition'
    | 'role'
    | 'spatial'
    | 'historicalNetwork'
    | 'production'
    | 'transmission',

  type,

  sourceId,
  targetId,

  time?,

  label: {
    forward,
    reverse?
  },

  canonicalSummary,
  forwardSummary?,
  reverseSummary?,
  qualifiers?,

  sourceIds
}
```

要求：

- 阿育王和孔雀帝国使用 `role: ruled`，不能使用谱系父子关系。
- 印度—雅利安语支和印度—伊朗语支使用 `lineage: branch_of`。
- PeopleGroup 和 LanguageSystem 必须是不同 Entity，通过 `spoke` 或相关边连接。
- StructuralEdge 是关系事实的唯一来源。
- Card 和 Scene 可以改写关系叙述，但不能重复维护另一套事实。

## 3. Card

建议字段：

```js
{
  id,
  entityId,

  kind:
    'overview'
    | 'facet'
    | 'period',

  lens?,

  title,
  question?,
  introduction,

  scope?: {
    time?,
    edgeFamilies?,
    edgeTypes?,
    featuredEntityIds?
  },

  sceneIds,
  structureViewIds?,
  closingNavigationIds?,
  sourceIds?
}
```

要求：

- Entity 可以有多张 Card。
- 每个 Entity 必须有 `defaultCardId`。
- 第一版每张 Card 建议 4–7 个 Scene。
- Card 只能引用有限关系子图，不能自动暴露 Entity 的全部关系。

## 4. Scene

建议字段：

```js
{
  id,
  cardId,
  order,

  time?,

  eyebrow?,
  title,
  contentBlocks,
  takeaway?,

  mapStateId?,
  activeStructureViewIds?,
  navigationIds?,

  featuredEntityIds?,
  sourceIds
}
```

Scene 是一个由文字主导的叙事段落，同时控制：

- 时间标签；
- 地图状态；
- 图片；
- 当前可进入节点；
- 当前结构视图。

删除 `cursorYear` 和“最近时间节点”逻辑。

## 5. StructureView

支持：

```js
{
  id,

  family:
    'lineage'
    | 'composition'
    | 'context'
    | 'historicalNetwork',

  title,

  query: {
    edgeFamilies?,
    edgeTypes?,
    direction?,
    timeFilter?
  },

  depth?,
  maxVisible?,
  featuredEntityIds?,

  display:
    'cards'
    | 'map'
    | 'mapAndCards'
    | 'sequence'
}
```

要求：

- `lineage.depth` 第一版必须固定为 1。
- `context` 可以组合多个关系类型。
- 查询结果必须经过 Card/Scene 策展筛选，不能自动全部显示。

## 6. NavigationOption

建议字段：

```js
{
  id,

  fromCardId,
  fromSceneId?,

  targetCardId,

  basis: {
    kind:
      'structuralEdge'
      | 'contextCollection'
      | 'relatedCard',

    id?
  },

  label,
  hook,
  summary?,

  presentation:
    'inline'
    | 'mapNode'
    | 'closingCard',

  rank?
}
```

正文链接、地图节点和结尾推荐必须共用同一种 NavigationOption。

## 7. MapState、Geometry、Asset 和 Source

地图几何与 Scene 分离：

```js
MapState {
  id,
  camera,
  layerIds,
  caption?
}
Geometry {
  id,
  geometry,
  approximate?,
  sourceIds?
}
```

地图 Layer 可引用：

- `entityId`
- `navigationId`
- `geometryId`

## 8. 查询函数

至少实现并测试：

```js
getEntity(id)
getCard(id)
getScene(id)
getScenesForCard(cardId)
getStructuralEdge(id)
getEdgesForEntity(entityId, filters)
getDirectLineageChildren(entityId, filters)
getStructureViewItems(viewId, sceneId)
getNavigationOptionsForScene(sceneId)
getTargetCardForEntity(entityId)
validateAtlasData()
```

## 9. 示例迁移

至少迁移：

- 佛教；
- 释迦牟尼；
- 阿育王；
- 孔雀帝国。

至少创建：

- 一张佛教概览 Card；
- 一张阿育王概览 Card；
- 一张孔雀帝国概览 Card；
- 一张释迦牟尼概览 Card；
- 佛教与阿育王的统一 StructuralEdge；
- 阿育王与孔雀帝国的角色关系；
- 至少一个 Context StructureView；
- 至少一个 Historical Network StructureView。

为了验证 lineage 结构，可以加入少量独立测试数据，例如：

```text
印欧语系
└── 印度—伊朗语支
```

不必完成其全部正文页面。

## 10. 自动化测试

必须验证：

- ID 唯一；
- Entity 的 defaultCard 存在；
- Card 的每个 Scene 存在且顺序合法；
- Scene 引用的 MapState 存在；
- StructuralEdge 两端 Entity 存在；
- NavigationOption 的目标 Card 存在；
- StructureView 查询合法；
- Source 引用存在；
- 不允许 Card 引用其他 Entity 的 Scene；
- 不允许 lineage 默认递归展开超过一层；
- 不允许 PeopleGroup 被错误放进 LanguageSystem 的 lineage 树；
- 不允许存在孤立对象；
- V3 查询不得回退读取旧 V1/V2 数据。

请使用项目当前最合适的轻量测试工具。若引入 Vitest、Node test runner 或其他依赖，请说明理由。

完成后输出：

1. Schema 设计说明；
2. 文件结构；
3. 示例数据；
4. 查询 API；
5. 测试结果；
6. V2 到 V3 的迁移说明。

------

# Prompt 2：三种 Card 呈现与滚动阅读 Agent

你负责设计和实现 Card 的三种视觉呈现：

1. 小卡片；
2. Preview 卡片；
3. 主 Card。

其中主 Card 是核心体验。

仓库：

https://github.com/jiaxun-li/history-geography

请基于 V3 数据结构工作，不要重新设计另一套数据模型。

## 一、三种呈现的职责

### 1. 小卡片 Small Card

使用场景：

- 首页入口；
- Card 结尾的继续探索；
- Context StructureView；
- 谱系直接子节点；
- 相关专题推荐。

目标：

- 用户在几秒钟内理解“它是什么”和“为什么值得点击”。
- 不展示完整百科信息。
- 整张卡片可点击。
- 每次最多显示少量小卡片，避免目录化。

建议内容：

```text
类型或关系标签
标题
一句 hook
一句简短说明
进入 →
```

不要默认展示：

- 全部关联实体；
- 完整年代；
- 地点、标签、来源的大量元数据；
- 多个操作按钮。

### 2. Preview Card

Preview 只用于用户暂时需要更多上下文，但尚未决定是否离开当前 Card 的场景。

适合：

- 桌面端 hover 或键盘 focus；
- 移动端长按不作为第一版必要功能。

Preview 应当非常轻：

```text
实体名称
当前关系
一句 relation-specific summary
目标 Card 的主题
```

注意：

- 点击地图节点默认应直接进入下一张 Card。
- Preview 不能成为强制中间步骤。
- Preview 不应重复主 Card 的通用百科摘要。
- 若 Preview 会增加明显复杂度，可以让第一版只在桌面端 hover 时出现，并确保关闭 Preview 不影响阅读状态。

### 3. 主 Card Main Card

主 Card 是用户进入后的完整阅读页面。

推荐布局：

```text
左侧或上方：固定的轻量地图/图片区域
右侧或下方：连续滚动的 Scenes
```

桌面端：

- 地图区域保持 sticky；
- 正文正常连续滚动；
- 每个 Scene 约占 70–100vh；
- 使用 IntersectionObserver 激活 Scene；
- 不劫持滚轮；
- 不强制一滚一屏。

移动端：

- 地图或主图位于当前 Scene 上方；
- 正常纵向滑动；
- 不能依赖 hover。

## 二、主 Card 的结构

主 Card 顶部：

```text
Entity 类型或 Card 视角
Card 标题
本张 Card 回答的问题
简短 introduction
```

Scene：

```text
时间标签
小标题
1–3 个短段落
可选图片
可选 takeaway
当前可进入节点
```

Card 结尾：

- 2–4 个精选下一步；
- 可以进入其他 Entity 的默认 Card；
- 可以进入同一 Entity 的其他 Card；
- 不展示“全部相关内容”。

## 三、滚动逻辑

滚动进入 Scene 时：

- 设置 `activeSceneId`；
- 更新 MapState；
- 更新图片；
- 更新当前时间标签；
- 更新地图节点；
- 更新当前 StructureView；
- 更新 URL 中的 scene slug；
- 不创建时间轴状态。

建议前端状态：

```js
{
  activeCardId,
  activeSceneId,
  entryContext,
  navigationStack
}
```

删除或停用：

- `activeEntityYear`
- `cursorYear`
- 时间轴 slider
- 时间节点按钮
- nearest moment 查询
- 关系时间轴覆盖
- 时间轴键盘逻辑

## 四、点击和返回

所有链接统一调用：

```js
followNavigation(navigationId)
```

要求：

- 点击正文链接、地图节点或小卡片，行为一致；
- 进入下一张 Card 时滚动到顶部；
- 保存来源 Card、Scene 和滚动位置；
- 浏览器返回时恢复之前的 Scene 和滚动位置；
- 支持复制 URL 后直接进入指定 Card/Scene；
- 不要建立隐藏的第二套路由。

建议 URL：

```text
#card/buddhism-overview/ashoka-period
#card/ashoka-overview/edicts
```

## 五、文案呈现

同一 StructuralEdge 在不同 Card 中可以有不同叙述角度。

例如佛教 Card：

> 阿育王时期，王权赞助和公共敕令扩大了佛教僧团的公共活动空间。

阿育王 Card：

> 阿育王支持佛教僧团，但他的敕令面向帝国内不同人群，并不只是佛教教义文本。

要求：

- 底层关系事实只有一份；
- Scene 文案可以策展改写；
- 不允许不同 Card 维护互相矛盾的历史事实。

## 六、视觉优先级

主 Card 内：

```text
当前 Scene 的文字和图片
> 当前可探索节点
> 地图中的历史范围和路线
> 基础地理背景
```

地图不能压过正文。

## 七、可访问性和测试

必须支持：

- 键盘 Tab 访问所有导航入口；
- focus 状态清楚；
- Scene 标题有正确 heading 层级；
- 图片有 alt；
- 地图节点有 aria-label；
- 减少动画偏好；
- 移动端正常阅读；
- 没有 hover 也能完成全部操作。

请增加自动化测试，至少验证：

- 默认 Card 渲染；
- Scene 随滚动激活；
- MapState 随 Scene 更新；
- NavigationOption 可以跳转；
- 浏览器返回恢复位置；
- 同一 Entity 的 related Card 跳转；
- 另一个 Entity 的默认 Card 跳转；
- Preview 不阻断主流程；
- 移动端布局不出现横向滚动；
- 删除时间轴后不存在失效控件。

完成后提交：

- 三种 Card 的设计说明；
- 关键 CSS 和组件结构；
- 交互状态图；
- 测试结果；
- 至少四个已迁移 Entity 的截图或人工验证说明。

------

# Prompt 3：Natural Earth 地图与整体视觉重构 Agent

你负责删除旧卫星地图系统，建立轻量、低干扰的矢量地图，并调整整体品牌视觉。

仓库：

https://github.com/jiaxun-li/history-geography

## 一、产品定位

产品已经不是一个以地形解释历史的地图网站。

地图现在只是：

- 文明发生的空间背景；
- 当前 Scene 的辅助说明；
- 关系、传播和分支的视觉载体。

地图不是主要操作面板，也不是独立探索工具。

## 二、必须删除

删除或停用：

- Esri World Imagery；
- Esri World Hillshade；
- 所有远程 tile 服务；
- 卫星/地理简图切换；
- 地图缩放按钮；
- 地图重置按钮；
- 用户平移；
- 鼠标滚轮缩放；
- 世界地图循环拖动；
- 地图缩放级别输出；
- 与这些功能相关的 CSS、状态和事件监听器。

确保代码中不再请求：

```text
server.arcgisonline.com
```

## 三、Natural Earth 矢量底图

使用项目已有的 Natural Earth 数据生成流程，或重新建立更轻量的本地矢量数据。

地图只保留：

- 极简陆地轮廓；
- 少量主要河流；
- 必要湖泊；
- 可选的极简山脉或地形区域；
- 当前 Scene 的历史几何；
- 当前 Scene 的可点击节点。

不要使用：

- 真实卫星纹理；
- hillshade；
- 高密度河网；
- 现代道路；
- 现代行政区划；
- 大量地名；
- 真实山体纹理。

山脉可以使用：

- 简化多边形；
- 极淡色块；
- 抽象短线或简单矢量纹理。

河流应显著简化，只有与当前故事有关的河流才需要强调。

所有数据必须本地保存，适合 GitHub Pages，不依赖外部地图服务。

## 四、地图状态

地图不允许用户自由缩放，但不同 Scene 可以自动切换不同 camera：

```js
{
  center: [lon, lat],
  scale: number
}
```

Scene 切换时允许：

- 平滑移动视图；
- 淡入淡出图层；
- 新节点出现；
- 旧节点降低透明度或消失。

不允许：

- 用户拖动；
- 用户缩放；
- 用户切换地图模式。

地图必须由 `MapState` 完全驱动。

## 五、结构视图表现

### Lineage

- 只显示直接一级分支；
- 可以使用区域标签、分支线或小节点；
- 不要同时加载所有后代。

### Composition

- 显示整体及组成部分；
- 适合路线段、子区域和机构分支；
- 组成关系不应画成传播箭头。

### Context

- 显示当前 Scene 精选的异质实体；
- 每组应有明确关系标签；
- 不能看起来像同一种父子层级。

### Historical Network

- 使用方向线、传播区域或时间阶段；
- 箭头应表达近似方向，不是假装精确路线；
- 允许网络拥有多个来源和多个目标。

## 六、品牌调整

删除或弱化以下旧定位：

- “山河与文明”作为最终名称；
- “为什么历史会在这个地方以这种方式展开？”；
- “地图”和“地理”作为产品核心卖点。

可以暂时使用工作名称：

```text
文明漫游
```

副标题：

```text
从一个人物、城市、信仰或作品出发，沿着关联漫游人类文明。
```

但请把品牌文字集中到配置文件，便于之后替换。

首页和导航应突出：

- 开始阅读；
- 文明实体；
- 连续探索；
- 当前阅读路径。

不要突出：

- 地图模式；
- 地理区域目录；
- 卫星影像。

## 七、视觉风格

目标：

- 轻量；
- 安静；
- 有编辑感；
- 更像数字人文杂志，而不是 GIS 工具；
- 图片和文字是主角；
- 地图是低对比背景。

不要使用过度复杂的阴影、玻璃拟态或地图工具栏。

## 八、性能

需要验证：

- 无远程 tile 请求；
- 首屏资源显著小于旧版；
- Natural Earth 数据经过简化；
- 地图切换不卡顿；
- 不因每个 Scene 重复解析完整 GeoJSON；
- 移动端性能可接受；
- 所有地图几何可以缓存和复用。

## 九、测试

必须增加或执行：

- 网络请求测试：无 Esri 或其他 tile 请求；
- 地图控件测试：页面不存在缩放和底图切换；
- Scene 切换测试：MapState 正确更新；
- Geometry 引用完整性测试；
- 移动端截图或布局测试；
- prefers-reduced-motion 测试；
- 无 JavaScript 错误；
- GitHub Pages 路径下资源可加载。

完成后提交：

1. 删除的旧地图代码列表；
2. 新 Natural Earth 数据来源和生成方式；
3. 新地图渲染结构；
4. 性能对比；
5. 自动化测试结果；
6. 人工验证截图或说明。

------

# Prompt 4：集成、迁移、回归测试与架构审查 Agent

你是最后的 integration and QA agent。

仓库：

https://github.com/jiaxun-li/history-geography

前面的 Agent 已分别完成：

- V3 数据结构；
- Card/Scene 阅读交互；
- 三种卡片呈现；
- Natural Earth 矢量地图；
- 视觉重构。

你的任务不是重新设计，而是检查这些实现是否真正组成了一套一致的产品。

## 一、架构审查

检查是否存在以下问题：

- Entity、Card、Scene 职责混淆；
- Card 又直接保存完整 Entity 关系；
- Scene 重复维护 StructuralEdge 的事实；
- Preview 使用另一套数据模型；
- 地图节点绕过 NavigationOption；
- Context 被错误保存成谱系父子边；
- 阿育王被写成孔雀帝国的 lineage child；
- PeopleGroup 被写进 LanguageSystem 的谱系；
- 同一 ID 在 V2 和 V3 中冲突；
- V3 查询仍隐式回退旧数据；
- 时间轴状态残留；
- 远程地图 tile 残留；
- 地图仍可缩放或拖动；
- 浏览器返回不能恢复阅读位置。

发现问题后直接修复，并增加回归测试。

## 二、迁移范围

至少确保以下实体完整使用 V3：

- 佛教；
- 释迦牟尼；
- 阿育王；
- 孔雀帝国。

至少确保以下关系有效：

```text
释迦牟尼 → 佛教
阿育王 → 孔雀帝国
阿育王 → 佛教
孔雀帝国 → 佛教的政治环境
```

至少创建：

- 佛教概览 Card；
- 阿育王概览 Card；
- 孔雀帝国概览 Card；
- 释迦牟尼概览 Card；
- 多个 Scenes；
- Small Card；
- Preview Card；
- Main Card；
- Context View；
- Historical Network View；
- 一个最小 Lineage 测试示例。

未迁移旧内容应明确标记为 legacy，不得混入 V3 主导航。

## 三、端到端用户流程

测试以下完整流程：

### 流程 A

```text
首页
→ 佛教概览
→ 向下滚动到阿育王时期
→ 地图变化
→ 点击阿育王
→ 进入阿育王概览
→ 点击孔雀帝国
→ 进入孔雀帝国概览
→ 浏览器返回
→ 恢复阿育王之前的位置
→ 再返回
→ 恢复佛教的阿育王 Scene
```

### 流程 B

```text
佛教概览
→ 点击同一 Entity 的另一张 Card
→ 返回佛教概览原位置
```

### 流程 C

```text
直接打开某个 Card/Scene URL
→ 正确渲染
→ 地图状态正确
→ 刷新后仍保持
```

### 流程 D

```text
移动端
→ 正常滑动全部 Scenes
→ 点击节点进入下一张 Card
→ 不依赖 hover
→ 无横向滚动
```

## 四、测试层级

### Schema 测试

- 引用完整性；
- ID 唯一性；
- 类型合法性；
- Entity/Card/Scene 所属关系；
- StructuralEdge 两端存在；
- NavigationOption 目标存在；
- Source 存在；
- Geometry 存在。

### Query 测试

- StructuralEdge 过滤；
- StructureView 查询；
- direct lineage children 只返回一级；
- Context View 组合多个关系；
- Scene NavigationOption；
- Entity default Card。

### UI 测试

- Main Card；
- Small Card；
- Preview；
- Scene activation；
- MapState update；
- Navigation；
- back restoration；
- direct URL。

### 回归测试

- 不加载卫星和 hillshade；
- 没有缩放控件；
- 没有时间轴；
- 无旧 route 进入错误状态；
- GitHub Pages 可以部署；
- 无控制台错误。

### 性能测试

至少记录：

- 首屏资源大小；
- 页面初始加载时间；
- Scene 切换耗时；
- 是否存在重复地图数据解析；
- 是否存在不必要的远程请求。

## 五、README 和文档

更新 README，清楚说明：

1. 产品新定位；
2. 核心交互；
3. V3 对象模型；
4. Entity、Card、Scene 和 StructuralEdge 的区别；
5. 四种 StructureView；
6. 如何新增 Entity；
7. 如何新增 Card；
8. 如何新增 Scene；
9. 如何建立关系；
10. 如何加入地图状态；
11. 如何运行测试；
12. 如何部署 GitHub Pages；
13. 哪些旧内容仍是 legacy。

增加一个编辑示例：

```text
如何添加一个新人物 Entity
→ 创建默认 Card
→ 添加 Scenes
→ 创建 StructuralEdges
→ 添加 NavigationOptions
→ 添加 MapStates
→ 运行验证
```

## 六、最终输出

完成后给出：

- 架构是否达到要求；
- 修复的问题；
- 当前仍存在的技术债；
- 自动化测试列表和结果；
- 人工测试流程结果；
- 迁移完成度；
- 下一步最值得做的三件事。

不要只报告问题。能够修复的问题必须直接修复。