# V3 架构审计

## 当前架构

- `data/entity-network.js` 以 `Entity → EntityMoment → RelationEpisode` 表示实体、离散时间状态和时变关系；`Exploration` 只保存策展入口、初始年份与优先关系。
- `data/entity-queries.js` 提供按年份查找最近 `EntityMoment`、活动 `RelationEpisode`、相关实体和入口年份的纯查询。
- `app.js` 同时承担路由、页面渲染、时间轴、Preview、地图投影、远程瓦片、世界地图拖放/缩放以及旧地区内容兼容，状态由 `activeEntityYear`、`activeExplorationId` 等全局变量驱动。
- 地图状态未独立建模：EntityMoment 内嵌地图要素，地图相机和底图模式由 UI 与路由逻辑共同控制。
- `data/content.js`、`data/knowledge.js` 和 `data/curation.js` 保存仍有价值的旧地区故事、来源和兼容内容。

## 删除、迁移与保留

### 删除

- 时间轴滑块、时间节点按钮、`activeEntityYear`/`cursorYear` 主流程和 nearest-moment 交互。
- Esri World Imagery、World Hillshade、远程 tile、底图切换、地图缩放/拖动/重置工具。
- 地图节点必须先打开 Preview 才能继续的中间步骤。

### 迁移

- 佛教、释迦牟尼、阿育王、孔雀帝国迁移为独立的 V3 Entity、Card、Scene、StructuralEdge、NavigationOption 与 MapState。
- 关系事实迁移到 StructuralEdge；Card/Scene 只保留视角化叙事，不维护第二套关系事实。
- 路由迁移为 `#card/{cardId}/{sceneId}`，滚动激活 Scene 并由 Scene 驱动地图。

### 暂时保留

- 未迁移地区故事与来源资料作为 legacy 内容保存，但不得进入 V3 查询或主导航。
- 本地 Natural Earth 数据、Web Mercator/几何投影思路和静态 `file://`/GitHub Pages 架构继续使用。
- 原生 JavaScript、HTML、CSS 与 Node 内置测试工具继续使用，避免增加运行时依赖。

## 风险

1. 十类 V3 对象之间的引用完整性与“无孤立对象”约束。
2. StructuralEdge 成为关系事实唯一来源后，UI/地图不得复制另一套关系模型。
3. 浏览器前进/后退与直接 URL 需要同时恢复 Card、Scene、MapState 和滚动位置。
4. IntersectionObserver、sticky 地图和移动端普通滚动的行为需要一致且可访问。
5. 所有资源必须使用 GitHub Pages 兼容的相对路径，并确保无远程地图请求。
6. 旧版大体量代码必须与 V3 主路径隔离，避免时间轴、瓦片或旧路由残留。

## 迁移顺序

1. 固定 V3 schema、查询、示例数据和验证器，提交 `DATA_SCHEMA_READY`。
2. 从固定 schema 分别实现 Card/Scene UI 与 Natural Earth 地图，提交 `CARD_UI_READY`、`MAP_READY`。
3. 顺序合并到 `codex/v3-refactor`，再接入入口、路由、全局样式和构建测试。
4. 执行 schema、query、UI、map、integration、E2E、移动端、网络和视觉验收。
5. 生成验收报告与截图，推送分支并创建 Draft PR；不合并 `main`。

