import {
  useMemo,
  useRef,
  useEffect,
  useState,
  type KeyboardEvent,
  type ReactNode
} from 'react';
import type { KnowledgeSubject } from '../../../../v6/schema/index.ts';
import { subjectColor } from '../../preview/subject-colors.ts';
import { polityLabelRunIds } from '../../preview/polity-labels.ts';
import { languageLabelMarkIds } from '../../preview/language-labels.ts';
import {
  buildContinuousBlockRuns,
  type ContinuousBlockRun,
  type LaidOutRegionTimeMark
} from '../../layout/index.ts';
import type { RegionTimeProjection } from '../../projection/index.ts';
import { CivilizationBackdrop } from './civilization-backdrop.tsx';

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 56;
const TRACK_TOP = 7;
const TRACK_HEIGHT = 42;
const MINIMUM_NODE_FOOTPRINT = 0.018;

export type KnowledgeSpaceSelection = KnowledgeSubject;

export interface KnowledgeSpaceHoverPoint {
  readonly x: number;
  readonly y: number;
}

export interface KnowledgeSpaceSvgProps {
  readonly projection: RegionTimeProjection;
  readonly marks: readonly LaidOutRegionTimeMark[];
  readonly selected: KnowledgeSpaceSelection | null;
  readonly expandedRegionIds: ReadonlySet<string>;
  readonly onToggleRegion: (regionId: string) => void;
  readonly onSelect: (selection: KnowledgeSpaceSelection | null) => void;
  readonly onHover: (
    marks: readonly LaidOutRegionTimeMark[],
    point: KnowledgeSpaceHoverPoint
  ) => void;
  readonly onClearHover: () => void;
  readonly onPanYears: (yearDelta: number) => void;
  readonly onZoomAt: (factor: number, anchor: number) => void;
}

function laneGeometry(segment: LaidOutRegionTimeMark['trackSegments'][number]): {
  readonly top: number;
  readonly height: number;
  readonly center: number;
} {
  const laneHeight = TRACK_HEIGHT / segment.laneCount;
  const height = Math.max(4, laneHeight - 2);
  const top = TRACK_TOP + laneHeight * segment.laneIndex + (laneHeight - height) / 2;
  return { top, height, center: top + height / 2 };
}

function markFootprint(mark: LaidOutRegionTimeMark): readonly [number, number] {
  if (mark.markKind === 'node') {
    return [
      Math.max(0, mark.anchorX - MINIMUM_NODE_FOOTPRINT / 2),
      Math.min(1, mark.anchorX + MINIMUM_NODE_FOOTPRINT / 2)
    ];
  }
  return [mark.xStart, mark.xEnd];
}

function marksAtPosition(
  marks: readonly LaidOutRegionTimeMark[],
  normalizedX: number
): readonly LaidOutRegionTimeMark[] {
  return marks.filter((mark) => {
    const [start, end] = markFootprint(mark);
    const padding = mark.markKind === 'crayonStrip' ? 0.006 : 0.003;
    return normalizedX >= start - padding && normalizedX <= end + padding;
  });
}

function conceptClass(mark: LaidOutRegionTimeMark): string {
  return `ks-mark ks-mark--${mark.markKind} ks-concept--${mark.sourceMark.conceptLayerId}`;
}

function isSelectedSubject(
  mark: LaidOutRegionTimeMark,
  selected: KnowledgeSpaceSelection | null
): boolean {
  return selected !== null
    && mark.sourceMark.subjectRef.kind === selected.kind
    && mark.sourceMark.subjectRef.id === selected.id;
}

/** Every member receives the continuous run's shared collision layout. */
function blockRunSegments(run: ContinuousBlockRun) {
  return run.members[0]!.trackSegments.map((segment) => ({
    ...segment,
    start: Math.max(segment.start, run.xStart),
    end: Math.min(segment.end, run.xEnd)
  })).filter((segment) => segment.end > segment.start);
}

function blockRunGraphic(run: ContinuousBlockRun, plotWidth: number): ReactNode {
  const segments = blockRunSegments(run);
  if (segments.length === 0) return null;
  const first = segments[0]!;
  const last = segments.at(-1)!;
  const firstLane = laneGeometry(first);
  const lastLane = laneGeometry(last);
  const start = first.start * VIEWBOX_WIDTH;
  const end = last.end * VIEWBOX_WIDTH;
  const startApproximate = run.members.some((member) => (
    member.xStart === run.xStart
    && member.sourceMark.certainty.timeApproximate
    && !member.clippedStart
  ));
  const endApproximate = run.members.some((member) => (
    member.xEnd === run.xEnd
    && member.sourceMark.certainty.timeApproximate
    && !member.clippedEnd
  ));
  const political = run.members[0]!.sourceMark.conceptLayerId === 'polityAndSociety';
  const startNotch = !political && startApproximate ? Math.min(3, (first.end - first.start) * VIEWBOX_WIDTH / 4) : 0;
  const endNotch = !political && endApproximate ? Math.min(3, (last.end - last.start) * VIEWBOX_WIDTH / 4) : 0;
  // A short filled shoulder joins neighboring lanes; no per-Phase connector
  // or shared SVG edge can introduce a hairline gap inside one continuous run.
  const shoulders = segments.slice(1).map((segment, index) => Math.min(
    political ? 5 * VIEWBOX_WIDTH / Math.max(1, plotWidth) : 3,
    (segments[index]!.end - segments[index]!.start) * VIEWBOX_WIDTH / 4,
    (segment.end - segment.start) * VIEWBOX_WIDTH / 4
  ));
  const edgeInsets = segments.map((segment, index) => ({
    start: index === 0 ? startNotch
      : !political || segment.laneCount < segments[index - 1]!.laneCount ? shoulders[index - 1]! : 0,
    end: index === segments.length - 1 ? endNotch
      : !political || segment.laneCount < segments[index + 1]!.laneCount ? shoulders[index]! : 0
  }));
  const top = segments.flatMap((segment, index) => {
    const lane = laneGeometry(segment);
    return [
      [segment.start * VIEWBOX_WIDTH + edgeInsets[index]!.start, lane.top],
      [segment.end * VIEWBOX_WIDTH - edgeInsets[index]!.end, lane.top]
    ];
  });
  const bottom = segments.flatMap((segment, index) => {
    const lane = laneGeometry(segment);
    return [
      [segment.start * VIEWBOX_WIDTH + edgeInsets[index]!.start, lane.top + lane.height],
      [segment.end * VIEWBOX_WIDTH - edgeInsets[index]!.end, lane.top + lane.height]
    ];
  }).reverse();
  const outline = [
    ...top,
    ...(endNotch ? [[end, lastLane.center]] : []),
    ...bottom,
    ...(startNotch ? [[start, firstLane.center]] : [])
  ];
  const path = outline.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ') + ' Z';
  const boundaries = run.members.slice(1).map((member) => {
    if (member.xStart <= run.xStart || member.xStart >= run.xEnd) return null;
    const segment = segments.find((candidate) => (
      member.xStart >= candidate.start && member.xStart <= candidate.end
    ))!;
    const lane = laneGeometry(segment);
    const inset = Math.min(3, lane.height / 4);
    return (
      <line
        className="ks-block-run__phase-boundary"
        key={`boundary:${member.id}`}
        x1={member.xStart * VIEWBOX_WIDTH}
        x2={member.xStart * VIEWBOX_WIDTH}
        y1={lane.top + inset}
        y2={lane.top + lane.height - inset}
      />
    );
  });
  return <><path className="ks-block-run__body" data-block-style={political ? 'straight-branch' : undefined} d={path} />{boundaries}</>;
}

function nodeMark(mark: LaidOutRegionTimeMark, plotWidth: number): ReactNode {
  const segment = mark.trackSegments.find((item) => (
    mark.anchorX >= item.start && mark.anchorX <= item.end
  )) ?? mark.trackSegments[0]!;
  const lane = laneGeometry(segment);
  const x = mark.anchorX * VIEWBOX_WIDTH;
  const radiusX = 8 * VIEWBOX_WIDTH / plotWidth;
  const radiusY = Math.min(9, Math.max(5, lane.height / 2));
  const whiskerStart = mark.xStart * VIEWBOX_WIDTH;
  const whiskerEnd = mark.xEnd * VIEWBOX_WIDTH;
  return (
    <>
      {mark.sourceMark.certainty.timeApproximate && whiskerEnd > whiskerStart
        ? <line className="ks-mark__whisker" x1={whiskerStart} x2={whiskerEnd} y1={lane.center} y2={lane.center} />
        : null}
      <polygon points={`${x},${lane.center - radiusY} ${x + radiusX},${lane.center} ${x},${lane.center + radiusY} ${x - radiusX},${lane.center}`} />
    </>
  );
}

function traceMark(mark: LaidOutRegionTimeMark): ReactNode {
  const segments = mark.trackSegments.map(segment => ({
    start: Math.max(segment.start, mark.xStart) * VIEWBOX_WIDTH,
    end: Math.min(segment.end, mark.xEnd) * VIEWBOX_WIDTH,
    center: laneGeometry(segment).center
  })).filter(segment => segment.end > segment.start);
  if (!segments.length) return null;
  const path = segments.map((segment, index) =>
    `${index === 0 ? 'M' : 'L'} ${segment.start} ${segment.center} L ${segment.end} ${segment.center}`
  ).join(' ');
  const isWriting = mark.sourceMark.semanticKind.kind === 'entity'
    && mark.sourceMark.semanticKind.entityType === 'writingSystem';
  return <>
    {isWriting ? segments.map((segment, index) => <rect
      key={index}
      className="ks-mark__trace-hit"
      x={segment.start} y={segment.center - 5}
      width={segment.end - segment.start} height={10}
      aria-hidden="true"
    />) : null}
    <path className="ks-mark__solid-trace" d={path} />
  </>;
}

function crayonStripMark(mark: LaidOutRegionTimeMark): ReactNode {
  return <>{mark.trackSegments.map((segment, index) => {
    const x = Math.max(segment.start, mark.xStart) * VIEWBOX_WIDTH;
    const end = Math.min(segment.end, mark.xEnd) * VIEWBOX_WIDTH;
    if (end <= x) return null;
    const lane = laneGeometry(segment);
    const height = 12;
    return <rect key={index} className="ks-mark__solid-band" x={x} y={lane.center - height / 2} width={end - x} height={height} />;
  })}</>;
}

function markGraphic(mark: LaidOutRegionTimeMark, plotWidth: number): ReactNode {
  switch (mark.markKind) {
    case 'block': return null;
    case 'node': return nodeMark(mark, plotWidth);
    case 'trace': return traceMark(mark);
    case 'crayonStrip': return crayonStripMark(mark);
  }
}

function formatYear(year: number): string {
  if (year < 0) return `前${Math.abs(Math.round(year))}`;
  return `${Math.round(year)}`;
}

function timelineTicks(start: number, end: number): readonly { readonly value: number; readonly x: number }[] {
  const count = 6;
  return Array.from({ length: count + 1 }, (_, index) => {
    const value = start + (end - start) * index / count;
    return { value, x: VIEWBOX_WIDTH * index / count };
  });
}

function blockLabelPlacement(run: ContinuousBlockRun): {
  readonly left: number;
  readonly width: number;
  readonly top: number;
} {
  const segments = blockRunSegments(run).map((segment) => {
    const start = segment.start;
    const end = segment.end;
    const lane = laneGeometry(segment);
    return {
      left: start,
      end,
      top: lane.center / VIEWBOX_HEIGHT,
      laneKey: `${lane.top}:${lane.height}`
    };
  }).filter((segment) => segment.end > segment.left).sort((left, right) => (
    left.left - right.left || left.end - right.end || left.laneKey.localeCompare(right.laneKey)
  ));
  const candidates: Array<{
    left: number;
    end: number;
    top: number;
    laneKey: string;
  }> = [];
  for (const segment of segments) {
    const previous = candidates.at(-1);
    if (
      previous
      && previous.laneKey === segment.laneKey
      && segment.left <= previous.end + 1e-9
    ) {
      previous.end = Math.max(previous.end, segment.end);
    } else {
      candidates.push({ ...segment });
    }
  }
  const widest = candidates.sort((left, right) => (
    (right.end - right.left) - (left.end - left.left)
  ))[0];
  const placement = widest ?? {
    left: run.xStart,
    end: run.xEnd,
    laneKey: 'fallback',
    top: 0.5
  };
  return {
    left: placement.left,
    width: Math.max(0, placement.end - placement.left),
    top: placement.top
  };
}

function RowSvg({
  rowId,
  label,
  marks,
  blockRuns,
  polityLabels,
  languageLabels,
  selected,
  ticks,
  onSelect,
  onHover,
  onClearHover,
  onPanYears,
  onZoomAt
}: {
  readonly rowId: string;
  readonly label: string;
  readonly marks: readonly LaidOutRegionTimeMark[];
  readonly blockRuns: readonly ContinuousBlockRun[];
  readonly polityLabels: ReadonlySet<string>;
  readonly languageLabels: ReadonlySet<string>;
  readonly selected: KnowledgeSpaceSelection | null;
  readonly ticks: readonly { readonly value: number; readonly x: number }[];
  readonly onSelect: KnowledgeSpaceSvgProps['onSelect'];
  readonly onHover: KnowledgeSpaceSvgProps['onHover'];
  readonly onClearHover: KnowledgeSpaceSvgProps['onClearHover'];
  readonly onPanYears: KnowledgeSpaceSvgProps['onPanYears'];
  readonly onZoomAt: KnowledgeSpaceSvgProps['onZoomAt'];
}): ReactNode {
  const pointerStart = useRef<{
    x: number;
    y: number;
    pointerId: number;
    markInstanceId?: string;
    blockRunId?: string;
  } | null>(null);
  const dragged = useRef(false);
  const plot = useRef<SVGSVGElement>(null);
  const [plotWidth, setPlotWidth] = useState(VIEWBOX_WIDTH);
  useEffect(() => {
    const element = plot.current;
    if (!element) return;
    const update = () => setPlotWidth(element.getBoundingClientRect().width || VIEWBOX_WIDTH);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const normalizedPointerX = (event: { readonly currentTarget: SVGSVGElement; readonly clientX: number }): number => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
  };

  return (
    <div className="ks-region-row__plot-shell">
      <svg
        ref={plot}
        className="ks-region-row__plot"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="none"
        role="group"
        aria-label={`${label}的时间分布`}
        data-region-row={rowId}
        onPointerDown={(event) => {
          const markElement = event.target instanceof Element
            ? event.target.closest<SVGGElement>('[data-mark-instance-id], [data-block-run-id]')
            : null;
          pointerStart.current = {
            x: event.clientX,
            y: event.clientY,
            pointerId: event.pointerId,
            markInstanceId: markElement?.dataset.markInstanceId,
            blockRunId: markElement?.dataset.blockRunId
          };
          dragged.current = false;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (event.pointerType === 'mouse' && event.buttons === 0) {
            onHover(marksAtPosition(marks, normalizedPointerX(event)), {
              x: event.clientX,
              y: event.clientY
            });
          }
          if (!pointerStart.current || pointerStart.current.pointerId !== event.pointerId) return;
          const deltaX = event.clientX - pointerStart.current.x;
          const deltaY = event.clientY - pointerStart.current.y;
          if (Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
            dragged.current = true;
          }
        }}
        onPointerUp={(event) => {
          if (!pointerStart.current || pointerStart.current.pointerId !== event.pointerId) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          const deltaX = event.clientX - pointerStart.current.x;
          if (dragged.current) {
            const windowDuration = ticks.at(-1)!.value - ticks[0]!.value;
            onPanYears(-deltaX / bounds.width * windowDuration);
          } else {
            const mark = marks.find((item) => item.id === pointerStart.current?.markInstanceId);
            const run = blockRuns.find((item) => item.id === pointerStart.current?.blockRunId);
            onSelect(run?.subjectRef ?? mark?.sourceMark.subjectRef ?? null);
          }
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          pointerStart.current = null;
          dragged.current = false;
        }}
        onPointerCancel={() => {
          pointerStart.current = null;
          dragged.current = false;
        }}
        onPointerLeave={() => onClearHover()}
        onWheel={(event) => {
          if (!event.ctrlKey && !event.metaKey) return;
          event.preventDefault();
          onZoomAt(event.deltaY > 0 ? 1.25 : 0.8, normalizedPointerX(event));
        }}
      >
        <title>{`${label}的时间分布`}</title>
        {ticks.map((tick) => (
          <line className="ks-timeline-grid" key={tick.value} x1={tick.x} x2={tick.x} y1="0" y2={VIEWBOX_HEIGHT} />
        ))}
        {blockRuns.map((run) => {
          const representative = run.members[0]!;
          const selectedRun = isSelectedSubject(representative, selected);
          return (
            <g
              className={`${conceptClass(representative)} ks-block-run${selectedRun ? ' is-selected' : ''}${run.members.some((member) => member.regionApproximate) ? ' is-region-approximate' : ''}`}
              key={run.id}
              role="button"
              style={{ color: subjectColor(run.subjectRef) }}
              tabIndex={0}
              data-knowledge-space-mark={run.id}
              data-block-run-id={run.id}
              data-subject-kind={run.subjectRef.kind}
              data-subject-id={run.subjectRef.id}
              data-mark-kind="block"
              data-phase-count={run.members.length}
              aria-label={`${run.label}，${run.members.map((member) => member.sourceMark.timeSpan.label).join('；')}`}
              onFocus={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                onHover(run.members, { x: bounds.right, y: bounds.top });
              }}
              onBlur={() => onClearHover()}
              onKeyDown={(event: KeyboardEvent<SVGGElement>) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                onSelect(run.subjectRef);
              }}
            >
              {blockRunGraphic(run, plotWidth)}
            </g>
          );
        })}
        {marks.filter((mark) => mark.markKind !== 'block').map((mark) => (
          <g
            className={`${conceptClass(mark)}${isSelectedSubject(mark, selected) ? ' is-selected' : ''}${mark.regionApproximate ? ' is-region-approximate' : ''}`}
            key={mark.id}
            role="button"
            style={{ color: subjectColor(mark.sourceMark.subjectRef) }}
            tabIndex={0}
            data-knowledge-space-mark={mark.markId}
            data-mark-instance-id={mark.id}
            data-subject-kind={mark.sourceMark.subjectRef.kind}
            data-subject-id={mark.sourceMark.subjectRef.id}
            data-mark-kind={mark.markKind}
            aria-label={`${mark.sourceMark.label}${mark.sourceMark.phaseLabel ? `，${mark.sourceMark.phaseLabel}` : ''}，${mark.sourceMark.timeSpan.label}`}
            onFocus={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect();
              onHover([mark], { x: bounds.right, y: bounds.top });
            }}
            onBlur={() => onClearHover()}
            onKeyDown={(event: KeyboardEvent<SVGGElement>) => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault();
              onSelect(mark.sourceMark.subjectRef);
            }}
          >
            {markGraphic(mark, plotWidth)}
          </g>
        ))}
      </svg>
      <div className="ks-block-label-layer" aria-hidden="true">
        {marks.filter(mark => mark.sourceMark.conceptLayerId === 'languageAndKnowledge'
          && languageLabels.has(mark.id)
          && mark.sourceMark.semanticKind.kind === 'entity'
          && mark.sourceMark.semanticKind.entityType === 'language'
          && (mark.xEnd - mark.xStart) * plotWidth >= 90).map(mark => {
          const segment = [...mark.trackSegments].sort((a, b) => (b.end - b.start) - (a.end - a.start))[0]!;
          const left = Math.max(mark.xStart, segment.start);
          const right = Math.min(mark.xEnd, segment.end);
          if ((right - left) * plotWidth < 90) return null;
          return <span key={mark.id}
            data-language-label-subject-id={mark.sourceMark.subjectRef.id}
            className={`ks-language-label${isSelectedSubject(mark, selected) ? ' is-selected' : ''}`}
            style={{ left: `${left * 100}%`, top: `${laneGeometry(segment).center / VIEWBOX_HEIGHT * 100}%`, maxWidth: `${(right - left) * 100}%` }}
          >{mark.sourceMark.label}</span>;
        })}
        {blockRuns.filter(run => run.members[0]!.sourceMark.conceptLayerId !== 'polityAndSociety' || polityLabels.has(run.id)).map((run) => {
          const placement = blockLabelPlacement(run);
          const representative = run.members[0]!;
          return (
            <span
              className={`ks-block-label${isSelectedSubject(representative, selected) ? ' is-selected' : ''}`}
              data-block-label-subject-id={run.subjectRef.id}
              key={run.id}
              title={run.label}
              style={{
                left: `${placement.left * 100}%`,
                top: `${placement.top * 100}%`,
                width: `${placement.width * 100}%`
              }}
            >
              {run.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function RegionThumbnail({
  marks,
  rowIds,
  selected
}: {
  readonly marks: readonly LaidOutRegionTimeMark[];
  readonly rowIds: readonly string[];
  readonly selected: KnowledgeSpaceSelection | null;
}): ReactNode {
  const rowIndex = new Map(rowIds.map((rowId, index) => [rowId, index] as const));
  const rowCount = Math.max(1, rowIds.length);
  const rowHeight = 28 / rowCount;

  return (
    <svg
      className="ks-region-thumbnail"
      viewBox={`0 0 ${VIEWBOX_WIDTH} 36`}
      preserveAspectRatio="none"
      aria-hidden="true"
      data-region-thumbnail
    >
      {[0, 1, 2, 3, 4, 5, 6].map((index) => (
        <line
          className="ks-region-thumbnail__grid"
          key={index}
          x1={VIEWBOX_WIDTH * index / 6}
          x2={VIEWBOX_WIDTH * index / 6}
          y1="3"
          y2="33"
        />
      ))}
      {marks.map((mark) => {
        const y = 4 + ((rowIndex.get(mark.rowId) ?? 0) + 0.5) * rowHeight;
        const start = mark.xStart * VIEWBOX_WIDTH;
        const end = mark.xEnd * VIEWBOX_WIDTH;
        const width = Math.max(2.5, end - start);
        const selectedClass = isSelectedSubject(mark, selected) ? ' is-selected' : '';
        const className = `ks-region-thumbnail__mark ks-concept--${mark.sourceMark.conceptLayerId}${selectedClass}`;
        if (mark.markKind === 'node') {
          const x = mark.anchorX * VIEWBOX_WIDTH;
          return (
            <polygon
              className={className}
              style={{ color: subjectColor(mark.sourceMark.subjectRef) }}
              data-region-thumbnail-mark={mark.markId}
              key={mark.id}
              points={`${x},${y - 3} ${x + 4},${y} ${x},${y + 3} ${x - 4},${y}`}
            />
          );
        }
        if (mark.markKind === 'trace') {
          return (
            <line
              className={`${className} is-trace`}
              style={{ color: subjectColor(mark.sourceMark.subjectRef) }}
              data-region-thumbnail-mark={mark.markId}
              key={mark.id}
              x1={start}
              x2={end}
              y1={y}
              y2={y}
            />
          );
        }
        return (
          <rect
            className={`${className} is-${mark.markKind}`}
            style={{ color: subjectColor(mark.sourceMark.subjectRef) }}
            data-region-thumbnail-mark={mark.markId}
            key={mark.id}
            x={start}
            y={y - (mark.markKind === 'block' ? 2.6 : 1.4)}
            width={width}
            height={mark.markKind === 'block' ? 5.2 : 2.8}
            rx={mark.markKind === 'block' ? 0.8 : 1.4}
          />
        );
      })}
    </svg>
  );
}

export function KnowledgeSpaceSvg({
  projection,
  marks,
  selected,
  expandedRegionIds,
  onToggleRegion,
  onSelect,
  onHover,
  onClearHover,
  onPanYears,
  onZoomAt
}: KnowledgeSpaceSvgProps): ReactNode {
  const marksByRow = useMemo(() => {
    const index = new Map<string, LaidOutRegionTimeMark[]>();
    for (const mark of marks) {
      const rowMarks = index.get(mark.rowId) ?? [];
      rowMarks.push(mark);
      index.set(mark.rowId, rowMarks);
    }
    return index;
  }, [marks]);
  const blockRunsByRow = useMemo(() => {
    const index = new Map<string, ContinuousBlockRun[]>();
    for (const run of buildContinuousBlockRuns(marks)) {
      const rowRuns = index.get(run.rowId) ?? [];
      rowRuns.push(run);
      index.set(run.rowId, rowRuns);
    }
    return index;
  }, [marks]);
  const ticks = timelineTicks(projection.spec.timeWindow.start, projection.spec.timeWindow.end);
  const polityLabels = useMemo(() => polityLabelRunIds([...blockRunsByRow.values()].flat()), [blockRunsByRow]);
  const languageLabels = useMemo(() => languageLabelMarkIds(marks), [marks]);
  const hasVisibleSelection = selected !== null && marks.some((mark) => isSelectedSubject(mark, selected));

  if (projection.axisRows.length === 0) {
    return <p className="ks-empty">这个时间窗口和概念层中暂时没有可显示的历史对象。</p>;
  }

  return (
    <div className={`ks-chart${hasVisibleSelection ? ' has-selection' : ''}`} aria-label="地域与时间切片" data-region-time-slice>
      <div className="ks-chart__time-axis" aria-hidden="true">
        <span className="ks-chart__axis-corner">地域</span>
        <div className="ks-chart__axis-scale">
          {ticks.map((tick, index) => (
            <span
              className={index === 0 ? 'is-first' : index === ticks.length - 1 ? 'is-last' : ''}
              key={tick.value}
              style={{ left: `${tick.x / VIEWBOX_WIDTH * 100}%` }}
            >
              {formatYear(tick.value)}
              <i
                aria-hidden="true"
              >
              </i>
            </span>
          ))}
        </div>
      </div>
      {projection.axisGroups.map((group) => {
        const expanded = expandedRegionIds.has(group.regionId);
        const groupRowIds = group.rows.map((row) => row.id);
        const groupRowIdSet = new Set(groupRowIds);
        const groupMarks = marks.filter((mark) => groupRowIdSet.has(mark.rowId));
        return (
          <section
            className={`ks-region-group${expanded ? ' is-expanded' : ' is-collapsed'}`}
            key={group.id}
            aria-labelledby={`${group.id}-title`}
            data-region-group={group.regionId}
          >
            <h2 id={`${group.id}-title`}>
              <button
                type="button"
                aria-expanded={expanded}
                data-region-group-toggle={group.regionId}
                onClick={() => onToggleRegion(group.regionId)}
              >
                <span className="ks-region-group__disclosure" aria-hidden="true">{expanded ? '−' : '+'}</span>
                <span className="ks-region-group__label">{group.label}</span>
                <span className="ks-region-group__count">{groupMarks.length}项</span>
                {!expanded
                  ? <RegionThumbnail marks={groupMarks} rowIds={groupRowIds} selected={selected} />
                  : null}
              </button>
            </h2>
            {expanded
              ? <div className="ks-region-group__rows">
                <CivilizationBackdrop rows={group.rows} window={projection.spec.timeWindow} />
                {group.rows.map((row) => (
                <div className={`ks-region-row${row.active ? '' : ' is-scaffolding'}`} key={row.id}>
                  <div className="ks-region-row__label" style={{ paddingLeft: `${0.7 + row.depth * 0.65}rem` }}>
                    {row.label}
                  </div>
                  <RowSvg
                    rowId={row.id}
                    label={row.label}
                    marks={marksByRow.get(row.id) ?? []}
                    blockRuns={blockRunsByRow.get(row.id) ?? []}
                    polityLabels={polityLabels}
                    languageLabels={languageLabels}
                    selected={selected}
                    ticks={ticks}
                    onSelect={onSelect}
                    onHover={onHover}
                    onClearHover={onClearHover}
                    onPanYears={onPanYears}
                    onZoomAt={onZoomAt}
                  />
                </div>
              ))}
              </div>
              : null}
          </section>
        );
      })}
    </div>
  );
}
