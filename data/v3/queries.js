(function exposeAtlasV3Queries(root, factory) {
  const createAtlasQueries = factory();
  const data = root && root.ATLAS_V3_DATA;
  const api = data ? createAtlasQueries(data) : { createAtlasQueries };
  api.createAtlasQueries = createAtlasQueries;
  if (root) root.ATLAS_V3_QUERIES = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
}(typeof window !== 'undefined' ? window : globalThis, function buildAtlasQueryFactory() {
  'use strict';

  const ENTITY_TYPES = new Set([
    'person',
    'polity',
    'institution',
    'peopleGroup',
    'culturalTradition',
    'languageSystem',
    'religiousTradition',
    'region',
    'routeNetwork',
    'event',
    'technologyPractice',
    'writingSystem',
    'artStyle'
  ]);
  const EDGE_FAMILIES = new Set([
    'lineage',
    'composition',
    'role',
    'spatial',
    'historicalNetwork',
    'production',
    'transmission'
  ]);
  const VIEW_FAMILIES = new Set(['lineage', 'composition', 'context', 'historicalNetwork']);
  const CARD_KINDS = new Set(['overview', 'facet', 'period']);
  const DISPLAY_TYPES = new Set(['cards', 'map', 'mapAndCards', 'sequence']);
  const NAV_KINDS = new Set(['structuralEdge', 'contextCollection', 'relatedCard']);
  const NAV_PRESENTATIONS = new Set(['inline', 'mapNode', 'closingCard']);

  return function createAtlasQueries(atlas) {
    if (!atlas || typeof atlas !== 'object') throw new TypeError('V3 atlas data is required');

    const collections = {
      entities: atlas.entities || [],
      structuralEdges: atlas.structuralEdges || [],
      cards: atlas.cards || [],
      scenes: atlas.scenes || [],
      structureViews: atlas.structureViews || [],
      navigationOptions: atlas.navigationOptions || [],
      mapStates: atlas.mapStates || [],
      geometries: atlas.geometries || [],
      assets: atlas.assets || [],
      sources: atlas.sources || []
    };
    const indexes = Object.fromEntries(
      Object.entries(collections).map(([name, values]) => [name, new Map(values.map(value => [value.id, value]))])
    );

    function getEntity(id) {
      return indexes.entities.get(id) || null;
    }

    function getCard(id) {
      return indexes.cards.get(id) || null;
    }

    function getScene(id) {
      return indexes.scenes.get(id) || null;
    }

    function getScenesForCard(cardId) {
      const card = getCard(cardId);
      if (!card) return [];
      return card.sceneIds
        .map(getScene)
        .filter(Boolean)
        .slice()
        .sort((a, b) => a.order - b.order);
    }

    function getStructuralEdge(id) {
      return indexes.structuralEdges.get(id) || null;
    }

    function timeOverlaps(edgeTime, filter) {
      if (!filter || !edgeTime) return true;
      const edgeStart = Number.isFinite(edgeTime.start) ? edgeTime.start : -Infinity;
      const edgeEnd = Number.isFinite(edgeTime.end) ? edgeTime.end : Infinity;
      if (Number.isFinite(filter.year)) return filter.year >= edgeStart && filter.year <= edgeEnd;
      const filterStart = Number.isFinite(filter.start) ? filter.start : -Infinity;
      const filterEnd = Number.isFinite(filter.end) ? filter.end : Infinity;
      return edgeStart <= filterEnd && edgeEnd >= filterStart;
    }

    function getEdgesForEntity(entityId, filters = {}) {
      if (!getEntity(entityId)) return [];
      return collections.structuralEdges.filter(edge => {
        const direction = filters.direction || 'both';
        const directionMatches = direction === 'outgoing'
          ? edge.sourceId === entityId
          : direction === 'incoming'
            ? edge.targetId === entityId
            : edge.sourceId === entityId || edge.targetId === entityId;
        return directionMatches
          && (!filters.edgeFamilies || filters.edgeFamilies.includes(edge.family))
          && (!filters.edgeTypes || filters.edgeTypes.includes(edge.type))
          && timeOverlaps(edge.time, filters.timeFilter);
      });
    }

    function getDirectLineageChildren(entityId, filters = {}) {
      return collections.structuralEdges
        .filter(edge => edge.family === 'lineage' && edge.targetId === entityId)
        .filter(edge => !filters.edgeTypes || filters.edgeTypes.includes(edge.type))
        .filter(edge => timeOverlaps(edge.time, filters.timeFilter))
        .map(edge => ({
          edge,
          entity: getEntity(edge.sourceId)
        }))
        .filter(item => item.entity);
    }

    function orientEdge(edge, focusEntityId) {
      const forward = edge.sourceId === focusEntityId;
      return {
        edge,
        direction: forward ? 'forward' : 'reverse',
        entity: getEntity(forward ? edge.targetId : edge.sourceId),
        label: forward ? edge.label.forward : edge.label.reverse || edge.label.forward,
        summary: forward
          ? edge.forwardSummary || edge.canonicalSummary
          : edge.reverseSummary || edge.canonicalSummary
      };
    }

    function getStructureViewItems(viewId, sceneId) {
      const view = indexes.structureViews.get(viewId);
      const scene = getScene(sceneId);
      if (!view || !scene) return [];
      const card = getCard(scene.cardId);
      if (!card) return [];
      const query = view.query || {};
      let edges;
      if (view.family === 'lineage' && query.direction === 'incoming') {
        edges = getDirectLineageChildren(card.entityId, query).map(item => item.edge);
      } else {
        edges = getEdgesForEntity(card.entityId, {
          direction: query.direction || 'both',
          edgeFamilies: query.edgeFamilies,
          edgeTypes: query.edgeTypes,
          timeFilter: query.timeFilter || card.scope?.time
        });
      }
      const featured = new Set(view.featuredEntityIds || []);
      const items = edges
        .map(edge => orientEdge(edge, card.entityId))
        .filter(item => !featured.size || featured.has(item.entity?.id))
        .slice(0, view.maxVisible || Infinity);
      if (items.length || !featured.size) return items;

      return collections.structuralEdges
        .filter(edge => (!query.edgeFamilies || query.edgeFamilies.includes(edge.family)))
        .filter(edge => (!query.edgeTypes || query.edgeTypes.includes(edge.type)))
        .filter(edge => featured.has(edge.sourceId) || featured.has(edge.targetId))
        .map(edge => orientEdge(edge, card.entityId))
        .filter(item => item.entity)
        .slice(0, view.maxVisible || Infinity);
    }

    function getNavigationOptionsForScene(sceneId) {
      const scene = getScene(sceneId);
      if (!scene) return [];
      return (scene.navigationIds || [])
        .map(id => indexes.navigationOptions.get(id))
        .filter(Boolean)
        .slice()
        .sort((a, b) => (a.rank || 0) - (b.rank || 0));
    }

    function getTargetCardForEntity(entityId) {
      const entity = getEntity(entityId);
      return entity ? getCard(entity.defaultCardId) : null;
    }

    function validateAtlasData() {
      const errors = [];
      const used = {
        entities: new Set(),
        structuralEdges: new Set(),
        cards: new Set(),
        scenes: new Set(),
        structureViews: new Set(),
        navigationOptions: new Set(),
        mapStates: new Set(),
        geometries: new Set(),
        assets: new Set(),
        sources: new Set()
      };
      const addError = message => errors.push(message);
      const requireId = (indexName, id, owner) => {
        if (!id || !indexes[indexName].has(id)) {
          addError(`${owner} references missing ${indexName} id: ${String(id)}`);
          return null;
        }
        used[indexName].add(id);
        return indexes[indexName].get(id);
      };
      const requireSources = (item, owner) => {
        if (!Array.isArray(item.sourceIds) || item.sourceIds.length === 0) {
          addError(`${owner} must cite at least one Source`);
          return;
        }
        item.sourceIds.forEach(id => requireId('sources', id, owner));
      };

      if (atlas.schemaVersion !== 3) addError('schemaVersion must equal 3');
      const seenIds = new Map();
      for (const [name, values] of Object.entries(collections)) {
        if (!Array.isArray(values)) {
          addError(`${name} must be an array`);
          continue;
        }
        for (const item of values) {
          if (!item || typeof item.id !== 'string' || !item.id) {
            addError(`${name} contains an item without a valid id`);
            continue;
          }
          if (seenIds.has(item.id)) addError(`duplicate global id ${item.id} in ${seenIds.get(item.id)} and ${name}`);
          seenIds.set(item.id, name);
        }
      }

      for (const entity of collections.entities) {
        used.entities.add(entity.id);
        if (!ENTITY_TYPES.has(entity.type)) addError(`Entity ${entity.id} has invalid type ${entity.type}`);
        if (!entity.name || !entity.canonicalSummary) addError(`Entity ${entity.id} lacks name or canonicalSummary`);
        const defaultCard = requireId('cards', entity.defaultCardId, `Entity ${entity.id}`);
        if (defaultCard && defaultCard.entityId !== entity.id) addError(`Entity ${entity.id} defaultCard belongs to another Entity`);
        (entity.featuredCardIds || []).forEach(id => {
          const card = requireId('cards', id, `Entity ${entity.id}`);
          if (card && card.entityId !== entity.id) addError(`Entity ${entity.id} featured Card ${id} belongs to another Entity`);
        });
        requireSources(entity, `Entity ${entity.id}`);
      }

      for (const edge of collections.structuralEdges) {
        if (!EDGE_FAMILIES.has(edge.family)) addError(`StructuralEdge ${edge.id} has invalid family ${edge.family}`);
        const source = requireId('entities', edge.sourceId, `StructuralEdge ${edge.id}`);
        const target = requireId('entities', edge.targetId, `StructuralEdge ${edge.id}`);
        if (edge.sourceId === edge.targetId) addError(`StructuralEdge ${edge.id} cannot be self-referential`);
        if (!edge.label?.forward || !edge.canonicalSummary) addError(`StructuralEdge ${edge.id} lacks relationship copy`);
        if (edge.family === 'lineage' && [source?.type, target?.type].includes('peopleGroup')
          && [source?.type, target?.type].includes('languageSystem')) {
          addError(`StructuralEdge ${edge.id} cannot mix PeopleGroup and LanguageSystem lineage`);
        }
        if (edge.family === 'lineage'
          && new Set([edge.sourceId, edge.targetId]).has('ashoka')
          && new Set([edge.sourceId, edge.targetId]).has('maurya')) {
          addError('Ashoka must not be a lineage child of the Maurya Empire');
        }
        requireSources(edge, `StructuralEdge ${edge.id}`);
      }

      for (const card of collections.cards) {
        requireId('entities', card.entityId, `Card ${card.id}`);
        if (!CARD_KINDS.has(card.kind)) addError(`Card ${card.id} has invalid kind ${card.kind}`);
        if (!card.title || !card.introduction) addError(`Card ${card.id} lacks title or introduction`);
        if (!Array.isArray(card.sceneIds) || card.sceneIds.length === 0) addError(`Card ${card.id} has no Scenes`);
        const cardScenes = (card.sceneIds || []).map(id => requireId('scenes', id, `Card ${card.id}`)).filter(Boolean);
        cardScenes.forEach(scene => {
          if (scene.cardId !== card.id) addError(`Card ${card.id} references Scene ${scene.id} owned by ${scene.cardId}`);
        });
        const orders = cardScenes.map(scene => scene.order);
        if (new Set(orders).size !== orders.length
          || orders.some((order, index) => order !== index + 1)) {
          addError(`Card ${card.id} Scene order must be contiguous from 1`);
        }
        (card.structureViewIds || []).forEach(id => requireId('structureViews', id, `Card ${card.id}`));
        (card.closingNavigationIds || []).forEach(id => requireId('navigationOptions', id, `Card ${card.id}`));
        (card.scope?.featuredEntityIds || []).forEach(id => requireId('entities', id, `Card ${card.id}`));
        requireSources(card, `Card ${card.id}`);
        const narrative = cardScenes.flatMap(scene => scene.contentBlocks || [])
          .map(block => block.text || '')
          .join(' ');
        if (!/(不能|不会自动|不意味着|不主张|不是.*决定|不决定|并不等于|不能.*化约)/.test(narrative)) {
          addError(`Card ${card.id} lacks a caveat against determinism`);
        }
      }

      for (const scene of collections.scenes) {
        const card = requireId('cards', scene.cardId, `Scene ${scene.id}`);
        if (card && !card.sceneIds.includes(scene.id)) addError(`Scene ${scene.id} is not listed by owning Card`);
        if (!Number.isInteger(scene.order) || scene.order < 1) addError(`Scene ${scene.id} has invalid order`);
        if (!Array.isArray(scene.contentBlocks) || scene.contentBlocks.length === 0) addError(`Scene ${scene.id} has no contentBlocks`);
        requireId('mapStates', scene.mapStateId, `Scene ${scene.id}`);
        (scene.activeStructureViewIds || []).forEach(id => requireId('structureViews', id, `Scene ${scene.id}`));
        (scene.navigationIds || []).forEach(id => {
          const nav = requireId('navigationOptions', id, `Scene ${scene.id}`);
          if (nav && nav.fromSceneId && nav.fromSceneId !== scene.id) addError(`Scene ${scene.id} uses NavigationOption ${id} owned by another Scene`);
        });
        (scene.featuredEntityIds || []).forEach(id => requireId('entities', id, `Scene ${scene.id}`));
        (scene.contentBlocks || []).filter(block => block.assetId).forEach(block => requireId('assets', block.assetId, `Scene ${scene.id}`));
        requireSources(scene, `Scene ${scene.id}`);
      }

      for (const view of collections.structureViews) {
        if (!VIEW_FAMILIES.has(view.family)) addError(`StructureView ${view.id} has invalid family ${view.family}`);
        if (!DISPLAY_TYPES.has(view.display)) addError(`StructureView ${view.id} has invalid display ${view.display}`);
        if (view.family === 'lineage' && view.depth !== 1) addError(`Lineage StructureView ${view.id} depth must equal 1`);
        if (view.family === 'context'
          && (view.query?.edgeFamilies || []).length + (view.query?.edgeTypes || []).length < 2) {
          addError(`Context StructureView ${view.id} must curate multiple relationship categories`);
        }
        (view.query?.edgeFamilies || []).forEach(family => {
          if (!EDGE_FAMILIES.has(family)) addError(`StructureView ${view.id} queries invalid edge family ${family}`);
        });
        (view.featuredEntityIds || []).forEach(id => requireId('entities', id, `StructureView ${view.id}`));
      }

      for (const nav of collections.navigationOptions) {
        requireId('cards', nav.fromCardId, `NavigationOption ${nav.id}`);
        if (nav.fromSceneId) requireId('scenes', nav.fromSceneId, `NavigationOption ${nav.id}`);
        requireId('cards', nav.targetCardId, `NavigationOption ${nav.id}`);
        if (!NAV_KINDS.has(nav.basis?.kind)) addError(`NavigationOption ${nav.id} has invalid basis`);
        if (!NAV_PRESENTATIONS.has(nav.presentation)) addError(`NavigationOption ${nav.id} has invalid presentation`);
        if (nav.basis?.kind === 'structuralEdge') requireId('structuralEdges', nav.basis.id, `NavigationOption ${nav.id}`);
        if (nav.basis?.kind === 'relatedCard') requireId('cards', nav.basis.id, `NavigationOption ${nav.id}`);
        if (nav.basis?.kind === 'contextCollection') requireId('structureViews', nav.basis.id, `NavigationOption ${nav.id}`);
      }

      for (const mapState of collections.mapStates) {
        if (!Array.isArray(mapState.camera?.center)
          || mapState.camera.center.length !== 2
          || !mapState.camera.center.every(Number.isFinite)
          || !Number.isFinite(mapState.camera?.scale)) {
          addError(`MapState ${mapState.id} has invalid camera`);
        }
        if (!Array.isArray(mapState.layerIds)) addError(`MapState ${mapState.id} layerIds must be an array`);
        (mapState.layerIds || []).forEach(layer => {
          if (layer.geometryId) requireId('geometries', layer.geometryId, `MapState ${mapState.id}`);
          if (layer.entityId) requireId('entities', layer.entityId, `MapState ${mapState.id}`);
          if (layer.navigationId) requireId('navigationOptions', layer.navigationId, `MapState ${mapState.id}`);
          if (!layer.geometryId && !layer.entityId && !layer.navigationId) addError(`MapState ${mapState.id} has an empty layer reference`);
        });
      }

      for (const geometry of collections.geometries) {
        if (!geometry.geometry?.type || !geometry.geometry?.coordinates) addError(`Geometry ${geometry.id} is not GeoJSON-like`);
        if (geometry.approximate && !/近似|示意|教学/.test(geometry.label || '')) {
          addError(`Approximate Geometry ${geometry.id} must be explicitly labelled`);
        }
        requireSources(geometry, `Geometry ${geometry.id}`);
      }
      for (const asset of collections.assets) {
        if (!asset.src || !asset.alt) addError(`Asset ${asset.id} lacks src or alt`);
        requireSources(asset, `Asset ${asset.id}`);
      }
      for (const source of collections.sources) {
        if (!source.title || !source.url) addError(`Source ${source.id} lacks title or URL`);
      }

      for (const view of collections.structureViews) {
        for (const scene of collections.scenes.filter(item => item.activeStructureViewIds?.includes(view.id))) {
          getStructureViewItems(view.id, scene.id).forEach(item => used.structuralEdges.add(item.edge.id));
        }
      }

      for (const [name, values] of Object.entries(collections)) {
        for (const value of values) {
          if (!used[name].has(value.id)) addError(`orphan ${name} object: ${value.id}`);
        }
      }

      return {
        valid: errors.length === 0,
        errors,
        counts: Object.fromEntries(Object.entries(collections).map(([name, values]) => [name, values.length]))
      };
    }

    return {
      schemaVersion: atlas.schemaVersion,
      getEntity,
      getCard,
      getScene,
      getScenesForCard,
      getStructuralEdge,
      getEdgesForEntity,
      getDirectLineageChildren,
      getStructureViewItems,
      getNavigationOptionsForScene,
      getTargetCardForEntity,
      validateAtlasData
    };
  };
}));
