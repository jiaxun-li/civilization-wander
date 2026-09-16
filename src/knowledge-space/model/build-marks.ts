import type {
  EntityPhase,
  Event,
  Region,
  Source,
  TimeSpan
} from '../../../v6/schema/index.ts';
import {
  applyPresenceMode,
  defaultEntityMarkKind,
  eventMarkKind,
  indexPresenceProfiles,
  presenceModeForRegion,
  supportsPervasivePresence,
  type KnowledgeSpaceEntity,
  type PresenceProfile
} from '../semantics/index.ts';
import {
  KnowledgeSpaceModelError,
  type KnowledgeSpaceMark,
  type KnowledgeSpaceRegionSegment,
  type ResolvedTimeSpan
} from './types.ts';

export interface KnowledgeSpaceModelInput {
  readonly sources: readonly Source[];
  readonly regions: readonly Region[];
  readonly entities: readonly KnowledgeSpaceEntity[];
  readonly entityPhases: readonly EntityPhase[];
  readonly events: readonly Event[];
}

function resolveTimeSpan(timeSpan: TimeSpan, objectId: string): ResolvedTimeSpan {
  if (
    timeSpan.start === undefined
    || timeSpan.end === undefined
    || !Number.isFinite(timeSpan.start)
    || !Number.isFinite(timeSpan.end)
  ) {
    throw new KnowledgeSpaceModelError(
      'UNRESOLVED_TIME_SPAN',
      `Knowledge-space object "${objectId}" needs finite start and end years.`,
      objectId
    );
  }
  if (timeSpan.start > timeSpan.end) {
    throw new KnowledgeSpaceModelError(
      'REVERSED_TIME_SPAN',
      `Knowledge-space object "${objectId}" starts after it ends.`,
      objectId
    );
  }
  return {
    start: timeSpan.start,
    end: timeSpan.end,
    label: timeSpan.label,
    approximate: timeSpan.approximate === true
  };
}

function assertUniqueIds<T extends { readonly id: string }>(
  objects: readonly T[],
  collectionName: string
): Map<string, T> {
  const index = new Map<string, T>();
  for (const object of objects) {
    if (index.has(object.id)) {
      throw new KnowledgeSpaceModelError(
        'DUPLICATE_ID',
        `Duplicate ${collectionName} ID "${object.id}".`,
        object.id
      );
    }
    index.set(object.id, object);
  }
  return index;
}

function validateProfile(
  profile: PresenceProfile,
  phase: EntityPhase,
  phaseSourceIds: ReadonlySet<string>,
  knownSourceIds: ReadonlySet<string>,
  baseKind: ReturnType<typeof defaultEntityMarkKind>,
  entity: KnowledgeSpaceEntity
): void {
  if (baseKind !== 'crayonStrip' && entity.type !== 'writingSystem') {
    throw new KnowledgeSpaceModelError(
      'PRESENCE_PROFILE_NOT_APPLICABLE',
      `Phase "${phase.id}" belongs to a ${baseKind} object and cannot use a PresenceProfile.`,
      phase.id
    );
  }
  if (profile.presenceMode === 'pervasive' && !supportsPervasivePresence(entity.type)) {
    throw new KnowledgeSpaceModelError(
      'PERVASIVE_PRESENCE_NOT_SUPPORTED',
      `Entity type "${entity.type}" remains a crayon strip even when its Phase is widespread.`,
      phase.id
    );
  }
  if (profile.rationale.trim().length === 0) {
    throw new KnowledgeSpaceModelError(
      'EMPTY_PRESENCE_RATIONALE',
      `PresenceProfile for Phase "${phase.id}" needs a rationale.`,
      phase.id
    );
  }
  if (profile.regionIds.length === 0) {
    throw new KnowledgeSpaceModelError(
      'EMPTY_PRESENCE_REGIONS',
      `PresenceProfile for Phase "${phase.id}" must name at least one Region.`,
      phase.id
    );
  }
  if (profile.sourceIds.length === 0) {
    throw new KnowledgeSpaceModelError(
      'EMPTY_PRESENCE_SOURCES',
      `PresenceProfile for Phase "${phase.id}" needs at least one Source.`,
      phase.id
    );
  }

  const phaseRegionIds = new Set(phase.regions.map((association) => association.regionId));
  const seenRegions = new Set<string>();
  for (const regionId of profile.regionIds) {
    if (seenRegions.has(regionId)) {
      throw new KnowledgeSpaceModelError(
        'DUPLICATE_PRESENCE_REGION',
        `PresenceProfile for Phase "${phase.id}" repeats Region "${regionId}".`,
        phase.id
      );
    }
    seenRegions.add(regionId);
    if (!phaseRegionIds.has(regionId)) {
      throw new KnowledgeSpaceModelError(
        'PRESENCE_REGION_OUTSIDE_PHASE',
        `PresenceProfile for Phase "${phase.id}" names Region "${regionId}" outside the Phase.`,
        phase.id
      );
    }
  }

  for (const profileSourceId of profile.sourceIds) {
    if (!knownSourceIds.has(profileSourceId)) {
      throw new KnowledgeSpaceModelError(
        'UNKNOWN_PRESENCE_SOURCE',
        `PresenceProfile for Phase "${phase.id}" references unknown Source "${profileSourceId}".`,
        phase.id
      );
    }
    if (!phaseSourceIds.has(profileSourceId)) {
      throw new KnowledgeSpaceModelError(
        'PRESENCE_SOURCE_NOT_ON_PHASE',
        `PresenceProfile for Phase "${phase.id}" must use a Source already cited by that Phase; "${profileSourceId}" is not cited there.`,
        phase.id
      );
    }
  }
}

function makeRegionSegments(
  phase: EntityPhase,
  profile: PresenceProfile | undefined,
  knownRegions: ReadonlySet<string>
): readonly KnowledgeSpaceRegionSegment[] {
  if (phase.regions.length === 0) {
    throw new KnowledgeSpaceModelError(
      'EMPTY_REGIONS',
      `Phase "${phase.id}" cannot enter the knowledge space without a Region.`,
      phase.id
    );
  }
  const seenRegionIds = new Set<string>();
  return phase.regions.map((association) => {
    if (!knownRegions.has(association.regionId)) {
      throw new KnowledgeSpaceModelError(
        'UNKNOWN_REGION',
        `Phase "${phase.id}" references unknown Region "${association.regionId}".`,
        phase.id
      );
    }
    if (seenRegionIds.has(association.regionId)) {
      throw new KnowledgeSpaceModelError(
        'DUPLICATE_REGION_ASSOCIATION',
        `Phase "${phase.id}" repeats Region "${association.regionId}".`,
        phase.id
      );
    }
    seenRegionIds.add(association.regionId);
    return {
      ...association,
      presenceMode: presenceModeForRegion(profile, association.regionId)
    };
  });
}

function phaseMarkKind(entity: KnowledgeSpaceEntity, phase: EntityPhase) {
  // A document represented by one reviewed production date is a point, not a
  // zero-width duration band. Its knowledge identity remains a document corpus.
  return entity.type === 'documentCorpus' && phase.timeSpan.start !== undefined
    && phase.timeSpan.start === phase.timeSpan.end ? 'node' : defaultEntityMarkKind(entity);
}

function splitPhaseMarkByPresence(
  entity: KnowledgeSpaceEntity,
  phase: EntityPhase,
  profile: PresenceProfile | undefined,
  knownRegions: ReadonlySet<string>,
  timeSpan: ResolvedTimeSpan
): readonly KnowledgeSpaceMark[] {
  const baseKind = phaseMarkKind(entity, phase);
  const segments = makeRegionSegments(phase, profile, knownRegions);
  const modes = [...new Set(segments.map((segment) => segment.presenceMode))];

  return modes.map((presenceMode) => {
    const selectedSegments = segments.filter((segment) => segment.presenceMode === presenceMode);
    const suffix = modes.length > 1 ? `:${presenceMode}` : '';
    return {
      id: `phase:${phase.id}${suffix}`,
      subjectRef: { kind: 'entity', id: entity.id },
      phaseId: phase.id,
      label: entity.name,
      phaseLabel: phase.title,
      conceptLayerId: entity.conceptLayerId,
      timeSpan,
      regionSegments: selectedSegments,
      markKind: applyPresenceMode(baseKind, presenceMode),
      certainty: {
        timeApproximate: timeSpan.approximate,
        regionApproximate: selectedSegments.some((segment) => segment.approximate)
      },
      textureSeed: `phase:${phase.id}:${presenceMode}`,
      semanticKind: {
        kind: 'entity',
        entityId: entity.id,
        entityType: entity.type
      }
    } satisfies KnowledgeSpaceMark;
  });
}

/**
 * Converts authoritative V6 EntityPhases and Events into renderer-neutral
 * marks. Invalid or unprojectable objects fail explicitly rather than being
 * filtered out by the renderer.
 */
export function buildKnowledgeSpaceMarks(
  input: KnowledgeSpaceModelInput,
  presenceProfiles: readonly PresenceProfile[] = []
): readonly KnowledgeSpaceMark[] {
  const sourceIndex = assertUniqueIds(input.sources, 'Source');
  const regionIndex = assertUniqueIds(input.regions, 'Region');
  const entityIndex = assertUniqueIds(input.entities, 'Entity');
  const phaseIndex = assertUniqueIds(input.entityPhases, 'EntityPhase');
  assertUniqueIds(input.events, 'Event');
  const knownSourceIds = new Set(sourceIndex.keys());
  const knownRegionIds = new Set(regionIndex.keys());

  const profilesByPhase = indexPresenceProfiles(presenceProfiles);
  for (const profile of presenceProfiles) {
    if (!phaseIndex.has(profile.phaseId)) {
      throw new KnowledgeSpaceModelError(
        'UNKNOWN_PRESENCE_PHASE',
        `PresenceProfile references unknown Phase "${profile.phaseId}".`,
        profile.phaseId
      );
    }
  }

  const marks: KnowledgeSpaceMark[] = [];
  const ownedPhaseIds = new Set<string>();

  for (const entity of input.entities) {
    for (const phaseId of entity.phaseIds) {
      if (ownedPhaseIds.has(phaseId)) {
        throw new KnowledgeSpaceModelError(
          'DUPLICATE_PHASE_OWNERSHIP',
          `EntityPhase "${phaseId}" is listed by more than one Entity.`,
          phaseId
        );
      }
      ownedPhaseIds.add(phaseId);
      const phase = phaseIndex.get(phaseId);
      if (!phase) {
        throw new KnowledgeSpaceModelError(
          'UNKNOWN_ENTITY_PHASE',
          `Entity "${entity.id}" references unknown Phase "${phaseId}".`,
          phaseId
        );
      }
      if (phase.entityId !== entity.id) {
        throw new KnowledgeSpaceModelError(
          'PHASE_OWNER_MISMATCH',
          `Phase "${phaseId}" belongs to "${phase.entityId}", not "${entity.id}".`,
          phaseId
        );
      }

      const profile = profilesByPhase.get(phase.id);
      const baseKind = phaseMarkKind(entity, phase);
      if (profile) {
        validateProfile(
          profile,
          phase,
          new Set(phase.sourceIds),
          knownSourceIds,
          baseKind,
          entity
        );
      }
      marks.push(...splitPhaseMarkByPresence(
        entity,
        phase,
        profile,
        knownRegionIds,
        resolveTimeSpan(phase.timeSpan, phase.id)
      ));
    }
  }

  for (const phase of input.entityPhases) {
    if (!entityIndex.has(phase.entityId)) {
      throw new KnowledgeSpaceModelError(
        'UNKNOWN_PHASE_ENTITY',
        `Phase "${phase.id}" references unknown Entity "${phase.entityId}".`,
        phase.id
      );
    }
    if (!ownedPhaseIds.has(phase.id)) {
      throw new KnowledgeSpaceModelError(
        'UNOWNED_PHASE',
        `Phase "${phase.id}" is not listed by its owning Entity.`,
        phase.id
      );
    }
  }

  for (const event of input.events) {
    const timeSpan = resolveTimeSpan(event.timeSpan, event.id);
    if (event.regions.length === 0) {
      throw new KnowledgeSpaceModelError(
        'EMPTY_REGIONS',
        `Event "${event.id}" cannot enter the knowledge space without a Region.`,
        event.id
      );
    }
    const seenEventRegionIds = new Set<string>();
    const regionSegments = event.regions.map((association) => {
      if (!regionIndex.has(association.regionId)) {
        throw new KnowledgeSpaceModelError(
          'UNKNOWN_REGION',
          `Event "${event.id}" references unknown Region "${association.regionId}".`,
          event.id
        );
      }
      if (seenEventRegionIds.has(association.regionId)) {
        throw new KnowledgeSpaceModelError(
          'DUPLICATE_REGION_ASSOCIATION',
          `Event "${event.id}" repeats Region "${association.regionId}".`,
          event.id
        );
      }
      seenEventRegionIds.add(association.regionId);
      return { ...association, presenceMode: 'tracked' as const };
    });
    marks.push({
      id: `event:${event.id}`,
      subjectRef: { kind: 'event', id: event.id },
      label: event.title,
      conceptLayerId: event.conceptLayerId,
      timeSpan,
      regionSegments,
      markKind: eventMarkKind(event.kind),
      certainty: {
        timeApproximate: timeSpan.approximate,
        regionApproximate: regionSegments.some((segment) => segment.approximate)
      },
      textureSeed: `event:${event.id}:tracked`,
      semanticKind: {
        kind: 'event',
        eventId: event.id,
        eventKind: event.kind
      }
    });
  }

  return marks;
}

export const deriveKnowledgeSpaceMarks = buildKnowledgeSpaceMarks;
