import type { V6KnowledgeCore } from '../schema/index.ts';
import { validateV6KnowledgeCore } from './validate-core.ts';

type UnknownRecord = Record<string, unknown>;

export const EXPECTED_V6_MIGRATION_HANDOFF_COUNT = 7;

export interface MigrationTargetBundle {
  readonly core: V6KnowledgeCore;
  readonly pendingHistoricalProcesses: readonly unknown[];
  readonly baselineLedgers: readonly unknown[];
  readonly entityDecisionLedgers: readonly unknown[];
  readonly eventDecisionLedgers: readonly unknown[];
  readonly scenePhaseLedgers: readonly unknown[];
  readonly edgeDecisionLedgers: readonly unknown[];
  readonly relationCandidateLedgers: readonly unknown[];
  readonly handoffLedgers: readonly unknown[];
}

export interface MigrationTargetValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly counts: {
    readonly entityDecisions: number;
    readonly eventDecisions: number;
    readonly scenePhaseSignals: number;
    readonly edgeDecisions: number;
    readonly relationCandidates: number;
    readonly handoffs: number;
    readonly pendingHistoricalProcesses: number;
  };
}

const HANDOFF_CHECKS = [
  'baselineGenerated',
  'entityDecisionsComplete',
  'eventDecisionsComplete',
  'phasesReviewed',
  'edgeDecisionsComplete',
  'relationCandidatesReviewed'
] as const;

const COVERAGE_KEYS = ['entities', 'events', 'scenes', 'structuralEdges'] as const;

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function emptyCounts() {
  return {
    entityDecisions: 0,
    eventDecisions: 0,
    scenePhaseSignals: 0,
    edgeDecisions: 0,
    relationCandidates: 0,
    handoffs: 0,
    pendingHistoricalProcesses: 0
  };
}

export function validateMigrationTargets(
  bundle: MigrationTargetBundle
): MigrationTargetValidationResult {
  try {
    return validateMigrationTargetsUnsafe(bundle);
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    return {
      valid: false,
      errors: [`migration targets: malformed input must not interrupt validation (${detail})`],
      counts: emptyCounts()
    };
  }
}

function validateMigrationTargetsUnsafe(
  bundle: MigrationTargetBundle
): MigrationTargetValidationResult {
  const errors: string[] = [];
  const counts = emptyCounts();
  const error = (path: string, message: string): void => {
    errors.push(`${path}: ${message}`);
  };

  const coreResult = validateV6KnowledgeCore(bundle.core);
  coreResult.errors.forEach(message => error('core', message));
  if (!isRecord(bundle.core)) {
    return { valid: false, errors, counts };
  }
  const coreCollections = ['entities', 'entityPhases', 'events', 'temporalRelations'] as const;
  if (coreCollections.some(key => !Array.isArray(bundle.core[key]))) {
    return { valid: false, errors, counts };
  }

  const entities = new Map(
    (bundle.core.entities as readonly unknown[])
      .filter(isRecord)
      .filter(item => isString(item.id))
      .map(item => [item.id as string, item])
  );
  const phases = new Map(
    (bundle.core.entityPhases as readonly unknown[])
      .filter(isRecord)
      .filter(item => isString(item.id))
      .map(item => [item.id as string, item])
  );
  const events = new Set(
    (bundle.core.events as readonly unknown[])
      .filter(isRecord)
      .map(item => item.id)
      .filter(isString)
  );
  const pendingHistoricalProcesses = new Map<string, UnknownRecord>();
  if (!Array.isArray(bundle.pendingHistoricalProcesses)) {
    error('pendingHistoricalProcesses', 'must be an array');
  } else {
    counts.pendingHistoricalProcesses = bundle.pendingHistoricalProcesses.length;
    bundle.pendingHistoricalProcesses.forEach((review, index) => {
      const path = `pendingHistoricalProcesses[${index}]`;
      if (!isRecord(review)) {
        error(path, 'must be an object');
        return;
      }
      if (!isString(review.id)) {
        error(`${path}.id`, 'must be a non-empty Event ID');
        return;
      }
      if (review.status !== 'pending') error(`${path}.status`, 'must equal pending');
      if (!isString(review.reason)) error(`${path}.reason`, 'must be a non-empty string');
      if (!isRecord(review.candidate)) {
        error(`${path}.candidate`, 'must retain the proposed historicalProcess');
        return;
      }
      if (review.candidate.id !== review.id) error(`${path}.candidate.id`, 'must equal review id');
      if (review.candidate.kind !== 'historicalProcess') {
        error(`${path}.candidate.kind`, 'must equal historicalProcess');
      }
      if (events.has(review.id)) error(`${path}.id`, 'must not also enter authoritative core events');
      if (pendingHistoricalProcesses.has(review.id)) error(`${path}.id`, `duplicates ${review.id}`);
      else pendingHistoricalProcesses.set(review.id, review);
    });
  }
  const reviewedEventTargets = new Set([...events, ...pendingHistoricalProcesses.keys()]);
  const relations = new Set(
    (bundle.core.temporalRelations as readonly unknown[])
      .filter(isRecord)
      .map(item => item.id)
      .filter(isString)
  );

  const requireTarget = (
    target: unknown,
    targets: ReadonlySet<string> | ReadonlyMap<string, unknown>,
    path: string,
    label: string
  ): target is string => {
    if (!isString(target)) {
      error(path, `must be a non-empty ${label} ID`);
      return false;
    }
    if (!targets.has(target)) error(path, `references missing V6 ${label} ${target}`);
    return true;
  };

  const requireUniqueTargets = (
    value: unknown,
    targets: ReadonlySet<string> | ReadonlyMap<string, unknown>,
    path: string,
    label: string,
    allowEmpty = false
  ): string[] => {
    if (!isStringArray(value)) {
      error(path, `must be an array of non-empty ${label} IDs`);
      return [];
    }
    if (!allowEmpty && value.length === 0) error(path, 'must not be empty');
    if (new Set(value).size !== value.length) error(path, 'must not contain duplicate IDs');
    value.forEach((id, index) => requireTarget(id, targets, `${path}[${index}]`, label));
    return value;
  };

  interface IndexedLedger {
    readonly ledger: UnknownRecord;
    readonly path: string;
  }
  const indexLedgers = (value: unknown, label: string): Map<string, IndexedLedger> => {
    const result = new Map<string, IndexedLedger>();
    if (!Array.isArray(value)) {
      error(label, 'must be an array');
      return result;
    }
    value.forEach((candidate, index) => {
      const path = `${label}[${index}]`;
      if (!isRecord(candidate)) {
        error(path, 'must be an object');
        return;
      }
      if (!isString(candidate.sourceModule)) {
        error(`${path}.sourceModule`, 'must be a non-empty string');
        return;
      }
      if (result.has(candidate.sourceModule)) {
        error(`${path}.sourceModule`, `duplicates ledger for ${candidate.sourceModule}`);
        return;
      }
      result.set(candidate.sourceModule, { ledger: candidate, path });
    });
    return result;
  };

  const baselineByModule = indexLedgers(bundle.baselineLedgers, 'baselineLedgers');
  const entityByModule = indexLedgers(bundle.entityDecisionLedgers, 'entityDecisionLedgers');
  const eventByModule = indexLedgers(bundle.eventDecisionLedgers, 'eventDecisionLedgers');
  const sceneByModule = indexLedgers(bundle.scenePhaseLedgers, 'scenePhaseLedgers');
  const edgeByModule = indexLedgers(bundle.edgeDecisionLedgers, 'edgeDecisionLedgers');
  const candidateByModule = indexLedgers(bundle.relationCandidateLedgers, 'relationCandidateLedgers');
  const handoffByModule = indexLedgers(bundle.handoffLedgers, 'handoffLedgers');

  const candidateIds = new Set<string>();
  for (const { ledger, path: ledgerPath } of candidateByModule.values()) {
    if (!Array.isArray(ledger.candidates)) {
      error(`${ledgerPath}.candidates`, 'must be an array');
      continue;
    }
    counts.relationCandidates += ledger.candidates.length;
    ledger.candidates.forEach((entry, entryIndex) => {
      const path = `${ledgerPath}.candidates[${entryIndex}]`;
      if (!isRecord(entry) || !isRecord(entry.candidate)) {
        error(`${path}.candidate`, 'must be an audited RelationCandidate object');
        return;
      }
      const candidate = entry.candidate;
      if (!isString(candidate.id)) error(`${path}.candidate.id`, 'must be a non-empty string');
      else if (candidateIds.has(candidate.id)) error(`${path}.candidate.id`, `duplicates ${candidate.id}`);
      else candidateIds.add(candidate.id);
      if (!Array.isArray(candidate.participants)) {
        error(`${path}.candidate.participants`, 'must be an array');
        return;
      }
      candidate.participants.forEach((participant, participantIndex) => {
        const participantPath = `${path}.candidate.participants[${participantIndex}]`;
        if (!isRecord(participant) || participant.kind !== 'knownSubject') return;
        if (!isRecord(participant.subject)) {
          error(`${participantPath}.subject`, 'must be a KnowledgeSubject');
          return;
        }
        const subject = participant.subject;
        if (subject.kind === 'entity') {
          if (requireTarget(subject.id, entities, `${participantPath}.subject.id`, 'Entity') && participant.proposedPhaseId !== undefined) {
            if (requireTarget(participant.proposedPhaseId, phases, `${participantPath}.proposedPhaseId`, 'EntityPhase')) {
              const phase = phases.get(participant.proposedPhaseId) as UnknownRecord | undefined;
              if (phase?.entityId !== subject.id) {
                error(`${participantPath}.proposedPhaseId`, `must belong to Entity ${subject.id}`);
              }
            }
          }
        } else if (subject.kind === 'event') {
          requireTarget(subject.id, reviewedEventTargets, `${participantPath}.subject.id`, 'accepted Event or pending historical process');
          if (participant.proposedPhaseId !== undefined) {
            error(`${participantPath}.proposedPhaseId`, 'is only valid for an Entity knownSubject');
          }
        } else {
          error(`${participantPath}.subject.kind`, 'must be entity or event');
        }
      });
    });
  }

  const acceptedDecisions = (
    indexed: ReadonlyMap<string, IndexedLedger>,
    label: string,
    visit: (decision: UnknownRecord, path: string) => void
  ): void => {
    for (const { ledger, path: ledgerPath } of indexed.values()) {
      if (!Array.isArray(ledger.decisions)) {
        error(`${ledgerPath}.decisions`, 'must be an array');
        continue;
      }
      ledger.decisions.forEach((decision, decisionIndex) => {
        const path = `${ledgerPath}.decisions[${decisionIndex}]`;
        if (!isRecord(decision)) {
          error(path, 'must be an object');
          return;
        }
        if (decision.status !== 'accepted') error(`${path}.status`, 'must equal accepted for final integration');
        if (!isRecord(decision.acceptedDisposition)) {
          error(`${path}.acceptedDisposition`, 'must be an object');
          return;
        }
        visit(decision, path);
      });
    }
    if (label === 'entity') counts.entityDecisions = [...indexed.values()].reduce((sum, item) => sum + (Array.isArray(item.ledger.decisions) ? item.ledger.decisions.length : 0), 0);
    if (label === 'event') counts.eventDecisions = [...indexed.values()].reduce((sum, item) => sum + (Array.isArray(item.ledger.decisions) ? item.ledger.decisions.length : 0), 0);
    if (label === 'edge') counts.edgeDecisions = [...indexed.values()].reduce((sum, item) => sum + (Array.isArray(item.ledger.decisions) ? item.ledger.decisions.length : 0), 0);
  };

  acceptedDecisions(entityByModule, 'entity', (decision, path) => {
    const disposition = decision.acceptedDisposition as UnknownRecord;
    const phaseIds = isStringArray(decision.acceptedPhaseIds) ? decision.acceptedPhaseIds : [];
    if (!isStringArray(decision.acceptedPhaseIds)) error(`${path}.acceptedPhaseIds`, 'must be an array of EntityPhase IDs');
    let targetEntityIds: string[] = [];
    if (disposition.kind === 'migrated') {
      if (requireTarget(disposition.entityId, entities, `${path}.acceptedDisposition.entityId`, 'Entity')) targetEntityIds = [disposition.entityId as string];
    } else if (disposition.kind === 'merged') {
      if (requireTarget(disposition.intoEntityId, entities, `${path}.acceptedDisposition.intoEntityId`, 'Entity')) targetEntityIds = [disposition.intoEntityId as string];
    } else if (disposition.kind === 'split') {
      targetEntityIds = requireUniqueTargets(disposition.intoEntityIds, entities, `${path}.acceptedDisposition.intoEntityIds`, 'Entity');
    } else if (disposition.kind === 'convertedToEvent') {
      requireTarget(disposition.eventId, events, `${path}.acceptedDisposition.eventId`, 'Event');
      if (phaseIds.length) error(`${path}.acceptedPhaseIds`, 'must be empty when an Entity is converted to an Event');
    } else if (disposition.kind === 'deferred') {
      if (phaseIds.length) error(`${path}.acceptedPhaseIds`, 'must be empty for a deferred Entity');
    } else {
      error(`${path}.acceptedDisposition.kind`, 'has an unknown Entity migration disposition');
    }
    phaseIds.forEach((phaseId, phaseIndex) => {
      if (!requireTarget(phaseId, phases, `${path}.acceptedPhaseIds[${phaseIndex}]`, 'EntityPhase')) return;
      const phase = phases.get(phaseId) as UnknownRecord | undefined;
      if (!targetEntityIds.includes(phase?.entityId as string)) {
        error(`${path}.acceptedPhaseIds[${phaseIndex}]`, 'must belong to one of the migration target Entities');
      }
    });
  });

  acceptedDecisions(eventByModule, 'event', (decision, path) => {
    const disposition = decision.acceptedDisposition as UnknownRecord;
    if (disposition.kind === 'migratedAsEvent') {
      if (requireTarget(disposition.eventId, reviewedEventTargets, `${path}.acceptedDisposition.eventId`, 'accepted Event or pending historical process')) {
        const targetId = disposition.eventId as string;
        if (pendingHistoricalProcesses.has(targetId) && decision.oldKind !== 'historicalProcess') {
          error(`${path}.acceptedDisposition.eventId`, 'only a V5 historicalProcess may be superseded by pending historical-process review');
        }
      }
    } else if (disposition.kind === 'convertedToEntity') {
      requireTarget(disposition.entityId, entities, `${path}.acceptedDisposition.entityId`, 'Entity');
    } else if (disposition.kind === 'split') {
      const eventIds = requireUniqueTargets(disposition.eventIds, events, `${path}.acceptedDisposition.eventIds`, 'Event', true);
      const entityIds = requireUniqueTargets(disposition.entityIds, entities, `${path}.acceptedDisposition.entityIds`, 'Entity', true);
      if (eventIds.length + entityIds.length === 0) error(`${path}.acceptedDisposition`, 'split must retain at least one V6 target');
    } else if (disposition.kind !== 'deferred') {
      error(`${path}.acceptedDisposition.kind`, 'has an unknown Event migration disposition');
    }
  });

  acceptedDecisions(edgeByModule, 'edge', (decision, path) => {
    const disposition = decision.acceptedDisposition as UnknownRecord;
    if (disposition.kind === 'migrated') {
      requireTarget(disposition.relationId, relations, `${path}.acceptedDisposition.relationId`, 'TemporalRelation');
    } else if (disposition.kind === 'split') {
      requireUniqueTargets(disposition.relationIds, relations, `${path}.acceptedDisposition.relationIds`, 'TemporalRelation');
    } else if (disposition.kind === 'candidate') {
      requireTarget(disposition.candidateId, candidateIds, `${path}.acceptedDisposition.candidateId`, 'RelationCandidate');
    } else if (disposition.kind === 'representedByEvent') {
      requireTarget(disposition.eventId, reviewedEventTargets, `${path}.acceptedDisposition.eventId`, 'accepted Event or pending historical process');
    } else if (disposition.kind !== 'retired') {
      error(`${path}.acceptedDisposition.kind`, 'has an unknown StructuralEdge migration disposition');
    }
  });

  for (const { ledger, path: ledgerPath } of sceneByModule.values()) {
    if (!Array.isArray(ledger.scenePhaseSignals)) {
      error(`${ledgerPath}.scenePhaseSignals`, 'must be an array');
      continue;
    }
    counts.scenePhaseSignals += ledger.scenePhaseSignals.length;
    ledger.scenePhaseSignals.forEach((signal, signalIndex) => {
      const path = `${ledgerPath}.scenePhaseSignals[${signalIndex}]`;
      if (!isRecord(signal) || !isRecord(signal.disposition)) {
        error(`${path}.disposition`, 'must be an object');
        return;
      }
      const disposition = signal.disposition;
      if (disposition.kind === 'mapped') {
        requireUniqueTargets(disposition.phaseIds, phases, `${path}.disposition.phaseIds`, 'EntityPhase');
      } else if (disposition.kind === 'merged') {
        requireTarget(disposition.phaseId, phases, `${path}.disposition.phaseId`, 'EntityPhase');
      } else if (disposition.kind === 'eventOnly') {
        requireUniqueTargets(disposition.eventIds, reviewedEventTargets, `${path}.disposition.eventIds`, 'accepted Event or pending historical process');
      } else if (disposition.kind === 'needsReview') {
        error(`${path}.disposition.kind`, 'needsReview cannot enter final integration');
      } else if (disposition.kind !== 'narrativeOnly') {
        error(`${path}.disposition.kind`, 'has an unknown Scene migration disposition');
      }
    });
  }

  const requireSameModules = (indexed: ReadonlyMap<string, IndexedLedger>, label: string): void => {
    baselineByModule.forEach((_value, sourceModule) => {
      if (!indexed.has(sourceModule)) error(label, `missing ledger for ${sourceModule}`);
    });
    indexed.forEach((_value, sourceModule) => {
      if (!baselineByModule.has(sourceModule)) error(label, `has ledger for unknown baseline module ${sourceModule}`);
    });
  };
  requireSameModules(entityByModule, 'entityDecisionLedgers');
  requireSameModules(eventByModule, 'eventDecisionLedgers');
  requireSameModules(sceneByModule, 'scenePhaseLedgers');
  requireSameModules(edgeByModule, 'edgeDecisionLedgers');
  requireSameModules(candidateByModule, 'relationCandidateLedgers');
  requireSameModules(handoffByModule, 'handoffLedgers');

  counts.handoffs = handoffByModule.size;
  if (handoffByModule.size !== EXPECTED_V6_MIGRATION_HANDOFF_COUNT) {
    error('handoffLedgers', `must contain exactly ${EXPECTED_V6_MIGRATION_HANDOFF_COUNT} module handoffs; found ${handoffByModule.size}`);
  }

  const ledgerCount = (indexed: ReadonlyMap<string, IndexedLedger>, module: string, field: string): number | null => {
    const entry = indexed.get(module);
    if (!entry || !Array.isArray(entry.ledger[field])) return null;
    return entry.ledger[field].length;
  };
  for (const [sourceModule, { ledger: handoff, path }] of handoffByModule) {
    if (handoff.status !== 'readyForIntegration') error(`${path}.status`, 'must equal readyForIntegration');
    const baselineEntry = baselineByModule.get(sourceModule);
    if (!baselineEntry) continue;
    const baseline = baselineEntry.ledger;
    if (!isRecord(baseline.counts)) {
      error(`${baselineEntry.path}.counts`, 'must be an object');
      continue;
    }
    if (!isRecord(handoff.coverage)) {
      error(`${path}.coverage`, 'must be an object');
    } else {
      COVERAGE_KEYS.forEach(key => {
        const frozen = baseline.counts as UnknownRecord;
        if (!Number.isInteger(frozen[key]) || (frozen[key] as number) < 0) error(`${baselineEntry.path}.counts.${key}`, 'must be a non-negative integer');
        if (handoff.coverage && (handoff.coverage as UnknownRecord)[key] !== frozen[key]) {
          error(`${path}.coverage.${key}`, `must equal frozen baseline count ${String(frozen[key])}`);
        }
        const baselineCollection = key === 'structuralEdges' ? 'structuralEdges' : key;
        if (!Array.isArray(baseline[baselineCollection]) || baseline[baselineCollection].length !== frozen[key]) {
          error(`${baselineEntry.path}.${baselineCollection}`, `length must equal frozen count ${String(frozen[key])}`);
        }
      });
    }
    const expectedLedgerCounts = {
      entities: ledgerCount(entityByModule, sourceModule, 'decisions'),
      events: ledgerCount(eventByModule, sourceModule, 'decisions'),
      scenes: ledgerCount(sceneByModule, sourceModule, 'scenePhaseSignals'),
      structuralEdges: ledgerCount(edgeByModule, sourceModule, 'decisions')
    };
    for (const key of COVERAGE_KEYS) {
      const expected = expectedLedgerCounts[key];
      const frozen = (baseline.counts as UnknownRecord)[key];
      if (expected !== null && expected !== frozen) error(`${path}.coverage.${key}`, `ledger contains ${expected}, frozen baseline requires ${String(frozen)}`);
    }
    const sceneCount = expectedLedgerCounts.scenes;
    if (handoff.scenePhaseSignalCount !== sceneCount) error(`${path}.scenePhaseSignalCount`, `must equal Scene ledger count ${String(sceneCount)}`);
    const candidateCount = ledgerCount(candidateByModule, sourceModule, 'candidates');
    if (handoff.unresolvedRelationCandidateCount !== candidateCount) error(`${path}.unresolvedRelationCandidateCount`, `must equal candidate ledger count ${String(candidateCount)}`);
    const signalEntry = sceneByModule.get(sourceModule);
    if (signalEntry && Array.isArray(signalEntry.ledger.scenePhaseSignals) && handoff.entitySignalCount !== undefined) {
      const entitySignalCount = signalEntry.ledger.scenePhaseSignals.reduce((sum, signal) => {
        return sum + (isRecord(signal) && Array.isArray(signal.entitySignals) ? signal.entitySignals.length : 0);
      }, 0);
      if (handoff.entitySignalCount !== entitySignalCount) error(`${path}.entitySignalCount`, `must equal nested Scene entity signal count ${entitySignalCount}`);
    }
    if (!isRecord(handoff.checks)) {
      error(`${path}.checks`, 'must be an object');
    } else {
      HANDOFF_CHECKS.forEach(check => {
        if (handoff.checks && (handoff.checks as UnknownRecord)[check] !== true) error(`${path}.checks.${check}`, 'must equal true');
      });
      Object.entries(handoff.checks).forEach(([check, value]) => {
        if (value !== true) error(`${path}.checks.${check}`, 'all handoff checks must equal true');
      });
    }
  }

  return { valid: errors.length === 0 && coreResult.valid, errors, counts };
}
