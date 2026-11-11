// Test base: pagine, redirect dal vecchio sito, healthcheck, validazione form
process.env.NODE_ENV = 'test';
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { execSync } = require('node:child_process');
const path = require('node:path');

let server, base;
before(async () => {
  execSync('node scripts/build.js', { cwd: path.join(__dirname, '..'), stdio: 'ignore' });
  const app = require('../server');
  await new Promise((r) => { server = app.listen(0, r); });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());
const get = (p) => fetch(base + p, { redirect: 'manual' });

test('pagine principali IT/EN', async () => {
  for (const p of ['/', '/en/', '/chi-siamo', '/en/about', '/eventi', '/en/events', '/calendario', '/diventa-socio', '/contatti', '/faq', '/privacy-policy', '/en/cookie-policy']) {
    const r = await get(p); assert.strictEqual(r.status, 200, p);
    const h = await r.text();
    assert.match(h, /Powered by <a href="https:\/\/www\.simonescaffidi\.it"/, p);
    assert.match(h, /hreflang="en"/, p);
  }
});
test('redirect URL WordPress', async () => {
  let r = await get('/consiglio-direttivo/'); assert.strictEqual(r.status, 301); assert.strictEqual(r.headers.get('location'), '/chi-siamo');
  r = await get('/etna-experience-8-9-novembre/'); assert.strictEqual(r.headers.get('location'), '/eventi/etna-experience-8-9-novembre');
});
test('health e 404', async () => {
  assert.strictEqual((await get('/health')).status, 200);
  assert.strictEqual((await get('/non-esiste')).status, 404);
});
test('form: validazione e honeypot', async () => {
  const post = (b) => fetch(base + '/api/contatti', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) });
  assert.strictEqual((await post({ nome: 'A' })).status, 400);
  assert.strictEqual((await post({ nome: 'Bot', email: 'x@y.it', messaggio: 'spam spam', privacy: true, website: 'x' })).status, 200);
});
