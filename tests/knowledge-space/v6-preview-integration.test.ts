import assert from 'node:assert/strict';
import test from 'node:test';

import { V6_KNOWLEDGE_SPACE_DATA } from '../../src/knowledge-space/adapters/v6-adapter.ts';
import { V6_PENDING_HISTORICAL_PROCESSES } from '../../v6/module-registry.ts';
import writingReview from '../../docs/reviews/writing-details-internal.json' with { type: 'json' };

test('selection descriptions cover accepted events with public evidence and readable bibliography', () => {
  const { events, eventDescriptions, sources } = V6_KNOWLEDGE_SPACE_DATA;
  assert.deepEqual(Object.keys(eventDescriptions).sort(), events.map(event => event.id).sort());
  const sourceById = new Map(sources.map(source => [source.id, source]));
  for (const event of events) {
    const description = eventDescriptions[event.id]!;
    assert.ok(description.text.trim());
    const evidence = event.evidence.find(claim => claim.v5ClaimBlockId === description.v5ClaimBlockId);
    assert.ok(evidence, event.id);
    assert.ok(description.sourceIds.length);
    for (const id of description.sourceIds) {
      assert.ok(evidence.sourceIds.includes(id));
      assert.ok(sourceById.has(id));
      assert.notEqual(sourceById.get(id)!.title, id);
    }
    const reviewIds = [...event.editorialReview.limitationClaimIds, ...event.editorialReview.counterexampleClaimIds,
      ...event.editorialReview.uncertaintyClaimIds, ...event.editorialReview.alternativeExplanationClaimIds];
    assert.equal(reviewIds.includes(description.v5ClaimBlockId), false, event.id);
  }
});

test('curated epics produce one work node each and iron has only two regional placements', () => {
  const { marks, entities } = V6_KNOWLEDGE_SPACE_DATA;
  for (const id of ['epic-of-gilgamesh', 'iliad-text', 'odyssey-text', 'sinuhe-work', 'hammurabi-code']) {
    const placements = marks.filter(mark => mark.subjectRef.id === id);
    assert.equal(placements.length, 1, id);
    assert.equal(placements[0]?.markKind, 'node', id);
    assert.equal(placements[0]?.regionSegments.length, 1, id);
  }
  for (const id of ['tower-of-babel-tradition', 'ancient-israelite-tradition']) {
    assert.deepEqual(entities.find(entity => entity.id === id)?.phaseIds, [], id);
    assert.equal(marks.some(mark => mark.subjectRef.id === id), false, id);
  }
  for (const id of ['iliad-oral-tradition', 'odyssey-oral-tradition', 'greek-heroic-tradition', 'sinuhe-literary-tradition']) {
    assert.equal(entities.some(entity => entity.id === id), false, id);
  }
  assert.equal(marks.filter(mark => mark.subjectRef.id === 'iron')
    .reduce((count, mark) => count + mark.regionSegments.length, 0), 2);
});

test('the accepted V6 core gives every Phase and Event complete, non-duplicated Region coverage', () => {
  const {
    conceptLayers,
    regions,
    entities,
    entityPhases,
    events,
    marks
  } = V6_KNOWLEDGE_SPACE_DATA;

  const knownEntityIds = new Set<string>(entities.map(({ id }) => id));
  const knownPhaseIds = new Set<string>(entityPhases.map(({ id }) => id));
  const knownEventIds = new Set<string>(events.map(({ id }) => id));
  const knownRegionIds = new Set<string>(regions.map(({ id }) => id));
  const usedConceptLayers = new Set<string>(marks.map(({ conceptLayerId }) => conceptLayerId));

  for (const layer of conceptLayers) {
    assert.ok(usedConceptLayers.has(layer.id), `Concept layer ${layer.id} has no preview mark.`);
  }

  for (const mark of marks) {
    assert.ok(mark.regionSegments.length > 0, `${mark.id} has no Region presence.`);
    assert.ok(mark.regionSegments.every(({ regionId }) => knownRegionIds.has(regionId)));

    if (mark.subjectRef.kind === 'entity') {
      assert.ok(knownEntityIds.has(mark.subjectRef.id), `${mark.id} refers to an unknown Entity.`);
      assert.ok(mark.phaseId && knownPhaseIds.has(mark.phaseId), `${mark.id} has no accepted Phase.`);
    } else {
      assert.ok(knownEventIds.has(mark.subjectRef.id), `${mark.id} refers to an unknown Event.`);
      assert.equal(mark.phaseId, undefined);
    }
  }

  for (const phase of entityPhases) {
    const phaseMarks = marks.filter(mark => mark.phaseId === phase.id);
    assert.ok(phaseMarks.length > 0, `${phase.id} produced no preview mark.`);

    const actualRegionIds = phaseMarks
      .flatMap(mark => mark.regionSegments.map(({ regionId }) => regionId))
      .sort();
    const expectedRegionIds = phase.regions.map(({ regionId }) => regionId).sort();
    assert.equal(
      actualRegionIds.length,
      new Set(actualRegionIds).size,
      `${phase.id} renders the same Region more than once.`
    );
    assert.deepEqual(actualRegionIds, expectedRegionIds, `${phase.id} has incomplete Region coverage.`);
  }

  const eventMarks = marks.filter(mark => mark.subjectRef.kind === 'event');
  assert.equal(eventMarks.length, events.length);
  assert.deepEqual(
    eventMarks.map(mark => mark.subjectRef.id).sort(),
    events.map(({ id }) => id).sort()
  );
});

test('all broad historical processes are pending review rather than runtime preview Events', () => {
  const eventsById = new Map(
    V6_KNOWLEDGE_SPACE_DATA.events.map(event => [event.id, event])
  );
  const pendingById = new Map(
    V6_PENDING_HISTORICAL_PROCESSES.map(review => [review.id, review])
  );

  assert.equal(eventsById.has('event-nile-annual-cycle-organizes-life'), false);
  assert.ok(V6_KNOWLEDGE_SPACE_DATA.events.every(event => event.kind === 'historicalEvent'));
  assert.equal(V6_PENDING_HISTORICAL_PROCESSES.length, 58);
  assert.ok(V6_PENDING_HISTORICAL_PROCESSES.every(review => (
    review.status === 'pending'
    && review.candidate.kind === 'historicalProcess'
    && review.candidate.id === review.id
    && !eventsById.has(review.id)
  )));
  assert.equal(pendingById.get('event-meteoric-iron-prestige-use')?.status, 'pending');
  assert.equal(pendingById.get('event-egyptian-writing-system-changes')?.status, 'pending');
  assert.equal(pendingById.get('event-egyptian-formal-art-conventions-persist')?.status, 'pending');
  assert.equal(pendingById.get('event-old-kingdom-pyramid-complexes-develop')?.status, 'pending');
  assert.equal(
    eventsById.get('event-battle-of-kadesh')?.conceptLayerId,
    'eventAndConflict'
  );
});

test('the accepted preview keeps stable Entity names and excludes reviewed pseudo identities', () => {
  const entityIds = new Set<string>(V6_KNOWLEDGE_SPACE_DATA.entities.map(entity => entity.id));
  const phaseMarks = V6_KNOWLEDGE_SPACE_DATA.marks.filter(mark => mark.phaseId !== undefined);

  assert.equal(entityIds.has('ancient-egypt-civilization'), false);
  assert.equal(entityIds.has('china-early-bronze-world'), false);
  assert.equal(entityIds.has('mesopotamia-region'), false);
  assert.equal(entityIds.has('mesopotamian-temple'), false);
  assert.equal(entityIds.has('sumer'), false);
  assert.equal(entityIds.has('late-bronze-palace-system'), false);
  assert.ok(phaseMarks.some(mark => mark.label === '乌鲁克'));
  assert.ok(phaseMarks.every(mark => mark.label !== '苏美尔文明'));
  assert.ok(phaseMarks.some(mark => mark.label === '古埃及古王国'));
  assert.ok(phaseMarks.every(mark => !/长期延续|持续重组|继续存在|跨越王朝/.test(mark.phaseLabel ?? '')));
});

test('Mesopotamia preview data uses explicit child Regions in the approved order', () => {
  const mesopotamiaChildren = V6_KNOWLEDGE_SPACE_DATA.regions
    .filter(region => 'parentRegionId' in region && region.parentRegionId === 'mesopotamia')
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map(region => region.id);

  assert.deepEqual(mesopotamiaChildren, [
    'upper-mesopotamia',
    'middle-euphrates',
    'central-mesopotamia',
    'southern-mesopotamia',
    'persian-gulf'
  ]);
  assert.ok(V6_KNOWLEDGE_SPACE_DATA.marks.every(mark => (
    mark.regionSegments.every(segment => segment.regionId !== 'mesopotamia')
  )));
});

test('East Mediterranean uses four reviewed child Regions and never emits an unscoped row', () => {
  const easternMediterranean = V6_KNOWLEDGE_SPACE_DATA.regions.find(
    region => region.id === 'eastern-mediterranean'
  );
  const children = V6_KNOWLEDGE_SPACE_DATA.regions
    .filter(region => (
      'parentRegionId' in region
      && region.parentRegionId === 'eastern-mediterranean'
    ))
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map(region => region.id);

  assert.deepEqual(children, [
    'cyprus',
    'syria-northern-levant',
    'southern-levant',
    'eastern-mediterranean-sea'
  ]);
  assert.ok(easternMediterranean && 'associationPolicy' in easternMediterranean);
  assert.equal(easternMediterranean.associationPolicy, 'groupOnly');
  assert.ok(V6_KNOWLEDGE_SPACE_DATA.marks.every(mark => (
    mark.regionSegments.every(segment => segment.regionId !== 'eastern-mediterranean')
  )));
  assert.ok(V6_PENDING_HISTORICAL_PROCESSES.every(review => (
    review.candidate.regions.every(region => region.regionId !== 'eastern-mediterranean')
  )));
});

test('the local preview adapter does not expose relations or Card presentation data', () => {
  const previewBoundary = V6_KNOWLEDGE_SPACE_DATA as unknown as Record<string, unknown>;

  assert.equal('temporalRelations' in previewBoundary, false);
  assert.equal('cards' in previewBoundary, false);
  assert.equal('scenes' in previewBoundary, false);
  assert.equal('assets' in previewBoundary, false);
});

test('language sample uses three undivided language identities and script traces', () => {
  const d = V6_KNOWLEDGE_SPACE_DATA;
  for (const id of ['sumerian-language', 'akkadian-language', 'egyptian-language']) {
    const entity = d.entities.find(e => e.id === id)!;
    assert.equal(entity.type, 'language');
    assert.equal(entity.phaseIds.length, id === 'akkadian-language' ? 3 : 1);
    assert.ok(d.marks.filter(m => m.subjectRef.id === id).every(m => m.markKind === 'crayonStrip'));
    assert.match(d.entityPhases.find(p => p.entityId === id)!.timeSpan.label, /^约前\d+—前\d+年$/);
  }
  for (const id of ['egyptian-hieratic', 'egyptian-demotic', 'egyptian-hieroglyphs', 'cuneiform']) {
    const marks = d.marks.filter(m => m.subjectRef.id === id);
    assert.ok(marks.length);
    assert.ok(marks.every(m => m.markKind === 'trace'));
  }
  assert.equal(d.entityPhases.find(p => p.id === 'cuneiform-early-development')!.timeSpan.end, -300);
  assert.match(d.languageDescriptions['sumerian-language']!.change!.text, /退出日常口语/);
});

test('every language has sourced usage claims and concise public dates', () => {
  const d = V6_KNOWLEDGE_SPACE_DATA;
  const languages = d.entities.filter(e => e.type === 'language');
  assert.deepEqual(Object.keys(d.languageDescriptions).sort(), languages.map(e => e.id).sort());
  for (const entity of languages) {
    const description = d.languageDescriptions[entity.id]!;
    for (const claim of [description.people, description.contexts, ...(description.change ? [description.change] : [])]) {
      assert.ok(claim.text.trim());
      assert.ok(claim.sourceIds.length);
      for (const id of claim.sourceIds) {
        assert.ok((entity.sourceIds as readonly string[]).includes(id));
        assert.ok(d.sources.some(source => source.id === id));
      }
    }
    for (const phase of d.entityPhases.filter(p => p.entityId === entity.id)) {
      assert.match(phase.timeSpan.label, /^约前\d+—前\d+年$/);
    }
  }
});

test('every writing system has sourced details without changing its dates or regional footprint', () => {
  const d = V6_KNOWLEDGE_SPACE_DATA;
  const scripts = d.entities.filter(entity => entity.type === 'writingSystem');
  assert.deepEqual(Object.keys(d.writingDescriptions).sort(), scripts.map(entity => entity.id).sort());
  assert.deepEqual(writingReview.previousRecords.map(record => record.entity.id).sort(), scripts.map(entity => entity.id).sort());
  for (const entity of scripts) {
    const description = d.writingDescriptions[entity.id]!;
    for (const claim of [description.languages, description.materials, description.uses]) {
      assert.ok(claim.text.trim());
      assert.ok(claim.sourceIds.length);
      for (const id of claim.sourceIds) {
        assert.ok((entity.sourceIds as readonly string[]).includes(id));
        assert.ok(d.sources.some(source => source.id === id));
      }
    }
    const before = writingReview.previousRecords.find(record => record.entity.id === entity.id)!;
    assert.deepEqual(entity.phaseIds, before.entity.phaseIds);
    for (const phase of before.phases) {
      const current = d.entityPhases.find(candidate => candidate.id === phase.id)!;
      assert.deepEqual(current, { ...phase, timeSpan: { ...phase.timeSpan, label: current.timeSpan.label } });
      assert.match(current.timeSpan.label, /^约前\d+—(?:前|公元)\d+年$/);
    }
    assert.ok(d.marks.filter(mark => mark.subjectRef.id === entity.id).every(mark => mark.markKind === 'trace'));
  }
  assert.match(d.writingDescriptions['linear-a']!.languages.text, /尚未释读/);
  assert.equal(d.writingDescriptions['indus-sign-system']!.languages.text, '尚未确定。');
});
