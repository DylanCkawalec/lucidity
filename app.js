import { layoutWithLines, prepareWithSegments } from './node_modules/@chenglou/pretext/dist/layout.js';

const STORAGE_KEYS = {
  documents: 'lucidity.documents.v3',
  settings: 'lucidity.settings.v3',
};

const VIEW = {
  HOME: 'home',
  EDITOR: 'editor',
};

const HOME_SECTIONS = {
  myWorks: 'my-works',
  allMaps: 'all-maps',
  shared: 'shared',
  trash: 'trash',
};

const AI_MODES = [
  { id: 'opseeq', label: 'Opseeq', description: 'Prefers the Opseeq v5 gateway and falls back to local Kimi on Ollama when the gateway is offline.' },
  { id: 'kimi', label: 'Kimi', description: 'Uses your Kimi 2.5 model from local Ollama when available.' },
  { id: 'ollama', label: 'Ollama', description: 'Uses the selected local Ollama model directly.' },
];

const DOCK_ITEMS = [
  { id: 'library', label: 'Library', icon: gridIcon() },
  { id: 'themes', label: 'Themes', icon: paletteIcon() },
  { id: 'mermaid', label: 'Mermaid', icon: codeIcon() },
  { id: 'opseeq', label: 'Opseeq', icon: sparkIcon() },
];

const GUIDE_STEPS = [
  {
    title: '3 Must-Know Shortcuts',
    accent: 'mint',
    illustration: 'shortcut',
    description: 'Enter adds a sibling topic. Tab adds a child topic. Delete removes the current selection.',
    bullet: ['Enter for a sibling topic.', 'Tab for a subtopic.', 'Delete to remove a topic or edge.'],
  },
  {
    title: 'AI for Inspiration',
    accent: 'sky',
    illustration: 'ai',
    description: 'Select any node and run Opseeq to expand the chart with new branches, dependencies, or next actions.',
    bullet: ['Select a node first.', 'Choose Opseeq, Kimi, or Ollama.', 'Use a concrete prompt for better structure.'],
  },
  {
    title: 'Share as PNG',
    accent: 'sun',
    illustration: 'share',
    description: 'Sharing in this rebuild is intentionally simple: export the current diagram as a clean PNG snapshot of the canvas.',
    bullet: ['Use the Share button in the top bar.', 'Export PNG captures the whole diagram.', 'The export fits the content automatically.'],
  },
];

const THEME_LIBRARY = [
  {
    id: 'studio',
    name: 'Studio White',
    background: '#f7f7f4',
    surface: '#ffffff',
    line: '#7a7f8e',
    ink: '#151826',
    accent: '#3558ff',
    palette: ['#ef7b72', '#f7ab5f', '#8fd8d0', '#9acfa7', '#8bb4ff', '#f1d27d'],
  },
  {
    id: 'atlas',
    name: 'Atlas Grid',
    background: '#f1f6fb',
    surface: '#ffffff',
    line: '#6f7f95',
    ink: '#0e223a',
    accent: '#0f7bc0',
    palette: ['#4cb6d6', '#7cb3ff', '#8ad3b5', '#f3c46b', '#f28d82', '#97a7e8'],
  },
  {
    id: 'paper',
    name: 'Paper Flow',
    background: '#fbf7ef',
    surface: '#fffdf8',
    line: '#8e7f6a',
    ink: '#2e2419',
    accent: '#d86f28',
    palette: ['#d86f28', '#76b39d', '#9f7aea', '#e9c46a', '#669bbc', '#ef476f'],
  },
  {
    id: 'signal',
    name: 'Signal Mint',
    background: '#f4faf8',
    surface: '#ffffff',
    line: '#61887b',
    ink: '#14201d',
    accent: '#22a06b',
    palette: ['#22a06b', '#5eb1ff', '#f1ae4b', '#f2736b', '#7a82f0', '#7ad3c4'],
  },
];

const LIBRARY_GROUPS = [
  { key: 'standard', title: 'Standard', description: 'Core topic and content blocks.' },
  { key: 'flowcharts', title: 'Flowcharts', description: 'Process and decision symbols.' },
  { key: 'shapes', title: 'Shapes', description: 'Geometry for custom composition.' },
  { key: 'others', title: 'Others', description: 'Utility visuals and helper cards.' },
  { key: 'containers', title: 'Containers', description: 'Frames for lanes, boards, and grouped contexts.' },
  { key: 'cloud', title: 'Cloud', description: 'Cloud and network architecture stencils.' },
  { key: 'data', title: 'Data', description: 'Data platform and storage building blocks.' },
  { key: 'aiagentic', title: 'AI + Agentic', description: 'Copilot, model, and agent workflow symbols.' },
  { key: 'backend', title: 'Backend', description: 'API, service, and runtime components.' },
  { key: 'opssecurity', title: 'Ops + Security', description: 'Observability, reliability, and security views.' },
];

const LIBRARY_SECTIONS = {
  standard: [
    { id: 'rounded-rect', label: 'Topic', width: 200, height: 76, tags: ['mindmap', 'core', 'topic'] },
    { id: 'rect', label: 'Rectangle', width: 180, height: 72, tags: ['general', 'block'] },
    { id: 'pill', label: 'Pill', width: 180, height: 64, tags: ['label', 'endpoint'] },
    { id: 'terminator', label: 'Terminator', width: 186, height: 66, tags: ['start', 'end'] },
    { id: 'subroutine', label: 'Subroutine', width: 196, height: 78, tags: ['procedure', 'logic'] },
    { id: 'note', label: 'Note', width: 180, height: 100, tags: ['annotation', 'idea'] },
    { id: 'text', label: 'Text', width: 180, height: 48, tags: ['label', 'caption'] },
  ],
  flowcharts: [
    { id: 'diamond', label: 'Decision', width: 170, height: 110, tags: ['flow', 'branch'] },
    { id: 'parallelogram', label: 'Input', width: 180, height: 88, tags: ['io', 'input'] },
    { id: 'document', label: 'Document', width: 180, height: 92, tags: ['doc', 'report'] },
    { id: 'manual-input', label: 'Manual Input', width: 190, height: 88, tags: ['user', 'entry'] },
    { id: 'display', label: 'Display', width: 190, height: 88, tags: ['screen', 'output'] },
    { id: 'delay', label: 'Delay', width: 190, height: 88, tags: ['wait', 'latency'] },
    { id: 'off-page', label: 'Off Page', width: 170, height: 104, tags: ['jump', 'external'] },
    { id: 'connector', label: 'Connector', width: 90, height: 90, tags: ['junction', 'link'] },
    { id: 'cylinder', label: 'Database', width: 180, height: 96, tags: ['storage', 'db'] },
    { id: 'circle', label: 'Start', width: 112, height: 112, tags: ['start', 'trigger'] },
  ],
  shapes: [
    { id: 'hexagon', label: 'Hexagon', width: 170, height: 96, tags: ['shape'] },
    { id: 'triangle', label: 'Triangle', width: 150, height: 110, tags: ['shape'] },
    { id: 'pentagon', label: 'Pentagon', width: 170, height: 104, tags: ['shape'] },
    { id: 'octagon', label: 'Octagon', width: 170, height: 104, tags: ['shape'] },
    { id: 'star', label: 'Star', width: 170, height: 110, tags: ['shape', 'highlight'] },
    { id: 'chevron', label: 'Chevron', width: 170, height: 88, tags: ['flow', 'direction'] },
    { id: 'tag', label: 'Tag', width: 180, height: 84, tags: ['label'] },
    { id: 'cloud', label: 'Cloud', width: 190, height: 110, tags: ['network', 'internet'] },
  ],
  others: [
    { id: 'image-card', label: 'Image Card', width: 220, height: 140, tags: ['asset', 'media'] },
    { id: 'group-frame', label: 'Group Frame', width: 320, height: 220, tags: ['scope', 'group'] },
    { id: 'callout', label: 'Callout', width: 220, height: 120, tags: ['comment', 'annotation'] },
    { id: 'table', label: 'Table', width: 240, height: 140, tags: ['matrix', 'grid'] },
    { id: 'caption', label: 'Caption', width: 220, height: 56, tags: ['title', 'label'] },
  ],
  containers: [
    { id: 'lane', label: 'Lane', width: 460, height: 160, tags: ['swimlane', 'workflow'] },
    { id: 'board', label: 'Board', width: 420, height: 260, tags: ['canvas', 'module'] },
    { id: 'cluster', label: 'Cluster', width: 360, height: 260, tags: ['domain', 'zone'] },
  ],
  cloud: [
    { id: 'cloud', label: 'Cloud Region', width: 210, height: 118, tags: ['aws', 'gcp', 'azure', 'region'] },
    { id: 'board', label: 'VPC / Network Boundary', width: 460, height: 280, tags: ['vpc', 'subnet', 'network'] },
    { id: 'cylinder', label: 'Managed Data Store', width: 192, height: 104, tags: ['rds', 's3', 'blob'] },
    { id: 'rect', label: 'Compute Service', width: 188, height: 78, tags: ['service', 'container', 'compute'] },
    { id: 'connector', label: 'Gateway', width: 98, height: 98, tags: ['gateway', 'ingress'] },
  ],
  data: [
    { id: 'cylinder', label: 'Data Warehouse', width: 200, height: 108, tags: ['warehouse', 'lakehouse'] },
    { id: 'table', label: 'Schema Table', width: 260, height: 150, tags: ['schema', 'table'] },
    { id: 'document', label: 'Batch Artifact', width: 192, height: 100, tags: ['batch', 'file'] },
    { id: 'rect', label: 'ETL Job', width: 186, height: 76, tags: ['etl', 'pipeline'] },
    { id: 'diamond', label: 'Quality Gate', width: 176, height: 116, tags: ['quality', 'validation'] },
  ],
  aiagentic: [
    { id: 'rounded-rect', label: 'Agent', width: 196, height: 76, tags: ['agent', 'planner'] },
    { id: 'pill', label: 'Skill', width: 178, height: 66, tags: ['tool', 'capability'] },
    { id: 'rect', label: 'Model Runtime', width: 206, height: 80, tags: ['llm', 'inference', 'kimi'] },
    { id: 'note', label: 'Prompt Context', width: 208, height: 112, tags: ['prompt', 'context'] },
    { id: 'chevron', label: 'Reasoning Step', width: 190, height: 92, tags: ['reasoning', 'chain'] },
  ],
  backend: [
    { id: 'rect', label: 'API Service', width: 188, height: 76, tags: ['api', 'service'] },
    { id: 'subroutine', label: 'Worker', width: 198, height: 80, tags: ['worker', 'queue'] },
    { id: 'connector', label: 'Queue', width: 102, height: 102, tags: ['queue', 'event'] },
    { id: 'terminator', label: 'External Consumer', width: 198, height: 68, tags: ['consumer', 'client'] },
    { id: 'parallelogram', label: 'I/O Adapter', width: 192, height: 92, tags: ['adapter', 'io'] },
  ],
  opssecurity: [
    { id: 'diamond', label: 'Policy Decision', width: 180, height: 118, tags: ['policy', 'authz'] },
    { id: 'callout', label: 'Alert / Incident', width: 228, height: 124, tags: ['incident', 'alert'] },
    { id: 'board', label: 'Trust Zone', width: 430, height: 268, tags: ['zone', 'boundary'] },
    { id: 'note', label: 'Runbook', width: 206, height: 110, tags: ['runbook', 'ops'] },
    { id: 'circle', label: 'Probe', width: 116, height: 116, tags: ['health', 'probe', 'telemetry'] },
  ],
};

const TEMPLATE_GROUPS = [
  {
    title: 'Basic',
    items: ['mind-map', 'logic-chart', 'brace-map', 'org-chart'],
  },
  {
    title: 'Knowledge Management',
    items: ['problem-solving', 'architecture', 'spacecraft', 'diagram-landscape'],
  },
  {
    title: 'Meeting and Planning',
    items: ['business-plan', 'release-coordination', 'workshop', 'dissertation-plan', 'performance-matrix'],
  },
  {
    title: 'Cloud and Infrastructure',
    items: ['microservice-mesh', 'kubernetes-platform', 'event-driven'],
  },
  {
    title: 'AI and Agentic',
    items: ['ai-agentic-system', 'rag-pipeline', 'mlops-loop'],
  },
  {
    title: 'Data and Analytics',
    items: ['data-lakehouse', 'streaming-analytics'],
  },
  {
    title: 'Security and Operations',
    items: ['zero-trust', 'sre-observability', 'enterprise-integration'],
  },
];

const TEMPLATE_REGISTRY = {
  'blank-canvas': { id: 'blank-canvas', name: 'Blank canvas', category: 'Basic', create: (title) => buildBlankCanvas(title || 'Blank Diagram') },
  'mind-map': { id: 'mind-map', name: 'Mind Map', category: 'Basic', create: (title) => buildMindMap(title || 'Mind Map') },
  'logic-chart': { id: 'logic-chart', name: 'Logic Chart', category: 'Basic', create: (title) => buildLogicChart(title || 'Logic Chart') },
  'brace-map': { id: 'brace-map', name: 'Brace Map', category: 'Basic', create: (title) => buildBraceMap(title || 'Brace Map') },
  'org-chart': { id: 'org-chart', name: 'Org Chart', category: 'Basic', create: (title) => buildOrgChart(title || 'Org Chart') },
  'problem-solving': { id: 'problem-solving', name: 'Steps of Problem Solving', category: 'Knowledge Management', create: (title) => buildProblemSolving(title || 'Steps of Problem Solving') },
  'architecture': { id: 'architecture', name: 'Architectural Diagram', category: 'Knowledge Management', create: (title) => buildArchitecture(title || 'Architectural Diagram') },
  'spacecraft': { id: 'spacecraft', name: 'Spacecraft', category: 'Knowledge Management', create: (title) => buildSpacecraft(title || 'Spacecraft') },
  'diagram-landscape': { id: 'diagram-landscape', name: 'Diagram Landscape', category: 'Knowledge Management', create: (title) => buildDiagramLandscape(title || 'Diagram Landscape') },
  'business-plan': { id: 'business-plan', name: 'Business Plan', category: 'Meeting and Planning', create: (title) => buildBusinessPlan(title || 'Business Plan') },
  'release-coordination': { id: 'release-coordination', name: 'Coordinating Upcoming Release 1.0', category: 'Meeting and Planning', create: (title) => buildReleaseCoordination(title || 'Coordinating Upcoming Release 1.0') },
  'workshop': { id: 'workshop', name: 'Workshop', category: 'Meeting and Planning', create: (title) => buildWorkshop(title || 'Workshop') },
  'dissertation-plan': { id: 'dissertation-plan', name: 'Dissertation Plan', category: 'Meeting and Planning', create: (title) => buildDissertationPlan(title || 'Dissertation Plan') },
  'performance-matrix': { id: 'performance-matrix', name: '9 Box Performance Pot...', category: 'Meeting and Planning', create: (title) => buildPerformanceMatrix(title || '9 Box Performance-Pot...') },
  'microservice-mesh': { id: 'microservice-mesh', name: 'Microservice Mesh', category: 'Cloud and Infrastructure', create: (title) => buildMicroserviceMesh(title || 'Microservice Mesh') },
  'kubernetes-platform': { id: 'kubernetes-platform', name: 'Kubernetes Platform', category: 'Cloud and Infrastructure', create: (title) => buildKubernetesPlatform(title || 'Kubernetes Platform') },
  'event-driven': { id: 'event-driven', name: 'Event Driven Platform', category: 'Cloud and Infrastructure', create: (title) => buildEventDrivenPlatform(title || 'Event Driven Platform') },
  'ai-agentic-system': { id: 'ai-agentic-system', name: 'AI Agentic System', category: 'AI and Agentic', create: (title) => buildAiAgenticSystem(title || 'AI Agentic System') },
  'rag-pipeline': { id: 'rag-pipeline', name: 'RAG Pipeline', category: 'AI and Agentic', create: (title) => buildRagPipeline(title || 'RAG Pipeline') },
  'mlops-loop': { id: 'mlops-loop', name: 'MLOps Loop', category: 'AI and Agentic', create: (title) => buildMlopsLoop(title || 'MLOps Loop') },
  'data-lakehouse': { id: 'data-lakehouse', name: 'Data Lakehouse', category: 'Data and Analytics', create: (title) => buildDataLakehouse(title || 'Data Lakehouse') },
  'streaming-analytics': { id: 'streaming-analytics', name: 'Streaming Analytics', category: 'Data and Analytics', create: (title) => buildStreamingAnalytics(title || 'Streaming Analytics') },
  'zero-trust': { id: 'zero-trust', name: 'Zero Trust Architecture', category: 'Security and Operations', create: (title) => buildZeroTrustArchitecture(title || 'Zero Trust Architecture') },
  'sre-observability': { id: 'sre-observability', name: 'SRE Observability', category: 'Security and Operations', create: (title) => buildSreObservability(title || 'SRE Observability') },
  'enterprise-integration': { id: 'enterprise-integration', name: 'Enterprise Integration', category: 'Security and Operations', create: (title) => buildEnterpriseIntegration(title || 'Enterprise Integration') },
};

const defaultSettings = {
  aiMode: 'opseeq',
  opseeqModel: '',
  ollamaModel: 'kimi-k2.5:cloud',
  prompt: 'Expand this node into the next useful branches for the diagram.',
};

const FONT_OPTIONS = [
  'IBM Plex Sans',
  'Liberation Sans',
  'Space Grotesk',
  'Avenir Next',
  'Georgia',
];

const labelPreparationCache = new Map();

const appElement = document.getElementById('app');
const toastRoot = document.getElementById('toast-root');

let renderRequested = false;
let persistTimer = null;
let state = createInitialState();

appElement.addEventListener('click', handleClick);
appElement.addEventListener('change', handleChange);
appElement.addEventListener('input', handleInput);
appElement.addEventListener('dblclick', handleDoubleClick);
appElement.addEventListener('pointerdown', handlePointerDown);
appElement.addEventListener('wheel', handleWheel, { passive: false });
window.addEventListener('pointermove', handlePointerMove);
window.addEventListener('pointerup', handlePointerUp);
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
window.addEventListener('blur', handleWindowBlur);
window.addEventListener('resize', handleResize);

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApp();
});

function createInitialState() {
  const documents = normalizeDocuments(readStorage(STORAGE_KEYS.documents, null) || createSeedDocuments());
  const settings = { ...defaultSettings, ...readStorage(STORAGE_KEYS.settings, {}) };
  const activeDocumentId = getRequestedDocumentId(documents) || documents[0]?.id || null;
  const shouldOpenEditor = Boolean(activeDocumentId) && shouldStartInEditor();
  const initialDoc = documents.find((doc) => doc.id === activeDocumentId) || documents[0] || null;

  return {
    route: shouldOpenEditor ? VIEW.EDITOR : VIEW.HOME,
    homeSection: HOME_SECTIONS.myWorks,
    search: '',
    documents,
    activeDocumentId,
    selectedDock: 'library',
    libraryExpanded: {
      standard: true,
      flowcharts: true,
      shapes: true,
      others: false,
      containers: true,
      cloud: false,
      data: false,
      aiagentic: false,
      backend: false,
      opssecurity: false,
    },
    librarySearch: '',
    selection: initialDoc ? { type: 'node', id: initialDoc.rootId || initialDoc.nodes[0]?.id } : null,
    createModal: {
      open: false,
      mode: 'template',
      templateId: 'mind-map',
      title: 'Mind Map',
      aiPrompt: 'Map the first useful branches for this topic.',
    },
    templateModalOpen: false,
    shareMenuOpen: false,
    settings,
    aiStatus: {
      loading: false,
      checkedAt: null,
      opseeq: { reachable: false, latencyMs: null, version: null, models: [] },
      ollama: { reachable: false, latencyMs: null, models: [], defaultModel: 'kimi-k2.5:cloud' },
    },
    aiBusy: false,
    aiResultInfo: '',
    aiError: '',
    guideStep: 0,
    history: {},
    interaction: null,
    pointerWorld: null,
    alignmentGuides: [],
    inlineEdit: null,
    spacePressed: false,
    connectionSourceId: null,
    storage: {
      loading: true,
      connected: false,
      saving: false,
      lastSavedAt: null,
      error: '',
      source: 'local',
    },
    toasts: [],
  };
}

async function bootstrapApp() {
  render();
  await hydrateDocuments();
  await refreshAiStatus();
  render();
  requestAnimationFrame(() => requestAnimationFrame(() => ensureEditorFraming()));
  setTimeout(() => ensureEditorFraming(), 60);
  setTimeout(() => ensureEditorFraming(), 220);
}

function shouldStartInEditor() {
  if (typeof window === 'undefined') return false;
  const open = new URL(window.location.href).searchParams.get('open');
  return open === 'latest' || Boolean(open);
}

function getRequestedDocumentId(documents) {
  if (typeof window === 'undefined') return null;
  const open = new URL(window.location.href).searchParams.get('open');
  if (!open) return null;
  if (open === 'latest') return documents[0]?.id || null;
  return documents.find((doc) => doc.id === open)?.id || null;
}

function render() {
  if (state.route === VIEW.HOME) {
    appElement.innerHTML = renderHomeView();
  } else {
    appElement.innerHTML = renderEditorView();
    requestAnimationFrame(() => ensureEditorFraming());
  }
  renderToasts();
}

function scheduleRender() {
  if (renderRequested) return;
  renderRequested = true;
  requestAnimationFrame(() => {
    renderRequested = false;
    render();
  });
}

function renderHomeView() {
  const filteredDocs = getVisibleDocuments();
  const templateRibbon = ['blank-canvas', 'mind-map', 'logic-chart', 'brace-map', 'org-chart'];

  return `
    <div class="shell shell-home">
      <aside class="app-nav">
        <div class="nav-header">
          <div class="brand-mark">◩</div>
          <div>
            <div class="nav-title">My Works</div>
            <div class="nav-subtitle">Self-hosted Lucid intelligence</div>
          </div>
        </div>
        <button class="primary-btn wide" data-action="open-create-modal" data-mode="ai">Create with AI</button>
        <div class="nav-section">
          <button class="nav-item ${state.homeSection === HOME_SECTIONS.myWorks ? 'is-active' : ''}" data-action="set-home-section" data-section="${HOME_SECTIONS.myWorks}">Recents</button>
        </div>
        <div class="nav-caption">Starred</div>
        <p class="nav-help">Hover over any map and click the star to add it here.</p>
        <div class="nav-section nav-spread">
          ${renderHomeNavButton('All Maps', HOME_SECTIONS.allMaps)}
          ${renderHomeNavButton('Shared', HOME_SECTIONS.shared)}
          ${renderHomeNavButton('Trash', HOME_SECTIONS.trash)}
        </div>
      </aside>
      <main class="home-main">
        <header class="home-toolbar">
          <div>
            <h1>${state.homeSection === HOME_SECTIONS.allMaps ? 'All Maps' : 'Recents'}</h1>
            <p>Lucidity rebuild: local diagrams, template-first creation, and Opseeq-assisted expansion.</p>
          </div>
          <div class="toolbar-actions">
            <label class="search-input">
              ${searchIcon()}
              <input type="search" placeholder="Search file" value="${escapeAttr(state.search)}" data-field="home-search" />
            </label>
            <button class="ghost-btn" data-action="open-create-modal" data-mode="ai">Brainstorming</button>
            <button class="dark-btn" data-action="open-create-modal" data-mode="template">Create New</button>
          </div>
        </header>
        ${state.homeSection === HOME_SECTIONS.allMaps ? `
          <section class="template-ribbon">
            ${templateRibbon.map((templateId) => renderTemplateRibbonCard(templateId)).join('')}
            <button class="template-ribbon-card see-all" data-action="open-template-modal">
              <div class="template-ribbon-preview callout-preview">${sparkIcon()}</div>
              <div class="template-ribbon-name">See All</div>
            </button>
          </section>
        ` : ''}
        <section class="hero-panel">
          <div class="hero-illustration">
            <div class="hero-node hero-node-a"></div>
            <div class="hero-node hero-node-b"></div>
            <div class="hero-node hero-node-c"></div>
            <div class="hero-curve hero-curve-left"></div>
            <div class="hero-curve hero-curve-right"></div>
          </div>
          <h2>Ready to get started?</h2>
          <p>Organize thoughts, plan systems, import Mermaid, or let Opseeq extend your chart from a selected node.</p>
          <div class="hero-actions-grid">
            ${renderActionCard('Create with AI', 'Generate ideas and explore new possibilities', 'open-create-modal', 'ai')}
            ${renderActionCard('Brainstorming', 'Launch a structured concept map from a short brief', 'open-create-modal', 'ai')}
            ${renderActionCard('Mind Map', 'Start with a visual topic map from scratch', 'create-doc', 'mind-map')}
            ${renderActionCard('Import Mermaid', 'Convert Mermaid syntax into an editable Lucid-style diagram', 'create-doc', 'blank-canvas')}
          </div>
        </section>
        <section class="maps-section">
          <div class="section-heading">
            <div>
              <h3>${state.homeSection === HOME_SECTIONS.allMaps ? 'Maps' : 'Recent maps'}</h3>
              <p>${filteredDocs.length} diagram${filteredDocs.length === 1 ? '' : 's'} available locally.</p>
            </div>
          </div>
          <div class="doc-grid ${filteredDocs.length === 0 ? 'is-empty' : ''}">
            ${filteredDocs.length === 0 ? `<div class="empty-card">No maps match the current filter.</div>` : filteredDocs.map(renderDocumentCard).join('')}
          </div>
        </section>
      </main>
      ${state.createModal.open ? renderCreateModal() : ''}
      ${state.templateModalOpen ? renderTemplateModal() : ''}
    </div>
  `;
}

function renderHomeNavButton(label, section) {
  return `<button class="nav-item ${state.homeSection === section ? 'is-active' : ''}" data-action="set-home-section" data-section="${section}">${escapeHtml(label)}</button>`;
}

function renderActionCard(title, description, action, value) {
  const iconMap = {
    'Create with AI': sparkIcon(),
    Brainstorming: bulbIcon(),
    'Mind Map': branchIcon(),
    'Import Mermaid': uploadIcon(),
  };
  return `
    <button class="hero-action-card" data-action="${action}" data-value="${value}">
      <div class="action-icon">${iconMap[title] || sparkIcon()}</div>
      <div class="action-copy">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(description)}</span>
      </div>
      <div class="action-plus">+</div>
    </button>
  `;
}

function renderTemplateRibbonCard(templateId) {
  const template = TEMPLATE_REGISTRY[templateId];
  const preview = renderTemplatePreview(templateId);
  return `
    <button class="template-ribbon-card" data-action="create-doc" data-value="${templateId}">
      <div class="template-ribbon-preview">${preview}</div>
      <div class="template-ribbon-name">${escapeHtml(template.name)}</div>
    </button>
  `;
}

function renderDocumentCard(doc) {
  const preview = getDocumentPreviewDataUri(doc);
  return `
    <button class="doc-card" data-action="open-document" data-id="${doc.id}">
      <div class="doc-thumb">
        <img src="${preview}" alt="${escapeAttr(doc.title)} preview" />
      </div>
      <div class="doc-meta">
        <strong>${escapeHtml(doc.title)}</strong>
        <span>Last opened: ${escapeHtml(formatRelativeTime(doc.updatedAt))}</span>
      </div>
    </button>
  `;
}

function renderEditorView() {
  const doc = getActiveDocument();
  if (!doc) return renderHomeView();
  const theme = getTheme(doc.themeId);
  const selectedNode = getSelectedNode();
  const selectedEdge = getSelectedEdge();
  const aiRoute = describeCurrentAiRoute();

  return `
    <div class="shell shell-editor">
      <header class="editor-topbar">
        <div class="editor-topbar-row">
          <div class="editor-title-group">
            <button class="home-pill" data-action="back-home" data-testid="back-home" aria-label="Back home">
              ${menuIcon()}
              <span>Home</span>
            </button>
            <div>
              <div class="editor-title">${escapeHtml(doc.title)}</div>
              <div class="editor-subtitle">${escapeHtml(templateNameFor(doc.templateId || doc.type))}</div>
            </div>
          </div>
          <div class="editor-controls">
            <button class="toolbar-icon" data-action="undo" title="Undo">${undoIcon()}</button>
            <button class="toolbar-icon" data-action="redo" title="Redo">${redoIcon()}</button>
            <button class="toolbar-chip ${state.connectionSourceId ? 'is-active' : ''}" data-action="toggle-connect-mode" data-testid="toolbar-connect" title="Connect two shapes">
              ${connectIcon()}
              <span>${state.connectionSourceId ? 'Connecting' : 'Line'}</span>
            </button>
            <button class="toolbar-icon" data-action="add-sibling" title="Add sibling">${plusIcon()}</button>
            <button class="toolbar-icon" data-action="center-document" title="Center view">${focusIcon()}</button>
            <button class="toolbar-icon ${state.settings.aiMode === 'opseeq' ? 'is-accent' : ''}" data-action="set-dock" data-dock="opseeq" title="Opseeq">${sparkIcon()}</button>
          </div>
          <div class="editor-actions-right">
            ${renderStorageStatus()}
            <button class="dark-btn" data-action="toggle-share-menu">Share</button>
            <button class="toolbar-icon" data-action="set-dock" data-dock="mermaid" title="Mermaid to Lucid">${codeIcon()}</button>
            <button class="toolbar-icon" data-action="set-dock" data-dock="themes" title="Themes">${paletteIcon()}</button>
          </div>
        </div>
        <div class="editor-formatbar">
          ${renderSelectionToolbar(doc, selectedNode, selectedEdge)}
          <div class="toolbar-spacer"></div>
          <div class="toolbar-group toolbar-zoom-group">
            <button class="toolbar-icon small" data-action="zoom-out" title="Zoom out">−</button>
            <span class="zoom-readout">${Math.round(doc.zoom * 100)}%</span>
            <button class="toolbar-icon small" data-action="zoom-in" title="Zoom in">+</button>
          </div>
        </div>
        ${state.shareMenuOpen ? renderShareMenu() : ''}
      </header>
      <div class="editor-body">
        <nav class="editor-dock">
          ${DOCK_ITEMS.map((dock) => `
            <button class="dock-btn ${state.selectedDock === dock.id ? 'is-active' : ''}" data-action="set-dock" data-dock="${dock.id}" title="${escapeAttr(dock.label)}">
              <span class="dock-icon">${dock.icon}</span>
            </button>
          `).join('')}
        </nav>
        <aside class="editor-left-panel">
          ${renderLeftPanel(doc)}
        </aside>
        <section class="editor-stage-panel">
          <div class="stage-chip-row">
            <div class="stage-chip">${escapeHtml(templateNameFor(doc.templateId || doc.type))}</div>
            <div class="stage-chip stage-chip-theme">Theme: ${escapeHtml(theme.name)}</div>
            <div class="stage-chip stage-chip-model">${escapeHtml(aiRoute.label)}</div>
          </div>
          <div class="diagram-stage ${state.connectionSourceId ? 'is-connect-mode' : ''} ${state.spacePressed ? 'is-space-pan' : ''} ${state.interaction?.type === 'pan-stage' ? 'is-panning' : ''}" id="diagram-stage" data-testid="diagram-stage" style="${getStageStyle(doc, theme)}">
            ${renderEditorSvg(doc)}
            ${renderInlineEditor(doc)}
            ${renderStageHints(selectedNode)}
            ${doc.showGuide ? renderGuideCard() : ''}
          </div>
          <footer class="stage-footer">
            <div class="stage-footer-left">Page 1</div>
            <div class="stage-footer-center" data-testid="selection-summary">${renderSelectionSummary(selectedNode, selectedEdge)}</div>
            <div class="stage-footer-right">
              <span>${state.spacePressed ? 'Hand tool active' : 'Hold Space to pan • Hold Shift to bypass snap'}</span>
            </div>
          </footer>
        </section>
        <aside class="editor-right-panel">
          ${renderInspectorPanel(doc, selectedNode, selectedEdge)}
          ${renderAiPanel(aiRoute)}
        </aside>
      </div>
      ${state.createModal.open ? renderCreateModal() : ''}
      ${state.templateModalOpen ? renderTemplateModal() : ''}
    </div>
  `;
}

function renderStorageStatus() {
  if (state.storage.loading) {
    return '<span class="status-pill">Loading storage…</span>';
  }
  if (state.storage.saving) {
    return '<span class="status-pill">Saving…</span>';
  }
  if (state.storage.connected) {
    const suffix = state.storage.lastSavedAt ? ` • ${formatRelativeTime(state.storage.lastSavedAt)}` : '';
    return `<span class="status-pill is-online">Postgres${suffix}</span>`;
  }
  return `<span class="status-pill is-offline" title="${escapeAttr(state.storage.error || 'Database unavailable')}">Local only</span>`;
}

function renderSelectionToolbar(doc, selectedNode, selectedEdge) {
  if (selectedNode) {
    return `
      <div class="toolbar-group toolbar-group-wide">
        <label class="toolbar-field toolbar-field-font">
          <span>Font</span>
          <select data-field="node-font-family">
            ${FONT_OPTIONS.map((font) => `<option value="${escapeAttr(font)}" ${selectedNode.fontFamily === font ? 'selected' : ''}>${escapeHtml(font)}</option>`).join('')}
          </select>
        </label>
        <label class="toolbar-field toolbar-field-small">
          <span>Pt</span>
          <input type="number" min="10" max="72" data-field="node-font-size" value="${Math.round(selectedNode.fontSize)}" />
        </label>
        <button class="toolbar-toggle ${selectedNode.fontWeight >= 700 ? 'is-active' : ''}" data-action="toggle-node-bold" title="Bold">B</button>
        <label class="toolbar-color-field" title="Fill">
          <span>Fill</span>
          <input type="color" data-field="node-fill" value="${colorInputValue(selectedNode.fill)}" />
        </label>
        <label class="toolbar-color-field" title="Stroke">
          <span>Stroke</span>
          <input type="color" data-field="node-stroke" value="${colorInputValue(selectedNode.stroke)}" />
        </label>
        <label class="toolbar-color-field" title="Text">
          <span>Text</span>
          <input type="color" data-field="node-text-color" value="${colorInputValue(selectedNode.textColor)}" />
        </label>
        <label class="toolbar-field toolbar-field-small">
          <span>Border</span>
          <input type="number" min="1" max="16" data-field="node-stroke-width" value="${Math.round(selectedNode.strokeWidth || 2)}" />
        </label>
        <label class="toolbar-field toolbar-field-small">
          <span>W</span>
          <input type="number" min="40" max="1400" data-field="node-width" value="${Math.round(selectedNode.width)}" />
        </label>
        <label class="toolbar-field toolbar-field-small">
          <span>H</span>
          <input type="number" min="40" max="1400" data-field="node-height" value="${Math.round(selectedNode.height)}" />
        </label>
      </div>
    `;
  }

  if (selectedEdge) {
    return `
      <div class="toolbar-group toolbar-group-wide">
        <label class="toolbar-field">
          <span>Line</span>
          <select data-field="edge-style">
            ${['curve', 'straight', 'elbow'].map((style) => `<option value="${style}" ${selectedEdge.style === style ? 'selected' : ''}>${escapeHtml(capitalize(style))}</option>`).join('')}
          </select>
        </label>
        <label class="toolbar-field">
          <span>Dash</span>
          <select data-field="edge-dash">
            ${['solid', 'dashed', 'dotted'].map((dash) => `<option value="${dash}" ${selectedEdge.dash === dash ? 'selected' : ''}>${escapeHtml(capitalize(dash))}</option>`).join('')}
          </select>
        </label>
        <label class="toolbar-field toolbar-field-small">
          <span>Px</span>
          <input type="number" min="1" max="18" data-field="edge-width" value="${Math.round(selectedEdge.width)}" />
        </label>
        <label class="toolbar-field">
          <span>End</span>
          <select data-field="edge-marker-end">
            ${['arrow', 'none'].map((marker) => `<option value="${marker}" ${selectedEdge.markerEnd === marker ? 'selected' : ''}>${escapeHtml(marker === 'arrow' ? 'Arrow' : 'None')}</option>`).join('')}
          </select>
        </label>
        <label class="toolbar-color-field" title="Line color">
          <span>Color</span>
          <input type="color" data-field="edge-color" value="${colorInputValue(selectedEdge.color)}" />
        </label>
      </div>
    `;
  }

  return `
    <div class="toolbar-hint">
      Select a shape or line to style it. Hold <strong>Space</strong> to pan. Double-click a shape or line label to edit it.
    </div>
  `;
}

function renderStageHints(selectedNode) {
  if (state.interaction?.type === 'drag-edge-bend') {
    return `
      <div class="stage-banner">
        Precision connector mode.
        Drag bend and segment handles to shape the connector. Double-click a bend handle to remove it.
      </div>
    `;
  }
  if (state.interaction?.type === 'reconnect-edge') {
    return `
      <div class="stage-banner">
        Dragging line endpoint.
        Drop on another shape to reconnect. Release outside a shape to keep the existing link.
      </div>
    `;
  }
  if (state.connectionSourceId) {
    const source = getSelectedNode() || selectedNode;
    return `
      <div class="stage-banner">
        ${source ? `Connecting from <strong>${escapeHtml(source.label)}</strong>.` : 'Choose a source shape.'}
        Click a target shape to create a line. Press Esc to cancel.
      </div>
    `;
  }
  return '';
}

function getStageStyle(doc, theme) {
  const minorStep = Math.max(10, 24 * doc.zoom);
  const majorStep = Math.max(42, 120 * doc.zoom);
  const minorOffsetX = wrapGridOffset(doc.pan.x, minorStep);
  const minorOffsetY = wrapGridOffset(doc.pan.y, minorStep);
  const majorOffsetX = wrapGridOffset(doc.pan.x, majorStep);
  const majorOffsetY = wrapGridOffset(doc.pan.y, majorStep);

  return [
    `--stage-bg:${theme.background}`,
    `--stage-grid-major:${hexToRgba(theme.line, 0.22)}`,
    `--stage-grid-minor:${hexToRgba(theme.line, 0.08)}`,
    `--stage-grid-minor-step:${minorStep}px`,
    `--stage-grid-major-step:${majorStep}px`,
    `--stage-grid-minor-offset-x:${minorOffsetX}px`,
    `--stage-grid-minor-offset-y:${minorOffsetY}px`,
    `--stage-grid-major-offset-x:${majorOffsetX}px`,
    `--stage-grid-major-offset-y:${majorOffsetY}px`,
  ].join('; ');
}

function renderInlineEditor(doc) {
  if (!state.inlineEdit) return '';
  const config = getInlineEditorConfig(doc, state.inlineEdit);
  if (!config) return '';
  return `
    <div class="inline-editor" data-stop-click="true" style="left:${config.left}px; top:${config.top}px; width:${config.width}px;">
      <input
        data-inline-edit="true"
        data-testid="inline-editor-input"
        data-field="inline-edit-value"
        type="text"
        value="${escapeAttr(state.inlineEdit.value)}"
        style="font-size:${config.fontSize}px; font-weight:${config.fontWeight}; font-family:${escapeAttr(config.fontFamily)};"
      />
      <div class="inline-editor-actions">
        <button class="ghost-inline" data-action="save-inline-edit">Save</button>
        <button class="ghost-inline" data-action="cancel-inline-edit">Cancel</button>
      </div>
    </div>
  `;
}

function getInlineEditorConfig(doc, inlineEdit) {
  const stage = document.getElementById('diagram-stage');
  const stageWidth = stage?.clientWidth || 960;
  const stageHeight = stage?.clientHeight || 620;

  if (inlineEdit.type === 'node') {
    const node = doc.nodes.find((entry) => entry.id === inlineEdit.id);
    if (!node) return null;
    const width = clamp(Math.max(170, node.width * doc.zoom), 160, stageWidth - 20);
    const left = clamp(doc.pan.x + node.x * doc.zoom + 8, 10, stageWidth - width - 10);
    const top = clamp(doc.pan.y + node.y * doc.zoom + 8, 10, stageHeight - 76);
    return {
      left,
      top,
      width,
      fontSize: Math.max(12, node.fontSize * doc.zoom),
      fontWeight: node.fontWeight || 600,
      fontFamily: node.fontFamily || FONT_OPTIONS[0],
    };
  }

  if (inlineEdit.type === 'edge') {
    const edge = doc.edges.find((entry) => entry.id === inlineEdit.id);
    if (!edge) return null;
    const source = doc.nodes.find((entry) => entry.id === edge.source);
    const target = doc.nodes.find((entry) => entry.id === edge.target);
    if (!source || !target) return null;
    const geometry = getEdgeGeometry(source, target, edge);
    const width = clamp(220, 180, stageWidth - 20);
    const left = clamp(doc.pan.x + geometry.labelX * doc.zoom - width / 2, 10, stageWidth - width - 10);
    const top = clamp(doc.pan.y + geometry.labelY * doc.zoom - 24, 10, stageHeight - 76);
    return {
      left,
      top,
      width,
      fontSize: 14,
      fontWeight: 600,
      fontFamily: FONT_OPTIONS[0],
    };
  }

  return null;
}

function renderLeftPanel(doc) {
  if (state.selectedDock === 'themes') {
    return `
      <div class="left-panel-header">
        <h3>Themes</h3>
        <p>Apply a Lucid-style palette across the canvas.</p>
      </div>
      <div class="theme-grid">
        ${THEME_LIBRARY.map((theme) => `
          <button class="theme-card ${doc.themeId === theme.id ? 'is-active' : ''}" data-action="apply-theme" data-theme="${theme.id}">
            <div class="theme-swatches">${theme.palette.map((color) => `<span style="background:${color}"></span>`).join('')}</div>
            <strong>${escapeHtml(theme.name)}</strong>
            <span>${escapeHtml(theme.accent)}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  if (state.selectedDock === 'mermaid') {
    return `
      <div class="left-panel-header with-beta">
        <div>
          <h3>Diagram as code</h3>
          <p>Generate a diagram with Mermaid and convert it into editable Lucidity nodes.</p>
        </div>
        <span class="beta-pill">BETA</span>
      </div>
      <label class="field-block">
        <span>Paste Mermaid</span>
        <textarea rows="12" data-field="mermaid-source" placeholder="graph TD\n  A[Central Topic] --> B{Decision}\n  B --> C[Action]"></textarea>
      </label>
      <div class="left-panel-actions">
        <button class="primary-btn wide" data-action="import-mermaid">New Mermaid diagram</button>
      </div>
      <div class="panel-note">
        Supports common flowchart nodes and arrows. The imported diagram remains editable once placed on the canvas.
      </div>
    `;
  }

  if (state.selectedDock === 'opseeq') {
    const status = state.aiStatus;
    return `
      <div class="left-panel-header">
        <h3>Opseeq</h3>
        <p>Use your local inference stack to extend the chart.</p>
      </div>
      <div class="status-card-list">
        <div class="status-card ${status.opseeq.reachable ? 'is-online' : 'is-offline'}">
          <strong>Opseeq v5</strong>
          <span>${status.opseeq.reachable ? `Online${status.opseeq.version ? ` • ${status.opseeq.version}` : ''}` : 'Offline'}</span>
        </div>
        <div class="status-card ${status.ollama.reachable ? 'is-online' : 'is-offline'}">
          <strong>Ollama</strong>
          <span>${status.ollama.reachable ? `${status.ollama.models.length} model${status.ollama.models.length === 1 ? '' : 's'} ready` : 'Offline'}</span>
        </div>
      </div>
      <div class="quick-prompts">
        ${[
          'Expand into dependencies and downstream effects.',
          'Turn this into a step-by-step flow.',
          'Add risks, owners, and success metrics.',
          'Convert this branch into implementation tasks.',
        ].map((prompt) => `<button class="chip-btn" data-action="quick-prompt" data-prompt="${escapeAttr(prompt)}">${escapeHtml(prompt)}</button>`).join('')}
      </div>
      <button class="ghost-btn wide" data-action="refresh-ai-status">Refresh local AI status</button>
    `;
  }

  return `
    <div class="left-panel-header">
      <h3>Shapes</h3>
      <p>Expert architecture library with searchable stencils for cloud, data, AI, backend, and operations design.</p>
    </div>
    <label class="search-input library-search">
      ${searchIcon()}
      <input
        type="search"
        placeholder="Search stencils, tags, or shape ids"
        value="${escapeAttr(state.librarySearch)}"
        data-field="library-search"
      />
    </label>
    <div class="library-section-note">
      ${state.librarySearch.trim()
    ? `Showing matches for "${escapeHtml(state.librarySearch.trim())}".`
    : 'Use tags like agent, queue, policy, gateway, or lakehouse to filter quickly.'}
    </div>
    ${LIBRARY_GROUPS.map((group) => renderLibraryGroup(group, state.librarySearch)).join('')}
  `;
}

function renderLibraryGroup(group, searchQuery = '') {
  const { key, title, description } = group;
  const items = getVisibleLibraryItems(key, searchQuery);
  const total = (LIBRARY_SECTIONS[key] || []).length;
  const isOpen = state.libraryExpanded[key];
  return `
    <section class="library-group ${isOpen ? 'is-open' : ''}">
      <button class="library-group-header" data-action="toggle-library-group" data-group="${key}">
        <span>${escapeHtml(title)}${searchQuery.trim() ? ` (${items.length}/${total})` : ''}</span>
        <span>${isOpen ? '−' : '+'}</span>
      </button>
      ${description ? `<div class="library-group-note">${escapeHtml(description)}</div>` : ''}
      ${isOpen ? `
        <div class="shape-grid">
          ${items.length
    ? items.map((item) => `
            <button class="shape-card" data-action="insert-shape" data-shape="${item.id}">
              <div class="shape-icon">${renderShapeGlyph(item.id)}</div>
              <span>${escapeHtml(item.label)}</span>
              <div class="shape-card-meta">${item.width}×${item.height}</div>
              ${Array.isArray(item.tags) && item.tags.length ? `
                <div class="shape-card-tags">
                  ${item.tags.slice(0, 2).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}
                </div>
              ` : ''}
            </button>
          `).join('')
    : '<div class="shape-empty">No stencils match this filter.</div>'}
        </div>
      ` : ''}
    </section>
  `;
}

function getVisibleLibraryItems(groupKey, searchQuery = '') {
  const items = LIBRARY_SECTIONS[groupKey] || [];
  const query = String(searchQuery || '').trim().toLowerCase();
  if (!query) return items;
  const tokens = query.split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    const haystack = [
      item.id,
      item.label,
      groupKey,
      ...(Array.isArray(item.tags) ? item.tags : []),
    ].join(' ').toLowerCase();
    return tokens.every((token) => haystack.includes(token));
  });
}

function renderEditorSvg(doc) {
  const theme = getTheme(doc.themeId);
  const edgeMarkup = doc.edges.map((edge) => renderEdgeMarkup(doc, edge)).join('');
  const containerMarkup = doc.nodes.filter((node) => isContainerShape(node.shape)).map((node) => renderNodeMarkup(doc, node, theme)).join('');
  const nodeMarkup = doc.nodes.filter((node) => !isContainerShape(node.shape)).map((node) => renderNodeMarkup(doc, node, theme)).join('');

  return `
    <svg class="diagram-svg" data-testid="diagram-svg" aria-label="Lucidity diagram canvas">
      <defs>
        <marker id="arrowhead" markerWidth="12" markerHeight="12" refX="8" refY="6" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L12,6 L0,12 z" fill="context-stroke"></path>
        </marker>
      </defs>
      <g transform="translate(${doc.pan.x} ${doc.pan.y}) scale(${doc.zoom})">
        ${edgeMarkup}
        ${renderReconnectPreview(doc)}
        ${renderConnectionPreview(doc)}
        ${containerMarkup}
        ${nodeMarkup}
        ${renderSelectionMarkup(doc)}
        ${renderAlignmentGuides()}
      </g>
    </svg>
  `;
}

function renderNodeMarkup(doc, node, theme) {
  const selected = state.selection?.type === 'node' && state.selection.id === node.id;
  const stroke = selected ? theme.accent : node.stroke;
  const strokeWidth = selected ? 3 : node.strokeWidth || 2;
  const body = buildNodeShape(node, stroke, strokeWidth);
  const labelLayout = getNodeLabelLayout(node);
  const lines = labelLayout.lines;
  const textColor = node.textColor || theme.ink;
  const lineHeight = labelLayout.lineHeight;
  const startY = node.y + node.height / 2 - ((lines.length - 1) * lineHeight) / 2;
  const textAnchor = node.shape === 'caption' ? 'start' : 'middle';
  const padding = getNodePadding(node);
  const textX = node.shape === 'caption' ? node.x + padding.x : node.x + node.width / 2;
  const showHeaderLabel = isContainerShape(node.shape);

  return `
    <g
      class="diagram-node ${selected ? 'is-selected' : ''}"
      data-testid="diagram-node"
      data-node-id="${node.id}"
      data-node-label="${escapeAttr(node.label)}"
      data-node-x="${node.x}"
      data-node-y="${node.y}"
      data-node-width="${node.width}"
      data-node-height="${node.height}"
    >
      ${body}
      ${showHeaderLabel ? '' : `<text x="${textX}" y="${startY}" fill="${textColor}" font-size="${node.fontSize}" font-family="${escapeAttr(node.fontFamily || FONT_OPTIONS[0])}" font-weight="${node.fontWeight || 600}" text-anchor="${textAnchor}" dominant-baseline="middle" pointer-events="none">
        ${lines.map((line, index) => `<tspan x="${textX}" dy="${index === 0 ? 0 : lineHeight}">${escapeHtml(line)}</tspan>`).join('')}
      </text>`}
      ${showHeaderLabel ? `<text x="${node.x + 16}" y="${node.y + 22}" fill="${textColor}" font-size="12" font-family="${escapeAttr(node.fontFamily || FONT_OPTIONS[0])}" font-weight="700" pointer-events="none">${escapeHtml(node.label)}</text>` : ''}
    </g>
  `;
}

function renderEdgeMarkup(doc, edge) {
  const selected = state.selection?.type === 'edge' && state.selection.id === edge.id;
  const source = doc.nodes.find((node) => node.id === edge.source);
  const target = doc.nodes.find((node) => node.id === edge.target);
  if (!source || !target) return '';
  const geometry = getEdgeGeometry(source, target, edge);
  const stroke = selected ? getTheme(doc.themeId).accent : edge.color;
  const dasharray = getEdgeDasharray(edge);
  const markerEnd = edge.markerEnd === 'none' ? '' : 'url(#arrowhead)';
  return `
    <g
      class="diagram-edge ${selected ? 'is-selected' : ''}"
      data-testid="diagram-edge"
      data-edge-id="${edge.id}"
      data-edge-source="${edge.source}"
      data-edge-target="${edge.target}"
      data-edge-style="${edge.style || 'curve'}"
      data-edge-kind="${edge.kind || 'hierarchy'}"
      data-edge-bend-count="${Array.isArray(edge.bendPoints) ? edge.bendPoints.length : 0}"
    >
      <path class="diagram-edge-hit" d="${geometry.path}" fill="none" stroke="rgba(0,0,0,0.001)" stroke-width="${Math.max(18, edge.width + 12)}"></path>
      <path class="diagram-edge-stroke" data-testid="diagram-edge-path" d="${geometry.path}" fill="none" stroke="${stroke}" stroke-width="${selected ? edge.width + 1 : edge.width}" stroke-linecap="round" stroke-dasharray="${dasharray}" marker-end="${markerEnd}"></path>
      ${selected ? `
        <circle class="diagram-edge-handle" data-testid="edge-endpoint-handle" data-edge-handle="source" cx="${geometry.start.x}" cy="${geometry.start.y}" r="6" fill="#ffffff" stroke="${stroke}" stroke-width="2"></circle>
        <circle class="diagram-edge-handle" data-testid="edge-endpoint-handle" data-edge-handle="target" cx="${geometry.end.x}" cy="${geometry.end.y}" r="6" fill="#ffffff" stroke="${stroke}" stroke-width="2"></circle>
        ${renderEdgePrecisionHandles(edge, geometry, stroke)}
      ` : ''}
      ${edge.label ? `<text x="${geometry.labelX}" y="${geometry.labelY}" font-size="12" font-family="${escapeAttr(FONT_OPTIONS[0])}" font-weight="600" fill="${stroke}" text-anchor="middle">${escapeHtml(edge.label)}</text>` : ''}
    </g>
  `;
}

function renderEdgePrecisionHandles(edge, geometry, stroke) {
  if (edge.style === 'curve') return '';
  const bendMarkup = (geometry.bendHandles || []).map((handle) => `
    <circle
      class="diagram-edge-bend-handle"
      data-testid="edge-bend-handle"
      data-edge-bend-index="${handle.index}"
      cx="${handle.x}"
      cy="${handle.y}"
      r="5.5"
      fill="#ffffff"
      stroke="${stroke}"
      stroke-width="2"
    ></circle>
  `).join('');
  const segmentMarkup = (geometry.segmentHandles || []).map((handle) => `
    <rect
      class="diagram-edge-segment-handle"
      data-testid="edge-segment-handle"
      data-edge-segment-index="${handle.index}"
      x="${handle.x - 4.5}"
      y="${handle.y - 4.5}"
      width="9"
      height="9"
      rx="2"
      fill="#ffffff"
      stroke="${stroke}"
      stroke-width="1.8"
    ></rect>
  `).join('');
  return `${segmentMarkup}${bendMarkup}`;
}

function renderSelectionMarkup(doc) {
  const selectedNode = getSelectedNode();
  if (!selectedNode) return '';
  const x = selectedNode.x - 8;
  const y = selectedNode.y - 8;
  const width = selectedNode.width + 16;
  const height = selectedNode.height + 16;
  const handles = [
    ['nw', selectedNode.x, selectedNode.y],
    ['n', selectedNode.x + selectedNode.width / 2, selectedNode.y],
    ['ne', selectedNode.x + selectedNode.width, selectedNode.y],
    ['e', selectedNode.x + selectedNode.width, selectedNode.y + selectedNode.height / 2],
    ['se', selectedNode.x + selectedNode.width, selectedNode.y + selectedNode.height],
    ['s', selectedNode.x + selectedNode.width / 2, selectedNode.y + selectedNode.height],
    ['sw', selectedNode.x, selectedNode.y + selectedNode.height],
    ['w', selectedNode.x, selectedNode.y + selectedNode.height / 2],
  ];
  return `
    <g class="selection-overlay" pointer-events="none">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="16" fill="none" stroke="${getTheme(doc.themeId).accent}" stroke-width="2" stroke-dasharray="6 4"></rect>
      ${handles.map(([handle, cx, cy]) => `<circle data-handle="${handle}" cx="${cx}" cy="${cy}" r="7" fill="#ffffff" stroke="${getTheme(doc.themeId).accent}" stroke-width="2" pointer-events="all"></circle>`).join('')}
    </g>
  `;
}

function renderAlignmentGuides() {
  if (!state.alignmentGuides.length) return '';
  return `
    <g class="alignment-guides" pointer-events="none">
      ${state.alignmentGuides.map((guide) => guide.axis === 'x'
        ? `<line class="alignment-guide" x1="${guide.value}" y1="${guide.from}" x2="${guide.value}" y2="${guide.to}"></line>`
        : `<line class="alignment-guide" x1="${guide.from}" y1="${guide.value}" x2="${guide.to}" y2="${guide.value}"></line>`).join('')}
    </g>
  `;
}

function renderInspectorPanel(doc, selectedNode, selectedEdge) {
  if (!selectedNode && !selectedEdge) {
    return `
      <section class="panel-card inspector-card">
        <h3>Selection</h3>
        <p>Select a shape or edge to edit its label, size, and styling.</p>
        <div class="inspector-stat-grid">
          <div><strong>${doc.nodes.length}</strong><span>nodes</span></div>
          <div><strong>${doc.edges.length}</strong><span>edges</span></div>
          <div><strong>${templateNameFor(doc.templateId || doc.type)}</strong><span>template</span></div>
        </div>
      </section>
    `;
  }

  if (selectedEdge) {
    return `
      <section class="panel-card inspector-card">
        <h3>Edge</h3>
        <label class="field-block">
          <span>Label</span>
          <input type="text" data-field="edge-label" value="${escapeAttr(selectedEdge.label || '')}" />
        </label>
        <div class="field-row">
          <label class="field-block compact">
            <span>Color</span>
            <input type="color" data-field="edge-color" value="${colorInputValue(selectedEdge.color)}" />
          </label>
          <label class="field-block compact">
            <span>Width</span>
            <input type="number" min="1" max="18" data-field="edge-width" value="${selectedEdge.width}" />
          </label>
        </div>
        <div class="field-row">
          <label class="field-block compact">
            <span>Style</span>
            <select data-field="edge-style">
              ${['curve', 'straight', 'elbow'].map((style) => `<option value="${style}" ${selectedEdge.style === style ? 'selected' : ''}>${escapeHtml(capitalize(style))}</option>`).join('')}
            </select>
          </label>
          <label class="field-block compact">
            <span>Dash</span>
            <select data-field="edge-dash">
              ${['solid', 'dashed', 'dotted'].map((dash) => `<option value="${dash}" ${selectedEdge.dash === dash ? 'selected' : ''}>${escapeHtml(capitalize(dash))}</option>`).join('')}
            </select>
          </label>
          <label class="field-block compact">
            <span>End</span>
            <select data-field="edge-marker-end">
              ${['arrow', 'none'].map((marker) => `<option value="${marker}" ${selectedEdge.markerEnd === marker ? 'selected' : ''}>${escapeHtml(marker === 'arrow' ? 'Arrow' : 'None')}</option>`).join('')}
            </select>
          </label>
        </div>
        <p class="inspector-note">Tip: select an edge and drag square segment handles to add bends, then drag round bend handles to refine routing.</p>
        <button class="danger-btn wide" data-action="delete-selection">Delete edge</button>
      </section>
    `;
  }

  return `
    <section class="panel-card inspector-card">
      <h3>Selection</h3>
      <label class="field-block">
        <span>Label</span>
        <input type="text" data-field="node-label" value="${escapeAttr(selectedNode.label)}" />
      </label>
      <label class="field-block">
        <span>Shape</span>
        <select data-field="node-shape">
          ${allShapeOptions().map((shapeId) => `<option value="${shapeId}" ${selectedNode.shape === shapeId ? 'selected' : ''}>${escapeHtml(labelForShape(shapeId))}</option>`).join('')}
        </select>
      </label>
      <label class="field-block">
        <span>Font Family</span>
        <select data-field="node-font-family">
          ${FONT_OPTIONS.map((font) => `<option value="${escapeAttr(font)}" ${selectedNode.fontFamily === font ? 'selected' : ''}>${escapeHtml(font)}</option>`).join('')}
        </select>
      </label>
      <div class="field-row three-up">
        <label class="field-block compact">
          <span>Fill</span>
          <input type="color" data-field="node-fill" value="${colorInputValue(selectedNode.fill)}" />
        </label>
        <label class="field-block compact">
          <span>Stroke</span>
          <input type="color" data-field="node-stroke" value="${colorInputValue(selectedNode.stroke)}" />
        </label>
        <label class="field-block compact">
          <span>Text</span>
          <input type="color" data-field="node-text-color" value="${colorInputValue(selectedNode.textColor)}" />
        </label>
      </div>
      <div class="field-row three-up">
        <label class="field-block compact">
          <span>Width</span>
          <input type="number" min="40" max="1200" data-field="node-width" value="${Math.round(selectedNode.width)}" />
        </label>
        <label class="field-block compact">
          <span>Height</span>
          <input type="number" min="40" max="1200" data-field="node-height" value="${Math.round(selectedNode.height)}" />
        </label>
        <label class="field-block compact">
          <span>Font</span>
          <input type="number" min="10" max="72" data-field="node-font-size" value="${Math.round(selectedNode.fontSize)}" />
        </label>
      </div>
      <div class="field-row">
        <label class="field-block compact">
          <span>Border</span>
          <input type="number" min="1" max="16" data-field="node-stroke-width" value="${Math.round(selectedNode.strokeWidth || 2)}" />
        </label>
        <button class="ghost-btn ${selectedNode.fontWeight >= 700 ? 'is-active' : ''}" data-action="toggle-node-bold">Bold</button>
      </div>
      <div class="inspector-actions">
        <button class="ghost-btn" data-action="add-child">Child</button>
        <button class="ghost-btn" data-action="add-sibling">Sibling</button>
        <button class="ghost-btn" data-action="duplicate-selection">Duplicate</button>
      </div>
      <button class="danger-btn wide" data-action="delete-selection">Delete</button>
    </section>
  `;
}

function renderAiPanel(aiRoute) {
  return `
    <section class="panel-card ai-card">
      <div class="panel-card-header">
        <div>
          <h3>Opseeq Copilot</h3>
          <p>Local inference with Opseeq, Kimi 2.5, and Ollama-aware fallback.</p>
        </div>
        <button class="toolbar-icon small" data-action="refresh-ai-status" title="Refresh AI status">${refreshIcon()}</button>
      </div>
      <div class="status-pill-row">
        <span class="status-pill ${state.aiStatus.opseeq.reachable ? 'is-online' : 'is-offline'}">Opseeq ${state.aiStatus.opseeq.reachable ? 'online' : 'offline'}</span>
        <span class="status-pill ${state.aiStatus.ollama.reachable ? 'is-online' : 'is-offline'}">Ollama ${state.aiStatus.ollama.reachable ? 'online' : 'offline'}</span>
      </div>
      <label class="field-block">
        <span>Mode</span>
        <select data-field="ai-mode">
          ${AI_MODES.map((mode) => `<option value="${mode.id}" ${state.settings.aiMode === mode.id ? 'selected' : ''}>${escapeHtml(mode.label)}</option>`).join('')}
        </select>
      </label>
      <label class="field-block">
        <span>Opseeq model</span>
        <select data-field="opseeq-model">
          ${(state.aiStatus.opseeq.models.length ? state.aiStatus.opseeq.models : ['']).map((model) => `<option value="${escapeAttr(model)}" ${state.settings.opseeqModel === model ? 'selected' : ''}>${escapeHtml(model || 'Gateway default')}</option>`).join('')}
        </select>
      </label>
      <label class="field-block">
        <span>Ollama model</span>
        <select data-field="ollama-model">
          ${(state.aiStatus.ollama.models.length ? state.aiStatus.ollama.models : [state.settings.ollamaModel]).map((model) => `<option value="${escapeAttr(model)}" ${state.settings.ollamaModel === model ? 'selected' : ''}>${escapeHtml(model)}</option>`).join('')}
        </select>
      </label>
      <label class="field-block">
        <span>Prompt</span>
        <textarea rows="5" data-field="ai-prompt">${escapeHtml(state.settings.prompt)}</textarea>
      </label>
      <div class="route-note">Route: ${escapeHtml(aiRoute.description)}</div>
      ${state.aiError ? `<div class="error-banner">${escapeHtml(state.aiError)}</div>` : ''}
      ${state.aiResultInfo ? `<div class="info-banner">${escapeHtml(state.aiResultInfo)}</div>` : ''}
      <button class="primary-btn wide" data-action="run-ai-expand" ${state.aiBusy ? 'disabled' : ''}>${state.aiBusy ? 'Thinking…' : 'Expand selected topic'}</button>
    </section>
  `;
}

function renderGuideCard() {
  const step = GUIDE_STEPS[state.guideStep] || GUIDE_STEPS[0];
  return `
    <div class="guide-card guide-${step.accent}">
      <h3>${escapeHtml(step.title)}</h3>
      <div class="guide-illustration">${renderGuideIllustration(step.illustration)}</div>
      <p>${escapeHtml(step.description)}</p>
      <div class="guide-list">
        ${step.bullet.map((item) => `<div>${escapeHtml(item)}</div>`).join('')}
      </div>
      <div class="guide-actions">
        <button class="ghost-btn" data-action="skip-guide">Skip</button>
        <button class="primary-btn" data-action="next-guide">${state.guideStep === GUIDE_STEPS.length - 1 ? 'Done' : 'Next'}</button>
      </div>
    </div>
  `;
}

function renderShareMenu() {
  return `
    <div class="share-menu">
      <h4>Share for collaboration</h4>
      <div class="share-illustration">${renderGuideIllustration('share')}</div>
      <p>Lucidity exports the current diagram as a PNG snapshot of the canvas.</p>
      <button class="primary-btn wide" data-action="export-png">Export PNG</button>
    </div>
  `;
}

function renderCreateModal() {
  return `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="modal-card create-modal" data-stop-click="true">
        <div class="modal-header">
          <div>
            <h2>Create a new chart</h2>
            <p>Same keyboard loop as Lucid: Enter for sibling, Tab for child, Delete for removal.</p>
          </div>
          <button class="toolbar-icon" data-action="close-modal">${closeIcon()}</button>
        </div>
        <div class="create-tabs">
          ${['template', 'blank', 'ai'].map((mode) => `<button class="tab-btn ${state.createModal.mode === mode ? 'is-active' : ''}" data-action="set-create-mode" data-mode="${mode}">${escapeHtml(mode === 'ai' ? 'Create with AI' : mode === 'blank' ? 'Blank canvas' : 'Templates')}</button>`).join('')}
        </div>
        <div class="create-layout">
          <div class="create-main">
            <label class="field-block">
              <span>Name</span>
              <input type="text" data-field="create-title" value="${escapeAttr(state.createModal.title)}" />
            </label>
            ${state.createModal.mode === 'ai' ? `
              <label class="field-block">
                <span>Brief</span>
                <textarea rows="6" data-field="create-ai-prompt" placeholder="Example: Design a system map for local-first diagram intelligence.">${escapeHtml(state.createModal.aiPrompt)}</textarea>
              </label>
              <div class="panel-note">A new diagram opens first, then the selected AI route expands the root topic.</div>
            ` : `
              <div class="template-grid modal-template-grid">
                ${getCreateTemplateChoices().map((templateId) => renderTemplateChoiceCard(templateId)).join('')}
              </div>
            `}
          </div>
          <aside class="create-side-note">
            <h3>Shortcuts</h3>
            <div class="shortcut-stack">
              <div><strong>Enter</strong><span>add a sibling topic</span></div>
              <div><strong>Tab</strong><span>add a subtopic</span></div>
              <div><strong>Delete</strong><span>remove a topic or edge</span></div>
            </div>
            <p>Opseeq mode uses the local gateway when available and falls back to Kimi on Ollama if the gateway is not running.</p>
          </aside>
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" data-action="close-modal">Cancel</button>
          <button class="primary-btn" data-action="confirm-create">Create chart</button>
        </div>
      </div>
    </div>
  `;
}

function renderTemplateModal() {
  return `
    <div class="modal-backdrop" data-action="close-template-modal">
      <div class="modal-card template-modal" data-stop-click="true">
        <div class="modal-header">
          <div>
            <h2>Choose a Template</h2>
            <p>Lucid-style template entry points with local editing and AI continuation.</p>
          </div>
          <button class="toolbar-icon" data-action="close-template-modal">${closeIcon()}</button>
        </div>
        <div class="template-modal-body">
          ${TEMPLATE_GROUPS.map((group) => `
            <section class="template-group">
              <div class="template-group-heading">
                <h3>${escapeHtml(group.title)}</h3>
                <button class="ghost-inline" data-action="close-template-modal">›</button>
              </div>
              <div class="template-grid">
                ${group.items.map((templateId) => renderTemplateChoiceCard(templateId)).join('')}
              </div>
            </section>
          `).join('')}
        </div>
        <div class="modal-footer">
          <button class="ghost-btn" data-action="close-template-modal">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function renderTemplateChoiceCard(templateId) {
  const template = TEMPLATE_REGISTRY[templateId];
  return `
    <button class="template-choice-card ${state.createModal.templateId === templateId ? 'is-active' : ''}" data-action="select-template" data-template="${templateId}">
      <div class="template-choice-preview">${renderTemplatePreview(templateId)}</div>
      <div class="template-choice-name">${escapeHtml(template.name)}</div>
    </button>
  `;
}

function renderTemplatePreview(templateId) {
  const sample = TEMPLATE_REGISTRY[templateId]?.create(TEMPLATE_REGISTRY[templateId].name);
  if (!sample) return '';
  const svg = createSvgMarkup(sample, { width: 280, height: 150, mode: 'preview' });
  return `<img src="${svgToDataUri(svg)}" alt="${escapeAttr(sample.title)} preview" />`;
}

function renderSelectionSummary(selectedNode, selectedEdge) {
  if (state.inlineEdit) return 'Editing label inline';
  if (state.connectionSourceId) return 'Line tool active';
  if (state.interaction?.type === 'reconnect-edge') return 'Reconnecting line';
  if (state.interaction?.type === 'drag-edge-bend') return 'Shaping connector bend point';
  if (selectedNode) return `${escapeHtml(selectedNode.label)} selected`;
  if (selectedEdge) return `${escapeHtml(selectedEdge.label || 'Line')} selected`;
  return 'Canvas ready';
}

function handleClick(event) {
  const actionNode = event.target.closest('[data-action]');
  if (!actionNode) {
    if (event.target.closest('[data-stop-click="true"]')) return;
    if (event.target.classList.contains('modal-backdrop')) {
      closeAllOverlays();
    }
    return;
  }

  const action = actionNode.dataset.action;
  switch (action) {
    case 'set-home-section':
      state.homeSection = actionNode.dataset.section;
      scheduleRender();
      return;
    case 'open-create-modal':
      openCreateModal(actionNode.dataset.mode || 'template');
      return;
    case 'close-modal':
      state.createModal.open = false;
      scheduleRender();
      return;
    case 'close-template-modal':
      state.templateModalOpen = false;
      scheduleRender();
      return;
    case 'open-template-modal':
      state.templateModalOpen = true;
      scheduleRender();
      return;
    case 'set-create-mode':
      state.createModal.mode = actionNode.dataset.mode;
      scheduleRender();
      return;
    case 'select-template':
      if (state.templateModalOpen && !state.createModal.open) {
        quickCreateDocument(actionNode.dataset.template);
        return;
      }
      state.createModal.templateId = actionNode.dataset.template;
      state.createModal.title = TEMPLATE_REGISTRY[actionNode.dataset.template].name;
      scheduleRender();
      return;
    case 'confirm-create':
      confirmCreate();
      return;
    case 'create-doc':
      quickCreateDocument(actionNode.dataset.value);
      return;
    case 'open-document':
      openDocument(actionNode.dataset.id);
      return;
    case 'back-home':
      state.route = VIEW.HOME;
      state.shareMenuOpen = false;
      state.connectionSourceId = null;
      state.inlineEdit = null;
      scheduleRender();
      return;
    case 'set-dock':
      state.selectedDock = actionNode.dataset.dock;
      scheduleRender();
      return;
    case 'toggle-library-group':
      state.libraryExpanded[actionNode.dataset.group] = !state.libraryExpanded[actionNode.dataset.group];
      scheduleRender();
      return;
    case 'insert-shape':
      insertShape(actionNode.dataset.shape);
      return;
    case 'apply-theme':
      applyTheme(actionNode.dataset.theme);
      return;
    case 'toggle-share-menu':
      state.shareMenuOpen = !state.shareMenuOpen;
      scheduleRender();
      return;
    case 'export-png':
      exportAsPng();
      return;
    case 'undo':
      undo();
      return;
    case 'redo':
      redo();
      return;
    case 'add-child':
      addRelativeNode('child');
      return;
    case 'add-sibling':
      addRelativeNode('sibling');
      return;
    case 'duplicate-selection':
      duplicateSelection();
      return;
    case 'toggle-node-bold':
      mutateSelectedNode((node) => {
        node.fontWeight = node.fontWeight >= 700 ? 500 : 700;
      }, true);
      return;
    case 'save-inline-edit':
      commitInlineEdit();
      return;
    case 'cancel-inline-edit':
      cancelInlineEdit();
      return;
    case 'delete-selection':
      deleteSelection();
      return;
    case 'toggle-connect-mode':
      toggleConnectMode();
      return;
    case 'center-document':
      fitActiveDocumentToStage();
      return;
    case 'zoom-in':
      zoomDocument(1.12);
      return;
    case 'zoom-out':
      zoomDocument(1 / 1.12);
      return;
    case 'run-ai-expand':
      runAiExpansion();
      return;
    case 'refresh-ai-status':
      refreshAiStatus(true);
      return;
    case 'quick-prompt':
      state.settings.prompt = actionNode.dataset.prompt;
      persistState();
      scheduleRender();
      return;
    case 'import-mermaid':
      importMermaid();
      return;
    case 'next-guide':
      advanceGuide();
      return;
    case 'skip-guide':
      dismissGuide();
      return;
    default:
      break;
  }
}

function handleChange(event) {
  const field = event.target.dataset.field;
  if (!field) return;

  switch (field) {
    case 'home-search':
      state.search = event.target.value;
      scheduleRender();
      return;
    case 'library-search':
      state.librarySearch = event.target.value;
      scheduleRender();
      return;
    case 'create-title':
      state.createModal.title = event.target.value;
      return;
    case 'create-ai-prompt':
      state.createModal.aiPrompt = event.target.value;
      return;
    case 'ai-mode':
      state.settings.aiMode = event.target.value;
      persistState();
      scheduleRender();
      return;
    case 'opseeq-model':
      state.settings.opseeqModel = event.target.value;
      persistState();
      scheduleRender();
      return;
    case 'ollama-model':
      state.settings.ollamaModel = event.target.value;
      persistState();
      scheduleRender();
      return;
    case 'node-label':
      mutateSelectedNode((node) => {
        node.label = event.target.value;
        enforceNodeSize(node);
      }, true);
      return;
    case 'node-shape':
      mutateSelectedNode((node) => {
        node.shape = event.target.value;
        enforceNodeSize(node);
      }, true);
      return;
    case 'node-font-family':
      mutateSelectedNode((node) => {
        node.fontFamily = event.target.value;
        enforceNodeSize(node);
      }, true);
      return;
    case 'node-fill':
      mutateSelectedNode((node) => {
        node.fill = event.target.value;
      }, true);
      return;
    case 'node-stroke':
      mutateSelectedNode((node) => {
        node.stroke = event.target.value;
      }, true);
      return;
    case 'node-text-color':
      mutateSelectedNode((node) => {
        node.textColor = event.target.value;
      }, true);
      return;
    case 'node-width':
      mutateSelectedNode((node) => {
        node.width = clamp(Number(event.target.value) || node.width, 40, 1400);
        enforceNodeSize(node);
      }, true);
      return;
    case 'node-height':
      mutateSelectedNode((node) => {
        node.height = clamp(Number(event.target.value) || node.height, 40, 1400);
        enforceNodeSize(node);
      }, true);
      return;
    case 'node-font-size':
      mutateSelectedNode((node) => {
        node.fontSize = clamp(Number(event.target.value) || node.fontSize, 10, 72);
        enforceNodeSize(node);
      }, true);
      return;
    case 'node-stroke-width':
      mutateSelectedNode((node) => {
        node.strokeWidth = clamp(Number(event.target.value) || node.strokeWidth || 2, 1, 16);
      }, true);
      return;
    case 'edge-label':
      mutateSelectedEdge((edge) => {
        edge.label = event.target.value;
      }, true);
      return;
    case 'edge-color':
      mutateSelectedEdge((edge) => {
        edge.color = event.target.value;
      }, true);
      return;
    case 'edge-width':
      mutateSelectedEdge((edge) => {
        edge.width = clamp(Number(event.target.value) || edge.width, 1, 18);
      }, true);
      return;
    case 'edge-style':
      mutateSelectedEdge((edge) => {
        edge.style = event.target.value;
      }, true);
      return;
    case 'edge-dash':
      mutateSelectedEdge((edge) => {
        edge.dash = event.target.value;
      }, true);
      return;
    case 'edge-marker-end':
      mutateSelectedEdge((edge) => {
        edge.markerEnd = event.target.value;
      }, true);
      return;
    default:
      break;
  }
}

function handleInput(event) {
  const field = event.target.dataset.field;
  if (!field) return;
  if (field === 'inline-edit-value') {
    if (!state.inlineEdit) return;
    state.inlineEdit.value = event.target.value;
    return;
  }
  if (field === 'ai-prompt') {
    state.settings.prompt = event.target.value;
    persistState();
    return;
  }
  if (field === 'library-search') {
    state.librarySearch = event.target.value;
    scheduleRender();
    return;
  }
  if (field === 'mermaid-source') {
    state.mermaidSource = event.target.value;
    return;
  }
}

function handleDoubleClick(event) {
  if (state.route !== VIEW.EDITOR) return;
  const bendHandleTarget = event.target.closest('[data-edge-bend-index]');
  const nodeTarget = event.target.closest('[data-node-id]');
  const edgeTarget = event.target.closest('[data-edge-id]');
  const doc = getActiveDocument();
  if (!doc) return;

  if (bendHandleTarget) {
    event.preventDefault();
    const edgeId = bendHandleTarget.closest('[data-edge-id]')?.dataset.edgeId;
    const bendIndex = Number(bendHandleTarget.dataset.edgeBendIndex);
    removeEdgeBendPoint(edgeId, bendIndex);
    return;
  }

  if (nodeTarget) {
    const node = doc.nodes.find((entry) => entry.id === nodeTarget.dataset.nodeId);
    if (!node) return;
    state.selection = { type: 'node', id: node.id };
    startInlineEdit('node', node.id, node.label);
    return;
  }

  if (edgeTarget) {
    const edge = doc.edges.find((entry) => entry.id === edgeTarget.dataset.edgeId);
    if (!edge) return;
    state.selection = { type: 'edge', id: edge.id };
    startInlineEdit('edge', edge.id, edge.label || '');
  }
}

function handlePointerDown(event) {
  if (state.route !== VIEW.EDITOR) return;
  if (event.target.closest('.inline-editor')) return;
  if (state.inlineEdit) commitInlineEdit();
  if (event.target.closest('.stage-banner')) return;
  if (event.target.closest('.guide-card, .share-menu, .editor-left-panel, .editor-right-panel')) return;
  const doc = getActiveDocument();
  if (!doc) return;
  state.alignmentGuides = [];
  const stage = document.getElementById('diagram-stage');

  const nodeTarget = event.target.closest('[data-node-id]');
  const edgeTarget = event.target.closest('[data-edge-id]');
  const edgeHandleTarget = event.target.closest('[data-edge-handle]');
  const edgeBendHandleTarget = event.target.closest('[data-edge-bend-index]');
  const edgeSegmentHandleTarget = event.target.closest('[data-edge-segment-index]');
  const handleTarget = event.target.closest('[data-handle]');

  if (stage && stage.contains(event.target) && state.spacePressed) {
    event.preventDefault();
    state.interaction = {
      type: 'pan-stage',
      start: { x: event.clientX, y: event.clientY },
      origin: { x: doc.pan.x, y: doc.pan.y },
    };
    scheduleRender();
    return;
  }

  if (handleTarget && state.selection?.type === 'node') {
    const selectedNode = getSelectedNode();
    if (!selectedNode) return;
    event.preventDefault();
    pushHistorySnapshot();
    state.interaction = {
      type: 'resize-node',
      handle: handleTarget.dataset.handle,
      nodeId: selectedNode.id,
      start: getWorldPointFromEvent(event, doc),
      origin: { x: selectedNode.x, y: selectedNode.y, width: selectedNode.width, height: selectedNode.height },
    };
    return;
  }

  if (edgeBendHandleTarget) {
    const edgeId = edgeBendHandleTarget.closest('[data-edge-id]')?.dataset.edgeId;
    const edge = doc.edges.find((entry) => entry.id === edgeId);
    const bendIndex = Number(edgeBendHandleTarget.dataset.edgeBendIndex);
    const bendPoint = edge?.bendPoints?.[bendIndex];
    if (!edge || !bendPoint || Number.isNaN(bendIndex)) return;
    event.preventDefault();
    state.selection = { type: 'edge', id: edge.id };
    pushHistorySnapshot();
    state.interaction = {
      type: 'drag-edge-bend',
      edgeId: edge.id,
      bendIndex,
      start: getWorldPointFromEvent(event, doc),
      origin: { x: bendPoint.x, y: bendPoint.y },
    };
    scheduleRender();
    return;
  }

  if (edgeSegmentHandleTarget) {
    const edgeId = edgeSegmentHandleTarget.closest('[data-edge-id]')?.dataset.edgeId;
    const edge = doc.edges.find((entry) => entry.id === edgeId);
    const segmentIndex = Number(edgeSegmentHandleTarget.dataset.edgeSegmentIndex);
    if (!edge || Number.isNaN(segmentIndex)) return;
    event.preventDefault();
    state.selection = { type: 'edge', id: edge.id };
    pushHistorySnapshot();
    const bendIndex = insertEdgeBendPoint(doc, edge, segmentIndex);
    const bendPoint = edge.bendPoints?.[bendIndex];
    if (!bendPoint) {
      scheduleRender();
      return;
    }
    state.interaction = {
      type: 'drag-edge-bend',
      edgeId: edge.id,
      bendIndex,
      start: getWorldPointFromEvent(event, doc),
      origin: { x: bendPoint.x, y: bendPoint.y },
    };
    touchDocument(doc, false);
    scheduleRender();
    return;
  }

  if (edgeHandleTarget) {
    const edgeId = edgeHandleTarget.closest('[data-edge-id]')?.dataset.edgeId;
    const edge = doc.edges.find((entry) => entry.id === edgeId);
    if (!edge) return;
    event.preventDefault();
    state.selection = { type: 'edge', id: edge.id };
    state.alignmentGuides = [];
    state.interaction = {
      type: 'reconnect-edge',
      edgeId: edge.id,
      end: edgeHandleTarget.dataset.edgeHandle,
      pointerWorld: getWorldPointFromEvent(event, doc),
    };
    scheduleRender();
    return;
  }

  if (nodeTarget) {
    event.preventDefault();
    const nodeId = nodeTarget.dataset.nodeId;
    const node = doc.nodes.find((entry) => entry.id === nodeId);
    if (!node) return;

    if (state.connectionSourceId && state.connectionSourceId !== nodeId) {
      createManualEdge(state.connectionSourceId, nodeId);
      state.connectionSourceId = null;
      state.alignmentGuides = [];
      return;
    }

    if (state.connectionSourceId && state.connectionSourceId === nodeId) {
      state.connectionSourceId = null;
      scheduleRender();
      return;
    }

    state.selection = { type: 'node', id: nodeId };
    pushHistorySnapshot();
    state.alignmentGuides = [];
    state.interaction = {
      type: 'drag-node',
      nodeId,
      start: getWorldPointFromEvent(event, doc),
      origin: { x: node.x, y: node.y },
    };
    scheduleRender();
    return;
  }

  if (edgeTarget) {
    event.preventDefault();
    state.selection = { type: 'edge', id: edgeTarget.dataset.edgeId };
    state.alignmentGuides = [];
    scheduleRender();
    return;
  }

  if (stage && stage.contains(event.target)) {
    state.selection = null;
    state.alignmentGuides = [];
    state.interaction = {
      type: 'pan-stage',
      start: { x: event.clientX, y: event.clientY },
      origin: { x: doc.pan.x, y: doc.pan.y },
    };
    scheduleRender();
  }
}

function handlePointerMove(event) {
  if (state.route !== VIEW.EDITOR) return;
  const doc = getActiveDocument();
  if (!doc) return;
  state.pointerWorld = getWorldPointFromClientPoint(event.clientX, event.clientY, doc);

  if (!state.interaction) {
    if (state.alignmentGuides.length) {
      state.alignmentGuides = [];
      scheduleRender();
      return;
    }
    if (state.connectionSourceId) scheduleRender();
    return;
  }

  if (state.interaction.type === 'drag-node') {
    const node = doc.nodes.find((entry) => entry.id === state.interaction.nodeId);
    if (!node) return;
    const world = getWorldPointFromEvent(event, doc);
    const dx = world.x - state.interaction.start.x;
    const dy = world.y - state.interaction.start.y;
    const snapped = getSnappedNodePosition(doc, node, state.interaction.origin.x + dx, state.interaction.origin.y + dy, {
      disable: event.shiftKey,
    });
    node.x = snap(snapped.x, 1);
    node.y = snap(snapped.y, 1);
    state.alignmentGuides = snapped.guides;
    touchDocument(doc, false);
    scheduleRender();
    return;
  }

  if (state.interaction.type === 'resize-node') {
    const node = doc.nodes.find((entry) => entry.id === state.interaction.nodeId);
    if (!node) return;
    const world = getWorldPointFromEvent(event, doc);
    resizeNodeFromHandle(node, state.interaction.handle, world, state.interaction.start, state.interaction.origin);
    touchDocument(doc, false);
    scheduleRender();
    return;
  }

  if (state.interaction.type === 'pan-stage') {
    const dx = event.clientX - state.interaction.start.x;
    const dy = event.clientY - state.interaction.start.y;
    doc.pan.x = state.interaction.origin.x + dx;
    doc.pan.y = state.interaction.origin.y + dy;
    touchDocument(doc, false);
    scheduleRender();
    return;
  }

  if (state.interaction.type === 'drag-edge-bend') {
    const interaction = state.interaction;
    const edge = doc.edges.find((entry) => entry.id === interaction.edgeId);
    if (!edge || !edge.bendPoints?.[interaction.bendIndex]) return;
    const world = getWorldPointFromEvent(event, doc);
    const dx = world.x - interaction.start.x;
    const dy = world.y - interaction.start.y;
    const precision = event.shiftKey ? 1 : 4;
    edge.bendPoints[interaction.bendIndex] = {
      x: snap(interaction.origin.x + dx, precision),
      y: snap(interaction.origin.y + dy, precision),
    };
    edge.style = 'elbow';
    edge.kind = 'manual';
    touchDocument(doc, false);
    scheduleRender();
    return;
  }

  if (state.interaction.type === 'reconnect-edge') {
    state.interaction.pointerWorld = getWorldPointFromEvent(event, doc);
    scheduleRender();
  }
}

function handlePointerUp(event) {
  if (!state.interaction) return;
  const doc = getActiveDocument();
  if (!doc) {
    state.interaction = null;
    state.alignmentGuides = [];
    scheduleRender();
    return;
  }

  if (state.interaction.type === 'reconnect-edge') {
    const interaction = state.interaction;
    const edge = doc.edges.find((entry) => entry.id === interaction.edgeId);
    const pointerWorld = interaction.pointerWorld || getWorldPointFromEvent(event, doc);
    if (edge && pointerWorld) {
      const oppositeId = interaction.end === 'source' ? edge.target : edge.source;
      const hoverNode = findNodeAtWorldPoint(doc, pointerWorld, 28, oppositeId);
      if (hoverNode) {
        pushHistorySnapshot();
        if (interaction.end === 'source') edge.source = hoverNode.id;
        else edge.target = hoverNode.id;
        edge.kind = 'manual';
        touchDocument(doc, false);
      }
    }
  }

  if (state.interaction.type === 'drag-edge-bend') {
    const edge = doc.edges.find((entry) => entry.id === state.interaction.edgeId);
    if (edge) {
      edge.bendPoints = compactEdgeBendPoints(edge.bendPoints || []);
      touchDocument(doc, false);
    }
  }

  touchDocument(doc);
  state.interaction = null;
  state.alignmentGuides = [];
  scheduleRender();
}

function handleWheel(event) {
  if (state.route !== VIEW.EDITOR) return;
  const stage = document.getElementById('diagram-stage');
  if (!stage || !stage.contains(event.target)) return;
  event.preventDefault();
  const doc = getActiveDocument();
  if (!doc) return;
  const normalizedDelta = normalizeWheelDelta(event);
  if (Math.abs(normalizedDelta) < 0.01) return;
  const rect = stage.getBoundingClientRect();
  const screenPoint = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  const clampedDelta = clamp(normalizedDelta, -96, 96);
  const precisionScale = event.ctrlKey ? 0.35 : 1;
  const factor = Math.pow(0.9988, clampedDelta * precisionScale);
  zoomAtStagePoint(doc, factor, screenPoint);
  touchDocument(doc);
  scheduleRender();
}

function handleKeyDown(event) {
  if (state.route !== VIEW.EDITOR) return;
  if (state.inlineEdit) {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelInlineEdit();
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      commitInlineEdit();
      return;
    }
    return;
  }
  const tag = event.target?.tagName?.toLowerCase();
  const typing = ['input', 'textarea', 'select'].includes(tag);

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
    event.preventDefault();
    if (event.shiftKey) redo();
    else undo();
    return;
  }

  if (typing) return;

  if (event.code === 'Space') {
    event.preventDefault();
    if (!state.spacePressed) {
      state.spacePressed = true;
      scheduleRender();
    }
    return;
  }

  if (event.key === 'Delete' || event.key === 'Backspace') {
    event.preventDefault();
    deleteSelection();
    return;
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    addRelativeNode('sibling');
    return;
  }

  if (event.key === 'Tab') {
    event.preventDefault();
    addRelativeNode('child');
    return;
  }

  if (event.key.toLowerCase() === 'f') {
    event.preventDefault();
    fitActiveDocumentToStage();
    return;
  }

  if (event.key.toLowerCase() === 'l') {
    event.preventDefault();
    toggleConnectMode();
    return;
  }

  if (event.key === 'Escape') {
    if (state.connectionSourceId) {
      state.connectionSourceId = null;
      scheduleRender();
      return;
    }
    closeAllOverlays();
  }
}

function handleKeyUp(event) {
  if (event.code !== 'Space') return;
  if (!state.spacePressed) return;
  state.spacePressed = false;
  if (state.interaction?.type === 'pan-stage') {
    state.interaction = null;
  }
  scheduleRender();
}

function handleWindowBlur() {
  state.spacePressed = false;
  state.pointerWorld = null;
  state.inlineEdit = null;
  state.alignmentGuides = [];
  if (state.interaction?.type === 'pan-stage') state.interaction = null;
  scheduleRender();
}

function handleResize() {
  if (state.route === VIEW.EDITOR) ensureEditorFraming();
}

function openCreateModal(mode) {
  state.createModal.open = true;
  state.createModal.mode = mode === 'ai' ? 'ai' : 'template';
  state.createModal.title = mode === 'ai' ? 'AI Diagram' : TEMPLATE_REGISTRY[state.createModal.templateId].name;
  scheduleRender();
}

function closeAllOverlays() {
  state.createModal.open = false;
  state.templateModalOpen = false;
  state.shareMenuOpen = false;
  state.inlineEdit = null;
  scheduleRender();
}

function confirmCreate() {
  const mode = state.createModal.mode;
  const title = state.createModal.title.trim() || (mode === 'template' ? TEMPLATE_REGISTRY[state.createModal.templateId].name : 'Untitled Diagram');
  let doc;
  if (mode === 'blank') {
    doc = buildBlankCanvas(title);
  } else if (mode === 'ai') {
    doc = buildMindMap(title || 'AI Diagram');
    doc.showGuide = true;
  } else {
    doc = TEMPLATE_REGISTRY[state.createModal.templateId].create(title);
    doc.showGuide = true;
  }
  doc.viewInitialized = false;
  state.documents.unshift(doc);
  state.activeDocumentId = doc.id;
  state.selection = { type: 'node', id: doc.rootId || doc.nodes[0]?.id };
  state.route = VIEW.EDITOR;
  state.createModal.open = false;
  state.shareMenuOpen = false;
  state.guideStep = 0;
  ensureHistory(doc.id);
  persistState();
  render();
  requestAnimationFrame(() => {
    fitActiveDocumentToStage();
    if (mode === 'ai' && state.createModal.aiPrompt.trim()) {
      state.settings.prompt = state.createModal.aiPrompt.trim();
      persistState();
      runAiExpansion();
    }
  });
}

function quickCreateDocument(templateId) {
  const registry = TEMPLATE_REGISTRY[templateId] || TEMPLATE_REGISTRY['mind-map'];
  const doc = registry.create(registry.name);
  doc.showGuide = true;
  doc.viewInitialized = false;
  state.documents.unshift(doc);
  state.activeDocumentId = doc.id;
  state.selection = { type: 'node', id: doc.rootId || doc.nodes[0]?.id };
  state.route = VIEW.EDITOR;
  state.templateModalOpen = false;
  state.createModal.open = false;
  state.guideStep = 0;
  ensureHistory(doc.id);
  persistState();
  render();
  requestAnimationFrame(() => fitActiveDocumentToStage());
}

function openDocument(id) {
  state.activeDocumentId = id;
  state.route = VIEW.EDITOR;
  state.selection = { type: 'node', id: getActiveDocument()?.rootId || getActiveDocument()?.nodes[0]?.id };
  state.shareMenuOpen = false;
  state.inlineEdit = null;
  state.connectionSourceId = null;
  state.alignmentGuides = [];
  scheduleRender();
  requestAnimationFrame(() => fitActiveDocumentToStage(false));
}

function ensureEditorFraming() {
  if (state.route !== VIEW.EDITOR) return;
  const doc = getActiveDocument();
  if (!doc) return;
  if (!doc.viewInitialized) {
    fitActiveDocumentToStage();
  }
}

function fitActiveDocumentToStage(force = true) {
  const doc = getActiveDocument();
  const stage = document.getElementById('diagram-stage');
  if (!doc || !stage) return;
  if (!force && doc.viewInitialized) return;
  const rect = stage.getBoundingClientRect();
  const bounds = getDocumentBounds(doc);
  const width = Math.max(200, bounds.maxX - bounds.minX);
  const height = Math.max(200, bounds.maxY - bounds.minY);
  const padding = 130;
  const zoom = clamp(Math.min((rect.width - padding) / width, (rect.height - padding) / height, 1.15), 0.32, 1.2);
  doc.zoom = zoom;
  doc.pan.x = (rect.width - width * zoom) / 2 - bounds.minX * zoom;
  doc.pan.y = (rect.height - height * zoom) / 2 - bounds.minY * zoom;
  doc.viewInitialized = true;
  touchDocument(doc);
  scheduleRender();
}

function zoomDocument(factor) {
  const doc = getActiveDocument();
  const stage = document.getElementById('diagram-stage');
  if (!doc || !stage) return;
  const rect = stage.getBoundingClientRect();
  zoomAtStagePoint(doc, factor, { x: rect.width / 2, y: rect.height / 2 });
  touchDocument(doc);
  scheduleRender();
}

function toggleConnectMode() {
  const selectedNode = getSelectedNode();
  if (!selectedNode) {
    pushToast('Select a source node first.', 'warn');
    return;
  }
  state.connectionSourceId = state.connectionSourceId ? null : selectedNode.id;
  scheduleRender();
}

function insertShape(shapeId) {
  const doc = getActiveDocument();
  if (!doc) return;
  pushHistorySnapshot();
  const center = getViewportCenter(doc);
  const theme = getTheme(doc.themeId);
  const base = baseShapeConfig(shapeId);
  const node = createNode({
    label: labelForShape(shapeId),
    x: center.x - base.width / 2,
    y: center.y - base.height / 2,
    width: base.width,
    height: base.height,
    shape: shapeId,
    fill: base.fill || theme.surface,
    stroke: base.stroke || theme.line,
    textColor: theme.ink,
    fontSize: shapeId === 'caption' ? 18 : 16,
  });
  if (shapeId === 'group-frame' || shapeId === 'board' || shapeId === 'lane' || shapeId === 'cluster') {
    node.fill = hexToRgba(theme.surface, 0.4);
    node.strokeWidth = 2;
  }
  enforceNodeSize(node);
  doc.nodes.push(node);
  state.selection = { type: 'node', id: node.id };
  touchDocument(doc);
  scheduleRender();
}

function applyTheme(themeId) {
  const doc = getActiveDocument();
  if (!doc) return;
  pushHistorySnapshot();
  doc.themeId = themeId;
  const theme = getTheme(themeId);
  const root = findRootNode(doc);
  let paletteIndex = 0;
  for (const node of doc.nodes) {
    if (node.id === root?.id) {
      node.fill = theme.surface;
      node.stroke = theme.accent;
      node.textColor = theme.ink;
      continue;
    }
    if (isContainerShape(node.shape)) {
      node.fill = hexToRgba(theme.surface, 0.55);
      node.stroke = hexToRgba(theme.line, 0.65);
      node.textColor = theme.ink;
      continue;
    }
    const color = theme.palette[paletteIndex % theme.palette.length];
    node.fill = hexToRgba(color, 0.2);
    node.stroke = color;
    node.textColor = theme.ink;
    paletteIndex += 1;
  }
  for (const edge of doc.edges) {
    edge.color = theme.line;
  }
  touchDocument(doc);
  scheduleRender();
}

function addRelativeNode(mode) {
  const doc = getActiveDocument();
  const selectedNode = getSelectedNode();
  if (!doc || !selectedNode) {
    pushToast('Select a node first.', 'warn');
    return;
  }
  pushHistorySnapshot();
  const theme = getTheme(doc.themeId);
  let parentId = null;
  let x = selectedNode.x + 220;
  let y = selectedNode.y + 100;
  let side = inferSideForNode(doc, selectedNode);

  if (mode === 'child') {
    parentId = selectedNode.id;
    side = inferSideForChild(doc, selectedNode);
    const position = getNextChildPosition(doc, selectedNode, side);
    x = position.x;
    y = position.y;
  } else {
    const parent = getParentNode(doc, selectedNode.id);
    parentId = parent?.id || null;
    side = parent ? inferSideForChild(doc, parent) : inferSideForNode(doc, selectedNode);
    if (parent) {
      const siblings = getChildren(doc, parent.id);
      x = selectedNode.x;
      y = siblings.length ? Math.max(...siblings.map((node) => node.y)) + 94 : selectedNode.y + 94;
    } else {
      x = selectedNode.x + 230;
      y = selectedNode.y + 98;
    }
  }

  const node = createNode({
    label: mode === 'child' ? 'Subtopic' : 'Sibling Topic',
    x,
    y,
    width: 180,
    height: 68,
    shape: 'rounded-rect',
    fill: hexToRgba(theme.palette[(doc.nodes.length - 1) % theme.palette.length], 0.25),
    stroke: theme.palette[(doc.nodes.length - 1) % theme.palette.length],
    textColor: theme.ink,
    side,
  });
  enforceNodeSize(node);
  doc.nodes.push(node);
  if (parentId) {
    doc.edges.push(createEdge(parentId, node.id, { color: theme.line, kind: 'hierarchy' }));
  }
  state.selection = { type: 'node', id: node.id };
  touchDocument(doc);
  scheduleRender();
}

function duplicateSelection() {
  const doc = getActiveDocument();
  const selectedNode = getSelectedNode();
  if (!doc || !selectedNode) return;
  pushHistorySnapshot();
  const clone = {
    ...deepClone(selectedNode),
    id: uid('node'),
    x: selectedNode.x + 34,
    y: selectedNode.y + 34,
    label: `${selectedNode.label} Copy`,
  };
  enforceNodeSize(clone);
  doc.nodes.push(clone);
  state.selection = { type: 'node', id: clone.id };
  touchDocument(doc);
  scheduleRender();
}

function deleteSelection() {
  const doc = getActiveDocument();
  if (!doc || !state.selection) return;
  pushHistorySnapshot();

  if (state.selection.type === 'edge') {
    doc.edges = doc.edges.filter((edge) => edge.id !== state.selection.id);
    state.selection = null;
    touchDocument(doc);
    scheduleRender();
    return;
  }

  const selectedNode = getSelectedNode();
  if (!selectedNode) return;
  const doomed = new Set([selectedNode.id]);
  collectDescendants(doc, selectedNode.id, doomed);
  doc.nodes = doc.nodes.filter((node) => !doomed.has(node.id));
  doc.edges = doc.edges.filter((edge) => !doomed.has(edge.source) && !doomed.has(edge.target));
  if (!doc.nodes.length) {
    const fallback = createNode({
      label: 'Central Topic',
      x: 560,
      y: 320,
      width: 240,
      height: 86,
      shape: 'rounded-rect',
      fill: '#ffffff',
      stroke: getTheme(doc.themeId).accent,
      textColor: getTheme(doc.themeId).ink,
      fontSize: 20,
    });
    doc.nodes.push(fallback);
    doc.rootId = fallback.id;
    state.selection = { type: 'node', id: fallback.id };
  } else {
    state.selection = null;
  }
  touchDocument(doc);
  scheduleRender();
}

function collectDescendants(doc, nodeId, bucket) {
  for (const edge of doc.edges.filter((entry) => entry.source === nodeId && entry.kind !== 'manual')) {
    if (!bucket.has(edge.target)) {
      bucket.add(edge.target);
      collectDescendants(doc, edge.target, bucket);
    }
  }
}

function createManualEdge(sourceId, targetId) {
  const doc = getActiveDocument();
  if (!doc || sourceId === targetId) return;
  pushHistorySnapshot();
  doc.edges.push(createEdge(sourceId, targetId, { color: getTheme(doc.themeId).line, kind: 'manual', style: 'elbow', dashed: false, bendPoints: [] }));
  touchDocument(doc);
  scheduleRender();
}

function insertEdgeBendPoint(doc, edge, segmentIndex) {
  const source = doc.nodes.find((node) => node.id === edge.source);
  const target = doc.nodes.find((node) => node.id === edge.target);
  if (!source || !target) return 0;
  const geometry = getEdgeGeometry(source, target, edge);
  const points = geometry.routePoints || [geometry.start, geometry.end];
  const boundedIndex = clamp(Math.floor(segmentIndex), 0, Math.max(0, points.length - 2));
  const from = points[boundedIndex];
  const to = points[boundedIndex + 1];
  if (!from || !to) return 0;
  const midpoint = {
    x: snap((from.x + to.x) / 2, 4),
    y: snap((from.y + to.y) / 2, 4),
  };
  if (!Array.isArray(edge.bendPoints)) edge.bendPoints = [];
  const insertAt = clamp(boundedIndex, 0, edge.bendPoints.length);
  edge.bendPoints.splice(insertAt, 0, midpoint);
  edge.bendPoints = compactEdgeBendPoints(edge.bendPoints);
  edge.style = 'elbow';
  edge.kind = 'manual';
  return clamp(insertAt, 0, Math.max(0, edge.bendPoints.length - 1));
}

function removeEdgeBendPoint(edgeId, bendIndex) {
  const doc = getActiveDocument();
  if (!doc) return;
  const edge = doc.edges.find((entry) => entry.id === edgeId);
  if (!edge || !Array.isArray(edge.bendPoints)) return;
  const index = Math.floor(Number(bendIndex));
  if (Number.isNaN(index) || index < 0 || index >= edge.bendPoints.length) return;
  pushHistorySnapshot();
  edge.bendPoints.splice(index, 1);
  edge.bendPoints = compactEdgeBendPoints(edge.bendPoints);
  touchDocument(doc);
  scheduleRender();
}

function compactEdgeBendPoints(points) {
  const compacted = [];
  for (const point of points || []) {
    if (!Number.isFinite(point?.x) || !Number.isFinite(point?.y)) continue;
    const next = { x: snap(Number(point.x), 1), y: snap(Number(point.y), 1) };
    const previous = compacted[compacted.length - 1];
    if (previous && Math.abs(previous.x - next.x) < 0.5 && Math.abs(previous.y - next.y) < 0.5) continue;
    compacted.push(next);
  }
  const cleaned = [];
  for (let index = 0; index < compacted.length; index += 1) {
    const current = compacted[index];
    const prev = cleaned[cleaned.length - 1];
    const next = compacted[index + 1];
    if (!prev || !next) {
      cleaned.push(current);
      continue;
    }
    const cross = (current.x - prev.x) * (next.y - current.y) - (current.y - prev.y) * (next.x - current.x);
    const maxDelta = Math.max(
      Math.abs(current.x - prev.x),
      Math.abs(current.y - prev.y),
      Math.abs(next.x - current.x),
      Math.abs(next.y - current.y),
    );
    if (Math.abs(cross) < 0.8 && maxDelta > 2) continue;
    cleaned.push(current);
  }
  return cleaned.slice(0, 24);
}

function mutateSelectedNode(mutator, rerender = false) {
  const doc = getActiveDocument();
  const node = getSelectedNode();
  if (!doc || !node) return;
  pushHistorySnapshot();
  mutator(node);
  touchDocument(doc);
  if (rerender) scheduleRender();
}

function mutateSelectedEdge(mutator, rerender = false) {
  const doc = getActiveDocument();
  const edge = getSelectedEdge();
  if (!doc || !edge) return;
  pushHistorySnapshot();
  mutator(edge);
  touchDocument(doc);
  if (rerender) scheduleRender();
}

function startInlineEdit(type, id, value) {
  state.inlineEdit = {
    type,
    id,
    value: value || '',
    originalValue: value || '',
  };
  scheduleRender();
  requestAnimationFrame(() => {
    const input = document.querySelector('[data-inline-edit="true"]');
    if (!input) return;
    input.focus();
    input.select();
  });
}

function commitInlineEdit() {
  const doc = getActiveDocument();
  if (!doc || !state.inlineEdit) return;

  const { type, id, value, originalValue } = state.inlineEdit;
  const nextValue = String(value ?? '').trim();
  const unchanged = nextValue === String(originalValue ?? '').trim();
  state.inlineEdit = null;
  if (unchanged) {
    scheduleRender();
    return;
  }

  pushHistorySnapshot();
  if (type === 'node') {
    const node = doc.nodes.find((entry) => entry.id === id);
    if (!node) return;
    node.label = nextValue || node.label;
    enforceNodeSize(node);
  } else if (type === 'edge') {
    const edge = doc.edges.find((entry) => entry.id === id);
    if (!edge) return;
    edge.label = nextValue;
  }
  touchDocument(doc);
  scheduleRender();
}

function cancelInlineEdit() {
  if (!state.inlineEdit) return;
  state.inlineEdit = null;
  scheduleRender();
}

function resizeNodeFromHandle(node, handle, world, start, origin) {
  const dx = world.x - start.x;
  const dy = world.y - start.y;
  let x = origin.x;
  let y = origin.y;
  let width = origin.width;
  let height = origin.height;

  if (handle.includes('e')) width = clamp(origin.width + dx, 40, 1400);
  if (handle.includes('s')) height = clamp(origin.height + dy, 40, 1400);
  if (handle.includes('w')) {
    width = clamp(origin.width - dx, 40, 1400);
    x = origin.x + (origin.width - width);
  }
  if (handle.includes('n')) {
    height = clamp(origin.height - dy, 40, 1400);
    y = origin.y + (origin.height - height);
  }

  node.x = snap(x, 4);
  node.y = snap(y, 4);
  node.width = snap(width, 4);
  node.height = snap(height, 4);
  enforceNodeSize(node, origin, handle);
}

function getWorldPointFromEvent(event, doc) {
  const stage = document.getElementById('diagram-stage');
  if (!stage) return { x: 0, y: 0 };
  const rect = stage.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left - doc.pan.x) / doc.zoom,
    y: (event.clientY - rect.top - doc.pan.y) / doc.zoom,
  };
}

function getWorldPointFromClientPoint(clientX, clientY, doc) {
  const stage = document.getElementById('diagram-stage');
  if (!stage) return null;
  const rect = stage.getBoundingClientRect();
  if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return null;
  return {
    x: (clientX - rect.left - doc.pan.x) / doc.zoom,
    y: (clientY - rect.top - doc.pan.y) / doc.zoom,
  };
}

function getViewportCenter(doc) {
  const stage = document.getElementById('diagram-stage');
  if (!stage) return { x: 640, y: 360 };
  const rect = stage.getBoundingClientRect();
  return {
    x: (rect.width / 2 - doc.pan.x) / doc.zoom,
    y: (rect.height / 2 - doc.pan.y) / doc.zoom,
  };
}

function zoomAtStagePoint(doc, factor, stagePoint) {
  const worldX = (stagePoint.x - doc.pan.x) / doc.zoom;
  const worldY = (stagePoint.y - doc.pan.y) / doc.zoom;
  const nextZoom = clamp(doc.zoom * factor, 0.18, 4);
  doc.pan.x = stagePoint.x - worldX * nextZoom;
  doc.pan.y = stagePoint.y - worldY * nextZoom;
  doc.zoom = nextZoom;
}

function undo() {
  const doc = getActiveDocument();
  if (!doc) return;
  const history = ensureHistory(doc.id);
  if (!history.past.length) return;
  history.future.push(JSON.stringify(doc));
  replaceActiveDocument(JSON.parse(history.past.pop()));
}

function redo() {
  const doc = getActiveDocument();
  if (!doc) return;
  const history = ensureHistory(doc.id);
  if (!history.future.length) return;
  history.past.push(JSON.stringify(doc));
  replaceActiveDocument(JSON.parse(history.future.pop()));
}

function pushHistorySnapshot() {
  const doc = getActiveDocument();
  if (!doc) return;
  const history = ensureHistory(doc.id);
  const snapshot = JSON.stringify(doc);
  if (history.past[history.past.length - 1] === snapshot) return;
  history.past.push(snapshot);
  if (history.past.length > 60) history.past.shift();
  history.future = [];
}

function ensureHistory(docId) {
  if (!state.history[docId]) state.history[docId] = { past: [], future: [] };
  return state.history[docId];
}

function replaceActiveDocument(nextDoc) {
  const index = state.documents.findIndex((doc) => doc.id === state.activeDocumentId);
  if (index === -1) return;
  state.documents[index] = nextDoc;
  state.selection = nextDoc.rootId ? { type: 'node', id: nextDoc.rootId } : null;
  persistState();
  scheduleRender();
}

async function refreshAiStatus(force = false) {
  if (state.aiStatus.loading && !force) return;
  state.aiStatus.loading = true;
  state.aiError = '';
  scheduleRender();
  try {
    const health = await fetch('/api/health').then((response) => response.json());
    const opseeqHealth = health.services?.opseeq || {};
    const ollamaHealth = health.services?.ollama || {};
    let opseeqModels = [];
    if (opseeqHealth.reachable) {
      try {
        const modelResponse = await fetch('/api/opseeq/v1/models');
        const modelJson = await modelResponse.json();
        opseeqModels = Array.isArray(modelJson.data) ? modelJson.data.map((entry) => entry.id).filter(Boolean) : [];
      } catch {
        opseeqModels = [];
      }
    }
    const ollamaModels = Array.isArray(ollamaHealth.data?.models) ? ollamaHealth.data.models.map((entry) => entry.name).filter(Boolean) : [];
    state.aiStatus = {
      loading: false,
      checkedAt: new Date().toISOString(),
      opseeq: {
        reachable: Boolean(opseeqHealth.reachable),
        latencyMs: opseeqHealth.latencyMs || null,
        version: opseeqHealth.data?.version || null,
        models: opseeqModels,
      },
      ollama: {
        reachable: Boolean(ollamaHealth.reachable),
        latencyMs: ollamaHealth.latencyMs || null,
        models: ollamaModels,
        defaultModel: ollamaModels.includes('kimi-k2.5:cloud') ? 'kimi-k2.5:cloud' : ollamaModels[0] || state.settings.ollamaModel,
      },
    };
    if (!state.settings.opseeqModel && opseeqModels.length) {
      state.settings.opseeqModel = opseeqModels.find((model) => model.toLowerCase().includes('kimi')) || opseeqModels[0];
    }
    if (!ollamaModels.includes(state.settings.ollamaModel)) {
      state.settings.ollamaModel = state.aiStatus.ollama.defaultModel;
    }
    persistState();
  } catch (error) {
    state.aiStatus.loading = false;
    state.aiError = error instanceof Error ? error.message : String(error);
  }
  scheduleRender();
}

function describeCurrentAiRoute() {
  const opseeqReachable = state.aiStatus.opseeq.reachable;
  const ollamaReachable = state.aiStatus.ollama.reachable;
  const opseeqModel = state.settings.opseeqModel || 'gateway-default';
  const ollamaModel = state.settings.ollamaModel || state.aiStatus.ollama.defaultModel || 'kimi-k2.5:cloud';

  if (state.settings.aiMode === 'opseeq') {
    if (opseeqReachable) {
      return {
        provider: 'opseeq',
        model: opseeqModel,
        label: `Opseeq • ${opseeqModel}`,
        description: `Using Opseeq at /api/opseeq with ${opseeqModel}.`,
      };
    }
    return {
      provider: ollamaReachable ? 'ollama' : 'offline',
      model: ollamaModel,
      label: ollamaReachable ? `Opseeq fallback • ${ollamaModel}` : 'Opseeq offline',
      description: ollamaReachable ? `Opseeq is offline, so Lucidity will use ${ollamaModel} on Ollama.` : 'Neither Opseeq nor Ollama is reachable right now.',
    };
  }

  if (state.settings.aiMode === 'kimi') {
    const kimiModel = state.aiStatus.ollama.models.find((model) => model.toLowerCase().includes('kimi')) || ollamaModel;
    return {
      provider: ollamaReachable ? 'ollama' : 'offline',
      model: kimiModel,
      label: ollamaReachable ? `Kimi • ${kimiModel}` : 'Kimi offline',
      description: ollamaReachable ? `Using ${kimiModel} on local Ollama.` : 'Local Ollama is offline.',
    };
  }

  return {
    provider: ollamaReachable ? 'ollama' : 'offline',
    model: ollamaModel,
    label: ollamaReachable ? `Ollama • ${ollamaModel}` : 'Ollama offline',
    description: ollamaReachable ? `Using ${ollamaModel} on local Ollama.` : 'Local Ollama is offline.',
  };
}

async function runAiExpansion() {
  const doc = getActiveDocument();
  const selectedNode = getSelectedNode();
  if (!doc || !selectedNode) {
    pushToast('Select a node before running AI expansion.', 'warn');
    return;
  }

  const route = describeCurrentAiRoute();
  if (route.provider === 'offline') {
    state.aiError = 'No local AI route is available. Start Opseeq on :9090 or use Ollama on :11434.';
    scheduleRender();
    return;
  }

  state.aiBusy = true;
  state.aiError = '';
  state.aiResultInfo = '';
  scheduleRender();

  const systemPrompt = [
    'You are Opseeq, a systems-first diagram copilot.',
    'Extend the selected diagram node with 3 to 6 high-signal children.',
    'Prefer concrete branches: dependencies, steps, actors, risks, inputs, outputs, or next actions.',
    'Return JSON only in this shape: {"nodes":[{"label":"...","relationship":"...","shape":"rounded-rect"}]}',
    'Valid shape values: rounded-rect, rect, pill, diamond, note, document, cylinder, circle.',
  ].join(' ');

  const userPrompt = [
    `Diagram title: ${doc.title}`,
    `Diagram type: ${doc.type}`,
    `Selected node: ${selectedNode.label}`,
    `Visible nodes: ${doc.nodes.map((node) => node.label).slice(0, 18).join(', ')}`,
    `User intent: ${state.settings.prompt}`,
  ].join('\n');

  try {
    let rawText = '';
    if (route.provider === 'opseeq') {
      const response = await fetch('/api/opseeq/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: route.model,
          temperature: 0.45,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Opseeq completion failed');
      rawText = data.choices?.[0]?.message?.content || '';
    } else {
      const response = await fetch('/api/ollama/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: route.model,
          stream: false,
          format: 'json',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          options: {
            temperature: 0.45,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ollama completion failed');
      rawText = data.message?.content || '';
    }

    const expansion = parseAiExpansion(rawText);
    if (!expansion.length) throw new Error('The model returned no diagram branches.');
    pushHistorySnapshot();
    appendAiNodes(doc, selectedNode, expansion);
    state.aiResultInfo = `${expansion.length} branch${expansion.length === 1 ? '' : 'es'} added with ${route.label}.`;
    state.aiBusy = false;
    touchDocument(doc);
    scheduleRender();
  } catch (error) {
    state.aiBusy = false;
    state.aiError = error instanceof Error ? error.message : String(error);
    scheduleRender();
  }
}

function appendAiNodes(doc, selectedNode, items) {
  const theme = getTheme(doc.themeId);
  const side = inferSideForChild(doc, selectedNode);
  const existing = doc.edges
    .filter((edge) => edge.source === selectedNode.id)
    .map((edge) => doc.nodes.find((node) => node.id === edge.target))
    .filter(Boolean)
    .sort((a, b) => a.y - b.y);
  const gap = 94;
  const startY = existing.length ? existing[existing.length - 1].y + gap : selectedNode.y - ((items.length - 1) * gap) / 2;

  items.forEach((item, index) => {
    const color = theme.palette[(doc.nodes.length + index) % theme.palette.length];
    const node = createNode({
      label: item.label,
      x: selectedNode.x + (side === 'left' ? -250 : 250),
      y: startY + index * gap,
      width: item.shape === 'note' ? 200 : 182,
      height: item.shape === 'note' ? 108 : 68,
      shape: item.shape,
      fill: hexToRgba(color, 0.2),
      stroke: color,
      textColor: theme.ink,
      side,
    });
    doc.nodes.push(node);
    doc.edges.push(createEdge(selectedNode.id, node.id, { color: theme.line, label: item.relationship || '', kind: 'hierarchy' }));
  });
}

function importMermaid() {
  const doc = getActiveDocument();
  if (!doc) return;
  const source = (state.mermaidSource || '').trim();
  if (!source) {
    pushToast('Paste Mermaid first.', 'warn');
    return;
  }

  try {
    const parsed = parseMermaidDiagram(source, doc.title || 'Mermaid Diagram', doc.themeId);
    pushHistorySnapshot();
    doc.nodes = parsed.nodes;
    doc.edges = parsed.edges;
    doc.rootId = parsed.rootId;
    doc.type = 'flowchart';
    doc.templateId = 'blank-canvas';
    doc.viewInitialized = false;
    state.selection = parsed.rootId ? { type: 'node', id: parsed.rootId } : null;
    touchDocument(doc);
    scheduleRender();
    requestAnimationFrame(() => fitActiveDocumentToStage());
  } catch (error) {
    state.aiError = error instanceof Error ? error.message : String(error);
    scheduleRender();
  }
}

function advanceGuide() {
  const doc = getActiveDocument();
  if (!doc) return;
  if (state.guideStep >= GUIDE_STEPS.length - 1) {
    dismissGuide();
    return;
  }
  state.guideStep += 1;
  scheduleRender();
}

function dismissGuide() {
  const doc = getActiveDocument();
  if (!doc) return;
  doc.showGuide = false;
  state.guideStep = 0;
  touchDocument(doc);
  scheduleRender();
}

async function exportAsPng() {
  const doc = getActiveDocument();
  if (!doc) return;
  const bounds = getDocumentBounds(doc);
  const width = Math.ceil((bounds.maxX - bounds.minX) + 220);
  const height = Math.ceil((bounds.maxY - bounds.minY) + 220);
  const svg = createSvgMarkup(doc, { width, height, mode: 'export', background: true });
  const dataUri = svgToDataUri(svg);
  const image = new Image();
  image.src = dataUri;
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });
  const canvas = document.createElement('canvas');
  canvas.width = width * 2;
  canvas.height = height * 2;
  const context = canvas.getContext('2d');
  context.scale(2, 2);
  context.drawImage(image, 0, 0, width, height);
  const anchor = document.createElement('a');
  anchor.href = canvas.toDataURL('image/png');
  anchor.download = `${sanitizeFilename(doc.title)}.png`;
  anchor.click();
  pushToast('PNG export generated.', 'success');
  state.shareMenuOpen = false;
  scheduleRender();
}

function persistState(options = {}) {
  clearTimeout(persistTimer);
  const delay = options.immediate ? 0 : 180;
  persistTimer = setTimeout(async () => {
    localStorage.setItem(STORAGE_KEYS.documents, JSON.stringify(state.documents));
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings));
    await persistDocumentsToDatabase();
  }, delay);
}

async function hydrateDocuments() {
  state.storage.loading = true;
  scheduleRender();

  try {
    const response = await fetch('/api/documents');
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(errorText || `Storage request failed with ${response.status}`);
    }
    const payload = await response.json();
    const serverDocuments = normalizeDocuments(payload.documents || []);
    const fallbackDocuments = normalizeDocuments(readStorage(STORAGE_KEYS.documents, null) || []);
    const nextDocuments = serverDocuments.length ? serverDocuments : fallbackDocuments.length ? fallbackDocuments : createSeedDocuments();

    state.documents = nextDocuments;
    state.activeDocumentId = nextDocuments[0]?.id || null;
    state.selection = state.activeDocumentId ? { type: 'node', id: nextDocuments[0].rootId || nextDocuments[0].nodes[0]?.id } : null;
    state.storage.loading = false;
    state.storage.connected = true;
    state.storage.error = '';
    state.storage.source = 'postgres';
    state.storage.lastSavedAt = payload.savedAt || nextDocuments[0]?.updatedAt || null;

    if (!serverDocuments.length) {
      persistState({ immediate: true });
    }
  } catch (error) {
    state.documents = normalizeDocuments(state.documents.length ? state.documents : createSeedDocuments());
    state.activeDocumentId = state.documents[0]?.id || null;
    state.selection = state.activeDocumentId ? { type: 'node', id: state.documents[0].rootId || state.documents[0].nodes[0]?.id } : null;
    state.storage.loading = false;
    state.storage.connected = false;
    state.storage.error = error instanceof Error ? error.message : String(error);
    state.storage.source = 'local';
  }
}

async function persistDocumentsToDatabase() {
  state.storage.saving = true;
  scheduleRender();

  try {
    const response = await fetch('/api/documents/bulk', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documents: state.documents.map((doc) => ({
          ...doc,
          viewInitialized: false,
        })),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(errorText || `Save failed with ${response.status}`);
    }

    const payload = await response.json();
    state.storage.connected = true;
    state.storage.error = '';
    state.storage.source = 'postgres';
    state.storage.lastSavedAt = payload.savedAt || new Date().toISOString();
  } catch (error) {
    state.storage.connected = false;
    state.storage.source = 'local';
    state.storage.error = error instanceof Error ? error.message : String(error);
  } finally {
    state.storage.loading = false;
    state.storage.saving = false;
    scheduleRender();
  }
}

function touchDocument(doc, persist = true) {
  doc.updatedAt = new Date().toISOString();
  if (persist) persistState();
}

function getVisibleDocuments() {
  const query = state.search.trim().toLowerCase();
  return state.documents.filter((doc) => {
    if (state.homeSection === HOME_SECTIONS.trash) return false;
    if (state.homeSection === HOME_SECTIONS.shared) return doc.shared === true;
    if (!query) return true;
    return doc.title.toLowerCase().includes(query);
  });
}

function getActiveDocument() {
  return state.documents.find((doc) => doc.id === state.activeDocumentId) || null;
}

function getSelectedNode() {
  if (state.selection?.type !== 'node') return null;
  const doc = getActiveDocument();
  return doc?.nodes.find((node) => node.id === state.selection.id) || null;
}

function getSelectedEdge() {
  if (state.selection?.type !== 'edge') return null;
  const doc = getActiveDocument();
  return doc?.edges.find((edge) => edge.id === state.selection.id) || null;
}

function getParentNode(doc, nodeId) {
  const parentEdge = doc.edges.find((edge) => edge.target === nodeId && edge.kind !== 'manual');
  return parentEdge ? doc.nodes.find((node) => node.id === parentEdge.source) || null : null;
}

function getChildren(doc, nodeId) {
  return doc.edges
    .filter((edge) => edge.source === nodeId && edge.kind !== 'manual')
    .map((edge) => doc.nodes.find((node) => node.id === edge.target))
    .filter(Boolean);
}

function findRootNode(doc) {
  return doc.nodes.find((node) => node.id === doc.rootId) || doc.nodes[0] || null;
}

function inferSideForNode(doc, node) {
  const root = findRootNode(doc);
  if (!root || node.id === root.id) return 'right';
  if (node.side) return node.side;
  return node.x + node.width / 2 < root.x + root.width / 2 ? 'left' : 'right';
}

function inferSideForChild(doc, parent) {
  const root = findRootNode(doc);
  if (!root || parent.id !== root.id) return inferSideForNode(doc, parent);
  const children = getChildren(doc, parent.id);
  const leftCount = children.filter((node) => inferSideForNode(doc, node) === 'left').length;
  const rightCount = children.filter((node) => inferSideForNode(doc, node) === 'right').length;
  return leftCount <= rightCount ? 'left' : 'right';
}

function getNextChildPosition(doc, parent, side) {
  const children = getChildren(doc, parent.id).filter((node) => inferSideForNode(doc, node) === side).sort((a, b) => a.y - b.y);
  if (!children.length) {
    return {
      x: parent.x + (side === 'left' ? -250 : 250),
      y: parent.y,
    };
  }
  return {
    x: parent.x + (side === 'left' ? -250 : 250),
    y: children[children.length - 1].y + 94,
  };
}

function getDocumentBounds(doc) {
  const nodes = doc.nodes.length ? doc.nodes : [{ x: 0, y: 0, width: 200, height: 120 }];
  const minX = Math.min(...nodes.map((node) => node.x - 20));
  const minY = Math.min(...nodes.map((node) => node.y - 20));
  const maxX = Math.max(...nodes.map((node) => node.x + node.width + 20));
  const maxY = Math.max(...nodes.map((node) => node.y + node.height + 20));
  return { minX, minY, maxX, maxY };
}

function createSvgMarkup(doc, options = {}) {
  const width = options.width || 1280;
  const height = options.height || 720;
  const theme = getTheme(doc.themeId);
  let panX = doc.pan.x;
  let panY = doc.pan.y;
  let zoom = doc.zoom;
  if (options.mode === 'preview' || options.mode === 'export') {
    const bounds = getDocumentBounds(doc);
    const contentWidth = Math.max(200, bounds.maxX - bounds.minX);
    const contentHeight = Math.max(200, bounds.maxY - bounds.minY);
    const padding = options.mode === 'preview' ? 44 : 110;
    zoom = clamp(Math.min((width - padding) / contentWidth, (height - padding) / contentHeight, 1.12), 0.26, 1.2);
    panX = (width - contentWidth * zoom) / 2 - bounds.minX * zoom;
    panY = (height - contentHeight * zoom) / 2 - bounds.minY * zoom;
  }
  const edgeMarkup = doc.edges.map((edge) => renderEdgeMarkupForExport(doc, edge)).join('');
  const containerMarkup = doc.nodes.filter((node) => isContainerShape(node.shape)).map((node) => renderNodeMarkupForExport(node, theme)).join('');
  const nodeMarkup = doc.nodes.filter((node) => !isContainerShape(node.shape)).map((node) => renderNodeMarkupForExport(node, theme)).join('');
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <marker id="arrowhead-export" markerWidth="12" markerHeight="12" refX="8" refY="6" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L12,6 L0,12 z" fill="context-stroke"></path>
        </marker>
      </defs>
      <rect width="${width}" height="${height}" fill="${theme.background}"></rect>
      <g transform="translate(${panX} ${panY}) scale(${zoom})">
        ${edgeMarkup}
        ${containerMarkup}
        ${nodeMarkup}
      </g>
    </svg>
  `;
}

function renderNodeMarkupForExport(node, theme) {
  const body = buildNodeShape(node, node.stroke, node.strokeWidth || 2);
  const labelLayout = getNodeLabelLayout(node);
  const lines = labelLayout.lines;
  const lineHeight = labelLayout.lineHeight;
  const startY = node.y + node.height / 2 - ((lines.length - 1) * lineHeight) / 2;
  const padding = getNodePadding(node);
  const textX = node.shape === 'caption' ? node.x + padding.x : node.x + node.width / 2;
  const textAnchor = node.shape === 'caption' ? 'start' : 'middle';
  const showHeaderLabel = isContainerShape(node.shape);
  return `
    <g>
      ${body}
      ${showHeaderLabel ? '' : `<text x="${textX}" y="${startY}" fill="${node.textColor || theme.ink}" font-size="${node.fontSize}" font-family="${escapeAttr(node.fontFamily || FONT_OPTIONS[0])}" font-weight="${node.fontWeight || 600}" text-anchor="${textAnchor}" dominant-baseline="middle">
        ${lines.map((line, index) => `<tspan x="${textX}" dy="${index === 0 ? 0 : lineHeight}">${escapeHtml(line)}</tspan>`).join('')}
      </text>`}
      ${showHeaderLabel ? `<text x="${node.x + 16}" y="${node.y + 22}" fill="${node.textColor || theme.ink}" font-size="12" font-family="${escapeAttr(node.fontFamily || FONT_OPTIONS[0])}" font-weight="700">${escapeHtml(node.label)}</text>` : ''}
    </g>
  `;
}

function renderEdgeMarkupForExport(doc, edge) {
  const source = doc.nodes.find((node) => node.id === edge.source);
  const target = doc.nodes.find((node) => node.id === edge.target);
  if (!source || !target) return '';
  const geometry = getEdgeGeometry(source, target, edge);
  return `
    <g>
      <path d="${geometry.path}" fill="none" stroke="${edge.color}" stroke-width="${edge.width}" stroke-linecap="round" stroke-dasharray="${getEdgeDasharray(edge)}" marker-end="${edge.markerEnd === 'none' ? '' : 'url(#arrowhead-export)'}"></path>
      ${edge.label ? `<text x="${geometry.labelX}" y="${geometry.labelY}" fill="${edge.color}" font-size="12" font-family="IBM Plex Sans, sans-serif" font-weight="600" text-anchor="middle">${escapeHtml(edge.label)}</text>` : ''}
    </g>
  `;
}

function buildNodeShape(node, stroke, strokeWidth) {
  const fill = node.fill;
  const common = `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"`;
  switch (node.shape) {
    case 'rect':
      return `<rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="10" ${common}></rect>`;
    case 'rounded-rect':
      return `<rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="18" ${common}></rect>`;
    case 'pill':
    case 'terminator':
      return `<rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="${Math.min(node.height / 2, 999)}" ${common}></rect>`;
    case 'subroutine':
      return `<g>
        <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="12" ${common}></rect>
        <line x1="${node.x + 16}" y1="${node.y}" x2="${node.x + 16}" y2="${node.y + node.height}" stroke="${stroke}" stroke-width="${strokeWidth}"></line>
        <line x1="${node.x + node.width - 16}" y1="${node.y}" x2="${node.x + node.width - 16}" y2="${node.y + node.height}" stroke="${stroke}" stroke-width="${strokeWidth}"></line>
      </g>`;
    case 'diamond':
      return `<path d="M ${node.x + node.width / 2} ${node.y} L ${node.x + node.width} ${node.y + node.height / 2} L ${node.x + node.width / 2} ${node.y + node.height} L ${node.x} ${node.y + node.height / 2} Z" ${common}></path>`;
    case 'parallelogram':
      return `<path d="M ${node.x + 22} ${node.y} L ${node.x + node.width} ${node.y} L ${node.x + node.width - 22} ${node.y + node.height} L ${node.x} ${node.y + node.height} Z" ${common}></path>`;
    case 'document':
      return `<path d="M ${node.x} ${node.y} H ${node.x + node.width} V ${node.y + node.height - 18} Q ${node.x + node.width - 20} ${node.y + node.height + 6} ${node.x + node.width - 48} ${node.y + node.height - 4} Q ${node.x + node.width - 78} ${node.y + node.height - 16} ${node.x + node.width - 110} ${node.y + node.height - 4} Q ${node.x + 18} ${node.y + node.height + 10} ${node.x} ${node.y + node.height - 14} Z" ${common}></path>`;
    case 'manual-input':
      return `<path d="M ${node.x + 18} ${node.y} H ${node.x + node.width} V ${node.y + node.height} H ${node.x} V ${node.y + 18} Z" ${common}></path>`;
    case 'display':
      return `<path d="M ${node.x} ${node.y + node.height / 2} Q ${node.x + 18} ${node.y} ${node.x + 56} ${node.y} H ${node.x + node.width - 16} Q ${node.x + node.width} ${node.y + node.height / 2} ${node.x + node.width - 16} ${node.y + node.height} H ${node.x + 56} Q ${node.x + 18} ${node.y + node.height} ${node.x} ${node.y + node.height / 2} Z" ${common}></path>`;
    case 'delay':
      return `<path d="M ${node.x} ${node.y} H ${node.x + node.width - node.height / 2} A ${node.height / 2} ${node.height / 2} 0 0 1 ${node.x + node.width - node.height / 2} ${node.y + node.height} H ${node.x} Z" ${common}></path>`;
    case 'off-page':
      return `<path d="M ${node.x} ${node.y} H ${node.x + node.width} V ${node.y + node.height - 24} L ${node.x + node.width / 2} ${node.y + node.height} L ${node.x} ${node.y + node.height - 24} Z" ${common}></path>`;
    case 'connector':
      return `<ellipse cx="${node.x + node.width / 2}" cy="${node.y + node.height / 2}" rx="${node.width / 2}" ry="${node.height / 2}" ${common}></ellipse>`;
    case 'cylinder':
      return `<path d="M ${node.x} ${node.y + 18} C ${node.x} ${node.y + 4}, ${node.x + node.width} ${node.y + 4}, ${node.x + node.width} ${node.y + 18} V ${node.y + node.height - 18} C ${node.x + node.width} ${node.y + node.height - 4}, ${node.x} ${node.y + node.height - 4}, ${node.x} ${node.y + node.height - 18} Z" ${common}></path>
              <ellipse cx="${node.x + node.width / 2}" cy="${node.y + 18}" rx="${node.width / 2}" ry="18" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"></ellipse>`;
    case 'circle':
      return `<ellipse cx="${node.x + node.width / 2}" cy="${node.y + node.height / 2}" rx="${node.width / 2}" ry="${node.height / 2}" ${common}></ellipse>`;
    case 'hexagon':
      return `<path d="M ${node.x + 26} ${node.y} H ${node.x + node.width - 26} L ${node.x + node.width} ${node.y + node.height / 2} L ${node.x + node.width - 26} ${node.y + node.height} H ${node.x + 26} L ${node.x} ${node.y + node.height / 2} Z" ${common}></path>`;
    case 'triangle':
      return `<path d="M ${node.x + node.width / 2} ${node.y} L ${node.x + node.width} ${node.y + node.height} L ${node.x} ${node.y + node.height} Z" ${common}></path>`;
    case 'pentagon':
      return `<path d="M ${node.x + node.width / 2} ${node.y} L ${node.x + node.width} ${node.y + node.height * 0.38} L ${node.x + node.width * 0.8} ${node.y + node.height} H ${node.x + node.width * 0.2} L ${node.x} ${node.y + node.height * 0.38} Z" ${common}></path>`;
    case 'octagon':
      return `<path d="M ${node.x + 22} ${node.y} H ${node.x + node.width - 22} L ${node.x + node.width} ${node.y + 22} V ${node.y + node.height - 22} L ${node.x + node.width - 22} ${node.y + node.height} H ${node.x + 22} L ${node.x} ${node.y + node.height - 22} V ${node.y + 22} Z" ${common}></path>`;
    case 'star':
      return `<path d="M ${node.x + node.width / 2} ${node.y} L ${node.x + node.width * 0.62} ${node.y + node.height * 0.36} L ${node.x + node.width} ${node.y + node.height * 0.38} L ${node.x + node.width * 0.7} ${node.y + node.height * 0.6} L ${node.x + node.width * 0.82} ${node.y + node.height} L ${node.x + node.width / 2} ${node.y + node.height * 0.75} L ${node.x + node.width * 0.18} ${node.y + node.height} L ${node.x + node.width * 0.3} ${node.y + node.height * 0.6} L ${node.x} ${node.y + node.height * 0.38} L ${node.x + node.width * 0.38} ${node.y + node.height * 0.36} Z" ${common}></path>`;
    case 'tag':
      return `<path d="M ${node.x} ${node.y + node.height / 2} L ${node.x + 24} ${node.y} H ${node.x + node.width} V ${node.y + node.height} H ${node.x + 24} Z" ${common}></path>`;
    case 'cloud':
      return `<path d="M ${node.x + 36} ${node.y + node.height - 30} C ${node.x + 8} ${node.y + node.height - 32}, ${node.x + 2} ${node.y + 42}, ${node.x + 40} ${node.y + 36} C ${node.x + 46} ${node.y + 8}, ${node.x + 84} ${node.y + 2}, ${node.x + 106} ${node.y + 24} C ${node.x + 134} ${node.y + 10}, ${node.x + 174} ${node.y + 22}, ${node.x + 176} ${node.y + 56} C ${node.x + 206} ${node.y + 60}, ${node.x + 210} ${node.y + node.height - 18}, ${node.x + 176} ${node.y + node.height - 20} H ${node.x + 36} Z" ${common}></path>`;
    case 'group-frame':
    case 'lane':
    case 'board':
    case 'cluster':
      return `<rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="22" fill="${node.fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-dasharray="10 6"></rect>`;
    case 'image-card':
      return `<g>
        <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="18" ${common}></rect>
        <rect x="${node.x + 14}" y="${node.y + 14}" width="${node.width - 28}" height="${node.height - 50}" rx="12" fill="${hexToRgba(stroke, 0.14)}" stroke="${stroke}" stroke-width="1"></rect>
      </g>`;
    case 'callout':
      return `<path d="M ${node.x} ${node.y} H ${node.x + node.width} V ${node.y + node.height - 22} H ${node.x + node.width * 0.6} L ${node.x + node.width * 0.46} ${node.y + node.height + 14} L ${node.x + node.width * 0.44} ${node.y + node.height - 22} H ${node.x} Z" ${common}></path>`;
    case 'table':
      return `<g>
        <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="10" ${common}></rect>
        <line x1="${node.x}" y1="${node.y + 34}" x2="${node.x + node.width}" y2="${node.y + 34}" stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth - 0.5)}"></line>
        <line x1="${node.x + node.width / 2}" y1="${node.y + 34}" x2="${node.x + node.width / 2}" y2="${node.y + node.height}" stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth - 0.5)}"></line>
        <line x1="${node.x}" y1="${node.y + (node.height + 34) / 2}" x2="${node.x + node.width}" y2="${node.y + (node.height + 34) / 2}" stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth - 0.5)}"></line>
      </g>`;
    case 'caption':
    case 'text':
      return `<rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" fill="transparent" stroke="transparent"></rect>`;
    case 'chevron':
      return `<path d="M ${node.x} ${node.y} H ${node.x + node.width - 32} L ${node.x + node.width} ${node.y + node.height / 2} L ${node.x + node.width - 32} ${node.y + node.height} H ${node.x} L ${node.x + 22} ${node.y + node.height / 2} Z" ${common}></path>`;
    case 'note':
      return `<path d="M ${node.x} ${node.y} H ${node.x + node.width - 24} L ${node.x + node.width} ${node.y + 24} V ${node.y + node.height} H ${node.x} Z" ${common}></path>
              <path d="M ${node.x + node.width - 24} ${node.y} V ${node.y + 24} H ${node.x + node.width}" fill="${hexToRgba(stroke, 0.16)}" stroke="${stroke}" stroke-width="${strokeWidth}"></path>`;
    default:
      return `<rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="16" ${common}></rect>`;
  }
}

function getEdgeGeometry(source, target, edge) {
  const sourceCenter = { x: source.x + source.width / 2, y: source.y + source.height / 2 };
  const targetCenter = { x: target.x + target.width / 2, y: target.y + target.height / 2 };
  const dx = targetCenter.x - sourceCenter.x;
  const dy = targetCenter.y - sourceCenter.y;
  const horizontal = Math.abs(dx) >= Math.abs(dy);
  const start = horizontal
    ? { x: sourceCenter.x + Math.sign(dx || 1) * source.width / 2, y: sourceCenter.y }
    : { x: sourceCenter.x, y: sourceCenter.y + Math.sign(dy || 1) * source.height / 2 };
  const end = horizontal
    ? { x: targetCenter.x - Math.sign(dx || 1) * target.width / 2, y: targetCenter.y }
    : { x: targetCenter.x, y: targetCenter.y - Math.sign(dy || 1) * target.height / 2 };

  const edgeStyle = edge.style || 'curve';
  let path = '';
  let labelX = (start.x + end.x) / 2;
  let labelY = (start.y + end.y) / 2 - 8;
  let routePoints = [start, end];
  let segmentHandles = [];
  let bendHandles = [];

  if (edgeStyle === 'straight') {
    routePoints = [start, end];
    path = buildPolylinePath(routePoints);
    const midpoint = getPolylineMidpoint(routePoints);
    labelX = midpoint.x;
    labelY = midpoint.y - 8;
    segmentHandles = buildSegmentHandles(routePoints);
  } else if (edgeStyle === 'elbow') {
    const manualBends = compactEdgeBendPoints(edge.bendPoints || []);
    routePoints = manualBends.length
      ? [start, ...manualBends, end]
      : getAutoElbowRoute(start, end, dx, dy, horizontal);
    path = buildPolylinePath(routePoints);
    const midpoint = getPolylineMidpoint(routePoints);
    labelX = midpoint.x;
    labelY = midpoint.y - 10;
    segmentHandles = buildSegmentHandles(routePoints);
    bendHandles = manualBends.map((point, index) => ({ index, x: point.x, y: point.y }));
  } else if (horizontal) {
    const bend = Math.max(56, Math.min(220, Math.abs(end.x - start.x) * 0.42));
    const c1 = { x: start.x + Math.sign(dx || 1) * bend, y: start.y };
    const c2 = { x: end.x - Math.sign(dx || 1) * bend, y: end.y };
    path = `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
    const midpoint = cubicBezierPoint(start, c1, c2, end, 0.5);
    labelX = midpoint.x;
    labelY = midpoint.y - 8;
  } else {
    const bend = Math.max(56, Math.min(220, Math.abs(end.y - start.y) * 0.42));
    const c1 = { x: start.x, y: start.y + Math.sign(dy || 1) * bend };
    const c2 = { x: end.x, y: end.y - Math.sign(dy || 1) * bend };
    path = `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
    const midpoint = cubicBezierPoint(start, c1, c2, end, 0.5);
    labelX = midpoint.x;
    labelY = midpoint.y - 8;
  }

  return {
    path,
    start,
    end,
    labelX,
    labelY,
    routePoints,
    segmentHandles,
    bendHandles,
  };
}

function buildPolylinePath(points) {
  if (!points?.length) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  return `M ${points[0].x} ${points[0].y} ${points.slice(1).map((point) => `L ${point.x} ${point.y}`).join(' ')}`;
}

function getAutoElbowRoute(start, end, dx, dy, horizontal) {
  if (horizontal) {
    const direction = Math.sign(dx || 1);
    const lead = Math.max(52, Math.min(Math.abs(dx) * 0.38, 180));
    const x1 = start.x + direction * lead;
    const x2 = end.x - direction * lead;
    const bendX = Math.abs(x1 - x2) < 24 ? (start.x + end.x) / 2 : x1;
    return [
      start,
      { x: x1, y: start.y },
      { x: bendX, y: end.y },
      end,
    ];
  }
  const direction = Math.sign(dy || 1);
  const lead = Math.max(52, Math.min(Math.abs(dy) * 0.38, 180));
  const y1 = start.y + direction * lead;
  const y2 = end.y - direction * lead;
  const bendY = Math.abs(y1 - y2) < 24 ? (start.y + end.y) / 2 : y1;
  return [
    start,
    { x: start.x, y: y1 },
    { x: end.x, y: bendY },
    end,
  ];
}

function buildSegmentHandles(points) {
  const handles = [];
  for (let index = 0; index < points.length - 1; index += 1) {
    const from = points[index];
    const to = points[index + 1];
    const length = Math.hypot(to.x - from.x, to.y - from.y);
    if (length < 14) continue;
    handles.push({
      index,
      x: (from.x + to.x) / 2,
      y: (from.y + to.y) / 2,
    });
  }
  return handles;
}

function getPolylineMidpoint(points) {
  if (!points?.length) return { x: 0, y: 0 };
  if (points.length === 1) return points[0];
  const segments = [];
  let total = 0;
  for (let index = 0; index < points.length - 1; index += 1) {
    const from = points[index];
    const to = points[index + 1];
    const length = Math.hypot(to.x - from.x, to.y - from.y);
    segments.push({ from, to, length });
    total += length;
  }
  const target = total / 2;
  let walked = 0;
  for (const segment of segments) {
    if (!segment.length) continue;
    if (walked + segment.length >= target) {
      const ratio = (target - walked) / segment.length;
      return {
        x: segment.from.x + (segment.to.x - segment.from.x) * ratio,
        y: segment.from.y + (segment.to.y - segment.from.y) * ratio,
      };
    }
    walked += segment.length;
  }
  return points[points.length - 1];
}

function cubicBezierPoint(p0, p1, p2, p3, t) {
  const oneMinus = 1 - t;
  const oneMinus2 = oneMinus * oneMinus;
  const oneMinus3 = oneMinus2 * oneMinus;
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: oneMinus3 * p0.x + 3 * oneMinus2 * t * p1.x + 3 * oneMinus * t2 * p2.x + t3 * p3.x,
    y: oneMinus3 * p0.y + 3 * oneMinus2 * t * p1.y + 3 * oneMinus * t2 * p2.y + t3 * p3.y,
  };
}

function parseAiExpansion(rawText) {
  const cleaned = rawText.trim();
  const candidates = [cleaned, stripCodeFences(cleaned), extractJsonObject(cleaned)];
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const parsed = JSON.parse(candidate);
      if (Array.isArray(parsed.nodes)) {
        return parsed.nodes
          .map((entry) => ({
            label: String(entry.label || '').trim(),
            relationship: String(entry.relationship || '').trim(),
            shape: sanitizeShape(entry.shape),
          }))
          .filter((entry) => entry.label)
          .slice(0, 6);
      }
    } catch {
      continue;
    }
  }

  return cleaned
    .split(/\n+/)
    .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, 6)
    .map((label) => ({ label, relationship: '', shape: 'rounded-rect' }));
}

function parseMermaidDiagram(source, title, themeId) {
  const lines = source
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('graph ') && !line.startsWith('flowchart '));

  if (!lines.length) throw new Error('No Mermaid lines found.');

  const nodeMap = new Map();
  const edges = [];
  for (const line of lines) {
    const match = line.match(/^(.*?)\s*(-->|-.->|==>)\s*(?:\|(.+?)\|\s*)?(.*)$/);
    if (!match) continue;
    const [, rawSource, operator, label, rawTarget] = match;
    const sourceNode = parseMermaidNodeToken(rawSource);
    const targetNode = parseMermaidNodeToken(rawTarget);
    nodeMap.set(sourceNode.id, { ...nodeMap.get(sourceNode.id), ...sourceNode });
    nodeMap.set(targetNode.id, { ...nodeMap.get(targetNode.id), ...targetNode });
    edges.push({ source: sourceNode.id, target: targetNode.id, label: label || '', dashed: operator.includes('.'), kind: 'hierarchy' });
  }

  if (!nodeMap.size) throw new Error('Could not parse Mermaid nodes.');

  const incoming = new Map();
  for (const edge of edges) incoming.set(edge.target, (incoming.get(edge.target) || 0) + 1);
  const rootId = [...nodeMap.keys()].find((id) => !incoming.has(id)) || [...nodeMap.keys()][0];
  const levels = assignMermaidLevels(rootId, edges);
  const columns = new Map();
  const theme = getTheme(themeId);
  const nodes = [...nodeMap.values()].map((nodeData) => {
    const level = levels.get(nodeData.id) || 0;
    const column = columns.get(level) || 0;
    columns.set(level, column + 1);
    const color = theme.palette[(level + column) % theme.palette.length];
    const width = nodeData.shape === 'diamond' ? 170 : nodeData.shape === 'circle' ? 112 : nodeData.shape === 'cylinder' ? 180 : 180;
    const height = nodeData.shape === 'diamond' ? 104 : nodeData.shape === 'note' ? 100 : nodeData.shape === 'circle' ? 112 : 72;
    return createNode({
      label: nodeData.label,
      x: 180 + level * 280,
      y: 160 + column * 130,
      width,
      height,
      shape: nodeData.shape,
      fill: hexToRgba(color, 0.2),
      stroke: color,
      textColor: theme.ink,
    }, nodeData.id);
  });

  return {
    title,
    rootId,
    nodes,
    edges: edges.map((edge) => createEdge(edge.source, edge.target, { label: edge.label, dashed: edge.dashed, color: theme.line, kind: edge.kind })),
  };
}

function assignMermaidLevels(rootId, edges) {
  const queue = [rootId];
  const levels = new Map([[rootId, 0]]);
  while (queue.length) {
    const current = queue.shift();
    const currentLevel = levels.get(current) || 0;
    for (const edge of edges.filter((entry) => entry.source === current)) {
      if (levels.has(edge.target)) continue;
      levels.set(edge.target, currentLevel + 1);
      queue.push(edge.target);
    }
  }
  return levels;
}

function parseMermaidNodeToken(rawToken) {
  const token = rawToken.trim();
  const patterns = [
    { regex: /^([A-Za-z0-9_-]+)\[\((.+)\)\]$/, shape: 'cylinder' },
    { regex: /^([A-Za-z0-9_-]+)\{(.+)\}$/, shape: 'diamond' },
    { regex: /^([A-Za-z0-9_-]+)\(\((.+)\)\)$/, shape: 'circle' },
    { regex: /^([A-Za-z0-9_-]+)\((.+)\)$/, shape: 'pill' },
    { regex: /^([A-Za-z0-9_-]+)\[(.+)\]$/, shape: 'rounded-rect' },
    { regex: /^([A-Za-z0-9_-]+)\>(.+)\]$/, shape: 'parallelogram' },
  ];
  for (const pattern of patterns) {
    const match = token.match(pattern.regex);
    if (match) {
      return { id: match[1], label: match[2].trim(), shape: pattern.shape };
    }
  }
  const bare = token.match(/^([A-Za-z0-9_-]+)$/);
  if (bare) {
    return { id: bare[1], label: bare[1], shape: 'rounded-rect' };
  }
  throw new Error(`Unsupported Mermaid token: ${token}`);
}

function renderGuideIllustration(kind) {
  if (kind === 'shortcut') {
    return '<div class="illus-brace"></div><div class="illus-pill"></div><div class="illus-enter">enter</div>';
  }
  if (kind === 'share') {
    return '<div class="illus-share-cluster"><span></span><span></span><span></span><span></span></div>';
  }
  return '<div class="illus-ai-dot"></div><div class="illus-ai-column"><span></span><span></span><span></span></div>';
}

function createSeedDocuments() {
  const docs = [
    buildMindMap('My Achievement', { seedGuide: false }),
    buildPerformanceMatrix('9 Box Performance-Pot...', { seedGuide: false }),
    buildArchitecture('Marketing Project', { seedGuide: false }),
    buildWorkshop('Workshop', { seedGuide: false }),
  ];
  docs[0].updatedAt = offsetTime(2, 'minute');
  docs[1].updatedAt = offsetTime(2, 'minute');
  docs[2].updatedAt = offsetTime(5, 'minute');
  docs[3].updatedAt = offsetTime(2, 'minute');
  return docs;
}

function buildBlankCanvas(title) {
  const doc = createDocument(title, 'diagram', 'blank-canvas');
  const root = createNode({
    label: 'Central Topic',
    x: 560,
    y: 320,
    width: 240,
    height: 86,
    shape: 'rounded-rect',
    fill: '#ffffff',
    stroke: getTheme(doc.themeId).accent,
    textColor: getTheme(doc.themeId).ink,
    fontSize: 20,
  });
  doc.nodes.push(root);
  doc.rootId = root.id;
  doc.showGuide = true;
  return doc;
}

function buildMindMap(title, options = {}) {
  const doc = createDocument(title, 'mindmap', 'studio');
  const theme = getTheme(doc.themeId);
  const root = createNode({
    label: 'Central Topic',
    x: 560,
    y: 320,
    width: 240,
    height: 86,
    shape: 'rounded-rect',
    fill: '#ffffff',
    stroke: theme.accent,
    textColor: theme.ink,
    fontSize: 20,
  });
  const children = [
    createNode({ label: 'Main Topic 1', x: 1030, y: 228, width: 170, height: 58, shape: 'rounded-rect', fill: hexToRgba(theme.palette[0], 0.26), stroke: theme.palette[0], textColor: theme.ink, side: 'right' }),
    createNode({ label: 'Main Topic 2', x: 980, y: 378, width: 190, height: 60, shape: 'rounded-rect', fill: hexToRgba(theme.palette[1], 0.26), stroke: theme.palette[1], textColor: theme.ink, side: 'right' }),
    createNode({ label: 'Main Topic 3', x: 230, y: 378, width: 170, height: 60, shape: 'rounded-rect', fill: hexToRgba(theme.palette[3], 0.26), stroke: theme.palette[3], textColor: theme.ink, side: 'left' }),
    createNode({ label: 'Main Topic 4', x: 230, y: 228, width: 170, height: 60, shape: 'rounded-rect', fill: hexToRgba(theme.palette[2], 0.26), stroke: theme.palette[2], textColor: theme.ink, side: 'left' }),
  ];
  doc.nodes.push(root, ...children);
  doc.edges.push(
    createEdge(root.id, children[0].id, { color: theme.palette[0], kind: 'hierarchy' }),
    createEdge(root.id, children[1].id, { color: theme.palette[1], kind: 'hierarchy' }),
    createEdge(root.id, children[2].id, { color: theme.palette[3], kind: 'hierarchy' }),
    createEdge(root.id, children[3].id, { color: theme.palette[2], kind: 'hierarchy' }),
  );
  doc.rootId = root.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildLogicChart(title, options = {}) {
  const doc = createDocument(title, 'logic-chart', 'atlas');
  const theme = getTheme(doc.themeId);
  const root = createNode({ label: 'Central Topic', x: 430, y: 286, width: 200, height: 72, shape: 'rect', fill: theme.accent, stroke: theme.accent, textColor: '#ffffff', fontSize: 18 });
  const topics = [0, 1, 2, 3].map((index) => createNode({ label: `Main Topic ${index + 1}`, x: 820, y: 112 + index * 102, width: 170, height: 54, shape: 'rect', fill: '#1a202e', stroke: '#1a202e', textColor: '#ffffff', fontSize: 14, side: 'right' }));
  doc.nodes.push(root, ...topics);
  topics.forEach((topic) => {
    doc.edges.push(createEdge(root.id, topic.id, { color: theme.line, kind: 'hierarchy' }));
  });
  doc.rootId = root.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildBraceMap(title, options = {}) {
  const doc = createDocument(title, 'brace-map', 'paper');
  const theme = getTheme(doc.themeId);
  const root = createNode({ label: 'Central Topic', x: 470, y: 290, width: 220, height: 72, shape: 'rect', fill: '#ffffff', stroke: '#28356f', textColor: theme.ink, fontSize: 18 });
  const vertical = [0, 1, 2, 3].map((index) => createNode({ label: `Main Topic ${index + 1}`, x: 880, y: 82 + index * 92, width: 150, height: 48, shape: 'rounded-rect', fill: hexToRgba(theme.palette[index], 0.24), stroke: theme.palette[index], textColor: theme.ink, side: 'right' }));
  doc.nodes.push(root, ...vertical);
  vertical.forEach((node) => {
    doc.edges.push(createEdge(root.id, node.id, { color: theme.line, kind: 'hierarchy' }));
  });
  doc.rootId = root.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildOrgChart(title, options = {}) {
  const doc = createDocument(title, 'org-chart', 'signal');
  const theme = getTheme(doc.themeId);
  const root = createNode({ label: 'Central Topic', x: 520, y: 80, width: 220, height: 68, shape: 'rect', fill: '#355c7d', stroke: '#355c7d', textColor: '#ffffff', fontSize: 18 });
  const members = ['Main Topic 1', 'Main Topic 2', 'Main Topic 3', 'Main Topic 4'].map((label, index) => createNode({ label, x: 120 + index * 230, y: 270, width: 150, height: 48, shape: 'rounded-rect', fill: '#f7f0d1', stroke: theme.line, textColor: theme.ink, fontSize: 14 }));
  doc.nodes.push(root, ...members);
  members.forEach((node) => {
    doc.edges.push(createEdge(root.id, node.id, { color: '#e6dfb6', kind: 'hierarchy' }));
  });
  doc.rootId = root.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildProblemSolving(title, options = {}) {
  const doc = createDocument(title, 'knowledge', 'signal');
  const theme = getTheme(doc.themeId);
  const container = createNode({ label: 'Problem Solving Frame', x: 120, y: 80, width: 960, height: 500, shape: 'group-frame', fill: hexToRgba('#1f2937', 0.08), stroke: '#7cb47e', textColor: theme.ink, fontSize: 12 });
  const center = createNode({ label: 'Steps of\nProblem Solving', x: 440, y: 240, width: 180, height: 140, shape: 'diamond', fill: '#46684f', stroke: '#90d27d', textColor: '#ffffff', fontSize: 18 });
  const cards = [
    ['Clarify Goal', 160, 120],
    ['Map Constraints', 160, 362],
    ['Generate Options', 760, 120],
    ['Pick Best Next Move', 760, 362],
  ].map(([label, x, y], index) => createNode({ label, x, y, width: 190, height: 86, shape: 'note', fill: hexToRgba(theme.palette[index], 0.18), stroke: theme.palette[index], textColor: theme.ink, fontSize: 16 }));
  doc.nodes.push(container, center, ...cards);
  cards.forEach((node) => doc.edges.push(createEdge(center.id, node.id, { color: '#b0d192', kind: 'hierarchy' })));
  doc.rootId = center.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildArchitecture(title, options = {}) {
  const doc = createDocument(title, 'architecture', 'atlas');
  const theme = getTheme(doc.themeId);
  const board = createNode({ label: 'Marketing Project', x: 100, y: 120, width: 1020, height: 420, shape: 'board', fill: hexToRgba('#14324a', 0.14), stroke: '#274f6c', textColor: theme.ink, fontSize: 12 });
  const nodes = [
    createNode({ label: 'Local UI', x: 170, y: 240, width: 190, height: 80, shape: 'rect', fill: '#e7f1ff', stroke: '#5b8df2', textColor: theme.ink }),
    createNode({ label: 'Chart Engine', x: 470, y: 160, width: 210, height: 88, shape: 'rect', fill: '#dff2ff', stroke: '#4cb6d6', textColor: theme.ink }),
    createNode({ label: 'Opseeq Router', x: 470, y: 320, width: 210, height: 88, shape: 'rect', fill: '#d3ebff', stroke: '#0f7bc0', textColor: theme.ink }),
    createNode({ label: 'Local Ollama', x: 810, y: 160, width: 190, height: 80, shape: 'cylinder', fill: '#f8edc8', stroke: '#e8b44d', textColor: theme.ink }),
    createNode({ label: 'Kimi 2.5', x: 810, y: 320, width: 190, height: 80, shape: 'rect', fill: '#fde0dc', stroke: '#ef7b72', textColor: theme.ink }),
  ];
  doc.nodes.push(board, ...nodes);
  doc.edges.push(
    createEdge(nodes[0].id, nodes[1].id, { color: '#7cb3ff', kind: 'hierarchy' }),
    createEdge(nodes[1].id, nodes[3].id, { color: '#6f7f95', kind: 'hierarchy' }),
    createEdge(nodes[0].id, nodes[2].id, { color: '#6f7f95', kind: 'hierarchy' }),
    createEdge(nodes[2].id, nodes[4].id, { color: '#ef7b72', kind: 'hierarchy' }),
  );
  doc.rootId = nodes[1].id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildSpacecraft(title, options = {}) {
  const doc = createDocument(title, 'knowledge', 'paper');
  const theme = getTheme(doc.themeId);
  const board = createNode({ label: 'Spacecraft', x: 120, y: 100, width: 1020, height: 420, shape: 'board', fill: hexToRgba('#1a1541', 0.08), stroke: '#4733a2', textColor: theme.ink, fontSize: 12 });
  const modules = [
    createNode({ label: 'Mission', x: 180, y: 170, width: 180, height: 78, shape: 'rect', fill: '#fde4ff', stroke: '#c55ac3', textColor: theme.ink }),
    createNode({ label: 'Subsystems', x: 430, y: 170, width: 190, height: 78, shape: 'diamond', fill: '#cfe3ff', stroke: '#6687f6', textColor: theme.ink }),
    createNode({ label: 'Ground Ops', x: 720, y: 170, width: 190, height: 78, shape: 'rect', fill: '#f2dd9a', stroke: '#f1ae4b', textColor: theme.ink }),
    createNode({ label: 'Telemetry', x: 430, y: 330, width: 190, height: 78, shape: 'rect', fill: '#d2f1f4', stroke: '#6fc7d1', textColor: theme.ink }),
  ];
  doc.nodes.push(board, ...modules);
  doc.edges.push(
    createEdge(modules[0].id, modules[1].id, { color: theme.line, kind: 'hierarchy' }),
    createEdge(modules[1].id, modules[2].id, { color: theme.line, kind: 'hierarchy' }),
    createEdge(modules[1].id, modules[3].id, { color: theme.line, kind: 'hierarchy' }),
  );
  doc.rootId = modules[1].id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildDiagramLandscape(title, options = {}) {
  const doc = createDocument(title, 'knowledge', 'studio');
  const theme = getTheme(doc.themeId);
  const clusterA = createNode({ label: 'Core Systems', x: 100, y: 120, width: 430, height: 290, shape: 'cluster', fill: hexToRgba(theme.palette[4], 0.12), stroke: theme.palette[4], textColor: theme.ink, fontSize: 12 });
  const clusterB = createNode({ label: 'Downstream Views', x: 610, y: 210, width: 430, height: 250, shape: 'cluster', fill: hexToRgba(theme.palette[1], 0.12), stroke: theme.palette[1], textColor: theme.ink, fontSize: 12 });
  const nodes = [
    createNode({ label: 'Assets', x: 170, y: 190, width: 150, height: 68, shape: 'rounded-rect', fill: hexToRgba(theme.palette[2], 0.22), stroke: theme.palette[2], textColor: theme.ink }),
    createNode({ label: 'References', x: 340, y: 300, width: 150, height: 68, shape: 'rounded-rect', fill: hexToRgba(theme.palette[3], 0.22), stroke: theme.palette[3], textColor: theme.ink }),
    createNode({ label: 'Narrative', x: 690, y: 260, width: 160, height: 68, shape: 'rounded-rect', fill: hexToRgba(theme.palette[0], 0.22), stroke: theme.palette[0], textColor: theme.ink }),
    createNode({ label: 'Presentation', x: 890, y: 330, width: 170, height: 68, shape: 'rounded-rect', fill: hexToRgba(theme.palette[5], 0.24), stroke: theme.palette[5], textColor: theme.ink }),
  ];
  doc.nodes.push(clusterA, clusterB, ...nodes);
  doc.edges.push(
    createEdge(nodes[0].id, nodes[2].id, { color: theme.line, kind: 'hierarchy' }),
    createEdge(nodes[1].id, nodes[3].id, { color: theme.line, kind: 'hierarchy' }),
  );
  doc.rootId = nodes[0].id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildBusinessPlan(title, options = {}) {
  const doc = createDocument(title, 'planning', 'paper');
  const theme = getTheme(doc.themeId);
  const root = createNode({ label: 'Business Plan', x: 480, y: 260, width: 220, height: 74, shape: 'rounded-rect', fill: '#ffffff', stroke: '#27386e', textColor: theme.ink, fontSize: 18 });
  const nodes = [
    createNode({ label: 'Vision', x: 140, y: 160, width: 160, height: 54, shape: 'pill', fill: hexToRgba(theme.palette[0], 0.24), stroke: theme.palette[0], textColor: theme.ink, side: 'left' }),
    createNode({ label: 'Customer', x: 150, y: 340, width: 160, height: 54, shape: 'pill', fill: hexToRgba(theme.palette[2], 0.24), stroke: theme.palette[2], textColor: theme.ink, side: 'left' }),
    createNode({ label: 'Revenue', x: 880, y: 160, width: 170, height: 54, shape: 'pill', fill: hexToRgba(theme.palette[1], 0.24), stroke: theme.palette[1], textColor: theme.ink, side: 'right' }),
    createNode({ label: 'Operations', x: 860, y: 340, width: 180, height: 54, shape: 'pill', fill: hexToRgba(theme.palette[4], 0.24), stroke: theme.palette[4], textColor: theme.ink, side: 'right' }),
  ];
  doc.nodes.push(root, ...nodes);
  nodes.forEach((node) => doc.edges.push(createEdge(root.id, node.id, { color: theme.line, kind: 'hierarchy' })));
  doc.rootId = root.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildReleaseCoordination(title, options = {}) {
  const doc = createDocument(title, 'planning', 'studio');
  const theme = getTheme(doc.themeId);
  const board = createNode({ label: 'Release Coordination', x: 120, y: 90, width: 1040, height: 480, shape: 'board', fill: hexToRgba('#17181f', 0.04), stroke: '#aeb7c3', textColor: theme.ink, fontSize: 12 });
  const laneA = createNode({ label: 'Cross-Functional Review', x: 160, y: 140, width: 260, height: 340, shape: 'lane', fill: hexToRgba(theme.palette[4], 0.1), stroke: theme.palette[4], textColor: theme.ink, fontSize: 12 });
  const laneB = createNode({ label: 'Schedule', x: 450, y: 140, width: 260, height: 340, shape: 'lane', fill: hexToRgba(theme.palette[2], 0.1), stroke: theme.palette[2], textColor: theme.ink, fontSize: 12 });
  const laneC = createNode({ label: 'Risks', x: 740, y: 140, width: 260, height: 340, shape: 'lane', fill: hexToRgba(theme.palette[1], 0.1), stroke: theme.palette[1], textColor: theme.ink, fontSize: 12 });
  const cards = [
    createNode({ label: 'Planning Brief', x: 185, y: 210, width: 210, height: 72, shape: 'note', fill: '#ffffff', stroke: theme.palette[4], textColor: theme.ink }),
    createNode({ label: 'Milestones', x: 475, y: 210, width: 210, height: 72, shape: 'note', fill: '#ffffff', stroke: theme.palette[2], textColor: theme.ink }),
    createNode({ label: 'Issues', x: 765, y: 210, width: 210, height: 72, shape: 'note', fill: '#ffffff', stroke: theme.palette[1], textColor: theme.ink }),
  ];
  doc.nodes.push(board, laneA, laneB, laneC, ...cards);
  doc.rootId = cards[0].id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildWorkshop(title, options = {}) {
  const doc = createDocument(title, 'planning', 'signal');
  const theme = getTheme(doc.themeId);
  const center = createNode({ label: 'Workshop', x: 520, y: 260, width: 180, height: 78, shape: 'pill', fill: '#20272b', stroke: '#20272b', textColor: '#ffffff', fontSize: 18 });
  const nodes = [
    createNode({ label: 'Topic Area 1', x: 180, y: 180, width: 150, height: 50, shape: 'pill', fill: hexToRgba(theme.palette[0], 0.22), stroke: theme.palette[0], textColor: theme.ink }),
    createNode({ label: 'Topic Area 2', x: 180, y: 360, width: 150, height: 50, shape: 'pill', fill: hexToRgba(theme.palette[2], 0.22), stroke: theme.palette[2], textColor: theme.ink }),
    createNode({ label: 'Topic Area 3', x: 890, y: 180, width: 150, height: 50, shape: 'pill', fill: hexToRgba(theme.palette[1], 0.22), stroke: theme.palette[1], textColor: theme.ink }),
    createNode({ label: 'Topic Area 4', x: 890, y: 360, width: 150, height: 50, shape: 'pill', fill: hexToRgba(theme.palette[4], 0.22), stroke: theme.palette[4], textColor: theme.ink }),
  ];
  doc.nodes.push(center, ...nodes);
  nodes.forEach((node) => doc.edges.push(createEdge(center.id, node.id, { color: theme.line, kind: 'hierarchy' })));
  doc.rootId = center.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildDissertationPlan(title, options = {}) {
  const doc = createDocument(title, 'planning', 'studio');
  const theme = getTheme(doc.themeId);
  const root = createNode({ label: 'Dissertation Plan', x: 420, y: 120, width: 260, height: 70, shape: 'rounded-rect', fill: '#ffffff', stroke: '#7f8dc3', textColor: theme.ink, fontSize: 18 });
  const stages = ['Research', 'Outline', 'Draft', 'Review', 'Defense'].map((label, index) => createNode({ label, x: 160 + index * 190, y: 340, width: 150, height: 56, shape: 'rect', fill: hexToRgba(theme.palette[index % theme.palette.length], 0.22), stroke: theme.palette[index % theme.palette.length], textColor: theme.ink }));
  doc.nodes.push(root, ...stages);
  stages.forEach((node) => doc.edges.push(createEdge(root.id, node.id, { color: theme.line, kind: 'hierarchy' })));
  doc.rootId = root.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildPerformanceMatrix(title, options = {}) {
  const doc = createDocument(title, 'planning', 'paper');
  const theme = getTheme(doc.themeId);
  const board = createNode({ label: 'Performance Matrix', x: 140, y: 110, width: 920, height: 470, shape: 'board', fill: hexToRgba('#32194b', 0.04), stroke: '#8a79b9', textColor: theme.ink, fontSize: 12 });
  const xAxis = createNode({ label: 'Potential', x: 520, y: 520, width: 180, height: 42, shape: 'caption', fill: 'transparent', stroke: 'transparent', textColor: theme.ink, fontSize: 18 });
  const yAxis = createNode({ label: 'Performance', x: 86, y: 308, width: 42, height: 180, shape: 'caption', fill: 'transparent', stroke: 'transparent', textColor: theme.ink, fontSize: 18 });
  const quadrants = [
    createNode({ label: 'Mentor', x: 280, y: 170, width: 140, height: 62, shape: 'note', fill: '#ffffff', stroke: theme.palette[0], textColor: theme.ink }),
    createNode({ label: 'Stretch', x: 640, y: 190, width: 140, height: 62, shape: 'note', fill: '#ffffff', stroke: theme.palette[1], textColor: theme.ink }),
    createNode({ label: 'Stabilize', x: 290, y: 390, width: 150, height: 62, shape: 'note', fill: '#ffffff', stroke: theme.palette[2], textColor: theme.ink }),
    createNode({ label: 'Accelerate', x: 650, y: 380, width: 160, height: 62, shape: 'note', fill: '#ffffff', stroke: theme.palette[3], textColor: theme.ink }),
  ];
  doc.nodes.push(board, xAxis, yAxis, ...quadrants);
  doc.rootId = quadrants[1].id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildMicroserviceMesh(title, options = {}) {
  const doc = createDocument(title, 'architecture', 'microservice-mesh');
  doc.themeId = 'atlas';
  const theme = getTheme(doc.themeId);
  const boundary = createNode({ label: 'Production Mesh', x: 120, y: 110, width: 1040, height: 470, shape: 'board', fill: hexToRgba('#112034', 0.1), stroke: '#2f577c', textColor: theme.ink, fontSize: 12 });
  const gateway = createNode({ label: 'API Gateway', x: 190, y: 290, width: 180, height: 76, shape: 'rect', fill: '#e7f2ff', stroke: '#4e93ff', textColor: theme.ink });
  const auth = createNode({ label: 'Auth Service', x: 460, y: 180, width: 180, height: 72, shape: 'rect', fill: '#e8f6ff', stroke: '#38a5cf', textColor: theme.ink });
  const billing = createNode({ label: 'Billing Service', x: 460, y: 300, width: 180, height: 72, shape: 'rect', fill: '#eaf4ff', stroke: '#5488ff', textColor: theme.ink });
  const notifications = createNode({ label: 'Notification Worker', x: 460, y: 420, width: 198, height: 78, shape: 'subroutine', fill: '#eef6ff', stroke: '#679ad4', textColor: theme.ink });
  const events = createNode({ label: 'Event Bus', x: 760, y: 300, width: 112, height: 112, shape: 'connector', fill: '#fff7d9', stroke: '#e2b64e', textColor: theme.ink });
  const data = createNode({ label: 'Service DB', x: 930, y: 180, width: 190, height: 98, shape: 'cylinder', fill: '#fff2da', stroke: '#dcaa4b', textColor: theme.ink });
  const cache = createNode({ label: 'Cache', x: 940, y: 370, width: 152, height: 84, shape: 'pill', fill: '#f4e6ff', stroke: '#9c74dd', textColor: theme.ink });
  doc.nodes.push(boundary, gateway, auth, billing, notifications, events, data, cache);
  doc.edges.push(
    createEdge(gateway.id, auth.id, { color: theme.line, kind: 'hierarchy', style: 'elbow' }),
    createEdge(gateway.id, billing.id, { color: theme.line, kind: 'hierarchy', style: 'elbow' }),
    createEdge(gateway.id, notifications.id, { color: theme.line, kind: 'hierarchy', style: 'elbow' }),
    createEdge(auth.id, events.id, { color: '#38a5cf', kind: 'manual', style: 'elbow' }),
    createEdge(billing.id, events.id, { color: '#5488ff', kind: 'manual', style: 'elbow' }),
    createEdge(events.id, notifications.id, { color: '#e2b64e', kind: 'manual', style: 'elbow' }),
    createEdge(auth.id, data.id, { color: '#dcaa4b', kind: 'manual' }),
    createEdge(billing.id, cache.id, { color: '#9c74dd', kind: 'manual' }),
  );
  doc.rootId = gateway.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildKubernetesPlatform(title, options = {}) {
  const doc = createDocument(title, 'architecture', 'kubernetes-platform');
  doc.themeId = 'signal';
  const theme = getTheme(doc.themeId);
  const cluster = createNode({ label: 'Kubernetes Cluster', x: 130, y: 90, width: 1020, height: 500, shape: 'cluster', fill: hexToRgba('#13463d', 0.1), stroke: '#2f7c68', textColor: theme.ink, fontSize: 12 });
  const ingress = createNode({ label: 'Ingress', x: 190, y: 290, width: 170, height: 74, shape: 'rect', fill: '#dff7ee', stroke: '#39a36f', textColor: theme.ink });
  const api = createNode({ label: 'API Deployment', x: 470, y: 190, width: 208, height: 82, shape: 'rect', fill: '#e6fff4', stroke: '#4ebf89', textColor: theme.ink });
  const workers = createNode({ label: 'Worker Deployment', x: 470, y: 330, width: 220, height: 82, shape: 'subroutine', fill: '#ebfff7', stroke: '#3f9f77', textColor: theme.ink });
  const stateful = createNode({ label: 'Stateful Set', x: 470, y: 470, width: 198, height: 74, shape: 'rect', fill: '#eef9ff', stroke: '#5b9fce', textColor: theme.ink });
  const serviceMesh = createNode({ label: 'Service Mesh', x: 810, y: 190, width: 184, height: 76, shape: 'diamond', fill: '#def1ff', stroke: '#66a5d1', textColor: theme.ink });
  const metrics = createNode({ label: 'Metrics Stack', x: 810, y: 330, width: 194, height: 82, shape: 'table', fill: '#fff3d6', stroke: '#d8a756', textColor: theme.ink });
  const storage = createNode({ label: 'Persistent Volume', x: 820, y: 470, width: 190, height: 98, shape: 'cylinder', fill: '#fdf0df', stroke: '#d89d54', textColor: theme.ink });
  doc.nodes.push(cluster, ingress, api, workers, stateful, serviceMesh, metrics, storage);
  doc.edges.push(
    createEdge(ingress.id, api.id, { color: '#39a36f', kind: 'hierarchy' }),
    createEdge(ingress.id, workers.id, { color: '#39a36f', kind: 'hierarchy' }),
    createEdge(api.id, serviceMesh.id, { color: '#66a5d1', kind: 'manual', style: 'elbow' }),
    createEdge(workers.id, serviceMesh.id, { color: '#66a5d1', kind: 'manual', style: 'elbow' }),
    createEdge(serviceMesh.id, metrics.id, { color: '#d8a756', kind: 'manual' }),
    createEdge(stateful.id, storage.id, { color: '#d89d54', kind: 'manual' }),
    createEdge(workers.id, stateful.id, { color: theme.line, kind: 'manual', style: 'elbow' }),
  );
  doc.rootId = ingress.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildEventDrivenPlatform(title, options = {}) {
  const doc = createDocument(title, 'architecture', 'event-driven');
  doc.themeId = 'studio';
  const theme = getTheme(doc.themeId);
  const frame = createNode({ label: 'Event-Driven Platform', x: 130, y: 110, width: 1020, height: 470, shape: 'board', fill: hexToRgba('#1c1f2c', 0.06), stroke: '#6a7388', textColor: theme.ink, fontSize: 12 });
  const producer = createNode({ label: 'Web + Mobile Producers', x: 170, y: 290, width: 230, height: 72, shape: 'terminator', fill: '#edf2ff', stroke: '#7283c5', textColor: theme.ink });
  const ingestion = createNode({ label: 'Ingestion API', x: 470, y: 190, width: 194, height: 78, shape: 'rect', fill: '#e7ecff', stroke: '#6776bf', textColor: theme.ink });
  const queue = createNode({ label: 'Event Stream', x: 510, y: 340, width: 118, height: 118, shape: 'connector', fill: '#fff6d8', stroke: '#daab4a', textColor: theme.ink });
  const consumers = createNode({ label: 'Consumers', x: 790, y: 180, width: 208, height: 82, shape: 'subroutine', fill: '#eaf5ff', stroke: '#5d92c2', textColor: theme.ink });
  const warehouse = createNode({ label: 'Analytics Warehouse', x: 810, y: 340, width: 198, height: 100, shape: 'cylinder', fill: '#fff0dd', stroke: '#d3a251', textColor: theme.ink });
  const alerts = createNode({ label: 'Alerting', x: 810, y: 470, width: 188, height: 82, shape: 'callout', fill: '#ffe9ea', stroke: '#da6f7c', textColor: theme.ink });
  doc.nodes.push(frame, producer, ingestion, queue, consumers, warehouse, alerts);
  doc.edges.push(
    createEdge(producer.id, ingestion.id, { color: '#6776bf', kind: 'hierarchy' }),
    createEdge(ingestion.id, queue.id, { color: '#daab4a', kind: 'hierarchy' }),
    createEdge(queue.id, consumers.id, { color: '#5d92c2', kind: 'manual', style: 'elbow' }),
    createEdge(queue.id, warehouse.id, { color: '#d3a251', kind: 'manual', style: 'elbow' }),
    createEdge(consumers.id, alerts.id, { color: '#da6f7c', kind: 'manual' }),
  );
  doc.rootId = ingestion.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildAiAgenticSystem(title, options = {}) {
  const doc = createDocument(title, 'ai', 'ai-agentic-system');
  doc.themeId = 'atlas';
  const theme = getTheme(doc.themeId);
  const board = createNode({ label: 'Agent Runtime', x: 130, y: 110, width: 1020, height: 470, shape: 'board', fill: hexToRgba('#102134', 0.08), stroke: '#375a76', textColor: theme.ink, fontSize: 12 });
  const user = createNode({ label: 'Operator Prompt', x: 170, y: 290, width: 210, height: 78, shape: 'note', fill: '#fff8de', stroke: '#d8b35b', textColor: theme.ink });
  const orchestrator = createNode({ label: 'Opseeq Orchestrator', x: 460, y: 290, width: 228, height: 82, shape: 'rounded-rect', fill: '#e8f2ff', stroke: '#4f8fe9', textColor: theme.ink });
  const planner = createNode({ label: 'Planner', x: 780, y: 170, width: 182, height: 118, shape: 'diamond', fill: '#eaf4ff', stroke: '#6ca2d2', textColor: theme.ink });
  const tools = createNode({ label: 'Tool Skills', x: 780, y: 330, width: 188, height: 70, shape: 'pill', fill: '#ecf7ff', stroke: '#4f93bc', textColor: theme.ink });
  const memory = createNode({ label: 'Memory + Context', x: 1020, y: 320, width: 178, height: 96, shape: 'cylinder', fill: '#fff0de', stroke: '#d6a04e', textColor: theme.ink });
  const model = createNode({ label: 'Kimi / Ollama Runtime', x: 1020, y: 170, width: 198, height: 78, shape: 'rect', fill: '#ffe8ea', stroke: '#db7481', textColor: theme.ink });
  doc.nodes.push(board, user, orchestrator, planner, tools, memory, model);
  doc.edges.push(
    createEdge(user.id, orchestrator.id, { color: '#4f8fe9', kind: 'hierarchy' }),
    createEdge(orchestrator.id, planner.id, { color: '#6ca2d2', kind: 'manual', style: 'elbow' }),
    createEdge(orchestrator.id, tools.id, { color: '#4f93bc', kind: 'manual', style: 'elbow' }),
    createEdge(planner.id, model.id, { color: '#db7481', kind: 'manual' }),
    createEdge(tools.id, memory.id, { color: '#d6a04e', kind: 'manual' }),
    createEdge(memory.id, orchestrator.id, { color: theme.line, kind: 'manual', style: 'elbow' }),
  );
  doc.rootId = orchestrator.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildRagPipeline(title, options = {}) {
  const doc = createDocument(title, 'ai', 'rag-pipeline');
  doc.themeId = 'signal';
  const theme = getTheme(doc.themeId);
  const board = createNode({ label: 'RAG Pipeline', x: 120, y: 130, width: 1040, height: 430, shape: 'board', fill: hexToRgba('#0e4238', 0.08), stroke: '#2f7f6a', textColor: theme.ink, fontSize: 12 });
  const sources = createNode({ label: 'Source Docs', x: 170, y: 200, width: 190, height: 94, shape: 'document', fill: '#f6ffec', stroke: '#86b260', textColor: theme.ink });
  const ingest = createNode({ label: 'Chunk + Embed', x: 410, y: 200, width: 210, height: 78, shape: 'subroutine', fill: '#e6f7ff', stroke: '#5a9cc3', textColor: theme.ink });
  const vectorDb = createNode({ label: 'Vector Store', x: 700, y: 200, width: 188, height: 98, shape: 'cylinder', fill: '#fff2de', stroke: '#d8a44f', textColor: theme.ink });
  const retriever = createNode({ label: 'Retriever', x: 410, y: 360, width: 194, height: 76, shape: 'rect', fill: '#ecf8ff', stroke: '#6f9ec9', textColor: theme.ink });
  const prompt = createNode({ label: 'Prompt Assembly', x: 670, y: 360, width: 210, height: 100, shape: 'note', fill: '#fff8e7', stroke: '#d6b458', textColor: theme.ink });
  const llm = createNode({ label: 'LLM Runtime', x: 940, y: 360, width: 180, height: 76, shape: 'rounded-rect', fill: '#ffeef1', stroke: '#dd7e89', textColor: theme.ink });
  doc.nodes.push(board, sources, ingest, vectorDb, retriever, prompt, llm);
  doc.edges.push(
    createEdge(sources.id, ingest.id, { color: '#86b260', kind: 'hierarchy' }),
    createEdge(ingest.id, vectorDb.id, { color: '#d8a44f', kind: 'manual' }),
    createEdge(vectorDb.id, retriever.id, { color: '#6f9ec9', kind: 'manual', style: 'elbow' }),
    createEdge(retriever.id, prompt.id, { color: '#d6b458', kind: 'manual' }),
    createEdge(prompt.id, llm.id, { color: '#dd7e89', kind: 'manual' }),
  );
  doc.rootId = ingest.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildMlopsLoop(title, options = {}) {
  const doc = createDocument(title, 'ai', 'mlops-loop');
  doc.themeId = 'paper';
  const theme = getTheme(doc.themeId);
  const board = createNode({ label: 'MLOps Loop', x: 130, y: 110, width: 1020, height: 470, shape: 'board', fill: hexToRgba('#35241d', 0.05), stroke: '#907058', textColor: theme.ink, fontSize: 12 });
  const data = createNode({ label: 'Training Data', x: 180, y: 220, width: 182, height: 96, shape: 'cylinder', fill: '#fff0de', stroke: '#d48b3f', textColor: theme.ink });
  const train = createNode({ label: 'Train + Validate', x: 430, y: 220, width: 204, height: 82, shape: 'subroutine', fill: '#eaf8ff', stroke: '#6fa4ca', textColor: theme.ink });
  const registry = createNode({ label: 'Model Registry', x: 700, y: 220, width: 190, height: 96, shape: 'cylinder', fill: '#f0ebff', stroke: '#9177d9', textColor: theme.ink });
  const deploy = createNode({ label: 'Serving Deployment', x: 930, y: 220, width: 194, height: 78, shape: 'rect', fill: '#e8fff3', stroke: '#69ac81', textColor: theme.ink });
  const monitor = createNode({ label: 'Monitoring', x: 930, y: 390, width: 182, height: 82, shape: 'table', fill: '#fdf6e6', stroke: '#d5ad5d', textColor: theme.ink });
  const feedback = createNode({ label: 'Feedback + Labels', x: 430, y: 390, width: 226, height: 92, shape: 'callout', fill: '#ffe9ec', stroke: '#d77f89', textColor: theme.ink });
  doc.nodes.push(board, data, train, registry, deploy, monitor, feedback);
  doc.edges.push(
    createEdge(data.id, train.id, { color: '#6fa4ca', kind: 'hierarchy' }),
    createEdge(train.id, registry.id, { color: '#9177d9', kind: 'manual' }),
    createEdge(registry.id, deploy.id, { color: '#69ac81', kind: 'manual' }),
    createEdge(deploy.id, monitor.id, { color: '#d5ad5d', kind: 'manual' }),
    createEdge(monitor.id, feedback.id, { color: '#d77f89', kind: 'manual', style: 'elbow' }),
    createEdge(feedback.id, data.id, { color: theme.line, kind: 'manual', style: 'elbow' }),
  );
  doc.rootId = train.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildDataLakehouse(title, options = {}) {
  const doc = createDocument(title, 'data', 'data-lakehouse');
  doc.themeId = 'atlas';
  const theme = getTheme(doc.themeId);
  const board = createNode({ label: 'Lakehouse Platform', x: 120, y: 110, width: 1040, height: 470, shape: 'board', fill: hexToRgba('#152b44', 0.08), stroke: '#45668a', textColor: theme.ink, fontSize: 12 });
  const bronze = createNode({ label: 'Bronze Ingestion', x: 170, y: 220, width: 210, height: 92, shape: 'table', fill: '#fff1db', stroke: '#d5a454', textColor: theme.ink });
  const silver = createNode({ label: 'Silver Curated', x: 450, y: 220, width: 210, height: 92, shape: 'table', fill: '#eaf4ff', stroke: '#6b9bcb', textColor: theme.ink });
  const gold = createNode({ label: 'Gold Serving', x: 730, y: 220, width: 210, height: 92, shape: 'table', fill: '#fdf2dc', stroke: '#d8af5c', textColor: theme.ink });
  const catalog = createNode({ label: 'Catalog + Governance', x: 450, y: 380, width: 240, height: 82, shape: 'rect', fill: '#e9f3ff', stroke: '#588bc0', textColor: theme.ink });
  const warehouse = createNode({ label: 'Warehouse Endpoint', x: 1010, y: 330, width: 180, height: 100, shape: 'cylinder', fill: '#fff0dd', stroke: '#d7a150', textColor: theme.ink });
  doc.nodes.push(board, bronze, silver, gold, catalog, warehouse);
  doc.edges.push(
    createEdge(bronze.id, silver.id, { color: '#6b9bcb', kind: 'hierarchy' }),
    createEdge(silver.id, gold.id, { color: '#d8af5c', kind: 'manual' }),
    createEdge(silver.id, catalog.id, { color: '#588bc0', kind: 'manual' }),
    createEdge(gold.id, warehouse.id, { color: '#d7a150', kind: 'manual', style: 'elbow' }),
    createEdge(catalog.id, warehouse.id, { color: theme.line, kind: 'manual' }),
  );
  doc.rootId = silver.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildStreamingAnalytics(title, options = {}) {
  const doc = createDocument(title, 'data', 'streaming-analytics');
  doc.themeId = 'studio';
  const theme = getTheme(doc.themeId);
  const board = createNode({ label: 'Streaming Analytics', x: 130, y: 130, width: 1020, height: 430, shape: 'board', fill: hexToRgba('#191d28', 0.06), stroke: '#5f6c85', textColor: theme.ink, fontSize: 12 });
  const producers = createNode({ label: 'Event Producers', x: 170, y: 300, width: 210, height: 70, shape: 'terminator', fill: '#edf2ff', stroke: '#7487c6', textColor: theme.ink });
  const stream = createNode({ label: 'Streaming Bus', x: 470, y: 290, width: 118, height: 118, shape: 'connector', fill: '#fff4db', stroke: '#d6a84f', textColor: theme.ink });
  const processing = createNode({ label: 'Realtime Processing', x: 700, y: 220, width: 220, height: 82, shape: 'subroutine', fill: '#e8f5ff', stroke: '#6499c8', textColor: theme.ink });
  const dashboards = createNode({ label: 'Live Dashboards', x: 980, y: 210, width: 190, height: 88, shape: 'display', fill: '#ecf7ff', stroke: '#5a95c2', textColor: theme.ink });
  const sink = createNode({ label: 'Analytical Sink', x: 980, y: 360, width: 180, height: 98, shape: 'cylinder', fill: '#fff1de', stroke: '#d8a452', textColor: theme.ink });
  const alerting = createNode({ label: 'Threshold Alerts', x: 700, y: 380, width: 220, height: 90, shape: 'callout', fill: '#ffe9ec', stroke: '#d87883', textColor: theme.ink });
  doc.nodes.push(board, producers, stream, processing, dashboards, sink, alerting);
  doc.edges.push(
    createEdge(producers.id, stream.id, { color: '#7487c6', kind: 'hierarchy' }),
    createEdge(stream.id, processing.id, { color: '#6499c8', kind: 'manual', style: 'elbow' }),
    createEdge(processing.id, dashboards.id, { color: '#5a95c2', kind: 'manual' }),
    createEdge(processing.id, sink.id, { color: '#d8a452', kind: 'manual', style: 'elbow' }),
    createEdge(processing.id, alerting.id, { color: '#d87883', kind: 'manual' }),
  );
  doc.rootId = stream.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildZeroTrustArchitecture(title, options = {}) {
  const doc = createDocument(title, 'security', 'zero-trust');
  doc.themeId = 'signal';
  const theme = getTheme(doc.themeId);
  const boundary = createNode({ label: 'Zero Trust Fabric', x: 120, y: 100, width: 1040, height: 480, shape: 'board', fill: hexToRgba('#0f2f28', 0.08), stroke: '#2d6f5e', textColor: theme.ink, fontSize: 12 });
  const identity = createNode({ label: 'Identity Provider', x: 170, y: 280, width: 190, height: 78, shape: 'rounded-rect', fill: '#e7fff0', stroke: '#4ba178', textColor: theme.ink });
  const policy = createNode({ label: 'Policy Engine', x: 430, y: 250, width: 190, height: 122, shape: 'diamond', fill: '#ecf8ff', stroke: '#639ac6', textColor: theme.ink });
  const gateway = createNode({ label: 'Access Gateway', x: 700, y: 180, width: 190, height: 78, shape: 'rect', fill: '#edf5ff', stroke: '#6d93c8', textColor: theme.ink });
  const workloads = createNode({ label: 'Service Workloads', x: 700, y: 350, width: 220, height: 82, shape: 'subroutine', fill: '#e8fff3', stroke: '#63ad86', textColor: theme.ink });
  const audit = createNode({ label: 'Audit Trail', x: 980, y: 250, width: 170, height: 98, shape: 'cylinder', fill: '#fff2df', stroke: '#d6a250', textColor: theme.ink });
  doc.nodes.push(boundary, identity, policy, gateway, workloads, audit);
  doc.edges.push(
    createEdge(identity.id, policy.id, { color: '#4ba178', kind: 'hierarchy' }),
    createEdge(policy.id, gateway.id, { color: '#6d93c8', kind: 'manual', style: 'elbow' }),
    createEdge(policy.id, workloads.id, { color: '#63ad86', kind: 'manual', style: 'elbow' }),
    createEdge(gateway.id, audit.id, { color: '#d6a250', kind: 'manual' }),
    createEdge(workloads.id, audit.id, { color: theme.line, kind: 'manual' }),
  );
  doc.rootId = policy.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildSreObservability(title, options = {}) {
  const doc = createDocument(title, 'operations', 'sre-observability');
  doc.themeId = 'atlas';
  const theme = getTheme(doc.themeId);
  const board = createNode({ label: 'Observability Stack', x: 130, y: 110, width: 1020, height: 470, shape: 'board', fill: hexToRgba('#142c46', 0.08), stroke: '#3f6a91', textColor: theme.ink, fontSize: 12 });
  const workloads = createNode({ label: 'Application Services', x: 170, y: 220, width: 236, height: 84, shape: 'subroutine', fill: '#e8f4ff', stroke: '#5b96c8', textColor: theme.ink });
  const probes = createNode({ label: 'Probes', x: 490, y: 230, width: 124, height: 124, shape: 'circle', fill: '#ecfff4', stroke: '#5ba77b', textColor: theme.ink });
  const logs = createNode({ label: 'Logs Index', x: 730, y: 180, width: 204, height: 94, shape: 'table', fill: '#f1f7ff', stroke: '#6e97c4', textColor: theme.ink });
  const traces = createNode({ label: 'Trace Store', x: 730, y: 320, width: 198, height: 94, shape: 'cylinder', fill: '#fff2dd', stroke: '#d5a14f', textColor: theme.ink });
  const alerts = createNode({ label: 'Alert Routing', x: 980, y: 250, width: 182, height: 92, shape: 'callout', fill: '#ffe9ec', stroke: '#d87782', textColor: theme.ink });
  const runbook = createNode({ label: 'SRE Runbook', x: 470, y: 400, width: 214, height: 102, shape: 'note', fill: '#fff8e6', stroke: '#d4b257', textColor: theme.ink });
  doc.nodes.push(board, workloads, probes, logs, traces, alerts, runbook);
  doc.edges.push(
    createEdge(workloads.id, probes.id, { color: '#5ba77b', kind: 'hierarchy' }),
    createEdge(probes.id, logs.id, { color: '#6e97c4', kind: 'manual', style: 'elbow' }),
    createEdge(probes.id, traces.id, { color: '#d5a14f', kind: 'manual', style: 'elbow' }),
    createEdge(logs.id, alerts.id, { color: '#d87782', kind: 'manual' }),
    createEdge(traces.id, alerts.id, { color: theme.line, kind: 'manual' }),
    createEdge(alerts.id, runbook.id, { color: '#d4b257', kind: 'manual', style: 'elbow' }),
  );
  doc.rootId = probes.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function buildEnterpriseIntegration(title, options = {}) {
  const doc = createDocument(title, 'enterprise', 'enterprise-integration');
  doc.themeId = 'studio';
  const theme = getTheme(doc.themeId);
  const board = createNode({ label: 'Enterprise Integration Hub', x: 120, y: 120, width: 1040, height: 450, shape: 'board', fill: hexToRgba('#1a1f2b', 0.06), stroke: '#67738c', textColor: theme.ink, fontSize: 12 });
  const crm = createNode({ label: 'CRM', x: 170, y: 200, width: 160, height: 72, shape: 'rect', fill: '#edf2ff', stroke: '#7588cb', textColor: theme.ink });
  const erp = createNode({ label: 'ERP', x: 170, y: 360, width: 160, height: 72, shape: 'rect', fill: '#ebf3ff', stroke: '#6f92c6', textColor: theme.ink });
  const bus = createNode({ label: 'Integration Bus', x: 470, y: 280, width: 118, height: 118, shape: 'connector', fill: '#fff4db', stroke: '#d8aa50', textColor: theme.ink });
  const gateway = createNode({ label: 'API Management', x: 760, y: 200, width: 200, height: 78, shape: 'rect', fill: '#e8f4ff', stroke: '#5f96c6', textColor: theme.ink });
  const analytics = createNode({ label: 'Data Platform', x: 760, y: 360, width: 190, height: 98, shape: 'cylinder', fill: '#fff1de', stroke: '#d8a451', textColor: theme.ink });
  const copilot = createNode({ label: 'AI Copilot', x: 1010, y: 280, width: 188, height: 80, shape: 'rounded-rect', fill: '#ffecef', stroke: '#d97c88', textColor: theme.ink });
  doc.nodes.push(board, crm, erp, bus, gateway, analytics, copilot);
  doc.edges.push(
    createEdge(crm.id, bus.id, { color: '#7588cb', kind: 'hierarchy', style: 'elbow' }),
    createEdge(erp.id, bus.id, { color: '#6f92c6', kind: 'hierarchy', style: 'elbow' }),
    createEdge(bus.id, gateway.id, { color: '#5f96c6', kind: 'manual', style: 'elbow' }),
    createEdge(bus.id, analytics.id, { color: '#d8a451', kind: 'manual', style: 'elbow' }),
    createEdge(gateway.id, copilot.id, { color: '#d97c88', kind: 'manual' }),
    createEdge(analytics.id, copilot.id, { color: theme.line, kind: 'manual' }),
  );
  doc.rootId = bus.id;
  doc.showGuide = options.seedGuide === false ? false : true;
  return doc;
}

function createDocument(title, type, templateId) {
  return {
    id: uid('doc'),
    title,
    type,
    templateId,
    themeId: 'studio',
    nodes: [],
    edges: [],
    rootId: null,
    zoom: 1,
    pan: { x: 0, y: 0 },
    viewInitialized: false,
    showGuide: true,
    shared: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function createNode(config, forcedId = null) {
  const node = {
    id: forcedId || uid('node'),
    label: config.label,
    x: config.x,
    y: config.y,
    width: config.width,
    height: config.height,
    shape: config.shape || 'rounded-rect',
    fill: config.fill || '#ffffff',
    stroke: config.stroke || '#7a7f8e',
    strokeWidth: config.strokeWidth || 2,
    textColor: config.textColor || '#151826',
    fontSize: config.fontSize || 16,
    fontWeight: config.fontWeight || 600,
    fontFamily: config.fontFamily || FONT_OPTIONS[0],
    side: config.side || null,
  };
  enforceNodeSize(node);
  return node;
}

function createEdge(source, target, config = {}) {
  return {
    id: uid('edge'),
    source,
    target,
    label: config.label || '',
    color: config.color || '#7a7f8e',
    width: config.width || 2.2,
    dash: config.dash || (config.dashed ? 'dashed' : 'solid'),
    style: config.style || 'curve',
    markerEnd: config.markerEnd || 'arrow',
    kind: config.kind || 'hierarchy',
    bendPoints: compactEdgeBendPoints(config.bendPoints || []),
  };
}

function getTheme(themeId) {
  return THEME_LIBRARY.find((theme) => theme.id === themeId) || THEME_LIBRARY[0];
}

function templateNameFor(templateId) {
  return TEMPLATE_REGISTRY[templateId]?.name || templateId || 'Diagram';
}

function getLibraryEntries() {
  return Object.values(LIBRARY_SECTIONS).flat();
}

function labelForShape(shapeId) {
  return getLibraryEntries().find((entry) => entry.id === shapeId)?.label || shapeId;
}

function allShapeOptions() {
  return Array.from(new Set(getLibraryEntries().map((entry) => entry.id).concat(['rounded-rect', 'rect', 'pill', 'diamond', 'note', 'document', 'cylinder', 'circle'])));
}

function sanitizeShape(shapeId) {
  const fallback = 'rounded-rect';
  if (!shapeId) return fallback;
  return allShapeOptions().includes(shapeId) ? shapeId : fallback;
}

function isContainerShape(shapeId) {
  return ['group-frame', 'lane', 'board', 'cluster'].includes(shapeId);
}

function baseShapeConfig(shapeId) {
  return getLibraryEntries().find((entry) => entry.id === shapeId) || { width: 180, height: 72 };
}

function normalizeDocuments(documents) {
  return (Array.isArray(documents) ? documents : []).map((doc) => normalizeDocument(doc));
}

function normalizeDocument(doc) {
  const normalized = {
    id: doc?.id || uid('doc'),
    title: doc?.title || 'Untitled Diagram',
    type: doc?.type || 'diagram',
    templateId: doc?.templateId || doc?.type || 'blank-canvas',
    themeId: getTheme(doc?.themeId).id,
    nodes: (Array.isArray(doc?.nodes) ? doc.nodes : []).map((node) => normalizeNode(node)),
    edges: (Array.isArray(doc?.edges) ? doc.edges : []).map((edge) => normalizeEdge(edge)),
    rootId: doc?.rootId || null,
    zoom: clamp(Number(doc?.zoom) || 1, 0.18, 4),
    pan: {
      x: Number(doc?.pan?.x) || 0,
      y: Number(doc?.pan?.y) || 0,
    },
    viewInitialized: Boolean(doc?.viewInitialized),
    showGuide: doc?.showGuide !== false,
    shared: Boolean(doc?.shared),
    createdAt: doc?.createdAt || new Date().toISOString(),
    updatedAt: doc?.updatedAt || new Date().toISOString(),
  };

  if (!normalized.nodes.length) {
    const fallback = createNode({
      label: 'Central Topic',
      x: 560,
      y: 320,
      width: 240,
      height: 86,
      shape: 'rounded-rect',
      fill: '#ffffff',
      stroke: getTheme(normalized.themeId).accent,
      textColor: getTheme(normalized.themeId).ink,
      fontSize: 20,
    });
    normalized.nodes.push(fallback);
    normalized.rootId = fallback.id;
  }

  if (!normalized.rootId || !normalized.nodes.some((node) => node.id === normalized.rootId)) {
    normalized.rootId = normalized.nodes[0]?.id || null;
  }

  const nodeIds = new Set(normalized.nodes.map((node) => node.id));
  normalized.edges = normalized.edges.filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target));
  return normalized;
}

function normalizeNode(node) {
  const normalized = {
    id: node?.id || uid('node'),
    label: String(node?.label || labelForShape(node?.shape || 'rounded-rect')),
    x: Number(node?.x) || 0,
    y: Number(node?.y) || 0,
    width: clamp(Number(node?.width) || 180, 40, 1400),
    height: clamp(Number(node?.height) || 72, 40, 1400),
    shape: sanitizeShape(node?.shape),
    fill: node?.fill || '#ffffff',
    stroke: node?.stroke || '#7a7f8e',
    strokeWidth: clamp(Number(node?.strokeWidth) || 2, 1, 16),
    textColor: node?.textColor || '#151826',
    fontSize: clamp(Number(node?.fontSize) || 16, 10, 72),
    fontWeight: clamp(Number(node?.fontWeight) || 600, 400, 800),
    fontFamily: FONT_OPTIONS.includes(node?.fontFamily) ? node.fontFamily : FONT_OPTIONS[0],
    side: node?.side || null,
  };
  enforceNodeSize(normalized);
  return normalized;
}

function normalizeEdge(edge) {
  return {
    id: edge?.id || uid('edge'),
    source: edge?.source,
    target: edge?.target,
    label: String(edge?.label || ''),
    color: edge?.color || '#7a7f8e',
    width: clamp(Number(edge?.width) || 2.2, 1, 18),
    dash: ['solid', 'dashed', 'dotted'].includes(edge?.dash) ? edge.dash : (edge?.dashed ? 'dashed' : 'solid'),
    style: ['curve', 'straight', 'elbow'].includes(edge?.style) ? edge.style : 'curve',
    markerEnd: edge?.markerEnd === 'none' ? 'none' : 'arrow',
    kind: edge?.kind || 'hierarchy',
    bendPoints: compactEdgeBendPoints(edge?.bendPoints || []),
  };
}

function getNodePadding(node) {
  if (node.shape === 'caption' || node.shape === 'text') return { x: 12, y: 8 };
  if (isContainerShape(node.shape)) return { x: 16, y: 16 };
  if (node.shape === 'circle' || node.shape === 'connector' || node.shape === 'star') return { x: 24, y: 24 };
  if (node.shape === 'triangle') return { x: 26, y: 20 };
  return { x: 22, y: 16 };
}

function getNodeFont(node, sizeOverride = null, weightOverride = null) {
  const family = node.fontFamily || FONT_OPTIONS[0];
  const size = sizeOverride || node.fontSize || 16;
  const weight = weightOverride || node.fontWeight || 500;
  return `${weight} ${size}px "${family}"`;
}

function getPreparedLabel(text, font) {
  const key = `${font}::${text}`;
  if (labelPreparationCache.has(key)) return labelPreparationCache.get(key);
  const prepared = prepareWithSegments(String(text || ''), font, { whiteSpace: 'pre-wrap' });
  labelPreparationCache.set(key, prepared);
  if (labelPreparationCache.size > 600) {
    const firstKey = labelPreparationCache.keys().next().value;
    if (firstKey) labelPreparationCache.delete(firstKey);
  }
  return prepared;
}

function getNodeLabelLayout(node, widthOverride = null) {
  if (isContainerShape(node.shape)) {
    const font = getNodeFont(node, 12, 700);
    const prepared = getPreparedLabel(node.label, font);
    const result = layoutWithLines(prepared, Math.max(24, (widthOverride || node.width) - 32), 16);
    const lines = result.lines.map((line) => line.text).filter(Boolean);
    return {
      lines: lines.length ? [lines[0]] : [''],
      lineHeight: 16,
      textHeight: 16,
      maxLineWidth: result.lines.reduce((max, line) => Math.max(max, line.width), 0),
    };
  }

  const padding = getNodePadding(node);
  const font = getNodeFont(node);
  const prepared = getPreparedLabel(node.label, font);
  const lineHeight = Math.round(node.fontSize * 1.24);
  const result = layoutWithLines(prepared, Math.max(26, (widthOverride || node.width) - padding.x * 2), lineHeight);
  const lines = result.lines.map((line) => line.text).filter((line) => line.length > 0);
  return {
    lines: lines.length ? lines.slice(0, 6) : [''],
    lineHeight,
    textHeight: Math.max(lineHeight, result.height || lineHeight),
    maxLineWidth: result.lines.reduce((max, line) => Math.max(max, line.width), 0),
  };
}

function getNodeMinimumSize(node) {
  const base = baseShapeConfig(node.shape);
  const padding = getNodePadding(node);
  const natural = getNodeLabelLayout(node, 4000);
  const minWidth = Math.max(
    node.shape === 'circle' ? 86 : 72,
    Math.round(base.width * (isContainerShape(node.shape) ? 0.45 : 0.42)),
    Math.ceil(natural.maxLineWidth + padding.x * 2),
  );
  const wrapped = getNodeLabelLayout(node, minWidth);
  const minHeight = Math.max(
    node.shape === 'circle' ? 86 : 48,
    Math.round(base.height * (isContainerShape(node.shape) ? 0.65 : 0.5)),
    Math.ceil(wrapped.textHeight + padding.y * 2 + (isContainerShape(node.shape) ? 10 : 0)),
  );

  return {
    width: clamp(Math.ceil(minWidth), 40, 1400),
    height: clamp(Math.ceil(minHeight), 40, 1400),
  };
}

function enforceNodeSize(node, origin = null, handle = '') {
  const min = getNodeMinimumSize(node);

  if (node.width < min.width) {
    const delta = min.width - node.width;
    node.width = min.width;
    if (handle.includes('w')) node.x -= delta;
  }

  if (node.height < min.height) {
    const delta = min.height - node.height;
    node.height = min.height;
    if (handle.includes('n')) node.y -= delta;
  }

  if (origin && handle.includes('w')) {
    node.x = Math.min(node.x, origin.x + origin.width - node.width);
  }
  if (origin && handle.includes('n')) {
    node.y = Math.min(node.y, origin.y + origin.height - node.height);
  }
}

function getEdgeDasharray(edge) {
  if ((edge.dash || 'solid') === 'dashed') return '10 8';
  if ((edge.dash || 'solid') === 'dotted') return '2 9';
  return '';
}

function getSnappedNodePosition(doc, node, rawX, rawY, options = {}) {
  if (options.disable) {
    return {
      x: rawX,
      y: rawY,
      guides: [],
    };
  }

  let x = snap(rawX, 8);
  let y = snap(rawY, 8);
  const threshold = 9;
  let bestX = null;
  let bestY = null;

  const nodePointsX = [
    { kind: 'left', value: x },
    { kind: 'center', value: x + node.width / 2 },
    { kind: 'right', value: x + node.width },
  ];
  const nodePointsY = [
    { kind: 'top', value: y },
    { kind: 'middle', value: y + node.height / 2 },
    { kind: 'bottom', value: y + node.height },
  ];

  for (const other of doc.nodes) {
    if (other.id === node.id) continue;
    const otherPointsX = [
      { kind: 'left', value: other.x },
      { kind: 'center', value: other.x + other.width / 2 },
      { kind: 'right', value: other.x + other.width },
    ];
    const otherPointsY = [
      { kind: 'top', value: other.y },
      { kind: 'middle', value: other.y + other.height / 2 },
      { kind: 'bottom', value: other.y + other.height },
    ];

    for (const point of nodePointsX) {
      for (const target of otherPointsX) {
        const delta = target.value - point.value;
        if (Math.abs(delta) > threshold) continue;
        if (!bestX || Math.abs(delta) < Math.abs(bestX.delta)) {
          bestX = {
            delta,
            value: target.value,
            from: Math.min(y, other.y) - 60,
            to: Math.max(y + node.height, other.y + other.height) + 60,
          };
        }
      }
    }

    for (const point of nodePointsY) {
      for (const target of otherPointsY) {
        const delta = target.value - point.value;
        if (Math.abs(delta) > threshold) continue;
        if (!bestY || Math.abs(delta) < Math.abs(bestY.delta)) {
          bestY = {
            delta,
            value: target.value,
            from: Math.min(x, other.x) - 60,
            to: Math.max(x + node.width, other.x + other.width) + 60,
          };
        }
      }
    }
  }

  const guides = [];
  if (bestX) {
    x += bestX.delta;
    guides.push({ axis: 'x', value: bestX.value, from: bestX.from, to: bestX.to });
  }
  if (bestY) {
    y += bestY.delta;
    guides.push({ axis: 'y', value: bestY.value, from: bestY.from, to: bestY.to });
  }

  return {
    x,
    y,
    guides,
  };
}

function findNodeAtWorldPoint(doc, world, padding = 14, excludedId = null) {
  if (!world) return null;
  const candidates = doc.nodes
    .filter((node) => node.id !== excludedId)
    .filter((node) => (
      world.x >= node.x - padding
      && world.x <= node.x + node.width + padding
      && world.y >= node.y - padding
      && world.y <= node.y + node.height + padding
    ));

  if (!candidates.length) return null;
  candidates.sort((a, b) => {
    const ax = a.x + a.width / 2 - world.x;
    const ay = a.y + a.height / 2 - world.y;
    const bx = b.x + b.width / 2 - world.x;
    const by = b.y + b.height / 2 - world.y;
    return (ax * ax + ay * ay) - (bx * bx + by * by);
  });
  return candidates[0];
}

function renderReconnectPreview(doc) {
  if (state.interaction?.type !== 'reconnect-edge') return '';
  const interaction = state.interaction;
  const edge = doc.edges.find((entry) => entry.id === interaction.edgeId);
  if (!edge || !interaction.pointerWorld) return '';
  const sourceNode = doc.nodes.find((entry) => entry.id === edge.source);
  const targetNode = doc.nodes.find((entry) => entry.id === edge.target);
  if (!sourceNode || !targetNode) return '';

  const floatingNode = {
    x: interaction.pointerWorld.x - 5,
    y: interaction.pointerWorld.y - 5,
    width: 10,
    height: 10,
  };
  const source = interaction.end === 'source' ? floatingNode : sourceNode;
  const target = interaction.end === 'target' ? floatingNode : targetNode;
  const geometry = getEdgeGeometry(source, target, edge);
  const oppositeId = interaction.end === 'source' ? edge.target : edge.source;
  const hoverNode = findNodeAtWorldPoint(doc, interaction.pointerWorld, 28, oppositeId);

  return `
    <g class="reconnect-preview" pointer-events="none">
      <path d="${geometry.path}" fill="none" stroke="${getTheme(doc.themeId).accent}" stroke-width="${Math.max(2.5, edge.width)}" stroke-dasharray="9 7"></path>
      <circle cx="${interaction.pointerWorld.x}" cy="${interaction.pointerWorld.y}" r="6" fill="#ffffff" stroke="${getTheme(doc.themeId).accent}" stroke-width="2"></circle>
      ${hoverNode ? `<rect x="${hoverNode.x - 8}" y="${hoverNode.y - 8}" width="${hoverNode.width + 16}" height="${hoverNode.height + 16}" rx="14" fill="none" stroke="${getTheme(doc.themeId).accent}" stroke-width="2" stroke-dasharray="6 5"></rect>` : ''}
    </g>
  `;
}

function renderConnectionPreview(doc) {
  if (state.interaction?.type === 'reconnect-edge') return '';
  if (!state.connectionSourceId || !state.pointerWorld) return '';
  const source = doc.nodes.find((node) => node.id === state.connectionSourceId);
  if (!source) return '';
  const target = {
    x: state.pointerWorld.x - 4,
    y: state.pointerWorld.y - 4,
    width: 8,
    height: 8,
  };
  const geometry = getEdgeGeometry(source, target, { style: 'curve' });
  const hoverNode = findNodeAtWorldPoint(doc, state.pointerWorld, 18, state.connectionSourceId);
  return `
    <g class="connection-preview" pointer-events="none">
      <path d="${geometry.path}" fill="none" stroke="${getTheme(doc.themeId).accent}" stroke-width="2.5" stroke-dasharray="8 7"></path>
      <circle cx="${state.pointerWorld.x}" cy="${state.pointerWorld.y}" r="4.5" fill="${getTheme(doc.themeId).accent}"></circle>
      ${hoverNode ? `<rect x="${hoverNode.x - 8}" y="${hoverNode.y - 8}" width="${hoverNode.width + 16}" height="${hoverNode.height + 16}" rx="14" fill="none" stroke="${getTheme(doc.themeId).accent}" stroke-width="2" stroke-dasharray="6 5"></rect>` : ''}
    </g>
  `;
}

function wrapGridOffset(value, step) {
  if (!step) return 0;
  return ((value % step) + step) % step;
}

function normalizeWheelDelta(event) {
  let delta = Number(event.deltaY) || 0;
  if (event.deltaMode === 1) delta *= 20;
  else if (event.deltaMode === 2) delta *= 200;
  return delta;
}

function capitalize(value) {
  return String(value || '').charAt(0).toUpperCase() + String(value || '').slice(1);
}

function getCreateTemplateChoices() {
  if (state.createModal.mode === 'blank') {
    return ['blank-canvas', 'mind-map', 'logic-chart'];
  }
  return Array.from(new Set(TEMPLATE_GROUPS.flatMap((group) => group.items)));
}

function getDocumentPreviewDataUri(doc) {
  const svg = createSvgMarkup(doc, { width: 360, height: 210, mode: 'preview' });
  return svgToDataUri(svg);
}

function svgToDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function wrapLabel(text, maxChars) {
  const source = String(text || '').split(/\n+/);
  const lines = [];
  source.forEach((chunk) => {
    const words = chunk.split(/\s+/).filter(Boolean);
    let current = '';
    words.forEach((word) => {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length > maxChars && current) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    });
    if (current) lines.push(current);
  });
  return lines.length ? lines.slice(0, 4) : [''];
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function uid(prefix) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function pushToast(message, kind = 'info') {
  const toast = { id: uid('toast'), message, kind };
  state.toasts.push(toast);
  renderToasts();
  setTimeout(() => {
    state.toasts = state.toasts.filter((entry) => entry.id !== toast.id);
    renderToasts();
  }, 3200);
}

function renderToasts() {
  toastRoot.innerHTML = state.toasts.map((toast) => `<div class="toast ${toast.kind}">${escapeHtml(toast.message)}</div>`).join('');
}

function formatRelativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.round(diffMs / 60000));
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function offsetTime(amount, unit) {
  const date = new Date();
  if (unit === 'minute') date.setMinutes(date.getMinutes() - amount);
  if (unit === 'hour') date.setHours(date.getHours() - amount);
  if (unit === 'day') date.setDate(date.getDate() - amount);
  return date.toISOString();
}

function stripCodeFences(text) {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
}

function extractJsonObject(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return '';
  return text.slice(start, end + 1);
}

function sanitizeFilename(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'lucidity-diagram';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function snap(value, step) {
  return Math.round(value / step) * step;
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace('#', '');
  const chunk = normalized.length === 3 ? normalized.split('').map((char) => char + char).join('') : normalized;
  const number = parseInt(chunk, 16);
  const r = (number >> 16) & 255;
  const g = (number >> 8) & 255;
  const b = number & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function colorInputValue(value) {
  if (!value) return '#000000';
  if (value.startsWith('#')) return value;
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) return '#000000';
  return `#${[match[1], match[2], match[3]].map((part) => Number(part).toString(16).padStart(2, '0')).join('')}`;
}

function renderShapeGlyph(shapeId) {
  const glyphs = {
    'rounded-rect': '<svg viewBox="0 0 48 32"><rect x="4" y="4" width="40" height="24" rx="8"></rect></svg>',
    rect: '<svg viewBox="0 0 48 32"><rect x="4" y="4" width="40" height="24" rx="3"></rect></svg>',
    pill: '<svg viewBox="0 0 48 32"><rect x="4" y="6" width="40" height="20" rx="10"></rect></svg>',
    terminator: '<svg viewBox="0 0 48 32"><rect x="4" y="6" width="40" height="20" rx="10"></rect></svg>',
    subroutine: '<svg viewBox="0 0 48 32"><rect x="4" y="4" width="40" height="24" rx="6"></rect><line x1="12" y1="4" x2="12" y2="28"></line><line x1="36" y1="4" x2="36" y2="28"></line></svg>',
    diamond: '<svg viewBox="0 0 48 32"><path d="M24 4 L42 16 L24 28 L6 16 Z"></path></svg>',
    parallelogram: '<svg viewBox="0 0 48 32"><path d="M12 4 H44 L36 28 H4 Z"></path></svg>',
    document: '<svg viewBox="0 0 48 32"><path d="M6 4 H42 V22 Q34 30 26 24 Q18 18 6 26 Z"></path></svg>',
    'manual-input': '<svg viewBox="0 0 48 32"><path d="M10 4 H44 V28 H4 V10 Z"></path></svg>',
    display: '<svg viewBox="0 0 48 32"><path d="M4 16 Q8 4 16 4 H40 Q44 16 40 28 H16 Q8 28 4 16 Z"></path></svg>',
    delay: '<svg viewBox="0 0 48 32"><path d="M4 4 H30 A12 12 0 0 1 30 28 H4 Z"></path></svg>',
    'off-page': '<svg viewBox="0 0 48 32"><path d="M6 4 H42 V20 L24 28 L6 20 Z"></path></svg>',
    connector: '<svg viewBox="0 0 48 32"><ellipse cx="24" cy="16" rx="10" ry="10"></ellipse></svg>',
    cylinder: '<svg viewBox="0 0 48 32"><ellipse cx="24" cy="8" rx="18" ry="5"></ellipse><path d="M6 8 V24 C6 29,42 29,42 24 V8"></path></svg>',
    circle: '<svg viewBox="0 0 48 32"><ellipse cx="24" cy="16" rx="13" ry="13"></ellipse></svg>',
    hexagon: '<svg viewBox="0 0 48 32"><path d="M14 4 H34 L44 16 L34 28 H14 L4 16 Z"></path></svg>',
    triangle: '<svg viewBox="0 0 48 32"><path d="M24 4 L44 28 H4 Z"></path></svg>',
    pentagon: '<svg viewBox="0 0 48 32"><path d="M24 4 L42 14 L35 28 H13 L6 14 Z"></path></svg>',
    octagon: '<svg viewBox="0 0 48 32"><path d="M14 4 H34 L44 14 V18 L34 28 H14 L4 18 V14 Z"></path></svg>',
    star: '<svg viewBox="0 0 48 32"><path d="M24 4 L28 13 L40 14 L31 20 L34 28 L24 23 L14 28 L17 20 L8 14 L20 13 Z"></path></svg>',
    note: '<svg viewBox="0 0 48 32"><path d="M6 4 H34 L42 12 V28 H6 Z"></path><path d="M34 4 V12 H42"></path></svg>',
    'group-frame': '<svg viewBox="0 0 48 32"><rect x="4" y="4" width="40" height="24" rx="6" stroke-dasharray="4 3"></rect></svg>',
    lane: '<svg viewBox="0 0 48 32"><rect x="4" y="4" width="40" height="24" rx="6" stroke-dasharray="4 3"></rect><line x1="16" y1="4" x2="16" y2="28"></line></svg>',
    board: '<svg viewBox="0 0 48 32"><rect x="4" y="4" width="40" height="24" rx="6"></rect><line x1="17" y1="4" x2="17" y2="28"></line><line x1="31" y1="4" x2="31" y2="28"></line></svg>',
    cluster: '<svg viewBox="0 0 48 32"><rect x="4" y="4" width="40" height="24" rx="10" stroke-dasharray="4 3"></rect></svg>',
    chevron: '<svg viewBox="0 0 48 32"><path d="M4 4 H32 L44 16 L32 28 H4 L14 16 Z"></path></svg>',
    tag: '<svg viewBox="0 0 48 32"><path d="M4 16 L14 4 H44 V28 H14 Z"></path></svg>',
    cloud: '<svg viewBox="0 0 48 32"><path d="M15 25 C7 25,5 15,12 13 C12 6,20 4,25 8 C30 3,39 6,39 14 C44 15,45 25,37 25 Z"></path></svg>',
    'image-card': '<svg viewBox="0 0 48 32"><rect x="4" y="4" width="40" height="24" rx="6"></rect><circle cx="18" cy="14" r="3"></circle><path d="M10 24 L20 16 L28 22 L35 14 L42 24"></path></svg>',
    callout: '<svg viewBox="0 0 48 32"><path d="M4 4 H44 V22 H29 L24 28 L22 22 H4 Z"></path></svg>',
    table: '<svg viewBox="0 0 48 32"><rect x="4" y="4" width="40" height="24" rx="4"></rect><line x1="4" y1="12" x2="44" y2="12"></line><line x1="24" y1="12" x2="24" y2="28"></line><line x1="4" y1="20" x2="44" y2="20"></line></svg>',
    caption: '<svg viewBox="0 0 48 32"><path d="M7 8 H41"></path><path d="M12 16 H36"></path><path d="M14 24 H34"></path></svg>',
    text: '<svg viewBox="0 0 48 32"><path d="M10 8 H38"></path><path d="M18 8 V24"></path><path d="M30 8 V24"></path></svg>',
  };
  return glyphs[shapeId] || glyphs['rounded-rect'];
}

function menuIcon() {
  return '<svg viewBox="0 0 24 24"><path d="M4 7H20"></path><path d="M4 12H20"></path><path d="M4 17H20"></path></svg>';
}
function undoIcon() {
  return '<svg viewBox="0 0 24 24"><path d="M9 7 L4 12 L9 17"></path><path d="M5 12H14C17.314 12 20 14.686 20 18"></path></svg>';
}
function redoIcon() {
  return '<svg viewBox="0 0 24 24"><path d="M15 7 L20 12 L15 17"></path><path d="M19 12H10C6.686 12 4 14.686 4 18"></path></svg>';
}
function connectIcon() {
  return '<svg viewBox="0 0 24 24"><path d="M8 12H16"></path><path d="M6 9A3 3 0 1 0 6 15A3 3 0 1 0 6 9"></path><path d="M18 9A3 3 0 1 0 18 15A3 3 0 1 0 18 9"></path></svg>';
}
function plusIcon() {
  return '<svg viewBox="0 0 24 24"><path d="M12 5V19"></path><path d="M5 12H19"></path></svg>';
}
function focusIcon() {
  return '<svg viewBox="0 0 24 24"><path d="M8 4H4V8"></path><path d="M16 4H20V8"></path><path d="M8 20H4V16"></path><path d="M16 20H20V16"></path></svg>';
}
function sparkIcon() {
  return '<svg viewBox="0 0 24 24"><path d="M12 3L13.7 8.3L19 10L13.7 11.7L12 17L10.3 11.7L5 10L10.3 8.3Z"></path><path d="M18 15L18.8 17.2L21 18L18.8 18.8L18 21L17.2 18.8L15 18L17.2 17.2Z"></path></svg>';
}
function paletteIcon() {
  return '<svg viewBox="0 0 24 24"><path d="M12 4C7.03 4 3 7.58 3 12A6 6 0 0 0 9 18H10C11.1 18 12 18.9 12 20C12 20.55 12.45 21 13 21C17.42 21 21 17.42 21 13C21 8.03 16.97 4 12 4Z"></path><circle cx="7.5" cy="11.5" r="1"></circle><circle cx="11" cy="8" r="1"></circle><circle cx="16.5" cy="10" r="1"></circle><circle cx="16" cy="15" r="1"></circle></svg>';
}
function codeIcon() {
  return '<svg viewBox="0 0 24 24"><path d="M9 18L4 12L9 6"></path><path d="M15 6L20 12L15 18"></path></svg>';
}
function gridIcon() {
  return '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6"></rect><rect x="14" y="4" width="6" height="6"></rect><rect x="4" y="14" width="6" height="6"></rect><rect x="14" y="14" width="6" height="6"></rect></svg>';
}
function refreshIcon() {
  return '<svg viewBox="0 0 24 24"><path d="M20 5V10H15"></path><path d="M4 19V14H9"></path><path d="M6.5 9A7 7 0 0 1 18.5 7"></path><path d="M17.5 15A7 7 0 0 1 5.5 17"></path></svg>';
}
function closeIcon() {
  return '<svg viewBox="0 0 24 24"><path d="M6 6L18 18"></path><path d="M18 6L6 18"></path></svg>';
}
function searchIcon() {
  return '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"></circle><path d="M20 20L16 16"></path></svg>';
}
function bulbIcon() {
  return '<svg viewBox="0 0 24 24"><path d="M9 18H15"></path><path d="M10 22H14"></path><path d="M12 2A7 7 0 0 0 7 14C8 15 8.5 16 8.8 17H15.2C15.5 16 16 15 17 14A7 7 0 0 0 12 2Z"></path></svg>';
}
function branchIcon() {
  return '<svg viewBox="0 0 24 24"><path d="M7 7H17"></path><path d="M7 17H17"></path><path d="M12 7V17"></path></svg>';
}
function uploadIcon() {
  return '<svg viewBox="0 0 24 24"><path d="M12 16V6"></path><path d="M8 10L12 6L16 10"></path><path d="M5 18H19"></path></svg>';
}
