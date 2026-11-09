import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, extname, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const envFile = resolve(root, '.env');
if (existsSync(envFile)) {
  const lines = readFileSync(envFile, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.json':'application/json', '.webmanifest':'application/manifest+json', '.png':'image/png', '.ico':'image/x-icon' };
const json = (res, status, obj) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };
// In-memory limit for a personal deployment. Public production needs accounts and persistent quotas.
const aiRequests = new Map();
function withinAILimit(address) {
  const now=Date.now(), windowMs=10*60*1000;
  if(aiRequests.size>2000)for(const [k,v] of aiRequests)if(now-v.start>windowMs)aiRequests.delete(k);
  let record=aiRequests.get(address);
  if(!record||now-record.start>windowMs){record={start:now,count:0};aiRequests.set(address,record);}
  record.count++;return record.count<=15;
}
const limitBody = async (request) => {
  const chunks = []; let size = 0;
  for await (const part of request) { size += part.length; if (size > 100000) throw new Error('Request too large'); chunks.push(part); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (url.pathname === '/api/health' && req.method === 'GET') return json(res, 200, { aiEnabled: Boolean(process.env.OPENAI_API_KEY), model: process.env.OPENAI_API_KEY ? 'AI Tutor' : 'Local Tutor' });
    if (url.pathname === '/api/chat' && req.method === 'POST') {
      if (!process.env.OPENAI_API_KEY) return json(res, 503, { error: 'AI tutor is not configured. Local tutor can still help.' });
      if (!withinAILimit(req.socket.remoteAddress || 'unknown')) return json(res, 429, { error: 'AI request limit reached; try again later or use local tools.' });
      const { messages, language = 'en', detailed = true } = await limitBody(req);
      if (!Array.isArray(messages) || !messages.length || messages.length > 18 || messages.some(m => !['user','assistant'].includes(m?.role) || typeof m.content !== 'string' || m.content.length > 6000)) return json(res, 400, { error: 'Invalid chat messages.' });
      const instructions = `You are Shikhi (শিখি), a warm but rigorous mathematics/ICT tutor for Bangladesh students. Respond in ${language === 'bn' ? 'Bangla (বাংলা)' : 'English'} unless the question naturally requires the other language. Cover arithmetic, algebra, geometry, calculus, statistics, ICT number systems and ALL numerical algorithms, with correct math and computed steps. ${detailed ? 'Break everything down into gentle, numbered, beginner-friendly steps. Show the formula, substitutions, final result, and check it when possible.' : 'Give a clear concise answer and the key reasoning.'} Use Markdown and optional LaTeX. When necessary inputs are missing, ask specifically for them; do not invent numeric solutions. Explain assumptions, convergence requirements, and stopping criteria for numerical methods.`;
      const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 26000);
      try {
        const api = await fetch('https://api.openai.com/v1/chat/completions', {
          method:'POST', signal:controller.signal,
          headers: { 'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type':'application/json' },
          body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4.1-mini', messages: [{ role:'system', content:instructions }, ...messages], temperature:0.2 })
        });
        const data = await api.json();
        if (!api.ok) { console.error('AI request failed', api.status, data?.error?.type); return json(res, 502, { error:'AI service unavailable. You can use Local Tutor.' }); }
        const answer = data?.choices?.[0]?.message?.content;
        return json(res, answer ? 200 : 502, answer ? { answer } : { error: 'No answer returned.' });
      } catch (e) { console.error('AI request error', e?.name); return json(res, 503, { error:'AI service could not be reached. Local Tutor is available.' }); }
      finally { clearTimeout(timeout); }
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { error:'Method not allowed' });
    const route = url.pathname === '/' ? '/index.html' : url.pathname;
    const filename = resolve(root, '.' + route);
    if (filename !== root && !filename.startsWith(root + sep)) return json(res, 403, {error:'Forbidden'});
    const relative = filename.slice(root.length).split(sep).join('/');
    if (relative.startsWith('/.env') || relative.endsWith('/package.json') || relative.startsWith('/tests/') || relative.startsWith('/.git/') || relative.startsWith('/scripts/')) return json(res,403,{error:'Forbidden'});
    const info = await stat(filename);
    if (!info.isFile()) return json(res, 404, { error:'Not found' });
    res.writeHead(200, { 'Content-Type': mime[extname(filename)] || 'application/octet-stream', 'Cache-Control': filename.endsWith('service-worker.js') ? 'no-cache' : 'public, max-age=3600' });
    if (req.method === 'HEAD') return res.end();
    return res.end(await readFile(filename));
  } catch (err) {
    return json(res, err?.code === 'ENOENT' ? 404 : err?.message === 'Request too large' ? 413 : 500, { error: err?.code === 'ENOENT' ? 'Not found' : 'Request could not be processed' });
  }
}).listen(Number(process.env.PORT) || 3001, '0.0.0.0', () => console.log(`Shikhi is live at http://localhost:${Number(process.env.PORT) || 3001}`));
