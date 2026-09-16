import type { ConceptLayerDefinition } from '../schema/index.ts';

// The third axis of the V6 knowledge space. Every authoritative Entity has
// exactly one primary layer; cross-layer appearances are derived from actual
// relations, not secondary classification tags.
export const CONCEPT_LAYERS = [
  {
    id: 'materialAndArchitecture',
    label: '建筑与文物',
    order: 1,
    description: '具体建筑、纪念物、器物、石碑、泥板文书与其他文物；艺术传统与文学作品归艺术与文学。'
  },
  {
    id: 'placeAndSite',
    label: '城市与遗址',
    order: 2,
    description: '城市、聚落、港口、考古遗址、河流、山地与其他稳定的地理对象。'
  },
  {
    id: 'eventAndConflict',
    label: '战争与事件',
    order: 3,
    description: '战争、征服、毁灭、迁徙、灾害与政治转折等发生在时间中的事件或过程。'
  },
  {
    id: 'polityAndSociety',
    label: '政权与制度',
    order: 4,
    description: '王国、帝国、共同体、宫殿、神庙、行政制度与主要作用在政治社会领域的人物。'
  },
  {
    id: 'technologyAndExchange',
    label: '技术与交换',
    order: 5,
    description: '农业、冶金、工程、计量、作坊、生产体系、贸易网络与以这些活动著称的人物。'
  },
  {
    id: 'languageAndKnowledge',
    label: '语言与文字',
    order: 6,
    description: '各地区使用的语言与书写系统；具体文献实物归建筑与文物，作为语言与文字的证据。'
  },
  {
    id: 'artAndLiterature',
    label: '艺术与文学',
    order: 7,
    description: '造型艺术、图像传统、诗歌、史诗、叙事、表演及主要作用在这些领域的人物。'
  },
  {
    id: 'religionAndThought',
    label: '宗教与思想',
    order: 8,
    description: '神祇、仪式、宗教与神话传统、宇宙观、哲学思想及主要作用在这些领域的人物。'
  }
] as const satisfies readonly ConceptLayerDefinition[];

export type CatalogConceptLayerId = typeof CONCEPT_LAYERS[number]['id'];
