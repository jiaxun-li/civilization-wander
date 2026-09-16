# V5 → V6 migration ledgers

This directory is a non-runtime staging area. The generator reads the active
V5 aggregate and writes deterministic migration ledgers; it does not modify V5
data, import V6 into the application, or copy Card prose, Scene prose, media,
maps, or Assets.

Run with Node.js 22.18 or newer:

```text
node v6/migration/generate-baseline.ts
```

Generated directories:

- `baseline/`: compact, machine-readable snapshots for every V5 Entity, Event,
  Scene, and StructuralEdge, the complete 503-Source snapshot with a stable
  SHA-256 digest, the aggregate summary, and the latest drift report;
- `entity-decisions/`: one pending V6 type, concept-layer, disposition, and
  accepted-Phase ledger entry per V5 Entity;
- `event-decisions/`: one pending disposition per V5 Event;
- `scene-phase/`: one schema-valid `ScenePhaseSignal` per V5 Scene, with nested
  event-participant entity signals and a separate audit block; a signal is
  never an accepted `EntityPhase`;
- `edge-decisions/`: one pending TemporalRelation review entry per old edge;
- `relation-candidates/`: non-runtime ledgers for missing or unstable relation
  targets; candidates never enter `AtlasV6Data`;
- `handoffs/`: per-module review and ownership status.

## Review boundary

Derived baseline and Scene-signal files are deterministic and are compared with
their previous digests on every run. Pending decision, candidate, and handoff
files may be refreshed while untouched; once review begins, the generator
preserves them.

The generator may resolve ownership, references, source IDs, time intersections,
cross-module references, and old-type candidates. A reviewer must decide final
Entity types, concept layers, Phase grouping and titles, regions and regional
roles, Event participant roles, relation roles/families/types, and whether an
unresolved historical idea deserves a stable V6 identity.

When a possible relation lacks a stable target, has an ambiguous target kind or
relation type, is insufficiently supported, or may be ordinary explanation
rather than a reusable historical fact, add it to the module's
`relation-candidates` ledger. Do not manufacture a placeholder Entity, Event,
Phase, or TemporalRelation.
