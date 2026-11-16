// Album fotografici dalla pagina Facebook del Club (Graph API).
// Le foto NON vengono salvate sul server: si usano gli URL della CDN di Facebook,
// che scadono dopo alcuni giorni, quindi l'elenco viene riletto ogni ora.
const { alert } = require('./alert');

const VER = process.env.META_GRAPH_VERSION || 'v21.0';
const PAGE_ID = process.env.META_PAGE_ID || 'porscheclubtrinacria';
const TOKEN = () => process.env.META_PAGE_ACCESS_TOKEN;
const OGNI_MS = 60 * 60 * 1000;

const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const fmtIt = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Rome' });
const fmtEn = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Rome' });
const fmtMeseIt = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric', timeZone: 'Europe/Rome' });
const fmtMeseEn = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'Europe/Rome' });
const pad = (n) => String(n).padStart(2, '0');

function slugify(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

// Ricava data e titolo dal nome dell'album, es. "Gangi - 26 Aprile 2026",
// "Track Day - Racalmuto 07-06-2026", "Etna Experience - 8 e 9 Novembre 2025", "Motori e solidarietà - 2026"
function analizzaNome(nome, creato) {
  const n = nome.trim();
  let m; let date; let whenIt; let whenEn; let resto = n;
  const giorno = (y, mo, d) => new Date(Date.UTC(y, mo - 1, d, 12));
  if ((m = n.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/))) {
    const d = giorno(+m[3], +m[2], +m[1]);
    date = `${m[3]}-${pad(m[2])}-${pad(m[1])}`; whenIt = fmtIt.format(d); whenEn = fmtEn.format(d); resto = n.replace(m[0], '');
  } else if ((m = n.match(new RegExp(`(\\d{1,2})(?:\\s*(?:e|-|–)\\s*(\\d{1,2}))?\\s+(${MESI.join('|')})\\s+(\\d{4})`, 'i')))) {
    const mo = MESI.indexOf(m[3].toLowerCase()) + 1;
    date = `${m[4]}-${pad(mo)}-${pad(m[1])}`;
    const d1 = giorno(+m[4], mo, +m[1]);
    if (m[2]) {
      const mese = fmtMeseIt.format(d1); const meseEn = fmtMeseEn.format(d1);
      whenIt = `${m[1]}–${m[2]} ${mese}`; whenEn = `${m[1]}–${m[2]} ${meseEn}`;
    } else { whenIt = fmtIt.format(d1); whenEn = fmtEn.format(d1); }
    resto = n.replace(m[0], '');
  } else if ((m = n.match(new RegExp(`(${MESI.join('|')})\\s+(\\d{4})`, 'i')))) {
    const mo = MESI.indexOf(m[1].toLowerCase()) + 1;
    date = `${m[2]}-${pad(mo)}-01`; const d = giorno(+m[2], mo, 1);
    whenIt = fmtMeseIt.format(d); whenEn = fmtMeseEn.format(d); resto = n.replace(m[0], '');
  } else if ((m = n.match(/\b(20\d{2})\b/))) {
    date = `${m[1]}-01-01`; whenIt = whenEn = m[1]; resto = n.replace(m[0], '');
  } else {
    const d = new Date(creato);
    date = d.toISOString().slice(0, 10); whenIt = fmtIt.format(d); whenEn = fmtEn.format(d);
  }
  const titolo = resto.replace(/[\s\-–—/,]+$/g, '').replace(/^[\s\-–—/,]+/g, '').replace(/\s+-\s+/g, ' · ').replace(/\s{2,}/g, ' ').trim() || n;
  whenIt = whenIt.replace(/^(\d+–\d+ )?(\w)/, (x, a = '', c) => a + c.toLowerCase());
  return { date, whenIt, whenEn, titolo };
}

async function graph(path, params = {}) {
  const u = new URL(`https://graph.facebook.com/${VER}/${path}`);
  for (const [k, v] of Object.entries({ ...params, access_token: TOKEN() })) u.searchParams.set(k, v);
  const r = await fetch(u, { signal: AbortSignal.timeout(20000) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) {
    const e = new Error(`Graph API ${r.status}: ${j.error ? `${j.error.code} ${j.error.message}` : 'risposta non valida'}`);
    e.code = j.error && j.error.code;
    throw e;
  }
  return j;
}
async function tutte(path, params) {
  const out = []; let j = await graph(path, params);
  for (;;) {
    out.push(...(j.data || []));
    if (!j.paging || !j.paging.next) break;
    const r = await fetch(j.paging.next, { signal: AbortSignal.timeout(20000) });
    j = await r.json();
    if (j.error) throw new Error(`Graph API paging: ${j.error.message}`);
  }
  return out;
}

// dalle varianti di dimensione: miniatura ~640px, grande ~1600px
function scegli(images) {
  const s = [...images].sort((a, b) => a.width - b.width);
  const t = s.find((i) => i.width >= 600) || s[s.length - 1];
  const f = [...s].reverse().find((i) => i.width <= 2048) || s[s.length - 1];
  return { t: t.source, f: f.source };
}

async function caricaAlbum() {
  const albums = await tutte(`${PAGE_ID}/albums`, { fields: 'id,name,count,type,created_time,description,link', limit: 100 });
  const eventi = [];
  const usati = new Set();
  for (const a of albums) {
    if (a.type && a.type !== 'normal') continue; // esclude foto profilo, copertina, ecc.
    const foto = await tutte(`${a.id}/photos`, { fields: 'id,images', limit: 100 });
    if (!foto.length) continue;
    const { date, whenIt, whenEn, titolo } = analizzaNome(a.name || '', a.created_time);
    let slug = slugify(`${titolo} ${date.slice(0, 7)}`);
    while (usati.has(slug)) slug += '-2';
    usati.add(slug);
    const desc = (a.description || '').trim();
    eventi.push({
      slug, date, when_it: whenIt, place: '', title_it: titolo, title_en: titolo,
      blocks_it: desc ? desc.split(/\n{2,}/).map((p) => ['p', p]) : [],
      images: foto.map((f) => scegli(f.images)), videos: [],
      en: { when: whenEn, blocks: [] },
      fbLink: a.link || `https://www.facebook.com/media/set/?set=a.${a.id}`,
      fbId: a.id,
    });
  }
  return eventi.sort((x, y) => y.date.localeCompare(x.date));
}

// ---- cache + aggiornamento periodico ----
let stato = { eventi: null, aggiornato: null, errore: null };
const ascoltatori = [];
async function aggiorna() {
  if (!TOKEN()) { stato.errore = 'META_PAGE_ACCESS_TOKEN mancante'; return stato; }
  try {
    const eventi = await caricaAlbum();
    stato = { eventi, aggiornato: new Date(), errore: null };
    for (const f of ascoltatori) f(eventi);
  } catch (e) {
    stato.errore = e.message;
    const istruzioni = [190, 10, 200].includes(e.code)
      ? 'Il token della pagina Facebook è scaduto o non ha i permessi: rigenerare il Page Access Token (pages_read_engagement) e aggiornare META_PAGE_ACCESS_TOKEN su Railway.'
      : 'Il sito continua a mostrare gli ultimi album letti correttamente.';
    alert('album-facebook', e, { istruzioni });
  }
  return stato;
}
function avvia() {
  aggiorna();
  setInterval(aggiorna, OGNI_MS).unref();
}

module.exports = { avvia, aggiorna, onAggiornamento: (f) => ascoltatori.push(f), stato: () => stato, analizzaNome, slugify };
