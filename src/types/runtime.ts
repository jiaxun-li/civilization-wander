export type EntityId = string;
export type CardId = string;
export type SceneId = string;
export type AssetId = string;

export interface TimeSpan {
  readonly start?: number;
  readonly end?: number;
  readonly label?: string;
  readonly approximate?: boolean;
}

export interface Entity {
  readonly id: EntityId;
  readonly type: string;
  readonly name: string;
  readonly canonicalSummary: string;
  readonly timeSpan?: TimeSpan;
}

export interface Card {
  readonly id: CardId;
  readonly title: string;
  readonly primaryEntityId: EntityId;
  readonly sceneIds: readonly SceneId[];
  readonly relatedEntityIds: readonly EntityId[];
  readonly introduction: string;
  readonly timeSpan: TimeSpan;
}

export type TextClaimKind =
  | 'geographyObservation'
  | 'historicalFact'
  | 'interpretation'
  | 'editorialSynthesis'
  | 'narrativeTransition'
  | 'sourceNote';

export type ClaimBlock =
  | { readonly kind: 'historicalCase'; readonly title: string; readonly text: string }
  | { readonly kind: 'mechanism'; readonly statement: string; readonly steps: readonly string[] }
  | { readonly kind: 'asset'; readonly assetId: AssetId; readonly caption?: string }
  | { readonly kind: TextClaimKind; readonly text: string };

export interface TextOnlyPresentation {
  readonly kind: 'textOnly';
}

export interface ImagePresentation {
  readonly kind: 'image' | 'imageAndText';
  readonly assetId: AssetId;
}

export interface MapPresentationConfig {
  readonly mapStateId: string;
  readonly structureViewIds: readonly string[];
  readonly caption?: string;
  readonly transition?: CameraTransition;
  readonly layers?: readonly MapPresentationLayer[];
  readonly [key: string]: unknown;
}

export type CameraTransition = 'cut' | 'ease' | 'hold';

export type MapPresentationLayer =
  | {
      readonly kind: 'navigation';
      readonly navigationOptionId: string;
      readonly annotationId: string;
    }
  | {
      readonly kind: 'entity';
      readonly entityId: EntityId;
      readonly annotationId: string;
    };

export interface MapPresentation {
  readonly kind: 'map' | 'mapAndText';
  readonly map: MapPresentationConfig;
}

export type ScenePresentation = TextOnlyPresentation | ImagePresentation | MapPresentation;

export interface Scene {
  readonly id: SceneId;
  readonly title: string;
  readonly timeSpan: TimeSpan & { readonly label: string };
  readonly timeDisplay?: 'year' | 'undatedNarrative';
  readonly contentBlocks: readonly ClaimBlock[];
  readonly eventIds: readonly string[];
  readonly presentation: ScenePresentation;
}

export interface ImageAsset {
  readonly id: AssetId;
  readonly type: 'image';
  readonly src: string;
  readonly title: string;
  readonly alt: string;
}

export interface DataAsset {
  readonly id: AssetId;
  readonly type: 'data';
  readonly src: string;
  readonly title: string;
  readonly alt: string;
}

export type Asset = ImageAsset | DataAsset;

export type ContentRecord = Readonly<Record<string, unknown>>;

export type ContentModuleCollectionName =
  | 'sources'
  | 'entities'
  | 'events'
  | 'structuralEdges'
  | 'cards'
  | 'scenes'
  | 'structureViews'
  | 'navigationOptions'
  | 'navigationPlacements'
  | 'cameraPresets'
  | 'mapStates'
  | 'geometries'
  | 'mapAnnotations'
  | 'assets';

export type ContentModule = {
  readonly [Collection in ContentModuleCollectionName]: readonly ContentRecord[];
};

export interface AtlasData {
  readonly schemaVersion: 5;
  readonly entities: readonly Entity[];
  readonly cards: readonly Card[];
  readonly scenes: readonly Scene[];
  readonly assets: readonly Asset[];
  readonly [collection: string]: unknown;
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly counts: Readonly<Record<string, number>>;
}

export interface AtlasQueries {
  validateAtlasData(candidate?: unknown): ValidationResult;
  getCard(id: CardId | null | undefined): Card | null | undefined;
  getScene(id: SceneId | null | undefined): Scene | null | undefined;
  getEntity(id: EntityId | null | undefined): Entity | null | undefined;
  getAsset(id: AssetId | null | undefined): Asset | null | undefined;
  getEntityTypeLabel(type: string): string | null;
  getScenesForCard(cardId: CardId | null | undefined): readonly Scene[];
  getNavigationOption(id: string | null | undefined): NavigationOption | null | undefined;
  getNavigationEntrySceneId(option: NavigationOption): SceneId | null;
  getMapState(id: string | null | undefined): MapState | null | undefined;
  getStructureView(id: string | null | undefined): StructureView | null | undefined;
  getStructuralEdge(id: string | null | undefined): StructuralEdge | null | undefined;
  getNavigationPlacementsForScene(sceneId: SceneId, slot?: string): readonly NavigationPlacement[];
  getNavigationPlacementsForCard(cardId: CardId, slot?: string): readonly NavigationPlacement[];
  getCameraPreset(id: string | null | undefined): CameraPreset | null | undefined;
  getGeometry(id: string | null | undefined): HistoricalGeometry | null | undefined;
  getMapAnnotation(id: string | null | undefined): MapAnnotation | null | undefined;
  getOwnerCardForScene(sceneId: SceneId): Card | null | undefined;
  getStructureViewItems(viewId: string, focus: GraphEndpoint | null): readonly StructuralEdge[];
}

export interface NavigationOption {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly target: {
    readonly cardId: CardId;
    readonly sceneId?: SceneId;
  };
  readonly basis?:
    | { readonly kind: 'structuralEdge'; readonly structuralEdgeId: string }
    | { readonly kind: 'relatedCard'; readonly cardId: CardId }
    | { readonly kind: 'event'; readonly eventId: string };
}

export interface NavigationPlacement {
  readonly id?: string;
  readonly navigationOptionId: string;
  readonly visible: boolean;
  readonly interactive: boolean;
}

export interface StructuralEdge {
  readonly id: string;
  readonly label?: { readonly forward?: string; readonly reverse?: string };
  readonly summaries?: { readonly canonical?: string };
}

export interface GraphEndpoint {
  readonly kind: string;
  readonly id: string;
}

export interface StructureView {
  readonly id: string;
  readonly family: string;
  readonly title: string;
  readonly [key: string]: unknown;
}

export interface NavigationTrailEntry {
  readonly cardId: CardId;
  readonly sceneId: SceneId;
  readonly scrollY: number;
  readonly navigationId: string | null;
}

export interface LastReadSnapshot {
  readonly atlasV5: true;
  readonly cardId: CardId;
  readonly sceneId: SceneId;
  readonly scrollY: number;
  readonly navigationStack: readonly NavigationTrailEntry[];
}

export interface AtlasHistoryState {
  readonly atlasV5?: boolean;
  readonly atlasHome?: boolean;
  readonly cardId?: CardId;
  readonly sceneId?: SceneId;
  readonly scrollY?: number;
  readonly navigationId?: string | null;
  readonly entrySource?: 'home' | 'card';
  readonly navigationStack?: readonly NavigationTrailEntry[];
}

export interface ReaderState {
  activeCardId: CardId | null;
  activeSceneId: SceneId | null;
  entryContext: ReaderContext | null;
  navigationStack: NavigationTrailEntry[];
}

export type SceneDirection = 'forward' | 'backward' | 'stationary';

export interface ReaderContext {
  readonly cardId?: CardId;
  readonly fromSceneId?: SceneId | null;
  readonly toSceneId?: SceneId;
  readonly direction?: SceneDirection;
  readonly trigger?: string;
  readonly inheritedMedia?: boolean;
  readonly presentationSceneId?: SceneId;
  readonly presentationScene?: Scene;
  readonly sourcePresentation?: ScenePresentation;
}

export interface ResolvedSceneMedia {
  readonly presentation: ScenePresentation;
  readonly presentationScene: Scene;
  readonly inherited: boolean;
}

export interface RenderCardOptions {
  readonly restoreScrollY?: number | null;
  readonly replaceScrollY?: number | null;
  readonly focusHeading?: boolean;
  readonly preserveHistorySnapshot?: boolean;
  readonly navigationStack?: readonly NavigationTrailEntry[];
  readonly trigger?: string;
}

export interface CardReader {
  readonly state: ReaderState;
  start(cardId?: CardId): ReaderState;
  destroy(): void;
  renderCard(cardId: CardId, sceneId?: SceneId | null, options?: RenderCardOptions): unknown;
  announceScene(scene: Scene, updateHistory?: boolean, trigger?: string): void;
  followNavigation(navigationId: string): boolean;
  handlePopState(event: PopStateEvent): void;
  replaceHistorySnapshot(): void;
}

export interface CardComponents {
  renderContentBlock(block: ClaimBlock): string;
  renderSmallCard(
    navigationId: string,
    options?: { readonly placement?: Pick<NavigationPlacement, 'visible' | 'interactive'> }
  ): string;
  renderMainCard(cardId: CardId, options?: { activeSceneId?: SceneId | null }): string;
  renderPreviewCard(navigationId: string): string;
  targetContext(navigationId: string): CardTargetContext | null;
}

export interface CardTargetContext {
  readonly navigation: NavigationOption;
  readonly card: Card;
  readonly entity: Entity | null;
  readonly sceneId: SceneId | null;
}

export interface CardsModule {
  escapeHtml(value?: unknown): string;
  formatTimeSpan(timeSpan?: TimeSpan): string;
  createCardComponents(options: { data: AtlasData; queries: AtlasQueries }): CardComponents;
}

export interface CardReaderModule {
  buildCardHash(cardId: CardId, sceneId: SceneId): string;
  parseCardHash(hash?: string): { cardId: CardId; sceneId: SceneId | null } | null;
  deriveSceneDirection(
    queries: AtlasQueries,
    cardId: CardId,
    fromSceneId: SceneId | null,
    toSceneId: SceneId
  ): SceneDirection;
  resolveSceneMedia(queries: AtlasQueries, cardId: CardId, sceneId: SceneId): ResolvedSceneMedia | null;
  createCardReader(options: {
    data: AtlasData;
    queries: AtlasQueries;
    components: CardComponents;
    root: HTMLElement;
    windowRef: AtlasRuntimeGlobal;
    onPresentationChange: (presentation: ScenePresentation, scene: Scene, context: ReaderContext) => void;
    onMapStateChange: (mapState: MapState | null, scene: Scene, mapConfig: MapPresentationConfig | null, context: ReaderContext) => void;
    onStructureViewsChange: (views: readonly StructureView[], scene: Scene, context: ReaderContext) => void;
    onCardChange: (card: Card, scene: Scene) => void;
  }): CardReader;
}

export interface MapState {
  readonly id: string;
  readonly cameraPresetId: string;
  readonly layers: readonly { readonly geometryId: string }[];
}

export type Position = readonly [number, number];
export type Bounds = readonly [number, number, number, number];

export type GeometryShape =
  | { readonly type: 'Point'; readonly coordinates: Position }
  | { readonly type: 'MultiPoint'; readonly coordinates: readonly Position[] }
  | { readonly type: 'LineString'; readonly coordinates: readonly Position[] }
  | { readonly type: 'MultiLineString'; readonly coordinates: readonly (readonly Position[])[] }
  | { readonly type: 'Polygon'; readonly coordinates: readonly (readonly Position[])[] }
  | { readonly type: 'MultiPolygon'; readonly coordinates: readonly (readonly (readonly Position[])[])[] };

export interface HistoricalGeometry {
  readonly id: string;
  readonly geometry: GeometryShape;
  readonly approximate: boolean;
  readonly label: string;
}

export interface CameraPreset {
  readonly id?: string;
  readonly center: Position;
  readonly scale: number;
}

export type ScreenPlacement =
  | 'auto'
  | 'above'
  | 'below'
  | 'left'
  | 'right'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

export type AnnotationAnchor =
  | { readonly kind: 'geo'; readonly coordinates: Position }
  | { readonly kind: 'screen' };

export interface MapAnnotation {
  readonly id: string;
  readonly anchor: AnnotationAnchor;
  readonly placement: ScreenPlacement;
  readonly label?: string;
}

export interface NaturalEarthPath {
  readonly d: string;
  readonly bounds?: Bounds | null;
}

export interface GeneratedNaturalEarthPath {
  readonly d: string;
  readonly rank?: number;
  readonly [property: string]: unknown;
}

export interface GeneratedNaturalEarthTerrain {
  readonly kind: string;
  readonly rank: number;
  readonly name: string;
  readonly label: Position;
}

export interface GeneratedNaturalEarthVector {
  readonly size: number;
  readonly landPath: string;
  readonly lakes: readonly GeneratedNaturalEarthPath[];
  readonly rivers: readonly GeneratedNaturalEarthPath[];
  readonly terrain: readonly GeneratedNaturalEarthTerrain[];
  readonly source: string;
  readonly sourceUrl: string;
}

export interface NaturalEarthData {
  readonly size: number;
  readonly land?: readonly NaturalEarthPath[];
  readonly landPath?: string;
  readonly lakes: readonly NaturalEarthPath[];
  readonly rivers: readonly NaturalEarthPath[];
}

export interface NaturalEarthAdapterModule {
  readonly base: NaturalEarthData | null;
  readonly sourcePath: string;
  readonly dataset: string;
  pathBounds(pathData: unknown): Bounds | null;
  splitPath(pathData: unknown): readonly NaturalEarthPath[];
  createNaturalEarthBase(vector: GeneratedNaturalEarthVector): NaturalEarthData;
}

export interface AtlasMap {
  renderMapState(
    mapState: MapState | null,
    scene?: Scene | null,
    mapConfig?: MapPresentationConfig | null,
    context?: ReaderContext | null
  ): boolean;
  setStructureViews(
    views?: readonly StructureView[],
    scene?: Scene | null,
    context?: ReaderContext | null
  ): void;
  clear(): void;
  destroy(): void;
  getActiveMapState(): MapState | null;
  getActiveScene(): Scene | null;
  getActiveMapConfig(): MapPresentationConfig | null;
  getActiveCameraTransform(): string;
  getGeometryCacheSize(): number;
}

export interface MapModule {
  readonly VIEW_FAMILIES: ReadonlySet<string>;
  readonly SCREEN_POSITIONS: Readonly<Record<ScreenPlacement, Position>>;
  projectPoint(position: Position, size?: number): [number, number];
  geometryToPath(geometry: GeometryShape | null | undefined, size?: number): string;
  cameraTransform(cameraPreset: CameraPreset | null | undefined, size?: number): string;
  cameraViewportBounds(cameraPreset: CameraPreset | null | undefined, size?: number, padding?: number): Bounds;
  boundsIntersect(left: unknown, right: unknown): boolean;
  selectRegionalPaths(
    items?: readonly NaturalEarthPath[],
    cameraPresets?: readonly CameraPreset[] | CameraPreset,
    size?: number
  ): readonly NaturalEarthPath[];
  cameraPresetsForCard(
    queries: AtlasQueries,
    cardId: CardId | null,
    fallbackPreset?: CameraPreset | null
  ): CameraPreset[];
  projectAnnotation(
    annotation: Pick<MapAnnotation, 'anchor'> | null | undefined,
    cameraPreset: CameraPreset,
    size?: number
  ): [number, number] | null;
  createNaturalEarthMap(options: {
    container: HTMLElement;
    data: AtlasData;
    queries: AtlasQueries;
    naturalEarth: NaturalEarthData;
    documentRef: Document;
    windowRef: AtlasRuntimeGlobal;
    onNavigate?: (navigationId: string) => void;
  }): AtlasMap;
}

export interface AtlasApp {
  readonly brand: BrandConfig;
  readonly data: AtlasData;
  readonly queries: AtlasQueries;
  readonly reader: CardReader;
  openCard(cardId: CardId, sceneId?: SceneId | null, options?: { resumeSnapshot?: LastReadSnapshot | null }): boolean;
  showHome(options?: { push?: boolean }): void;
  getMap(): AtlasMap | null;
  getState(): {
    view: 'home' | 'card';
    cardId: CardId | null;
    sceneId: SceneId | null;
    mapStateId: string | null;
  };
}

export interface BrandConfig {
  readonly name: string;
  readonly tagline: string;
  readonly shortTagline: string;
  readonly startCardId: CardId;
}

export interface AtlasRuntimeGlobal extends Window {
  readonly IntersectionObserver?: typeof IntersectionObserver;
  ATLAS_V5_DATA?: AtlasData;
  ATLAS_V5_QUERIES?: AtlasQueries;
  ATLAS_V5_CARDS?: CardsModule;
  ATLAS_V5_CARD_READER?: CardReaderModule;
  ATLAS_V5_MAP?: MapModule;
  ATLAS_WORLD_VECTOR?: GeneratedNaturalEarthVector;
  ATLAS_NATURAL_EARTH?: NaturalEarthAdapterModule;
  ATLAS_V5_APP_INTERNALS?: Readonly<Record<string, unknown>>;
  ATLAS_V5_APP?: AtlasApp;
  ATLAS_BRAND?: BrandConfig;
  navigator: Navigator & { readonly connection?: { readonly saveData?: boolean } };
}
