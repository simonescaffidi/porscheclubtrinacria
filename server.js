// Server del sito Porsche Club Trinacria: pagine IT/EN, eventi dagli album Facebook, healthcheck, alert.
const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const mailer = require('./src/mailer');
const { alert, installaGestoriProcesso } = require('./src/alert');
const facebook = require('./src/facebook');
const { make } = require('./scripts/build');

installaGestoriProcesso();
const DIST = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 3000;
const GA4_ID = /^G-[A-Z0-9]+$/.test(process.env.GA4_ID || '') ? process.env.GA4_ID : '';
const GSC = (process.env.GSC_VERIFICATION || '').replace(/[^\w-]/g, '');

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');

// healthcheck prima di tutto
app.get('/health', (req, res) => {
  const ok = fs.existsSync(path.join(DIST, 'index.html'));
  res.status(ok ? 200 : 503).json({ ok });
});

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'script-src': ["'self'", 'https://www.googletagmanager.com'],
      'connect-src': ["'self'", 'https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://www.googletagmanager.com'],
      'img-src': ["'self'", 'data:', 'https://*.fbcdn.net', 'https://*.google-analytics.com', 'https://www.googletagmanager.com'],
      'frame-src': ['https://www.youtube-nocookie.com'],
      'media-src': ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// ---- redirect dagli URL del vecchio sito WordPress ----
const eventi = require('./content/eventi.json').map((e) => e.slug);
const REDIRECT = {
  '/consiglio-direttivo': '/chi-siamo', '/chi-siamo': '/chi-siamo', '/about-us': '/chi-siamo',
  '/contact': '/contatti', '/contact-us': '/contatti', '/blog': '/eventi', '/calendario-eventi-2025': '/calendario',
  '/faq': '/faq', '/suggerimenti': '/suggerimenti', '/home': '/', '/masonry': '/eventi', '/gallery': '/eventi',
  '/pricing-plan': '/diventa-socio',
};
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  let p = decodeURIComponent(req.path);
  // vecchio modulo d'iscrizione 2026 -> modulo in vigore
  if (p === '/media/domanda-iscrizione-2026.pdf') return res.redirect(301, '/media/domanda-iscrizione-2027.pdf');
  if (p.startsWith('/wp-content/uploads/')) {
    if (/statuto/i.test(p)) return res.redirect(301, '/media/statuto-2025.pdf');
    if (/domanda.*iscrizione/i.test(p)) return res.redirect(301, '/media/domanda-iscrizione-2027.pdf');
    if (/calendario/i.test(p)) return res.redirect(301, '/media/calendario-eventi-2026.pdf');
    return next();
  }
  if (p.length > 1 && p.endsWith('/') && p !== '/en/') p = p.replace(/\/+$/, '');
  if (p === '/en') return res.redirect(301, '/en/');
  const q = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  if (REDIRECT[p] && REDIRECT[p] !== p) return res.redirect(301, REDIRECT[p] + q);
  if (eventi.includes(p.slice(1))) return res.redirect(301, '/eventi' + p);
  if (p !== decodeURIComponent(req.path)) return res.redirect(301, p + q);
  if (/^\/(category|tag|author|feed|wp-admin|wp-login)/.test(p)) return res.redirect(301, '/');
  next();
});

// ---- pagine HTML con GA4 / Search Console iniettati da env ----
const cache = new Map();
function inietta(html) {
  if (GA4_ID) html = html.replace(/<html lang="(\w+)">/, `<html lang="$1" data-ga4="${GA4_ID}">`);
  return html.replace('<!--HEAD_INJECT-->', GSC ? `<meta name="google-site-verification" content="${GSC}">` : '');
}
function pagina(file) {
  if (cache.has(file)) return cache.get(file);
  const html = inietta(fs.readFileSync(file, 'utf8'));
  cache.set(file, html);
  return html;
}

// ---- eventi dagli album Facebook (foto servite dalla CDN di Facebook, non dal nostro server) ----
// Finché gli album non sono disponibili (token mancante o errore) restano le pagine statiche.
let fb = null; // { pagine: Map(url -> html), sitemap }
function applicaAlbum(eventi) {
  if (!eventi || !eventi.length) return;
  const R = make(eventi);
  const pagine = new Map();
  for (const [url, html] of R.pagineEventi()) pagine.set(url, inietta(html));
  fb = { pagine, sitemap: R.sitemapCompleta() };
}
facebook.onAggiornamento(applicaAlbum);
app.applicaAlbum = applicaAlbum; // per i test

app.use((req, res, next) => {
  if (!fb || (req.method !== 'GET' && req.method !== 'HEAD')) return next();
  const p = req.path.length > 1 && req.path.endsWith('/') && req.path !== '/en/' ? req.path.slice(0, -1) : req.path;
  if (fb.pagine.has(p)) { res.set('Cache-Control', 'public, max-age=300'); return res.type('html').send(fb.pagine.get(p)); }
  if (p === '/sitemap.xml') return res.type('application/xml').send(fb.sitemap);
  // vecchi eventi non più presenti -> elenco eventi
  const m = p.match(/^\/(eventi|en\/events)\/[^/]+$/);
  if (m) return res.redirect(301, m[1] === 'eventi' ? '/eventi' : '/en/events');
  next();
});

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const p = req.path;
  if (path.extname(p) && !p.endsWith('.html')) return next();
  const rel = p.endsWith('/') ? p + 'index.html' : (p.endsWith('.html') ? p : p + '.html');
  const file = path.join(DIST, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  if (!file.startsWith(DIST) || !fs.existsSync(file)) return next();
  res.set('Cache-Control', 'public, max-age=300');
  res.type('html').send(pagina(file));
});

const PUBLIC = path.join(__dirname, 'public');
app.use('/media', express.static(path.join(PUBLIC, 'media'), { maxAge: '30d' }));
app.use(express.static(PUBLIC, { maxAge: '1h', index: false }));
app.use(express.static(DIST, { maxAge: '1h', index: false }));

// test alert: POST /admin/alert-test con header x-alert-token = ALERT_TEST_TOKEN
app.post('/admin/alert-test', async (req, res) => {
  const tok = process.env.ALERT_TEST_TOKEN;
  if (!tok || req.get('x-alert-token') !== tok) return res.status(404).end();
  res.json(await alert('test', new Error('Alert di prova dal sito Porsche Club Trinacria')));
});

// 404
app.use((req, res) => {
  const f = path.join(DIST, '404.html');
  if (fs.existsSync(f)) return res.status(404).type('html').send(pagina(f));
  res.status(404).send('Not found');
});

// errori
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) alert('http-500', err, { url: req.originalUrl, metodo: req.method });
  res.status(status).json({ errore: 'Si è verificato un errore.' });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Porsche Club Trinacria in ascolto su :${PORT}`));
  facebook.avvia();
  mailer.mantieniChiave();
  setInterval(() => mailer.mantieniChiave(), 7 * 24 * 60 * 60 * 1000).unref();
}
module.exports = app;
