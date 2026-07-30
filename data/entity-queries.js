/**
 * 山河与文明 · 第二版实体网络纯查询
 *
 * 所有函数只读取传入的数据并返回新对象或原始实体引用；不读取 DOM、不修改年份，
 * 也不依赖旧 Story/StoryChapter。浏览器使用 window.ATLAS_ENTITY_QUERIES；
 * Node 测试可 require 本文件并调用 createEntityQueries(network)。
 */

(function exposeEntityQueries(root, factory) {
  const createEntityQueries = factory();
  const defaultNetwork = root && root.ATLAS_ENTITY_NETWORK;
  const api = defaultNetwork
    ? Object.assign({}, createEntityQueries(defaultNetwork), { createEntityQueries })
    : { createEntityQueries };
  if (root) root.ATLAS_ENTITY_QUERIES = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
}(typeof window !== 'undefined' ? window : globalThis, function buildEntityQueryFactory() {
  /**
   * @param {{entities?:Array,relations?:Array}} network
   */
  return function createEntityQueries(network) {
    const entities = Array.isArray(network?.entities) ? network.entities : [];
    const relations = Array.isArray(network?.relations) ? network.relations : [];
    const entityById = new Map(entities.map(entity => [entity.id, entity]));
    const relationById = new Map(relations.map(relation => [relation.id, relation]));

    function isFiniteYear(value) {
      return typeof value === 'number' && Number.isFinite(value);
    }

    function containsYear(time, year) {
      if (!time || !isFiniteYear(year)) return false;
      return (time.start === null || year >= time.start)
        && (time.end === null || year <= time.end);
    }

    function timeDistance(time, year) {
      if (containsYear(time, year)) return 0;
      if (time.start !== null && year < time.start) return time.start - year;
      if (time.end !== null && year > time.end) return year - time.end;
      return Number.POSITIVE_INFINITY;
    }

    function getEntity(entityId) {
      return entityById.get(entityId) || null;
    }

    function getRelation(relationId) {
      return relationById.get(relationId) || null;
    }

    function getEntityMomentAt(entityId, year) {
      const entity = getEntity(entityId);
      if (!entity || !isFiniteYear(year)) return null;
      return entity.moments
        .filter(moment => containsYear(moment.time, year))
        .sort((a, b) => (
          Math.abs(a.cursorYear - year) - Math.abs(b.cursorYear - year)
          || a.cursorYear - b.cursorYear
        ))[0] || null;
    }

    function getNearestEntityMoment(entityId, year) {
      const entity = getEntity(entityId);
      if (!entity?.moments?.length || !isFiniteYear(year)) return null;
      return [...entity.moments].sort((a, b) => (
        Math.abs(a.cursorYear - year) - Math.abs(b.cursorYear - year)
        || timeDistance(a.time, year) - timeDistance(b.time, year)
        || a.cursorYear - b.cursorYear
      ))[0] || null;
    }

    function orientEpisode(relation, episode, entityId) {
      const forward = relation.sourceId === entityId;
      const otherEntityId = forward ? relation.targetId : relation.sourceId;
      const currentEntity = getEntity(entityId);
      const otherEntity = getEntity(otherEntityId);
      const verb = forward
        ? episode.verb.forward
        : (episode.verb.reverse || episode.verb.forward);
      return {
        relationId: relation.id,
        episodeId: episode.id,
        sourceId: relation.sourceId,
        targetId: relation.targetId,
        type: relation.type,
        time: episode.time,
        verb,
        summary: episode.summary,
        detail: episode.detail || '',
        importance: Number.isFinite(episode.importance) ? episode.importance : 0,
        mapOverlay: episode.mapOverlay || null,
        sourceIds: [...(episode.sourceIds || [])],
        direction: forward ? 'forward' : 'reverse',
        otherEntityId,
        description: `${currentEntity?.name || entityId} → ${verb} → ${otherEntity?.name || otherEntityId}。${episode.summary}`,
        relation,
        episode
      };
    }

    function getActiveRelationEpisodes(entityId, year) {
      if (!entityById.has(entityId) || !isFiniteYear(year)) return [];
      return relations
        .filter(relation => relation.sourceId === entityId || relation.targetId === entityId)
        .flatMap(relation => relation.episodes
          .filter(episode => containsYear(episode.time, year))
          .map(episode => orientEpisode(relation, episode, entityId)))
        .sort((a, b) => (
          b.importance - a.importance
          || a.relationId.localeCompare(b.relationId)
          || a.episodeId.localeCompare(b.episodeId)
        ));
    }

    function getRelatedEntitiesAt(entityId, year) {
      const bestByEntity = new Map();
      getActiveRelationEpisodes(entityId, year).forEach(active => {
        if (!bestByEntity.has(active.otherEntityId)) {
          bestByEntity.set(active.otherEntityId, {
            entity: getEntity(active.otherEntityId),
            relation: active.relation,
            episode: active.episode,
            direction: active.direction,
            verb: active.verb,
            description: active.description
          });
        }
      });
      return [...bestByEntity.values()].filter(item => item.entity);
    }

    function getRelationEpisodeBetween(sourceId, targetId, year) {
      if (!entityById.has(sourceId) || !entityById.has(targetId) || !isFiniteYear(year)) return null;
      const matches = getActiveRelationEpisodes(sourceId, year)
        .filter(active => active.otherEntityId === targetId);
      return matches[0] || null;
    }

    function clampToTime(year, time) {
      if (time.start !== null && year < time.start) return time.start;
      if (time.end !== null && year > time.end) return time.end;
      if (isFiniteYear(year)) return year;
      if (time.start !== null) return time.start;
      if (time.end !== null) return time.end;
      return null;
    }

    function resolveEntityEntryYear(targetEntityId, currentYear, relationEpisode) {
      const entity = getEntity(targetEntityId);
      if (!entity?.moments?.length) return null;

      const episode = relationEpisode?.episode || relationEpisode || null;
      const relationTime = episode?.time || null;
      const withinEntity = isFiniteYear(currentYear)
        && (!entity.existence || containsYear(entity.existence, currentYear));
      const withinRelation = !relationTime || containsYear(relationTime, currentYear);
      let candidateYear = withinEntity && withinRelation ? currentYear : null;

      if (!isFiniteYear(candidateYear) && relationTime) {
        candidateYear = clampToTime(currentYear, relationTime);
      }
      if (!isFiniteYear(candidateYear)) {
        candidateYear = entity.moments[0].cursorYear;
      }

      return getNearestEntityMoment(targetEntityId, candidateYear)?.cursorYear ?? null;
    }

    return Object.freeze({
      containsYear,
      getEntity,
      getRelation,
      getEntityMomentAt,
      getNearestEntityMoment,
      getActiveRelationEpisodes,
      getRelatedEntitiesAt,
      getRelationEpisodeBetween,
      resolveEntityEntryYear
    });
  };
}));
