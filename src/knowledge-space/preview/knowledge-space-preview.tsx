import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ConceptLayerId, Entity, EntityPhase, RegionalAssociation, RegionalRole } from '../../../v6/schema/index.ts';
import { V6_KNOWLEDGE_SPACE_DATA } from '../adapters/index.ts';
import { buildPolityOverviewMarks } from '../adapters/polity-overview.ts';
import { buildLanguageOverviewMarks } from '../adapters/language-overview.ts';
import { subjectColor } from './subject-colors.ts';
import { layoutRegionTimeMarks, type LaidOutRegionTimeMark } from '../layout/index.ts';
import { projectRegionTimeSlice } from '../projection/index.ts';
import {
  KnowledgeSpaceSvg,
  type KnowledgeSpaceHoverPoint,
  type KnowledgeSpaceSelection
} from '../renderers/svg/index.ts';

interface TimeWindow {
  readonly start: number;
  readonly end: number;
}

const DEFAULT_CONCEPT_LAYER: ConceptLayerId = 'polityAndSociety';
const OVERVIEW_MARKS = buildLanguageOverviewMarks(buildPolityOverviewMarks(V6_KNOWLEDGE_SPACE_DATA.marks));
const MINIMUM_WINDOW_YEARS = 80;
const MINIMUM_NODE_FOOTPRINT = 0.018;
const EXPANDED_REGIONS_STORAGE_KEY = 'civilization-wander:v6-preview:expanded-regions';

function formatYear(year: number): string {
  if (year < 0) return `公元前${Math.abs(Math.round(year))}年`;
  return `公元${Math.round(year)}年`;
}

function formatWindow(window: TimeWindow): string {
  return `${formatYear(window.start)} — ${formatYear(window.end)}`;
}

function deriveDomain(): TimeWindow {
  const starts = V6_KNOWLEDGE_SPACE_DATA.marks.map((mark) => mark.timeSpan.start);
  const ends = V6_KNOWLEDGE_SPACE_DATA.marks.map((mark) => mark.timeSpan.end);
  const start = Math.floor(Math.min(...starts) / 100) * 100;
  const end = Math.ceil(Math.max(...ends) / 100) * 100;
  return start === end ? { start: start - 50, end: end + 50 } : { start, end };
}

function clampWindow(window: TimeWindow, domain: TimeWindow): TimeWindow {
  const domainDuration = domain.end - domain.start;
  const duration = Math.min(domainDuration, window.end - window.start);
  if (duration >= domainDuration) return domain;
  let start = window.start;
  if (start < domain.start) start = domain.start;
  if (start + duration > domain.end) start = domain.end - duration;
  return { start, end: start + duration };
}

function readExpandedRegionIds(): ReadonlySet<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const value = JSON.parse(window.localStorage.getItem(EXPANDED_REGIONS_STORAGE_KEY) ?? '[]');
    return new Set(Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []);
  } catch {
    return new Set();
  }
}

interface HoverState {
  readonly marks: readonly LaidOutRegionTimeMark[];
  readonly point: KnowledgeSpaceHoverPoint;
}

const REGION_ROLE_LABELS: Record<RegionalRole, string> = {
  core: '核心地区', controlled: '控制地区', influence: '影响范围',
  exchange: '交流往来', origin: '起源地区', associated: '相关地域', attested: '材料见证'
};

function SourceLinks({ ids, mergeUrls = false }: {
  readonly ids: readonly string[];
  readonly mergeUrls?: boolean;
}): ReactNode {
  const records = [...new Set(ids)].map(id => V6_KNOWLEDGE_SPACE_DATA.sources.find(source => source.id === id)!);
  const sources = mergeUrls
    ? [...new Map(records.map(source => [source.url || source.id, source])).values()]
    : records;
  if (sources.length === 0) return null;
  return (
    <details className="ks-detail-sources">
      <summary>来源（{sources.length}）</summary>
      <ul>
        {sources.map(source => (
          <li key={source.id}>
            {source.url && /^https?:\/\//i.test(source.url)
              ? <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
              : <span>{source.title}</span>}
            <small>{[source.author, source.publisher, source.year].filter(Boolean).join(' · ')}</small>
          </li>
        ))}
      </ul>
    </details>
  );
}

function RegionDetails({ regions, names }: {
  readonly regions: readonly RegionalAssociation[];
  readonly names: ReadonlyMap<string, string>;
}): ReactNode {
  return <div className="ks-detail-regions">{regions.map(region => (
    <p key={region.regionId}>
      {names.get(region.regionId)} <span>· {REGION_ROLE_LABELS[region.role]}{region.approximate ? '（约略）' : ''}</span>
    </p>
  ))}</div>;
}

function LanguageWritingDetails({ entity, phases, regionNames }: {
  readonly entity: Entity;
  readonly phases: readonly EntityPhase[];
  readonly regionNames: ReadonlyMap<string, string>;
}): ReactNode {
  const usage = V6_KNOWLEDGE_SPACE_DATA.languageDescriptions[entity.id]!;
  const writing = entity.type === 'writingSystem'
    ? V6_KNOWLEDGE_SPACE_DATA.writingDescriptions[entity.id]!
    : undefined;
  const usageTitle = writing ? '书写与用途' : '谁在使用';
  const rows = [...new Map(phases.flatMap(phase => phase.regions.map(region => [
    `${region.regionId}:${phase.timeSpan.start}:${phase.timeSpan.end}:${phase.timeSpan.approximate}`,
    { regionId: region.regionId, time: phase.timeSpan.label, start: phase.timeSpan.start! }
  ] as const))).values()].sort((a, b) => a.start - b.start);
  const sourceIds = [...entity.sourceIds, ...phases.flatMap(phase => [
    ...phase.sourceIds, ...phase.regions.flatMap(region => region.sourceIds)
  ])];
  return <div data-language-details={writing ? undefined : true} data-writing-details={writing ? true : undefined}>
    <section className="ks-detail-overview" aria-label="简介"><p>{entity.canonicalSummary}</p></section>
    <section className="ks-language-detail-block" aria-label="时间与地域">
      <h3>时间与地域</h3>
      <table className="ks-language-regions">
        <thead><tr><th scope="col">地区</th><th scope="col">图中时段</th></tr></thead>
        <tbody>{rows.map(row => <tr key={`${row.regionId}:${row.time}`}>
          <th scope="row">{regionNames.get(row.regionId)}</th><td>{row.time}</td>
        </tr>)}</tbody>
      </table>
    </section>
    <section className="ks-language-detail-block" aria-label={usageTitle}>
      <h3>{usageTitle}</h3>
      <dl className="ks-language-usage">
        {writing ? <>
          <dt>记录语言</dt><dd>{writing.languages.text}</dd>
          <dt>书写载体</dt><dd>{writing.materials.text}</dd>
          <dt>主要用途</dt><dd>{writing.uses.text}</dd>
        </> : <>
        <dt>使用人群</dt><dd>{usage.people.text}</dd>
        <dt>使用场合</dt><dd>{usage.contexts.text}</dd>
        {usage.change ? <><dt>用途变化</dt><dd>{usage.change.text}</dd></> : null}
        </>}
      </dl>
    </section>
    <footer className="ks-language-detail-sources"><SourceLinks ids={sourceIds} mergeUrls /></footer>
  </div>;
}

function PoliticalDetails({ entity, phases }: {
  readonly entity: Entity;
  readonly phases: readonly EntityPhase[];
}): ReactNode {
  const description = V6_KNOWLEDGE_SPACE_DATA.politicalDescriptions[entity.id]!;
  const isCommunity = entity.type === 'community';
  const rangeTitle = isCommunity ? '分布与联系' : '范围变化';
  const organizationTitle = isCommunity ? '中心与组织' : '中心与制度';
  const rows = [
    ...phases.map(phase => ({
      id: phase.id, phaseId: phase.id, timeSpan: phase.timeSpan,
      ...description.phases[phase.id]!
    })),
    ...(description.events ?? []).map(row => ({
      id: row.eventId, phaseId: undefined,
      timeSpan: V6_KNOWLEDGE_SPACE_DATA.events.find(event => event.id === row.eventId)!.timeSpan,
      ...row
    }))
  ].sort((a, b) => a.timeSpan.start! - b.timeSpan.start!);
  const sourceIds = [
    ...entity.sourceIds, ...description.centres.sourceIds, ...description.core.sourceIds,
    ...description.governance.sourceIds,
    ...phases.flatMap(phase => [...phase.sourceIds, ...phase.regions.flatMap(region => region.sourceIds)]),
    ...rows.flatMap(row => [...row.scope.sourceIds, ...row.change.sourceIds])
  ];
  const shortYear = (year: number): string => year < 0 ? `前${-year}` : `${year}`;
  return <div data-political-details data-political-kind={isCommunity ? 'community' : 'polity'}>
    <section className="ks-detail-overview" aria-label="简介"><p>{entity.canonicalSummary}</p></section>
    <section className="ks-language-detail-block" aria-label={rangeTitle}>
      <h3>{rangeTitle}</h3>
      <table className="ks-language-regions ks-political-ranges">
        <thead><tr><th scope="col">时期</th><th scope="col">{isCommunity ? '分布与活动' : '范围与变化'}</th></tr></thead>
        <tbody>{rows.map(row => <tr key={row.id} data-selection-phase-id={row.phaseId} data-political-history-id={row.id}>
          <th scope="row">
            <span>{row.timeSpan.approximate ? '约' : ''}{shortYear(row.timeSpan.start!)}</span>
            {row.timeSpan.end !== row.timeSpan.start ? <span>—{shortYear(row.timeSpan.end!)}</span> : null}
          </th>
          <td><p>{row.scope.text}</p><p className="ks-political-ranges__change">{row.change.text}</p></td>
        </tr>)}</tbody>
      </table>
    </section>
    <section className="ks-language-detail-block" aria-label={organizationTitle}>
      <h3>{organizationTitle}</h3>
      <dl className="ks-language-usage">
        <dt>{isCommunity ? '主要中心' : '首都与政治中心'}</dt><dd>{description.centres.text}</dd>
        <dt>核心地区</dt><dd>{description.core.text}</dd>
        <dt>{isCommunity ? '组织方式' : '统治方式'}</dt><dd>{description.governance.text}</dd>
      </dl>
    </section>
    <footer className="ks-language-detail-sources"><SourceLinks ids={sourceIds} mergeUrls /></footer>
  </div>;
}

function SelectionPanel({
  selection,
  regionNames,
  onClose
}: {
  readonly selection: KnowledgeSpaceSelection | null;
  readonly regionNames: ReadonlyMap<string, string>;
  readonly onClose: () => void;
}): ReactNode {
  const entity = selection?.kind === 'entity'
    ? V6_KNOWLEDGE_SPACE_DATA.entities.find((candidate) => candidate.id === selection.id)
    : undefined;
  const event = selection?.kind === 'event'
    ? V6_KNOWLEDGE_SPACE_DATA.events.find((candidate) => candidate.id === selection.id)
    : undefined;
  const phases: readonly EntityPhase[] = entity
    ? entity.phaseIds.map((phaseId) => (
      V6_KNOWLEDGE_SPACE_DATA.entityPhases.find((phase) => phase.id === phaseId)
    )).filter((phase) => phase !== undefined)
    : [];
  const layerId = entity?.conceptLayerId ?? event?.conceptLayerId;
  const layer = V6_KNOWLEDGE_SPACE_DATA.conceptLayers.find((candidate) => candidate.id === layerId);
  const years: number[] = phases.flatMap((phase) => (
    [phase.timeSpan.start, phase.timeSpan.end]
      .filter((year) => year !== undefined)
      .map(Number)
  ));
  const overallTime = phases.length === 1 ? phases[0]!.timeSpan.label : years.length > 0
    ? formatWindow({ start: Math.min(...years), end: Math.max(...years) })
    : event?.timeSpan.label;
  const eventDescription = event ? V6_KNOWLEDGE_SPACE_DATA.eventDescriptions[event.id] : undefined;
  const hasPoliticalDetails = !!entity && !!V6_KNOWLEDGE_SPACE_DATA.politicalDescriptions[entity.id];
  const hasCompactDetails = hasPoliticalDetails || entity?.type === 'language' || entity?.type === 'writingSystem';
  const displayedTime = hasCompactDetails && years.length
    ? `${phases.some(phase => phase.timeSpan.approximate) ? '约' : ''}${formatWindow({ start: Math.min(...years), end: Math.max(...years) })}`
    : undefined;

  return (
    <aside
      className={`ks-selection-panel${selection ? ' has-selection' : ' is-empty'}`}
      aria-live="polite"
      aria-label="选中对象详情"
      data-knowledge-space-details
      data-selection-kind={selection?.kind}
      data-selection-id={selection?.id}
    >
      {!selection || (!entity && !event)
        ? (
          <div className="ks-selection-panel__empty">
            <p className="ks-section-heading__eyebrow">选择历史对象</p>
            <p>展开地域并点击一个图形，查看它的时间阶段和地域范围。</p>
          </div>
        )
        : (
          <>
            <header className="ks-selection-panel__header">
              <div>
                <p className="ks-section-heading__eyebrow">已选中</p>
                <h2>
                  {selection && subjectColor(selection) ? <span className="ks-subject-swatch" style={{ backgroundColor: subjectColor(selection) }} aria-hidden="true" /> : null}
                  {entity?.name ?? event?.title}
                </h2>
                <p>{hasCompactDetails ? `图中时段 · ${displayedTime}` : [layer?.label, overallTime].filter(Boolean).join(' · ')}</p>
              </div>
              <button type="button" onClick={onClose} aria-label="取消选择" data-selection-close>×</button>
            </header>
            {hasPoliticalDetails && entity ? <PoliticalDetails entity={entity} phases={phases} /> : hasCompactDetails && entity ? <LanguageWritingDetails entity={entity} phases={phases} regionNames={regionNames} /> : entity ? (
              <section className="ks-detail-overview" aria-label="简介">
                <p>{entity.canonicalSummary}</p>
                <SourceLinks ids={entity.sourceIds} />
              </section>
            ) : eventDescription ? (
              <section className="ks-detail-overview" aria-label="简介">
                <p>{eventDescription.text}</p>
                <SourceLinks ids={eventDescription.sourceIds} />
              </section>
            ) : null}
            {hasCompactDetails ? null : entity
              ? (
                <ol className="ks-selection-panel__phases">
                  {phases.map((phase) => (
                    <li key={phase.id} data-selection-phase-id={phase.id}>
                      {'title' in phase && phase.title ? <h3>{phase.title}</h3> : null}
                      <p>{phase.timeSpan.label}</p>
                      <RegionDetails regions={phase.regions} names={regionNames} />
                      <SourceLinks ids={[...phase.sourceIds, ...phase.regions.flatMap(region => region.sourceIds)]} />
                    </li>
                  ))}
                </ol>
              )
              : event
                ? (
                  <div className="ks-selection-panel__event">
                    <p>{event.timeSpan.label}</p>
                    <RegionDetails regions={event.regions} names={regionNames} />
                    <h3>参与者</h3>
                    <ul className="ks-detail-participants">
                      {event.participants.map((participant, index) => (
                        <li key={`${participant.entityId}:${index}`}>
                          <span>{V6_KNOWLEDGE_SPACE_DATA.entities.find(entity => entity.id === participant.entityId)!.name}</span>
                          {participant.description ? <p>{participant.description}</p> : null}
                        </li>
                      ))}
                    </ul>
                    <SourceLinks ids={[...event.sourceIds, ...event.participants.flatMap(participant => participant.sourceIds), ...event.regions.flatMap(region => region.sourceIds)]} />
                  </div>
                )
                : null}
          </>
        )}
    </aside>
  );
}

function HoverTooltip({ hover }: { readonly hover: HoverState | null }): ReactNode {
  if (!hover || hover.marks.length === 0) return null;
  const subjects = new Map<string, LaidOutRegionTimeMark>();
  for (const mark of hover.marks) {
    const subject = mark.sourceMark.subjectRef;
    subjects.set(`${subject.kind}:${subject.id}`, mark);
  }
  const visible = [...subjects.values()].slice(0, 3);
  const viewportWidth = typeof window === 'undefined' ? 1024 : window.innerWidth;
  const viewportHeight = typeof window === 'undefined' ? 768 : window.innerHeight;
  return (
    <div
      className="ks-hover-tooltip"
      role="tooltip"
      data-knowledge-space-hover
      style={{
        left: `${Math.max(8, Math.min(hover.point.x + 14, viewportWidth - 248))}px`,
        top: `${Math.max(8, Math.min(hover.point.y + 14, viewportHeight - 128))}px`
      }}
    >
      {visible.map((mark) => (
        <p key={`${mark.sourceMark.subjectRef.kind}:${mark.sourceMark.subjectRef.id}`}>
          <strong>{mark.sourceMark.label}</strong>
          <span>{mark.sourceMark.timeSpan.label}</span>
        </p>
      ))}
      {subjects.size > visible.length ? <small>另有{subjects.size - visible.length}项重叠</small> : null}
    </div>
  );
}

function MarkLegend(): ReactNode {
  return (
    <div className="ks-legend" aria-label="图形含义">
      <span><i className="ks-legend__shape ks-legend__shape--block" aria-hidden="true" />块面</span>
      <span><i className="ks-legend__shape ks-legend__shape--node" aria-hidden="true" />节点</span>
      <span><i className="ks-legend__shape ks-legend__shape--trace" aria-hidden="true" />轨迹</span>
      <span><i className="ks-legend__shape ks-legend__shape--strip" aria-hidden="true" />色带</span>
    </div>
  );
}

export function KnowledgeSpacePreview(): ReactNode {
  const domain = useMemo(deriveDomain, []);
  const [conceptLayerId, setConceptLayerId] = useState<ConceptLayerId>(DEFAULT_CONCEPT_LAYER);
  const [timeWindow, setTimeWindow] = useState<TimeWindow>(domain);
  const [selected, setSelected] = useState<KnowledgeSpaceSelection | null>(null);
  const [hovered, setHovered] = useState<HoverState | null>(null);
  const [expandedRegionIds, setExpandedRegionIds] = useState<ReadonlySet<string>>(readExpandedRegionIds);

  const projection = useMemo(() => projectRegionTimeSlice(
    OVERVIEW_MARKS,
    V6_KNOWLEDGE_SPACE_DATA.regions,
    {
      kind: 'region-time',
      conceptLayerId,
      timeWindow: {
        ...timeWindow,
        label: formatWindow(timeWindow),
        approximate: false
      }
    }
  ), [conceptLayerId, timeWindow]);

  const laidOutMarks = useMemo(() => layoutRegionTimeMarks(projection.marks, {
    minimumNodeWidth: MINIMUM_NODE_FOOTPRINT,
    stablePolityRegionIds: ['southern-levant'],
    separateBands: true
  }), [projection]);

  const selectedMarks = useMemo(() => {
    if (!selected) return [];
    return laidOutMarks.filter((mark) => (
      mark.sourceMark.subjectRef.kind === selected.kind
      && mark.sourceMark.subjectRef.id === selected.id
    ));
  }, [laidOutMarks, selected]);

  const regionNames = useMemo(() => new Map(
    V6_KNOWLEDGE_SPACE_DATA.regions.map((region) => [region.id, region.name] as const)
  ), []);

  useEffect(() => {
    setSelected(null);
    setHovered(null);
  }, [conceptLayerId]);

  useEffect(() => {
    setHovered(null);
  }, [timeWindow]);

  useEffect(() => {
    const clearSelection = (event: globalThis.KeyboardEvent): void => {
      if (event.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', clearSelection);
    return () => window.removeEventListener('keydown', clearSelection);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      EXPANDED_REGIONS_STORAGE_KEY,
      JSON.stringify([...expandedRegionIds].sort())
    );
  }, [expandedRegionIds]);

  useEffect(() => {
    if (!selected) return;
    const selectedRowIds = new Set(selectedMarks.map((mark) => mark.rowId));
    const containingRegionIds = projection.axisGroups
      .filter((group) => group.rows.some((row) => selectedRowIds.has(row.id)))
      .map((group) => group.regionId);
    if (containingRegionIds.length === 0) return;
    setExpandedRegionIds((current) => {
      const next = new Set(current);
      containingRegionIds.forEach((regionId) => next.add(regionId));
      return next.size === current.size ? current : next;
    });
  }, [projection.axisGroups, selected, selectedMarks]);

  const toggleRegion = (regionId: string): void => {
    setExpandedRegionIds((current) => {
      const next = new Set(current);
      if (next.has(regionId)) next.delete(regionId);
      else next.add(regionId);
      return next;
    });
  };

  const zoomAt = (factor: number, anchor = 0.5): void => {
    setTimeWindow((current) => {
      const duration = current.end - current.start;
      const nextDuration = Math.max(
        MINIMUM_WINDOW_YEARS,
        Math.min(domain.end - domain.start, duration * factor)
      );
      const anchorYear = current.start + duration * anchor;
      return clampWindow({
        start: anchorYear - nextDuration * anchor,
        end: anchorYear + nextDuration * (1 - anchor)
      }, domain);
    });
  };

  const panYears = (delta: number): void => {
    setTimeWindow((current) => clampWindow({
      start: current.start + delta,
      end: current.end + delta
    }, domain));
  };

  const panByFraction = (fraction: number): void => {
    panYears((timeWindow.end - timeWindow.start) * fraction);
  };

  const activeLayer = V6_KNOWLEDGE_SPACE_DATA.conceptLayers.find((layer) => layer.id === conceptLayerId)!;

  return (
    <main className="ks-preview" data-knowledge-space-preview>
      <header className="ks-preview__header">
        <p className="ks-preview__eyebrow">文明漫游 · 本地实验</p>
        <h1>在时间与地域中观察历史</h1>
        <p>选择一个概念切面，比较它在不同地域的存在方式与持续时间。</p>
      </header>

      <section className="ks-concepts" aria-labelledby="ks-concepts-title">
        <div className="ks-section-heading">
          <div>
            <p className="ks-section-heading__eyebrow">概念切面</p>
            <h2 id="ks-concepts-title">{activeLayer.label}</h2>
          </div>
          <p>{activeLayer.description}</p>
        </div>
        <div className="ks-concept-buttons" role="group" aria-label="选择概念切面">
          {V6_KNOWLEDGE_SPACE_DATA.conceptLayers.map((layer) => (
            <button
              type="button"
              key={layer.id}
              aria-pressed={layer.id === conceptLayerId}
              data-concept-layer-id={layer.id}
              onClick={() => setConceptLayerId(layer.id)}
            >
              <span>{layer.order}</span>
              {layer.label}
            </button>
          ))}
        </div>
      </section>

      <section className="ks-workspace" aria-labelledby="ks-chart-title">
        <div className="ks-workspace__topline">
          <div>
            <p className="ks-section-heading__eyebrow">当前时间窗口</p>
            <h2 id="ks-chart-title" data-time-window>{formatWindow(timeWindow)}</h2>
            <p>{laidOutMarks.length}条地域记录</p>
          </div>
          <div className="ks-time-controls" aria-label="调整时间窗口">
            <button type="button" data-time-action="earlier" onClick={() => panByFraction(-0.25)} aria-label="向更早时期平移">← 更早</button>
            <button type="button" data-time-action="zoom-in" onClick={() => zoomAt(0.72)}>拉近</button>
            <button type="button" data-time-action="zoom-out" onClick={() => zoomAt(1.4)}>拉远</button>
            <button type="button" data-time-action="later" onClick={() => panByFraction(0.25)} aria-label="向更晚时期平移">更晚 →</button>
            <button type="button" data-time-action="all" className="ks-time-controls__all" onClick={() => setTimeWindow(domain)}>全部时间</button>
          </div>
        </div>

        <MarkLegend />
        <div className="ks-visualization-layout">
          <div className="ks-chart-pane">
            <p className="ks-interaction-note">水平拖动可平移时间；按住 Ctrl 滚动可以指针为中心缩放。</p>
            <KnowledgeSpaceSvg
              projection={projection}
              marks={laidOutMarks}
              selected={selected}
              expandedRegionIds={expandedRegionIds}
              onToggleRegion={toggleRegion}
              onSelect={setSelected}
              onHover={(marks, point) => setHovered(marks.length ? { marks, point } : null)}
              onClearHover={() => setHovered(null)}
              onPanYears={panYears}
              onZoomAt={zoomAt}
            />
          </div>
          <SelectionPanel
            selection={selected}
            regionNames={regionNames}
            onClose={() => setSelected(null)}
          />
        </div>
        <HoverTooltip hover={hovered} />
      </section>
    </main>
  );
}
