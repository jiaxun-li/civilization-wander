# 文明漫游 V3 验收报告

> 验收日期：2026-07-31  
> 最终分支：`codex/v3-refactor`  
> 结论：**PASS**

## 1. 结论

V3 数据、Card/Scene 连续阅读、统一导航、本地 Natural Earth 地图、静态入口和回归测试已经组成一条一致的产品路径。四个核心实体——佛教、释迦牟尼、阿育王、孔雀帝国——完整使用 V3；V1/V2 内容保留为 legacy，但不进入 V3 主导航或运行时依赖。

真实桌面与移动浏览器验收、46 项自动化测试、JavaScript 语法检查和静态资源检查全部通过。未合并 `main`，未部署生产。

## 2. 架构验收

- 数据：`schemaVersion: 3`，包含 Entity、StructuralEdge、Card、Scene、StructureView、NavigationOption、MapState、Geometry、Asset、Source 十类对象。
- 关系：StructuralEdge 是关系事实的唯一来源；Scene 只引用结构视图和导航，不复制关系事实。
- 阅读：Small、Preview、Main Card 共用同一数据模型；Main Card 连续渲染 4–7 个 Scene。
- 激活：IntersectionObserver 激活 Scene，并同步更新 URL、MapState 与 StructureView。
- 导航：正文、推荐卡和地图节点统一经过 NavigationOption。
- 返回：History state 保存 Card、Scene 和 `scrollY`；浏览器返回恢复原阅读位置。
- 直链：`#card/{cardId}/{sceneId}` 可直接打开并在刷新后保持。
- 地图：Scene 的 MapState 是唯一相机/图层来源；Geometry path 按 ID 缓存。
- 静态部署：零运行时依赖、零构建步骤，资源路径同时支持 `file://` 和 GitHub Pages 子路径。

## 3. 内容与语义审查

- 阿育王与孔雀帝国是 `role: ruled`，没有被错误写为 lineage。
- PeopleGroup 没有被写入 LanguageSystem 谱系。
- Context View 策展多种关系，但不新增伪造的 context edge。
- Lineage 示例只展开直接一级，且明确说明语言谱系不是人群血统。
- 所有近似教学 Geometry 明确标注“近似 / 教学 / 示意”。
- 每个核心故事均包含反地理决定论限制或反例。
- 每个核心 Card 引用至少两个可信来源。

## 4. 四个阶段交付

- 数据架构：`0bd016a DATA_SCHEMA_READY: implement V3 data model`
- Card / Scene UI：`c225c1d CARD_UI_READY: implement V3 card reader`
- Natural Earth 地图：`91dd62c MAP_READY: implement local Natural Earth map`
- 集成与 QA：最终集成 commit 在合并后回填

## 5. 自动化测试

执行：

```powershell
node --test tests/data-v3/*.test.js tests/ui-v3/*.test.js tests/map-v3/*.test.js tests/integration/*.test.js tests/e2e/*.test.js
```

结果：**46 passed / 0 failed**

- Data / schema / query：15
- UI：8
- Map：9
- Integration / Pages：10
- E2E 状态流：4

附加检查：

- 所有 V3 运行时 JavaScript 文件通过 `node --check`。
- 入口资源均为相对路径且文件存在。
- 运行时无 bundler、`fetch`、远程 tile、Esri、卫星、hillshade、时间轴或地图控件依赖。
- 页面无 zoom、pan、drag、底图切换监听器。
- reduced-motion 与移动端单栏布局均有自动化覆盖。
- QA 修复：孔雀帝国首屏地图不再显示指向当前 Card 的自链接，并新增回归测试。

## 6. 真实浏览器端到端结果

使用本地静态服务器与 Codex 内置浏览器完成。

### 流程 A

通过：主页 → 佛教概览 → 滚动到“阿育王时期” → MapState 更新为 `map-ashoka-network` → Scene 导航进入阿育王 → 地图节点进入孔雀帝国 → 连续返回。

返回结果：

- 第一次返回：恢复阿育王 Card。
- 第二次返回：恢复 `buddhism-ashoka-period`，实测 `scrollY: 2767`，Scene 仍为 active。

### 流程 B

通过：佛教概览 → “传播网络”相关 Card → 返回佛教概览。

返回后恢复 `buddhism-open-network`，实测 `scrollY: 3448`。

### 流程 C

通过：直接打开 `#card/ashoka-overview/ashoka-edicts`，Card 与 Scene 正确渲染；刷新后 URL、`scene-ashoka-edicts` 与地图状态保持。

### 流程 D

通过：390 × 844 视口中正常纵向阅读，地图改为内容流布局，`scrollWidth <= clientWidth`，无横向滚动；点击仍是进入下一 Card 的主交互，不依赖 Preview hover。

浏览器控制台：桌面与移动检查均为 **0 error / 0 warning**。

## 7. 地图迁移说明

### 从 V3 运行时移除

- Esri World Imagery URL 与 raster tile 计算。
- 卫星图、hillshade、reference/label layer。
- 用户 zoom、pan、drag、底图切换和 GIS 工具栏。
- 时间轴驱动的地图状态。

legacy 文件仍为旧内容保留，但 `index.html` 不再加载。

### Natural Earth 来源与生成方式

- 来源：Natural Earth 1:50m physical vectors。
- 本地生成数据：`data/world-physical.js`。
- V3 适配器：`assets/natural-earth/base.js`。
- 渲染器：`map/v3/map-renderer.js`，使用依赖为零的 SVG path。
- Scene 切换只更新 MapState 图层；底图与 Geometry path 均缓存复用，不重复解析完整数据。

## 8. 性能与网络

| 指标 | 结果 |
| --- | ---: |
| V3 首屏静态资源 | 1,555,709 bytes（1.484 MiB） |
| main 旧版首屏静态资源 | 1,816,377 bytes |
| 减少 | 260,668 bytes（14.4%） |
| 本地浏览器 warm reload | 60 ms |
| Scene → MapState 同步实测 | 736 ms |
| 运行时依赖 | 0 |
| 远程地图 / tile 请求 | 0 |
| 重复完整地图解析 | 0 |
| 桌面 / 移动控制台错误 | 0 |

加载与切换耗时是在本机静态服务器和内置浏览器中测得，用于回归基线，不等同于公网设备实验室数据。

## 9. 人工验收截图

1. `docs/acceptance/01-home-desktop.png` — 桌面首页。
2. `docs/acceptance/02-buddhism-main.png` — 佛教 Main Card。
3. `docs/acceptance/03-buddhism-ashoka-scene.png` — 佛教的阿育王 Scene 与同步地图。
4. `docs/acceptance/04-ashoka-main.png` — 阿育王 Main Card。
5. `docs/acceptance/05-maurya-main.png` — 孔雀帝国 Main Card。
6. `docs/acceptance/06-mobile-buddhism.png` — 移动端佛教阅读页。

## 10. 已知边界

- V3 当前只把四个核心实体和三个用于结构验证的支持实体接入主数据；其余旧内容明确作为 legacy，后续应按 V3 编辑规范逐项迁移。
- 历史范围、路线和节点是明确标注的近似教学覆盖，不应用作精确疆界或控制强度数据。
- Source URL 是书目出处，仅作为数据字段展示；应用不会在运行时自动抓取它们。

## 11. Draft PR

创建后回填 URL；PR 必须保持 Draft，且不合并 `main`。
