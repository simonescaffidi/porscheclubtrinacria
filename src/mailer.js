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
module.exports = { invia };
