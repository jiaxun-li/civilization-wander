export type EntityId = string;
export type CardId = string;
export type SceneId = string;
export type AssetId = string;

export interface Entity {
  readonly id: EntityId;
  readonly type: string;
  readonly name: string;
  readonly canonicalSummary: string;
}

export interface Card {
  readonly id: CardId;
  readonly title: string;
  readonly primaryEntityId: EntityId;
  readonly sceneIds: readonly SceneId[];
}

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
  readonly [key: string]: unknown;
}

export interface MapPresentation {
  readonly kind: 'map' | 'mapAndText';
  readonly map: MapPresentationConfig;
}

export type ScenePresentation = TextOnlyPresentation | ImagePresentation | MapPresentation;

export interface Scene {
  readonly id: SceneId;
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
}

export interface NavigationOption {
  readonly id: string;
  readonly target: {
    readonly cardId: CardId;
  };
}

export interface StructureView {
  readonly id: string;
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
  renderMainCard(cardId: CardId, options?: { activeSceneId?: SceneId | null }): string;
  renderPreviewCard(navigationId: string): string;
}

export interface CardsModule {
  escapeHtml(value?: unknown): string;
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
  readonly [key: string]: unknown;
}

export interface AtlasMap {
  renderMapState(mapState: MapState, scene: Scene, mapConfig: MapPresentationConfig, context: ReaderContext): void;
  setStructureViews(views: readonly unknown[], scene: Scene, context: ReaderContext): void;
  clear(): void;
  destroy(): void;
  getActiveMapState(): MapState | null;
}

export interface MapModule {
  createNaturalEarthMap(options: {
    container: HTMLElement;
    data: AtlasData;
    queries: AtlasQueries;
    naturalEarth: unknown;
    documentRef: Document;
    windowRef: AtlasRuntimeGlobal;
    onNavigate: (navigationId: string) => void;
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
  ATLAS_NATURAL_EARTH?: { readonly base?: unknown };
  ATLAS_V5_APP_INTERNALS?: Readonly<Record<string, unknown>>;
  ATLAS_V5_APP?: AtlasApp;
  ATLAS_BRAND?: BrandConfig;
  navigator: Navigator & { readonly connection?: { readonly saveData?: boolean } };
}
