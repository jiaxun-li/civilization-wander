import assert from 'node:assert/strict';
import test from 'node:test';
import { V6_KNOWLEDGE_SPACE_DATA as data } from '../../src/knowledge-space/adapters/v6-adapter.ts';
import { politicalClaims } from '../../src/knowledge-space/adapters/political-descriptions.ts';
import type { EntityPhase } from '../../v6/schema/index.ts';
import { readFileSync } from 'node:fs';
import { V6_MODULE_REGISTRY } from '../../v6/module-registry.ts';

test('political details cover each visible subject and derive every row date from the core', () => {
  const subjects = data.entities.filter(e => e.conceptLayerId === 'polityAndSociety' && e.phaseIds.length);
  assert.equal(subjects.length, 20);
  assert.deepEqual(Object.keys(data.politicalDescriptions).sort(), subjects.map(e => e.id).sort());
  for (const entity of subjects) {
    const d = data.politicalDescriptions[entity.id]!;
    assert.deepEqual(Object.keys(d.phases).sort(), [...entity.phaseIds].sort());
    for (const claim of politicalClaims(d)) {
      assert.ok(claim.sourceIds.length);
      assert.ok(claim.sourceIds.every(id => data.sources.some(source => source.id === id)));
      assert.doesNotMatch(claim.text, /不表示|不等于|不能据此|本期收录|这里|所录范围/);
    }
    const phases = data.entityPhases.filter(p => p.entityId === entity.id).sort((a, b) => a.timeSpan.start! - b.timeSpan.start!);
    for (let i = 1; i < phases.length; i++) assert.ok(phases[i - 1]!.timeSpan.end! <= phases[i]!.timeSpan.start!, `${entity.id} overlaps its own spatial state`);
  }
});

test('civilizations become bounded city communities, preserving separate backgrounds and fixed identities', () => {
  for (const [id, name] of [
    ['minoan-palatial-civilization', '克里特宫殿社群'],
    ['mycenaean-civilization', '迈锡尼城市社群'],
    ['indus-civilization', '印度河城市社群'],
    ['greek-dark-age-communities', '希腊早期聚落社群']
  ]) {
    const entity = data.entities.find(e => e.id === id)!;
    assert.equal(entity.type, 'community');
    assert.equal(entity.name, name);
    assert.ok(data.marks.filter(mark => mark.subjectRef.id === id).every(mark => mark.markKind === 'block'));
  }
  assert.equal(data.entityPhases.find(p => p.id === 'indus-civilization-core-presence')!.timeSpan.start, -2600);
  assert.equal(data.entityPhases.find(p => p.id === 'minoan-knossos-linear-b-reorganization')!.timeSpan.end, -1350);
});

test('political migration decisions retain the reviewed types and complete phase lists', () => {
  for (const module of V6_MODULE_REGISTRY) {
    const ledger = JSON.parse(readFileSync(new URL(`../../v6/migration/entity-decisions/${module.id}.json`, import.meta.url), 'utf8'));
    for (const decision of ledger.decisions) {
      const entity = data.entities.find(e => e.id === decision.entityId && data.politicalDescriptions[e.id]);
      if (!entity) continue;
      assert.equal(decision.acceptedEntityType, entity.type, entity.id);
      assert.deepEqual(decision.acceptedPhaseIds, [...entity.phaseIds], entity.id);
    }
  }
});

test('reviewed political ranges retain conquests without premature or overlapping contractions', () => {
  const phases = new Map<string, EntityPhase>(data.entityPhases.map(p => [p.id, p]));
  for (const id of ['ur-iii-fragmentation', 'old-babylonian-contraction', 'western-zhou-contraction-and-fall', 'egypt-middle-kingdom-fragmentation', 'neo-babylonian-western-campaigns']) assert.equal(phases.has(id), false);
  const lateEgypt = phases.get('egypt-new-kingdom-fragmentation')!;
  assert.equal(lateEgypt.timeSpan.start, -1145);
  assert.equal(lateEgypt.regions.find(r => r.regionId === 'nubia')?.role, 'controlled');
  assert.equal(lateEgypt.regions.some(r => r.regionId === 'southern-levant'), false);
  const newBabylon = phases.get('neo-babylonian-capital-and-rule')!;
  assert.equal(newBabylon.timeSpan.end, -539);
  assert.ok(newBabylon.regions.some(r => r.regionId === 'southern-levant'));
  const conquest = data.politicalDescriptions['old-babylonian-kingdom']!.events![0]!;
  assert.equal(conquest.eventId, 'event-hammurabi-conquests');
  assert.ok(data.events.find(e => e.id === conquest.eventId)!.regions.some(r => r.regionId === 'middle-euphrates'));
  assert.equal(phases.get('neo-assyrian-imperial-administration')!.timeSpan.start, -732);
  assert.equal(phases.get('neo-assyrian-collapse')!.timeSpan.start, -612);
});
