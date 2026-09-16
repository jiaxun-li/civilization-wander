import type { V6KnowledgeModule } from './knowledge-core.ts';
import type { PendingHistoricalProcessReview } from './schema/index.ts';
import { aegeanPendingHistoricalProcesses, aegeanV6Data } from './data/aegean/index.ts';
import { ancientChinaPendingHistoricalProcesses, ancientChinaV6Data } from './data/ancient-china/index.ts';
import { ancientEgyptPendingHistoricalProcesses, ancientEgyptV6Data } from './data/ancient-egypt/index.ts';
import { ancientIndiaPendingHistoricalProcesses, ancientIndiaV6Data } from './data/ancient-india/index.ts';
import { ironAgeNearEastPendingHistoricalProcesses, ironAgeNearEastV6Data } from './data/iron-age-near-east/index.ts';
import { lateBronzeAgePendingHistoricalProcesses, lateBronzeAgeV6Data } from './data/late-bronze-age/index.ts';
import { mesopotamiaPendingHistoricalProcesses, mesopotamiaV6Data } from './data/mesopotamia/index.ts';

export interface V6ModuleRegistryEntry {
  readonly id: string;
  readonly label: string;
  readonly order: number;
  readonly v5File: `data/${string}.ts`;
  readonly v6File: `v6/data/${string}/index.ts`;
  readonly exportedBinding: string;
  readonly data: V6KnowledgeModule;
  readonly pendingHistoricalProcesses: readonly PendingHistoricalProcessReview[];
}

// This is the single identity, ordering, and accepted-data registry for V6
// migration modules. Only modules that passed their isolated gate may be
// imported here; the V5 runtime never imports this registry.
export const V6_MODULE_REGISTRY = [
  {
    id: 'mesopotamia',
    label: '美索不达米亚',
    order: 100,
    v5File: 'data/mesopotamia.ts',
    v6File: 'v6/data/mesopotamia/index.ts',
    exportedBinding: 'mesopotamiaV6Data',
    data: mesopotamiaV6Data,
    pendingHistoricalProcesses: mesopotamiaPendingHistoricalProcesses
  },
  {
    id: 'ancient-egypt',
    label: '古埃及',
    order: 200,
    v5File: 'data/ancient-egypt.ts',
    v6File: 'v6/data/ancient-egypt/index.ts',
    exportedBinding: 'ancientEgyptV6Data',
    data: ancientEgyptV6Data,
    pendingHistoricalProcesses: ancientEgyptPendingHistoricalProcesses
  },
  {
    id: 'ancient-india',
    label: '古代南亚',
    order: 300,
    v5File: 'data/ancient-india.ts',
    v6File: 'v6/data/ancient-india/index.ts',
    exportedBinding: 'ancientIndiaV6Data',
    data: ancientIndiaV6Data,
    pendingHistoricalProcesses: ancientIndiaPendingHistoricalProcesses
  },
  {
    id: 'ancient-china',
    label: '古代中国',
    order: 400,
    v5File: 'data/ancient-china.ts',
    v6File: 'v6/data/ancient-china/index.ts',
    exportedBinding: 'ancientChinaV6Data',
    data: ancientChinaV6Data,
    pendingHistoricalProcesses: ancientChinaPendingHistoricalProcesses
  },
  {
    id: 'late-bronze-age',
    label: '晚青铜时代',
    order: 500,
    v5File: 'data/late-bronze-age.ts',
    v6File: 'v6/data/late-bronze-age/index.ts',
    exportedBinding: 'lateBronzeAgeV6Data',
    data: lateBronzeAgeV6Data,
    pendingHistoricalProcesses: lateBronzeAgePendingHistoricalProcesses
  },
  {
    id: 'aegean',
    label: '爱琴海',
    order: 600,
    v5File: 'data/aegean.ts',
    v6File: 'v6/data/aegean/index.ts',
    exportedBinding: 'aegeanV6Data',
    data: aegeanV6Data,
    pendingHistoricalProcesses: aegeanPendingHistoricalProcesses
  },
  {
    id: 'iron-age-near-east',
    label: '铁器时代近东',
    order: 700,
    v5File: 'data/iron-age-near-east.ts',
    v6File: 'v6/data/iron-age-near-east/index.ts',
    exportedBinding: 'ironAgeNearEastV6Data',
    data: ironAgeNearEastV6Data,
    pendingHistoricalProcesses: ironAgeNearEastPendingHistoricalProcesses
  }
] as const satisfies readonly V6ModuleRegistryEntry[];

export type V6ModuleId = typeof V6_MODULE_REGISTRY[number]['id'];

export const V6_PENDING_HISTORICAL_PROCESSES = V6_MODULE_REGISTRY.flatMap(
  entry => entry.pendingHistoricalProcesses
);
