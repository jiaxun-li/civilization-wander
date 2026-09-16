# Civilization Wander V6 数据迁移工作区

## 状态

本轮 V6 编辑以简洁为准：铁器仅保留少量代表性地域记录；神话、史诗保留作品
节点和代表成文年代，删除重复传播身份与阶段，不增加展开层级。成文时间不明
时仍保留近似区间。原始迁移来源不删除，审计记录明确标注未纳入的传播材料。
来源以冻结 V5 快照为基底；本轮核对的新增成文年代来源显式列在
`catalogs/sources.ts` 的 `REVIEWED_V6_SOURCES`，不修改冻结快照或实时导入 V5。

`v6/` 是非运行时的数据结构迁移工作区，不是第二套网站运行时。
当前 V5 仍是唯一正式启动、构建和部署到 GitHub Pages 的版本；在另一次
明确批准的运行时切换任务完成前，正式 `index.html`、`src/main.ts`、
`src/app.ts`、`src/data/atlas-data.ts`、常规 V5 构建和 Pages workflow
不得导入本目录。

当前已批准开发一个与正式网站隔离的 V6 知识空间本地预览。它可以通过自己
的 HTML／TypeScript 入口和专用命令，只读消费已经通过门禁的 V6 knowledge
core；它不是 V6 正式网站，不进入 Pages，也不授权迁移 Card、Scene、Asset、
导航或正式查询消费者。当前预览已经实现：运行 `pnpm dev:v6-preview` 会打开
`knowledge-space-preview.html`；生产式本地验收使用 `pnpm check:v6-preview`。

V6 中的未完成模块、候选关系或迁移审计不能通过 V5 renderer 过滤、
查询层跳过或异常压制的方式接入页面。V6 数据即使尚未完整，也不得破坏
V5 的类型检查、测试、正式构建或生产浏览器验收。

## 本阶段范围

本阶段只迁移历史知识结构。`V6KnowledgeCore` 的六个权威集合是：

- `sources`：完整冻结的 V5 Source 目录；
- `regions`：分层 Region 目录；
- `entities`：具有受控类型和唯一概念层的稳定身份；
- `entityPhases`：带时间、Region 关联、Source 与关系回引的分时段状态；
- `events`：已经接受的历史 Event、唯一主要概念层与具有角色的 participant；
- `temporalRelations`：绑定参与方 Phase 的时态关系。

主题模块只拥有 Entity、EntityPhase、Event、TemporalRelation 四个数组；
Source 和 Region 由共享目录通过 `knowledge-core.ts` 注入。除这六个集合外，
本阶段还维护：

- V5 Entity、Event、StructuralEdge 和 Scene 到 V6 结构的机器可读迁移审计。
- 模块注册表汇总的非运行时 `pendingHistoricalProcesses`；它不是第七个
  knowledge-core 集合，也不会进入预览。

V5 Scene 是划分 Phase 的重要证据入口，但不机械地一 Scene 生成一 Phase。
多个 Scene 可以支持同一 Phase；叙事性或不构成独立阶段的 Scene 应在迁移
审计中说明去向。

Event 的 `conceptLayerId` 必须逐项编辑决定。当前复审边界把所有
`historicalProcess` 定义完整保存在机器可读的 `pending` 清单中，但从权威
`events` 和预览中隔离；以后只有明确判定为 Event 的过程才能重新进入核心。
长期环境条件、笼统连续性或为了满足旧 Scene 链接而创建的标签，应改判为真实
EntityPhase、TemporalRelation 或迁移审计，不得靠 renderer 过滤。
覆盖报告中的 `pendingCount` 只表示尚未填写迁移去向的 V5 记录；独立的
`reviewQueue.historicalProcesses` 才表示已完整登记、但等待重新分类的过程数量。

Entity 可以暂时没有 EntityPhase。EntityPhase 没有自己的概念层，只能描述所属
Entity 在有来源支持的时间段内的状态；不得为了通过门禁而创建“长期延续”“持续
重组”或“后来继续存在”之类的填充 Phase。预览始终以 Entity 名称作为主标签，
Phase 标题只作为简短的次级阶段标签。

EntityPhase 还是 Region×时间模型中的空间状态，不是历史叙事章节。新增国王、
战争、改革、兴盛、衰落或传统的“早期／中期／晚期”分法，本身都不能创建新
Phase。政权的相邻 Phase 必须至少增加或减少一个 Region；只把同一 Region 的
角色从 `core` 改成 `associated`，不能冒充疆域扩大或缩小。其他 Entity 的相邻
Phase 至少要改变一个 Region 或 RegionalRole。相邻空间签名相同会被 validator
拒绝并要求合并。若现有 Region 粒度不足以表达有来源支持的变化，应先细化 Region
或暂缓分期，不能只在 Phase 标题里声称变化。标记为
`associationPolicy: 'groupOnly'` 的 Region 只用于分组，EntityPhase 和 Event
不得直接挂载，无法支持子区归属时应暂缓该地域关联。单次发生的建立、战争、
改革、毁灭归入 Event，对象之间的臣属、联盟、征服或影响变化归入
TemporalRelation。

本阶段不迁移：

- Card 和 Scene 的公共正文；
- 图片、Asset、媒体决策与 Asset manifest；
- NavigationOption、NavigationPlacement 和首页策展；
- MapState、Geometry、MapAnnotation、CameraPreset 和正式网站呈现；
- 搜索、筛选以及把三维坐标、节点颜色、形状或动画状态写入 V6 历史核心。

独立本地预览可以从 V6 历史核心派生 renderer-neutral 可视化 read model、
切片坐标和临时布局，但这些派生对象不是权威集合，也不得回写到主题数据。

## 候选优先规则

若关系的目标身份、Entity 类型、历史角色、时间或证据尚不稳定，不得为使
引用通过而创建占位 Entity、悬空 TemporalRelation 或虚构 Phase。应把它
记录为非权威的 `RelationCandidate`，连同 V5 Scene／Event／StructuralEdge
来源、相关 Phase、Source ID、未决问题和审核状态一起保存在迁移工作区。

`RelationCandidate` 不进入 V6 权威 atlas。只有身份、时间、参与者角色和
来源全部稳定后，才可以由唯一 Integration Agent 将其提升为
TemporalRelation，并为所有相关 Phase 接入同一个 Relation ID。

## 目录职责

- `schema/`：V6 类型、受控词表、迁移审计和 validator 契约；
- `catalogs/`：概念层与 Region 的共享目录；
- `data/<module>/`：按原 V5 内容模块迁移的权威历史数据；
- `migration/`：V5 基线、Scene—Phase 映射、迁移决策、候选和 handoff；
- `validation/`：V6 独立 validator；
- `tests/`：共享 schema、目录、引用和聚合测试；
- `module-registry.ts`：模块身份、顺序、目标路径和已验收数据绑定的唯一
  人工维护清单；
- `knowledge-core.ts`：按 registry 聚合已经通过模块门禁的 V6 数据并注入
  共享 Source／Region，不是网站入口。

当前迁移范围的七个模块只在 `module-registry.ts` 维护身份、顺序与数据绑定；
`currentV6KnowledgeCore` 直接消费 registry，不维护第二份模块列表。模块范围
或顺序改变时，唯一 Integration Agent 必须更新 registry 并运行 V6 门禁，
不得在本文、测试说明或其他文档再维护一份模块名称清单。

对象数量和迁移覆盖率不得手写在本文档中，应由只读报告脚本从实际 V5
基线、模块注册表和 V6 数据生成。

## Source 与 Asset

V6 权威数据不得实时依赖 V5 聚合器。迁移工具只读 V5，并把完整 V5 Source
目录冻结在 `migration/baseline/sources-v5.json`；`catalogs/sources.ts` 只导入
这份带 SHA-256 digest 的快照。V6 权威记录和迁移候选引用的 Source ID 必须
存在于该冻结目录。是否裁剪未使用 Source 属于后续独立优化，本阶段不声称
已经裁剪。V5 Source 发生变化时应由 drift check 报告，不能静默改写已审定
的 V6 数据。

本阶段不建立 V6 Asset 集合、不复制图片，也不修改现有图片目录。以后若
迁移媒体，可以复用同一个本地物理文件，但必须作为独立阶段重新审核引用、
许可、manifest 和界面表现。

## 并行所有权

同一时间只能有一个 Integration Agent 管理共享结构，拥有：

- `schema/`、`catalogs/`、Region 和 Source 目录；
- `module-registry.ts`、`knowledge-core.ts`、validator 和共享测试；
- V6 package／CI 接线、全局 ID 与外部引用集成；
- 跨模块 Relation 的最终接线和参与方 Phase 的 relation back-reference。

每个 Migration Agent 只能编辑分配给它的：

- `data/<module>/`；
- 对应的 Scene—Phase、Entity、Event、StructuralEdge 迁移决策；
- 对应的 RelationCandidate、模块测试与 handoff。

共享概念层、Entity 类型、RegionalRole 和 Region 目录冻结后，Migration
Agent 只能引用。若目录不足，应提交机器可读候选，不得自行增加共享类型或
Region。跨模块关系的本体由原 V5 StructuralEdge 所属模块负责迁移一次；
其他参与方需要补充的 `relationIds` 通过 handoff 声明，只由 Integration
Agent 接线。

V6 使用独立的迁移 handoff 契约。不得套用 V5 ContentPack handoff，因为
后者要求 Card、Scene、Asset、媒体决策和十四个 V5 内容集合，不适合本阶段
的纯数据迁移。

## 验证与完成门禁

每个模块先通过自己的 `*.test.ts` 与 isolated validator，再由 Integration
Agent 接入 `currentV6KnowledgeCore`。标准全局结构门禁是：

```powershell
pnpm check:v6
```

它执行 V6 TypeScript 检查、共享及模块测试和独立 validator。迁移覆盖率不在
这个命令中，必须另行执行：

```powershell
pnpm report:v6-coverage --require-complete
```

只有结构门禁通过，且 coverage 报告同时给出 `valid: true`、`complete: true`，
本阶段才完成。报告脚本从实际 V5 基线、迁移台账和 V6 数据生成对象数量、
覆盖率与未决项；不得把某次输出抄进文档长期维护。

## 独立知识空间预览

知识空间预览的权威视觉契约见
`../docs/KNOWLEDGE_SPACE_VISUALIZATION.md`。本轮目标只实现 Region×时间、
固定单一概念层的二维切片。三种切片的数据契约可以同时建立，但另外两种
切片和 3D 总览不进入第一轮界面。

预览必须遵守以下边界：

- 只读消费已经接入 `currentV6KnowledgeCore` 且通过 V6 门禁的数据；
- 使用独立入口、独立构建边界和专用本地启动命令；
- 不被正式 `index.html`、`src/main.ts`、`src/app.ts` 或
  `src/data/atlas-data.ts` 导入；
- 不进入正式 `pnpm build` 的 Pages 产物，也不修改 Pages workflow；
- 不渲染 TemporalRelation、RelationCandidate、Card／Scene 正文、图片或导航；
- 不在 renderer 中静默过滤、修复或猜测无效 V6 数据；
- 以稳定 fixture 完成 UI 和布局测试，完整 knowledge core 只用于最终集成验收。

预览数据流为：

```text
V6 knowledge core
→ renderer-neutral knowledge-space marks
→ slice projection
→ local layout
→ SVG preview
```

未来 3D 总览应复用同一批 marks 和 slice selection，不把 SVG 路径当作数据源，
也不要求第一版引入 Three.js 或其他运行时依赖。

## 后续切换边界

完成本阶段只表示 V6 历史数据结构可以独立验证；完成独立知识空间预览也只
表示这些数据可以被隔离地探索，二者都不表示网站已经升级。正式切换必须
另开任务，依次完成 V6 查询层、Card／Scene／Asset 迁移、官方 UI 消费者和
运行时接线，以及生产构建与完整浏览器验收。只有用户批准最终切换后，才允许
更改正式 V5 聚合器和 Pages 部署入口；在此之前始终保留 V5 为唯一正式运行时，
正式 V5 内容生产的三阶段工作流也保持不变。
