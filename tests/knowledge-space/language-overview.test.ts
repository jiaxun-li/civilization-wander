import test from 'node:test';
import assert from 'node:assert/strict';
import { V6_KNOWLEDGE_SPACE_DATA as data } from '../../src/knowledge-space/adapters/v6-adapter.ts';
import { buildLanguageOverviewMarks, LANGUAGE_WRITING_DETAILS } from '../../src/knowledge-space/adapters/language-overview.ts';
import { projectRegionTimeSlice } from '../../src/knowledge-space/projection/index.ts';
import { layoutRegionTimeMarks } from '../../src/knowledge-space/layout/index.ts';
test('language overview caps identities per region and keeps full core evidence', () => {
  const overview = buildLanguageOverviewMarks(data.marks);
  assert.equal(overview.find(m => m.subjectRef.id === 'egyptian-hieratic')!.regionSegments.length, 0);
  assert.equal(data.marks.find(m => m.subjectRef.id === 'egyptian-hieratic')!.regionSegments.length, 1);
  const projection = projectRegionTimeSlice(overview, data.regions, { kind: 'region-time', conceptLayerId: 'languageAndKnowledge', timeWindow: {start:-3500,end:400,label:'sample',approximate:false} });
  const marks = layoutRegionTimeMarks(projection.marks, {separateBands:true});
  const rows = new Set(marks.map(m => m.regionId));
  for (const row of rows) {
    const members = marks.filter(m => m.regionId === row);
    for (const year of new Set(members.map(m => m.sourceMark.timeSpan.start))) {
      const active = members.filter(m => m.sourceMark.timeSpan.start <= year && m.sourceMark.timeSpan.end >= year);
      assert.ok(new Set(active.filter(m => m.markKind === 'trace').map(m => m.sourceMark.subjectRef.id)).size <= 1);
      assert.ok(new Set(active.filter(m => m.markKind === 'crayonStrip').map(m => m.sourceMark.subjectRef.id)).size <= 2);
    }
    for (const m of members) {
      assert.equal(m.trackSegments.length, 1);
      assert.equal(m.trackSegments[0]!.laneCount, 3);
      if(m.markKind === 'trace') assert.equal(m.trackSegments[0]!.laneIndex, 2);
    }
  }
});

test('regional expansion keeps representative scripts and preserves alternatives in details', () => {
  const marks = buildLanguageOverviewMarks(data.marks);
  const subjectsAt = (region: string) => [...new Set(marks.filter(m => m.conceptLayerId === 'languageAndKnowledge' && m.regionSegments.some(r => r.regionId === region)).map(m => m.subjectRef.id))].sort();
  for (const [region, ids] of Object.entries({
    'greek-mainland': ['greek-language', 'linear-b', 'greek-alphabet'],
    'crete': ['greek-language', 'linear-a', 'linear-b'],
    'central-anatolia': ['hittite-language', 'cuneiform'],
    'western-anatolia': ['lydian-language', 'lydian-alphabet'],
    'syria-northern-levant': ['phoenician-language', 'aramaic-language', 'phoenician-alphabet'],
    'southern-levant': ['hebrew-language', 'aramaic-language', 'cuneiform', 'paleo-hebrew-alphabet'],
    'iranian-plateau': ['elamite-language', 'old-persian-language', 'old-persian-cuneiform'],
    'central-mesopotamia': ['akkadian-language', 'cuneiform'],
    'upper-mesopotamia': ['akkadian-language', 'aramaic-language', 'aramaic-alphabet'],
    'north-china-plain': ['old-chinese-language', 'chinese-writing-system'],
    'middle-yellow-river': ['old-chinese-language', 'chinese-writing-system'],
    'south-asia-northwest': ['vedic-sanskrit-language'],
    'indus-basin': ['indus-sign-system']
  })) assert.deepEqual(subjectsAt(region), ids.sort(), region);
  assert.ok(data.marks.some(m => m.subjectRef.id === 'linear-b' && m.regionSegments.length));
  assert.ok(LANGUAGE_WRITING_DETAILS['greek-language']?.includes('linear-b'));
  for (const [id, scripts] of Object.entries(LANGUAGE_WRITING_DETAILS)) {
    assert.equal(data.entities.find(e => e.id === id)?.type, 'language');
    for (const script of scripts) assert.equal(data.entities.find(e => e.id === script)?.type, 'writingSystem');
  }
});

test('successive scripts share a lane without bridging the historical gap', () => {
  const overview = buildLanguageOverviewMarks(data.marks);
  const projection = projectRegionTimeSlice(overview, data.regions, {kind:'region-time',conceptLayerId:'languageAndKnowledge',timeWindow:{start:-3500,end:400,label:'test',approximate:false}});
  const laidOut = layoutRegionTimeMarks(projection.marks,{separateBands:true});
  for (const [region, first, second] of [['greek-mainland','linear-b','greek-alphabet'],['crete','linear-a','linear-b'],['southern-levant','cuneiform','paleo-hebrew-alphabet']]) {
    const earlier = laidOut.find(m => m.regionId === region && m.sourceMark.subjectRef.id === first)!;
    const later = laidOut.find(m => m.regionId === region && m.sourceMark.subjectRef.id === second)!;
    assert.equal(earlier.trackSegments[0]!.laneIndex, 2);
    assert.equal(later.trackSegments[0]!.laneIndex, 2);
    assert.ok(earlier.trackSegments[0]!.end < later.trackSegments[0]!.start);
    assert.equal(earlier.trackSegments[0]!.end, earlier.xEnd);
    assert.equal(later.trackSegments[0]!.start, later.xStart);
  }
});

test('concurrency budget rejects simultaneous scripts but accepts successive language identities', () => {
  const script = data.marks.find(m => m.subjectRef.id === 'linear-b')!;
  assert.throws(() => buildLanguageOverviewMarks([...data.marks, {...script, id:'overlapping-script',subjectRef:{kind:'entity',id:'overlapping-script'}}]), /needs editorial review/);
  const language = data.marks.find(m => m.subjectRef.id === 'greek-language')!;
  const extra = [-3000,-2600,-2200].map((start,i) => ({...language,id:`test-language-${i}`,subjectRef:{kind:'entity' as const,id:`test-language-${i}`},timeSpan:{...language.timeSpan,start,end:start+100}}));
  const overview = buildLanguageOverviewMarks([...data.marks,...extra]);
  const projection = projectRegionTimeSlice(overview,data.regions,{kind:'region-time',conceptLayerId:'languageAndKnowledge',timeWindow:{start:-3500,end:400,label:'test',approximate:false}});
  const laidOut = layoutRegionTimeMarks(projection.marks,{separateBands:true});
  assert.ok(laidOut.filter(m => m.sourceMark.subjectRef.id.startsWith('test-language-')).every(m => m.trackSegments[0]!.laneIndex < 2 && m.trackSegments[0]!.laneCount === 3));
  assert.throws(() => buildLanguageOverviewMarks([...data.marks,...extra.map(m => ({...m,timeSpan:language.timeSpan}))]), /needs editorial review/);
});
