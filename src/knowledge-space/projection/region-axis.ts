import type { Region, RegionId } from '../../../v6/schema/index.ts';
import { KnowledgeSpaceModelError } from '../model/index.ts';

export interface RegionAxisRow {
  readonly id: string;
  readonly regionId: RegionId;
  readonly label: string;
  readonly parentRegionId?: RegionId;
  readonly displayOrder: number;
  readonly depth: number;
  readonly unscoped: boolean;
  readonly active: boolean;
}

export interface RegionAxisGroup {
  readonly id: string;
  readonly regionId: RegionId;
  readonly label: string;
  readonly displayOrder: number;
  readonly rows: readonly RegionAxisRow[];
}

export interface RegionAxis {
  readonly groups: readonly RegionAxisGroup[];
  readonly rows: readonly RegionAxisRow[];
  readonly rowByRegionId: ReadonlyMap<RegionId, RegionAxisRow>;
}

export interface RegionAxisOptions {
  readonly includeScaffolding?: boolean;
}

function compareRegions(left: Region, right: Region): number {
  return left.displayOrder - right.displayOrder || left.id.localeCompare(right.id);
}

/**
 * Builds the cultural-geographic reading axis. A parent Region with children
 * is a group heading; data attached directly to it receives an explicit
 * “未细分” row instead of being copied into every child Region.
 */
export function createRegionAxis(
  regions: readonly Region[],
  activeRegionIds: ReadonlySet<RegionId>,
  options: RegionAxisOptions = {}
): RegionAxis {
  const regionById = new Map<RegionId, Region>();
  const childrenByParent = new Map<RegionId, Region[]>();
  for (const region of regions) {
    if (regionById.has(region.id)) {
      throw new KnowledgeSpaceModelError(
        'DUPLICATE_REGION_ID',
        `Duplicate Region ID "${region.id}".`,
        region.id
      );
    }
    regionById.set(region.id, region);
  }
  for (const region of regions) {
    if (!region.parentRegionId) continue;
    if (!regionById.has(region.parentRegionId)) {
      throw new KnowledgeSpaceModelError(
        'UNKNOWN_PARENT_REGION',
        `Region "${region.id}" references unknown parent "${region.parentRegionId}".`,
        region.id
      );
    }
    const children = childrenByParent.get(region.parentRegionId) ?? [];
    children.push(region);
    childrenByParent.set(region.parentRegionId, children);
  }

  for (const activeRegionId of activeRegionIds) {
    if (!regionById.has(activeRegionId)) {
      throw new KnowledgeSpaceModelError(
        'UNKNOWN_ACTIVE_REGION',
        `Knowledge-space marks reference unknown Region "${activeRegionId}".`,
        activeRegionId
      );
    }
  }

  const rootOf = (region: Region): Region => {
    const visited = new Set<string>();
    let current = region;
    while (current.parentRegionId) {
      if (visited.has(current.id)) {
        throw new KnowledgeSpaceModelError(
          'REGION_CYCLE',
          `Region hierarchy contains a cycle at "${current.id}".`,
          current.id
        );
      }
      visited.add(current.id);
      current = regionById.get(current.parentRegionId)!;
    }
    return current;
  };

  const activeRoots = new Set(
    [...activeRegionIds].map((regionId) => rootOf(regionById.get(regionId)!).id)
  );
  const includeScaffolding = options.includeScaffolding === true;
  const roots = regions
    .filter((region) => !region.parentRegionId)
    .filter((region) => includeScaffolding || activeRoots.has(region.id))
    .sort(compareRegions);

  const groups: RegionAxisGroup[] = [];
  const rows: RegionAxisRow[] = [];
  const rowByRegionId = new Map<RegionId, RegionAxisRow>();

  const descendantRows = (root: Region): Region[] => {
    const descendants: Region[] = [];
    const visit = (parentId: RegionId): void => {
      for (const child of [...(childrenByParent.get(parentId) ?? [])].sort(compareRegions)) {
        descendants.push(child);
        visit(child.id);
      }
    };
    visit(root.id);
    return descendants;
  };

  for (const root of roots) {
    const descendants = descendantRows(root);
    const groupRows: RegionAxisRow[] = [];

    if (descendants.length === 0) {
      const row: RegionAxisRow = {
        id: `region:${root.id}`,
        regionId: root.id,
        label: root.name,
        displayOrder: root.displayOrder,
        depth: 0,
        unscoped: false,
        active: activeRegionIds.has(root.id)
      };
      groupRows.push(row);
      rowByRegionId.set(root.id, row);
    } else {
      if (activeRegionIds.has(root.id)) {
        const row: RegionAxisRow = {
          id: `region:${root.id}:unscoped`,
          regionId: root.id,
          label: `${root.name}（未细分）`,
          displayOrder: root.displayOrder,
          depth: 1,
          unscoped: true,
          active: true
        };
        groupRows.push(row);
        rowByRegionId.set(root.id, row);
      }

      for (const descendant of descendants) {
        if (!includeScaffolding && !activeRegionIds.has(descendant.id)) continue;
        let depth = 1;
        let parentId = descendant.parentRegionId;
        while (parentId && parentId !== root.id) {
          depth += 1;
          parentId = regionById.get(parentId)?.parentRegionId;
        }
        const row: RegionAxisRow = {
          id: `region:${descendant.id}`,
          regionId: descendant.id,
          label: descendant.name,
          parentRegionId: descendant.parentRegionId,
          displayOrder: descendant.displayOrder,
          depth,
          unscoped: false,
          active: activeRegionIds.has(descendant.id)
        };
        groupRows.push(row);
        rowByRegionId.set(descendant.id, row);
      }
    }

    if (groupRows.length === 0 && !includeScaffolding) continue;
    rows.push(...groupRows);
    groups.push({
      id: `region-group:${root.id}`,
      regionId: root.id,
      label: root.name,
      displayOrder: root.displayOrder,
      rows: groupRows
    });
  }

  return { groups, rows, rowByRegionId };
}
