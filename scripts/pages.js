// Contenuti delle pagine (IT/EN). I testi IT sono quelli del sito originale.
module.exports = function (ctx) {
  const { T, esc, linkify, thumb, full, eventi, eventiEn, cal, club, eventCard, calRows, pageHero } = ctx;
  const L = (lang, it, en) => (lang === 'it' ? it : en);
  const u = (lang, it, en) => (lang === 'it' ? it : en);

  // ---------------- HOME ----------------
  function home(lang) {
    const ultimi = eventi.slice(0, 6).map((e) => eventCard(e, lang)).join('');
    const body = `
<section class="hero">
  <img class="hero-bg" src="/media/brand/hero.webp" alt="${L(lang, 'Porsche 911 su una strada di montagna', 'Porsche 911 on a mountain road')}" fetchpriority="high" width="2400" height="1600">
  <div class="wrap hero-in">
    <img class="hero-crest" src="/media/brand/crest.png" alt="" width="72" height="89">
    <p class="kicker">${L(lang, 'Benvenuto', 'Welcome')}</p>
    <h1>Porsche Club<br><span>Trinacria</span></h1>
    <p class="lead">${L(lang, 'Il primo Porsche Club della Sicilia. Su questo portale trovi tutte le informazioni sul nostro Club: news, gallerie fotografiche dei nostri eventi, info utili e molto altro.', 'The first Porsche Club in Sicily. Here you’ll find everything about our Club: news, photo galleries from our events, useful information and much more.')}</p>
    <div class="cta-row">
      <a class="btn btn-red" href="${u(lang, '/diventa-socio', '/en/membership')}">${L(lang, 'Diventa socio', 'Become a member')}</a>
      <a class="btn btn-ghost" href="${u(lang, '/eventi', '/en/events')}">${L(lang, 'Guarda gli eventi', 'See our events')}</a>
    </div>
  </div>
  <div class="hero-stats wrap">
    <div><strong>2023</strong><span>${L(lang, 'Anno di fondazione', 'Founded')}</span></div>
    <div><strong>130+</strong><span>${L(lang, 'Soci', 'Members')}</span></div>
    <div><strong>${eventi.length}+</strong><span>${L(lang, 'Eventi raccontati', 'Events covered')}</span></div>
    <div><strong>60+</strong><span>${L(lang, 'Porsche in un solo raduno', 'Porsches at a single meet')}</span></div>
  </div>
</section>

<section class="section next-up">
  <div class="wrap split">
    <div>
      <p class="kicker">${L(lang, `Calendario ${cal.anno}`, `${cal.anno} calendar`)}</p>
      <h2>${L(lang, 'Prossimi appuntamenti', 'Coming up')}</h2>
      <p>${L(lang, 'Raduni, track day, cene sociali e viaggi durante tutto l’anno. C’è sempre qualcosa di emozionante in programma.', 'Meets, track days, social dinners and trips all year round. There’s always something exciting on the programme.')}</p>
      <a class="btn btn-line" href="${u(lang, '/calendario', '/en/calendar')}">${L(lang, 'Calendario completo', 'Full calendar')}</a>
    </div>
    <ol class="cal-list cal-upcoming" data-limit="3">${calRows(lang)}</ol>
  </div>
</section>

<section class="feature">
  <div class="feature-img"><img src="/media/brand/storia.webp" alt="${L(lang, 'Porsche 911 GT3 al tramonto', 'Porsche 911 GT3 at sunset')}" loading="lazy" width="1800" height="1200"></div>
  <div class="feature-txt">
    <p class="kicker">${L(lang, 'La nostra storia', 'Our story')}</p>
    <h2>${L(lang, 'Nati dalla passione di un gruppo di amici', 'Born from a group of friends’ passion')}</h2>
    <p>${L(lang, 'Fondato nel 2023, il Porsche Club Trinacria è nato dalla passione di un gruppo di amici per le automobili Porsche. Da allora, siamo cresciuti fino a diventare uno dei club Porsche più grandi in Sicilia. La nostra missione è quella di riunire i proprietari e gli appassionati di Porsche, promuovendo eventi, incontri e attività.', 'Founded in 2023, Porsche Club Trinacria was born from a group of friends’ passion for Porsche cars. Since then we have grown into one of the largest Porsche clubs in Sicily. Our mission is to bring Porsche owners and enthusiasts together through events, meetings and activities.')}</p>
    <a class="btn btn-line" href="${u(lang, '/chi-siamo', '/en/about')}">${L(lang, 'Scopri di più', 'Learn more')}</a>
  </div>
</section>

<section class="feature reverse">
  <div class="feature-img"><img src="/media/brand/socio.webp" alt="${L(lang, 'Porsche 911 GT3 RS argento', 'Silver Porsche 911 GT3 RS')}" loading="lazy" width="1600" height="1067"></div>
  <div class="feature-txt">
    <p class="kicker">${L(lang, 'Unisciti a noi', 'Join us')}</p>
    <h2>${L(lang, 'Diventa socio', 'Become a member')}</h2>
    <ul class="ticks">
      <li>${L(lang, 'Accesso esclusivo ai nostri eventi', 'Exclusive access to our events')}</li>
      <li>${L(lang, 'Sconti presso partner selezionati', 'Discounts with selected partners')}</li>
      <li>${L(lang, 'E molto altro!', 'And much more!')}</li>
    </ul>
    <p>${L(lang, 'Diventare socio del Porsche Club Trinacria è semplice e ti offre l’opportunità di entrare a far parte di una comunità di appassionati di Porsche. Non vediamo l’ora di darti il benvenuto nel nostro club e condividere un sacco di emozioni!', 'Joining Porsche Club Trinacria is easy and lets you become part of a community of Porsche enthusiasts. We look forward to welcoming you and sharing plenty of emotions together!')}</p>
    <a class="btn btn-red" href="${u(lang, '/diventa-socio', '/en/membership')}">${L(lang, 'Iscriviti subito', 'Join now')}</a>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">
      <div><p class="kicker">${L(lang, 'Dal Porsche Club Trinacria', 'From Porsche Club Trinacria')}</p><h2>${L(lang, 'Gli ultimi eventi', 'Latest events')}</h2></div>
      <a class="btn btn-line" href="${u(lang, '/eventi', '/en/events')}">${T[lang].allEvents}</a>
    </div>
    <div class="cards">${ultimi}</div>
  </div>
</section>

<section class="band band-sugg">
  <img src="/media/brand/gt3.webp" alt="" loading="lazy" class="band-bg">
  <div class="wrap band-in">
    <p class="kicker">${L(lang, 'Suggerimenti', 'Suggestions')}</p>
    <h2>${L(lang, 'La strada la facciamo insieme', 'We drive the road together')}</h2>
    <p>${L(lang, 'Hai un’idea per un raduno, un tour o una collaborazione? Il Club cresce con le proposte dei soci.', 'Got an idea for a meet, a tour or a partnership? The Club grows with its members’ proposals.')}</p>
    <a class="btn btn-ghost" href="${u(lang, '/suggerimenti', '/en/suggestions')}">${L(lang, 'Proponi un’idea', 'Suggest an idea')}</a>
  </div>
</section>

<section class="partner">
  <div class="wrap partner-in">
    <div class="partner-img"><img src="/media/brand/partner.webp" alt="${L(lang, 'Porsche 911 grigia davanti a uno showroom', 'Grey Porsche 911 in front of a showroom')}" loading="lazy" width="1800" height="1012"></div>
    <div class="partner-txt">
      <p class="kicker">${L(lang, 'Centro Porsche Palermo', 'Porsche Centre Palermo')}</p>
      <h2>RS Motorsport</h2>
      <p>${L(lang, 'Entra in RS Motorsport S.p.A., il centro Porsche ufficiale di Palermo: visita il sito, scopri i modelli e trova la tua auto. Potrai inoltre trovare accessori, gadget ed abbigliamento legati alla tua vettura ed al mondo Porsche in generale.', 'Visit RS Motorsport S.p.A., the official Porsche Centre in Palermo: browse the models and find your car. You’ll also find accessories, merchandise and apparel for your car and the Porsche world in general.')}</p>
      <a class="btn btn-line" href="${club.partner.url}" target="_blank" rel="noopener">${L(lang, 'Visita il sito', 'Visit the website')}</a>
    </div>
  </div>
</section>

<section class="section contact-band">
  <div class="wrap split">
    <div>
      <p class="kicker">${L(lang, 'Contatti', 'Contact')}</p>
      <h2>${L(lang, 'Hai domande?', 'Any questions?')}</h2>
      <p>${L(lang, 'Siamo qui per aiutarti! Puoi contattarci via email o chiamarci. In alternativa, compila il modulo di contatto e ti risponderemo il prima possibile.', 'We’re here to help! Email or call us, or fill in the contact form and we’ll get back to you as soon as possible.')}</p>
    </div>
    <div class="contact-quick">
      <a href="tel:${club.telLink}"><span>${L(lang, 'Telefono', 'Phone')}</span>${esc(club.tel)}</a>
      <a href="mailto:${club.email}"><span>Email</span>${club.email}</a>
      <a class="btn btn-red" href="${u(lang, '/contatti', '/en/contact')}">${L(lang, 'Contattaci', 'Contact us')}</a>
    </div>
  </div>
</section>`;
    return { url: u(lang, '/', '/en/'), title: L(lang, 'Porsche Club Trinacria – Il primo Porsche Club della Sicilia', 'Porsche Club Trinacria – The first Porsche Club in Sicily'), desc: L(lang, 'Porsche Club Trinacria: raduni, tour, track day e cene sociali per appassionati Porsche in Sicilia. Eventi, gallerie fotografiche e iscrizione al club.', 'Porsche Club Trinacria: meets, tours, track days and social dinners for Porsche enthusiasts in Sicily. Events, photo galleries and membership.'), body, bodyClass: 'home' };
  }

  // ---------------- CHI SIAMO ----------------
  function about(lang) {
    const dir = club.direttivo.map(([n, it, en]) => `<li><strong>${esc(n)}</strong><span>${L(lang, it, en)}</span></li>`).join('');
    const zone = club.zone.map(([n, z]) => `<li><strong>${esc(n)}</strong><span>${esc(z)}</span></li>`).join('');
    const body = `${pageHero('/media/brand/storia.webp', L(lang, 'Chi siamo', 'About us'), L(lang, 'La nostra storia', 'Our story'), L(lang, 'Fondato il 16 novembre 2023, uno dei club Porsche più grandi e attivi della Sicilia.', 'Founded on 16 November 2023, one of the largest and most active Porsche clubs in Sicily.'))}
<section class="section">
  <div class="wrap prose-grid">
    <div class="prose">
      <p>${L(lang, `Il Porsche Club Trinacria è stato fondato il 16 novembre 2023 da una idea di Dario Pellerito ed un gruppo di amici accomunati dalla passione per le automobili Porsche. I fondatori, ${club.fondatori.slice(0, -1).join(', ')} e ${club.fondatori.slice(-1)}, hanno unito le loro forze per creare un punto di riferimento per gli appassionati di Porsche in Sicilia.`, `Porsche Club Trinacria was founded on 16 November 2023 from an idea by Dario Pellerito and a group of friends who share a passion for Porsche cars. The founders, ${club.fondatori.slice(0, -1).join(', ')} and ${club.fondatori.slice(-1)}, joined forces to create a point of reference for Porsche enthusiasts in Sicily.`)}</p>
      <p>${L(lang, 'Fin dalla sua fondazione, il club ha lavorato per promuovere l’entusiasmo e l’amore per queste vetture iconiche, organizzando eventi, raduni e attività che celebrano il fascino e la storia delle Porsche. Grazie alla dedizione dei suoi membri e alla loro passione condivisa, il Porsche Club Trinacria è rapidamente cresciuto diventando uno dei club Porsche più grandi e attivi della regione.', 'Since its foundation, the club has worked to promote enthusiasm and love for these iconic cars, organising events, meets and activities that celebrate the appeal and history of Porsche. Thanks to its members’ dedication and shared passion, Porsche Club Trinacria quickly grew into one of the largest and most active Porsche clubs in the region.')}</p>
      <p>${L(lang, 'La nostra missione è semplice: riunire i proprietari e gli appassionati di Porsche per condividere esperienze indimenticabili, creare amicizie durature e celebrare insieme l’eccellenza ingegneristica e il design senza tempo di queste straordinarie automobili. Unisciti a noi e diventa parte della nostra comunità!', 'Our mission is simple: to bring Porsche owners and enthusiasts together to share unforgettable experiences, build lasting friendships and celebrate the engineering excellence and timeless design of these extraordinary cars. Join us and become part of our community!')}</p>
      <p><a class="btn btn-line" href="/media/statuto-2025.pdf" target="_blank" rel="noopener">${L(lang, 'Visualizza lo statuto (PDF)', 'View the statute (PDF, Italian)')}</a></p>
    </div>
    <figure class="prose-img"><img src="${full('conviviale-2023.webp')}" alt="${L(lang, 'Soci del Porsche Club Trinacria alla Conviviale 2023', 'Porsche Club Trinacria members at the 2023 gala dinner')}" loading="lazy"></figure>
  </div>
</section>
<section class="section alt">
  <div class="wrap">
    <h2>${L(lang, 'Il Consiglio Direttivo', 'The Board')}</h2>
    <ul class="people">${dir}</ul>
    <div class="two-col">
      <div><h2>${L(lang, 'Responsabili di zona', 'Area representatives')}</h2><ul class="people people-sm">${zone}</ul></div>
      <div><h2>${L(lang, 'Stampa e comunicazione', 'Press and communication')}</h2><ul class="people people-sm">${club.stampa.map((n) => `<li><strong>${esc(n)}</strong></li>`).join('')}</ul></div>
    </div>
  </div>
</section>`;
    return { url: u(lang, '/chi-siamo', '/en/about'), title: L(lang, 'Chi siamo e Consiglio Direttivo', 'About us and the Board'), desc: L(lang, 'Storia, missione e Consiglio Direttivo del Porsche Club Trinacria, fondato a Palermo il 16 novembre 2023.', 'History, mission and Board of Porsche Club Trinacria, founded in Palermo on 16 November 2023.'), body, image: '/media/brand/storia.webp' };
  }

  // ---------------- EVENTI ----------------
  function events(lang) {
    const years = [...new Set(eventi.map((e) => e.date.slice(0, 4)))];
    const body = `${pageHero('/media/brand/eventi.webp', L(lang, 'Eventi e news', 'Events and news'), L(lang, 'I nostri eventi', 'Our events'), L(lang, 'Raduni, tour, cene sociali e viaggi: racconti e gallerie fotografiche dei nostri appuntamenti.', 'Meets, tours, social dinners and trips: stories and photo galleries from our gatherings.'))}
<section class="section">
  <div class="wrap">
    ${years.map((y) => `<h2 class="year">${y}</h2><div class="cards">${eventi.filter((e) => e.date.startsWith(y)).map((e) => eventCard(e, lang)).join('')}</div>`).join('')}
  </div>
</section>`;
    return { url: u(lang, '/eventi', '/en/events'), title: L(lang, 'Eventi, raduni e gallerie fotografiche', 'Events, meets and photo galleries'), desc: L(lang, 'Tutti gli eventi del Porsche Club Trinacria: raduni in Sicilia, tour, Paradis Porsche di Saint-Tropez, conviviali e serate di beneficenza, con foto e video.', 'All Porsche Club Trinacria events: meets across Sicily, tours, Paradis Porsche in Saint-Tropez, gala dinners and charity evenings, with photos and videos.'), body, image: '/media/brand/eventi.webp' };
  }

  function eventPage(e, lang) {
    const t = T[lang];
    const en = eventiEn[e.slug] || {};
    const title = L(lang, e.title_it, e.title_en);
    const when = L(lang, e.when_it, en.when || e.when_it);
    const place = lang === 'en' && en.place ? en.place : e.place;
    const blocks = lang === 'it' ? e.blocks_it : (en.blocks || []);
    const text = blocks.map(([tag, s]) => (tag.startsWith('h') ? `<h2 class="h-sub">${esc(s)}</h2>` : `<p>${linkify(s)}</p>`)).join('');
    const vids = e.videos.map((v) => (v.yt
      ? `<div class="video yt" data-yt="${v.yt}"><button type="button" class="yt-play"><img src="/media/video/yt-${v.yt}.jpg" alt="" loading="lazy"><span>${L(lang, 'Guarda il video su YouTube', 'Watch the video on YouTube')}</span></button></div>`
      : `<div class="video"><video controls preload="none" playsinline poster="/media/video/${v.src}.jpg"><source src="/media/video/${v.src}.mp4" type="video/mp4"></video></div>`)).join('');
    const gal = e.images.map((f, i) => `<a href="${full(f)}" class="g-item" data-i="${i}"><img src="${thumb(f)}" alt="${esc(title)} – ${L(lang, 'foto', 'photo')} ${i + 1}" loading="lazy" width="640" height="427"></a>`).join('');
    const idx = eventi.indexOf(e);
    const prev = eventi[idx + 1]; const next = eventi[idx - 1];
    const navLink = (x, cls, lbl) => (x ? `<a class="${cls}" href="${u(lang, '/eventi/', '/en/events/')}${x.slug}"><span>${lbl}</span>${esc(L(lang, x.title_it, x.title_en))}</a>` : '<span></span>');
    const cover = e.images[0] ? full(e.images[0]) : (e.videos[0]?.src ? `/media/video/${e.videos[0].src}.jpg` : '/media/brand/eventi.webp');
    const firstP = blocks.find((b) => b[0] === 'p');
    const desc = (firstP ? firstP[1].replace(/\n/g, ' ') : L(lang, `${title}: foto e video dell’evento del Porsche Club Trinacria, ${when}, ${place}.`, `${title}: photos and videos from the Porsche Club Trinacria event, ${when}, ${place}.`)).slice(0, 155);
    const body = `
<article>
<section class="page-hero ev-hero">
  <img src="${cover}" alt="" class="ph-bg" fetchpriority="high">
  <div class="wrap ph-in">
    <a class="back" href="${u(lang, '/eventi', '/en/events')}">${t.back}</a>
    <p class="kicker"><time datetime="${e.date}">${esc(when)}</time> · ${esc(place)}</p>
    <h1>${esc(title)}</h1>
  </div>
</section>
<section class="section">
  <div class="wrap narrow">
    ${text ? `<div class="prose">${text}</div>` : ''}
    ${lang === 'en' && e.blocks_it.length && !blocks.length ? '' : ''}
  </div>
  ${vids ? `<div class="wrap"><h2 class="h-sec">${t.videos}</h2><div class="videos">${vids}</div></div>` : ''}
  ${gal ? `<div class="wrap"><h2 class="h-sec">${t.gallery} <small>${t.photosN(e.images.length)}</small></h2><div class="gallery">${gal}</div></div>` : ''}
  <div class="wrap ev-nav">${navLink(prev, 'ev-prev', L(lang, '← Evento precedente', '← Previous event'))}${navLink(next, 'ev-next', L(lang, 'Evento successivo →', 'Next event →'))}</div>
</section>
</article>`;
    const jsonld = { '@context': 'https://schema.org', '@type': 'Article', headline: title, datePublished: e.date, image: [ctx.BASE + cover], author: { '@type': 'Organization', name: 'Porsche Club Trinacria' }, publisher: { '@type': 'Organization', name: 'Porsche Club Trinacria', logo: { '@type': 'ImageObject', url: ctx.BASE + '/media/brand/logo-full.png' } } };
    return { url: `${u(lang, '/eventi/', '/en/events/')}${e.slug}`, title: `${title} – ${when}`, desc, body, image: cover, jsonld };
  }

  // ---------------- CALENDARIO ----------------
  function calendar(lang) {
    const body = `${pageHero('/media/brand/taycan.webp', L(lang, `Calendario eventi ${cal.anno}`, `${cal.anno} event calendar`), L(lang, `Il ${cal.anno} del Club`, `The Club’s ${cal.anno}`), L(lang, 'Tutti gli appuntamenti dell’anno, dalla Sicilia alla Costa Azzurra.', 'Every date of the year, from Sicily to the French Riviera.'))}
<section class="section">
  <div class="wrap narrow">
    <ol class="cal-list cal-full">${calRows(lang)}</ol>
    <p class="note">${L(lang, 'Il programma potrà subire variazioni di data, spostamenti e/o cancellazioni degli eventi.', 'Dates may change and events may be moved or cancelled.')}</p>
    <p><a class="btn btn-line" href="${cal.pdf}" target="_blank" rel="noopener">${L(lang, 'Scarica il calendario (PDF)', 'Download the calendar (PDF, Italian)')}</a></p>
  </div>
</section>`;
    return { url: u(lang, '/calendario', '/en/calendar'), title: L(lang, `Calendario eventi ${cal.anno}`, `${cal.anno} event calendar`), desc: L(lang, `Calendario ${cal.anno} del Porsche Club Trinacria: tour in Sicilia, Malta, Lampedusa, Paradis Porsche e Conviviale di fine anno.`, `Porsche Club Trinacria ${cal.anno} calendar: tours in Sicily, Malta, Lampedusa, Paradis Porsche and the year-end gala dinner.`), body, image: '/media/brand/taycan.webp' };
  }

  // ---------------- DIVENTA SOCIO ----------------
  function membership(lang) {
    const body = `${pageHero('/media/brand/socio.webp', L(lang, 'Unisciti a noi', 'Join us'), L(lang, 'Diventa socio', 'Become a member'), L(lang, 'Entra a far parte di una comunità di appassionati di Porsche.', 'Become part of a community of Porsche enthusiasts.'))}
<section class="section">
  <div class="wrap split">
    <div class="prose">
      <h2>${L(lang, 'I vantaggi', 'Benefits')}</h2>
      <ul class="ticks">
        <li>${L(lang, 'Accesso esclusivo e prioritario ai nostri eventi', 'Exclusive, priority access to our events')}</li>
        <li>${L(lang, 'Sconti su prodotti e servizi presso partner selezionati', 'Discounts on products and services with selected partners')}</li>
        <li>${L(lang, 'Raduni regionali e nazionali, track day, cene sociali e viaggi', 'Regional and national meets, track days, social dinners and trips')}</li>
        <li>${L(lang, 'E molto altro!', 'And much more!')}</li>
      </ul>
      <p>${L(lang, 'Per iscriversi basta compilare il modulo di adesione e seguire le istruzioni per il pagamento della quota annuale. Non vediamo l’ora di darti il benvenuto nel nostro club e condividere un sacco di emozioni!', 'To join, simply fill in the membership form and follow the instructions to pay the annual fee. We look forward to welcoming you to our club and sharing plenty of emotions together!')}</p>
    </div>
    <div class="steps">
      <div class="quota"><span>${L(lang, 'Quota sociale annuale', 'Annual membership fee')}</span><strong>€ ${club.quota}</strong></div>
      <ol>
        <li><strong>${L(lang, 'Scarica il modulo', 'Download the form')}</strong>${L(lang, 'Domanda di iscrizione 2026 (PDF).', '2026 membership application (PDF, Italian).')}</li>
        <li><strong>${L(lang, 'Compila e firma', 'Fill in and sign')}</strong>${L(lang, 'Indica i tuoi dati e quelli della tua Porsche.', 'Add your details and those of your Porsche.')}</li>
        <li><strong>${L(lang, 'Versa la quota', 'Pay the fee')}</strong>${L(lang, 'Le modalità di pagamento sono indicate nel modulo.', 'Payment details are on the form.')}</li>
        <li><strong>${L(lang, 'Invia tutto', 'Send it to us')}</strong>${L(lang, `Spedisci il modulo a <a href="mailto:${club.email}">${club.email}</a>.`, `Email the form to <a href="mailto:${club.email}">${club.email}</a>.`)}</li>
      </ol>
      <div class="cta-row">
        <a class="btn btn-red" href="/media/domanda-iscrizione-2026.pdf" target="_blank" rel="noopener">${L(lang, 'Scarica il modulo di iscrizione', 'Download the membership form')}</a>
        <a class="btn btn-line" href="/media/statuto-2025.pdf" target="_blank" rel="noopener">${L(lang, 'Leggi lo statuto', 'Read the statute')}</a>
      </div>
    </div>
  </div>
</section>`;
    return { url: u(lang, '/diventa-socio', '/en/membership'), title: L(lang, 'Diventa socio – Iscrizione al Club', 'Become a member – Join the Club'), desc: L(lang, 'Come iscriversi al Porsche Club Trinacria: vantaggi per i soci, quota annuale, modulo di iscrizione 2026 e statuto.', 'How to join Porsche Club Trinacria: member benefits, annual fee, 2026 membership form and statute.'), body, image: '/media/brand/socio.webp' };
  }

  // ---------------- FAQ ----------------
  const FAQ = {
    it: [
      ['Cosa è il Porsche Club Trinacria?', 'Il Porsche Club Trinacria è un club esclusivo dedicato agli appassionati delle automobili Porsche in Sicilia. Fondato con l’obiettivo di promuovere la passione per queste vetture iconiche, il club organizza eventi, raduni e offre vantaggi esclusivi ai suoi soci.'],
      ['Come posso diventare socio del Porsche Club Trinacria?', 'Per diventare socio del Porsche Club Trinacria, è sufficiente compilare il modulo di adesione sul nostro sito web e seguire le istruzioni per il pagamento della quota annuale. Una volta iscritti, avrete accesso a una serie di privilegi, eventi esclusivi e sconti presso i nostri partner.'],
      ['Quali sono i vantaggi di essere socio del Porsche Club Trinacria?', 'Essere socio del Porsche Club Trinacria offre numerosi vantaggi, tra cui l’accesso prioritario agli eventi organizzati dal club, sconti su prodotti e servizi selezionati, partecipazione a raduni esclusivi e molto altro.'],
      ['Quali tipi di eventi organizza il Porsche Club Trinacria?', 'Il Porsche Club Trinacria organizza una varietà di eventi per i suoi soci, tra cui raduni regionali e nazionali, track day in pista, cene sociali, viaggi e molto altro. Restate aggiornati sulla nostra pagina “Eventi” per scoprire cosa abbiamo in programma.'],
      ['Come posso suggerire un’idea per un evento o un’attività al Porsche Club Trinacria?', 'Accogliamo con piacere le idee e i suggerimenti dai nostri soci per nuovi eventi o attività. Puoi inviare le tue proposte al comitato organizzativo del club attraverso il modulo di contatto sul nostro sito web o durante le nostre riunioni periodiche. Siamo sempre aperti a nuove idee per arricchire l’esperienza dei nostri soci.'],
    ],
    en: [
      ['What is Porsche Club Trinacria?', 'Porsche Club Trinacria is an exclusive club for Porsche enthusiasts in Sicily. Founded to promote the passion for these iconic cars, the club organises events and meets and offers exclusive benefits to its members.'],
      ['How can I become a member of Porsche Club Trinacria?', 'To become a member, simply fill in the membership form on our website and follow the instructions to pay the annual fee. Once you join, you’ll have access to a range of privileges, exclusive events and discounts with our partners.'],
      ['What are the benefits of membership?', 'Membership offers many benefits, including priority access to club events, discounts on selected products and services, exclusive meets and much more.'],
      ['What kind of events does the club organise?', 'Porsche Club Trinacria organises a variety of events for its members, including regional and national meets, track days, social dinners, trips and much more. Keep an eye on our “Events” page to see what’s coming up.'],
      ['How can I suggest an idea for an event or activity?', 'We welcome ideas and suggestions from our members for new events or activities. You can send your proposals to the club’s organising committee through the contact form on our website or at our regular meetings. We’re always open to new ideas that enrich our members’ experience.'],
    ],
  };
  function faq(lang) {
    const items = FAQ[lang].map(([q, a]) => `<details class="faq-item"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
    const body = `${pageHero('/media/brand/contatti.webp', 'FAQ', L(lang, 'Domande frequenti', 'Frequently asked questions'), '')}
<section class="section"><div class="wrap narrow">${items}
<p class="faq-more">${L(lang, 'Non trovi la risposta?', 'Can’t find the answer?')} <a href="${u(lang, '/contatti', '/en/contact')}">${L(lang, 'Scrivici', 'Write to us')}</a></p></div></section>`;
    const jsonld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ[lang].map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
    return { url: u(lang, '/faq', '/en/faq'), title: L(lang, 'Domande frequenti', 'Frequently asked questions'), desc: L(lang, 'FAQ sul Porsche Club Trinacria: come diventare socio, vantaggi, tipi di eventi e come proporre nuove attività.', 'FAQ about Porsche Club Trinacria: how to join, benefits, types of events and how to suggest new activities.'), body, jsonld };
  }

  // ---------------- CONTATTI ----------------
  function contact(lang) {
    const body = `${pageHero('/media/brand/contatti.webp', L(lang, 'Contatti', 'Contact'), L(lang, 'Contattaci', 'Contact us'), L(lang, 'Hai domande o desideri ulteriori informazioni sul Porsche Club Trinacria? Siamo qui per aiutarti!', 'Do you have questions or want more information about Porsche Club Trinacria? We’re here to help!'))}
<section class="section">
  <div class="wrap split">
    <div class="contact-info">
      <dl>
        <dt>${L(lang, 'Telefono', 'Phone')}</dt><dd><a href="tel:${club.telLink}">${esc(club.tel)}</a></dd>
        <dt>Email</dt><dd><a href="mailto:${club.email}">${club.email}</a></dd>
        <dt>${L(lang, 'Indirizzo', 'Address')}</dt><dd>${esc(club.indirizzo)}<br><a href="${club.maps}" target="_blank" rel="noopener">${L(lang, 'Apri in Google Maps', 'Open in Google Maps')} ↗</a></dd>
        <dt>${L(lang, 'Foto e video', 'Photos & videos')}</dt><dd><a href="${club.facebookFoto}" target="_blank" rel="noopener">Facebook ↗</a></dd>
      </dl>
      <div class="cta-row">
        <a class="btn btn-line" href="/media/domanda-iscrizione-2026.pdf" target="_blank" rel="noopener">${L(lang, 'Scarica il modulo di iscrizione', 'Download the membership form')}</a>
        <a class="btn btn-line" href="/media/statuto-2025.pdf" target="_blank" rel="noopener">${L(lang, 'Visualizza il nostro statuto', 'View our statute')}</a>
      </div>
    </div>
    <form class="form" id="contact-form" novalidate data-lang="${lang}">
      <p>${L(lang, 'Compila il modulo di contatto. Ti risponderemo il prima possibile. Grazie!', 'Fill in the contact form and we’ll get back to you as soon as possible. Thank you!')}</p>
      <label>${L(lang, 'Nome e Cognome', 'Full name')} *<input name="nome" required maxlength="120" autocomplete="name"></label>
      <div class="row2">
        <label>${L(lang, 'Cellulare', 'Mobile')}<input name="telefono" type="tel" maxlength="40" autocomplete="tel"></label>
        <label>${L(lang, 'La tua Email', 'Your email')} *<input name="email" type="email" required maxlength="160" autocomplete="email"></label>
      </div>
      <label>${L(lang, 'Messaggio', 'Message')} *<textarea name="messaggio" required rows="6" maxlength="4000"></textarea></label>
      <label class="hp" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
      <label class="check"><input type="checkbox" name="privacy" required> <span>${L(lang, `Ho letto l’<a href="/privacy-policy" target="_blank">informativa privacy</a> e acconsento al trattamento dei miei dati per ricevere una risposta.`, `I have read the <a href="/en/privacy-policy" target="_blank">privacy policy</a> and consent to the processing of my data in order to receive a reply.`)} *</span></label>
      <button class="btn btn-red" type="submit">${L(lang, 'Invia', 'Send')}</button>
      <p class="form-msg" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>`;
    return { url: u(lang, '/contatti', '/en/contact'), title: L(lang, 'Contatti', 'Contact'), desc: L(lang, 'Contatta il Porsche Club Trinacria: telefono, email, sede a Palermo in Via San Lorenzo 306 e modulo di contatto.', 'Contact Porsche Club Trinacria: phone, email, Palermo office at Via San Lorenzo 306 and contact form.'), body, image: '/media/brand/contatti.webp' };
  }

  // ---------------- SUGGERIMENTI ----------------
  const SUGG = {
    it: ['Il Club Porsche Trinacria non è un semplice gruppo di appassionati: è una squadra vera. Chi entra qui non trova un parcheggio di auto sportive, ma una comunità che vive la passione per il marchio Porsche con concretezza, voglia di fare e rispetto reciproco. Le auto sono il punto di partenza, non il punto di arrivo. Il cuore del Club sono le persone: la loro storia, le loro competenze, le loro idee. Per questo chiediamo a ogni socio di essere parte attiva, perché un club che non coinvolge i propri membri si spegne. Noi non abbiamo intenzione di spegnerci.',
      'La Sicilia ci offre strade, panorami, tradizioni, eventi e un’identità forte. Abbiamo la fortuna di vivere in un territorio che si presta perfettamente alla nostra passione. Per questo il Club Porsche Trinacria vuole crescere, diventare un riferimento, creare iniziative di livello e consolidare una rete di persone motivate. Non importa se hai un’idea piccola o un progetto ambizioso. Qui ogni proposta viene valutata senza pregiudizi. Raduni, tour gastronomici, attività sportive, eventi benefici, collaborazioni con aziende locali, formazione, incontri tecnici, workshop sulla cura dell’auto, momenti sociali dedicati alla famiglia… tutto può diventare un tassello della nostra identità, a patto che ci sia la volontà di mettersi in gioco.',
      'La nuova sezione del sito nasce proprio con questo obiettivo: dare spazio ai soci. Uno spazio dove chiunque può proporre un’iniziativa, raccontare un’esperienza, suggerire un percorso, proporre una collaborazione, offrire competenze o semplicemente lanciare un’idea che potrebbe trasformarsi in un evento ufficiale. Nessuno meglio dei soci conosce lo spirito del Club e sa cosa può renderlo più forte.',
      'Vogliamo un Club in movimento. Un Club che non aspetta l’evento successivo, ma lo costruisce insieme. Le Porsche sono macchine nate per essere guidate, non per restare ferme. Il Club non deve essere diverso. Un club attivo genera entusiasmo, nuovi membri, visibilità e opportunità. Rimane vivo.',
      'Chi entra nel Porsche Trinacria entra in una famiglia automobilistica che non gioca a metà. Ci piace fare le cose per bene, con serietà quando serve e con la giusta leggerezza quando possibile. Nessuno deve sentirsi fuori posto. Il Club non è fatto solo per chi ha esperienza, per chi è un tecnico o per chi guida da vent’anni. È fatto per chi ha passione. Il resto si costruisce.',
      'Se hai un’idea, proponila. Se vuoi organizzare un’attività, diccelo. Se hai competenze utili, mettile sul tavolo. Se vuoi semplicemente partecipare, fallo con convinzione. Questa sezione è tua. Usala. Porta dentro la tua energia. La strada la facciamo insieme.'],
    en: ['Porsche Club Trinacria is not just a group of enthusiasts: it’s a real team. Whoever joins doesn’t find a car park full of sports cars, but a community that lives its passion for Porsche with commitment, drive and mutual respect. The cars are the starting point, not the destination. The heart of the Club is its people: their stories, skills and ideas. That’s why we ask every member to play an active part, because a club that doesn’t involve its members fades away. We have no intention of fading away.',
      'Sicily gives us roads, views, traditions, events and a strong identity. We’re lucky to live in a land that suits our passion perfectly. That’s why Porsche Club Trinacria wants to grow, become a point of reference, create high-quality initiatives and build a network of motivated people. Whether your idea is small or ambitious, every proposal is considered without prejudice. Meets, food tours, sports activities, charity events, partnerships with local businesses, training, technical meetings, car-care workshops, family social events… anything can become part of our identity, as long as there’s a willingness to get involved.',
      'This section of the website was created exactly for that: to give members a voice. A space where anyone can propose an initiative, share an experience, suggest a route, propose a partnership, offer skills or simply float an idea that could become an official event. Nobody knows the spirit of the Club and what can make it stronger better than its members.',
      'We want a Club on the move. A Club that doesn’t wait for the next event, but builds it together. Porsches are made to be driven, not to sit still. The Club should be no different. An active club generates enthusiasm, new members, visibility and opportunities. It stays alive.',
      'Joining Porsche Trinacria means joining a motoring family that doesn’t do things by halves. We like to do things properly, seriously when needed and light-heartedly when possible. Nobody should feel out of place. The Club isn’t only for the experienced, the technically minded or those who’ve been driving for twenty years. It’s for anyone with passion. The rest we build together.',
      'If you have an idea, propose it. If you want to organise an activity, tell us. If you have useful skills, put them on the table. If you simply want to take part, do it wholeheartedly. This section is yours. Use it. Bring your energy. We drive the road together.'],
  };
  function suggestions(lang) {
    const body = `${pageHero('/media/brand/gt3.webp', L(lang, 'Suggerimenti', 'Suggestions'), L(lang, 'La strada la facciamo insieme', 'We drive the road together'), L(lang, 'Uno spazio per le idee e le proposte dei soci.', 'A space for members’ ideas and proposals.'))}
<section class="section"><div class="wrap narrow prose">
${SUGG[lang].map((p) => `<p>${esc(p)}</p>`).join('')}
<div class="callout">
  <p>${L(lang, 'Manda una mail a:', 'Send an email to:')}</p>
  <p class="big"><a href="mailto:${club.emailSegreteria}">${club.emailSegreteria}</a></p>
  <p>${L(lang, 'con il tuo nome, un recapito e una breve descrizione dell’idea. Ogni proposta verrà letta e valutata: da qui partono i prossimi eventi del Club.', 'with your name, a contact and a short description of your idea. Every proposal will be read and considered: this is where the Club’s next events begin.')}</p>
</div>
</div></section>`;
    return { url: u(lang, '/suggerimenti', '/en/suggestions'), title: L(lang, 'Suggerimenti dei soci', 'Members’ suggestions'), desc: L(lang, 'Proponi un’idea al Porsche Club Trinacria: raduni, tour, collaborazioni, workshop. Ogni proposta dei soci viene letta e valutata.', 'Suggest an idea to Porsche Club Trinacria: meets, tours, partnerships, workshops. Every member’s proposal is read and considered.'), body, image: '/media/brand/gt3.webp' };
  }

  // ---------------- LEGALI ----------------
  function privacy(lang) {
    const it = `
<h2>Titolare del trattamento</h2>
<p>${esc(club.ragioneSociale)}, ${esc(club.indirizzo)}, C.F. ${club.cf}. Email: <a href="mailto:${club.email}">${club.email}</a>, tel. ${esc(club.tel)}.</p>
<h2>Dati trattati e finalità</h2>
<p><strong>Modulo di contatto</strong>: nome, email, telefono (facoltativo) e testo del messaggio, trattati per rispondere alla tua richiesta. Base giuridica: misure precontrattuali / richiesta dell’interessato e consenso (art. 6.1 lett. a e b GDPR). I dati vengono inviati via email alla casella del Club e non sono usati per finalità di marketing.</p>
<p><strong>Iscrizione al Club</strong>: i dati indicati nella domanda di iscrizione sono trattati per la gestione del rapporto associativo, secondo lo statuto e gli obblighi di legge.</p>
<p><strong>Dati di navigazione</strong>: il server registra in forma tecnica indirizzo IP, data/ora e risorsa richiesta, per sicurezza e funzionamento del sito (legittimo interesse, art. 6.1 lett. f). I log sono conservati per un periodo limitato.</p>
<p><strong>Statistiche</strong>: solo con il tuo consenso usiamo Google Analytics 4 con IP anonimizzato (vedi <a href="/cookie-policy">Cookie policy</a>).</p>
<h2>Conservazione</h2>
<p>I messaggi ricevuti tramite il modulo sono conservati per il tempo necessario a gestire la richiesta e comunque non oltre 24 mesi.</p>
<h2>Destinatari e trasferimenti</h2>
<p>I dati sono trattati da fornitori tecnici che agiscono come responsabili del trattamento: hosting (Railway, server in UE), invio email transazionali (Brevo, UE), casella email del Club (Google), e, previo consenso, Google Analytics. Eventuali trasferimenti extra-UE avvengono sulla base del Data Privacy Framework UE-USA o di clausole contrattuali standard.</p>
<h2>I tuoi diritti</h2>
<p>Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità, opporti al trattamento e revocare il consenso in qualsiasi momento scrivendo a <a href="mailto:${club.email}">${club.email}</a>. Hai diritto di proporre reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener">garanteprivacy.it</a>).</p>
<p class="note">Ultimo aggiornamento: novembre 2026.</p>`;
    const en = `
<h2>Data controller</h2>
<p>${esc(club.ragioneSociale)}, ${esc(club.indirizzo)}, Italy, tax code ${club.cf}. Email: <a href="mailto:${club.email}">${club.email}</a>, phone ${esc(club.tel)}.</p>
<h2>Data processed and purposes</h2>
<p><strong>Contact form</strong>: name, email, phone (optional) and message, processed to reply to your request. Legal basis: your request and consent (Art. 6(1)(a) and (b) GDPR). Data are emailed to the Club’s mailbox and are not used for marketing.</p>
<p><strong>Club membership</strong>: data provided in the membership application are processed to manage the membership in accordance with the statute and legal obligations.</p>
<p><strong>Browsing data</strong>: the server technically logs IP address, date/time and requested resource for security and operation of the website (legitimate interest, Art. 6(1)(f)). Logs are kept for a limited time.</p>
<p><strong>Analytics</strong>: only with your consent we use Google Analytics 4 with anonymised IP (see the <a href="/en/cookie-policy">Cookie policy</a>).</p>
<h2>Retention</h2>
<p>Messages received through the form are kept as long as needed to handle the request and in any case no longer than 24 months.</p>
<h2>Recipients and transfers</h2>
<p>Data are processed by technical providers acting as processors: hosting (Railway, EU servers), transactional email (Brevo, EU), the Club’s mailbox (Google) and, with consent, Google Analytics. Any transfers outside the EU rely on the EU-US Data Privacy Framework or standard contractual clauses.</p>
<h2>Your rights</h2>
<p>You may request access, rectification, erasure, restriction, portability, object to processing and withdraw consent at any time by writing to <a href="mailto:${club.email}">${club.email}</a>. You may lodge a complaint with the Italian Data Protection Authority (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener">garanteprivacy.it</a>).</p>
<p class="note">Last updated: November 2026.</p>`;
    return { url: u(lang, '/privacy-policy', '/en/privacy-policy'), title: 'Privacy policy', desc: L(lang, 'Informativa privacy del sito del Porsche Club Trinacria ai sensi del Regolamento UE 2016/679 (GDPR).', 'Privacy policy of the Porsche Club Trinacria website under EU Regulation 2016/679 (GDPR).'), body: `<section class="section legal"><div class="wrap narrow prose"><h1>${L(lang, 'Informativa privacy', 'Privacy policy')}</h1>${L(lang, it, en)}</div></section>` };
  }

  function cookies(lang) {
    const it = `
<p>Questo sito usa cookie e strumenti analoghi secondo le Linee guida del Garante del 10 giugno 2021.</p>
<h2>Cookie tecnici (sempre attivi)</h2>
<p>Memorizzano la tua scelta sui cookie (localStorage, chiave <code>pct_cookie_consent_v1</code>, durata 6 mesi). Non richiedono consenso.</p>
<h2>Cookie statistici (solo con consenso)</h2>
<p>Google Analytics 4 (Google Ireland Ltd) con IP anonimizzato, per statistiche aggregate di visita. Viene caricato solo se accetti; cookie <code>_ga</code> e <code>_ga_*</code>, durata fino a 14 mesi.</p>
<h2>Contenuti di terze parti</h2>
<p>I video YouTube vengono caricati (in modalità privacy avanzata, youtube-nocookie.com) solo quando premi il pulsante di riproduzione. I link a Facebook e Google Maps aprono siti esterni con le loro policy.</p>
<h2>Gestire le preferenze</h2>
<p>Puoi cambiare idea in qualsiasi momento: <a href="#" data-cookie-settings>gestisci cookie</a>. Puoi anche cancellare i cookie dalle impostazioni del browser.</p>
<p>Per il resto del trattamento vedi la <a href="/privacy-policy">Privacy policy</a>.</p>`;
    const en = `
<p>This website uses cookies and similar tools in line with the Italian Data Protection Authority guidelines of 10 June 2021.</p>
<h2>Technical cookies (always active)</h2>
<p>They store your cookie choice (localStorage, key <code>pct_cookie_consent_v1</code>, 6 months). No consent required.</p>
<h2>Analytics cookies (consent only)</h2>
<p>Google Analytics 4 (Google Ireland Ltd) with anonymised IP, for aggregated visit statistics. Loaded only if you accept; cookies <code>_ga</code> and <code>_ga_*</code>, up to 14 months.</p>
<h2>Third-party content</h2>
<p>YouTube videos load (privacy-enhanced mode, youtube-nocookie.com) only when you press play. Links to Facebook and Google Maps open external websites with their own policies.</p>
<h2>Managing preferences</h2>
<p>You can change your mind at any time: <a href="#" data-cookie-settings>manage cookies</a>. You can also delete cookies in your browser settings.</p>
<p>For everything else see the <a href="/en/privacy-policy">Privacy policy</a>.</p>`;
    return { url: u(lang, '/cookie-policy', '/en/cookie-policy'), title: 'Cookie policy', desc: L(lang, 'Cookie policy del sito del Porsche Club Trinacria: cookie tecnici, statistici con consenso e gestione delle preferenze.', 'Cookie policy of the Porsche Club Trinacria website: technical cookies, analytics with consent and preference management.'), body: `<section class="section legal"><div class="wrap narrow prose"><h1>Cookie policy</h1>${L(lang, it, en)}</div></section>` };
  }

  function credits(lang) {
    const rows = club.crediti.map(([f, n, user, id]) => `<li><img src="/media/brand/${f}" alt="" loading="lazy" width="160" height="107"><span>${L(lang, 'Foto di', 'Photo by')} <a href="https://unsplash.com/@${user}" target="_blank" rel="noopener">${esc(n)}</a> ${L(lang, 'su', 'on')} <a href="https://unsplash.com/photos/${id}" target="_blank" rel="noopener">Unsplash</a></span></li>`).join('');
    return { url: u(lang, '/crediti', '/en/credits'), title: L(lang, 'Crediti fotografici', 'Photo credits'), desc: L(lang, 'Crediti delle immagini usate nel sito del Porsche Club Trinacria.', 'Credits for the images used on the Porsche Club Trinacria website.'), body: `<section class="section legal"><div class="wrap narrow prose"><h1>${L(lang, 'Crediti fotografici', 'Photo credits')}</h1><p>${L(lang, 'Le foto degli eventi sono dei soci del Porsche Club Trinacria. Le immagini di sezione sono pubblicate con licenza Unsplash:', 'Event photos belong to Porsche Club Trinacria members. Section images are used under the Unsplash licence:')}</p><ul class="credits">${rows}</ul></div></section>` };
  }

  function notFound() {
    return `${pageHero('/media/brand/news.webp', '404', 'Pagina non trovata', 'La pagina che cerchi non esiste o è stata spostata. / This page doesn’t exist or has moved.')}
<section class="section"><div class="wrap narrow cta-row"><a class="btn btn-red" href="/">Home</a><a class="btn btn-line" href="/eventi">Eventi</a><a class="btn btn-line" href="/en/">English</a></div></section>`;
  }

  return {
    pages: (lang) => [home, about, events, calendar, membership, faq, contact, suggestions, privacy, cookies, credits].map((f) => f(lang)),
    eventPage, notFound,
  };
};
