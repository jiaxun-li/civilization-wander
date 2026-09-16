import type { Region } from '../schema/index.ts';

// This is a cultural-geographic reading axis, not a list of modern countries
// and not a claim that the regions form exact, mutually exclusive borders.
// Macro regions anchor the future global axis. Only areas needed by the seven
// current V5 modules receive detailed children in this initial catalog.
// Centroids and geometries are intentionally omitted until more specific
// sourced geographic definitions are approved. The current catalog cites the
// existing Natural Earth physical-geography source for every axis region; it
// does not use that citation to claim precise historical boundaries.
const REGION_AXIS_SEEDS = [
  {
    id: 'atlantic-europe',
    name: '大西洋欧洲',
    displayOrder: 1000,
    sourceIds: []
  },
  {
    id: 'iberian-peninsula',
    name: '伊比利亚半岛',
    parentRegionId: 'atlantic-europe',
    displayOrder: 1100,
    sourceIds: []
  },
  {
    id: 'western-central-europe',
    name: '西欧与中欧',
    displayOrder: 2000,
    sourceIds: []
  },
  {
    id: 'central-mediterranean',
    name: '中部与西部地中海',
    displayOrder: 3000,
    sourceIds: []
  },
  {
    id: 'italian-peninsula',
    name: '意大利半岛',
    parentRegionId: 'central-mediterranean',
    displayOrder: 3100,
    sourceIds: []
  },
  {
    id: 'western-mediterranean-islands',
    name: '西地中海岛屿',
    parentRegionId: 'central-mediterranean',
    displayOrder: 3200,
    sourceIds: []
  },
  {
    id: 'north-african-coast',
    name: '北非沿岸',
    parentRegionId: 'central-mediterranean',
    displayOrder: 3300,
    sourceIds: []
  },
  {
    id: 'balkans-aegean',
    name: '巴尔干与爱琴海',
    displayOrder: 4000,
    sourceIds: []
  },
  {
    id: 'balkans',
    name: '巴尔干内陆',
    parentRegionId: 'balkans-aegean',
    displayOrder: 4100,
    sourceIds: []
  },
  {
    id: 'greek-mainland',
    name: '希腊大陆',
    parentRegionId: 'balkans-aegean',
    displayOrder: 4200,
    sourceIds: []
  },
  {
    id: 'aegean-islands',
    name: '爱琴海岛屿',
    parentRegionId: 'balkans-aegean',
    displayOrder: 4300,
    sourceIds: []
  },
  {
    id: 'crete',
    name: '克里特',
    parentRegionId: 'balkans-aegean',
    displayOrder: 4400,
    sourceIds: []
  },
  {
    id: 'anatolia-caucasus',
    name: '安纳托利亚与高加索',
    displayOrder: 5000,
    sourceIds: []
  },
  {
    id: 'western-anatolia',
    name: '西安纳托利亚',
    parentRegionId: 'anatolia-caucasus',
    displayOrder: 5100,
    sourceIds: []
  },
  {
    id: 'central-anatolia',
    name: '中安纳托利亚',
    parentRegionId: 'anatolia-caucasus',
    displayOrder: 5200,
    sourceIds: []
  },
  {
    id: 'eastern-anatolia',
    name: '东安纳托利亚',
    parentRegionId: 'anatolia-caucasus',
    displayOrder: 5300,
    sourceIds: []
  },
  {
    id: 'caucasus',
    name: '高加索',
    parentRegionId: 'anatolia-caucasus',
    displayOrder: 5400,
    sourceIds: []
  },
  {
    id: 'eastern-mediterranean',
    name: '东地中海',
    associationPolicy: 'groupOnly',
    displayOrder: 6000,
    sourceIds: []
  },
  {
    id: 'cyprus',
    name: '塞浦路斯',
    parentRegionId: 'eastern-mediterranean',
    displayOrder: 6100,
    sourceIds: []
  },
  {
    id: 'syria-northern-levant',
    name: '叙利亚与北黎凡特',
    parentRegionId: 'eastern-mediterranean',
    displayOrder: 6200,
    sourceIds: []
  },
  {
    id: 'southern-levant',
    name: '南黎凡特',
    parentRegionId: 'eastern-mediterranean',
    displayOrder: 6300,
    sourceIds: []
  },
  {
    id: 'eastern-mediterranean-sea',
    name: '东地中海海域',
    parentRegionId: 'eastern-mediterranean',
    displayOrder: 6400,
    sourceIds: []
  },
  {
    id: 'mesopotamia',
    name: '两河流域',
    displayOrder: 7000,
    sourceIds: []
  },
  {
    id: 'upper-mesopotamia',
    name: '上美索不达米亚',
    parentRegionId: 'mesopotamia',
    displayOrder: 7100,
    sourceIds: []
  },
  {
    id: 'middle-euphrates',
    name: '中幼发拉底地区',
    parentRegionId: 'mesopotamia',
    displayOrder: 7200,
    sourceIds: []
  },
  {
    id: 'central-mesopotamia',
    name: '中部美索不达米亚',
    parentRegionId: 'mesopotamia',
    displayOrder: 7300,
    sourceIds: []
  },
  {
    id: 'southern-mesopotamia',
    name: '南美索不达米亚',
    parentRegionId: 'mesopotamia',
    displayOrder: 7400,
    sourceIds: []
  },
  {
    id: 'persian-gulf',
    name: '波斯湾沿岸与海域',
    parentRegionId: 'mesopotamia',
    displayOrder: 7500,
    sourceIds: []
  },
  {
    id: 'nile-northeast-africa',
    name: '尼罗河与东北非',
    displayOrder: 8000,
    sourceIds: []
  },
  {
    id: 'nile-delta',
    name: '尼罗河三角洲',
    parentRegionId: 'nile-northeast-africa',
    displayOrder: 8100,
    sourceIds: []
  },
  {
    id: 'nile-valley',
    name: '尼罗河谷',
    parentRegionId: 'nile-northeast-africa',
    displayOrder: 8200,
    sourceIds: []
  },
  {
    id: 'nubia',
    name: '努比亚',
    parentRegionId: 'nile-northeast-africa',
    displayOrder: 8300,
    sourceIds: []
  },
  {
    id: 'red-sea-coast',
    name: '红海沿岸',
    parentRegionId: 'nile-northeast-africa',
    displayOrder: 8400,
    sourceIds: []
  },
  {
    id: 'arabia-eastern-africa',
    name: '阿拉伯与东非',
    displayOrder: 9000,
    sourceIds: []
  },
  {
    id: 'arabian-peninsula',
    name: '阿拉伯半岛',
    parentRegionId: 'arabia-eastern-africa',
    displayOrder: 9100,
    sourceIds: []
  },
  {
    id: 'iran-central-asia',
    name: '伊朗与中亚',
    displayOrder: 10000,
    sourceIds: []
  },
  {
    id: 'zagros-mountains',
    name: '扎格罗斯山区',
    parentRegionId: 'iran-central-asia',
    displayOrder: 10100,
    sourceIds: []
  },
  {
    id: 'iranian-plateau',
    name: '伊朗高原',
    parentRegionId: 'iran-central-asia',
    displayOrder: 10200,
    sourceIds: []
  },
  {
    id: 'central-asian-oases',
    name: '中亚绿洲带',
    parentRegionId: 'iran-central-asia',
    displayOrder: 10300,
    sourceIds: []
  },
  {
    id: 'eurasian-steppe',
    name: '欧亚草原带',
    parentRegionId: 'iran-central-asia',
    displayOrder: 10400,
    sourceIds: []
  },
  {
    id: 'south-asia',
    name: '南亚',
    displayOrder: 11000,
    sourceIds: []
  },
  {
    id: 'indus-basin',
    name: '印度河流域',
    parentRegionId: 'south-asia',
    displayOrder: 11100,
    sourceIds: []
  },
  {
    id: 'south-asia-northwest',
    name: '南亚西北部',
    parentRegionId: 'south-asia',
    displayOrder: 11200,
    sourceIds: []
  },
  {
    id: 'ganges-basin',
    name: '恒河流域',
    parentRegionId: 'south-asia',
    displayOrder: 11300,
    sourceIds: []
  },
  {
    id: 'deccan-plateau',
    name: '德干高原',
    parentRegionId: 'south-asia',
    displayOrder: 11400,
    sourceIds: []
  },
  {
    id: 'sri-lanka',
    name: '斯里兰卡岛',
    parentRegionId: 'south-asia',
    displayOrder: 11500,
    sourceIds: []
  },
  {
    id: 'southeast-asia',
    name: '东南亚',
    displayOrder: 12000,
    sourceIds: []
  },
  {
    id: 'east-asia',
    name: '东亚',
    displayOrder: 13000,
    sourceIds: []
  },
  {
    id: 'upper-yellow-river-hexi',
    name: '黄河上游与河西走廊',
    parentRegionId: 'east-asia',
    displayOrder: 13100,
    sourceIds: []
  },
  {
    id: 'middle-yellow-river',
    name: '黄河中游',
    parentRegionId: 'east-asia',
    displayOrder: 13200,
    sourceIds: []
  },
  {
    id: 'north-china-plain',
    name: '华北平原',
    parentRegionId: 'east-asia',
    displayOrder: 13300,
    sourceIds: []
  },
  {
    id: 'lower-yangtze',
    name: '长江下游',
    parentRegionId: 'east-asia',
    displayOrder: 13400,
    sourceIds: []
  },
  {
    id: 'sichuan-basin',
    name: '四川盆地',
    parentRegionId: 'east-asia',
    displayOrder: 13500,
    sourceIds: []
  },
  {
    id: 'south-china',
    name: '华南',
    parentRegionId: 'east-asia',
    displayOrder: 13600,
    sourceIds: []
  },
  {
    id: 'north-america',
    name: '北美',
    displayOrder: 14000,
    sourceIds: []
  },
  {
    id: 'mesoamerica',
    name: '中部美洲',
    displayOrder: 15000,
    sourceIds: []
  },
  {
    id: 'south-america',
    name: '南美',
    displayOrder: 16000,
    sourceIds: []
  }
] as const;

const REGION_GEOGRAPHY_SOURCE_IDS = ['source-natural-earth'] as const;

export const REGIONS = REGION_AXIS_SEEDS.map(region => ({
  ...region,
  sourceIds: REGION_GEOGRAPHY_SOURCE_IDS
})) satisfies readonly Region[];

export type InitialRegionId = typeof REGIONS[number]['id'];

export const REGION_IDS = REGIONS.map(region => region.id) as readonly InitialRegionId[];
