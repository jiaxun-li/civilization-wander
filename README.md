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

最简单的方式是直接双击 `index.html`。

也可以使用任意静态文件服务器：

```powershell
python -m http.server 8000
```

然后打开 `http://localhost:8000/`。

项目使用原生 HTML、CSS 和 JavaScript，不需要构建步骤或运行时依赖；核心体验同时支持 `file://` 与 GitHub Pages。

## 验证

项目使用 Node.js 内置测试工具，不需要安装项目依赖：

```powershell
npm test
npm run check:syntax
npm run check:manifests
npm run check:pages
```

查看当前运行时数据的实时统计：

```powershell
npm run report:counts
```

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
