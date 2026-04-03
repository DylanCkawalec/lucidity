import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = process.cwd();
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';
const defaultDatabaseUrl = process.env.DATABASE_URL || 'postgresql://lucidity:lucidity@127.0.0.1:5433/lucidity';

const upstreams = {
  opseeq: (process.env.OPSEEQ_URL || 'http://127.0.0.1:9090').replace(/\/+$/, ''),
  ollama: (process.env.OLLAMA_URL || 'http://127.0.0.1:11434').replace(/\/+$/, ''),
};

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

const databasePool = new Pool({
  connectionString: defaultDatabaseUrl,
  max: 8,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 2_500,
});

const storageState = {
  checkedAt: null,
  connected: false,
  error: '',
  databaseUrl: redactDatabaseUrl(defaultDatabaseUrl),
};

function redactDatabaseUrl(value) {
  try {
    const parsed = new URL(value);
    if (parsed.password) parsed.password = '***';
    return parsed.toString();
  } catch {
    return value;
  }
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

async function readRequestBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function readJsonBody(req) {
  const body = await readRequestBody(req);
  if (!body.length) return {};
  return JSON.parse(body.toString('utf8'));
}

function pickHeaders(headers) {
  const next = {};
  for (const [key, value] of Object.entries(headers)) {
    if (!value) continue;
    const lower = key.toLowerCase();
    if (['host', 'connection', 'content-length', 'accept-encoding'].includes(lower)) continue;
    next[key] = Array.isArray(value) ? value.join(', ') : value;
  }
  return next;
}

async function proxyRequest(req, res, upstream, prefix) {
  const origin = new URL(`http://${req.headers.host || `${host}:${port}`}`);
  const current = new URL(req.url || '/', origin);
  const upstreamUrl = new URL(current.pathname.replace(prefix, '') + current.search, upstream);
  const body = ['GET', 'HEAD'].includes(req.method || 'GET') ? undefined : await readRequestBody(req);

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: req.method,
      headers: pickHeaders(req.headers),
      body,
      duplex: body ? 'half' : undefined,
    });

    const responseHeaders = {};
    upstreamResponse.headers.forEach((value, key) => {
      if (['content-encoding', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) return;
      responseHeaders[key] = value;
    });
    responseHeaders['Cache-Control'] = 'no-store';

    const buffer = Buffer.from(await upstreamResponse.arrayBuffer());
    if (!responseHeaders['content-length']) responseHeaders['content-length'] = String(buffer.length);
    res.writeHead(upstreamResponse.status, responseHeaders);
    res.end(buffer);
  } catch (error) {
    sendJson(res, 502, {
      error: {
        message: `Failed to reach ${upstream}`,
        details: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

async function fetchHealth(label, url, pathName) {
  const startedAt = Date.now();
  try {
    const response = await fetch(`${url}${pathName}`);
    const data = await response.json().catch(() => ({}));
    return {
      name: label,
      reachable: response.ok,
      status: response.status,
      latencyMs: Date.now() - startedAt,
      data,
    };
  } catch (error) {
    return {
      name: label,
      reachable: false,
      status: 0,
      latencyMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
      data: null,
    };
  }
}

async function ensureDatabase() {
  try {
    await databasePool.query(`
      create table if not exists lucidity_documents (
        id text primary key,
        title text not null,
        type text not null,
        template_id text,
        document jsonb not null,
        created_at timestamptz not null,
        updated_at timestamptz not null
      )
    `);
    storageState.connected = true;
    storageState.error = '';
  } catch (error) {
    storageState.connected = false;
    storageState.error = error instanceof Error ? error.message : String(error);
  }
  storageState.checkedAt = new Date().toISOString();
  return { ...storageState };
}

async function listDocuments() {
  const storage = await ensureDatabase();
  if (!storage.connected) {
    const error = new Error(storage.error || 'Database unavailable');
    error.statusCode = 503;
    throw error;
  }

  const result = await databasePool.query(`
    select document, updated_at
    from lucidity_documents
    order by updated_at desc, created_at desc
  `);

  return {
    documents: result.rows.map((row) => row.document),
    savedAt: result.rows[0]?.updated_at?.toISOString?.() || null,
    storage,
  };
}

async function saveDocuments(documents) {
  const storage = await ensureDatabase();
  if (!storage.connected) {
    const error = new Error(storage.error || 'Database unavailable');
    error.statusCode = 503;
    throw error;
  }

  const client = await databasePool.connect();
  try {
    await client.query('begin');
    const ids = [];

    for (const doc of documents) {
      if (!doc?.id) continue;
      ids.push(doc.id);
      const createdAt = doc.createdAt || new Date().toISOString();
      const updatedAt = doc.updatedAt || new Date().toISOString();
      await client.query(
        `
          insert into lucidity_documents (id, title, type, template_id, document, created_at, updated_at)
          values ($1, $2, $3, $4, $5::jsonb, $6::timestamptz, $7::timestamptz)
          on conflict (id)
          do update set
            title = excluded.title,
            type = excluded.type,
            template_id = excluded.template_id,
            document = excluded.document,
            updated_at = excluded.updated_at
        `,
        [
          doc.id,
          doc.title || 'Untitled Diagram',
          doc.type || 'diagram',
          doc.templateId || null,
          JSON.stringify(doc),
          createdAt,
          updatedAt,
        ],
      );
    }

    if (ids.length) {
      await client.query('delete from lucidity_documents where not (id = any($1::text[]))', [ids]);
    } else {
      await client.query('delete from lucidity_documents');
    }

    await client.query('commit');
    storageState.connected = true;
    storageState.error = '';
    storageState.checkedAt = new Date().toISOString();
    return { savedAt: storageState.checkedAt, storage: { ...storageState } };
  } catch (error) {
    await client.query('rollback');
    storageState.connected = false;
    storageState.error = error instanceof Error ? error.message : String(error);
    storageState.checkedAt = new Date().toISOString();
    throw error;
  } finally {
    client.release();
  }
}

async function serveStatic(req, res) {
  const origin = new URL(`http://${req.headers.host || `${host}:${port}`}`);
  const current = new URL(req.url || '/', origin);
  let pathname = decodeURIComponent(current.pathname);
  if (pathname === '/') pathname = '/index.html';

  const resolved = path.resolve(rootDir, `.${pathname}`);
  if (!resolved.startsWith(rootDir)) {
    sendJson(res, 403, { error: { message: 'Forbidden path' } });
    return;
  }

  try {
    const fileStats = await stat(resolved);
    if (fileStats.isDirectory()) {
      const indexPath = path.join(resolved, 'index.html');
      const body = await readFile(indexPath);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(body);
      return;
    }

    const body = await readFile(resolved);
    const ext = path.extname(resolved).toLowerCase();
    res.writeHead(200, {
      'Content-Type': contentTypes[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.svg' ? 'public, max-age=3600' : 'no-store',
      'Content-Length': body.length,
    });
    res.end(body);
  } catch {
    const fallback = await readFile(path.join(__dirname, 'index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(fallback);
  }
}

const server = createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 400, { error: { message: 'Missing URL' } });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.url.startsWith('/api/opseeq')) {
    await proxyRequest(req, res, upstreams.opseeq, '/api/opseeq');
    return;
  }

  if (req.url.startsWith('/api/ollama')) {
    await proxyRequest(req, res, upstreams.ollama, '/api/ollama');
    return;
  }

  if (req.url === '/api/documents' && req.method === 'GET') {
    try {
      sendJson(res, 200, await listDocuments());
    } catch (error) {
      sendJson(res, error.statusCode || 500, {
        error: { message: error instanceof Error ? error.message : String(error) },
        storage: { ...storageState },
      });
    }
    return;
  }

  if (req.url === '/api/documents/bulk' && req.method === 'PUT') {
    try {
      const payload = await readJsonBody(req);
      const documents = Array.isArray(payload.documents) ? payload.documents : [];
      sendJson(res, 200, await saveDocuments(documents));
    } catch (error) {
      sendJson(res, error.statusCode || 500, {
        error: { message: error instanceof Error ? error.message : String(error) },
        storage: { ...storageState },
      });
    }
    return;
  }

  if (req.url.startsWith('/api/health')) {
    const [opseeq, ollama, storage] = await Promise.all([
      fetchHealth('opseeq', upstreams.opseeq, '/health'),
      fetchHealth('ollama', upstreams.ollama, '/api/tags'),
      ensureDatabase(),
    ]);
    sendJson(res, 200, {
      app: 'lucidity-proxy',
      time: new Date().toISOString(),
      upstreams: { ...upstreams },
      services: { opseeq, ollama, storage },
    });
    return;
  }

  await serveStatic(req, res);
});

ensureDatabase().catch(() => {});

server.listen(port, host, () => {
  console.log(`Lucidity listening on http://${host}:${port}`);
  console.log(`Opseeq proxy: ${upstreams.opseeq}`);
  console.log(`Ollama proxy: ${upstreams.ollama}`);
  console.log(`Postgres target: ${storageState.databaseUrl}`);
});
