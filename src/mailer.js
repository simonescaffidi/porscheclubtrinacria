// Invio email via API Brevo (stack-standard). Env: BREVO_API_KEY, MAIL_FROM_EMAIL, MAIL_FROM_NAME.
async function invia({ to, subject, html, text, replyTo }) {
  const key = process.env.BREVO_API_KEY;
  if (!key) { console.error('[MAIL] BREVO_API_KEY mancante'); return { inviata: false, motivo: 'BREVO_API_KEY mancante' }; }
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': key, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      sender: { email: process.env.MAIL_FROM_EMAIL, name: process.env.MAIL_FROM_NAME || 'Porsche Club Trinacria' },
      to: [].concat(to).map((email) => ({ email })),
      subject, htmlContent: html, textContent: text,
      replyTo: replyTo ? { email: replyTo } : undefined,
    }),
  });
  if (!r.ok) return { inviata: false, motivo: `Brevo ${r.status}: ${(await r.text()).slice(0, 300)}` };
  return { inviata: true };
}

// Brevo disattiva le chiavi API dopo 90 giorni senza utilizzo: una lettura leggera ogni settimana la tiene attiva.
async function mantieniChiave() {
  const key = process.env.BREVO_API_KEY;
  if (!key) return { ok: false, motivo: 'BREVO_API_KEY mancante' };
  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/statistics/aggregatedReport?days=1', { headers: { 'api-key': key, Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (!r.ok) { console.error(`[MAIL] controllo chiave Brevo: HTTP ${r.status}`); return { ok: false, motivo: `Brevo ${r.status}` }; }
    return { ok: true };
  } catch (e) { console.error('[MAIL] controllo chiave Brevo:', e.message); return { ok: false, motivo: e.message }; }
}
module.exports = { invia, mantieniChiave };
