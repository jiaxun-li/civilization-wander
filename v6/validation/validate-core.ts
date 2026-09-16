import {
  CONCEPT_LAYER_IDS,
  ENTITY_TYPES,
  EVENT_KINDS,
  REGIONAL_ROLES,
  RELATION_FAMILIES
} from '../schema/index.ts';
import type { TimeSpan, V6KnowledgeCore } from '../schema/index.ts';

type UnknownRecord = Record<string, unknown>;

export interface V6CoreValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly counts: Readonly<Record<string, number>>;
}

const TOP_LEVEL_KEYS = [
  'schemaVersion',
  'sources',
  'regions',
  'entities',
  'entityPhases',
  'events',
  'temporalRelations'
] as const;

const COLLECTION_KEYS = TOP_LEVEL_KEYS.filter(key => key !== 'schemaVersion');
const ENTITY_TYPE_SET = new Set<unknown>(ENTITY_TYPES);
const CONCEPT_LAYER_SET = new Set<unknown>(CONCEPT_LAYER_IDS);
const EVENT_KIND_SET = new Set<unknown>(EVENT_KINDS);
const REGIONAL_ROLE_SET = new Set<unknown>(REGIONAL_ROLES);
const RELATION_FAMILY_SET = new Set<unknown>(RELATION_FAMILIES);
const RELATION_ORIENTATIONS = new Set<unknown>(['directed', 'symmetric', 'multiParty']);

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function valuesOverlap(left: TimeSpan, right: TimeSpan): boolean {
  const leftStart = left.start ?? -Infinity;
  const leftEnd = left.end ?? Infinity;
  const rightStart = right.start ?? -Infinity;
  const rightEnd = right.end ?? Infinity;
  return leftStart <= rightEnd && rightStart <= leftEnd;
}

function containsTimeSpan(container: TimeSpan, inner: TimeSpan): boolean {
  const containerStart = container.start ?? -Infinity;
  const containerEnd = container.end ?? Infinity;
  const innerStart = inner.start ?? -Infinity;
  const innerEnd = inner.end ?? Infinity;
  return containerStart <= innerStart && containerEnd >= innerEnd;
}

function timeSpanUnionCovers(spans: readonly TimeSpan[], target: TimeSpan): boolean {
  if (spans.length === 0) return false;
  const targetStart = target.start ?? -Infinity;
  const targetEnd = target.end ?? Infinity;
  const intervals = spans
    .map(span => ({ start: span.start ?? -Infinity, end: span.end ?? Infinity }))
    .sort((left, right) => left.start - right.start || left.end - right.end);
  let coveredEnd = -Infinity;
  let coverageStarted = false;
  for (const interval of intervals) {
    if (interval.end < targetStart || interval.start > targetEnd) continue;
    if (!coverageStarted) {
      if (interval.start > targetStart) return false;
      coveredEnd = interval.end;
      coverageStarted = true;
    } else {
      if (interval.start > coveredEnd) return false;
      coveredEnd = Math.max(coveredEnd, interval.end);
    }
    if (coveredEnd >= targetEnd) return true;
  }
  return coverageStarted && coveredEnd >= targetEnd;
}

function phaseStartValue(phase: UnknownRecord): number {
  const timeSpan = isRecord(phase.timeSpan) ? phase.timeSpan : {};
  return typeof timeSpan.start === 'number' ? timeSpan.start : -Infinity;
}

function phaseEndValue(phase: UnknownRecord): number {
  const timeSpan = isRecord(phase.timeSpan) ? phase.timeSpan : {};
  return typeof timeSpan.end === 'number' ? timeSpan.end : Infinity;
}

function regionSignature(phase: UnknownRecord, includeRole: boolean): string | undefined {
  if (!Array.isArray(phase.regions) || phase.regions.length === 0) return undefined;
  const parts: string[] = [];
  for (const association of phase.regions) {
    if (!isRecord(association) || !nonEmptyString(association.regionId)) return undefined;
    if (includeRole && !nonEmptyString(association.role)) return undefined;
    parts.push(includeRole ? `${association.regionId}:${association.role}` : association.regionId);
  }
  return parts.sort().join('|');
}

export function validateV6KnowledgeCore(candidate: unknown): V6CoreValidationResult {
  try {
    return validateV6KnowledgeCoreUnsafe(candidate);
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    return {
      valid: false,
      errors: [`core: malformed data must not interrupt validation (${detail})`],
      counts: {}
    };
  }
}

function validateV6KnowledgeCoreUnsafe(candidate: unknown): V6CoreValidationResult {
  const errors: string[] = [];
  const error = (path: string, message: string): void => {
    errors.push(`${path}: ${message}`);
  };
  const checkKeys = (
    value: unknown,
    allowed: readonly string[],
    required: readonly string[],
    path: string
  ): value is UnknownRecord => {
    if (!isRecord(value)) {
      error(path, 'must be an object');
      return false;
    }
    for (const key of Object.keys(value)) {
      if (!allowed.includes(key)) error(`${path}.${key}`, 'unknown field');
    }
    for (const key of required) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) error(`${path}.${key}`, 'is required');
    }
    return true;
  };
  const checkString = (value: unknown, path: string): value is string => {
    if (!nonEmptyString(value)) {
      error(path, 'must be a non-empty string');
      return false;
    }
    return true;
  };
  const checkBoolean = (value: unknown, path: string): void => {
    if (typeof value !== 'boolean') error(path, 'must be a boolean');
  };
  const checkStringArray = (
    value: unknown,
    path: string,
    nonEmpty = false
  ): value is string[] => {
    if (!Array.isArray(value)) {
      error(path, 'must be an array');
      return false;
    }
    if (nonEmpty && value.length === 0) error(path, 'must not be empty');
    value.forEach((item, index) => checkString(item, `${path}[${index}]`));
    if (new Set(value).size !== value.length) error(path, 'must not contain duplicates');
    return value.every(nonEmptyString);
  };
  const checkTimeSpan = (value: unknown, path: string): value is TimeSpan => {
    if (!checkKeys(value, ['start', 'end', 'label', 'approximate'], ['label'], path)) return false;
    checkString(value.label, `${path}.label`);
    const hasStart = Object.prototype.hasOwnProperty.call(value, 'start');
    const hasEnd = Object.prototype.hasOwnProperty.call(value, 'end');
    if (!hasStart && !hasEnd) error(path, 'must have start or end');
    for (const key of ['start', 'end'] as const) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
      const year = value[key];
      if (!Number.isFinite(year) || !Number.isInteger(year)) error(`${path}.${key}`, 'must be a finite integer');
      if (year === 0) error(`${path}.${key}`, 'year 0 is not allowed');
    }
    if (
      typeof value.start === 'number' &&
      typeof value.end === 'number' &&
      value.start > value.end
    ) error(path, 'start must be less than or equal to end');
    if (value.approximate !== undefined) checkBoolean(value.approximate, `${path}.approximate`);
    return true;
  };

  if (!isRecord(candidate)) return { valid: false, errors: ['core: must be an object'], counts: {} };
  for (const key of Object.keys(candidate)) {
    if (!TOP_LEVEL_KEYS.includes(key as typeof TOP_LEVEL_KEYS[number])) {
      error(`core.${key}`, 'unknown collection or field');
    }
  }
  for (const key of TOP_LEVEL_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(candidate, key)) error(`core.${key}`, 'is required');
  }
  if (candidate.schemaVersion !== 6) error('core.schemaVersion', 'must equal 6');
  for (const key of COLLECTION_KEYS) {
    if (!Array.isArray(candidate[key])) error(`core.${key}`, 'must be an array');
  }
  if (errors.length) return { valid: false, errors, counts: {} };

  const data = candidate as unknown as V6KnowledgeCore;
  const collections = {
    sources: data.sources,
    regions: data.regions,
    entities: data.entities,
    entityPhases: data.entityPhases,
    events: data.events,
    temporalRelations: data.temporalRelations
  } as const;
  const maps = Object.fromEntries(
    Object.entries(collections).map(([name, values]) => [
      name,
      new Map(values.filter(isRecord).filter(item => nonEmptyString(item.id)).map(item => [item.id, item]))
    ])
  ) as unknown as Record<keyof typeof collections, Map<string, UnknownRecord>>;
  const allIds = new Map<string, string>();
  for (const [collection, items] of Object.entries(collections)) {
    items.forEach((item, index) => {
      const path = `${collection}[${index}]`;
      if (!isRecord(item)) {
        error(path, 'must be an object');
        return;
      }
      if (!checkString(item.id, `${path}.id`)) return;
      const previous = allIds.get(item.id);
      if (previous) error(`${path}.id`, `duplicates ${previous}`);
      else allIds.set(item.id, path);
    });
  }
  const checkRef = (collection: keyof typeof collections, value: unknown, path: string): void => {
    if (checkString(value, path) && !maps[collection].has(value)) {
      error(path, `references missing ${collection} object ${value}`);
    }
  };
  const checkRefArray = (
    collection: keyof typeof collections,
    value: unknown,
    path: string,
    nonEmpty = false
  ): value is string[] => {
    if (!checkStringArray(value, path, nonEmpty)) return false;
    value.forEach((id, index) => checkRef(collection, id, `${path}[${index}]`));
    return true;
  };
  const checkSources = (value: unknown, path: string, nonEmpty = true): void => {
    checkRefArray('sources', value, path, nonEmpty);
  };

  data.sources.forEach((source, index) => {
    const path = `sources[${index}]`;
    if (!checkKeys(source, ['id', 'title', 'author', 'year', 'publisher', 'url'], ['id', 'title'], path)) return;
    checkString(source.id, `${path}.id`);
    checkString(source.title, `${path}.title`);
    for (const key of ['author', 'publisher', 'url'] as const) {
      if (source[key] !== undefined) checkString(source[key], `${path}.${key}`);
    }
    if (source.year !== undefined && (!Number.isInteger(source.year) || source.year === 0)) {
      error(`${path}.year`, 'must be a non-zero integer');
    }
  });

  const siblingOrders = new Map<string, Map<number, string>>();
  data.regions.forEach((region, index) => {
    const path = `regions[${index}]`;
    if (!checkKeys(
      region,
      ['id', 'name', 'parentRegionId', 'associationPolicy', 'displayOrder', 'centroid', 'geometryId', 'sourceIds'],
      ['id', 'name', 'displayOrder', 'sourceIds'],
      path
    )) return;
    checkString(region.id, `${path}.id`);
    checkString(region.name, `${path}.name`);
    if (!Number.isInteger(region.displayOrder)) error(`${path}.displayOrder`, 'must be an integer');
    if (region.parentRegionId !== undefined) {
      checkRef('regions', region.parentRegionId, `${path}.parentRegionId`);
      if (region.parentRegionId === region.id) error(`${path}.parentRegionId`, 'must not reference itself');
    }
    if (region.associationPolicy !== undefined && region.associationPolicy !== 'groupOnly') {
      error(`${path}.associationPolicy`, 'must equal groupOnly when present');
    }
    if (region.centroid !== undefined && checkKeys(
      region.centroid,
      ['longitude', 'latitude'],
      ['longitude', 'latitude'],
      `${path}.centroid`
    )) {
      if (typeof region.centroid.longitude !== 'number' || !Number.isFinite(region.centroid.longitude) || Math.abs(region.centroid.longitude) > 180) {
        error(`${path}.centroid.longitude`, 'must be finite and within [-180, 180]');
      }
      if (typeof region.centroid.latitude !== 'number' || !Number.isFinite(region.centroid.latitude) || Math.abs(region.centroid.latitude) > 90) {
        error(`${path}.centroid.latitude`, 'must be finite and within [-90, 90]');
      }
    }
    if (region.geometryId !== undefined) checkString(region.geometryId, `${path}.geometryId`);
    checkSources(region.sourceIds, `${path}.sourceIds`, false);
    const parentKey = region.parentRegionId ?? '(root)';
    const orders = siblingOrders.get(parentKey) ?? new Map<number, string>();
    if (orders.has(region.displayOrder)) {
      error(`${path}.displayOrder`, `duplicates sibling ${orders.get(region.displayOrder)}`);
    } else orders.set(region.displayOrder, region.id);
    siblingOrders.set(parentKey, orders);
  });
  data.regions.forEach((region, index) => {
    const visited = new Set<string>([region.id]);
    let parentId = region.parentRegionId;
    while (parentId) {
      if (visited.has(parentId)) {
        error(`regions[${index}].parentRegionId`, 'creates a Region parent cycle');
        break;
      }
      visited.add(parentId);
      parentId = maps.regions.get(parentId)?.parentRegionId as string | undefined;
    }
  });

  const checkRegions = (value: unknown, path: string, nonEmpty = true): void => {
    if (!Array.isArray(value)) {
      error(path, 'must be an array');
      return;
    }
    if (nonEmpty && value.length === 0) error(path, 'must not be empty');
    const regionIds = new Set<string>();
    value.forEach((association, index) => {
      const itemPath = `${path}[${index}]`;
      if (!checkKeys(
        association,
        ['regionId', 'role', 'approximate', 'sourceIds'],
        ['regionId', 'role', 'approximate', 'sourceIds'],
        itemPath
      )) return;
      checkRef('regions', association.regionId, `${itemPath}.regionId`);
      if (
        nonEmptyString(association.regionId)
        && maps.regions.get(association.regionId)?.associationPolicy === 'groupOnly'
      ) {
        error(`${itemPath}.regionId`, 'references a group-only Region; use a reviewed child Region');
      }
      if (!REGIONAL_ROLE_SET.has(association.role)) error(`${itemPath}.role`, 'has an unknown RegionalRole');
      checkBoolean(association.approximate, `${itemPath}.approximate`);
      checkSources(association.sourceIds, `${itemPath}.sourceIds`, true);
      if (nonEmptyString(association.regionId)) {
        if (regionIds.has(association.regionId)) error(`${itemPath}.regionId`, 'duplicates a Region within this record');
        regionIds.add(association.regionId);
      }
    });
  };

  data.entities.forEach((entity, index) => {
    const path = `entities[${index}]`;
    if (!checkKeys(
      entity,
      ['id', 'type', 'name', 'alternativeNames', 'canonicalSummary', 'conceptLayerId', 'phaseIds', 'tags', 'sourceIds'],
      ['id', 'type', 'name', 'canonicalSummary', 'conceptLayerId', 'phaseIds', 'sourceIds'],
      path
    )) return;
    checkString(entity.id, `${path}.id`);
    if (!ENTITY_TYPE_SET.has(entity.type)) error(`${path}.type`, 'has an unknown EntityType');
    checkString(entity.name, `${path}.name`);
    checkString(entity.canonicalSummary, `${path}.canonicalSummary`);
    if (!CONCEPT_LAYER_SET.has(entity.conceptLayerId)) error(`${path}.conceptLayerId`, 'has an unknown ConceptLayerId');
    if (entity.alternativeNames !== undefined) checkStringArray(entity.alternativeNames, `${path}.alternativeNames`);
    if (entity.tags !== undefined) checkStringArray(entity.tags, `${path}.tags`);
    // A stable Entity may exist before a defensible historical Phase has been
    // reviewed. Requiring a non-empty list encouraged synthetic continuity
    // bars, so only reference validity—not presence—is enforced here.
    checkRefArray('entityPhases', entity.phaseIds, `${path}.phaseIds`, false);
    checkSources(entity.sourceIds, `${path}.sourceIds`, true);
  });

  const phaseOwners = new Map<string, string[]>();
  data.entities.forEach(entity => entity.phaseIds.forEach(phaseId => {
    const owners = phaseOwners.get(phaseId) ?? [];
    owners.push(entity.id);
    phaseOwners.set(phaseId, owners);
  }));
  data.entityPhases.forEach((phase, index) => {
    const path = `entityPhases[${index}]`;
    if (!checkKeys(
      phase,
      ['id', 'entityId', 'title', 'timeSpan', 'regions', 'relationIds', 'sourceIds'],
      ['id', 'entityId', 'timeSpan', 'regions', 'relationIds', 'sourceIds'],
      path
    )) return;
    checkString(phase.id, `${path}.id`);
    checkRef('entities', phase.entityId, `${path}.entityId`);
    if (phase.title !== undefined) checkString(phase.title, `${path}.title`);
    checkTimeSpan(phase.timeSpan, `${path}.timeSpan`);
    checkRegions(phase.regions, `${path}.regions`);
    checkRefArray('temporalRelations', phase.relationIds, `${path}.relationIds`);
    checkSources(phase.sourceIds, `${path}.sourceIds`, true);
    const owners = phaseOwners.get(phase.id) ?? [];
    if (owners.length !== 1) error(`${path}.id`, `must be referenced by exactly one Entity; found ${owners.length}`);
    if (owners.length === 1 && owners[0] !== phase.entityId) {
      error(`${path}.entityId`, `does not match owning Entity ${owners[0]}`);
    }
  });

  // EntityPhase is a spatial state for the Region-by-time knowledge space,
  // not a narrative chapter. Exact repeated spatial states must be merged.
  // A polity is stricter: changing only core/controlled/associated wording
  // does not establish territorial expansion or contraction.
  const phaseIndexes = new Map<string, number>();
  data.entityPhases.forEach((phase, index) => phaseIndexes.set(phase.id, index));
  data.entities.forEach(entity => {
    const phases = entity.phaseIds
      .map(phaseId => maps.entityPhases.get(phaseId))
      .filter((phase): phase is UnknownRecord => phase !== undefined)
      .sort((left, right) => (
        phaseStartValue(left) - phaseStartValue(right) ||
        phaseEndValue(left) - phaseEndValue(right) ||
        String(left.id).localeCompare(String(right.id))
      ));
    for (let index = 1; index < phases.length; index += 1) {
      const previous = phases[index - 1];
      const current = phases[index];
      const includeRole = entity.type !== 'polity';
      const previousSignature = regionSignature(previous, includeRole);
      const currentSignature = regionSignature(current, includeRole);
      if (!previousSignature || previousSignature !== currentSignature) continue;
      const currentIndex = phaseIndexes.get(String(current.id));
      const path = currentIndex === undefined ? 'entityPhases' : `entityPhases[${currentIndex}].regions`;
      error(
        path,
        `repeats the spatial state of adjacent Phase ${String(previous.id)}; merge narrative-only stages`
      );
    }
  });

  data.events.forEach((event, index) => {
    const path = `events[${index}]`;
    if (!checkKeys(
      event,
      ['id', 'kind', 'conceptLayerId', 'title', 'timeSpan', 'regions', 'participants', 'evidence', 'editorialReview', 'sourceIds'],
      ['id', 'kind', 'conceptLayerId', 'title', 'timeSpan', 'regions', 'participants', 'evidence', 'editorialReview', 'sourceIds'],
      path
    )) return;
    checkString(event.id, `${path}.id`);
    if (!EVENT_KIND_SET.has(event.kind)) error(`${path}.kind`, 'has an unknown EventKind');
    if (!CONCEPT_LAYER_SET.has(event.conceptLayerId)) {
      error(`${path}.conceptLayerId`, 'has an unknown ConceptLayerId');
    }
    checkString(event.title, `${path}.title`);
    const validTime = checkTimeSpan(event.timeSpan, `${path}.timeSpan`);
    checkRegions(event.regions, `${path}.regions`);
    if (!Array.isArray(event.participants) || event.participants.length === 0) {
      error(`${path}.participants`, 'must be a non-empty array');
    } else {
      let overlappingPhaseCount = 0;
      event.participants.forEach((participant, participantIndex) => {
        const participantPath = `${path}.participants[${participantIndex}]`;
        if (!checkKeys(
          participant,
          ['entityId', 'phaseId', 'role', 'description', 'sourceIds'],
          ['entityId', 'role', 'sourceIds'],
          participantPath
        )) return;
        checkRef('entities', participant.entityId, `${participantPath}.entityId`);
        checkString(participant.role, `${participantPath}.role`);
        if (participant.description !== undefined) checkString(participant.description, `${participantPath}.description`);
        checkSources(participant.sourceIds, `${participantPath}.sourceIds`, true);
        if (participant.phaseId !== undefined) {
          checkRef('entityPhases', participant.phaseId, `${participantPath}.phaseId`);
          const phase = nonEmptyString(participant.phaseId)
            ? maps.entityPhases.get(participant.phaseId)
            : undefined;
          if (phase && phase.entityId !== participant.entityId) error(`${participantPath}.phaseId`, 'must belong to participant Entity');
          if (phase && validTime && valuesOverlap(event.timeSpan, phase.timeSpan as TimeSpan)) overlappingPhaseCount += 1;
          else if (phase && validTime) error(`${participantPath}.phaseId`, 'phase timeSpan must overlap Event timeSpan');
        }
      });
      if (overlappingPhaseCount === 0) error(`${path}.participants`, 'must include at least one phase-bound participant overlapping the Event');
    }
    if (!Array.isArray(event.evidence) || event.evidence.length === 0) {
      error(`${path}.evidence`, 'must be a non-empty array');
    } else event.evidence.forEach((evidence, evidenceIndex) => {
      const evidencePath = `${path}.evidence[${evidenceIndex}]`;
      if (!checkKeys(evidence, ['v5ClaimBlockId', 'sourceIds'], ['v5ClaimBlockId', 'sourceIds'], evidencePath)) return;
      checkString(evidence.v5ClaimBlockId, `${evidencePath}.v5ClaimBlockId`);
      checkSources(evidence.sourceIds, `${evidencePath}.sourceIds`, true);
    });
    if (checkKeys(
      event.editorialReview,
      ['limitationClaimIds', 'counterexampleClaimIds', 'uncertaintyClaimIds', 'alternativeExplanationClaimIds', 'sourceIds'],
      ['limitationClaimIds', 'counterexampleClaimIds', 'uncertaintyClaimIds', 'alternativeExplanationClaimIds', 'sourceIds'],
      `${path}.editorialReview`
    )) {
      const review = event.editorialReview;
      const buckets = [review.limitationClaimIds, review.counterexampleClaimIds, review.uncertaintyClaimIds, review.alternativeExplanationClaimIds];
      buckets.forEach((bucket, bucketIndex) => checkStringArray(bucket, `${path}.editorialReview.bucket[${bucketIndex}]`));
      if (buckets.every(bucket => bucket.length === 0)) error(`${path}.editorialReview`, 'must retain at least one V5 review ClaimBlock reference');
      checkSources(review.sourceIds, `${path}.editorialReview.sourceIds`, true);
    }
    checkSources(event.sourceIds, `${path}.sourceIds`, true);
  });

  const relationSignatures = new Map<string, string>();
  data.temporalRelations.forEach((relation, index) => {
    const path = `temporalRelations[${index}]`;
    if (!checkKeys(
      relation,
      ['id', 'family', 'type', 'orientation', 'participants', 'timeSpan', 'summary', 'qualifiers', 'sourceIds'],
      ['id', 'family', 'type', 'orientation', 'participants', 'timeSpan', 'summary', 'sourceIds'],
      path
    )) return;
    checkString(relation.id, `${path}.id`);
    if (!RELATION_FAMILY_SET.has(relation.family)) error(`${path}.family`, 'has an unknown RelationFamily');
    checkString(relation.type, `${path}.type`);
    if (!RELATION_ORIENTATIONS.has(relation.orientation)) error(`${path}.orientation`, 'has an unknown orientation');
    const validTime = checkTimeSpan(relation.timeSpan, `${path}.timeSpan`);
    checkString(relation.summary, `${path}.summary`);
    if (relation.qualifiers !== undefined) checkStringArray(relation.qualifiers, `${path}.qualifiers`);
    checkSources(relation.sourceIds, `${path}.sourceIds`, true);
    const subjectKeys = new Set<string>();
    const phaseSpansByEntity = new Map<string, TimeSpan[]>();
    const eventSpansByEvent = new Map<string, TimeSpan>();
    if (!Array.isArray(relation.participants) || relation.participants.length < 2) {
      error(`${path}.participants`, 'must contain at least two participants');
    } else relation.participants.forEach((participant, participantIndex) => {
      const participantPath = `${path}.participants[${participantIndex}]`;
      if (!isRecord(participant) || !isRecord(participant.subject)) {
        error(participantPath, 'must contain a subject object');
        return;
      }
      if (participant.subject.kind === 'entity') {
        checkKeys(participant, ['subject', 'phaseId', 'role', 'viewLabel', 'sourceIds'], ['subject', 'phaseId', 'role', 'viewLabel', 'sourceIds'], participantPath);
        checkKeys(participant.subject, ['kind', 'id'], ['kind', 'id'], `${participantPath}.subject`);
        checkRef('entities', participant.subject.id, `${participantPath}.subject.id`);
        checkRef('entityPhases', participant.phaseId, `${participantPath}.phaseId`);
        if (nonEmptyString(participant.subject.id)) {
          subjectKeys.add(`entity:${participant.subject.id}`);
        }
        const phase = maps.entityPhases.get(participant.phaseId as string);
        if (phase && phase.entityId !== participant.subject.id) error(`${participantPath}.phaseId`, 'must belong to participant Entity');
        if (phase && validTime && !valuesOverlap(phase.timeSpan as TimeSpan, relation.timeSpan)) {
          error(
            `${participantPath}.phaseId`,
            'participant EntityPhase timeSpan must overlap TemporalRelation timeSpan'
          );
        }
        if (phase && nonEmptyString(participant.subject.id)) {
          const spans = phaseSpansByEntity.get(participant.subject.id) ?? [];
          spans.push(phase.timeSpan as TimeSpan);
          phaseSpansByEntity.set(participant.subject.id, spans);
        }
        if (phase && (
          !Array.isArray(phase.relationIds) ||
          !phase.relationIds.includes(relation.id)
        )) {
          error(`${participantPath}.phaseId`, 'participant EntityPhase must back-reference this TemporalRelation');
        }
      } else if (participant.subject.kind === 'event') {
        checkKeys(participant, ['subject', 'role', 'viewLabel', 'sourceIds'], ['subject', 'role', 'viewLabel', 'sourceIds'], participantPath);
        checkKeys(participant.subject, ['kind', 'id'], ['kind', 'id'], `${participantPath}.subject`);
        checkRef('events', participant.subject.id, `${participantPath}.subject.id`);
        if (nonEmptyString(participant.subject.id)) {
          subjectKeys.add(`event:${participant.subject.id}`);
        }
        const event = nonEmptyString(participant.subject.id)
          ? maps.events.get(participant.subject.id)
          : undefined;
        if (event && validTime && !valuesOverlap(relation.timeSpan, event.timeSpan as TimeSpan)) {
          error(`${participantPath}.subject.id`, 'Event timeSpan must overlap TemporalRelation timeSpan');
        }
        if (event && nonEmptyString(participant.subject.id)) {
          eventSpansByEvent.set(participant.subject.id, event.timeSpan as TimeSpan);
        }
      } else error(`${participantPath}.subject.kind`, 'must be entity or event');
      checkString(participant.role, `${participantPath}.role`);
      checkString(participant.viewLabel, `${participantPath}.viewLabel`);
      checkSources(participant.sourceIds, `${participantPath}.sourceIds`, true);
    });
    if (subjectKeys.size < 2) {
      error(`${path}.participants`, 'must contain at least two different KnowledgeSubjects');
    }
    if (relation.family !== 'historicalTransition' && validTime) {
      phaseSpansByEntity.forEach((phaseSpans, entityId) => {
        if (!timeSpanUnionCovers(phaseSpans, relation.timeSpan)) {
          error(
            `${path}.participants`,
            `Entity subject ${entityId} phases must cover TemporalRelation timeSpan without gaps`
          );
        }
      });
      eventSpansByEvent.forEach((eventSpan, eventId) => {
        if (!containsTimeSpan(eventSpan, relation.timeSpan)) {
          error(
            `${path}.participants`,
            `Event subject ${eventId} timeSpan must cover TemporalRelation timeSpan`
          );
        }
      });
    }
    const signatureParticipants = Array.isArray(relation.participants)
      ? relation.participants.map(participant => {
          const phase = 'phaseId' in participant ? participant.phaseId : '';
          return `${participant.subject.kind}:${participant.subject.id}:${phase}:${participant.role}`;
        }).sort()
      : [];
    const signature = `${relation.family}|${relation.type}|${relation.timeSpan.start ?? ''}|${relation.timeSpan.end ?? ''}|${signatureParticipants.join(',')}`;
    const duplicate = relationSignatures.get(signature);
    if (duplicate) error(path, `duplicates relation fact ${duplicate}`);
    else relationSignatures.set(signature, relation.id);
  });

  data.entityPhases.forEach((phase, phaseIndex) => phase.relationIds.forEach((relationId, relationIndex) => {
    const relation = maps.temporalRelations.get(relationId);
    if (!relation || !Array.isArray(relation.participants)) return;
    const includesPhase = relation.participants.some(participant => (
      isRecord(participant) && participant.phaseId === phase.id
    ));
    if (!includesPhase) {
      error(`entityPhases[${phaseIndex}].relationIds[${relationIndex}]`, 'TemporalRelation does not include this EntityPhase');
    }
  }));

  return {
    valid: errors.length === 0,
    errors,
    counts: Object.fromEntries(Object.entries(collections).map(([name, values]) => [name, values.length]))
  };
}
