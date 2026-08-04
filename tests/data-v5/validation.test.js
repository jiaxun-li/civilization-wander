const test = require('node:test');
const assert = require('node:assert/strict');

const data = require('../../data/atlas-data.js');
const queries = require('../../data/queries.js');

function reject(mutator, pattern) {
  const candidate = structuredClone(data);
  mutator(candidate);
  const result = queries.validateAtlasData(candidate);
  assert.equal(result.valid, false, 'fixture should be rejected');
  if (pattern) assert.match(result.errors.join('\n'), pattern);
}

function imageFixture(candidate, src = 'tests/fixtures/local-image.svg') {
  candidate.assets.push({
    id: 'asset-test-image',
    type: 'image',
    src,
    title: 'Local image validation fixture',
    alt: 'A local validation fixture',
    sourceIds: ['source-natural-earth']
  });
  const scene = candidate.scenes.find(item => item.id === 'sumer-methods-outlast-dynasties');
  scene.presentation = { kind: 'imageAndText', assetId: 'asset-test-image' };
}

function dataAssetFixture(candidate) {
  candidate.assets.push({
    id: 'asset-test-data',
    type: 'data',
    src: 'data/world-physical.js',
    title: 'Local data validation fixture',
    alt: 'Local vector data',
    sourceIds: ['source-natural-earth']
  });
  const scene = candidate.scenes.find(item => item.id === 'sumer-methods-outlast-dynasties');
  scene.presentation = { kind: 'imageAndText', assetId: 'asset-test-data' };
}

test('malformed candidates and hostile nested types never throw', () => {
  const candidates = [
    null,
    { schemaVersion: 5 },
    (() => {
      const candidate = structuredClone(data);
      candidate.cards[0] = null;
      return candidate;
    })(),
    (() => {
      const candidate = structuredClone(data);
      candidate.cards[0].relatedEntityIds = { 0: 'sumer' };
      return candidate;
    })(),
    (() => {
      const candidate = structuredClone(data);
      candidate.cards[0].sceneIds = 'sumer-water-network';
      return candidate;
    })(),
    (() => {
      const candidate = structuredClone(data);
      candidate.scenes[0].contentBlocks = [null];
      return candidate;
    })(),
    (() => {
      const candidate = structuredClone(data);
      candidate.scenes[0].presentation.map.layers = [null];
      return candidate;
    })(),
    (() => {
      const candidate = structuredClone(data);
      candidate.mapStates[0].layers = { length: 1 };
      return candidate;
    })(),
    (() => {
      const candidate = structuredClone(data);
      candidate.structureViews.push({
        id: 'view-malformed-fixture',
        family: 'historicalNetwork',
        title: 'Malformed fixture',
        query: { endpointKinds: null },
        depth: 1,
        maxVisible: 1,
        display: 'cards'
      });
      return candidate;
    })(),
    (() => {
      const candidate = structuredClone(data);
      candidate.events[0].editorialReview.limitations = [null];
      return candidate;
    })()
  ];
  for (const candidate of candidates) {
    let result;
    assert.doesNotThrow(() => { result = queries.validateAtlasData(candidate); });
    assert.equal(result.valid, false);
    assert.ok(Array.isArray(result.errors) && result.errors.length > 0);
  }
});

test('unknown fields are rejected rather than renderer-filtered', () => {
  reject(candidate => { candidate.scenes[0].cardId = 'sumer-measuring-land-time'; }, /cardId.*unknown field/);
  reject(candidate => { candidate.scenes[0].order = 1; }, /order.*unknown field/);
  reject(candidate => { candidate.scenes[0].mapStateId = 'map-sumer-uruk'; }, /mapStateId.*unknown field/);
  reject(candidate => { candidate.navigationOptions[0].summary = 'unexpected'; }, /summary.*unknown field/);
  reject(candidate => { candidate.mapStates[0].camera = { center: [0, 0], scale: 1 }; }, /camera.*unknown field/);
});

test('Scene ownership rejects double owners, orphans, and duplicate membership', () => {
  reject(candidate => {
    candidate.cards[1].sceneIds.push(candidate.cards[0].sceneIds[0]);
  }, /must belong to exactly one Card/);
  reject(candidate => {
    candidate.cards[0].sceneIds.shift();
  }, /must belong to exactly one Card/);
  reject(candidate => {
    candidate.cards[0].sceneIds.push(candidate.cards[0].sceneIds[0]);
  }, /duplicate values|exactly one Card/);
});

test('Entity rejects the removed default Card field', () => {
  reject(candidate => {
    const sumer = candidate.entities.find(entity => entity.id === 'sumer');
    sumer.defaultCardId = 'sumer-uruk-city';
  }, /defaultCardId.*unknown field/);
});

test('every Card requires one primary Entity with a public type label', () => {
  reject(candidate => {
    delete candidate.cards[0].primaryEntityId;
  }, /primaryEntityId.*is required/);
  reject(candidate => {
    const card = candidate.cards[0];
    candidate.entities.find(entity => entity.id === card.primaryEntityId).type = 'unlabelledType';
  }, /primaryEntityId.*has no public label/);
});

test('Event, Scene, and complete Card requirements are structural', () => {
  reject(candidate => { candidate.events[0].kind = 'storyLikeThing'; }, /kind.*must be one of/);
  reject(candidate => { candidate.events[0].participantEntityIds = []; }, /participantEntityIds.*must not be empty/);
  reject(candidate => { candidate.events[0].evidenceBlocks = []; }, /evidenceBlocks.*non-empty/);
  reject(candidate => {
    candidate.events[0].editorialReview.limitations = [];
    candidate.events[0].editorialReview.counterexamples = [];
    candidate.events[0].editorialReview.uncertainties = [];
    candidate.events[0].editorialReview.alternativeExplanations = [];
  }, /at least one editorial review item/);
  reject(candidate => { candidate.cards[0].eventIds = []; }, /eventIds.*unknown field/);
  reject(candidate => { candidate.scenes[0].eventIds = []; }, /eventIds.*must not be empty/);
  reject(candidate => { delete candidate.scenes[0].eventIds; }, /eventIds.*is required/);
  reject(candidate => {
    candidate.scenes[0].eventIds = ['event-egypt-hatti-treaty'];
  }, /must include at least one Event whose timeSpan overlaps the Scene/);
  reject(candidate => { candidate.cards[0].sourceIds = [candidate.cards[0].sourceIds[0]]; }, /at least two distinct Sources/);
  reject(candidate => { delete candidate.cards[0].thesis; }, /thesis.*is required/);
});

test('limitation is exclusive to EditorialReview.limitations', () => {
  const sourceId = data.cards[0].sourceIds[0];
  const limitation = id => ({
    id,
    kind: 'limitation',
    text: 'Internal review material must not become public evidence.',
    sourceIds: [sourceId]
  });

  reject(candidate => {
    candidate.scenes[0].contentBlocks.push(limitation('malicious-scene-limitation'));
  }, /limitation is only allowed in EditorialReview\.limitations.*not allowed in Scene\.contentBlocks/);

  reject(candidate => {
    candidate.events[0].evidenceBlocks[0] = limitation('malicious-event-limitation');
  }, /limitation is only allowed in EditorialReview\.limitations.*not allowed in Event\.evidenceBlocks/);

  const internal = structuredClone(data);
  internal.cards[0].editorialReview.limitations.push(limitation('valid-internal-limitation'));
  assert.equal(queries.validateAtlasData(internal).valid, true);
});

test('limitation addressesBlockIds resolve registered ClaimBlocks', () => {
  const sourceId = data.cards[0].sourceIds[0];
  const limitation = addressesBlockIds => ({
    id: 'addresses-reference-fixture',
    kind: 'limitation',
    text: 'This internal limitation addresses a specific supported claim.',
    addressesBlockIds,
    sourceIds: [sourceId]
  });

  const valid = structuredClone(data);
  const targetBlockId = valid.scenes[0].contentBlocks[0].id;
  valid.cards[0].editorialReview.limitations.push(limitation([targetBlockId]));
  assert.equal(queries.validateAtlasData(valid).valid, true);

  reject(candidate => {
    candidate.cards[0].editorialReview.limitations.push(
      limitation(['claim-does-not-exist'])
    );
  }, /references missing ClaimBlock claim-does-not-exist/);

  reject(candidate => {
    candidate.cards[0].editorialReview.limitations.push(limitation(['']));
  }, /addressesBlockIds\[0\].*must be a non-empty string/);

  reject(candidate => {
    const existingId = candidate.scenes[0].contentBlocks[0].id;
    candidate.cards[0].editorialReview.limitations.push(
      limitation([existingId, existingId])
    );
  }, /addressesBlockIds.*must not contain duplicate values/);
});

test('Event evidence requires a sourced evidence-semantic ClaimBlock', () => {
  reject(candidate => {
    candidate.events[0].evidenceBlocks = [{
      id: 'transition-only-event-evidence',
      kind: 'narrativeTransition',
      text: 'This transition is not evidence.'
    }];
  }, /must contain at least one sourced evidence ClaimBlock/);

  reject(candidate => {
    imageFixture(candidate);
    candidate.events[0].evidenceBlocks = [{
      id: 'asset-only-event-evidence',
      kind: 'asset',
      assetId: 'asset-test-image',
      sourceIds: ['source-natural-earth']
    }];
  }, /must contain at least one sourced evidence ClaimBlock/);

  reject(candidate => {
    candidate.events[0].evidenceBlocks = [{
      id: 'unsourced-event-claim',
      kind: 'historicalFact',
      text: 'A claim without claim-level provenance.'
    }];
  }, /sourceIds.*is required|must contain at least one sourced evidence ClaimBlock/);

  const valid = structuredClone(data);
  valid.events[0].evidenceBlocks = [{
    id: 'sourced-event-fact',
    kind: 'historicalFact',
    text: 'A source-supported fact can satisfy the Event evidence minimum.',
    eventIds: [valid.events[0].id],
    sourceIds: [valid.events[0].sourceIds[0]]
  }];
  assert.equal(queries.validateAtlasData(valid).valid, true);
});

test('Navigation target, owner, slot, and rank are strict', () => {
  reject(candidate => {
    candidate.navigationOptions[0].target.sceneId = 'sumer-water-network';
  }, /must belong to target Card/);
  reject(candidate => {
    const option = candidate.navigationOptions.find(item => item.id === 'nav-amarna-mesopotamia');
    delete option.target.sceneId;
  }, /targetScene entry requires target\.sceneId/);
  reject(candidate => {
    candidate.navigationOptions[0].entry = { kind: 'middle' };
  }, /unknown Navigation entry kind/);
  reject(candidate => {
    candidate.navigationOptions[0].entry = { kind: 'targetScene', extra: true };
  }, /entry\.extra: unknown field/);
  reject(candidate => {
    candidate.navigationPlacements[0].slot = 'closing';
  }, /Scene owner requires inline or map slot/);
  reject(candidate => {
    candidate.navigationPlacements.find(item => item.id === 'placement-uruk-gilgamesh-closing').rank = 3;
  }, /ranks must be unique and continuous/);
  reject(candidate => {
    candidate.navigationPlacements.find(item => item.id === 'placement-temple-uruk-inline').interactive = false;
  }, /reciprocal Card link/);
  reject(candidate => {
    const original = candidate.navigationPlacements.find(item => item.id === 'placement-temple-uruk-inline');
    candidate.navigationPlacements.push({
      ...original,
      id: 'placement-temple-uruk-duplicate',
      owner: { kind: 'scene', sceneId: 'mesopotamian-temple-ur' }
    });
  }, /only one visible interactive link to the same target Card/);
  reject(candidate => {
    candidate.navigationOptions.find(item => item.id === 'nav-temple-uruk').label = '返回乌鲁克';
  }, /origin-neutral entry wording/);
});

test('TimeSpan rejects label-only, non-finite, year zero, and reversed spans', () => {
  reject(candidate => {
    candidate.scenes[0].timeSpan = { label: '无法计算' };
  }, /must have start or end/);
  reject(candidate => { candidate.scenes[0].timeSpan.start = Infinity; }, /finite integer/);
  reject(candidate => { candidate.scenes[0].timeSpan.start = 0; }, /year 0/);
  reject(candidate => {
    candidate.scenes[0].timeSpan.start = -400;
    candidate.scenes[0].timeSpan.end = -500;
  }, /start must be less than or equal to end/);
});

test('Scene timeDisplay accepts only the two controlled public modes', () => {
  reject(candidate => {
    candidate.scenes[0].timeDisplay = '史诗叙事';
  }, /timeDisplay.*must be year or undatedNarrative/);
});

test('MapLayer is a strict discriminated union and MapState accepts geometry only', () => {
  reject(candidate => {
    candidate.mapStates[0].layers[0].entityId = 'sumer';
  }, /exactly one primary reference|unknown field/);
  reject(candidate => {
    const scene = candidate.scenes.find(item => item.presentation.map);
    scene.presentation.map.layers[0] = { kind: 'entity', annotationId: candidate.mapAnnotations[0].id, sourceIds: [] };
  }, /exactly one primary reference|entityId.*is required/);
  reject(candidate => {
    candidate.mapStates[0].layers[0] = {
      kind: 'entity',
      entityId: 'sumer',
      annotationId: candidate.mapAnnotations[0].id,
      sourceIds: []
    };
  }, /kind entity is not allowed here/);
});

test('optional map captions are validated as public strings', () => {
  reject(candidate => {
    candidate.scenes.find(scene => scene.id === 'sumer-uruk-gathering').presentation.map.caption = [];
  }, /caption.*must be a non-empty string/);
});

test('geometry coordinates, rings, approximation, and temporal overlap are validated', () => {
  reject(candidate => {
    const geometry = candidate.geometries.find(item => item.id === 'geometry-southern-mesopotamia-city-world');
    geometry.geometry.coordinates[0][0] = [181, 25];
  }, /longitude.*within/);
  reject(candidate => {
    const geometry = candidate.geometries.find(item => item.id === 'geometry-southern-mesopotamia-city-world');
    geometry.geometry.coordinates[0].pop();
  }, /Polygon ring must be closed/);
  reject(candidate => {
    candidate.geometries.find(item => item.id === 'geometry-southern-mesopotamia-city-world').sourceIds = [];
  }, /sourceIds.*must not be empty/);
  reject(candidate => {
    candidate.mapStates[0].layers[0].timeSpan = { start: 1200, end: 1300, label: '无重叠' };
  }, /must overlap Geometry timeSpan|does not overlap MapState/);
});

test('annotation meaning, anchor, approximation, source, and subject must agree', () => {
  reject(candidate => {
    candidate.mapAnnotations[0].anchorMeaning = 'locatedAt';
  }, /locatedAt requires a geo anchor|locatedAt requires approximate:false|sourceIds.*must not be empty/);
  reject(candidate => {
    candidate.mapAnnotations[0].anchorMeaning = 'associatedWith';
    candidate.mapAnnotations[0].approximate = false;
  }, /associatedWith requires a geo anchor|approximate:true/);
  reject(candidate => {
    candidate.mapAnnotations.push({
      id: 'annotation-test-screen-callout',
      subject: { kind: 'entity', entityId: 'sumer' },
      anchor: { kind: 'screen', coordinates: [82, 26] },
      anchorMeaning: 'screenCallout',
      approximate: false,
      sourceIds: [],
      placement: 'left',
      label: '测试内屏幕标注'
    });
  }, /coordinates.*unknown field/);
  reject(candidate => {
    const scene = candidate.scenes.find(item => item.id === 'sumer-water-network');
    scene.presentation.map.layers[0].annotationId = 'annotation-indus-major-cities-label';
  }, /annotation subject must match Entity layer/);
});

test('historical claims and local assets cannot silently lose provenance', () => {
  reject(candidate => {
    candidate.scenes.find(scene => scene.id === 'sumer-land-measurement')
      .contentBlocks.find(block => block.kind === 'historicalFact').sourceIds = [];
  }, /sourceIds.*must not be empty/);
  reject(candidate => {
    candidate.scenes[0].contentBlocks[0].kind = 'paragraph';
  }, /unknown ClaimBlock kind/);
  reject(candidate => { imageFixture(candidate, 'https://example.test/map.svg'); }, /local relative path/);
});

test('CameraPreset scale uses the exact renderer range', () => {
  for (const boundary of [0.7, 12]) {
    const candidate = structuredClone(data);
    candidate.cameraPresets[0].scale = boundary;
    assert.equal(queries.validateAtlasData(candidate).valid, true, String(boundary));
  }
  reject(candidate => { candidate.cameraPresets[0].scale = 0.6999; }, /\[0.7, 12\]/);
  reject(candidate => { candidate.cameraPresets[0].scale = 12.0001; }, /\[0.7, 12\]/);
});

test('image presentations require a real local image Asset', () => {
  const positive = structuredClone(data);
  imageFixture(positive);
  assert.equal(queries.validateAtlasData(positive).valid, true);

  reject(candidate => {
    dataAssetFixture(candidate);
  }, /requires an Asset with type image/);
  reject(candidate => {
    imageFixture(candidate);
    candidate.assets.at(-1).type = 'video';
  }, /must be one of data, image/);
  reject(candidate => {
    imageFixture(candidate);
    candidate.assets.at(-1).src = 'tests/fixtures/local-image.js';
  }, /not allowed for Asset type image/);
  reject(candidate => {
    imageFixture(candidate, 'https://example.test/local-image.svg');
  }, /local relative path/);
  reject(candidate => {
    imageFixture(candidate, '../local-image.svg');
  }, /must not escape the project root/);
  reject(candidate => {
    imageFixture(candidate, 'tests/fixtures/%2e%2e/local-image.svg');
  }, /must not escape the project root/);
  reject(candidate => {
    imageFixture(candidate, 'tests/fixtures/missing-image.svg');
  }, /references missing local file/);
});
