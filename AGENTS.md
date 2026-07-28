# Coding agent instructions

## Product principle

This is not a travel map, country quiz, or collection of wonders. It is a curated historical-geography atlas that answers: “Why did history unfold this way in this place?”

## Non-negotiable rules

1. Do not add hotels, roads, shops, tourist reviews, or generic POIs.
2. Organize content by geographic mechanisms: core regions, corridors, basins, barriers, river systems, steppe belts, straits.
3. Keep observable geography separate from historical inference.
4. Every story must contain a caveat against geographic determinism.
5. Do not fabricate geographic boundaries. Approximate teaching overlays must be explicitly labeled as approximate.
6. Chinese and non-Western regions are first-class content, not token additions.
7. Keep the prototype dependency-free until content quality is validated.

## Current technical architecture

- Static HTML/CSS/JavaScript.
- Esri World Imagery raster tiles are rendered without label/reference layers in a dependency-free SVG tile layer using Web Mercator coordinates.
- The first level is a China-and-neighbors overview; selecting a region opens its detail map and article.
- Geographic overlays are converted from longitude/latitude to Web Mercator coordinates in `app.js`.
- Content lives in `data/content.js` so the prototype works from `file://` without a local server.

## Definition of done for a new story

- 1 precise question.
- 1 thesis that does not overclaim.
- 3–8 map features.
- Geography observations.
- Mechanism chain.
- At least two historical cases.
- One limitation/counterexample.
- At least two credible sources.
