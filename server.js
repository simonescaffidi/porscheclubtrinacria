// Server del sito Porsche Club Trinacria: file statici IT/EN da dist/, form contatti, healthcheck, alert.
const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const mailer = require('./src/mailer');
const { alert, installaGestoriProcesso } = require('./src/alert');

installaGestoriProcesso();
const DIST = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 3000;
const GA4_ID = /^G-[A-Z0-9]+$/.test(process.env.GA4_ID || '') ? process.env.GA4_ID : '';
const GSC = (process.env.GSC_VERIFICATION || '').replace(/[^\w-]/g, '');
const CONTACT_TO = process.env.CONTACT_TO || 'porscheclubtrinacria@gmail.com';

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
      'img-src': ["'self'", 'data:', 'https://*.google-analytics.com', 'https://www.googletagmanager.com'],
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
  if (p.startsWith('/wp-content/uploads/')) {
    if (/statuto/i.test(p)) return res.redirect(301, '/media/statuto-2025.pdf');
    if (/domanda.*iscrizione/i.test(p)) return res.redirect(301, '/media/domanda-iscrizione-2026.pdf');
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
function pagina(file) {
  if (cache.has(file)) return cache.get(file);
  let html = fs.readFileSync(file, 'utf8');
  if (GA4_ID) html = html.replace(/<html lang="(\w+)">/, `<html lang="$1" data-ga4="${GA4_ID}">`);
  html = html.replace('<!--HEAD_INJECT-->', GSC ? `<meta name="google-site-verification" content="${GSC}">` : '');
  cache.set(file, html);
  return html;
}
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

// ---- form contatti ----
const limiteForm = rateLimit({ windowMs: 10 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false, message: { errore: 'Troppi invii, riprova tra qualche minuto.' } });
const schema = z.object({
  nome: z.string().trim().min(2).max(120),
  telefono: z.string().trim().max(40).optional().default(''),
  email: z.string().trim().email().max(160),
  messaggio: z.string().trim().min(5).max(4000),
  privacy: z.literal(true),
  website: z.string().max(0).optional().default(''),
  lang: z.enum(['it', 'en']).optional().default('it'),
});
const escHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

app.post('/api/contatti', limiteForm, express.json({ limit: '20kb' }), async (req, res) => {
  const en = req.body && req.body.lang === 'en';
  if (req.body && req.body.website) return res.json({ ok: true }); // honeypot: finto successo
  const v = schema.safeParse(req.body || {});
  if (!v.success) return res.status(400).json({ errore: en ? 'Please check the required fields.' : 'Controlla i campi obbligatori.' });
  const d = v.data;
  const html = `<h2>Nuovo messaggio dal sito porscheclubtrinacria.it</h2>
<p><strong>Nome:</strong> ${escHtml(d.nome)}<br><strong>Email:</strong> ${escHtml(d.email)}<br><strong>Telefono:</strong> ${escHtml(d.telefono || '-')}<br><strong>Lingua:</strong> ${d.lang.toUpperCase()}</p>
<p><strong>Messaggio:</strong><br>${escHtml(d.messaggio).replace(/\n/g, '<br>')}</p>
<p style="color:#888;font-size:12px">Consenso privacy accettato il ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}. Rispondi direttamente a questa email per scrivere al mittente.</p>`;
  try {
    const r = await mailer.invia({ to: CONTACT_TO, replyTo: d.email, subject: `Contatto dal sito – ${d.nome}`, html, text: `${d.nome} <${d.email}> ${d.telefono}\n\n${d.messaggio}` });
    if (!r.inviata) throw new Error(r.motivo);
    res.json({ ok: true });
  } catch (e) {
    alert('form-contatti', e, { email: d.email });
    res.status(502).json({ errore: en ? `Sending failed. Please write to ${CONTACT_TO}.` : `Invio non riuscito. Scrivi a ${CONTACT_TO}.` });
  }
});

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

if (require.main === module) app.listen(PORT, () => console.log(`Porsche Club Trinacria in ascolto su :${PORT}`));
module.exports = app;
