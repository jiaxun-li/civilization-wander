import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  atlasData,
  contentModuleDefinitions
} from '../../src/data/atlas-data.ts';

import type {
  EdgeDecisionRecord,
  EntityDecisionRecord,
  EventDecisionRecord,
  MigrationCounts,
  RelationCandidateLedger,
  ScenePhaseSignalLedger,
  ScenePhaseSignalFlag,
  V5TimeSpanSnapshot
} from './types.ts';
import type {
  SceneMigrationDisposition,
  ScenePhaseSignal
} from '../schema/migration.ts';
import type { TimeSpan } from '../schema/common.ts';
import type { ConceptLayerId } from '../schema/concept.ts';
import type { EntityType } from '../schema/entity-types.ts';

type UnknownRecord = Record<string, unknown>;

const MIGRATION_VERSION = 1;
const SOURCE_SCHEMA_VERSION = 5;
const migrationRoot = dirname(fileURLToPath(import.meta.url));
const driftEntries: {
  path: string;
  status: 'created' | 'unchanged' | 'changed';
  previousDigest?: string;
  currentDigest: string;
}[] = [];

const outputDirectories = [
  'baseline',
  'entity-decisions',
  'event-decisions',
  'scene-phase',
  'edge-decisions',
  'relation-candidates',
  'handoffs'
] as const;

function moduleSlug(file: string): string {
  return file.replace(/^data\//, '').replace(/\.ts$/, '');
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function sortStrings(values: readonly string[]): string[] {
  return unique(values).sort((left, right) => left.localeCompare(right));
}

function asRecord(value: unknown, context: string): UnknownRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${context} must be an object`);
  }
  return value as UnknownRecord;
}

function asString(value: unknown, context: string): string {
  if (typeof value !== 'string' || !value) throw new TypeError(`${context} must be a non-empty string`);
  return value;
}

function asStringArray(value: unknown, context: string): readonly string[] {
  if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) {
    throw new TypeError(`${context} must be an array of strings`);
  }
  return value;
}

function snapshotTimeSpan(value: unknown): V5TimeSpanSnapshot {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const record = value as UnknownRecord;
  const result: {
    start?: number;
    end?: number;
    label?: string;
    approximate?: boolean;
  } = {};
  if (typeof record.start === 'number') result.start = record.start;
  if (typeof record.end === 'number') result.end = record.end;
  if (typeof record.label === 'string') result.label = record.label;
  if (typeof record.approximate === 'boolean') result.approximate = record.approximate;
  return result;
}

function requiredTimeSpan(value: unknown, context: string): TimeSpan {
  const timeSpan = snapshotTimeSpan(value);
  if (!timeSpan.label) throw new Error(`${context} must have a timeSpan label`);
  return {
    ...(typeof timeSpan.start === 'number' ? { start: timeSpan.start } : {}),
    ...(typeof timeSpan.end === 'number' ? { end: timeSpan.end } : {}),
    label: timeSpan.label,
    ...(typeof timeSpan.approximate === 'boolean' ? { approximate: timeSpan.approximate } : {})
  };
}

function intersectTimeSpans(
  sceneTimeSpan: V5TimeSpanSnapshot,
  eventTimeSpan: V5TimeSpanSnapshot
): V5TimeSpanSnapshot | undefined {
  if (
    typeof sceneTimeSpan.start !== 'number' ||
    typeof sceneTimeSpan.end !== 'number' ||
    typeof eventTimeSpan.start !== 'number' ||
    typeof eventTimeSpan.end !== 'number'
  ) {
    return undefined;
  }

  const start = Math.max(sceneTimeSpan.start, eventTimeSpan.start);
  const end = Math.min(sceneTimeSpan.end, eventTimeSpan.end);
  if (start > end) return undefined;

  return {
    start,
    end,
    approximate: Boolean(sceneTimeSpan.approximate || eventTimeSpan.approximate)
  };
}

function entityTypeCandidates(oldType: string): readonly EntityType[] {
  const mapping: Record<string, readonly EntityType[]> = {
    artStyle: ['artisticTradition'],
    Commodity: ['commodity'],
    CulturalObject: ['artifactClass', 'documentCorpus', 'monument'],
    culturalTradition: ['culturalTradition'],
    GeographicFeature: ['geographicRegion', 'naturalFeature'],
    institution: ['institution'],
    languageSystem: ['language'],
    peopleGroup: ['community'],
    polity: ['polity'],
    religionAndMyth: ['religiousTradition', 'mythicTradition'],
    SettlementSite: ['settlement', 'archaeologicalSite'],
    TextDocument: ['documentCorpus', 'literaryTradition', 'mythicTradition'],
    war: [],
    wonder: ['monument'],
    writingSystem: ['writingSystem']
  };
  return mapping[oldType] ?? [];
}

function conceptLayerCandidates(oldType: string): readonly ConceptLayerId[] {
  const mapping: Record<string, readonly ConceptLayerId[]> = {
    artStyle: ['artAndLiterature'],
    Commodity: ['materialAndArchitecture'],
    CulturalObject: ['materialAndArchitecture', 'languageAndKnowledge', 'artAndLiterature'],
    culturalTradition: ['polityAndSociety', 'religionAndThought'],
    GeographicFeature: ['placeAndSite'],
    institution: ['polityAndSociety'],
    languageSystem: ['languageAndKnowledge'],
    peopleGroup: ['polityAndSociety'],
    polity: ['polityAndSociety'],
    religionAndMyth: ['religionAndThought'],
    SettlementSite: ['placeAndSite'],
    TextDocument: ['languageAndKnowledge', 'artAndLiterature', 'religionAndThought'],
    war: ['eventAndConflict'],
    wonder: ['materialAndArchitecture'],
    writingSystem: ['languageAndKnowledge']
  };
  return mapping[oldType] ?? [];
}

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

async function readExisting(target: string): Promise<string | undefined> {
  try {
    return await readFile(target, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
}

async function writeDerivedJson(relativePath: string, value: unknown): Promise<void> {
  const target = join(migrationRoot, relativePath);
  await mkdir(dirname(target), { recursive: true });
  const next = `${JSON.stringify(value, null, 2)}\n`;
  const previous = await readExisting(target);
  const currentDigest = sha256(next);
  driftEntries.push({
    path: relativePath.replaceAll('\\', '/'),
    status: previous === undefined ? 'created' : previous === next ? 'unchanged' : 'changed',
    ...(previous === undefined ? {} : { previousDigest: sha256(previous) }),
    currentDigest
  });
  if (previous !== next) await writeFile(target, next, 'utf8');
}

const REVIEWED_SCENE_DISPOSITION_KINDS = new Set([
  'mapped',
  'merged',
  'eventOnly',
  'narrativeOnly'
]);

function sceneSignalDerivedSnapshot(signal: UnknownRecord): UnknownRecord {
  const { disposition: _disposition, ...derived } = signal;
  return derived;
}

function reviewedSceneDisposition(value: unknown): SceneMigrationDisposition | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const disposition = value as UnknownRecord;
  return REVIEWED_SCENE_DISPOSITION_KINDS.has(String(disposition.kind))
    ? disposition as unknown as SceneMigrationDisposition
    : undefined;
}

/**
 * Scene signals are derived from V5, but their dispositions are human review
 * decisions. Preserve a reviewed disposition only while every derived field
 * and the matching audit record remain byte-for-byte equivalent as JSON.
 * Any V5 drift fails loudly instead of silently carrying an obsolete review
 * decision forward or overwriting it with `needsReview`.
 */
async function preserveReviewedSceneDispositions(
  relativePath: string,
  next: ScenePhaseSignalLedger
): Promise<ScenePhaseSignalLedger> {
  const target = join(migrationRoot, relativePath);
  const previousText = await readExisting(target);
  if (previousText === undefined) return next;

  const previous = asRecord(JSON.parse(previousText) as unknown, relativePath);
  if (!Array.isArray(previous.scenePhaseSignals) || !Array.isArray(previous.audit)) return next;

  const previousSignals = new Map<string, UnknownRecord>();
  for (const value of previous.scenePhaseSignals) {
    const signal = asRecord(value, `${relativePath}.scenePhaseSignals`);
    previousSignals.set(asString(signal.v5SceneId, `${relativePath}.v5SceneId`), signal);
  }
  const previousAudit = new Map<string, UnknownRecord>();
  for (const value of previous.audit) {
    const audit = asRecord(value, `${relativePath}.audit`);
    previousAudit.set(
      asString(audit.scenePhaseSignalId, `${relativePath}.audit.scenePhaseSignalId`),
      audit
    );
  }
  const nextAudit = new Map(next.audit.map(audit => [audit.scenePhaseSignalId, audit]));
  const nextSceneIds = new Set(next.scenePhaseSignals.map(signal => signal.v5SceneId));

  for (const [sceneId, previousSignal] of previousSignals) {
    if (reviewedSceneDisposition(previousSignal.disposition) && !nextSceneIds.has(sceneId)) {
      throw new Error(
        `Reviewed ScenePhaseSignal drift in ${relativePath}: V5 Scene ${sceneId} no longer exists`
      );
    }
  }

  return {
    ...next,
    scenePhaseSignals: next.scenePhaseSignals.map(signal => {
      const previousSignal = previousSignals.get(signal.v5SceneId);
      const disposition = reviewedSceneDisposition(previousSignal?.disposition);
      if (!previousSignal || !disposition) return signal;

      const derivedUnchanged = JSON.stringify(sceneSignalDerivedSnapshot(previousSignal)) ===
        JSON.stringify(sceneSignalDerivedSnapshot(signal as unknown as UnknownRecord));
      const oldAudit = previousAudit.get(signal.id);
      const newAudit = nextAudit.get(signal.id);
      const auditUnchanged = oldAudit !== undefined && newAudit !== undefined &&
        JSON.stringify(oldAudit) === JSON.stringify(newAudit);
      if (!derivedUnchanged || !auditUnchanged) {
        throw new Error(
          `Reviewed ScenePhaseSignal drift in ${relativePath}: derived V5 input changed for ${signal.v5SceneId}`
        );
      }
      return { ...signal, disposition };
    })
  };
}

function scaffoldIsUnreviewed(relativePath: string, value: unknown): boolean {
  const record = asRecord(value, relativePath);
  if (relativePath.startsWith('relation-candidates/')) {
    return Array.isArray(record.candidates) && record.candidates.length === 0;
  }
  if (relativePath.startsWith('handoffs/')) return record.status === 'notStarted';
  if (!Array.isArray(record.decisions)) return false;
  return record.decisions.every(value => asRecord(value, relativePath).status === 'pending');
}

async function writeScaffoldJson(relativePath: string, value: unknown): Promise<void> {
  const target = join(migrationRoot, relativePath);
  await mkdir(dirname(target), { recursive: true });
  const previous = await readExisting(target);
  if (previous !== undefined) {
    const previousValue = JSON.parse(previous) as unknown;
    if (!scaffoldIsUnreviewed(relativePath, previousValue)) return;
  }
  const next = `${JSON.stringify(value, null, 2)}\n`;
  if (previous !== next) await writeFile(target, next, 'utf8');
}

function indexOwnerModules(): {
  entity: Map<string, string>;
  event: Map<string, string>;
  scene: Map<string, string>;
  edge: Map<string, string>;
} {
  const result = {
    entity: new Map<string, string>(),
    event: new Map<string, string>(),
    scene: new Map<string, string>(),
    edge: new Map<string, string>()
  };

  for (const definition of contentModuleDefinitions) {
    const moduleData = asRecord(definition.data, definition.file);
    for (const [collection, index] of [
      ['entities', result.entity],
      ['events', result.event],
      ['scenes', result.scene],
      ['structuralEdges', result.edge]
    ] as const) {
      const records = moduleData[collection];
      if (!Array.isArray(records)) throw new TypeError(`${definition.file}.${collection} must be an array`);
      for (const value of records) {
        const record = asRecord(value, `${definition.file}.${collection}`);
        const id = asString(record.id, `${definition.file}.${collection}.id`);
        if (index.has(id)) throw new Error(`duplicate ${collection} ID ${id}`);
        index.set(id, definition.file);
      }
    }
  }

  return result;
}

const owners = indexOwnerModules();
const globalEvents = new Map(atlasData.events.map(event => [event.id, event]));
const globalEntities = new Map(atlasData.entities.map(entity => [entity.id, entity]));
const cardBySceneId = new Map<string, (typeof atlasData.cards)[number]>();

for (const card of atlasData.cards) {
  for (const sceneId of card.sceneIds) {
    if (cardBySceneId.has(sceneId)) throw new Error(`Scene ${sceneId} is owned by more than one Card`);
    cardBySceneId.set(sceneId, card);
  }
}

function makeScenePhaseSignals(sourceModule: string, scenes: readonly unknown[]): ScenePhaseSignalLedger {
  const scenePhaseSignals: ScenePhaseSignal[] = [];
  const audit: ScenePhaseSignalLedger['audit'][number][] = [];

  for (const value of scenes) {
    const scene = asRecord(value, `${sourceModule}.scenes`);
    const sceneId = asString(scene.id, `${sourceModule}.scene.id`);
    const card = cardBySceneId.get(sceneId);
    if (!card) throw new Error(`Scene ${sceneId} has no owning Card`);

    const eventIds = asStringArray(scene.eventIds, `${sourceModule}.${sceneId}.eventIds`);
    const events = eventIds.map(eventId => {
      const event = globalEvents.get(eventId);
      if (!event) throw new Error(`Scene ${sceneId} references missing Event ${eventId}`);
      return event;
    });
    const candidateEntityIds = sortStrings(events.flatMap(event => [...event.participantEntityIds]));
    if (!candidateEntityIds.length) throw new Error(`Scene ${sceneId} produces no Entity phase candidates`);

    const sceneTimeSpan = requiredTimeSpan(scene.timeSpan, `${sourceModule}.${sceneId}`);
    const entityEvidence = candidateEntityIds.map(candidateEntityId => {
      if (!globalEntities.has(candidateEntityId)) {
        throw new Error(`Scene ${sceneId} resolves missing Entity ${candidateEntityId}`);
      }

      const relatedEvents = events.filter(event => event.participantEntityIds.includes(candidateEntityId));
      const eventTimeSpans = relatedEvents.map(event => ({
        eventId: event.id,
        timeSpan: snapshotTimeSpan(event.timeSpan)
      }));
      const intersections = eventTimeSpans.map(item => intersectTimeSpans(sceneTimeSpan, item.timeSpan));
      const hasNumericComparableSpan = eventTimeSpans.some(item => (
        typeof sceneTimeSpan.start === 'number' &&
        typeof sceneTimeSpan.end === 'number' &&
        typeof item.timeSpan.start === 'number' &&
        typeof item.timeSpan.end === 'number'
      ));
      const timeConflict = hasNumericComparableSpan && intersections.every(item => item === undefined);
      const suggestedTimeSpan = relatedEvents.length === 1 ? intersections[0] : undefined;
      return {
        entityId: candidateEntityId,
        eventIds: relatedEvents.map(event => event.id),
        eventTimeSpans,
        ...(suggestedTimeSpan ? { suggestedTimeSpan } : {}),
        timeConflict
      };
    });

    const flags: ScenePhaseSignalFlag[] = [];
    if (eventIds.length > 1) flags.push('multipleEvents');
    if (candidateEntityIds.length > 1) flags.push('multipleEntities');
    if (!candidateEntityIds.includes(card.primaryEntityId)) flags.push('cardPrimaryNotParticipant');
    if (scene.timeDisplay === 'undatedNarrative') flags.push('undatedNarrative');
    if (entityEvidence.some(item => item.timeConflict)) flags.push('timeConflict');
    if (
      events.some(event => owners.event.get(event.id) !== sourceModule) ||
      candidateEntityIds.some(entityId => owners.entity.get(entityId) !== sourceModule)
    ) {
      flags.push('crossModuleReference');
    }

    const signalId = `signal-${sceneId}`;
    const sourceIds = sortStrings([
      ...asStringArray(scene.sourceIds, `${sourceModule}.${sceneId}.sourceIds`),
      ...events.flatMap(event => [...event.sourceIds])
    ]);
    scenePhaseSignals.push({
      id: signalId,
      v5SceneId: sceneId,
      v5OwnerCardId: card.id,
      timeSpan: sceneTimeSpan,
      entitySignals: entityEvidence.map(item => ({
        entityId: item.entityId,
        basis: 'eventParticipant',
        referenceId: item.eventIds[0]
      })),
      eventIds,
      sourceIds,
      disposition: {
        kind: 'needsReview',
        questions: [
          'Determine whether this narrative Scene supports a distinct EntityPhase or only contributes evidence to a broader phase.',
          ...flags.map(flag => `Review migration flag: ${flag}.`)
        ]
      }
    });
    audit.push({
      scenePhaseSignalId: signalId,
      sourceModule,
      cardPrimaryEntityId: card.primaryEntityId,
      entityEvidence: entityEvidence.map(({ timeConflict: _timeConflict, ...item }) => item),
      flags
    });
  }

  return {
    ledgerVersion: 1,
    sourceModule,
    scenePhaseSignals,
    audit
  };
}

async function generate(): Promise<void> {
  for (const directory of outputDirectories) await mkdir(join(migrationRoot, directory), { recursive: true });

  const summaryModules: {
    sourceModule: string;
    slug: string;
    counts: MigrationCounts;
    scenePhaseSignalCount: number;
    entitySignalCount: number;
  }[] = [];
  let totalSignals = 0;
  let totalEntitySignals = 0;

  for (const definition of contentModuleDefinitions) {
    const sourceModule = definition.file;
    const slug = moduleSlug(sourceModule);
    const moduleData = asRecord(definition.data, sourceModule);
    const entities = moduleData.entities as readonly UnknownRecord[];
    const events = moduleData.events as readonly UnknownRecord[];
    const scenes = moduleData.scenes as readonly UnknownRecord[];
    const structuralEdges = moduleData.structuralEdges as readonly UnknownRecord[];

    const baseline = {
      baselineVersion: MIGRATION_VERSION,
      sourceSchemaVersion: SOURCE_SCHEMA_VERSION,
      sourceModule,
      counts: {
        entities: entities.length,
        events: events.length,
        scenes: scenes.length,
        structuralEdges: structuralEdges.length
      },
      entities: entities.map(entity => ({
        id: entity.id,
        type: entity.type,
        name: entity.name,
        alternativeNames: entity.alternativeNames ?? [],
        timeSpan: snapshotTimeSpan(entity.timeSpan),
        sourceIds: entity.sourceIds
      })),
      events: events.map(event => ({
        id: event.id,
        kind: event.kind,
        title: event.title,
        timeSpan: snapshotTimeSpan(event.timeSpan),
        participantEntityIds: event.participantEntityIds,
        sourceIds: event.sourceIds
      })),
      scenes: scenes.map(scene => {
        const sceneId = asString(scene.id, `${sourceModule}.scene.id`);
        const card = cardBySceneId.get(sceneId);
        if (!card) throw new Error(`Scene ${sceneId} has no owning Card`);
        return {
          id: sceneId,
          title: scene.title,
          timeSpan: snapshotTimeSpan(scene.timeSpan),
          timeDisplay: scene.timeDisplay ?? 'year',
          eventIds: scene.eventIds,
          sourceIds: scene.sourceIds,
          cardId: card.id,
          cardPrimaryEntityId: card.primaryEntityId
        };
      }),
      structuralEdges: structuralEdges.map(edge => ({
        id: edge.id,
        family: edge.family,
        type: edge.type,
        source: edge.source,
        target: edge.target,
        timeSpan: snapshotTimeSpan(edge.timeSpan),
        label: edge.label,
        summaries: edge.summaries,
        qualifiers: edge.qualifiers ?? [],
        sourceIds: edge.sourceIds
      }))
    };

    const signalLedger = makeScenePhaseSignals(sourceModule, scenes);
    const reviewedSignalLedger = await preserveReviewedSceneDispositions(
      `scene-phase/${slug}.json`,
      signalLedger
    );
    const entitySignalCount = signalLedger.scenePhaseSignals.reduce(
      (count, signal) => count + signal.entitySignals.length,
      0
    );
    totalSignals += signalLedger.scenePhaseSignals.length;
    totalEntitySignals += entitySignalCount;

    const entityDecisions = {
      ledgerVersion: MIGRATION_VERSION,
      sourceModule,
      decisions: entities.map(entity => {
        const entityId = asString(entity.id, `${sourceModule}.entity.id`);
        const oldType = asString(entity.type, `${sourceModule}.entity.type`);
        return {
          entityId,
          oldType,
          recommendedDisposition: oldType === 'war' ? 'convertToEventSubject' : 'migrateEntity',
          proposedEntityTypes: entityTypeCandidates(oldType),
          proposedConceptLayers: conceptLayerCandidates(oldType),
          acceptedEntityType: null,
          acceptedConceptLayerId: null,
          acceptedPhaseIds: [],
          acceptedDisposition: null,
          status: 'pending'
        };
      })
    } satisfies {
      ledgerVersion: 1;
      sourceModule: string;
      decisions: readonly EntityDecisionRecord[];
    };

    const eventDecisions = {
      ledgerVersion: MIGRATION_VERSION,
      sourceModule,
      decisions: events.map(event => {
        const eventId = asString(event.id, `${sourceModule}.event.id`);
        const oldKind = asString(event.kind, `${sourceModule}.${eventId}.kind`);
        return {
          eventId,
          oldKind,
          recommendedDisposition: oldKind === 'historicalEvent' || oldKind === 'historicalProcess'
            ? 'retainEvent'
            : 'useAsPhaseEvidence',
          acceptedDisposition: null,
          participantRolesResolved: false,
          status: 'pending'
        };
      })
    } satisfies {
      ledgerVersion: 1;
      sourceModule: string;
      decisions: readonly EventDecisionRecord[];
    };

    const edgeDecisions = {
      ledgerVersion: MIGRATION_VERSION,
      sourceModule,
      decisions: structuralEdges.map(edge => {
        const structuralEdgeId = asString(edge.id, `${sourceModule}.structuralEdge.id`);
        return {
          structuralEdgeId,
          recommendedDisposition: 'reviewForTemporalRelation',
          acceptedDisposition: null,
          participantRolesResolved: false,
          phaseBindingsResolved: false,
          relationFamilyResolved: false,
          relationTypeResolved: false,
          status: 'pending'
        };
      })
    } satisfies {
      ledgerVersion: 1;
      sourceModule: string;
      decisions: readonly EdgeDecisionRecord[];
    };

    const relationCandidates: RelationCandidateLedger = {
      ledgerVersion: 1,
      runtimeCollection: false,
      sourceModule,
      candidates: []
    };

    const handoff = {
      handoffVersion: MIGRATION_VERSION,
      sourceModule,
      status: 'notStarted',
      coverage: baseline.counts,
      scenePhaseSignalCount: signalLedger.scenePhaseSignals.length,
      entitySignalCount,
      unresolvedRelationCandidateCount: 0,
      checks: {
        baselineGenerated: true,
        entityDecisionsComplete: false,
        eventDecisionsComplete: false,
        phasesReviewed: false,
        edgeDecisionsComplete: false,
        relationCandidatesReviewed: false
      },
      notes: []
    };

    await Promise.all([
      writeDerivedJson(`baseline/${slug}.json`, baseline),
      writeScaffoldJson(`entity-decisions/${slug}.json`, entityDecisions),
      writeScaffoldJson(`event-decisions/${slug}.json`, eventDecisions),
      writeDerivedJson(`scene-phase/${slug}.json`, reviewedSignalLedger),
      writeScaffoldJson(`edge-decisions/${slug}.json`, edgeDecisions),
      writeScaffoldJson(`relation-candidates/${slug}.json`, relationCandidates),
      writeScaffoldJson(`handoffs/${slug}.json`, handoff)
    ]);

    summaryModules.push({
      sourceModule,
      slug,
      counts: baseline.counts,
      scenePhaseSignalCount: signalLedger.scenePhaseSignals.length,
      entitySignalCount
    });
  }

  const totals = summaryModules.reduce<MigrationCounts>((result, value) => {
    return {
      entities: result.entities + value.counts.entities,
      events: result.events + value.counts.events,
      scenes: result.scenes + value.counts.scenes,
      structuralEdges: result.structuralEdges + value.counts.structuralEdges
    };
  }, { entities: 0, events: 0, scenes: 0, structuralEdges: 0 });

  const liveTotals = {
    entities: atlasData.entities.length,
    events: atlasData.events.length,
    scenes: atlasData.scenes.length,
    structuralEdges: atlasData.structuralEdges.length
  };
  if (JSON.stringify(totals) !== JSON.stringify(liveTotals)) {
    throw new Error(`module baselines ${JSON.stringify(totals)} do not match live V5 ${JSON.stringify(liveTotals)}`);
  }

  const sourceSnapshotPayload = atlasData.sources.map(source => ({
    id: source.id,
    title: source.title,
    ...(source.author ? { author: source.author } : {}),
    ...(typeof source.year === 'number' ? { year: source.year } : {}),
    ...(source.publisher ? { publisher: source.publisher } : {}),
    ...(source.url ? { url: source.url } : {})
  }));
  const sourceSnapshotDigest = sha256(JSON.stringify(sourceSnapshotPayload));
  await writeDerivedJson('baseline/sources-v5.json', {
    baselineVersion: MIGRATION_VERSION,
    sourceSchemaVersion: SOURCE_SCHEMA_VERSION,
    digestAlgorithm: 'sha256',
    digest: sourceSnapshotDigest,
    count: sourceSnapshotPayload.length,
    sources: sourceSnapshotPayload
  });

  await writeDerivedJson('baseline/atlas-v5-summary.json', {
    baselineVersion: MIGRATION_VERSION,
    sourceSchemaVersion: SOURCE_SCHEMA_VERSION,
    totals,
    sourceCount: sourceSnapshotPayload.length,
    sourceSnapshotDigest,
    scenePhaseSignalCount: totalSignals,
    entitySignalCount: totalEntitySignals,
    modules: summaryModules
  });

  const drift = driftEntries
    .slice()
    .sort((left, right) => left.path.localeCompare(right.path));
  const changed = drift.filter(entry => entry.status === 'changed');
  const created = drift.filter(entry => entry.status === 'created');
  await writeFile(join(migrationRoot, 'baseline', 'drift-report.json'), `${JSON.stringify({
    reportVersion: 1,
    sourceSchemaVersion: SOURCE_SCHEMA_VERSION,
    status: changed.length ? 'driftDetected' : created.length ? 'baselineCreated' : 'noDrift',
    sourceSnapshotDigest,
    createdFiles: created.map(entry => entry.path),
    changedFiles: changed.map(entry => ({
      path: entry.path,
      previousDigest: entry.previousDigest,
      currentDigest: entry.currentDigest
    })),
    checkedFiles: drift
  }, null, 2)}\n`, 'utf8');

  process.stdout.write(
    `Generated V5 migration ledgers for ${summaryModules.length} modules: ` +
    `${totals.entities} Entities, ${totals.events} Events, ${totals.scenes} Scenes, ` +
    `${totals.structuralEdges} StructuralEdges, ${totalSignals} ScenePhaseSignals, ` +
    `${totalEntitySignals} nested entity signals, ${sourceSnapshotPayload.length} Sources. ` +
    `Drift check: ${changed.length} changed, ${created.length} created.\n`
  );
}

await generate();
