// Alert email su errori verso ALERT_EMAIL (default info@simonescaffidi.it), via Brevo.
// Sito senza database: anti-spam 30 minuti per tipo tenuto in memoria (si azzera al riavvio).
const os = require('os');
const mailer = require('./mailer');

const SLUG = 'porscheclubtrinacria';
const FINESTRA_MIN = Number(process.env.ALERT_FINESTRA_MIN || 30);
const ultimi = new Map();
const oraRoma = () => new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' });

async function alert(tipo, err, contesto = {}) {
  const messaggio = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error && err.stack ? err.stack.split('\n').slice(0, 8).join('\n') : '';
  console.error(`[ALERT] ${tipo}: ${messaggio}`);
  if (process.env.NODE_ENV === 'test') return { inviata: false, motivo: 'test' };
  const t = ultimi.get(tipo);
  if (t && Date.now() - t < FINESTRA_MIN * 60000) return { inviata: false, motivo: 'anti-spam' };
  ultimi.set(tipo, Date.now());
  const corpo = [
    `Servizio: ${SLUG} (${process.env.RAILWAY_ENVIRONMENT_NAME || process.env.NODE_ENV || 'locale'})`,
    `Data/ora: ${oraRoma()} (Europe/Rome)`,
    `Tipo: ${tipo}`,
    `Messaggio: ${messaggio}`,
    Object.keys(contesto).length ? `Contesto: ${JSON.stringify(contesto, null, 1).slice(0, 1500)}` : '',
    stack ? `\nStack:\n${stack}` : '',
    `\nHost: ${os.hostname()}`,
    process.env.RAILWAY_PROJECT_ID ? `Railway: https://railway.com/project/${process.env.RAILWAY_PROJECT_ID}` : '',
    `Le mail per questo tipo di errore sono sospese per ${FINESTRA_MIN} minuti.`,
  ].filter(Boolean).join('\n');
  try {
    return await mailer.invia({ to: process.env.ALERT_EMAIL || 'info@simonescaffidi.it', subject: `[ALERT] ${SLUG} – ${tipo}`, text: corpo });
  } catch (e) {
    console.error('[ALERT] invio fallito:', e.message);
    return { inviata: false, motivo: e.message };
  }
}

function installaGestoriProcesso() {
  process.on('unhandledRejection', (e) => { alert('unhandled-rejection', e instanceof Error ? e : new Error(String(e))); });
  process.on('uncaughtException', (e) => {
    const t = setTimeout(() => process.exit(1), 5000); t.unref();
    alert('crash', e).finally(() => process.exit(1));
  });
}

module.exports = { alert, installaGestoriProcesso };
