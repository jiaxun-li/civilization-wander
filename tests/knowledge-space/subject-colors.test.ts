import assert from 'node:assert/strict';
import test from 'node:test';
import { EVENT_COLOR_PARTICIPANTS, EVENT_COLOR_EXCEPTIONS, NEUTRAL_EVENT_COLOR, SUBJECT_COLORS, subjectColor } from '../../src/knowledge-space/preview/subject-colors.ts';
import { V6_KNOWLEDGE_SPACE_DATA } from '../../src/knowledge-space/adapters/v6-adapter.ts';
import { EGYPT_THEME, EGYPT_SUBJECT_ASSIGNMENTS, egyptSubjectColor } from '../../src/knowledge-space/preview/egypt-theme.ts';
import { CIVILIZATION_THEMES, CIVILIZATION_SUBJECT_ASSIGNMENTS } from '../../src/knowledge-space/preview/civilization-themes.ts';

test('every current political society has one distinct stable identification color', () => {
  const subjects = V6_KNOWLEDGE_SPACE_DATA.entities.filter(entity => entity.conceptLayerId === 'polityAndSociety' && entity.phaseIds.length > 0);
  assert.deepEqual(Object.keys(SUBJECT_COLORS).sort(), subjects.map(entity => entity.id).sort());
  assert.equal(new Set(Object.values(SUBJECT_COLORS)).size, subjects.length);
  for (const entity of subjects) {
    const color = subjectColor({ kind: 'entity', id: entity.id });
    assert.match(color!, /^#[0-9a-f]{6}$/);
    const marks = V6_KNOWLEDGE_SPACE_DATA.marks.filter(mark => mark.subjectRef.id === entity.id);
    assert.ok(marks.every(mark => subjectColor(mark.subjectRef) === color));
  }
  assert.equal(subjectColor({ kind: 'event', id: 'neo-assyrian-empire' }), NEUTRAL_EVENT_COLOR);
  assert.equal(subjectColor({ kind: 'entity', id: 'epic-of-gilgamesh' }), CIVILIZATION_THEMES.mesopotamia.foreground);
});

test('civilization colors use explicit supported subject identities, never geographic inference', () => {
  const keys = new Set<string>();
  for (const assignment of CIVILIZATION_SUBJECT_ASSIGNMENTS) {
    const key = `${assignment.subject.kind}:${assignment.subject.id}`;
    assert.ok(!keys.has(key), `${key}: unique assignment`);
    keys.add(key);
    const collection = assignment.subject.kind === 'entity' ? V6_KNOWLEDGE_SPACE_DATA.entities : V6_KNOWLEDGE_SPACE_DATA.events;
    const object = collection.find(item => item.id === assignment.subject.id);
    assert.ok(object, `${key}: subject exists`);
    assert.ok(assignment.rationale.length > 0 && assignment.sourceIds.length > 0);
    assert.ok(assignment.sourceIds.every(id => (object.sourceIds as readonly string[]).includes(id)), `${key}: evidence belongs to subject`);
    assert.equal(subjectColor(assignment.subject), assignment.subject.kind === 'event' ? subjectColor({ kind: 'entity', id: EVENT_COLOR_PARTICIPANTS[assignment.subject.id]! }) : CIVILIZATION_THEMES[assignment.themeId].foreground);
  }
  for (const id of ['cuneiform', 'iron', 'amarna-letters-corpus', 'vedic-tradition', 'troy-archaeological-site']) {
    assert.equal(subjectColor({ kind: 'entity', id }), undefined, `${id}: shared or separately identified subject stays neutral`);
  }
  for (const theme of Object.values(CIVILIZATION_THEMES)) {
    assert.match(theme.provenance.url, /^https:\/\//);
    assert.ok(theme.provenance.title && theme.provenance.rationale);
  }
  assert.equal(subjectColor({ kind: 'entity', id: 'shang-oracle-bone-inscriptions' }), subjectColor({ kind: 'entity', id: 'shang-civilization' }));
  assert.notEqual(subjectColor({ kind: 'entity', id: 'tower-of-babel-tradition' }), subjectColor({ kind: 'entity', id: 'babylon-city' }));
});

test('Egypt cultural subjects retain one reviewed palette across concept layers and regions', () => {
  const layers = new Set<string>();
  const keys = new Set<string>();
  for (const assignment of EGYPT_SUBJECT_ASSIGNMENTS) {
    const { subject, sourceIds, rationale } = assignment;
    const key = `${subject.kind}:${subject.id}`;
    assert.ok(!keys.has(key), `${key}: duplicate assignment`);
    keys.add(key);
    const collection = subject.kind === 'entity' ? V6_KNOWLEDGE_SPACE_DATA.entities : V6_KNOWLEDGE_SPACE_DATA.events;
    const object = collection.find(item => item.id === subject.id);
    assert.ok(object, `${key}: authoritative subject exists`);
    assert.ok(sourceIds.length > 0 && rationale.length > 0);
    assert.ok(sourceIds.every(id => (object.sourceIds as readonly string[]).includes(id)), `${key}: evidence belongs to reviewed subject`);
    layers.add(object.conceptLayerId);
    const marks = V6_KNOWLEDGE_SPACE_DATA.marks.filter(mark => mark.subjectRef.kind === subject.kind && mark.subjectRef.id === subject.id);
    assert.ok(marks.length > 0, `${key}: accepted subject is visible`);
    assert.ok(marks.every(mark => subjectColor(mark.subjectRef) === (subject.kind === 'event' ? subjectColor({ kind: 'entity', id: EVENT_COLOR_PARTICIPANTS[subject.id]! }) : egyptSubjectColor(subject))));
  }
  assert.deepEqual([...layers].sort(), ['artAndLiterature', 'eventAndConflict', 'languageAndKnowledge', 'materialAndArchitecture', 'polityAndSociety', 'religionAndThought']);
  assert.equal(subjectColor({ kind: 'entity', id: 'sinuhe-work' }), EGYPT_THEME.foreground);
  assert.equal(subjectColor({ kind: 'event', id: 'event-unas-pyramid-text-inscription' }), SUBJECT_COLORS['egypt-old-kingdom']);
  assert.equal(egyptSubjectColor({ kind: 'event', id: 'egypt-old-kingdom' }), undefined);
});

test('Egypt palette does not assign shared texts, neighboring polities or bilateral events', () => {
  for (const id of ['amarna-letters-corpus', 'cuneiform', 'hittite-empire', 'proto-sinaitic-script']) {
    assert.equal(egyptSubjectColor({ kind: 'entity', id }), undefined);
  }
  for (const id of ['event-battle-of-kadesh', 'event-egypt-hatti-treaty']) {
    assert.equal(subjectColor({ kind: 'event', id }), NEUTRAL_EVENT_COLOR);
  }
  assert.match(EGYPT_THEME.provenance.url, /^https:\/\/blogs\.ucl\.ac\.uk\//);
  assert.equal(EGYPT_THEME.provenance.basis, 'pigment-inspired editorial palette');
});

test('political block colors remain legible under light name labels', () => {
  const linear = (value: number) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  const luminance = (hex: string) => {
    const channels = [1, 3, 5].map(offset => linear(parseInt(hex.slice(offset, offset + 2), 16) / 255));
    return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
  };
  for (const [id, color] of Object.entries(SUBJECT_COLORS)) {
    assert.ok((luminance('#fbf8ef') + 0.05) / (luminance(color) + 0.05) >= 4.5, `${id}: text contrast`);
  }
});

test('every event has a reviewed participant color or explicit neutral exception', () => {
  const events = V6_KNOWLEDGE_SPACE_DATA.events;
  assert.deepEqual([...Object.keys(EVENT_COLOR_PARTICIPANTS), ...Object.keys(EVENT_COLOR_EXCEPTIONS)].sort(), events.map(e => e.id).sort());
  for (const event of events) {
    const owner = EVENT_COLOR_PARTICIPANTS[event.id];
    if (owner) {
      assert.ok(event.participants.some(p => p.entityId === owner), event.id);
      assert.ok(subjectColor({kind: 'entity', id: owner}), owner);
      assert.equal(subjectColor({kind: 'event', id: event.id}), subjectColor({kind: 'entity', id: owner}));
    } else assert.equal(subjectColor({kind: 'event', id: event.id}), NEUTRAL_EVENT_COLOR);
  }
  assert.equal(EVENT_COLOR_PARTICIPANTS['event-zhou-conquest-of-shang'], 'western-zhou');
  assert.equal(EVENT_COLOR_PARTICIPANTS['event-lachish-captured'], 'neo-assyrian-empire');
});
