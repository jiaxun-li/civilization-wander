'use strict';

// One-time, idempotent schema migration for the five modules listed below.
// It converts V4 fields and installs the reviewed Scene-to-Event mappings; it
// is not a replay log for later editorial or presentation cleanup. Mesopotamia
// and Aegean were migrated directly and are intentionally outside this list.

const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const moduleNames = [
  'ancient-egypt',
  'ancient-india',
  'ancient-china',
  'late-bronze-age',
  'iron-age-near-east'
];

const eventKinds = {
  'event-old-kingdom-fragmentation': 'historicalProcess',
  'event-middle-kingdom-reunification': 'historicalProcess',
  'event-middle-kingdom-fragmentation': 'historicalProcess',
  'event-ahmose-captures-avaris': 'historicalEvent',
  'event-amarna-reform': 'historicalProcess',
  'event-battle-of-kadesh': 'historicalEvent',
  'event-egypt-hatti-treaty': 'historicalEvent',
  'event-new-kingdom-fragmentation': 'historicalProcess',
  'event-khufu-great-pyramid-construction': 'historicalProcess',
  'event-unas-pyramid-text-inscription': 'historicalEvent',
  'event-steppe-related-ancestry-enters-south-asia': 'historicalProcess',
  'event-rigveda-composed-transmitted': 'textualTradition',
  'event-indus-mesopotamia-exchange': 'historicalProcess',
  'event-indus-urban-transformation': 'historicalProcess',
  'event-western-zhou-eastern-expansion': 'historicalProcess',
  'event-western-zhou-investiture': 'historicalProcess',
  'event-western-zhou-capitals-fall': 'historicalEvent',
  'event-erlitou-urban-consolidation': 'historicalProcess',
  'event-erligang-urban-expansion': 'historicalProcess',
  'event-late-shang-royal-divination': 'historicalProcess',
  'event-fu-hao-activities': 'historicalProcess',
  'event-zhou-conquest-of-shang': 'historicalEvent',
  'event-sanxingdui-ritual-object-deposition': 'historicalEvent',
  'event-hittite-sack-babylon': 'historicalEvent',
  'event-hittite-syrian-expansion': 'historicalProcess',
  'event-hittite-ugarit-treaty': 'historicalEvent',
  'event-hittite-central-kingdom-ends': 'historicalProcess',
  'event-ugarit-destruction': 'historicalEvent',
  'event-ramesses-iii-northern-invasions': 'historicalEvent',
  'event-neo-assyrian-expansion': 'historicalProcess',
  'event-nineveh-falls': 'historicalEvent',
  'event-phoenician-westward-connections': 'historicalProcess',
  'event-israel-falls-to-assyria': 'historicalProcess',
  'event-lachish-captured': 'historicalEvent',
  'event-aramaic-enters-imperial-administration': 'historicalProcess',
  'event-neo-babylonian-western-campaigns': 'historicalProcess',
  'event-persia-conquers-babylon': 'historicalEvent',
  'event-lydian-coinage-emerges': 'historicalProcess',
  'event-persia-conquers-sardis': 'historicalEvent',
  'event-extractive-iron-metallurgy-develops': 'historicalProcess',
  'event-iron-use-expands-after-palaces': 'historicalProcess',
  'event-cast-iron-develops-in-china': 'historicalProcess'
};

const sceneEventIds = new Map();
function assign(sceneIds, eventIds) {
  sceneIds.forEach(sceneId => {
    if (sceneEventIds.has(sceneId)) throw new Error(`duplicate Scene mapping ${sceneId}`);
    sceneEventIds.set(sceneId, eventIds);
  });
}

assign(['mohenjo-daro-partial-city', 'mohenjo-daro-neighborhood-wells', 'mohenjo-daro-water-leaves-home', 'mohenjo-daro-great-bath', 'mohenjo-daro-unnamed-managers'], ['event-indus-urban-transformation']);
assign(['indus-shared-measures', 'indus-seals-image-and-signs', 'indus-short-unread-script', 'indus-carnelian-goes-west', 'indus-meluhha-ships'], ['event-indus-mesopotamia-exchange']);
assign(['indus-network-changes-shape', 'indo-aryan-cities-change-first', 'indo-aryan-local-settlements'], ['event-indus-urban-transformation']);
assign(['indo-aryan-steppe-groups-move-south', 'indo-aryan-language-enters-northwest'], ['event-steppe-related-ancestry-enters-south-asia']);
assign(['indo-aryan-poets-sing-rivers-fire'], ['event-rigveda-composed-transmitted']);
assign(['indo-aryan-new-society-forms'], ['event-steppe-related-ancestry-enters-south-asia', 'event-rigveda-composed-transmitted']);

assign(['western-zhou-muye-victory'], ['event-zhou-conquest-of-shang']);
assign(['western-zhou-eastern-center', 'western-zhou-allies-regional-centers'], ['event-western-zhou-eastern-expansion']);
assign(['western-zhou-command-cast-in-ding', 'western-zhou-rites-and-armies'], ['event-western-zhou-investiture']);
assign(['western-zhou-capital-falls'], ['event-western-zhou-capitals-fall']);
assign(['china-bronze-before-bronze'], ['event-early-china-regional-centers-emerge']);
assign(['china-bronze-materials-fire'], ['event-shang-bronze-production-and-ritual-use']);
assign(['china-bronze-erlitou-center'], ['event-erlitou-urban-consolidation']);
assign(['china-bronze-shang-cities', 'shang-civilization-forms-between-cities'], ['event-erligang-urban-expansion']);
assign(['china-bronze-ancestors-records'], ['event-late-shang-royal-divination', 'event-shang-bronze-production-and-ritual-use']);
assign(['china-bronze-sanxingdui-world'], ['event-sanxingdui-ritual-object-deposition']);
assign(['china-bronze-zhou-changes'], ['event-zhou-conquest-of-shang']);
assign(['erlitou-roads-cross-city', 'erlitou-enclosed-center', 'erlitou-rare-materials-workshop', 'erlitou-objects-enter-burials', 'erlitou-xia-name-absent'], ['event-erlitou-urban-consolidation']);
assign(['shang-dead-remain-in-family', 'shang-meal-for-ancestors', 'shang-when-bone-cracks', 'shang-war-enters-sacrifice', 'shang-people-beyond-royal-house'], ['event-late-shang-royal-divination']);
assign(['shang-fu-hao-two-records'], ['event-fu-hao-activities']);
assign(['shang-last-king-story-spreads'], ['event-zhou-conquest-of-shang']);
assign(['shang-oracle-fire-opens-bone', 'shang-oracle-divination-becomes-record', 'shang-oracle-question-repeated', 'shang-oracle-ancestors-calendar', 'shang-oracle-royal-questions-survive'], ['event-late-shang-royal-divination']);
assign(['shang-bronze-materials-reach-workshop', 'shang-bronze-clay-mould-shapes-vessel', 'shang-bronze-vessels-form-feast', 'shang-bronze-mask-and-name', 'shang-bronze-follows-owner-to-tomb'], ['event-shang-bronze-production-and-ritual-use']);
assign(['sanxingdui-pits-beneath-city', 'sanxingdui-bronze-faces-watch', 'sanxingdui-people-tree-birds', 'sanxingdui-materials-meet', 'sanxingdui-ritual-world-is-buried'], ['event-sanxingdui-ritual-object-deposition']);

assign(['ancient-egypt-two-lands', 'egypt-old-two-lands'], ['event-upper-lower-egypt-unified']);
assign(['ancient-egypt-river-returns'], ['event-nile-annual-cycle-organizes-life']);
assign(['ancient-egypt-pyramid-kingdom'], ['event-old-kingdom-pyramid-complexes-develop', 'event-khufu-great-pyramid-construction']);
assign(['ancient-egypt-visible-identity'], ['event-egyptian-formal-art-conventions-persist', 'event-egyptian-writing-system-changes']);
assign(['ancient-egypt-dead-needs'], ['event-egyptian-funerary-texts-and-rituals-expand']);
assign(['ancient-egypt-reunifications'], ['event-old-kingdom-fragmentation', 'event-middle-kingdom-reunification', 'event-middle-kingdom-fragmentation']);
assign(['ancient-egypt-power-far-away'], ['event-ahmose-captures-avaris', 'event-amarna-diplomatic-correspondence-operates']);
assign(['ancient-egypt-survives-palaces'], ['event-new-kingdom-fragmentation']);
assign(['egypt-old-pyramids-horizon', 'egypt-old-officials'], ['event-old-kingdom-pyramid-complexes-develop']);
assign(['egypt-old-afterlife-road'], ['event-unas-pyramid-text-inscription', 'event-egyptian-funerary-texts-and-rituals-expand']);
assign(['egypt-old-north-south'], ['event-old-kingdom-fragmentation']);
assign(['egypt-middle-thebes-reunifies'], ['event-middle-kingdom-reunification']);
assign(['egypt-middle-sinuhe-home'], ['event-sinuhe-story-composed-and-copied']);
assign(['egypt-middle-avaris'], ['event-middle-kingdom-fragmentation']);
assign(['egypt-new-ahmose-avaris'], ['event-ahmose-captures-avaris']);
assign(['egypt-new-hatshepsut'], ['event-hatshepsut-rules-as-pharaoh']);
assign(['egypt-new-beyond-borders', 'egypt-new-amarna-letters'], ['event-amarna-diplomatic-correspondence-operates']);
assign(['egypt-new-akhenaten-city'], ['event-amarna-reform']);
assign(['egypt-new-kadesh'], ['event-battle-of-kadesh']);
assign(['egypt-new-contraction'], ['event-new-kingdom-fragmentation']);
assign(['egypt-pyramid-stone-grows', 'egypt-pyramid-sneferu-three', 'egypt-pyramid-whole-complex'], ['event-old-kingdom-pyramid-complexes-develop']);
assign(['egypt-pyramid-merer-boats', 'egypt-pyramid-workers-city', 'egypt-pyramid-feeding-city', 'egypt-pyramid-cult-continues'], ['event-khufu-great-pyramid-construction']);
assign(['egypt-pyramid-walls-speak'], ['event-unas-pyramid-text-inscription']);
assign(['egypt-afterlife-wah-wrapped', 'egypt-afterlife-many-parts', 'egypt-afterlife-offerings-continue', 'egypt-afterlife-pyramid-spells', 'egypt-afterlife-coffin-texts', 'egypt-afterlife-travel-guide', 'egypt-afterlife-gods-on-road', 'egypt-afterlife-heart-trial', 'egypt-afterlife-field-work'], ['event-egyptian-funerary-texts-and-rituals-expand']);
assign(['egypt-art-images-work', 'egypt-art-composite-body', 'egypt-art-size-status', 'egypt-art-statues-live', 'egypt-art-abu-simbel-scale'], ['event-egyptian-formal-art-conventions-persist']);
assign(['egypt-art-hatshepsut-pharaoh'], ['event-egyptian-formal-art-conventions-persist', 'event-hatshepsut-rules-as-pharaoh']);
assign(['egypt-art-amarna-motion'], ['event-egyptian-formal-art-conventions-persist', 'event-amarna-reform']);
assign(['egypt-hieroglyph-narmer-name', 'egypt-hieroglyph-word-sound', 'egypt-hieroglyph-silent-guides', 'egypt-hieroglyph-stone-papyrus', 'egypt-hieroglyph-language-changes', 'egypt-hieroglyph-alphabet-road'], ['event-egyptian-writing-system-changes']);

assign(['hittite-hattusa-center'], ['event-hittite-central-kingship-consolidates']);
assign(['hittite-throne-crises'], ['event-hittite-sack-babylon', 'event-hittite-central-kingship-consolidates']);
assign(['hittite-syria-princes'], ['event-hittite-syrian-expansion']);
assign(['hittite-kings-treaty'], ['event-hittite-ugarit-treaty']);
assign(['hittite-carchemish-supervision'], ['event-battle-of-kadesh', 'event-egypt-hatti-treaty']);
assign(['hittite-network-ends'], ['event-hittite-central-kingdom-ends']);
assign(['ugarit-old-city-kingdom', 'ugarit-port-inland', 'ugarit-merchants-palace', 'ugarit-scribes-languages'], ['event-ugarit-palace-port-network-operates']);
assign(['ugarit-treaty-tribute'], ['event-hittite-ugarit-treaty', 'event-ugarit-palace-port-network-operates']);
assign(['ugarit-destruction-layer'], ['event-ugarit-destruction']);
assign(['kadesh-two-powers-meet', 'kadesh-false-message', 'kadesh-chariots-camp', 'kadesh-city-not-taken', 'kadesh-temple-victory'], ['event-battle-of-kadesh']);
assign(['kadesh-treaty-later'], ['event-battle-of-kadesh', 'event-egypt-hatti-treaty']);
assign(['amarna-letters-remain', 'amarna-shared-writing', 'amarna-kings-brothers', 'amarna-gifts-repeat-friendship', 'amarna-small-kings-write', 'amarna-diplomacy-routine'], ['event-amarna-diplomatic-correspondence-operates']);
assign(['amarna-palaces-stop-replying'], ['event-amarna-diplomatic-correspondence-operates', 'event-hittite-central-kingdom-ends', 'event-ugarit-destruction']);
assign(['medinet-habu-temple-record', 'medinet-habu-delta-battle', 'medinet-habu-families-carts', 'medinet-habu-king-order', 'medinet-habu-egypt-contracts'], ['event-ramesses-iii-northern-invasions']);
assign(['palaces-connect-kingdoms', 'palaces-archaeologists-causes'], ['event-hittite-central-kingdom-ends', 'event-ugarit-destruction', 'event-mycenaean-palaces-end', 'event-ramesses-iii-northern-invasions']);
assign(['palaces-hattusa-silent'], ['event-hittite-central-kingdom-ends']);
assign(['palaces-ugarit-tablets-stop'], ['event-ugarit-destruction']);
assign(['palaces-aegean-writing-stops'], ['event-mycenaean-palaces-end']);
assign(['palaces-egypt-holds'], ['event-ramesses-iii-northern-invasions']);
assign(['palaces-life-reorganizes'], ['event-aegean-localizes-after-palaces']);

assign(['iron-first-falls-from-sky'], ['event-meteoric-iron-prestige-use']);
assign(['iron-bloom-leaves-furnace', 'iron-hittite-court-smiths'], ['event-extractive-iron-metallurgy-develops']);
assign(['iron-workshops-after-palaces', 'iron-blooms-travel-by-sea', 'iron-assyrian-armies-building'], ['event-iron-use-expands-after-palaces']);
assign(['iron-south-asia-regional-paths'], ['event-extractive-iron-metallurgy-develops', 'event-iron-use-expands-after-palaces']);
assign(['iron-china-casts-metal'], ['event-cast-iron-develops-in-china']);
assign(['assyria-merchants-before-empire'], ['event-old-assyrian-trade-networks']);
assign(['assyria-kings-prove-through-war', 'assyria-rebellion-sees-consequences', 'assyria-conquest-becomes-government', 'assyria-people-moved-elsewhere'], ['event-neo-assyrian-expansion']);
assign(['assyria-nineveh-collects-knowledge'], ['event-ashurbanipal-collections-assembled']);
assign(['assyria-violent-city-silenced'], ['event-nineveh-falls']);
assign(['phoenicia-four-coastal-kings', 'phoenicia-cargo-many-hands', 'phoenicia-islands-link-voyage', 'phoenicia-beyond-mediterranean-gate', 'phoenicia-ships-bring-tribute', 'phoenicia-distant-ports-centres'], ['event-phoenician-westward-connections']);
assign(['israel-jacob-gets-another-name'], ['event-jacob-renamed-israel-tradition']);
assign(['israel-one-tradition-two-capitals'], ['event-israel-and-judah-develop-separate-kingships']);
assign(['israel-enters-and-falls-to-assyria'], ['event-israel-falls-to-assyria']);
assign(['judah-lachish-falls-jerusalem-remains'], ['event-lachish-captured']);
assign(['judah-babylon-twice-enters-jerusalem'], ['event-neo-babylonian-western-campaigns']);
assign(['judah-people-continue-two-places'], ['event-judean-communities-continue-after-exile']);
assign(['aramaic-small-states-one-language', 'aramaic-conquest-moves-speakers', 'aramaic-two-scribes-one-palace', 'aramaic-outlives-empires'], ['event-aramaic-enters-imperial-administration']);
assign(['babylon-city-refuses-submission'], ['event-babylon-destroyed-and-rebuilt-under-assyria']);
assign(['babylon-war-continues-west'], ['event-nineveh-falls', 'event-neo-babylonian-western-campaigns']);
assign(['babylon-colored-bricks-stage-capital', 'babylon-king-name-in-bricks', 'babylon-empire-enters-households'], ['event-nebuchadnezzar-rebuilds-babylon']);
assign(['babylon-conqueror-borrows-language'], ['event-persia-conquers-babylon']);
assign(['lydia-roads-gold-kingship-sardis', 'lydia-mark-makes-alloy-speak', 'lydia-croesus-separates-gold-silver'], ['event-lydian-coinage-emerges']);
assign(['lydia-kingdom-falls-mint-continues'], ['event-persia-conquers-sardis', 'event-lydian-coinage-emerges']);

function replaceRange(source, start, end, replacement) {
  return source.slice(0, start) + replacement + source.slice(end);
}

function declarationPosition(source, id) {
  const marker = `id: '${id}'`;
  const position = source.indexOf(marker);
  if (position < 0) throw new Error(`cannot find declaration for ${id}`);
  return position;
}

function removePropertyNearDeclaration(source, id, propertyName, boundaryName) {
  const declaration = declarationPosition(source, id);
  const boundary = source.indexOf(boundaryName, declaration);
  const property = source.indexOf(`${propertyName}:`, declaration);
  if (property < 0 || property > boundary) return source;
  const arrayEnd = source.indexOf('],', property);
  const stringEnd = source.indexOf("',", property);
  const end = propertyName === 'eventIds' ? arrayEnd + 2 : stringEnd + 2;
  if (end <= property) throw new Error(`cannot parse ${propertyName} on ${id}`);
  let next = end;
  while (source[next] === ' ' || source[next] === '\t') next += 1;
  return replaceRange(source, property, next, '');
}

function addEventKind(source, eventId, kind) {
  const declaration = declarationPosition(source, eventId);
  const idEnd = source.indexOf(',', declaration);
  const title = source.indexOf('title:', declaration);
  if (idEnd < 0 || title < 0) throw new Error(`cannot parse Event ${eventId}`);
  if (source.slice(idEnd, title).includes('kind:')) return source;
  return replaceRange(source, idEnd + 1, idEnd + 1, ` kind: '${kind}',`);
}

function addSceneEventIds(source, sceneId, eventIds) {
  const declaration = declarationPosition(source, sceneId);
  const contentBlocks = source.indexOf('contentBlocks:', declaration);
  if (contentBlocks < 0) throw new Error(`cannot find contentBlocks for ${sceneId}`);
  if (source.slice(declaration, contentBlocks).includes('eventIds:')) return source;
  const timeSpan = source.indexOf('timeSpan:', declaration);
  if (timeSpan < 0 || timeSpan > contentBlocks) throw new Error(`cannot find timeSpan for ${sceneId}`);
  const timeSpanEnd = source.indexOf('),', timeSpan);
  if (timeSpanEnd < 0 || timeSpanEnd > contentBlocks) throw new Error(`cannot parse timeSpan for ${sceneId}`);
  const literal = `[${eventIds.map(id => `'${id}'`).join(', ')}]`;
  return replaceRange(source, timeSpanEnd + 2, timeSpanEnd + 2, ` eventIds: ${literal},`);
}

for (const moduleName of moduleNames) {
  const modulePath = path.join(projectRoot, 'data', `${moduleName}.js`);
  const moduleData = require(modulePath);
  let source = fs.readFileSync(modulePath, 'utf8');

  for (const entity of moduleData.entities) {
    source = removePropertyNearDeclaration(source, entity.id, 'defaultCardId', 'sourceIds:');
  }
  for (const event of moduleData.events) {
    const kind = event.kind || eventKinds[event.id];
    if (!kind) throw new Error(`missing Event kind migration for ${event.id}`);
    source = addEventKind(source, event.id, kind);
  }
  for (const card of moduleData.cards) {
    source = removePropertyNearDeclaration(source, card.id, 'eventIds', 'title:');
  }
  for (const scene of moduleData.scenes) {
    const eventIds = sceneEventIds.get(scene.id);
    if (!eventIds || eventIds.length === 0) throw new Error(`missing Scene Event migration for ${scene.id}`);
    source = addSceneEventIds(source, scene.id, eventIds);
  }

  fs.writeFileSync(modulePath, source, 'utf8');
}

console.log(`Migrated ${moduleNames.length} content modules and ${sceneEventIds.size} explicit Scene mappings to V5.`);
