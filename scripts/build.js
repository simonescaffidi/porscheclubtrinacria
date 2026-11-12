// Genera il sito statico IT/EN in dist/ a partire da content/*.json
// Uso: npm run build   (PUBLIC_URL opzionale, default https://porscheclubtrinacria.it)
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const BASE = (process.env.PUBLIC_URL || 'https://porscheclubtrinacria.it').replace(/\/$/, '');
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'content', f), 'utf8'));

const eventi = read('eventi.json');
const eventiEn = read('eventi-en.json');
const cal = read('calendario-2026.json');
const club = read('club.json');

// ---------- helpers ----------
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nl2br = (s) => esc(s).replace(/\n/g, '<br>');
const linkify = (s) => nl2br(s)
  .replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<a href="mailto:$1">$1</a>')
  .replace(/\bglpress\.it\b/g, '<a href="https://www.glpress.it" target="_blank" rel="noopener">glpress.it</a>');
const thumb = (f) => `/media/foto/thumb/${f}`;
const full = (f) => `/media/foto/full/${f}`;

function write(rel, html) {
  const out = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

// ---------- i18n ----------
const T = {
  it: {
    lang: 'it', pre: '', other: 'en',
    nav: [['/', 'Home'], ['/chi-siamo', 'Chi siamo'], ['/eventi', 'Eventi'], ['/calendario', 'Calendario'], ['/diventa-socio', 'Diventa socio'], ['/faq', 'FAQ'], ['/contatti', 'Contatti']],
    skip: 'Vai al contenuto', menu: 'Menu', tagline: 'Il primo Porsche Club della Sicilia',
    footer: { club: 'Associazione di appassionati Porsche in Sicilia. Raduni, tour, track day, cene sociali e viaggi.', links: 'Il Club', legal: 'Informazioni', photos: 'Foto e Video su Facebook', privacy: 'Privacy policy', cookie: 'Cookie policy', cookies: 'Gestisci cookie', credits: 'Crediti foto', statuto: 'Statuto', sugg: 'Suggerimenti', cf: 'C.F.' },
    readMore: 'Leggi e guarda le foto', allEvents: 'Tutti gli eventi', photosN: (n) => `${n} foto`, videosN: (n) => `${n} video`,
    back: '← Tutti gli eventi', gallery: 'Galleria', videos: 'Video', prev: 'Precedente', next: 'Successivo', close: 'Chiudi',
  },
  en: {
    lang: 'en', pre: '/en', other: 'it',
    nav: [['/en/', 'Home'], ['/en/about', 'About us'], ['/en/events', 'Events'], ['/en/calendar', 'Calendar'], ['/en/membership', 'Membership'], ['/en/faq', 'FAQ'], ['/en/contact', 'Contact']],
    skip: 'Skip to content', menu: 'Menu', tagline: 'The first Porsche Club in Sicily',
    footer: { club: 'An association of Porsche enthusiasts in Sicily. Meets, tours, track days, social dinners and trips.', links: 'The Club', legal: 'Information', photos: 'Photos & videos on Facebook', privacy: 'Privacy policy', cookie: 'Cookie policy', cookies: 'Manage cookies', credits: 'Photo credits', statuto: 'Statute (IT)', sugg: 'Suggestions', cf: 'Tax code' },
    readMore: 'Read and see the photos', allEvents: 'All events', photosN: (n) => `${n} photos`, videosN: (n) => `${n} videos`,
    back: '← All events', gallery: 'Gallery', videos: 'Videos', prev: 'Previous', next: 'Next', close: 'Close',
  },
};

// Mappa pagine IT <-> EN (per switcher e hreflang)
const PAIRS = [
  ['/', '/en/'], ['/chi-siamo', '/en/about'], ['/eventi', '/en/events'], ['/calendario', '/en/calendar'],
  ['/diventa-socio', '/en/membership'], ['/faq', '/en/faq'], ['/contatti', '/en/contact'], ['/suggerimenti', '/en/suggestions'],
  ['/privacy-policy', '/en/privacy-policy'], ['/cookie-policy', '/en/cookie-policy'], ['/crediti', '/en/credits'],
  ...eventi.map((e) => [`/eventi/${e.slug}`, `/en/events/${e.slug}`]),
];
const altOf = (url, lang) => { const p = PAIRS.find((x) => x[lang === 'it' ? 0 : 1] === url); return p ? p[lang === 'it' ? 1 : 0] : (lang === 'it' ? '/en/' : '/'); };
const fileOf = (url) => (url.endsWith('/') ? url + 'index.html' : url + '.html').replace(/^\//, '');
const sitemap = [];

// ---------- layout ----------
function layout({ lang, url, title, desc, body, image = '/media/brand/og.jpg', type = 'website', jsonld, bodyClass = '' }) {
  const t = T[lang];
  const alt = altOf(url, lang);
  const urlIt = lang === 'it' ? url : alt; const urlEn = lang === 'en' ? url : alt;
  sitemap.push({ it: urlIt, en: urlEn });
  const fullTitle = url === '/' || url === '/en/' ? title : `${title} | Porsche Club Trinacria`;
  const nav = t.nav.map(([h, l]) => `<a href="${h}"${(h === url || (h !== '/' && h !== '/en/' && url.startsWith(h + '/'))) ? ' aria-current="page"' : ''}>${l}</a>`).join('');
  const f = t.footer;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${BASE}${url}">
<link rel="alternate" hreflang="it" href="${BASE}${urlIt}">
<link rel="alternate" hreflang="en" href="${BASE}${urlEn}">
<link rel="alternate" hreflang="x-default" href="${BASE}${urlIt}">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Porsche Club Trinacria">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${BASE}${url}">
<meta property="og:image" content="${BASE}${image}">
<meta property="og:locale" content="${lang === 'it' ? 'it_IT' : 'en_GB'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0b0b0c">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="/favicon.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/archivo.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css?v=${VERSION}">
<!--HEAD_INJECT-->
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
<script src="/assets/consent.js?v=${VERSION}" defer></script>
<script src="/assets/site.js?v=${VERSION}" defer></script>
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">${t.skip}</a>
<header class="site-header">
  <div class="wrap header-in">
    <a class="brand" href="${lang === 'it' ? '/' : '/en/'}" aria-label="Porsche Club Trinacria – Home">
      <img src="/media/brand/crest.png" alt="" width="29" height="36">
      <span><strong>Porsche Club</strong> Trinacria</span>
    </a>
    <nav class="main-nav" id="main-nav" aria-label="${lang === 'it' ? 'Navigazione principale' : 'Main navigation'}">${nav}</nav>
    <div class="header-tools">
      <a class="lang" href="${alt}" hreflang="${t.other}" lang="${t.other}" aria-label="${lang === 'it' ? 'English version' : 'Versione italiana'}"><span${lang === 'it' ? ' class="on"' : ''}>IT</span><span${lang === 'en' ? ' class="on"' : ''}>EN</span></a>
      <button class="burger" aria-controls="main-nav" aria-expanded="false"><span></span><span></span><span class="sr">${t.menu}</span></button>
    </div>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap foot-grid">
    <div>
      <a class="brand brand-foot" href="${lang === 'it' ? '/' : '/en/'}"><img src="/media/brand/crest.png" alt="" width="29" height="36" loading="lazy"><span><strong>Porsche Club</strong> Trinacria</span></a>
      <p>${f.club}</p>
      <p class="contacts-mini">${esc(club.indirizzo)}<br><a href="tel:${club.telLink}">${esc(club.tel)}</a><br><a href="mailto:${club.email}">${club.email}</a></p>
    </div>
    <div>
      <h2>${f.links}</h2>
      <ul>${t.nav.slice(1).map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}<li><a href="${lang === 'it' ? '/suggerimenti' : '/en/suggestions'}">${f.sugg}</a></li></ul>
    </div>
    <div>
      <h2>${f.legal}</h2>
      <ul>
        <li><a href="${club.facebookFoto}" target="_blank" rel="noopener">${f.photos}</a></li>
        <li><a href="/media/statuto-2025.pdf" target="_blank" rel="noopener">${f.statuto}</a></li>
        <li><a href="${lang === 'it' ? '/privacy-policy' : '/en/privacy-policy'}">${f.privacy}</a></li>
        <li><a href="${lang === 'it' ? '/cookie-policy' : '/en/cookie-policy'}">${f.cookie}</a></li>
        <li><a href="#" data-cookie-settings>${f.cookies}</a></li>
        <li><a href="${lang === 'it' ? '/crediti' : '/en/credits'}">${f.credits}</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap foot-bottom">
    <p>© ${new Date().getFullYear()} ${esc(club.ragioneSociale)} – ${f.cf} ${club.cf}</p>
    <p class="powered-by">Powered by <a href="https://www.simonescaffidi.it" target="_blank" rel="noopener noreferrer">www.simonescaffidi.it</a></p>
  </div>
</footer>
<div class="lightbox" id="lightbox" hidden role="dialog" aria-modal="true" aria-label="${t.gallery}">
  <div class="lb-top"><p class="lb-title"></p><p class="lb-count"></p><button class="lb-close" aria-label="${t.close}">×</button></div>
  <div class="lb-stage">
    <button class="lb-prev" aria-label="${t.prev}">‹</button>
    <img alt="">
    <button class="lb-next" aria-label="${t.next}">›</button>
  </div>
  <div class="lb-strip"></div>
</div>
</body>
</html>
`;
}

// ---------- blocchi ricorrenti ----------
const pageHero = (img, kicker, h1, lead) => `
<section class="page-hero">
  <img src="${img}" alt="" class="ph-bg" fetchpriority="high">
  <div class="wrap ph-in">
    ${kicker ? `<p class="kicker">${kicker}</p>` : ''}
    <h1>${h1}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ''}
  </div>
</section>`;

function eventCard(e, lang) {
  const t = T[lang];
  const title = lang === 'it' ? e.title_it : e.title_en;
  const when = lang === 'it' ? e.when_it : (eventiEn[e.slug]?.when || e.when_it);
  const place = lang === 'en' && eventiEn[e.slug]?.place ? eventiEn[e.slug].place : e.place;
  const cover = e.images[0] ? thumb(e.images[0]) : (e.videos[0]?.src ? `/media/video/${e.videos[0].src}.jpg` : '/media/brand/eventi.webp');
  const meta = [e.images.length ? t.photosN(e.images.length) : '', e.videos.length ? t.videosN(e.videos.length) : ''].filter(Boolean).join(' · ');
  return `<article class="card">
  <a href="${lang === 'it' ? '/eventi/' : '/en/events/'}${e.slug}">
    <div class="card-img"><img src="${cover}" alt="${esc(title)}" loading="lazy" width="640" height="427"></div>
    <div class="card-body">
      <p class="card-date"><time datetime="${e.date}">${esc(when)}</time> · ${esc(place)}</p>
      <h3>${esc(title)}</h3>
      ${meta ? `<p class="card-meta">${meta}</p>` : ''}
    </div>
  </a>
</article>`;
}

function calRows(lang, opts = {}) {
  return cal.voci.map((v) => `<li class="cal-item${v.pausa ? ' pausa' : ''}" data-end="${v.a}">
  <div class="cal-when">${esc(lang === 'it' ? v.quando_it : v.quando_en)}</div>
  <div class="cal-what"><strong>${esc(lang === 'it' ? v.it : v.en)}</strong>${v.luogo ? `<span>${esc(lang === 'en' && v.luogo_en ? v.luogo_en : v.luogo)}</span>` : ''}</div>
  ${v.evento ? `<a class="cal-link" href="${lang === 'it' ? '/eventi/' : '/en/events/'}${v.evento}">${lang === 'it' ? 'Foto' : 'Photos'} →</a>` : ''}
</li>`).join('');
}

const orgLd = {
  '@context': 'https://schema.org', '@type': 'SportsOrganization', name: 'Porsche Club Trinacria', alternateName: club.ragioneSociale,
  url: BASE + '/', logo: BASE + '/media/brand/logo-full.png', email: club.email, telephone: club.tel, foundingDate: '2023-11-16',
  address: { '@type': 'PostalAddress', streetAddress: 'Via San Lorenzo, 306', postalCode: '90146', addressLocality: 'Palermo', addressRegion: 'PA', addressCountry: 'IT' },
  sameAs: ['https://www.facebook.com/porscheclubtrinacria/'],
};

// ---------- pagine ----------
const VERSION = Date.now().toString(36);
const P = require('./pages')({ T, esc, nl2br, linkify, thumb, full, eventi, eventiEn, cal, club, eventCard, calRows, pageHero, BASE });

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  for (const lang of ['it', 'en']) {
    for (const pg of P.pages(lang)) {
      write(fileOf(pg.url), layout({ lang, ...pg, jsonld: pg.jsonld || (pg.url === '/' || pg.url === '/en/' ? orgLd : undefined) }));
    }
    for (const e of eventi) {
      const pg = P.eventPage(e, lang);
      write(fileOf(pg.url), layout({ lang, ...pg, type: 'article' }));
    }
  }
  // 404
  write('404.html', layout({ lang: 'it', url: '/404', title: 'Pagina non trovata', desc: 'Pagina non trovata', body: P.notFound() }).replace('<meta name="viewport"', '<meta name="robots" content="noindex">\n<meta name="viewport"'));
  sitemap.pop(); // 404 fuori dalla sitemap
  // sitemap + robots
  const seen = new Set();
  const urls = sitemap.filter((s) => { const k = s.it + '|' + s.en; if (seen.has(k)) return false; seen.add(k); return true; });
  const today = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.flatMap((s) => [s.it, s.en].map((u) => `<url><loc>${BASE}${u}</loc><lastmod>${today}</lastmod><xhtml:link rel="alternate" hreflang="it" href="${BASE}${s.it}"/><xhtml:link rel="alternate" hreflang="en" href="${BASE}${s.en}"/></url>`)).join('\n')}
</urlset>
`;
  write('sitemap.xml', xml);
  write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${BASE}/sitemap.xml\n`);
  console.log(`Build ok: ${urls.length * 2} pagine in dist/`);
}

build();
