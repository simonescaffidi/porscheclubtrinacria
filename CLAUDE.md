# CLAUDE.md – porscheclubtrinacria

- Segui le skill di Simone: `stack-standard`, `sito-web-standard`, `alert-email-errori`.
- Sito vetrina statico IT/EN servito da Express; nessun database.
- Ogni testo visibile va in IT e EN. Footer "Powered by www.simonescaffidi.it" sempre presente.
- GA4 solo dopo consenso (`public/assets/consent.js`); niente CDN o Google Fonts.
- Contenuti in `content/*.json`; non toccare `dist/` (generato).
- Foto degli eventi: dei soci del Club. Foto di sezione: Unsplash (crediti in `content/club.json` → pagina /crediti).
- Email solo via API Brevo (`src/mailer.js`). Alert errori via `src/alert.js` a info@simonescaffidi.it.
- Mantieni i redirect 301 dal vecchio sito WordPress in `server.js`.
