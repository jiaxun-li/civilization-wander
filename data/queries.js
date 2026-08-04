(function exposeAtlasV5Queries(root, factory) {
  const nodeValidationRuntime = typeof module === 'object' && module.exports
    ? {
        fs: module['require']('node:fs'),
        path: module['require']('node:path'),
        projectRoot: module['require']('node:path').resolve(__dirname, '..')
      }
    : null;
  const api = factory(
    root?.ATLAS_V5_DATA ||
    (typeof module === 'object' && module.exports ? require('./atlas-data.js') : null),
    nodeValidationRuntime
  );
  if (root) root.ATLAS_V5_QUERIES = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
}(typeof window !== 'undefined' ? window : globalThis, function createAtlasV5QueriesModule(defaultData, nodeValidationRuntime) {
  'use strict';

  const TOP_LEVEL_KEYS = [
    'schemaVersion',
    'entities',
    'events',
    'structuralEdges',
    'cards',
    'scenes',
    'structureViews',
    'navigationOptions',
    'navigationPlacements',
    'cameraPresets',
    'mapStates',
    'geometries',
    'mapAnnotations',
    'assets',
    'sources'
  ];
  const COLLECTION_KEYS = TOP_LEVEL_KEYS.filter(key => key !== 'schemaVersion');
  const TRANSITIONS = new Set(['hold', 'ease', 'cut']);
  const PRESENTATION_KINDS = new Set(['textOnly', 'image', 'imageAndText', 'map', 'mapAndText']);
  const DIRECTIONS = new Set(['incoming', 'outgoing', 'both']);
  const ANNOTATION_PLACEMENTS = new Set([
    'auto', 'above', 'below', 'left', 'right',
    'topLeft', 'topRight', 'bottomLeft', 'bottomRight'
  ]);
  const CLAIM_KINDS = new Set([
    'geographyObservation',
    'historicalFact',
    'historicalCase',
    'interpretation',
    'editorialSynthesis',
    'narrativeTransition',
    'mechanism',
    'limitation',
    'sourceNote',
    'asset'
  ]);
  const EVENT_EVIDENCE_KINDS = new Set([
    'geographyObservation',
    'historicalFact',
    'historicalCase',
    'interpretation',
    'mechanism'
  ]);
  const EVENT_KINDS = new Set([
    'historicalEvent',
    'historicalProcess',
    'textualTradition',
    'traditionalNarrative'
  ]);
  const ASSET_TYPES = new Set(['data', 'image']);
  const ENTITY_TYPE_LABELS = Object.freeze({
    person: '人物',
    polity: '政治实体',
    institution: '制度',
    peopleGroup: '人群',
    culturalTradition: '文化传统',
    languageSystem: '语言系统',
    religionAndMyth: '宗教与神话',
    region: '地区',
    routeNetwork: '路线网络',
    technologyPractice: '技术实践',
    writingSystem: '文字系统',
    artStyle: '艺术风格',
    IdeaSchool: '思想流派',
    SettlementSite: '聚落遗址',
    GeographicFeature: '地理特征',
    TextDocument: '文本作品',
    CulturalObject: '文化物件',
    wonder: '奇观',
    Commodity: '商品',
    war: '战争'
  });
  const ASSET_EXTENSIONS = {
    data: new Set(['.js', '.json', '.geojson']),
    image: new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp'])
  };
  const CAMERA_SCALE_MIN = 0.7;
  const CAMERA_SCALE_MAX = 12;

  function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
  }

  function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  function unique(values) {
    return new Set(values).size === values.length;
  }

  function arrayOrEmpty(value) {
    return Array.isArray(value) ? value : [];
  }

  function timeSpanOverlaps(left, right) {
    if (!left || !right) return true;
    const leftStart = left.start === undefined ? -Infinity : left.start;
    const leftEnd = left.end === undefined ? Infinity : left.end;
    const rightStart = right.start === undefined ? -Infinity : right.start;
    const rightEnd = right.end === undefined ? Infinity : right.end;
    return leftStart <= rightEnd && rightStart <= leftEnd;
  }

  function buildIndexes(data) {
    const byCollection = {};
    COLLECTION_KEYS.forEach(key => {
      byCollection[key] = new Map(
        arrayOrEmpty(data?.[key])
          .filter(isPlainObject)
          .map(item => [item.id, item])
      );
    });
    const ownerCardBySceneId = new Map();
    arrayOrEmpty(data?.cards).filter(isPlainObject).forEach(card => {
      arrayOrEmpty(card.sceneIds).forEach((sceneId, order) => {
        const owners = ownerCardBySceneId.get(sceneId) || [];
        owners.push({ card, order });
        ownerCardBySceneId.set(sceneId, owners);
      });
    });
    return { byCollection, ownerCardBySceneId };
  }

  function createQueries(data) {
    const indexes = buildIndexes(data);
    const collection = name => indexes.byCollection[name];
    const get = (name, id) => collection(name)?.get(id) || null;

    function getOwnerCardForScene(sceneId) {
      const owners = indexes.ownerCardBySceneId.get(sceneId) || [];
      return owners.length === 1 ? owners[0].card : null;
    }

    function getScenesForCard(cardId) {
      const card = get('cards', cardId);
      return card ? card.sceneIds.map(sceneId => get('scenes', sceneId)).filter(Boolean) : [];
    }

    function getCardsForEntity(entityId) {
      return data.cards.filter(card =>
        card.primaryEntityId === entityId || card.relatedEntityIds.includes(entityId)
      );
    }

    function getPrimaryCardsForEntity(entityId) {
      return data.cards.filter(card => card.primaryEntityId === entityId);
    }

    function getRelatedCardsForEntity(entityId) {
      return data.cards.filter(card => card.relatedEntityIds.includes(entityId));
    }

    function getEventsForScene(sceneId) {
      const scene = get('scenes', sceneId);
      return scene ? scene.eventIds.map(eventId => get('events', eventId)).filter(Boolean) : [];
    }

    function getEventsForCard(cardId) {
      const eventIds = new Set();
      getScenesForCard(cardId).forEach(scene => {
        scene.eventIds.forEach(eventId => eventIds.add(eventId));
      });
      return Array.from(eventIds, eventId => get('events', eventId)).filter(Boolean);
    }

    function getNavigationEntrySceneId(navigationOrId) {
      const navigation = typeof navigationOrId === 'string'
        ? get('navigationOptions', navigationOrId)
        : navigationOrId;
      const targetCard = get('cards', navigation?.target?.cardId);
      if (!targetCard) return null;
      if (
        navigation?.entry?.kind === 'targetScene' &&
        targetCard.sceneIds.includes(navigation.target.sceneId)
      ) {
        return navigation.target.sceneId;
      }
      return targetCard.sceneIds[0] || null;
    }

    function getEdgesForEndpoint(endpointOrKind, idOrOptions, maybeOptions) {
      let endpoint;
      let options;
      if (typeof endpointOrKind === 'string') {
        endpoint = { kind: endpointOrKind, id: idOrOptions };
        options = maybeOptions || {};
      } else {
        endpoint = endpointOrKind;
        options = idOrOptions || {};
      }
      const direction = options.direction || 'both';
      const timeSpan = options.timeSpan;
      return data.structuralEdges.filter(edge => {
        const isSource = edge.source.kind === endpoint.kind && edge.source.id === endpoint.id;
        const isTarget = edge.target.kind === endpoint.kind && edge.target.id === endpoint.id;
        const matchesDirection =
          direction === 'outgoing' ? isSource :
          direction === 'incoming' ? isTarget :
          isSource || isTarget;
        return matchesDirection && (!timeSpan || !edge.timeSpan || timeSpanOverlaps(edge.timeSpan, timeSpan));
      });
    }

    function getStructureViewItems(viewId, focusEndpoint) {
      const view = get('structureViews', viewId);
      if (!view) return [];
      const query = view.query;
      const base = focusEndpoint
        ? getEdgesForEndpoint(focusEndpoint, { direction: query.direction, timeSpan: query.timeSpan })
        : data.structuralEdges.slice();
      const filtered = base.filter(edge => {
        if (query.endpointKinds && !query.endpointKinds.includes(edge.source.kind) && !query.endpointKinds.includes(edge.target.kind)) return false;
        if (query.edgeFamilies && !query.edgeFamilies.includes(edge.family)) return false;
        if (query.edgeTypes && !query.edgeTypes.includes(edge.type)) return false;
        if (query.timeSpan && edge.timeSpan && !timeSpanOverlaps(query.timeSpan, edge.timeSpan)) return false;
        return true;
      });
      const includes = new Set(view.includeEntityIds || []);
      return filtered
        .sort((left, right) => {
          const leftFeatured = Number(includes.has(left.source.id) || includes.has(left.target.id));
          const rightFeatured = Number(includes.has(right.source.id) || includes.has(right.target.id));
          return rightFeatured - leftFeatured || left.id.localeCompare(right.id);
        })
        .slice(0, view.maxVisible);
    }

    function placementsForOwner(kind, id, slot) {
      const key = kind === 'scene' ? 'sceneId' : 'cardId';
      return data.navigationPlacements
        .filter(placement =>
          placement.owner.kind === kind &&
          placement.owner[key] === id &&
          (!slot || placement.slot === slot)
        )
        .slice()
        .sort((left, right) => left.rank - right.rank || left.id.localeCompare(right.id));
    }

    function getNavigationOptionsForScene(sceneId, slot) {
      return placementsForOwner('scene', sceneId, slot)
        .filter(placement => placement.visible)
        .map(placement => ({
          placement,
          option: get('navigationOptions', placement.navigationOptionId)
        }));
    }

    return {
      data,
      indexes,
      getEntity: id => get('entities', id),
      getEvent: id => get('events', id),
      getCard: id => get('cards', id),
      getScene: id => get('scenes', id),
      getOwnerCardForScene,
      getScenesForCard,
      getCardsForEntity,
      getPrimaryCardsForEntity,
      getRelatedCardsForEntity,
      getEventsForScene,
      getEventsForCard,
      getNavigationEntrySceneId,
      getStructuralEdge: id => get('structuralEdges', id),
      getEdgesForEndpoint,
      getStructureView: id => get('structureViews', id),
      getStructureViewItems,
      getNavigationOption: id => get('navigationOptions', id),
      getNavigationPlacementsForScene: (sceneId, slot) => placementsForOwner('scene', sceneId, slot),
      getNavigationPlacementsForCard: (cardId, slot) => placementsForOwner('card', cardId, slot),
      getNavigationOptionsForScene,
      getMapState: id => get('mapStates', id),
      getCameraPreset: id => get('cameraPresets', id),
      getGeometry: id => get('geometries', id),
      getMapAnnotation: id => get('mapAnnotations', id),
      getAsset: id => get('assets', id),
      getSource: id => get('sources', id),
      getEntityTypeLabel: type => ENTITY_TYPE_LABELS[type] || null,
      timeSpanOverlaps,
      validateAtlasData: candidate => validateAtlasData(candidate === undefined ? data : candidate)
    };
  }

  function validateAtlasDataUnsafe(candidate) {
    const errors = [];
    const data = candidate === undefined ? defaultData : candidate;

    function error(path, message) {
      errors.push(`${path}: ${message}`);
    }

    function checkObject(value, path) {
      if (!isPlainObject(value)) {
        error(path, 'must be an object');
        return false;
      }
      return true;
    }

    function checkKeys(value, allowed, required, path) {
      if (!checkObject(value, path)) return false;
      Object.keys(value).forEach(key => {
        if (!allowed.includes(key)) error(`${path}.${key}`, 'unknown field');
      });
      required.forEach(key => {
        if (!Object.prototype.hasOwnProperty.call(value, key)) error(`${path}.${key}`, 'is required');
      });
      return true;
    }

    function checkString(value, path) {
      if (!isNonEmptyString(value)) error(path, 'must be a non-empty string');
    }

    function checkBoolean(value, path) {
      if (typeof value !== 'boolean') error(path, 'must be a boolean');
    }

    function checkStringArray(value, path, options) {
      const settings = options || {};
      if (!Array.isArray(value)) {
        error(path, 'must be an array');
        return;
      }
      if (settings.nonEmpty && value.length === 0) error(path, 'must not be empty');
      value.forEach((item, index) => checkString(item, `${path}[${index}]`));
      if (!unique(value)) error(path, 'must not contain duplicate values');
    }

    function checkTimeSpan(value, path, options) {
      const settings = options || {};
      if (!checkKeys(value, ['start', 'end', 'approximate', 'label'], ['label'], path)) return;
      checkString(value.label, `${path}.label`);
      const hasStart = Object.prototype.hasOwnProperty.call(value, 'start');
      const hasEnd = Object.prototype.hasOwnProperty.call(value, 'end');
      if (!hasStart && !hasEnd && settings.numeric !== false) error(path, 'must have start or end');
      ['start', 'end'].forEach(key => {
        if (!Object.prototype.hasOwnProperty.call(value, key)) return;
        const year = value[key];
        if (!Number.isFinite(year) || !Number.isInteger(year)) error(`${path}.${key}`, 'must be a finite integer');
        if (year === 0) error(`${path}.${key}`, 'year 0 is not allowed');
      });
      if (hasStart && hasEnd && Number.isFinite(value.start) && Number.isFinite(value.end) && value.start > value.end) {
        error(path, 'start must be less than or equal to end');
      }
      if (Object.prototype.hasOwnProperty.call(value, 'approximate')) checkBoolean(value.approximate, `${path}.approximate`);
    }

    if (!checkObject(data, 'atlas')) {
      return { valid: false, errors, counts: {} };
    }
    Object.keys(data).forEach(key => {
      if (!TOP_LEVEL_KEYS.includes(key)) error(`atlas.${key}`, 'unknown collection or field');
    });
    TOP_LEVEL_KEYS.forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(data, key)) error(`atlas.${key}`, 'is required');
    });
    if (data.schemaVersion !== 5) error('atlas.schemaVersion', 'must equal 5');
    COLLECTION_KEYS.forEach(key => {
      if (!Array.isArray(data[key])) error(`atlas.${key}`, 'must be an array');
    });
    if (errors.length) return { valid: false, errors, counts: {} };

    const indexes = buildIndexes(data);
    const maps = indexes.byCollection;
    const allTopIds = new Map();
    COLLECTION_KEYS.forEach(collectionName => {
      data[collectionName].forEach((item, index) => {
        const path = `${collectionName}[${index}]`;
        if (!isPlainObject(item)) {
          error(path, 'must be an object');
          return;
        }
        checkString(item.id, `${path}.id`);
        if (isNonEmptyString(item.id)) {
          if (allTopIds.has(item.id)) error(`${path}.id`, `duplicates ${allTopIds.get(item.id)}`);
          else allTopIds.set(item.id, path);
        }
      });
    });

    function has(collectionName, id) {
      return maps[collectionName].has(id);
    }

    function checkRef(collectionName, id, path) {
      checkString(id, path);
      if (isNonEmptyString(id) && !has(collectionName, id)) error(path, `references missing ${collectionName} object ${id}`);
    }

    function checkRefArray(collectionName, ids, path, options) {
      checkStringArray(ids, path, options);
      if (!Array.isArray(ids)) return;
      ids.forEach((id, index) => checkRef(collectionName, id, `${path}[${index}]`));
    }

    function checkSourceIds(ids, path, nonEmpty) {
      checkRefArray('sources', ids, path, { nonEmpty: Boolean(nonEmpty) });
    }

    function checkClaimBlock(block, path, blockIds, usage = 'general') {
      if (!checkObject(block, path)) return;
      if (blockIds) {
        if (blockIds.has(block.id)) error(`${path}.id`, `duplicate ClaimBlock id ${block.id}`);
        else if (isNonEmptyString(block.id)) blockIds.add(block.id);
      }
      checkString(block.id, `${path}.id`);
      if (!CLAIM_KINDS.has(block.kind)) {
        error(`${path}.kind`, `unknown ClaimBlock kind ${String(block.kind)}`);
        return;
      }
      if (block.kind === 'limitation' && usage !== 'editorialReview.limitations') {
        error(
          `${path}.kind`,
          `limitation is only allowed in EditorialReview.limitations; it is not allowed in ${usage}`
        );
      }
      const common = ['id', 'kind'];
      const rules = {
        geographyObservation: {
          allowed: common.concat(['text', 'sourceIds']),
          required: ['id', 'kind', 'text', 'sourceIds'],
          text: true,
          sources: true
        },
        historicalFact: {
          allowed: common.concat(['text', 'timeSpan', 'eventIds', 'entityIds', 'sourceIds']),
          required: ['id', 'kind', 'text', 'sourceIds'],
          text: true,
          sources: true
        },
        historicalCase: {
          allowed: common.concat(['title', 'text', 'timeSpan', 'eventIds', 'entityIds', 'sourceIds']),
          required: ['id', 'kind', 'title', 'text', 'eventIds', 'sourceIds'],
          title: true,
          text: true,
          sources: true,
          events: true
        },
        interpretation: {
          allowed: common.concat(['text', 'attribution', 'sourceIds']),
          required: ['id', 'kind', 'text', 'sourceIds'],
          text: true,
          sources: true
        },
        editorialSynthesis: {
          allowed: common.concat(['text', 'sourceIds']),
          required: ['id', 'kind', 'text', 'sourceIds'],
          text: true,
          sources: true
        },
        narrativeTransition: {
          allowed: common.concat(['text']),
          required: ['id', 'kind', 'text'],
          text: true
        },
        mechanism: {
          allowed: common.concat(['statement', 'steps', 'sourceIds']),
          required: ['id', 'kind', 'statement', 'steps', 'sourceIds'],
          statement: true,
          steps: true,
          sources: true
        },
        limitation: {
          allowed: common.concat(['text', 'addressesBlockIds', 'sourceIds']),
          required: ['id', 'kind', 'text', 'sourceIds'],
          text: true,
          sources: true
        },
        sourceNote: {
          allowed: common.concat(['text', 'sourceIds']),
          required: ['id', 'kind', 'text', 'sourceIds'],
          text: true,
          sources: true
        },
        asset: {
          allowed: common.concat(['assetId', 'caption', 'sourceIds']),
          required: ['id', 'kind', 'assetId', 'sourceIds'],
          asset: true,
          sources: true
        }
      };
      const rule = rules[block.kind];
      checkKeys(block, rule.allowed, rule.required, path);
      if (rule.text) checkString(block.text, `${path}.text`);
      if (rule.title) checkString(block.title, `${path}.title`);
      if (rule.statement) checkString(block.statement, `${path}.statement`);
      if (block.attribution !== undefined) checkString(block.attribution, `${path}.attribution`);
      if (block.caption !== undefined) checkString(block.caption, `${path}.caption`);
      if (block.timeSpan !== undefined) checkTimeSpan(block.timeSpan, `${path}.timeSpan`);
      if (block.eventIds !== undefined) checkRefArray('events', block.eventIds, `${path}.eventIds`, { nonEmpty: rule.events });
      if (block.entityIds !== undefined) checkRefArray('entities', block.entityIds, `${path}.entityIds`);
      if (block.addressesBlockIds !== undefined) {
        checkStringArray(block.addressesBlockIds, `${path}.addressesBlockIds`, { nonEmpty: true });
        if (Array.isArray(block.addressesBlockIds)) {
          block.addressesBlockIds.forEach((targetBlockId, index) => {
            if (isNonEmptyString(targetBlockId)) {
              claimBlockReferences.push({
                targetBlockId,
                path: `${path}.addressesBlockIds[${index}]`
              });
            }
          });
        }
      }
      if (rule.steps) checkStringArray(block.steps, `${path}.steps`, { nonEmpty: true });
      if (rule.sources) checkSourceIds(block.sourceIds, `${path}.sourceIds`, true);
      if (rule.asset) checkRef('assets', block.assetId, `${path}.assetId`);
    }

    function checkEditorialReview(value, path, blockIds) {
      if (!checkKeys(
        value,
        ['limitations', 'counterexamples', 'uncertainties', 'alternativeExplanations', 'sourceIds'],
        ['limitations', 'counterexamples', 'uncertainties', 'alternativeExplanations', 'sourceIds'],
        path
      )) return;
      const buckets = [
        ['limitations', 'limitation'],
        ['counterexamples', 'historicalCase'],
        ['uncertainties', 'interpretation'],
        ['alternativeExplanations', 'interpretation']
      ];
      let itemCount = 0;
      buckets.forEach(([bucket, kind]) => {
        const items = value[bucket];
        if (!Array.isArray(items)) {
          error(`${path}.${bucket}`, 'must be an array');
          return;
        }
        itemCount += items.length;
        items.forEach((block, index) => {
          checkClaimBlock(
            block,
            `${path}.${bucket}[${index}]`,
            blockIds,
            `editorialReview.${bucket}`
          );
          if (block?.kind !== kind) error(`${path}.${bucket}[${index}].kind`, `must equal ${kind}`);
        });
      });
      if (itemCount === 0) error(path, 'must contain at least one editorial review item');
      checkSourceIds(value.sourceIds, `${path}.sourceIds`, true);
    }

    const claimBlockIds = new Set();
    const claimBlockReferences = [];

    data.sources.forEach((source, index) => {
      const path = `sources[${index}]`;
      checkKeys(source, ['id', 'title', 'author', 'year', 'publisher', 'url'], ['id', 'title'], path);
      checkString(source.id, `${path}.id`);
      checkString(source.title, `${path}.title`);
      ['author', 'publisher', 'url'].forEach(key => {
        if (source[key] !== undefined) checkString(source[key], `${path}.${key}`);
      });
      if (source.year !== undefined && (!Number.isInteger(source.year) || source.year === 0)) error(`${path}.year`, 'must be a non-zero integer');
    });

    data.assets.forEach((asset, index) => {
      const path = `assets[${index}]`;
      if (!isPlainObject(asset)) return;
      checkKeys(asset, ['id', 'type', 'src', 'title', 'alt', 'sourceIds'], ['id', 'type', 'src', 'title', 'alt', 'sourceIds'], path);
      ['id', 'type', 'src', 'title', 'alt'].forEach(key => checkString(asset[key], `${path}.${key}`));
      if (!ASSET_TYPES.has(asset.type)) error(`${path}.type`, `must be one of ${Array.from(ASSET_TYPES).join(', ')}`);
      checkSourceIds(asset.sourceIds, `${path}.sourceIds`, true);
      if (typeof asset.src === 'string') {
        let decodedSrc = asset.src;
        try {
          decodedSrc = decodeURIComponent(asset.src);
        } catch {
          error(`${path}.src`, 'must use valid URL path encoding');
        }
        const hasProtocolOrAbsolutePath =
          /^[a-z][a-z0-9+.-]*:/i.test(decodedSrc) ||
          decodedSrc.startsWith('/') ||
          decodedSrc.startsWith('\\') ||
          /^[A-Za-z]:[\\/]/.test(decodedSrc);
        const escapesProjectRoot = decodedSrc.split(/[\\/]/).includes('..');
        if (hasProtocolOrAbsolutePath) {
          error(`${path}.src`, 'must be a local relative path');
        }
        if (escapesProjectRoot) error(`${path}.src`, 'must not escape the project root');
        if (ASSET_TYPES.has(asset.type)) {
          const extension = nodeValidationRuntime
            ? nodeValidationRuntime.path.extname(decodedSrc).toLowerCase()
            : `.${decodedSrc.split('.').pop().toLowerCase()}`;
          if (!ASSET_EXTENSIONS[asset.type].has(extension)) {
            error(`${path}.src`, `extension ${extension || '(none)'} is not allowed for Asset type ${asset.type}`);
          }
        }
        if (
          nodeValidationRuntime &&
          isNonEmptyString(asset.src) &&
          !hasProtocolOrAbsolutePath &&
          !escapesProjectRoot
        ) {
          const resolvedPath = nodeValidationRuntime.path.resolve(nodeValidationRuntime.projectRoot, decodedSrc);
          const relativePath = nodeValidationRuntime.path.relative(nodeValidationRuntime.projectRoot, resolvedPath);
          if (relativePath.startsWith('..') || nodeValidationRuntime.path.isAbsolute(relativePath)) {
            error(`${path}.src`, 'must resolve within the project root');
          } else if (
            !nodeValidationRuntime.fs.existsSync(resolvedPath) ||
            !nodeValidationRuntime.fs.statSync(resolvedPath).isFile()
          ) {
            error(`${path}.src`, `references missing local file ${asset.src}`);
          }
        }
      }
    });

    data.entities.forEach((entity, index) => {
      const path = `entities[${index}]`;
      checkKeys(
        entity,
        ['id', 'type', 'level', 'name', 'alternativeNames', 'canonicalSummary', 'timeSpan', 'tags', 'sourceIds'],
        ['id', 'type', 'name', 'canonicalSummary', 'sourceIds'],
        path
      );
      ['id', 'type', 'name', 'canonicalSummary'].forEach(key => checkString(entity[key], `${path}.${key}`));
      if (entity.level !== undefined) checkString(entity.level, `${path}.level`);
      if (entity.alternativeNames !== undefined) checkStringArray(entity.alternativeNames, `${path}.alternativeNames`);
      if (entity.tags !== undefined) checkStringArray(entity.tags, `${path}.tags`);
      if (entity.timeSpan !== undefined) checkTimeSpan(entity.timeSpan, `${path}.timeSpan`);
      checkSourceIds(entity.sourceIds, `${path}.sourceIds`, true);
    });

    data.events.forEach((event, index) => {
      const path = `events[${index}]`;
      checkKeys(
        event,
        ['id', 'kind', 'title', 'timeSpan', 'participantEntityIds', 'evidenceBlocks', 'sourceIds', 'editorialReview'],
        ['id', 'kind', 'title', 'timeSpan', 'participantEntityIds', 'evidenceBlocks', 'sourceIds', 'editorialReview'],
        path
      );
      checkString(event.id, `${path}.id`);
      checkString(event.kind, `${path}.kind`);
      if (!EVENT_KINDS.has(event.kind)) {
        error(`${path}.kind`, `must be one of ${Array.from(EVENT_KINDS).join(', ')}`);
      }
      checkString(event.title, `${path}.title`);
      checkTimeSpan(event.timeSpan, `${path}.timeSpan`);
      checkRefArray('entities', event.participantEntityIds, `${path}.participantEntityIds`, { nonEmpty: true });
      if (!Array.isArray(event.evidenceBlocks) || event.evidenceBlocks.length === 0) {
        error(`${path}.evidenceBlocks`, 'must be a non-empty array');
      } else {
        event.evidenceBlocks.forEach((block, blockIndex) => checkClaimBlock(
          block,
          `${path}.evidenceBlocks[${blockIndex}]`,
          claimBlockIds,
          'Event.evidenceBlocks'
        ));
        const sourcedEvidence = event.evidenceBlocks.filter(block =>
          isPlainObject(block) &&
          EVENT_EVIDENCE_KINDS.has(block.kind) &&
          Array.isArray(block.sourceIds) &&
          block.sourceIds.some(isNonEmptyString)
        );
        if (sourcedEvidence.length === 0) {
          error(
            `${path}.evidenceBlocks`,
            `must contain at least one sourced evidence ClaimBlock of kind ${Array.from(EVENT_EVIDENCE_KINDS).join(', ')}`
          );
        }
      }
      checkSourceIds(event.sourceIds, `${path}.sourceIds`, true);
      checkEditorialReview(event.editorialReview, `${path}.editorialReview`, claimBlockIds);
    });

    function checkEndpoint(endpoint, path) {
      if (!checkKeys(endpoint, ['kind', 'id'], ['kind', 'id'], path)) return;
      if (!['entity', 'event'].includes(endpoint.kind)) error(`${path}.kind`, 'must be entity or event');
      else checkRef(endpoint.kind === 'entity' ? 'entities' : 'events', endpoint.id, `${path}.id`);
    }

    data.structuralEdges.forEach((edge, index) => {
      const path = `structuralEdges[${index}]`;
      checkKeys(
        edge,
        ['id', 'family', 'type', 'source', 'target', 'timeSpan', 'label', 'summaries', 'qualifiers', 'sourceIds'],
        ['id', 'family', 'type', 'source', 'target', 'label', 'summaries', 'sourceIds'],
        path
      );
      ['id', 'family', 'type'].forEach(key => checkString(edge[key], `${path}.${key}`));
      checkEndpoint(edge.source, `${path}.source`);
      checkEndpoint(edge.target, `${path}.target`);
      if (edge.source?.kind === edge.target?.kind && edge.source?.id === edge.target?.id) error(path, 'self-loop StructuralEdge is not allowed');
      if (edge.timeSpan !== undefined) checkTimeSpan(edge.timeSpan, `${path}.timeSpan`);
      if (checkKeys(edge.label, ['forward', 'reverse'], ['forward'], `${path}.label`)) {
        checkString(edge.label.forward, `${path}.label.forward`);
        if (edge.label.reverse !== undefined) checkString(edge.label.reverse, `${path}.label.reverse`);
      }
      if (checkKeys(edge.summaries, ['canonical', 'forward', 'reverse'], ['canonical'], `${path}.summaries`)) {
        ['canonical', 'forward', 'reverse'].forEach(key => {
          if (edge.summaries[key] !== undefined) checkString(edge.summaries[key], `${path}.summaries.${key}`);
        });
      }
      if (edge.qualifiers !== undefined) checkStringArray(edge.qualifiers, `${path}.qualifiers`);
      checkSourceIds(edge.sourceIds, `${path}.sourceIds`, true);
      if (edge.type === 'branch_of') {
        const sourceEntity = edge.source?.kind === 'entity' ? maps.entities.get(edge.source.id) : null;
        const targetEntity = edge.target?.kind === 'entity' ? maps.entities.get(edge.target.id) : null;
        if (!sourceEntity || !targetEntity || sourceEntity.type !== 'languageSystem' || targetEntity.type !== 'languageSystem') {
          error(path, 'branch_of lineage must connect two languageSystem Entities');
        }
      }
    });

    const sceneOwnerRecords = new Map();
    data.cards.forEach((card, index) => {
      const path = `cards[${index}]`;
      checkKeys(
        card,
        ['id', 'kind', 'primaryEntityId', 'relatedEntityIds', 'title', 'editorialPurpose', 'introduction', 'thesis', 'timeSpan', 'sceneIds', 'sourceIds', 'editorialReview'],
        ['id', 'kind', 'primaryEntityId', 'relatedEntityIds', 'title', 'editorialPurpose', 'introduction', 'thesis', 'timeSpan', 'sceneIds', 'sourceIds', 'editorialReview'],
        path
      );
      ['id', 'kind', 'title', 'editorialPurpose', 'introduction'].forEach(key => checkString(card[key], `${path}.${key}`));
      checkRef('entities', card.primaryEntityId, `${path}.primaryEntityId`);
      const primaryEntity = maps.entities.get(card.primaryEntityId);
      if (primaryEntity && !ENTITY_TYPE_LABELS[primaryEntity.type]) {
        error(`${path}.primaryEntityId`, `primary Entity type ${primaryEntity.type} has no public label`);
      }
      checkRefArray('entities', card.relatedEntityIds, `${path}.relatedEntityIds`);
      if (card.primaryEntityId && card.relatedEntityIds.includes(card.primaryEntityId)) error(`${path}.relatedEntityIds`, 'must not duplicate primaryEntityId');
      if (checkKeys(card.thesis, ['text', 'sourceIds'], ['text', 'sourceIds'], `${path}.thesis`)) {
        checkString(card.thesis.text, `${path}.thesis.text`);
        checkSourceIds(card.thesis.sourceIds, `${path}.thesis.sourceIds`, true);
      }
      checkTimeSpan(card.timeSpan, `${path}.timeSpan`);
      checkRefArray('scenes', card.sceneIds, `${path}.sceneIds`, { nonEmpty: true });
      if (Array.isArray(card.sceneIds)) {
        card.sceneIds.forEach((sceneId, order) => {
          const owners = sceneOwnerRecords.get(sceneId) || [];
          owners.push({ cardId: card.id, order });
          sceneOwnerRecords.set(sceneId, owners);
        });
      }
      checkSourceIds(card.sourceIds, `${path}.sourceIds`, true);
      if (new Set(card.sourceIds || []).size < 2) error(`${path}.sourceIds`, 'complete Card must cite at least two distinct Sources');
      checkEditorialReview(card.editorialReview, `${path}.editorialReview`, claimBlockIds);
    });

    data.scenes.forEach((scene, index) => {
      const path = `scenes[${index}]`;
      checkKeys(
        scene,
        ['id', 'title', 'eyebrow', 'timeDisplay', 'timeSpan', 'eventIds', 'contentBlocks', 'presentation', 'sourceIds'],
        ['id', 'title', 'timeSpan', 'eventIds', 'contentBlocks', 'presentation', 'sourceIds'],
        path
      );
      checkString(scene.id, `${path}.id`);
      checkString(scene.title, `${path}.title`);
      if (scene.eyebrow !== undefined) checkString(scene.eyebrow, `${path}.eyebrow`);
      if (scene.timeDisplay !== undefined && !['year', 'undatedNarrative'].includes(scene.timeDisplay)) {
        error(`${path}.timeDisplay`, 'must be year or undatedNarrative');
      }
      checkTimeSpan(scene.timeSpan, `${path}.timeSpan`);
      checkRefArray('events', scene.eventIds, `${path}.eventIds`, { nonEmpty: true });
      if (!Array.isArray(scene.contentBlocks) || scene.contentBlocks.length === 0) error(`${path}.contentBlocks`, 'must be a non-empty array');
      else scene.contentBlocks.forEach((block, blockIndex) => checkClaimBlock(
        block,
        `${path}.contentBlocks[${blockIndex}]`,
        claimBlockIds,
        'Scene.contentBlocks'
      ));
      checkSourceIds(scene.sourceIds, `${path}.sourceIds`, true);
    });

    claimBlockReferences.forEach(reference => {
      if (!claimBlockIds.has(reference.targetBlockId)) {
        error(reference.path, `references missing ClaimBlock ${reference.targetBlockId}`);
      }
    });

    data.scenes.forEach((scene, index) => {
      const owners = sceneOwnerRecords.get(scene.id) || [];
      if (owners.length !== 1) error(`scenes[${index}].id`, `must belong to exactly one Card; found ${owners.length}`);
      const ownerCard = owners.length === 1 ? maps.cards.get(owners[0].cardId) : null;
      if (ownerCard && !timeSpanOverlaps(ownerCard.timeSpan, scene.timeSpan)) error(`scenes[${index}].timeSpan`, 'must overlap owner Card timeSpan');
      const linkedEvents = arrayOrEmpty(scene.eventIds).map(eventId => maps.events.get(eventId)).filter(Boolean);
      if (linkedEvents.length > 0 && !linkedEvents.some(event => timeSpanOverlaps(scene.timeSpan, event.timeSpan))) {
        error(`scenes[${index}].eventIds`, 'must include at least one Event whose timeSpan overlaps the Scene');
      }
    });

    data.cards.forEach((card, index) => {
      const evidenceBlocks = card.sceneIds.flatMap(sceneId => maps.scenes.get(sceneId)?.contentBlocks || [])
        .filter(block =>
          EVENT_EVIDENCE_KINDS.has(block.kind) &&
          Array.isArray(block.sourceIds) &&
          block.sourceIds.some(isNonEmptyString)
        );
      if (evidenceBlocks.length < 2) {
        error(`cards[${index}]`, 'complete Card must contain at least two sourced evidence ClaimBlocks');
      }
    });

    data.navigationOptions.forEach((option, index) => {
      const path = `navigationOptions[${index}]`;
      checkKeys(option, ['id', 'target', 'entry', 'basis', 'label', 'description'], ['id', 'target', 'basis', 'label', 'description'], path);
      checkString(option.id, `${path}.id`);
      checkString(option.label, `${path}.label`);
      checkString(option.description, `${path}.description`);
      if (isNonEmptyString(option.label) && /返回|回到/.test(option.label)) {
        error(`${path}.label`, 'navigation copy must use origin-neutral entry wording, not return-style wording');
      }
      if (isNonEmptyString(option.description) && /返回|回到/.test(option.description)) {
        error(`${path}.description`, 'navigation copy must not assume where the reader started');
      }
      if (checkKeys(option.target, ['cardId', 'sceneId'], ['cardId'], `${path}.target`)) {
        checkRef('cards', option.target.cardId, `${path}.target.cardId`);
        if (option.target.sceneId !== undefined) {
          checkRef('scenes', option.target.sceneId, `${path}.target.sceneId`);
          const targetCard = maps.cards.get(option.target.cardId);
          if (targetCard && !targetCard.sceneIds.includes(option.target.sceneId)) error(`${path}.target.sceneId`, 'must belong to target Card');
        }
      }
      if (option.entry !== undefined && checkKeys(option.entry, ['kind'], ['kind'], `${path}.entry`)) {
        if (option.entry.kind !== 'targetScene') {
          error(`${path}.entry.kind`, `unknown Navigation entry kind ${String(option.entry.kind)}`);
        } else if (!isNonEmptyString(option.target?.sceneId)) {
          error(`${path}.entry.kind`, 'targetScene entry requires target.sceneId');
        }
      }
      if (checkObject(option.basis, `${path}.basis`)) {
        const kind = option.basis.kind;
        if (kind === 'structuralEdge') {
          checkKeys(option.basis, ['kind', 'structuralEdgeId'], ['kind', 'structuralEdgeId'], `${path}.basis`);
          checkRef('structuralEdges', option.basis.structuralEdgeId, `${path}.basis.structuralEdgeId`);
        } else if (kind === 'event') {
          checkKeys(option.basis, ['kind', 'eventId'], ['kind', 'eventId'], `${path}.basis`);
          checkRef('events', option.basis.eventId, `${path}.basis.eventId`);
        } else if (kind === 'relatedCard') {
          checkKeys(option.basis, ['kind', 'cardId'], ['kind', 'cardId'], `${path}.basis`);
          checkRef('cards', option.basis.cardId, `${path}.basis.cardId`);
        } else if (kind === 'editorial') {
          checkKeys(option.basis, ['kind', 'sourceIds'], ['kind', 'sourceIds'], `${path}.basis`);
          checkSourceIds(option.basis.sourceIds, `${path}.basis.sourceIds`, true);
        } else {
          error(`${path}.basis.kind`, `unknown Navigation basis ${String(kind)}`);
        }
      }
    });

    const placementRanks = new Map();
    data.navigationPlacements.forEach((placement, index) => {
      const path = `navigationPlacements[${index}]`;
      checkKeys(placement, ['id', 'navigationOptionId', 'owner', 'slot', 'rank', 'visible', 'interactive'], ['id', 'navigationOptionId', 'owner', 'slot', 'rank', 'visible', 'interactive'], path);
      checkString(placement.id, `${path}.id`);
      checkRef('navigationOptions', placement.navigationOptionId, `${path}.navigationOptionId`);
      if (checkObject(placement.owner, `${path}.owner`)) {
        if (placement.owner.kind === 'scene') {
          checkKeys(placement.owner, ['kind', 'sceneId'], ['kind', 'sceneId'], `${path}.owner`);
          checkRef('scenes', placement.owner.sceneId, `${path}.owner.sceneId`);
          if (!['inline', 'map'].includes(placement.slot)) error(`${path}.slot`, 'Scene owner requires inline or map slot');
        } else if (placement.owner.kind === 'card') {
          checkKeys(placement.owner, ['kind', 'cardId'], ['kind', 'cardId'], `${path}.owner`);
          checkRef('cards', placement.owner.cardId, `${path}.owner.cardId`);
          if (placement.slot !== 'closing') error(`${path}.slot`, 'Card owner requires closing slot');
        } else {
          error(`${path}.owner.kind`, 'must be scene or card');
        }
      }
      if (!['inline', 'map', 'closing'].includes(placement.slot)) error(`${path}.slot`, 'must be inline, map, or closing');
      if (!Number.isInteger(placement.rank) || placement.rank < 1) error(`${path}.rank`, 'must be a positive integer');
      checkBoolean(placement.visible, `${path}.visible`);
      checkBoolean(placement.interactive, `${path}.interactive`);
      const ownerId = placement.owner?.sceneId || placement.owner?.cardId || 'invalid';
      const rankKey = `${placement.owner?.kind}:${ownerId}:${placement.slot}`;
      const ranks = placementRanks.get(rankKey) || [];
      ranks.push({ rank: placement.rank, path });
      placementRanks.set(rankKey, ranks);
    });
    placementRanks.forEach(records => {
      const sorted = records.map(record => record.rank).sort((a, b) => a - b);
      sorted.forEach((rank, index) => {
        if (rank !== index + 1) error(records[index].path + '.rank', 'ranks must be unique and continuous from 1 within owner + slot');
      });
    });

    const reciprocalCardLinks = new Map();
    const cardTargetPlacements = new Map();
    data.navigationPlacements.forEach((placement, index) => {
      if (placement.visible !== true || placement.interactive !== true) return;
      const option = maps.navigationOptions.get(placement.navigationOptionId);
      if (!option || !maps.cards.has(option.target?.cardId)) return;

      let sourceCardId = null;
      if (placement.owner?.kind === 'card' && maps.cards.has(placement.owner.cardId)) {
        sourceCardId = placement.owner.cardId;
      } else if (placement.owner?.kind === 'scene') {
        const owners = sceneOwnerRecords.get(placement.owner.sceneId) || [];
        if (owners.length === 1) sourceCardId = owners[0].cardId;
      }
      if (!sourceCardId || sourceCardId === option.target.cardId) return;

      const direction = `${sourceCardId}->${option.target.cardId}`;
      const targetPlacements = cardTargetPlacements.get(direction) || [];
      targetPlacements.push(`navigationPlacements[${index}].navigationOptionId`);
      cardTargetPlacements.set(direction, targetPlacements);
      if (!reciprocalCardLinks.has(direction)) {
        reciprocalCardLinks.set(direction, `navigationPlacements[${index}].navigationOptionId`);
      }
    });
    cardTargetPlacements.forEach((paths, direction) => {
      if (paths.length > 1) {
        error(paths[1], `a Card may expose only one visible interactive link to the same target Card (${direction})`);
      }
    });
    reciprocalCardLinks.forEach((path, direction) => {
      const [sourceCardId, targetCardId] = direction.split('->');
      if (!reciprocalCardLinks.has(`${targetCardId}->${sourceCardId}`)) {
        error(path, `visible interactive Card navigation must have a reciprocal Card link from ${targetCardId} to ${sourceCardId}`);
      }
    });

    data.cameraPresets.forEach((preset, index) => {
      const path = `cameraPresets[${index}]`;
      checkKeys(preset, ['id', 'center', 'scale'], ['id', 'center', 'scale'], path);
      checkString(preset.id, `${path}.id`);
      checkCoordinatesPosition(preset.center, `${path}.center`, error);
      if (!Number.isFinite(preset.scale) || preset.scale < CAMERA_SCALE_MIN || preset.scale > CAMERA_SCALE_MAX) {
        error(`${path}.scale`, `must be a finite number in [${CAMERA_SCALE_MIN}, ${CAMERA_SCALE_MAX}]`);
      }
    });

    data.geometries.forEach((geometry, index) => {
      const path = `geometries[${index}]`;
      checkKeys(geometry, ['id', 'geometry', 'timeSpan', 'approximate', 'label', 'sourceIds'], ['id', 'geometry', 'timeSpan', 'approximate', 'label', 'sourceIds'], path);
      checkString(geometry.id, `${path}.id`);
      checkGeometry(geometry.geometry, `${path}.geometry`, error);
      checkTimeSpan(geometry.timeSpan, `${path}.timeSpan`);
      checkBoolean(geometry.approximate, `${path}.approximate`);
      checkString(geometry.label, `${path}.label`);
      checkSourceIds(geometry.sourceIds, `${path}.sourceIds`, geometry.approximate === true);
    });

    function checkMapLayer(layer, path, allowedKinds) {
      if (!checkObject(layer, path)) return;
      const refFields = ['geometryId', 'entityId', 'navigationOptionId'];
      const presentRefs = refFields.filter(field => Object.prototype.hasOwnProperty.call(layer, field));
      if (presentRefs.length !== 1) error(path, 'must contain exactly one primary reference');
      if (!allowedKinds.includes(layer.kind)) error(`${path}.kind`, `kind ${String(layer.kind)} is not allowed here`);
      if (layer.kind === 'geometry') {
        checkKeys(layer, ['kind', 'geometryId', 'timeSpan', 'sourceIds'], ['kind', 'geometryId', 'timeSpan', 'sourceIds'], path);
        checkRef('geometries', layer.geometryId, `${path}.geometryId`);
        checkTimeSpan(layer.timeSpan, `${path}.timeSpan`);
        checkSourceIds(layer.sourceIds, `${path}.sourceIds`, true);
        const geometry = maps.geometries.get(layer.geometryId);
        if (geometry && !timeSpanOverlaps(layer.timeSpan, geometry.timeSpan)) error(`${path}.timeSpan`, 'must overlap Geometry timeSpan');
      } else if (layer.kind === 'entity') {
        checkKeys(layer, ['kind', 'entityId', 'annotationId', 'timeSpan', 'sourceIds'], ['kind', 'entityId', 'annotationId', 'sourceIds'], path);
        checkRef('entities', layer.entityId, `${path}.entityId`);
        checkRef('mapAnnotations', layer.annotationId, `${path}.annotationId`);
        if (layer.timeSpan !== undefined) checkTimeSpan(layer.timeSpan, `${path}.timeSpan`);
        checkSourceIds(layer.sourceIds, `${path}.sourceIds`, false);
      } else if (layer.kind === 'navigation') {
        checkKeys(layer, ['kind', 'navigationOptionId', 'annotationId', 'timeSpan', 'sourceIds'], ['kind', 'navigationOptionId', 'annotationId', 'sourceIds'], path);
        checkRef('navigationOptions', layer.navigationOptionId, `${path}.navigationOptionId`);
        checkRef('mapAnnotations', layer.annotationId, `${path}.annotationId`);
        if (layer.timeSpan !== undefined) checkTimeSpan(layer.timeSpan, `${path}.timeSpan`);
        checkSourceIds(layer.sourceIds, `${path}.sourceIds`, false);
      }
    }

    data.mapStates.forEach((mapState, index) => {
      const path = `mapStates[${index}]`;
      checkKeys(mapState, ['id', 'cameraPresetId', 'layers'], ['id', 'cameraPresetId', 'layers'], path);
      checkString(mapState.id, `${path}.id`);
      checkRef('cameraPresets', mapState.cameraPresetId, `${path}.cameraPresetId`);
      if (!Array.isArray(mapState.layers)) error(`${path}.layers`, 'must be an array');
      else mapState.layers.forEach((layer, layerIndex) => checkMapLayer(layer, `${path}.layers[${layerIndex}]`, ['geometry']));
    });

    data.structureViews.forEach((view, index) => {
      const path = `structureViews[${index}]`;
      checkKeys(view, ['id', 'family', 'title', 'query', 'maxVisible', 'includeEntityIds', 'display', 'depth'], ['id', 'family', 'title', 'query', 'maxVisible', 'display'], path);
      ['id', 'family', 'title', 'display'].forEach(key => checkString(view[key], `${path}.${key}`));
      if (checkKeys(view.query, ['endpointKinds', 'edgeFamilies', 'edgeTypes', 'direction', 'timeSpan'], ['direction'], `${path}.query`)) {
        if (!DIRECTIONS.has(view.query.direction)) error(`${path}.query.direction`, 'must be incoming, outgoing, or both');
        if (view.query.endpointKinds !== undefined) {
          checkStringArray(view.query.endpointKinds, `${path}.query.endpointKinds`, { nonEmpty: true });
          view.query.endpointKinds.forEach((kind, kindIndex) => {
            if (!['entity', 'event'].includes(kind)) error(`${path}.query.endpointKinds[${kindIndex}]`, 'must be entity or event');
          });
        }
        if (view.query.edgeFamilies !== undefined) checkStringArray(view.query.edgeFamilies, `${path}.query.edgeFamilies`, { nonEmpty: true });
        if (view.query.edgeTypes !== undefined) checkStringArray(view.query.edgeTypes, `${path}.query.edgeTypes`, { nonEmpty: true });
        if (view.query.timeSpan !== undefined) checkTimeSpan(view.query.timeSpan, `${path}.query.timeSpan`);
      }
      if (!Number.isInteger(view.maxVisible) || view.maxVisible < 1) error(`${path}.maxVisible`, 'must be a positive integer');
      if (view.depth !== undefined && (!Number.isInteger(view.depth) || view.depth < 1)) error(`${path}.depth`, 'must be a positive integer');
      if (view.includeEntityIds !== undefined) checkRefArray('entities', view.includeEntityIds, `${path}.includeEntityIds`);
    });

    data.mapAnnotations.forEach((annotation, index) => {
      const path = `mapAnnotations[${index}]`;
      checkKeys(annotation, ['id', 'subject', 'anchor', 'anchorMeaning', 'approximate', 'sourceIds', 'placement', 'label'], ['id', 'subject', 'anchor', 'anchorMeaning', 'approximate', 'sourceIds', 'placement'], path);
      checkString(annotation.id, `${path}.id`);
      if (checkObject(annotation.subject, `${path}.subject`)) {
        if (annotation.subject.kind === 'entity') {
          checkKeys(annotation.subject, ['kind', 'entityId'], ['kind', 'entityId'], `${path}.subject`);
          checkRef('entities', annotation.subject.entityId, `${path}.subject.entityId`);
        } else if (annotation.subject.kind === 'navigation') {
          checkKeys(annotation.subject, ['kind', 'navigationOptionId'], ['kind', 'navigationOptionId'], `${path}.subject`);
          checkRef('navigationOptions', annotation.subject.navigationOptionId, `${path}.subject.navigationOptionId`);
        } else {
          error(`${path}.subject.kind`, 'must be entity or navigation');
        }
      }
      if (checkObject(annotation.anchor, `${path}.anchor`)) {
        if (annotation.anchor.kind === 'geo') {
          checkKeys(annotation.anchor, ['kind', 'coordinates'], ['kind', 'coordinates'], `${path}.anchor`);
          checkCoordinatesPosition(annotation.anchor.coordinates, `${path}.anchor.coordinates`, error);
        } else if (annotation.anchor.kind === 'screen') {
          checkKeys(annotation.anchor, ['kind'], ['kind'], `${path}.anchor`);
        } else {
          error(`${path}.anchor.kind`, 'must be geo or screen');
        }
      }
      if (!['locatedAt', 'associatedWith', 'screenCallout'].includes(annotation.anchorMeaning)) error(`${path}.anchorMeaning`, 'has an unknown meaning');
      checkBoolean(annotation.approximate, `${path}.approximate`);
      checkSourceIds(annotation.sourceIds, `${path}.sourceIds`, annotation.anchorMeaning !== 'screenCallout');
      if (!ANNOTATION_PLACEMENTS.has(annotation.placement)) error(`${path}.placement`, 'has an unsupported placement');
      if (annotation.label !== undefined) checkString(annotation.label, `${path}.label`);
      if (annotation.anchorMeaning === 'locatedAt') {
        if (annotation.anchor?.kind !== 'geo') error(`${path}.anchor`, 'locatedAt requires a geo anchor');
        if (annotation.approximate !== false) error(`${path}.approximate`, 'locatedAt requires approximate:false');
      } else if (annotation.anchorMeaning === 'associatedWith') {
        if (annotation.anchor?.kind !== 'geo') error(`${path}.anchor`, 'associatedWith requires a geo anchor');
        if (annotation.approximate !== true) error(`${path}.approximate`, 'associatedWith requires approximate:true');
      } else if (annotation.anchorMeaning === 'screenCallout') {
        if (annotation.anchor?.kind !== 'screen') error(`${path}.anchor`, 'screenCallout requires a screen anchor');
      }
    });

    data.scenes.forEach((scene, index) => {
      const path = `scenes[${index}].presentation`;
      const presentation = scene.presentation;
      if (!checkObject(presentation, path)) return;
      if (!PRESENTATION_KINDS.has(presentation.kind)) {
        error(`${path}.kind`, `unknown presentation kind ${String(presentation.kind)}`);
        return;
      }
      if (presentation.kind === 'textOnly') {
        checkKeys(presentation, ['kind'], ['kind'], path);
      } else if (presentation.kind === 'image' || presentation.kind === 'imageAndText') {
        checkKeys(presentation, ['kind', 'assetId'], ['kind', 'assetId'], path);
        checkRef('assets', presentation.assetId, `${path}.assetId`);
        const asset = maps.assets.get(presentation.assetId);
        if (asset && asset.type !== 'image') {
          error(`${path}.assetId`, 'image presentation requires an Asset with type image');
        }
      } else {
        checkKeys(presentation, ['kind', 'map'], ['kind', 'map'], path);
        if (checkKeys(presentation.map, ['mapStateId', 'transition', 'structureViewIds', 'layers', 'caption'], ['mapStateId', 'transition', 'structureViewIds', 'layers'], `${path}.map`)) {
          checkRef('mapStates', presentation.map.mapStateId, `${path}.map.mapStateId`);
          if (!TRANSITIONS.has(presentation.map.transition)) error(`${path}.map.transition`, 'must be hold, ease, or cut');
          if (presentation.map.caption !== undefined) checkString(presentation.map.caption, `${path}.map.caption`);
          checkRefArray('structureViews', presentation.map.structureViewIds, `${path}.map.structureViewIds`);
          if (!Array.isArray(presentation.map.layers)) error(`${path}.map.layers`, 'must be an array');
          else presentation.map.layers.forEach((layer, layerIndex) => {
            checkMapLayer(layer, `${path}.map.layers[${layerIndex}]`, ['entity', 'navigation']);
            if (layer.timeSpan && !timeSpanOverlaps(scene.timeSpan, layer.timeSpan)) error(`${path}.map.layers[${layerIndex}].timeSpan`, 'must overlap Scene timeSpan');
            const annotation = maps.mapAnnotations.get(layer.annotationId);
            if (annotation && layer.kind === 'entity') {
              if (annotation.subject.kind !== 'entity' || annotation.subject.entityId !== layer.entityId) error(`${path}.map.layers[${layerIndex}].annotationId`, 'annotation subject must match Entity layer');
            }
            if (annotation && layer.kind === 'navigation') {
              if (annotation.subject.kind !== 'navigation' || annotation.subject.navigationOptionId !== layer.navigationOptionId) error(`${path}.map.layers[${layerIndex}].annotationId`, 'annotation subject must match Navigation layer');
            }
          });
          const mapState = maps.mapStates.get(presentation.map.mapStateId);
          arrayOrEmpty(mapState?.layers).forEach((layer, layerIndex) => {
            const geometry = maps.geometries.get(layer.geometryId);
            if (!timeSpanOverlaps(scene.timeSpan, layer.timeSpan)) error(`${path}.map.mapStateId`, `Scene timeSpan does not overlap MapState layer ${layerIndex}`);
            if (geometry && !timeSpanOverlaps(scene.timeSpan, geometry.timeSpan)) error(`${path}.map.mapStateId`, `Scene timeSpan does not overlap Geometry ${geometry.id}`);
          });
        }
      }
    });

    data.navigationPlacements.forEach((placement, index) => {
      if (placement.owner?.kind !== 'scene' || placement.slot !== 'map') return;
      const scene = maps.scenes.get(placement.owner.sceneId);
      const layers = arrayOrEmpty(scene?.presentation?.map?.layers);
      const matchingLayers = layers.filter(layer =>
        layer?.kind === 'navigation' &&
        layer.navigationOptionId === placement.navigationOptionId
      );
      if (matchingLayers.length !== 1) {
        error(`navigationPlacements[${index}]`, 'map placement requires exactly one matching Navigation layer in the owner Scene');
      }
    });

    data.scenes.forEach((scene, sceneIndex) => {
      arrayOrEmpty(scene?.presentation?.map?.layers).forEach((layer, layerIndex) => {
        if (layer?.kind !== 'navigation') return;
        const matchingPlacements = data.navigationPlacements.filter(placement =>
          placement?.owner?.kind === 'scene' &&
          placement.owner.sceneId === scene.id &&
          placement.slot === 'map' &&
          placement.navigationOptionId === layer.navigationOptionId
        );
        if (matchingPlacements.length !== 1) {
          error(
            `scenes[${sceneIndex}].presentation.map.layers[${layerIndex}]`,
            'Navigation layer requires exactly one matching map NavigationPlacement'
          );
        }
      });
    });

    function referencedIds(collectionName, callback) {
      const used = new Set();
      callback(used);
      data[collectionName].forEach((item, index) => {
        if (!used.has(item.id)) error(`${collectionName}[${index}].id`, 'orphan object is not referenced by active V5 data');
      });
    }

    referencedIds('events', used => {
      data.scenes.forEach(scene => arrayOrEmpty(scene.eventIds).forEach(id => used.add(id)));
      data.structuralEdges.forEach(edge => {
        if (edge.source.kind === 'event') used.add(edge.source.id);
        if (edge.target.kind === 'event') used.add(edge.target.id);
      });
    });
    referencedIds('navigationOptions', used => data.navigationPlacements.forEach(placement => used.add(placement.navigationOptionId)));
    referencedIds('cameraPresets', used => data.mapStates.forEach(mapState => used.add(mapState.cameraPresetId)));
    referencedIds('mapStates', used => data.scenes.forEach(scene => {
      if (scene.presentation?.map) used.add(scene.presentation.map.mapStateId);
    }));
    referencedIds('geometries', used => data.mapStates.forEach(mapState => mapState.layers.forEach(layer => used.add(layer.geometryId))));
    referencedIds('mapAnnotations', used => data.scenes.forEach(scene => {
      (scene.presentation?.map?.layers || []).forEach(layer => used.add(layer.annotationId));
    }));
    referencedIds('structureViews', used => data.scenes.forEach(scene => {
      (scene.presentation?.map?.structureViewIds || []).forEach(id => used.add(id));
    }));
    referencedIds('assets', used => data.scenes.forEach(scene => {
      if (scene.presentation?.assetId) used.add(scene.presentation.assetId);
      scene.contentBlocks.forEach(block => {
        if (block.kind === 'asset') used.add(block.assetId);
      });
    }));

    return {
      valid: errors.length === 0,
      errors,
      counts: Object.fromEntries(COLLECTION_KEYS.map(key => [key, data[key].length]))
    };
  }

  function checkCoordinatesPosition(position, path, error) {
    if (!Array.isArray(position) || position.length !== 2) {
      error(path, 'must be a [longitude, latitude] pair');
      return;
    }
    const longitude = position[0];
    const latitude = position[1];
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) error(`${path}[0]`, 'longitude must be finite and within [-180, 180]');
    if (!Number.isFinite(latitude) || latitude < -85.05112878 || latitude > 85.05112878) error(`${path}[1]`, 'latitude must be finite and within Web Mercator bounds');
  }

  function checkGeometry(value, path, error) {
    if (!isPlainObject(value)) {
      error(path, 'must be a GeoJSON geometry object');
      return;
    }
    const keys = Object.keys(value);
    keys.forEach(key => {
      if (!['type', 'coordinates'].includes(key)) error(`${path}.${key}`, 'unknown field');
    });
    if (!isNonEmptyString(value.type)) error(`${path}.type`, 'must be a non-empty string');
    if (!Object.prototype.hasOwnProperty.call(value, 'coordinates')) {
      error(`${path}.coordinates`, 'is required');
      return;
    }
    const position = (item, itemPath) => checkCoordinatesPosition(item, itemPath, error);
    const line = (items, itemPath) => {
      if (!Array.isArray(items) || items.length < 2) {
        error(itemPath, 'LineString must contain at least two positions');
        return;
      }
      items.forEach((item, index) => position(item, `${itemPath}[${index}]`));
    };
    const ring = (items, itemPath) => {
      if (!Array.isArray(items) || items.length < 4) {
        error(itemPath, 'Polygon ring must contain at least four positions');
        return;
      }
      items.forEach((item, index) => position(item, `${itemPath}[${index}]`));
      const first = items[0];
      const last = items[items.length - 1];
      if (!Array.isArray(first) || !Array.isArray(last) || first[0] !== last[0] || first[1] !== last[1]) {
        error(itemPath, 'Polygon ring must be closed');
      }
    };
    const polygon = (items, itemPath) => {
      if (!Array.isArray(items) || items.length === 0) {
        error(itemPath, 'Polygon must contain at least one ring');
        return;
      }
      items.forEach((item, index) => ring(item, `${itemPath}[${index}]`));
    };
    switch (value.type) {
      case 'Point':
        position(value.coordinates, `${path}.coordinates`);
        break;
      case 'MultiPoint':
        if (!Array.isArray(value.coordinates) || value.coordinates.length === 0) error(`${path}.coordinates`, 'MultiPoint must not be empty');
        else value.coordinates.forEach((item, index) => position(item, `${path}.coordinates[${index}]`));
        break;
      case 'LineString':
        line(value.coordinates, `${path}.coordinates`);
        break;
      case 'MultiLineString':
        if (!Array.isArray(value.coordinates) || value.coordinates.length === 0) error(`${path}.coordinates`, 'MultiLineString must not be empty');
        else value.coordinates.forEach((item, index) => line(item, `${path}.coordinates[${index}]`));
        break;
      case 'Polygon':
        polygon(value.coordinates, `${path}.coordinates`);
        break;
      case 'MultiPolygon':
        if (!Array.isArray(value.coordinates) || value.coordinates.length === 0) error(`${path}.coordinates`, 'MultiPolygon must not be empty');
        else value.coordinates.forEach((item, index) => polygon(item, `${path}.coordinates[${index}]`));
        break;
      default:
        error(`${path}.type`, `unsupported geometry type ${String(value.type)}`);
    }
  }

  function validateAtlasData(candidate) {
    try {
      return validateAtlasDataUnsafe(candidate);
    } catch (cause) {
      const detail = cause && typeof cause.message === 'string' ? cause.message : String(cause);
      return {
        valid: false,
        errors: [`atlas: malformed data must not interrupt validation (${detail})`],
        counts: {}
      };
    }
  }

  const defaultQueries = createQueries(defaultData);
  return Object.assign(defaultQueries, {
    createQueries,
    validateAtlasData,
    ENTITY_TYPE_LABELS,
    timeSpanOverlaps
  });
}));
