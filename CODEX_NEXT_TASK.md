# Suggested next Codex task

Improve this static historical-geography prototype without changing its core product idea.

Tasks:

1. Add inline category chips to each paragraph: `地理事实`, `机制推论`, `历史案例`, or `限制`.
2. Add collapsible source notes below each paragraph. Extend `data/content.js` so individual paragraphs can hold source IDs.
3. Add keyboard navigation for the three story tabs using Left/Right arrow keys.
4. Improve SVG label collision handling with a small manual `dx`/`dy` option in each feature object.
5. Preserve direct `file://` compatibility and do not add a build system or external dependencies.
6. Update README and keep the visual design restrained.

Before editing, read `AGENTS.md`. After editing, open the page in Chromium, test all three tabs at desktop and mobile widths, and report any remaining content or layout limitations.
