import '../styles.css';
import '../styles/v4/cards.css';
import '../styles/v4/map.css';

// Preserve the established V5 runtime dependency order while the remaining
// JavaScript modules are migrated to TypeScript incrementally.
import '../data/world-physical.js';
import '../data/mesopotamia.js';
import '../data/ancient-egypt.js';
import '../data/ancient-india.js';
import '../data/ancient-china.js';
import '../data/late-bronze-age.js';
import '../data/aegean.js';
import '../data/iron-age-near-east.js';
import '../data/atlas-data.js';
import './data/queries.ts';
import './reader/card-components.ts';
import './reader/card-reader.ts';
import '../assets/natural-earth/base.js';
import './map/map-renderer.ts';
import './app.ts';
