# 山河与文明：互动文明图谱原型

这是一个无需安装依赖的静态网页原型，以地图和时间轴展示地理、文明、帝国、宗教、语言、贸易与艺术之间的关系。

> 从一个策展问题进入实体 → 沿离散时间状态查看地图与关系 → 切换主视角。

## 现在包含

1. 关中
2. 河西走廊
3. 四川
4. 策展探索“佛教东传”
5. 首页、地图、探索三个全局入口
6. Entity、EntityMoment、RelationEpisode 与 Exploration 数据模型

首页的主要行动直接以 `buddhism-eastward` 策展语境进入佛教实体前500年的状态。佛教、释迦牟尼、阿育王和孔雀帝国共用一个数据驱动的 EntityExplorer：地图从 EntityMoment 读取，时间轴只在离散状态间吸附，相关实体由当前时段的 RelationEpisode 推导。

第一版“佛教东传”七章 Story 与 StoryChapter 数据继续保留用于兼容和资料核对，但旧佛教故事路由会转入新的佛教实体主视角，不再形成第二套主要体验。

每个主题的右栏固定为三个内容区：

- 地理：地形、地质与气候的百科资料摘要；
- 地理与历史：地缘政治机制、历史实例和防止地理决定论的限制；
- 历史：经过策展的重大历史事件年表。

首页采用二级地图交互：先显示 Web Mercator 世界平面图，点击关中、河西走廊或四川后进入区域详情。世界层支持 1×、2×、4×、8×、16× 缩放，东西方向循环，上下方向在地图范围内拖动；普通滚轮交还页面滚动，Ctrl/Command + 滚轮用于地图缩放。顶部“总览”可返回第一层并重新定位东亚。

三个主题现在还包含一条经过策展的重大历史事件年表：

- 关中：14 个关键转折，从周人营建丰镐到西安事变；
- 河西走廊：15 个关键转折，从早期族群角逐到清代重整西北交通；
- 四川盆地：16 个关键转折，从宝墩、三星堆到成渝铁路。

年表不是当地发生过的全部事件。收录标准是：事件是否显著改变区域的政治地位、交通和补给网络、生产基础、出入通道或社会结构。每条事件都说明“为何重要”，并链接到相应来源；年代存在争议时使用“约”或时间范围，避免制造虚假的精确性。

## 打开方式

最简单：直接双击 `index.html`。

更稳定的本地方式：

```bash
cd history-geography-prototype
python -m http.server 8000
```

然后在浏览器打开 `http://localhost:8000`。

## 文件结构

- `index.html`：页面骨架
- `styles.css`：界面样式
- `app.js`：地图投影、交互和内容渲染
- `data/content.js`：原有三篇人工策展地区内容（保持原结构）
- `data/knowledge.js`：第一版 Entity、Relation、Story、Topic 与佛教东传长故事（兼容保留）
- `data/entity-network.js`：第二版 Entity、EntityMoment、RelationEpisode 与 Exploration；当前只迁移佛教、释迦牟尼、阿育王和孔雀帝国
- `data/entity-queries.js`：不依赖 DOM 或旧故事的第二版实体网络纯查询函数
- `data/curation.js`：尚未迁移实体及旧 StoryChapter 的兼容策展适配
- `data/world-physical.js`：Natural Earth 海陆与水系的本地 SVG 路径
- `data/region-hydro.js`：当前标注河流的本地 OpenStreetMap 几何
- `data/content.json`：静态数据结构说明
- `assets/east-asia-relief.png`：中国及周边地形底图
- `generate_map.py`：重新生成底图
- `generate_world_vector.py`：重新生成世界物理矢量数据
- `generate_region_hydro.py`：重新获取并生成区域真实河道数据
- `AGENTS.md`：交给 Codex 或其他编码代理时的项目规则
- `CODEX_NEXT_TASK.md`：下一轮开发任务提示词

## 地图和内容说明

- 当前默认底图使用 Esri World Imagery 卫星影像，不叠加行政区划、道路或地名参考层。世界总览和区域详情都可切换到“地理简图”。
- 地理简图以 Esri World Hillshade 的浅色地形阴影呈现山川纹理，并叠加 Natural Earth 1:50m 公共领域海陆、河流与湖泊数据；不再绘制彩色地形块。
- 区域简图使用相同的地形阴影和 Natural Earth 水系，并以 OpenStreetMap 真实河道几何补齐当前地图标注的渭河、泾河、河西内流河和四川主要支流。河西内流河会从 OSM 河网中连接同名河段之间实际存在的河流、溪流与渠道，排除孤立的同名水道；山名落在真实地形纹理上，河名对应真实水系，不绘制人工椭圆、山形线或近似河线。
- 影像署名：Esri、Maxar、Earthstar Geographics 与 GIS User Community。参见 [Esri World Imagery 文档](https://developers.arcgis.com/openlayers/maps/display-multiple-basemap-layers/)。
- 地形阴影：Esri World Hillshade。参见 [World Hillshade 文档](https://doc.arcgis.com/en/data-appliance/latest/imagery-elevation/world-hillshade.htm)。
- 简图数据：Natural Earth 1:50m physical vectors，公共领域。参见 [Natural Earth 使用条款](https://www.naturalearthdata.com/about/terms-of-use/)。
- 区域河道数据：© OpenStreetMap contributors，ODbL。参见 [OpenStreetMap 版权与许可](https://www.openstreetmap.org/copyright)。
- `generate_highres_terrain.py` 和本地区域高程图保留为离线备用方案，不是当前主地图。
- 桌面端固定左侧地图，只滚动右侧内容；窄屏设备恢复普通页面滚动。
- 世界层红色节点和区域层自然地理标注都是近似教学定位；区域地图只保留山脉、河流、盆地、平原、走廊和荒漠等自然地理名称，不显示现代城市或行政区名称。
- 当前内容是第一轮策展稿，已经尽量把事实和推论分开；正式发布前仍需逐条学术审校。

## 数据模型

- 第二版以 `Entity → EntityMoment → RelationEpisode` 为核心。实体正文只有一份；`summary` 与 `overview` 分别供中卡片和主卡片读取，卡片大小不进入数据。
- `EntityMoment` 保存离散时间状态及该状态自己的 GeoJSON 地图要素。时间选择只在 `cursorYear` 之间吸附。
- `Relation` 只确定两个实体、方向和关系类型；随时间变化的动词、说明、来源与地图叠加位于 `RelationEpisode`。
- `Exploration` 只保存入口实体、初始年份、简短策展问题和优先关系，不重复实体正文、关系说明或地图几何。首页通过 `buddhism-eastward` 进入 `entity-buddhism/-500`。
- `getEntityMomentAt`、`getNearestEntityMoment`、`getActiveRelationEpisodes`、`getRelatedEntitiesAt`、`getRelationEpisodeBetween` 和 `resolveEntityEntryYear` 位于 `data/entity-queries.js`。
- 第一版 `Entity`、`Relation`、`Story`、`StoryChapter` 与原有地区数据不迁移也不删除；新实体探索器对已迁移的四个实体只读取第二版网络，其余页面继续走兼容路径。

## 下一步建议

下一批适合迁移的是已经在河西兼容内容中承担明确网络作用、且现有资料较完整的实体：

1. 河西走廊；
2. 敦煌；
3. 丝绸之路；
4. 莫高窟。

迁移前仍应先校订各自的离散时间节点、近似地图范围和关系阶段；当前版本没有为这些实体创建空白的新模型页面。
