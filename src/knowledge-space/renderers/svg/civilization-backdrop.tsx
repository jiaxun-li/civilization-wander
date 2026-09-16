import type { ReactNode } from 'react';
import type { RegionTimeProjection } from '../../projection/index.ts';
import { CIVILIZATION_BACKDROPS, backdropWindow } from '../../preview/civilization-backdrops.ts';
import { CivilizationMotif } from './civilization-motif.tsx';

export function CivilizationBackdrop({ rows, window }: {
  readonly rows: RegionTimeProjection['axisRows'];
  readonly window: RegionTimeProjection['spec']['timeWindow'];
}): ReactNode {
  if (rows.length === 0) return null;
  return (
    <div className="ks-civilization-backdrops" aria-hidden="true">
      {CIVILIZATION_BACKDROPS.map(backdrop => {
        const span = backdropWindow(backdrop, window);
        if (!span) return null;
        const matching = rows.map((row, index) => ({ row, index }))
          .filter(({ row }) => backdrop.regionIds.includes(row.regionId));
        if (matching.length === 0) return null;
        const firstIndex = matching[0]!.index;
        let motifRows = 1;
        while (matching[motifRows]?.index === firstIndex + motifRows) motifRows += 1;
        // A wash per reviewed row; one motif only across contiguous matching rows.
        return <div key={backdrop.id} data-backdrop-context={backdrop.id}>
          {matching.map(({ row, index }) => (
            <div key={row.id} className="ks-civilization-backdrop"
              data-civilization-backdrop={backdrop.id} data-backdrop-region={row.regionId}
              style={{ left: `${span.left * 100}%`, width: `${span.width * 100}%`, top: `${index / rows.length * 100}%`, height: `${100 / rows.length}%`, color: backdrop.background }}>
              <span className="ks-civilization-backdrop__wash" />
            </div>
          ))}
          <div className="ks-civilization-backdrop ks-civilization-backdrop__decoration"
            style={{ left: `${span.left * 100}%`, width: `${span.width * 100}%`, top: `${firstIndex / rows.length * 100}%`, height: `${motifRows / rows.length * 100}%`, color: backdrop.foreground }}>
            <CivilizationMotif kind={backdrop.motifKind} />
          </div>
        </div>;
      })}
    </div>
  );
}
