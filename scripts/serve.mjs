import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const allowlist = new Set((await readFile(resolve(root, 'public-files.txt'), 'utf8')).split('\n').filter(Boolean));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.json': 'application/json; charset=utf-8' };
const port = Number(process.env.PORT || 4173);
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    const file = pathname === '/es/' || pathname === '/es' ? 'index.html' : pathname.replace(/^\//, '') || 'index.html';
    if (!allowlist.has(file)) { response.writeHead(404); response.end('Not found'); return; }
    const content = await readFile(resolve(root, file));
    response.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.end(content);
  } catch { response.writeHead(400); response.end('Bad request'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Portfolio: http://127.0.0.1:${port}`));
