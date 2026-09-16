import type {
  GeometryId,
  RegionId,
  SourceIds
} from './common.ts';

export const REGIONAL_ROLES = [
  'core',
  'controlled',
  'influence',
  'exchange',
  'origin',
  'associated',
  'attested'
] as const;

export type RegionalRole = typeof REGIONAL_ROLES[number];

export interface GeographicCoordinate {
  readonly longitude: number;
  readonly latitude: number;
}

export interface Region {
  readonly id: RegionId;
  readonly name: string;
  readonly parentRegionId?: RegionId;
  readonly associationPolicy?: 'groupOnly';
  readonly displayOrder: number;
  readonly centroid?: GeographicCoordinate;
  readonly geometryId?: GeometryId;
  readonly sourceIds: SourceIds;
}

export interface RegionalAssociation {
  readonly regionId: RegionId;
  readonly role: RegionalRole;
  readonly approximate: boolean;
  readonly sourceIds: SourceIds;
}
