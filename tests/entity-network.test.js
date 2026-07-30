const assert = require('node:assert/strict');
const network = require('../data/entity-network.js');
const queryModule = require('../data/entity-queries.js');

const queries = queryModule.createEntityQueries(network);

const expectedMoments = {
  buddhism: ['buddhism-ganges-formation', 'buddhism-ashoka-maurya'],
  shakyamuni: ['shakyamuni-teaching-life'],
  ashoka: ['ashoka-reign'],
  maurya: ['maurya-imperial-network']
};

for (const [entityId, momentIds] of Object.entries(expectedMoments)) {
  const entity = queries.getEntity(entityId);
  assert.ok(entity, `${entityId} should be independently queryable`);
  assert.deepEqual(entity.moments.map(moment => moment.id), momentIds);
  for (const moment of entity.moments) {
    assert.equal(queries.getEntityMomentAt(entityId, moment.cursorYear)?.id, moment.id);
  }
}

assert.equal(
  queries.getEntityMomentAt('buddhism', -500)?.id,
  'buddhism-ganges-formation'
);
assert.equal(
  queries.getEntityMomentAt('buddhism', -260)?.id,
  'buddhism-ashoka-maurya'
);

const buddhismAt500 = queries.getActiveRelationEpisodes('buddhism', -500);
assert.deepEqual(
  buddhismAt500.map(item => item.otherEntityId),
  ['shakyamuni'],
  'Ashoka and Maurya relations must not be active around 500 BCE'
);

const buddhismAt260 = queries.getActiveRelationEpisodes('buddhism', -260);
assert.deepEqual(
  new Set(buddhismAt260.map(item => item.otherEntityId)),
  new Set(['ashoka', 'maurya'])
);
assert.deepEqual(
  queries.getRelatedEntitiesAt('buddhism', -260).map(item => item.entity.id).sort(),
  ['ashoka', 'maurya']
);

const forward = queries.getRelationEpisodeBetween('ashoka', 'buddhism', -260);
const reverse = queries.getRelationEpisodeBetween('buddhism', 'ashoka', -260);
assert.equal(forward.direction, 'forward');
assert.equal(forward.verb, '护持并提高其公共可见度');
assert.equal(reverse.direction, 'reverse');
assert.equal(reverse.verb, '获得其护持并扩大公共可见度');
assert.equal(forward.episodeId, reverse.episodeId);
assert.match(forward.description, /^阿育王 → 护持并提高其公共可见度 → 佛教。/);
assert.match(reverse.description, /^佛教 → 获得其护持并扩大公共可见度 → 阿育王。/);

assert.equal(
  queries.getRelationEpisodeBetween('buddhism', 'ashoka', -500),
  null
);
assert.equal(
  queries.resolveEntityEntryYear('ashoka', -500, {
    time: { start: -260, end: -232, label: '约公元前260—前232年' }
  }),
  -260
);
assert.equal(
  queries.resolveEntityEntryYear('maurya', -260, forward),
  -260
);

assert.ok(
  network.relations.find(relation => relation.id === 'maurya-buddhism').episodes.length > 1,
  'Relation must support changes across episodes'
);
assert.equal(network.explorations[0].entry.entityId, 'buddhism');
assert.equal(network.explorations[0].entry.year, -500);
assert.equal(network.explorations[0].contextQuestion, '佛教为什么传播到东亚？');

console.log('entity-network tests passed');
