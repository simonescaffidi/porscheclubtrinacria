# porscheclubtrinacria

Sito del **Porsche Club Trinacria** (IT principale, EN secondaria). Node 20 + Express 5, pagine statiche generate da `scripts/build.js`.

## Struttura
- `content/` – contenuti: `eventi.json` (testi IT, foto, video), `eventi-en.json` (traduzioni), `calendario-2026.json`, `club.json` (contatti, direttivo, quota, crediti foto)
- `scripts/build.js`, `scripts/pages.js` – generano `dist/` (HTML IT/EN, sitemap.xml, robots.txt)
- `public/` – asset: CSS/JS, font locali, `media/foto` (full/thumb WebP), `media/video` (MP4 720p), `media/brand` (foto di sezione Unsplash, logo), PDF
- `server.js` – statici, iniezione GA4/Search Console da env, form contatti (Brevo), redirect 301 dagli URL WordPress, `/health`, alert errori

## Comandi
```
npm ci
npm run build
npm start        # http://localhost:3000
npm test
```

## Aggiungere un evento
1. Foto: convertire in WebP (1600px in `public/media/foto/full`, 640px in `public/media/foto/thumb`, stesso nome).
2. Video: MP4 H.264 720p in `public/media/video/<nome>.mp4` + poster `<nome>.jpg`.
3. Aggiungere la voce in testa a `content/eventi.json` e la traduzione in `content/eventi-en.json`.
4. Push su `main`: Railway ricostruisce e pubblica.

Nuovo anno: creare `content/calendario-AAAA.json` e aggiornare il nome file in `scripts/build.js`.

## Deploy
Railway, progetto `porscheclubtrinacria`, deploy automatico da `main`. Variabili in `.env.example`.

Powered by www.simonescaffidi.it
