# Coding agent instructions

## Product principle

The product is **Civilization Wander**: a curated, Card-first way to explore
historical events and their connections.

Users open one curated historical Card, read its ordered Scenes, discover a
person, event, institution, community, political entity, idea, or relationship,
and choose which Card to enter next. The product should gradually reveal a
connected historical world through exploration rather than require a fixed
reading order.

This is not primarily a historical-geography atlas. Geography and maps are
optional supporting media, not the organizing principle of every story.

## Core user experience

The intended path is:

```text
Card
→ read its ordered Scenes
→ discover a relevant event, entity, or relationship
→ enter another Card, optionally at a specific Scene
→ continue from a different historical perspective
```

- A Card is the primary public story, exploration unit, and stable destination.
- A Scene is an ordered narrative and presentation section owned by one Card.
- A Scene may have a stable ID for section links, reading restoration, and
  presentation updates, but it is not an independent story equal to a Card.
- Navigation must be curated and narratively meaningful.
- Users should experience stories and connections, not the internal schema.
- Do not expose terms such as `Entity`, `Card`, `Scene`, `StructuralEdge`,
  `NavigationOption`, or `MapState` as routine interface copy.
- Public titles should be concise and declarative, not long questions.

## Non-negotiable product rules

1. Do not add hotels, shops, tourist reviews, travel recommendations, route
   planning, generic POIs, or other tourism features.
2. Do not require every Scene to contain a map.
3. Do not organize every story around geographic mechanisms.
4. Treat historical events as first-class content, not merely paragraph text
   or tags.
5. Do not automatically expose every database or graph relationship. Every
   visible navigation choice must have a clear narrative reason.
6. Keep supported historical facts separate from scholarly interpretation,
   editorial synthesis, and uncertain claims.
7. Do not fabricate dates, relationships, locations, routes, boundaries, or
   geographic anchors.
8. Approximate or associated locations must be stored as approximate and must
   not be represented internally as exact `locatedAt` claims.
9. Chinese, South Asian, Central Asian, West Asian, African, American, and
   other non-Western histories are first-class content, not token additions.
10. Keep the prototype dependency-free until the content model and experience
    have been validated.

## Public narrative firewall

Public story copy and internal research material are different products.
Names, relationships, disputes, or limitations recorded in `Entity`, `Event`,
`StructuralEdge`, `Source`, a claim ledger, or `EditorialReview` do not thereby
earn a place in public prose.

- Public prose should contain only the facts, people, events, objects, actions,
  situations, changes, and names needed to follow the current story.
- Scholar names, school names, camps of interpretation, and the history of a
  scholarly dispute belong in internal material by default. They may appear in
  public prose only when they are themselves the subject of the Card, or when
  omitting the dispute would materially change the historical meaning.
- Completing `EditorialReview` by listing caveats, counterexamples, or disputes
  in public prose is a failure of this separation, not satisfaction of the
  internal review requirement.
- Complete Event, Entity, relationship, and source data does not require public
  prose to name every linked object.
- Whether a historical name already has its own Card or content pack does not
  determine whether it may appear. A name may be introduced when it has a clear
  role in the current story; a future Card can later expand that history.

## Editorial integrity

Every complete story must contain an internal limitation, counterexample,
uncertainty, dispute, or alternative explanation.

For the current product version, this editorial review material is required in
the data and validation layers but is **not shown to users by default**.
Do not render a visible “limitations,” “counterexample,” or determinism warning
section unless the user explicitly asks for that product change.

Prefer an internal structure such as:

```js
editorialReview: {
  limitations: [],
  counterexamples: [],
  uncertainties: [],
  alternativeExplanations: [],
  sourceIds: []
}
```

Editorial review data exists to prevent overclaiming and to support future
content review. It must not be replaced by keyword checks against public prose.

Historical content should distinguish:

- source-supported historical facts;
- scholarly interpretations;
- editorial summaries;
- disputed or uncertain claims;
- narrative transitions written for reading continuity.

Sources should be attached as close as practical to the claim, event,
annotation, or content block they support. Card-level or Scene-level source
lists may summarize provenance but should not replace claim-level citations.

## Data-model direction

The target model is Card-first and event-capable.

Primary concepts should include:

- `Entity`: a stable person, community, institution, political entity,
  tradition, system, place, or other knowledge identity.
- `Event`: a stable historical event with time, participants, evidence,
  relationships, related Cards, and editorial review.
- `StructuralEdge`: a reusable historical relationship fact.
- `Card`: the primary public story, with a stable identity, editorial scope,
  ordered Scenes, related Events and Entities, navigation, and editorial
  review.
- `Scene`: an ordered narrative and presentation section that belongs to
  exactly one Card.
- `ScenePresentation`: the optional media presentation for a Scene.
- `NavigationOption`: the reusable meaning and target of a possible jump.
- `NavigationPlacement`: where and how a navigation option appears in a
  particular Scene or Card.
- `EditorialReview`: non-public limitations, disputes, uncertainties, and
  alternative explanations.
- `Source`: reusable bibliographic or dataset provenance.

Optional map concepts may include:

- `MapPresentation`;
- `CameraPreset`;
- `Geometry`;
- `MapAnnotation`.

Map objects belong to an optional presentation branch. They must not be
mandatory fields on every Scene.

A Scene must be able to use:

- text only;
- a local image;
- a map;
- image and text;
- map and text;
- another local, dependency-free medium.

Use one authoritative source for ownership and ordering. Avoid maintaining the
same relationship in several mutable fields unless validation enforces exact
consistency.

Use discriminated object types rather than positional seed arrays when content
will be maintained editorially. Avoid fields whose meaning depends on array
position.

## Card, Scene, and navigation rules

- A Card should form a coherent and complete curated story.
- Every Card must have exactly one `primaryEntityId`. It must identify the stable Entity that the Card actually centers on, and that Entity type must have a stable public label.
- A content package's planning Entity is an editorial workflow choice, not a runtime field and not an automatic default for every Card in the package.
- A Card owns the authoritative order of its Scenes.
- A Scene belongs to exactly one Card and should not be promoted independently
  into the global exploration graph.
- A Scene should focus on one limited historical situation or interpretive
  step.
- Every Scene must have a non-empty `eventIds` list, and at least one linked
  Event must overlap the Scene's normalized time span. Several Scenes may
  reuse the same Event. Do not create a fictitious one-off Event merely to
  satisfy this rule.
- A Scene should not be a mechanical slice of a long article.
- Events, participants, causes, consequences, institutions, and competing
  perspectives may lead to other Cards.
- A navigation destination must have `target: { cardId }`. Its target may also
  include an optional `sceneId` to identify the most relevant section.
- Public navigation opens at the target Card's first Scene by default. Only an
  explicitly approved `entry: { kind: 'targetScene' }` exception may open at
  `target.sceneId`.
- A Scene ID may be used to restore reading position or address a section, but
  Card identity remains the primary route and product identity.
- Navigation copy must explain the value of the next perspective without
  repeating the same summary several times.
- Navigation identity and navigation placement are separate concerns.
- Local display order belongs to the placement, not to a global navigation
  object.
- The same navigation target may appear inline, in optional media, or at the
  end of a Card with different placements.
- Do not display “click to enter,” “context node,” “Scene,” “Card,” or similar
  system instructions when visual design already communicates interactivity.

## Event rules

An Event should be independently queryable and contains:

- a stable ID;
- a concise declarative title;
- a normalized time span;
- participant entity IDs;
- evidence or claim blocks;
- source IDs;
- internal editorial review.

Predecessor, consequence, and other reusable Event relationships belong in
typed `StructuralEdge` objects. Card relevance is derived from Scene Event
references, and public jumps use separate `NavigationOption` and
`NavigationPlacement` objects; these are not fields on the Event itself.

V5 requires an Event `kind`: `historicalEvent`, `historicalProcess`,
`textualTradition`, or `traditionalNarrative`. Use the last two for the
formation or transmission of texts and traditional narratives; do not present
their narrated episodes as contemporaneously attested historical events.

Do not force a single causal chain when evidence supports several explanations.
This does not require public prose to enumerate every explanation or reproduce
a scholarly debate. Use the narrowest supported synthesis in the story and keep
full alternatives in internal editorial review unless their omission would
materially change the historical meaning.
Do not confuse a later traditional account with contemporary evidence.

## Optional map and geography rules

Maps are used only when spatial context materially improves the current Scene.
A Scene without a map is fully valid.

Use a map when it helps explain:

- the spatial extent of an event;
- movement, migration, or transmission;
- relationships among historically relevant places;
- a route or distribution that is important to the narrative.

Do not show a map merely to keep the layout consistent.

Map state should describe geographic presentation, not own Scene-specific
story navigation. Scene-specific map cards or labels should be represented as
annotations or placements controlled by the current Scene presentation.

Map annotations must distinguish:

- `locatedAt`: evidence supports location at this place;
- `associatedWith`: related to the place but not precisely located there;
- `screenCallout`: interface text that makes no geographic-location claim.

Approximate boundaries, routes, teaching overlays, and anchors must remain
explicitly marked as approximate in data. User-facing approximation copy
should be concise and shown only when a map is present.

## Interface rules

1. Show stories, not database structure.
2. Use concise, declarative Card and Scene titles.
3. Keep Scene prose focused and avoid repeated conclusions.
4. Do not add “takeaway” blocks that duplicate the preceding paragraph.
5. Do not repeat the same navigation hook as both hook and summary.
6. Keep navigation cards as short as the next decision allows.
7. Optional media must correspond to the active Scene.
8. Scene transitions should be stable and should not change media merely for
   animation.
9. On mobile, preserve ordinary vertical reading and do not require hover.
10. Maintain semantic headings, keyboard navigation, focus behavior, and
    reduced-motion support.

## Technical constraints

- Static HTML, CSS, and JavaScript production output built with Vite.
- Vite and TypeScript are development dependencies; do not add a client-side
  framework or runtime package dependency without a separate approved migration.
- Use Node.js 22.18 or newer so Node-based tests can type-strip the application
  TypeScript directly; Node.js 24 LTS is the recommended local version.
- Local preview must work through `pnpm dev` and the production build through
  `pnpm build` plus `pnpm preview`; direct `file://` loading is not supported.
- Content and generated map data must remain available from local,
  version-controlled modules.
- Production-browser acceptance uses `pnpm test:browser` after `pnpm build`;
  install its local Chromium once with `pnpm run test:browser:install`.
- Do not add runtime network requests for core content or navigation.
- Do not require a remote map, remote font, or API. A local Vite server is the
  supported development and preview path.
- Preserve direct Card links, optional Scene section anchors, and refresh
  behavior.
- Preserve browser back/forward navigation and reading-position restoration.
- Preserve desktop and mobile layouts.
- Keep validation runnable after the locked pnpm development dependencies are
  installed.
- Breaking schema changes require an explicit schema version and migration
  strategy.
- Do not hide invalid data through renderer-only filtering when validation can
  reject it earlier.

## Multi-agent content integration ownership

When several agents work on content or presentation in parallel, the active
runtime must remain valid at every completed integration boundary. Unfinished
modules stay isolated from the main aggregation path until they pass
module-level checks.

### Ownership roles

#### Content Agent

A Content Agent may edit only:

- its assigned `data/<content-module>.js` or `data/<content-module>.ts`;
- the matching `assets/images/<content-module>/` directory;
- tests dedicated to that content module;
- its ContentPack review or handoff record.

A Content Agent must not edit:

- `index.html`;
- `src/main.ts`;
- `src/data/atlas-data.ts`;
- another content module;
- shared or reciprocal navigation in existing modules;
- shared integration tests;
- schema, validator, renderer, or UI code unless separately assigned that
  responsibility.

A Content Agent may propose cross-module navigation, reused IDs, loading
position, and required reciprocal links in an integration handoff, but must not
apply those shared changes directly.

#### Integration Agent

Only one Integration Agent may own shared integration files at a time. Its
scope includes:

- `index.html`;
- `src/main.ts`;
- `src/data/atlas-data.ts`;
- fixed runtime-entry and named-import graph tests;
- cross-module and reciprocal navigation changes;
- global duplicate-ID and reference resolution;
- any shared package or verification manifest affected by module loading.

Before integration begins, the Content Agent must stop editing the submitted
module. During integration, the Integration Agent temporarily owns the
submitted module only for reference wiring, stable-ID reuse, and cross-module
navigation adjustments. It must not silently rewrite approved public prose or
media choices.

If further editorial changes are required, ownership returns to the Content
Agent before integration resumes.

#### UI Agent

UI and renderer work should use small, stable, valid fixtures for most tests. A
UI Agent must not depend on an aggregate dataset that is being modified by
Content Agents or is temporarily invalid.

The live aggregate atlas should be used only for integration-level smoke tests
after content integration. UI code must not filter, skip, or repair invalid
aggregate data in order to make tests pass.

### Module-level gate

A new content module must pass its isolated gate before its named export can be
added to the ordered definitions in `src/data/atlas-data.ts`. Content modules
are not imported separately by `src/main.ts`.

The gate must include:

1. TypeScript syntax and type validation;
2. named-export and exact fourteen-collection interface validation;
3. duplicate ID checks inside the module;
4. Source and Asset provenance checks;
5. local Asset path and file-existence checks;
6. internal reference checks;
7. classification of every top-level reference as local, already present in
   the active atlas, or supplied by a pending sibling module; pending external
   references must be declared for every referenceable collection, and the
   gate must reject both undeclared use and unused declarations;
8. module-specific negative tests for invalid data where applicable.

An external reference is not an error when it is explicitly declared for
integration, but it must not be disguised as an internally resolved reference.

Passing this gate means the module is ready for integration; it does not mean
the main runtime has accepted it.

For a new or parallel staging module, run:

```text
node scripts/validate-content-module.js data/<module>.ts docs/content-packs/<module>.handoff.json
```

The handoff file is machine-readable and uses `handoffVersion: 3`. The gate
compares its module path, exported TypeScript binding, new IDs, active-atlas reuse,
pending sibling references, check results, and frozen state with the submitted
module. Active-atlas references are discovered automatically; only references
to not-yet-integrated sibling modules are declared manually. Existing active
modules are not required to pass this isolated gate retroactively when no
staging boundary exists.

Each module image directory also owns a non-runtime, version-2 `manifest.json`.
New Assets require reviewed creator, license, source URL, original dimensions,
encoded dimensions, encoded byte size, WebP format, origin, digest, and
approval status. Runtime Scene images must be local `.webp` files, smaller than
500,000 bytes, and no more than 2560 pixels on either encoded axis. Conversion
must preserve the approved crop, aspect ratio, and narrative content; inspect
the actual encoded image at desktop and mobile sizes. Do not keep a second
JPEG/PNG runtime copy after references and validation pass. Each Scene's
handoff must record its media decision. Selecting new historical media or
reusing an existing image requires at least two actually inspected candidates
and a reason for the choice. AI media and text-only exceptions require explicit
user approval.

### Integration handoff

The Content Agent must provide the Integration Agent with:

- the module filename and expected loading position;
- exported TypeScript binding;
- new top-level IDs;
- reused external IDs;
- proposed outbound navigation;
- required reciprocal navigation in existing modules;
- local Asset directory;
- module-level test results;
- unresolved integration questions.

The Integration Agent must verify this handoff against the current main runtime
rather than an earlier snapshot.

### Main-runtime integration gate

After taking exclusive integration ownership, the Integration Agent must:

1. confirm that the current main runtime is valid before changing shared files;
2. add the module's named import and definition to the aggregator in dependency order;
3. resolve global duplicate IDs and external references;
4. apply reciprocal navigation in the owning existing modules;
5. update fixed loading-order and integration tests;
6. run the complete validator;
7. run syntax checks and the full test suite;
8. run `pnpm test:browser` against the production build, then verify any
   interaction not covered by that smoke test in the Vite development or production preview, direct Card/Scene links, desktop and mobile
   navigation, coarse-pointer Preview behavior, back/forward restoration,
   reduced motion, and browser console errors;
9. synchronize README, architecture documentation, and affected workflow
   instructions.

Integration is complete only when the active aggregate runtime is valid and all
required checks pass.

### Integration status

A module that has passed its isolated gate but has not completed the
main-runtime gate must be marked `integration in progress` in the task,
ContentPack record, or another non-runtime handoff record.

Do not add an `integrationStatus` field to runtime data unless the schema
explicitly adopts and validates it. Do not partially add an unfinished module
to `src/data/atlas-data.ts`, and do not bypass the aggregator by importing it
from `src/main.ts`.

An unfinished module must remain outside the active aggregation path. Renderer
filtering, silent query filtering, try/catch suppression, or removal of invalid
objects at render time must never be used to hide incomplete integration.

### Concurrency rule

At any moment:

- multiple Content Agents may work on different modules and different Asset
  directories;
- only one Integration Agent may modify shared integration files;
- a submitted module must have one active owner;
- two agents must not edit the same content module, reciprocal-navigation block,
  aggregator, entrypoint, or fixed integration manifest concurrently.

If ownership is unclear, integration pauses until the coordinator assigns it
explicitly.

## Current implementation status

The current runtime is a Vite-built V5 prototype. React and React DOM are the
only client-side runtime dependencies and currently own only the home view:

- `index.html` loads the single `src/main.ts` Vite entrypoint.
- `src/main.ts` imports styles and the single `src/app.ts` runtime entry; `src/app.ts`
  owns the typed named-import graph for data, queries, Cards, Reader, and Map.
- `src/app.ts` coordinates the home view, Card reader, navigation, and optional
  map renderer.
- `src/home/home-view.ts` renders the React home view from typed view models;
  App remains the owner of Card opening, continuation state, history, and Reader
  orchestration.
- `src/shell/site-header.ts` renders the React brand header while App owns the
  home-navigation behavior attached to its stable data attribute.
- `src/types/runtime.ts` defines the typed consumer and authoring boundary between the
  application, the TypeScript content modules, the typed V5 aggregation/query
  modules, and the typed Reader, Cards, and Map modules.
- Runtime modules communicate through named TypeScript imports and exports; do not
  reintroduce `ATLAS_*` browser globals as a dependency bridge.
- `src/data/atlas-data.ts` contains the typed aggregation boundary for Entities, Events, StructuralEdges, Cards,
  Scenes, StructureViews, NavigationOptions, NavigationPlacements,
  CameraPresets, MapStates, Geometries, MapAnnotations, Assets, and Sources.
- `src/data/queries.ts` indexes, queries, and validates the V5 atlas; `data/query-node-runtime.js` supplies its optional Node-only filesystem adapter for Asset validation.
- `scripts/report-atlas-counts.js` reports live collection counts from the
  aggregated runtime data without writing files.
- `src/reader/card-components.ts` renders Card and Scene presentations.
- `src/reader/card-reader.ts` activates Scenes, updates history, restores scroll
  position, and dispatches presentation changes.
- `src/map/map-renderer.ts` renders a local Natural Earth SVG map and optional
  historical overlays.
- `src/data/world-physical.ts` stores the generated local Natural Earth vector,
  and `src/map/natural-earth-base.ts` is its typed filtering and bounds adapter.
- Hash routes use the Card as the primary destination and may include a Scene
  section for reading restoration and refresh stability.
- The repository keeps only the active V5 runtime and current generated map
  products; historical runtime branches are not maintained in parallel.

V5 removes `Entity.defaultCardId` and authored `Card.eventIds`. Entity-to-Card
indexes and Card Events are derived from Card and Scene ownership. It requires
non-empty Scene Event links while preserving Card-first exploration, optional
`ScenePresentation` media, and the static production runtime. The stable
presentation implementation remains in `ui/v4`, `map/v4`, and `styles/v4`;
those directory names are not the active data schema version.

## Definition of done for a new complete story

A complete Card should have, in data:

- one focused historical theme;
- one concise public title;
- one internal guiding question or editorial purpose;
- one thesis or core narrative that does not overclaim;
- an ordered set of Scenes that develops the Card's story;
- one or more related Events, derived from non-empty Scene `eventIds`;
- relevant people, communities, institutions, political entities, or
  traditions;
- at least two source-supported historical cases or evidence groups;
- curated next-step navigation;
- at least two credible sources;
- internal editorial review containing at least one limitation,
  counterexample, uncertainty, dispute, or alternative explanation.

The public interface does not need to display the internal guiding question or
editorial review in the current version.

Related Events, Entities, sources, relationships, and editorial-review entries
are data-completeness requirements. They do not all need to be named in public
story copy.

A map is not part of the completion requirement.

## Change and verification discipline

- Read this file and the actual runtime before planning changes.
- Treat executable code and tests as evidence; identify documentation drift
  rather than silently copying outdated descriptions.
- When documentation conflicts with the active entrypoint, validator, runtime
  data, executable code, or focused tests, use the executable evidence and fix
  the stale documentation. If tests disagree with the entrypoint or runtime,
  treat the conflicting test as drift that must also be resolved.
- A change to runtime paths or loading order, workflow stage count, or an
  interaction contract is incomplete until README, architecture documentation,
  fixed test manifests, and other affected instructions are synchronized in the
  same task.
- Do not hand-maintain volatile collection, Card, Scene, Asset, or test counts in
  prose documentation. Use `scripts/report-atlas-counts.js` for live atlas
  counts and keep documentation focused on responsibilities and contracts.
- Preserve unrelated worktree changes.
- Do not use destructive Git commands to discard work.
- Use `apply_patch` for manual file edits.
- Update validation whenever the schema changes.
- Add negative tests proving invalid data is rejected.
- Run syntax checks and the full relevant test suite after implementation.
- Changes to startup, routing, Reader, scrolling, or media loading must also pass
  `pnpm build` followed by `pnpm test:browser`; the Pages workflow blocks
  deployment when this production-browser gate fails.
- For interface or presentation changes, verify desktop and mobile behavior,
  direct links, back navigation, scroll restoration, and console errors.
- Do not create commits, push branches, or open pull requests unless the user
  explicitly asks.
