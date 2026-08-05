import '../styles.css';
import '../styles/v4/cards.css';
import '../styles/v4/map.css';

// Preserve the established V5 runtime dependency order across the typed
// content modules and runtime adapters.
import './data/world-physical.ts';
import './data/atlas-data.ts';
import './data/queries.ts';
import './reader/card-components.ts';
import './reader/card-reader.ts';
import './map/natural-earth-base.ts';
import './map/map-renderer.ts';
import './app.ts';
