# V3 数据模型

V3 使用 `schemaVersion: 3`，并把稳定知识身份、关系事实、策展叙事和地图表现拆分为十类对象。浏览器通过 `window.ATLAS_V3_DATA` / `window.ATLAS_V3_QUERIES` 使用同一份数据；Node 测试通过 CommonJS 加载。V3 查询只接收显式传入的 V3 atlas，不读取 V1/V2 全局变量。

## 对象边界

- `Entity`：稳定的知识身份、类型、摘要、默认 Card 与来源。
- `StructuralEdge`：关系事实的唯一来源，保存方向、关系族、文案、时间限定与来源。
- `Card`：围绕一个有限问题策展 Entity 的关系子图。
- `Scene`：Card 内按顺序阅读的叙事段落，控制 MapState、StructureView 与 NavigationOption。
- `StructureView`：查询 StructuralEdge 后形成 `lineage`、`composition`、`context` 或 `historicalNetwork` 表现。
- `NavigationOption`：正文、地图节点与结尾推荐共用的跳转对象。
- `MapState`：Scene 驱动的相机和图层引用，不包含用户缩放或拖动状态。
- `Geometry`：独立 GeoJSON-like 几何；教学覆盖和方向线必须标记 `approximate` 并明确写“近似/示意”。
- `Asset`：本地数据或媒体资产及替代文本。
- `Source`：可复用的书目或数据来源。

## 关系规则

- 阿育王统治孔雀帝国使用 `role: ruled`，不是 lineage。
- PeopleGroup 与 LanguageSystem 不得组成 lineage；语言谱系只连接 LanguageSystem。
- `context` 只存在于 Card 策展查询，不创建 context StructuralEdge。
- Scene 可重写叙述角度，但统一关系事实和来源仍由 StructuralEdge 提供。
- Lineage 第一版固定 `depth: 1`，`getDirectLineageChildren` 只返回直接子级。

## 示例迁移

核心示例包括佛教、释迦牟尼、阿育王与孔雀帝国，每个默认 Card 有 4–5 个 Scene。另有：

- 佛教的第二张 facet Card，用于验证同一 Entity 的 related Card 跳转和返回恢复。
- 孔雀帝国行政网络，用于 Composition。
- 印欧语系 → 印度—伊朗语支，用于最小 Lineage。
- 佛教 Context 与 Historical Network。

所有地图疆域、路线和选点都是明确标记的近似教学表达。每张 Card 的叙事都包含反地理决定论限制。

## 查询 API

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

`filters` 支持 `direction`、`edgeFamilies`、`edgeTypes` 与 `timeFilter`。StructureView 结果先按关系查询，再按 `featuredEntityIds` 和 `maxVisible` 策展。

## 验证

`validateAtlasData()` 检查：

- 全局 ID 唯一、类型和枚举合法；
- Entity 默认 Card、Card/Scene 所属、Scene 顺序与所有引用；
- StructuralEdge 两端、来源、禁用谱系语义；
- NavigationOption 来源/目标及 basis；
- MapState、Geometry、Asset 与 Source；
- Lineage 深度、Context 多关系策展；
- 每张 Card 的反决定论 caveat；
- 所有十类对象无孤立记录。

运行：

```powershell
& 'C:\Users\李佳讯\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/data-v3/*.test.js
```

V2 的 EntityMoment、RelationEpisode、cursorYear 与 Exploration 不进入 V3 查询路径；未迁移内容继续作为 legacy 保存。
