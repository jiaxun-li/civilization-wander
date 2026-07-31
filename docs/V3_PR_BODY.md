# Draft PR 元数据

## 标题

V3：重构文明知识网络、Card/Scene 阅读与本地地图

## Base / Head

- Base：`main`
- Head：`codex/v3-refactor`
- 状态：Draft

## 正文

### 为什么

把原型从时间轴驱动的历史地理页面，重构为可连续阅读和跨实体漫游的文明知识网络；同时将地图降为低干扰的空间背景，并消除远程地图服务依赖。

### 做了什么

- 引入 schemaVersion 3 的十类对象模型，StructuralEdge 作为关系事实唯一来源。
- 完整迁移佛教、释迦牟尼、阿育王、孔雀帝国，并加入 Context、Historical Network、Composition 与最小 Lineage 示例。
- 实现 Small / Preview / Main Card 和连续 Scene 阅读。
- 统一正文、推荐卡、地图节点的 NavigationOption 导航。
- 支持 Card/Scene 直链、刷新保持和浏览器返回时的 Scene / scrollY 恢复。
- 用本地 Natural Earth SVG MapState 替换 Esri raster tile、hillshade、时间轴及地图控件。
- 重写 V3 静态入口、品牌首页、README、GitHub Pages 路径测试与验收文档。

### 影响

- V3 主路径不再加载 legacy 数据或旧地图运行时。
- 零依赖、零构建，继续支持 `file://` 与 GitHub Pages。
- 首屏静态资源 1.484 MiB，较 main 旧版减少 14.4%。
- 所有历史范围与路线均显式标记为近似教学表达，并保留反地理决定论 caveat。

### 验证

- 46/46 自动化测试通过。
- 所有 V3 运行时文件通过 `node --check`。
- 真实浏览器完成四条规定流程，包括两级 back restoration 与 direct URL refresh。
- 390 × 844 移动端无横向滚动。
- 桌面与移动控制台均为 0 error / 0 warning。
- 无远程 tile、Esri、hillshade、zoom / pan / drag、底图切换或时间轴残留。
- 六张人工验收截图位于 `docs/acceptance/`。

完整记录见 `docs/V3_ACCEPTANCE_REPORT.md`。

### 风险与边界

- 未迁移的旧内容仍保留为 legacy，但不进入 V3 主导航。
- 地图覆盖、路线和节点是近似教学示意，不是精确疆界或控制强度数据。

此 PR 保持 Draft；不在本任务中合并或部署生产。
