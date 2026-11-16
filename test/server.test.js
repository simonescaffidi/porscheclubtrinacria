// Test base: pagine, redirect dal vecchio sito, healthcheck, pulsante email contatti
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
test('contatti: niente modulo, pulsante email', async () => {
  const r = await get('/contatti');
  const html = await r.text();
  assert.ok(html.includes('mailto:'));
  assert.ok(!html.includes('contact-form'));
  assert.strictEqual((await fetch(base + '/api/contatti', { method: 'POST' })).status, 404);
});

test('album Facebook: pagine eventi generate con foto dalla CDN', async () => {
  const app = require('../server');
  const request = async (p) => { const r = await fetch(base + p, { redirect: 'manual' }); return { status: r.status, body: await r.text() }; };
  app.applicaAlbum([{ slug: 'gangi-2026-04', date: '2026-04-26', when_it: '26 aprile 2026', place: '', title_it: 'Gangi', title_en: 'Gangi', blocks_it: [], images: [{ t: 'https://scontent.example.fbcdn.net/t.jpg', f: 'https://scontent.example.fbcdn.net/f.jpg' }], videos: [], en: { when: '26 April 2026', blocks: [] }, fbLink: 'https://www.facebook.com/x' }]);
  const home = await request('/');
  assert.ok(home.body.includes('Gangi'));
  const ev = await request('/eventi/gangi-2026-04');
  assert.equal(ev.status, 200);
  assert.ok(ev.body.includes('fbcdn.net/f.jpg'));
  const old = await request('/eventi/etna-experience-8-9-novembre');
  assert.equal(old.status, 301);
  const sm = await request('/sitemap.xml');
  assert.ok(sm.body.includes('/en/events/gangi-2026-04'));
});
