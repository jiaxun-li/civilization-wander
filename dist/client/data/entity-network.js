/**
 * 山河与文明 · 第二版实体网络
 *
 * 本文件只保存实体事实、离散时间状态、关系阶段与策展入口。旧版 Story、
 * StoryChapter、Entity 和 Relation 继续保留在 knowledge.js，供旧页面兼容使用。
 *
 * 纪年约定：公元前为负数，公元后为正数，不使用 0 年。
 *
 * @typedef {'exact'|'approximate'|'contested'} TimePrecision
 * @typedef {'region'|'geographicFeature'|'civilization'|'polity'|'empire'|'peopleGroup'|'religion'|'philosophy'|'language'|'languageFamily'|'writingSystem'|'technology'|'tradeRoute'|'commodity'|'artStyle'|'architectureStyle'|'event'|'person'|'city'|'story'|'pattern'} EntityType
 * @typedef {'founded_tradition'|'patronized'|'ruled'|'political_context'} RelationType
 * @typedef {{start:number|null,end:number|null,label:string,precision?:TimePrecision}} TimeSpan
 * @typedef {'Point'|'LineString'|'Polygon'|'MultiPoint'|'MultiLineString'|'MultiPolygon'} GeoJSONGeometryType
 * @typedef {{type:GeoJSONGeometryType,coordinates:*}} GeoJSONGeometry
 * @typedef {{id:string,kind:'origin'|'presence'|'route'|'area',geometry:GeoJSONGeometry,label?:string,approximate?:boolean}} EntityMomentFeature
 * @typedef {{id:string,time:TimeSpan,cursorYear:number,title:string,summary:string,map:{view?:{center:[number,number],zoom:number},features:EntityMomentFeature[]},featuredRelationIds?:string[]}} EntityMoment
 * @typedef {{id:string,type:EntityType,name:string,alternativeNames?:string[],content:{tagline?:string,summary:string,overview:string,image?:string},existence?:TimeSpan,moments:EntityMoment[],sourceIds:string[],tags?:string[]}} Entity
 * @typedef {{id:string,time:TimeSpan,verb:{forward:string,reverse?:string},summary:string,detail?:string,importance?:number,mapOverlay?:{geometry:GeoJSONGeometry,approximate?:boolean},sourceIds:string[]}} RelationEpisode
 * @typedef {{id:string,sourceId:string,targetId:string,type:RelationType,episodes:RelationEpisode[]}} Relation
 * @typedef {{id:string,title:string,question:string,contextQuestion?:string,introduction?:string,entry:{entityId:string,year:number},featuredMoments?:Array<{entityId:string,momentId:string,relationIds?:string[]}>}} Exploration
 */

(function exposeEntityNetwork(root, factory) {
  const network = factory();
  if (root) root.ATLAS_ENTITY_NETWORK = network;
  if (typeof module === 'object' && module.exports) module.exports = network;
}(typeof window !== 'undefined' ? window : globalThis, function createEntityNetwork() {
  /** @type {{schemaVersion:number,entities:Entity[],relations:Relation[],explorations:Exploration[]}} */
  return {
    schemaVersion: 2,
    entities: [
      {
        id: 'buddhism',
        type: 'religion',
        name: '佛教',
        content: {
          tagline: '从恒河流域的修行传统，到跨区域的多种佛教传统',
          summary: '约在公元前一千纪中叶形成于南亚，后来由僧团、信众、政治赞助、交通网络与翻译实践共同推动，发展为分布于亚洲多地的多种传统。',
          overview: '佛教传统以释迦牟尼的教导为重要起点。早期僧团活动于恒河流域的城镇与交通网络中；到阿育王时期，王权护持、公共铭文和孔雀帝国的广域联系提高了佛教的公共可见度与跨地区活动能力。这些地理与政治条件降低了交流成本，却不能决定信仰会被谁接受、如何解释或向何处传播；地方僧团、在家信众和后续政权仍各自发挥作用。'
        },
        existence: {
          start: -500,
          end: null,
          label: '约公元前5世纪至今',
          precision: 'approximate'
        },
        moments: [
          {
            id: 'buddhism-ganges-formation',
            time: {
              start: -600,
              end: -400,
              label: '约公元前6—前5世纪',
              precision: 'approximate'
            },
            cursorYear: -500,
            title: '恒河流域的形成阶段',
            summary: '早期佛教在北印度恒河流域的城镇、游行讲学与僧团网络中逐步形成；地图只标示活动环境，不把河流或平原视为宗教产生的决定原因。',
            map: {
              view: { center: [83.5, 25.8], zoom: 4 },
              features: [
                {
                  id: 'buddhism-origin-middle-ganges',
                  kind: 'origin',
                  geometry: { type: 'Point', coordinates: [85.1, 25.6] },
                  label: '恒河中游活动区域（教学定位）',
                  approximate: true
                },
                {
                  id: 'buddhism-early-ganges-context',
                  kind: 'route',
                  geometry: {
                    type: 'LineString',
                    coordinates: [[80.3, 25.4], [83.0, 25.7], [85.1, 25.6]]
                  },
                  label: '早期活动环境（近似教学连线）',
                  approximate: true
                }
              ]
            },
            featuredRelationIds: ['shakyamuni-buddhism']
          },
          {
            id: 'buddhism-ashoka-maurya',
            time: {
              start: -268,
              end: -232,
              label: '约公元前268—前232年',
              precision: 'approximate'
            },
            cursorYear: -260,
            title: '阿育王与孔雀帝国时期',
            summary: '阿育王时期的护持与铭文扩大了佛教的公共可见度和联系尺度，但不能把后来佛教在亚洲的传播都归因于一位君主或一个帝国。',
            map: {
              view: { center: [79.5, 24.6], zoom: 4 },
              features: [
                {
                  id: 'buddhism-presence-pataliputra',
                  kind: 'presence',
                  geometry: { type: 'Point', coordinates: [85.14, 25.61] },
                  label: '华氏城'
                },
                {
                  id: 'buddhism-presence-sanchi',
                  kind: 'presence',
                  geometry: { type: 'Point', coordinates: [77.74, 23.48] },
                  label: '桑奇'
                },
                {
                  id: 'buddhism-ashoka-network',
                  kind: 'route',
                  geometry: {
                    type: 'LineString',
                    coordinates: [[85.14, 25.61], [80.0, 24.8], [77.74, 23.48]]
                  },
                  label: '护持与公共传播的联系范围（近似教学连线）',
                  approximate: true
                }
              ]
            },
            featuredRelationIds: [
              'ashoka-buddhism',
              'maurya-buddhism',
              'ashoka-maurya'
            ]
          }
        ],
        sourceIds: ['britannica-buddha', 'britannica-ashoka'],
        tags: ['宗教', '思想', '南亚', '传播']
      },
      {
        id: 'shakyamuni',
        type: 'person',
        name: '释迦牟尼',
        alternativeNames: ['乔达摩·悉达多', '佛陀'],
        content: {
          tagline: '年代有争议的早期佛教传统核心人物',
          summary: '佛教传统的核心人物；其生平与活动年代无法用一组无争议的精确年份表示。',
          overview: '释迦牟尼的教导和围绕他的记忆构成佛教传统的重要起点。不同史料传统与现代研究对其生卒、活动年代有不同判断，因此这里使用公元前6—前5世纪的宽范围状态，而不制造精确日期。恒河流域的城镇和交通环境有助于游行讲学与共同体形成，但思想内容及其延续仍来自人的实践与选择，而不是地理环境自动产生。'
        },
        existence: {
          start: -600,
          end: -400,
          label: '约公元前6—前5世纪（年代有争议）',
          precision: 'contested'
        },
        moments: [
          {
            id: 'shakyamuni-teaching-life',
            time: {
              start: -600,
              end: -400,
              label: '约公元前6—前5世纪（年代有争议）',
              precision: 'contested'
            },
            cursorYear: -500,
            title: '游行与教导的宽时间范围',
            summary: '以宽范围表达其在北印度活动的传统记忆；点位与路线均为教学定位，不代表可精确复原的个人行程。',
            map: {
              view: { center: [83.5, 26.4], zoom: 5 },
              features: [
                {
                  id: 'shakyamuni-presence-north-india',
                  kind: 'presence',
                  geometry: { type: 'Point', coordinates: [83.0, 27.5] },
                  label: '北印度活动区域（教学定位）',
                  approximate: true
                },
                {
                  id: 'shakyamuni-teaching-context',
                  kind: 'route',
                  geometry: {
                    type: 'LineString',
                    coordinates: [[83.0, 27.5], [85.1, 25.6], [80.3, 25.4]]
                  },
                  label: '游行与教导环境（近似教学连线）',
                  approximate: true
                }
              ]
            },
            featuredRelationIds: ['shakyamuni-buddhism']
          }
        ],
        sourceIds: ['britannica-buddha'],
        tags: ['宗教人物', '南亚', '年代争议']
      },
      {
        id: 'ashoka',
        type: 'person',
        name: '阿育王',
        alternativeNames: ['无忧王'],
        content: {
          tagline: '把王权、公共铭文与宗教护持联系起来的孔雀帝国君主',
          summary: '约公元前268—前232年在位的孔雀帝国君主，以敕令、公共伦理主张及对佛教的护持著称。',
          overview: '阿育王借助孔雀帝国的行政联系与公共铭文表达政治伦理，并对佛教僧团和宗教活动提供护持。现有证据支持他显著提高佛教的公共可见度，却不足以把所有后续传播写成由君主单向发动的计划。帝国尺度提供资源和联系条件，地方共同体、语言差异与后来的历史行动仍决定这些条件如何被使用。'
        },
        existence: {
          start: -304,
          end: -232,
          label: '约公元前304—前232年',
          precision: 'approximate'
        },
        moments: [
          {
            id: 'ashoka-reign',
            time: {
              start: -268,
              end: -232,
              label: '约公元前268—前232年',
              precision: 'approximate'
            },
            cursorYear: -260,
            title: '统治、敕令与佛教护持',
            summary: '在位时期是理解阿育王、孔雀帝国和佛教关系的主要离散状态；地图不把敕令地点连成精确行政边界。',
            map: {
              view: { center: [79.5, 24.6], zoom: 4 },
              features: [
                {
                  id: 'ashoka-presence-pataliputra',
                  kind: 'presence',
                  geometry: { type: 'Point', coordinates: [85.14, 25.61] },
                  label: '华氏城'
                },
                {
                  id: 'ashoka-edict-context',
                  kind: 'route',
                  geometry: {
                    type: 'LineString',
                    coordinates: [[85.14, 25.61], [77.74, 23.48], [70.5, 21.5]]
                  },
                  label: '敕令与政治联系的教学示意',
                  approximate: true
                }
              ]
            },
            featuredRelationIds: [
              'ashoka-buddhism',
              'ashoka-maurya',
              'maurya-buddhism'
            ]
          }
        ],
        sourceIds: ['britannica-ashoka'],
        tags: ['统治者', '孔雀帝国', '铭文', '佛教护持']
      },
      {
        id: 'maurya',
        type: 'empire',
        name: '孔雀帝国',
        alternativeNames: ['Maurya Empire'],
        content: {
          tagline: '把恒河流域与南亚多地置于广域政治联系中的早期帝国',
          summary: '约公元前321—前185年存在的南亚帝国；其统治范围与各地控制强度在不同时期并不相同。',
          overview: '孔雀帝国以恒河流域的政治中心组织广域统治，并在阿育王时期通过铭文和行政联系留下尤其可见的证据。这里的地图范围只是近似教学叠加层，不声称复原固定边界。帝国网络能够改变人员、信息与赞助跨区流动的尺度，但并不会自动造成宗教传播，也不能抹平各地社会和政治差异。'
        },
        existence: {
          start: -321,
          end: -185,
          label: '约公元前321—前185年',
          precision: 'approximate'
        },
        moments: [
          {
            id: 'maurya-imperial-network',
            time: {
              start: -321,
              end: -185,
              label: '约公元前321—前185年',
              precision: 'approximate'
            },
            cursorYear: -260,
            title: '广域统治网络',
            summary: '用一个宽时间状态表示孔雀帝国存续期；范围轮廓为近似教学叠加，不能视为全时期不变的疆界。',
            map: {
              view: { center: [79.0, 24.0], zoom: 4 },
              features: [
                {
                  id: 'maurya-core-pataliputra',
                  kind: 'presence',
                  geometry: { type: 'Point', coordinates: [85.14, 25.61] },
                  label: '华氏城'
                },
                {
                  id: 'maurya-presence-taxila',
                  kind: 'presence',
                  geometry: { type: 'Point', coordinates: [72.84, 33.74] },
                  label: '西北联系节点（教学定位）',
                  approximate: true
                },
                {
                  id: 'maurya-approximate-extent',
                  kind: 'area',
                  geometry: {
                    type: 'Polygon',
                    coordinates: [[
                      [69.0, 31.5],
                      [74.0, 35.0],
                      [86.5, 28.5],
                      [87.5, 21.5],
                      [78.0, 16.0],
                      [70.0, 21.0],
                      [69.0, 31.5]
                    ]]
                  },
                  label: '孔雀帝国活动范围（近似教学叠加）',
                  approximate: true
                }
              ]
            },
            featuredRelationIds: [
              'ashoka-maurya',
              'maurya-buddhism'
            ]
          }
        ],
        sourceIds: ['britannica-ashoka'],
        tags: ['帝国', '南亚', '广域统治', '近似范围']
      }
    ],
    relations: [
      {
        id: 'shakyamuni-buddhism',
        sourceId: 'shakyamuni',
        targetId: 'buddhism',
        type: 'founded_tradition',
        episodes: [
          {
            id: 'shakyamuni-buddhism-teaching',
            time: {
              start: -600,
              end: -400,
              label: '约公元前6—前5世纪（年代有争议）',
              precision: 'contested'
            },
            verb: {
              forward: '其教导成为传统的重要起点',
              reverse: '以其教导为重要起点'
            },
            summary: '佛教传统把释迦牟尼的教导视为核心起点；具体活动年代存在争议。',
            detail: '这里描述传统形成关系，不把复杂宗教共同体简化为单一人物一次创立的事件。',
            importance: 5,
            sourceIds: ['britannica-buddha']
          }
        ]
      },
      {
        id: 'ashoka-buddhism',
        sourceId: 'ashoka',
        targetId: 'buddhism',
        type: 'patronized',
        episodes: [
          {
            id: 'ashoka-buddhism-patronage',
            time: {
              start: -260,
              end: -232,
              label: '约公元前260—前232年',
              precision: 'approximate'
            },
            verb: {
              forward: '护持并提高其公共可见度',
              reverse: '获得其护持并扩大公共可见度'
            },
            summary: '阿育王的护持、敕令与帝国联系扩大了佛教的公共可见度和活动尺度。',
            detail: '这不是佛教后来跨越亚洲传播的单一原因，也不表示帝国内部只有一种宗教实践。',
            importance: 5,
            mapOverlay: {
              geometry: {
                type: 'LineString',
                coordinates: [[85.14, 25.61], [80.0, 24.8], [77.74, 23.48]]
              },
              approximate: true
            },
            sourceIds: ['britannica-ashoka']
          }
        ]
      },
      {
        id: 'ashoka-maurya',
        sourceId: 'ashoka',
        targetId: 'maurya',
        type: 'ruled',
        episodes: [
          {
            id: 'ashoka-maurya-reign',
            time: {
              start: -268,
              end: -232,
              label: '约公元前268—前232年',
              precision: 'approximate'
            },
            verb: {
              forward: '统治',
              reverse: '由其统治'
            },
            summary: '阿育王在位时期是孔雀帝国留下敕令与公共政治表达最可见的阶段之一。',
            detail: '帝国范围和实际控制强度随地区与时期不同，近似范围不应理解为固定国界。',
            importance: 5,
            sourceIds: ['britannica-ashoka']
          }
        ]
      },
      {
        id: 'maurya-buddhism',
        sourceId: 'maurya',
        targetId: 'buddhism',
        type: 'political_context',
        episodes: [
          {
            id: 'maurya-buddhism-early-context',
            time: {
              start: -321,
              end: -269,
              label: '约公元前321—前269年',
              precision: 'approximate'
            },
            verb: {
              forward: '构成其早期发展的政治环境之一',
              reverse: '存在于其广域政治环境中'
            },
            summary: '佛教社群处在孔雀帝国形成和扩张的政治环境中，但这一阶段不宜概括为统一的帝国佛教政策。',
            detail: '关系只表示共享的政治时空背景，不主张帝国建立直接导致佛教发展。',
            importance: 2,
            sourceIds: ['britannica-buddha', 'britannica-ashoka']
          },
          {
            id: 'maurya-buddhism-ashoka-phase',
            time: {
              start: -268,
              end: -232,
              label: '约公元前268—前232年',
              precision: 'approximate'
            },
            verb: {
              forward: '通过阿育王时期的网络放大其公共活动',
              reverse: '借其阿育王时期网络扩大公共活动'
            },
            summary: '阿育王时期，孔雀帝国的政治联系、铭文与赞助提高了佛教跨地区活动的能力。',
            detail: '帝国提供联系尺度而非预定传播结果；地方僧团、语言和信众选择仍然关键。',
            importance: 4,
            mapOverlay: {
              geometry: {
                type: 'LineString',
                coordinates: [[85.14, 25.61], [80.0, 24.8], [72.84, 33.74]]
              },
              approximate: true
            },
            sourceIds: ['britannica-buddha', 'britannica-ashoka']
          },
          {
            id: 'maurya-buddhism-late-context',
            time: {
              start: -231,
              end: -185,
              label: '约公元前231—前185年',
              precision: 'approximate'
            },
            verb: {
              forward: '继续构成其活动的政治环境之一',
              reverse: '继续存在于其政治环境中'
            },
            summary: '阿育王之后，佛教与帝国政治环境的关系继续存在，但不能假定护持方式和强度保持不变。',
            detail: '这一阶段使用克制表述，避免把阿育王时期的证据直接外推到整个孔雀帝国晚期。',
            importance: 2,
            sourceIds: ['britannica-buddha', 'britannica-ashoka']
          }
        ]
      }
    ],
    explorations: [
      {
        id: 'buddhism-eastward',
        title: '佛教东传',
        question: '一个产生于印度北部的宗教，为什么会成为东亚文明的重要组成部分？',
        contextQuestion: '佛教为什么传播到东亚？',
        introduction: '从佛教实体进入，在离散时间节点上查看人物、帝国与宗教关系如何变化。旧版长故事仍保留，但不再是实体正文、关系说明或实体地图的来源。',
        entry: {
          entityId: 'buddhism',
          year: -500
        },
        featuredMoments: [
          {
            entityId: 'buddhism',
            momentId: 'buddhism-ganges-formation',
            relationIds: ['shakyamuni-buddhism']
          },
          {
            entityId: 'buddhism',
            momentId: 'buddhism-ashoka-maurya',
            relationIds: ['ashoka-buddhism', 'maurya-buddhism']
          },
          {
            entityId: 'ashoka',
            momentId: 'ashoka-reign',
            relationIds: ['ashoka-buddhism', 'ashoka-maurya']
          },
          {
            entityId: 'maurya',
            momentId: 'maurya-imperial-network',
            relationIds: ['ashoka-maurya', 'maurya-buddhism']
          }
        ]
      }
    ]
  };
}));
