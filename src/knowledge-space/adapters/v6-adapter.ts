import type { Source, SourceId } from '../../../v6/schema/index.ts';
import { CONCEPT_LAYERS, REGIONS, V6_SOURCES } from '../../../v6/catalogs/index.ts';
import { V6_MODULE_REGISTRY } from '../../../v6/module-registry.ts';
import { buildKnowledgeSpaceMarks } from '../model/index.ts';
import { REVIEWED_PRESENCE_PROFILES } from './presence-profiles.ts';
import { REVIEWED_EVENT_DESCRIPTIONS } from './event-descriptions.ts';
import { LANGUAGE_DESCRIPTIONS, languageUsageClaims } from './language-descriptions.ts';
import { WRITING_DESCRIPTIONS, writingClaims } from './writing-descriptions.ts';
import { POLITICAL_DESCRIPTIONS, politicalClaims } from './political-descriptions.ts';

const modules = V6_MODULE_REGISTRY.map((entry) => entry.data);
const entities = modules.flatMap((module) => [...module.entities]);
const entityPhases = modules.flatMap((module) => [...module.entityPhases]);
const events = modules.flatMap((module) => [...module.events]);

function collectPreviewSourceIds(): readonly SourceId[] {
  const ids = new Set<SourceId>();
  const include = (sourceIds: readonly SourceId[]) => sourceIds.forEach((id) => ids.add(id));

  REGIONS.forEach((region) => include(region.sourceIds));
  entities.forEach((entity) => include(entity.sourceIds));
  entityPhases.forEach((phase) => {
    include(phase.sourceIds);
    phase.regions.forEach((region) => include(region.sourceIds));
  });
  events.forEach((event) => {
    include(event.sourceIds);
    include(event.editorialReview.sourceIds);
    event.regions.forEach((region) => include(region.sourceIds));
    event.participants.forEach((participant) => include(participant.sourceIds));
    event.evidence.forEach((evidence) => include(evidence.sourceIds));
  });

  return [...ids].sort();
}

const sourceById = new Map<string, Source>(V6_SOURCES.map(source => [source.id, source]));
const previewSources: readonly Source[] = collectPreviewSourceIds().map((id) => {
  const source = sourceById.get(id);
  if (!source) throw new Error(`V6 preview references missing source ${id}`);
  return source;
});

for (const entity of entities.filter(entity => entity.type === 'language')) {
  const description = LANGUAGE_DESCRIPTIONS[entity.id];
  if (!description) throw new Error(`Language needs a reviewed usage description: ${entity.id}`);
  for (const claim of languageUsageClaims(description)) {
    if (!claim.text.trim() || !claim.sourceIds.length || claim.sourceIds.some(id => !(entity.sourceIds as readonly string[]).includes(id))) {
      throw new Error(`Language usage sources must belong to ${entity.id}`);
    }
  }
}

for (const entity of entities.filter(entity => entity.type === 'writingSystem')) {
  const description = WRITING_DESCRIPTIONS[entity.id];
  if (!description) throw new Error(`Writing system needs a reviewed description: ${entity.id}`);
  for (const claim of writingClaims(description)) {
    if (!claim.text.trim() || !claim.sourceIds.length || claim.sourceIds.some(id => !(entity.sourceIds as readonly string[]).includes(id))) {
      throw new Error(`Writing description sources must belong to ${entity.id}`);
    }
  }
}

for (const event of events) {
  const description = REVIEWED_EVENT_DESCRIPTIONS[event.id];
  if (!description?.text.trim() || !event.evidence.some(claim => claim.v5ClaimBlockId === description.v5ClaimBlockId)) {
    throw new Error(`V6 preview needs reviewed public evidence for ${event.id}`);
  }
  const evidence = event.evidence.find(claim => claim.v5ClaimBlockId === description.v5ClaimBlockId)!;
  if (!description.sourceIds.length || description.sourceIds.some(id => !evidence.sourceIds.includes(id))) {
    throw new Error(`V6 preview description sources must match evidence for ${event.id}`);
  }
}

for (const entity of entities.filter(entity => entity.conceptLayerId === 'polityAndSociety' && entity.phaseIds.length)) {
  const description = POLITICAL_DESCRIPTIONS[entity.id];
  if (!description) throw new Error(`Political subject needs a reviewed description: ${entity.id}`);
  if (entity.phaseIds.length !== Object.keys(description.phases).length || entity.phaseIds.some(id => !description.phases[id])) {
    throw new Error(`Political description phases are stale: ${entity.id}`);
  }
  const linkedEvents = (description.events ?? []).map(row => {
    const event = events.find(event => event.id === row.eventId);
    if (!event?.participants.some(participant => participant.entityId === entity.id)) {
      throw new Error(`Political history row needs a participating Event: ${entity.id}/${row.eventId}`);
    }
    return event;
  });
  const allowedSources = new Set([
    ...entity.sourceIds,
    ...entityPhases.filter(phase => phase.entityId === entity.id).flatMap(phase => phase.sourceIds),
    ...linkedEvents.flatMap(event => event.sourceIds)
  ]);
  for (const claim of politicalClaims(description)) {
    if (!claim.text.trim() || !claim.sourceIds.length || claim.sourceIds.some(id => !allowedSources.has(id) || !sourceById.has(id))) {
      throw new Error(`Political description sources must belong to ${entity.id}`);
    }
  }
}

export const V6_KNOWLEDGE_SPACE_DATA = Object.freeze({
  conceptLayers: CONCEPT_LAYERS,
  regions: REGIONS,
  entities,
  entityPhases,
  events,
  sources: previewSources,
  eventDescriptions: REVIEWED_EVENT_DESCRIPTIONS,
  languageDescriptions: LANGUAGE_DESCRIPTIONS,
  writingDescriptions: WRITING_DESCRIPTIONS,
  politicalDescriptions: POLITICAL_DESCRIPTIONS,
  presenceProfiles: REVIEWED_PRESENCE_PROFILES,
  marks: buildKnowledgeSpaceMarks({
    sources: previewSources,
    regions: REGIONS,
    entities,
    entityPhases,
    events
  }, REVIEWED_PRESENCE_PROFILES)
});
