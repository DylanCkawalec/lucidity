# Lucidity

Self-hosted workspace for visual thinking: mind maps, flowcharts, templates, Mermaid-to-diagram import, and a Lucid-style canvas editor. Data can be stored locally via PostgreSQL so diagrams persist between sessions.

## Technical summary

- **Frontend:** Single-page app served by a small Node HTTP server (`server.mjs`), with an SVG-based editor (shapes, connectors, themes, export).
- **Layout + sizing:** Uses [`@chenglou/pretext`](https://github.com/DylanCkawalec/pretext.git) for text measurement/wrapping and shape minimum-size enforcement for reliable canvas sizing.
- **Persistence:** Optional PostgreSQL for saved maps and document metadata; the UI reflects save/sync state in the header.
- **Scope:** Template gallery, stencil libraries (including flowchart symbols), Gantt-style scheduling view, and “diagram as code” flows for Mermaid.

## Recent upgrades

- MERMATE-inspired visual refresh with a premium dark-professional token system, refined panels, controls, and canvas chrome.
- Expanded stencil library tooling:
  - Searchable left-panel library with metadata tags and dimensions.
  - New expert categories for cloud, data, AI/agentic, backend, and ops/security architecture.
- Expanded architecture template coverage:
  - Cloud/infrastructure: Microservice Mesh, Kubernetes Platform, Event-Driven Platform.
  - AI/agentic: AI Agentic System, RAG Pipeline, MLOps Loop.
  - Data: Data Lakehouse, Streaming Analytics.
  - Security/ops: Zero Trust Architecture, SRE Observability, Enterprise Integration.
- Canvas precision and interaction enhancements:
  - Refined wheel-zoom normalization for smoother navigation across input devices.
  - Precision connector authoring with manual bend points and segment drag handles.
- Regression protection with Playwright interaction tests for drag/snap/reconnect/inline-edit flows.

## Screenshots

### Home

Recents, quick starts, and map library entry points.

![Home](docs/images/home.png)

### All maps

Browse maps and jump into templates (mind map, logic chart, org chart, and more).

![All maps](docs/images/all-maps.png)

### Templates

Choose a starting layout across basic, knowledge, planning, and other categories.

![Templates](docs/images/templates.png)

### Editor

Canvas with shape library, formatting, and properties for the selected element.

![Editor](docs/images/editor.png)

### Mind map canvas

Hierarchical topics, relationships, and free positioning on the grid.

![Mind map canvas](docs/images/mind-map-canvas.png)

### Flowchart stencils

Standard process/decision/data symbols for process diagrams.

![Flowchart stencils](docs/images/stencils-flowchart.png)

### Gantt

Task name, start, duration, and a timeline grid for schedule-style views.

![Gantt](docs/images/gantt.png)

### Mermaid / diagram-as-code

Start from Mermaid to build an editable diagram.

![Mermaid diagram as code](docs/images/mermaid-diagram-as-code.png)

### Share

Collaboration entry point from the diagram toolbar.

![Share](docs/images/share.png)

## Run locally

**Requirements:** Node.js 18+ and npm.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start PostgreSQL (bundled Compose file):

   ```bash
   npm run db:start
   ```

3. Start the app:

   ```bash
   npm start
   ```

4. Open **http://127.0.0.1:4173** in your browser.

The default database URL targets `127.0.0.1:5433` with user/password/database `lucidity`. Override with `DATABASE_URL` if you use another Postgres instance. Optional: set `PORT` or `HOST` to change the listen address.

End-to-end tests (Playwright):

```bash
npm run test:e2e
```

## Repository

https://github.com/DylanCkawalec/lucidity.git
