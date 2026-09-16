type UnknownRecord = Record<string, unknown>;

export const EXPECTED_V5_BASELINE_COUNTS = Object.freeze({
  entities: 54,
  events: 95,
  scenes: 297,
  structuralEdges: 34
});

export interface MigrationCoverageSource {
  readonly entityIds: readonly string[];
  readonly eventIds: readonly string[];
  readonly sceneIds: readonly string[];
  readonly structuralEdgeIds: readonly string[];
}

export interface MigrationCoverageBundle {
  readonly source: MigrationCoverageSource;
  readonly entityDecisionLedgers: readonly unknown[];
  readonly eventDecisionLedgers: readonly unknown[];
  readonly scenePhaseLedgers: readonly unknown[];
  readonly edgeDecisionLedgers: readonly unknown[];
  readonly relationCandidateLedgers: readonly unknown[];
}

export interface MigrationCoverageResult {
  readonly valid: boolean;
  readonly complete: boolean;
  readonly errors: readonly string[];
  readonly pending: readonly string[];
  readonly counts: {
    readonly entities: number;
    readonly events: number;
    readonly scenes: number;
    readonly structuralEdges: number;
    readonly scenePhaseSignals: number;
    readonly relationCandidates: number;
  };
}

const REVIEW_STATUSES = new Set(['pending', 'accepted', 'rejected', 'needsResearch']);
const CANDIDATE_REASONS = new Set([
  'missingTarget',
  'ambiguousIdentity',
  'ambiguousTargetKind',
  'ambiguousRelationKind',
  'insufficientEvidence',
  'ordinaryExplanationOnly'
]);

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function validateMigrationCoverage(
  bundle: MigrationCoverageBundle
): MigrationCoverageResult {
  try {
    return validateMigrationCoverageUnsafe(bundle);
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    return {
      valid: false,
      complete: false,
      errors: [`migration coverage: malformed ledgers must not interrupt validation (${detail})`],
      pending: [],
      counts: {
        entities: 0,
        events: 0,
        scenes: 0,
        structuralEdges: 0,
        scenePhaseSignals: 0,
        relationCandidates: 0
      }
    };
  }
}

function validateMigrationCoverageUnsafe(
  bundle: MigrationCoverageBundle
): MigrationCoverageResult {
  const errors: string[] = [];
  const pending: string[] = [];
  const error = (path: string, message: string): void => {
    errors.push(`${path}: ${message}`);
  };
  const sourceSets = {
    entities: new Set(bundle.source.entityIds),
    events: new Set(bundle.source.eventIds),
    scenes: new Set(bundle.source.sceneIds),
    structuralEdges: new Set(bundle.source.structuralEdgeIds)
  };
  const expectedInputs = [
    ['entities', bundle.source.entityIds, EXPECTED_V5_BASELINE_COUNTS.entities],
    ['events', bundle.source.eventIds, EXPECTED_V5_BASELINE_COUNTS.events],
    ['scenes', bundle.source.sceneIds, EXPECTED_V5_BASELINE_COUNTS.scenes],
    ['structuralEdges', bundle.source.structuralEdgeIds, EXPECTED_V5_BASELINE_COUNTS.structuralEdges]
  ] as const;
  expectedInputs.forEach(([name, values, expected]) => {
    if (values.length !== expected) error(`source.${name}`, `must contain the frozen V5 baseline count ${expected}; found ${values.length}`);
    if (new Set(values).size !== values.length) error(`source.${name}`, 'must not contain duplicate IDs');
    values.forEach((id, index) => {
      if (!isString(id)) error(`source.${name}[${index}]`, 'must be a non-empty string');
    });
  });

  const validateDecisionLedgers = (
    ledgers: readonly unknown[],
    idField: string,
    sourceIds: ReadonlySet<string>,
    label: string,
    inspectDecision?: (decision: UnknownRecord, path: string) => void
  ): Set<string> => {
    const covered = new Set<string>();
    ledgers.forEach((ledger, ledgerIndex) => {
      const ledgerPath = `${label}Ledgers[${ledgerIndex}]`;
      if (!isRecord(ledger)) {
        error(ledgerPath, 'must be an object');
        return;
      }
      if (ledger.ledgerVersion !== 1) error(`${ledgerPath}.ledgerVersion`, 'must equal 1');
      if (!isString(ledger.sourceModule)) error(`${ledgerPath}.sourceModule`, 'must be a non-empty string');
      if (!Array.isArray(ledger.decisions)) {
        error(`${ledgerPath}.decisions`, 'must be an array');
        return;
      }
      ledger.decisions.forEach((decision, decisionIndex) => {
        const path = `${ledgerPath}.decisions[${decisionIndex}]`;
        if (!isRecord(decision)) {
          error(path, 'must be an object');
          return;
        }
        const id = decision[idField];
        if (!isString(id)) {
          error(`${path}.${idField}`, 'must be a non-empty string');
          return;
        }
        if (!sourceIds.has(id)) error(`${path}.${idField}`, `does not exist in the frozen V5 baseline: ${id}`);
        if (covered.has(id)) error(`${path}.${idField}`, `duplicates migration coverage for ${id}`);
        covered.add(id);
        if (!REVIEW_STATUSES.has(decision.status as string)) error(`${path}.status`, 'has an unknown review status');
        if (decision.status === 'pending' || decision.status === 'needsResearch') pending.push(`${label}:${id}:${decision.status}`);
        inspectDecision?.(decision, path);
      });
    });
    sourceIds.forEach(id => {
      if (!covered.has(id)) error(`${label}Coverage`, `missing migration record for ${id}`);
    });
    return covered;
  };

  const entityCoverage = validateDecisionLedgers(
    bundle.entityDecisionLedgers,
    'entityId',
    sourceSets.entities,
    'entity',
    (decision, path) => {
      const disposition = decision.acceptedDisposition ?? decision.disposition;
      if (!isRecord(disposition) || disposition.kind !== 'convertedToEvent') return;
      if (!isString(disposition.eventId)) {
        error(
          `${path}.acceptedDisposition.eventId`,
          'convertedToEvent must provide a non-empty V6 Event ID'
        );
      }
    }
  );
  const eventCoverage = validateDecisionLedgers(
    bundle.eventDecisionLedgers,
    'eventId',
    sourceSets.events,
    'event'
  );
  const edgeCoverage = validateDecisionLedgers(
    bundle.edgeDecisionLedgers,
    'structuralEdgeId',
    sourceSets.structuralEdges,
    'edge',
    (decision, path) => {
      const disposition = decision.acceptedDisposition ?? decision.disposition;
      if (!isRecord(disposition) || disposition.kind !== 'split') return;
      if (!Array.isArray(disposition.relationIds)) {
        error(`${path}.acceptedDisposition.relationIds`, 'split must provide an array of TemporalRelation IDs');
        return;
      }
      if (disposition.relationIds.length < 2) {
        error(`${path}.acceptedDisposition.relationIds`, 'split must contain at least two TemporalRelation IDs');
      }
      disposition.relationIds.forEach((relationId, relationIndex) => {
        if (!isString(relationId)) {
          error(
            `${path}.acceptedDisposition.relationIds[${relationIndex}]`,
            'must be a non-empty TemporalRelation ID'
          );
        }
      });
      if (new Set(disposition.relationIds).size !== disposition.relationIds.length) {
        error(`${path}.acceptedDisposition.relationIds`, 'split TemporalRelation IDs must be unique');
      }
    }
  );

  const coveredScenes = new Set<string>();
  const signalIds = new Set<string>();
  let signalCount = 0;
  bundle.scenePhaseLedgers.forEach((ledger, ledgerIndex) => {
    const ledgerPath = `scenePhaseLedgers[${ledgerIndex}]`;
    if (!isRecord(ledger)) {
      error(ledgerPath, 'must be an object');
      return;
    }
    if (ledger.ledgerVersion !== 1) error(`${ledgerPath}.ledgerVersion`, 'must equal 1');
    if (!isString(ledger.sourceModule)) error(`${ledgerPath}.sourceModule`, 'must be a non-empty string');
    if (!Array.isArray(ledger.scenePhaseSignals)) {
      error(`${ledgerPath}.scenePhaseSignals`, 'must be an array');
      return;
    }
    ledger.scenePhaseSignals.forEach((signal, signalIndex) => {
      signalCount += 1;
      const path = `${ledgerPath}.scenePhaseSignals[${signalIndex}]`;
      if (!isRecord(signal)) {
        error(path, 'must be an object');
        return;
      }
      if (!isString(signal.id)) error(`${path}.id`, 'must be a non-empty string');
      else if (signalIds.has(signal.id)) error(`${path}.id`, `duplicates ScenePhaseSignal ${signal.id}`);
      else signalIds.add(signal.id);
      if (!isString(signal.v5SceneId)) error(`${path}.v5SceneId`, 'must be a non-empty string');
      else {
        if (!sourceSets.scenes.has(signal.v5SceneId)) error(`${path}.v5SceneId`, 'does not exist in the frozen V5 baseline');
        coveredScenes.add(signal.v5SceneId);
      }
      if (!Array.isArray(signal.entitySignals) || signal.entitySignals.length === 0) {
        error(`${path}.entitySignals`, 'must be a non-empty array');
      } else signal.entitySignals.forEach((entitySignal, entityIndex) => {
        if (!isRecord(entitySignal) || !isString(entitySignal.entityId) || !sourceSets.entities.has(entitySignal.entityId)) {
          error(`${path}.entitySignals[${entityIndex}].entityId`, 'must reference a V5 Entity');
        }
      });
      asArray(signal.eventIds).forEach((eventId, eventIndex) => {
        if (!isString(eventId) || !sourceSets.events.has(eventId)) error(`${path}.eventIds[${eventIndex}]`, 'must reference a V5 Event');
      });
      if (isRecord(signal.disposition) && signal.disposition.kind === 'needsReview') {
        pending.push(`scene:${signal.v5SceneId}:needsReview`);
      }
    });
  });
  sourceSets.scenes.forEach(id => {
    if (!coveredScenes.has(id)) error('sceneCoverage', `missing ScenePhaseSignal coverage for ${id}`);
  });

  let relationCandidateCount = 0;
  const relationCandidateIds = new Set<string>();
  bundle.relationCandidateLedgers.forEach((ledger, ledgerIndex) => {
    const ledgerPath = `relationCandidateLedgers[${ledgerIndex}]`;
    if (!isRecord(ledger)) {
      error(ledgerPath, 'must be an object');
      return;
    }
    if (ledger.ledgerVersion !== 1) error(`${ledgerPath}.ledgerVersion`, 'must equal 1');
    if (ledger.runtimeCollection !== false) error(`${ledgerPath}.runtimeCollection`, 'must equal false');
    if (!Array.isArray(ledger.candidates)) {
      error(`${ledgerPath}.candidates`, 'must be an array');
      return;
    }
    ledger.candidates.forEach((entry, candidateIndex) => {
      relationCandidateCount += 1;
      const path = `${ledgerPath}.candidates[${candidateIndex}]`;
      if (!isRecord(entry)) {
        error(path, 'must be an object');
        return;
      }
      const candidate = entry.candidate;
      const audit = entry.audit;
      if (!isRecord(candidate)) {
        error(`${path}.candidate`, 'must be an object');
        return;
      }
      if (!isRecord(audit)) {
        error(`${path}.audit`, 'must be an object');
        return;
      }
      if (!isString(candidate.id)) error(`${path}.candidate.id`, 'must be a non-empty string');
      else if (relationCandidateIds.has(candidate.id)) error(`${path}.candidate.id`, `duplicates RelationCandidate ${candidate.id}`);
      else relationCandidateIds.add(candidate.id);
      if (candidate.status !== 'unresolved') error(`${path}.candidate.status`, 'must equal unresolved');
      if (!Array.isArray(candidate.reasons) || candidate.reasons.length === 0) {
        error(`${path}.candidate.reasons`, 'must be a non-empty array');
      } else {
        candidate.reasons.forEach((reason, reasonIndex) => {
          if (!isString(reason) || !CANDIDATE_REASONS.has(reason)) {
            error(`${path}.candidate.reasons[${reasonIndex}]`, 'has an unknown RelationCandidate reason');
          }
        });
      }
      if (!Array.isArray(candidate.sourceSceneIds)) error(`${path}.candidate.sourceSceneIds`, 'must be an array');
      asArray(candidate.sourceSceneIds).forEach((sceneId, sceneIndex) => {
        if (!isString(sceneId) || !sourceSets.scenes.has(sceneId)) error(`${path}.candidate.sourceSceneIds[${sceneIndex}]`, 'must reference a V5 Scene');
      });
      if (!Array.isArray(candidate.participants) || candidate.participants.length < 2) error(`${path}.candidate.participants`, 'must contain at least two proposed participants');
      if (!isString(candidate.summary)) error(`${path}.candidate.summary`, 'must be a non-empty string');
      if (!Array.isArray(candidate.unresolvedQuestions) || candidate.unresolvedQuestions.length === 0) error(`${path}.candidate.unresolvedQuestions`, 'must be a non-empty array');
      if (!Array.isArray(candidate.sourceIds) || candidate.sourceIds.length === 0) error(`${path}.candidate.sourceIds`, 'must be a non-empty array');
      if (!isString(audit.sourceModule)) error(`${path}.audit.sourceModule`, 'must be a non-empty string');
      if (!Array.isArray(audit.sourceEventIds)) error(`${path}.audit.sourceEventIds`, 'must be an array');
      asArray(audit.sourceEventIds).forEach((eventId, eventIndex) => {
        if (!isString(eventId) || !sourceSets.events.has(eventId)) error(`${path}.audit.sourceEventIds[${eventIndex}]`, 'must reference a V5 Event');
      });
      if (!Array.isArray(audit.sourceStructuralEdgeIds)) error(`${path}.audit.sourceStructuralEdgeIds`, 'must be an array');
      asArray(audit.sourceStructuralEdgeIds).forEach((edgeId, edgeIndex) => {
        if (!isString(edgeId) || !sourceSets.structuralEdges.has(edgeId)) error(`${path}.audit.sourceStructuralEdgeIds[${edgeIndex}]`, 'must reference a V5 StructuralEdge');
      });
    });
  });

  const counts = {
    entities: entityCoverage.size,
    events: eventCoverage.size,
    scenes: coveredScenes.size,
    structuralEdges: edgeCoverage.size,
    scenePhaseSignals: signalCount,
    relationCandidates: relationCandidateCount
  };
  return {
    valid: errors.length === 0,
    complete: errors.length === 0 && pending.length === 0,
    errors,
    pending,
    counts
  };
}
