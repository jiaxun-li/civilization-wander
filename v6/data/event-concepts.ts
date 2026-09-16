import type {
  ConceptLayerId,
  Event,
  PendingHistoricalProcessReview
} from '../schema/index.ts';

export type EventWithoutConceptLayer = Omit<Event, 'conceptLayerId'>;

type EventConceptLayerMap<Definitions extends readonly EventWithoutConceptLayer[]> = {
  readonly [Definition in Definitions[number] as Definition['id']]: ConceptLayerId;
};

/**
 * Attaches reviewed concept-layer decisions to authored Event definitions.
 *
 * Keeping the map exhaustive makes a newly added Event fail TypeScript until
 * an editor decides where it belongs. The visualization never guesses from a
 * title, Event kind, participant, or ID.
 */
export function attachEventConceptLayers<
  const Definitions extends readonly EventWithoutConceptLayer[]
>(
  definitions: Definitions,
  conceptLayers: EventConceptLayerMap<Definitions>
): readonly Event[] {
  const layersById = conceptLayers as Readonly<Record<string, ConceptLayerId>>;
  return definitions.map((definition) => ({
    ...definition,
    conceptLayerId: layersById[definition.id]
  }));
}

/**
 * Quarantines every broad historicalProcess before the authoritative V6 core
 * is assembled. This is an editorial review boundary, not renderer filtering:
 * accepted modules export only historicalEvent records, while every process is
 * retained verbatim in a machine-readable pending-review registry.
 */
export function quarantineHistoricalProcesses(
  events: readonly Event[]
): {
  readonly acceptedEvents: readonly Event[];
  readonly pendingHistoricalProcesses: readonly PendingHistoricalProcessReview[];
} {
  const acceptedEvents: Event[] = [];
  const pendingHistoricalProcesses: PendingHistoricalProcessReview[] = [];
  for (const event of events) {
    if (event.kind === 'historicalProcess') {
      pendingHistoricalProcesses.push({
        id: event.id,
        status: 'pending',
        reason: 'Re-review whether this broad process belongs as an EntityPhase, Event, or TemporalRelation.',
        candidate: event
      });
    } else {
      acceptedEvents.push(event);
    }
  }
  return { acceptedEvents, pendingHistoricalProcesses };
}
