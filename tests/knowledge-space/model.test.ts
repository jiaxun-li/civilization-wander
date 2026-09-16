import assert from 'node:assert/strict';
import test from 'node:test';

import { ENTITY_TYPES } from '../../v6/schema/index.ts';
import {
  KnowledgeSpaceModelError,
  deriveKnowledgeSpaceMarks
} from '../../src/knowledge-space/model/index.ts';
import {
  ENTITY_MARK_POLICIES,
  defaultEntityMarkKind
} from '../../src/knowledge-space/semantics/index.ts';
import { fixtureInput } from './fixtures.ts';

test('entity mark policy is exhaustive and keeps abstract persistent objects as strips by default', () => {
  assert.deepEqual(Object.keys(ENTITY_MARK_POLICIES).sort(), [...ENTITY_TYPES].sort());
  assert.equal(defaultEntityMarkKind({ type: 'writingSystem', conceptLayerId: 'languageAndKnowledge' }), 'trace');
  assert.equal(defaultEntityMarkKind({ type: 'language', conceptLayerId: 'languageAndKnowledge' }), 'crayonStrip');
  assert.equal(defaultEntityMarkKind({ type: 'technology', conceptLayerId: 'technologyAndExchange' }), 'crayonStrip');
  assert.equal(defaultEntityMarkKind({ type: 'tradeNetwork', conceptLayerId: 'technologyAndExchange' }), 'crayonStrip');
  assert.equal(defaultEntityMarkKind({ type: 'religiousTradition', conceptLayerId: 'religionAndThought' }), 'crayonStrip');
  assert.equal(defaultEntityMarkKind({ type: 'literaryWork', conceptLayerId: 'artAndLiterature' }), 'node');
  assert.equal(defaultEntityMarkKind({ type: 'culturalTradition', conceptLayerId: 'polityAndSociety' }), 'block');
  assert.equal(defaultEntityMarkKind({ type: 'culturalTradition', conceptLayerId: 'artAndLiterature' }), 'crayonStrip');
});

test('derives four renderer-neutral mark forms and splits a pervasive regional presence from tracked regions', () => {
  const marks = deriveKnowledgeSpaceMarks(fixtureInput, [{
    phaseId: 'language-phase',
    presenceMode: 'pervasive',
    regionIds: ['a-one'],
    rationale: 'The fixture source supports broad use in this one Region only.',
    sourceIds: ['source-one']
  }]);

  const byId = new Map(marks.map((mark) => [mark.id, mark]));
  assert.equal(byId.get('phase:polity-phase')?.markKind, 'block');
  assert.equal(byId.get('phase:polity-phase')?.label, '甲王国');
  assert.equal(byId.get('phase:polity-phase')?.phaseLabel, '甲王国延续');
  assert.equal(byId.get('phase:city-phase')?.markKind, 'trace');
  assert.equal(byId.get('phase:work-phase')?.markKind, 'node');
  assert.deepEqual(byId.get('phase:language-phase:pervasive')?.regionSegments.map(({ regionId }) => regionId), ['a-one']);
  assert.equal(byId.get('phase:language-phase:pervasive')?.markKind, 'crayonStrip');
  assert.deepEqual(byId.get('phase:language-phase:tracked')?.regionSegments.map(({ regionId }) => regionId), ['a-two']);
  assert.equal(byId.get('phase:language-phase:tracked')?.markKind, 'crayonStrip');
  assert.equal(byId.get('event:event-one')?.markKind, 'node');
  assert.equal(byId.get('event:process-one')?.markKind, 'trace');
  assert.equal(byId.get('event:event-one')?.conceptLayerId, 'eventAndConflict');
  assert.equal(byId.get('event:process-one')?.conceptLayerId, 'technologyAndExchange');
  assert.equal(byId.get('phase:language-phase:tracked')?.certainty.regionApproximate, true);
  assert.equal(byId.get('phase:language-phase:pervasive')?.certainty.regionApproximate, false);
});

test('PresenceProfile is not applicable to a solid political object', () => {
  assert.throws(
    () => deriveKnowledgeSpaceMarks(fixtureInput, [{
      phaseId: 'polity-phase',
      presenceMode: 'pervasive',
      regionIds: ['a-one'],
      rationale: 'Invalid fixture override.',
      sourceIds: ['source-one']
    }]),
    (error: unknown) => (
      error instanceof KnowledgeSpaceModelError
      && error.code === 'PRESENCE_PROFILE_NOT_APPLICABLE'
    )
  );
});

test('PresenceProfile source must already be cited by the owning Phase', () => {
  assert.throws(
    () => deriveKnowledgeSpaceMarks(fixtureInput, [{
      phaseId: 'language-phase',
      presenceMode: 'pervasive',
      regionIds: ['a-one'],
      rationale: 'The globally known but Phase-uncited source is invalid.',
      sourceIds: ['source-two']
    }]),
    (error: unknown) => (
      error instanceof KnowledgeSpaceModelError
      && error.code === 'PRESENCE_SOURCE_NOT_ON_PHASE'
    )
  );
});

test('PresenceProfile cannot claim a Region outside the owning Phase', () => {
  assert.throws(
    () => deriveKnowledgeSpaceMarks(fixtureInput, [{
      phaseId: 'language-phase',
      presenceMode: 'pervasive',
      regionIds: ['macro-b'],
      rationale: 'Invalid fixture region.',
      sourceIds: ['source-one']
    }]),
    (error: unknown) => (
      error instanceof KnowledgeSpaceModelError
      && error.code === 'PRESENCE_REGION_OUTSIDE_PHASE'
    )
  );
});

test('technology and trade-like strips reject unsupported pervasive claims', () => {
  const entities = fixtureInput.entities.map((entity) => (
    entity.id === 'language-one'
      ? { ...entity, type: 'technology' as const, conceptLayerId: 'technologyAndExchange' as const }
      : entity
  ));
  assert.throws(
    () => deriveKnowledgeSpaceMarks({ ...fixtureInput, entities }, [{
      phaseId: 'language-phase',
      presenceMode: 'pervasive',
      regionIds: ['a-one'],
      rationale: 'Widespread technology still remains a tracked strip.',
      sourceIds: ['source-one']
    }]),
    (error: unknown) => (
      error instanceof KnowledgeSpaceModelError
      && error.code === 'PERVASIVE_PRESENCE_NOT_SUPPORTED'
    )
  );
});

test('unprojectable time is rejected instead of silently filtered', () => {
  const entityPhases = fixtureInput.entityPhases.map((phase) => (
    phase.id === 'city-phase'
      ? { ...phase, timeSpan: { label: '年代未知' } }
      : phase
  ));
  assert.throws(
    () => deriveKnowledgeSpaceMarks({ ...fixtureInput, entityPhases }),
    (error: unknown) => (
      error instanceof KnowledgeSpaceModelError
      && error.code === 'UNRESOLVED_TIME_SPAN'
      && error.objectId === 'city-phase'
    )
  );
});
