# 文明漫游

> 从一个人物、城市、信仰或作品出发，沿着经过策展的关联漫游人类文明。

[在线体验 Civilization Wander](https://jiaxun-li.github.io/civilization-wander/)

文明漫游是一个以故事为中心的历史探索原型。读者可以连续阅读当前故事，在人物、事件、制度、共同体、观念和作品之间发现有叙事意义的联系，再选择下一段历史视角。

地图和图像只在能够帮助理解时出现。它不是旅游地图、百科全书目录或自动生成的知识图谱，而是一条条经过研究、编辑和审核的阅读路径。

## 主要体验

- 连续阅读一个完整故事，并在相关段落之间自然滚动；
- 通过正文入口和结尾推荐进入另一段历史；
- 按需呈现本地图像、地图和结构视图；
- 支持故事直达链接、浏览器前进后退和阅读位置恢复；
- 支持桌面与手机阅读，不依赖远程字体、地图或内容接口。

## 本地运行

需要 Node.js 20.19 或更高版本。首次运行先安装开发依赖：

```powershell
corepack enable
pnpm install
```

启动带自动刷新的本地预览：

```powershell
pnpm dev
```

终端会显示可访问地址，通常是 `http://localhost:5173/civilization-wander/`。修改入口、样式或脚本后，浏览器会自动更新。

检查正式构建时使用：

```powershell
pnpm build
pnpm preview
```

`pnpm build` 生成 `dist/`，`pnpm preview` 用本地服务器预览与 GitHub Pages 相同的产物。`dist/` 是临时构建目录，不提交到仓库。项目使用 Vite 和渐进式 TypeScript 作为开发底座；现有 V5 数据 schema、原生界面模块和本地内容资源保持不变，正式页面没有远程内容、地图、字体或图片依赖。

## 验证

安装依赖后可运行：

```powershell
pnpm typecheck
pnpm test
pnpm run check:syntax
pnpm run check:manifests
pnpm run check:pages
pnpm build
```

查看当前运行时数据的实时统计：

```powershell
pnpm run report:counts
```

推送到 `main` 后，GitHub Actions 会测试、构建并发布 `dist/`。仓库的 Pages 来源需要设置为 **GitHub Actions**，不再直接发布仓库根目录。

## 项目文档

README 只提供项目入口。架构、内容生产和审核规则以下列文档为准：

| 文档 | 用途 |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Coding Agent 必须遵守的产品、数据和集成规则 |
| [架构与数据模型](docs/ARCHITECTURE_AND_DATA_MODEL.md) | 活动运行时、V5 数据模型、调用链、验证边界与文件职责 |
| [内容包新增指南](docs/CONTENT_PACK_AND_AUTHORING_WORKFLOW.md) | 研究、写作、媒体、置入和验收的三阶段工作流 |
| [内容包空白模板](docs/CONTENT_PACK_TEMPLATE.md) | 每次内容任务使用的分阶段交付模板 |
| [叙事画风格规范](docs/AI_NARRATIVE_ILLUSTRATION_STYLE_GUIDE.md) | AI 与编辑性叙事图片的视觉原则和验收标准 |
| [V5 素材元数据审计](docs/V5_ASSET_METADATA_AUDIT.md) | 当前图片许可、来源和元数据复核记录 |

新增历史内容应先阅读内容包新增指南并使用空白模板；修改运行时结构或数据契约时，应以架构文档、validator、测试和实际入口为共同依据。
