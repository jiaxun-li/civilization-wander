import type {
  EntityPhaseId,
  RegionId,
  SourceId
} from '../../../v6/schema/index.ts';
import type { PresenceMode } from '../model/types.ts';

/**
 * A reviewed override for one Phase. Tracked is the default; pervasive must
 * name the exact regions for which broad social coverage is supported.
 */
export interface PresenceProfile {
  readonly phaseId: EntityPhaseId;
  readonly presenceMode: PresenceMode;
  readonly regionIds: readonly RegionId[];
  readonly rationale: string;
  readonly sourceIds: readonly SourceId[];
}

export function indexPresenceProfiles(
  profiles: readonly PresenceProfile[]
): ReadonlyMap<EntityPhaseId, PresenceProfile> {
  const index = new Map<EntityPhaseId, PresenceProfile>();

  for (const profile of profiles) {
    if (index.has(profile.phaseId)) {
      throw new Error(`Duplicate PresenceProfile for Phase "${profile.phaseId}".`);
    }
    index.set(profile.phaseId, profile);
  }

  return index;
}

export function presenceModeForRegion(
  profile: PresenceProfile | undefined,
  regionId: RegionId
): PresenceMode {
  if (!profile || !profile.regionIds.includes(regionId)) {
    return 'tracked';
  }
  return profile.presenceMode;
}
