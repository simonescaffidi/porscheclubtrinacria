// Consenso cookie (Linee guida Garante 10/6/2021): Accetta / Rifiuta / Personalizza, X = rifiuta, scadenza 6 mesi.
// Google Analytics 4 viene caricato SOLO dopo consenso statistico.
(function () {
  var KEY = 'pct_cookie_consent_v1';
  var DURATA = 182 * 24 * 3600 * 1000;
  var GA_ID = document.documentElement.getAttribute('data-ga4') || '';
  var en = document.documentElement.lang === 'en';
  var T = en
    ? { msg: 'We use technical cookies and, only with your consent, analytics cookies.', cp: 'Cookie policy', rej: 'Reject', cus: 'Customize', acc: 'Accept all', save: 'Save choices', nec: 'Technical (always active)', sta: 'Analytics (Google Analytics 4)', x: 'Close and reject', pre: '/en/' }
    : { msg: 'Usiamo cookie tecnici e, solo con il tuo consenso, cookie statistici.', cp: 'Cookie policy', rej: 'Rifiuta', cus: 'Personalizza', acc: 'Accetta tutti', save: 'Salva le scelte', nec: 'Tecnici (sempre attivi)', sta: 'Statistici (Google Analytics 4)', x: 'Chiudi e rifiuta', pre: '/' };

  function get() {
    try { var c = JSON.parse(localStorage.getItem(KEY)); if (c && c.ts && Date.now() - new Date(c.ts).getTime() < DURATA) return c; } catch (e) {}
    return null;
  }
  function loadGA() {
    if (!GA_ID || !/^G-[A-Z0-9]+$/.test(GA_ID) || window.__ga) return;
    window.__ga = true;
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', GA_ID, { anonymize_ip: true });
  }
  function apply(c) { if (c && c.statistics) loadGA(); }
  function set(c) { c.ts = new Date().toISOString(); try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} document.getElementById('cookie-banner').style.display = 'none'; apply(c); }

  document.addEventListener('DOMContentLoaded', function () {
    var b = document.createElement('div'); b.id = 'cookie-banner'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Cookie');
    b.innerHTML = '<button class="x" id="cb-x" aria-label="' + T.x + '">×</button><div class="row"><p>' + T.msg + ' <a href="' + T.pre + 'cookie-policy">' + T.cp + '</a></p>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><button id="cb-rej">' + T.rej + '</button><button id="cb-cus" aria-expanded="false">' + T.cus + '</button><button id="cb-acc" class="primary">' + T.acc + '</button></div></div>' +
      '<div id="cookie-prefs"><label><input type="checkbox" checked disabled> ' + T.nec + '</label><label><input type="checkbox" id="cb-sta"> ' + T.sta + '</label><button id="cb-save" class="primary">' + T.save + '</button></div>';
    document.body.appendChild(b);
    var c = get(); if (!c) b.style.display = 'block'; else apply(c);
    document.getElementById('cb-acc').onclick = function () { set({ necessary: true, statistics: true }); };
    document.getElementById('cb-rej').onclick = document.getElementById('cb-x').onclick = function () { set({ necessary: true, statistics: false }); };
    document.getElementById('cb-cus').onclick = function () { var p = document.getElementById('cookie-prefs'); var open = p.style.display !== 'block'; p.style.display = open ? 'block' : 'none'; this.setAttribute('aria-expanded', open); };
    document.getElementById('cb-save').onclick = function () { set({ necessary: true, statistics: document.getElementById('cb-sta').checked }); };
    var open = document.querySelectorAll('[data-cookie-settings]');
    for (var i = 0; i < open.length; i++) open[i].addEventListener('click', function (e) { e.preventDefault(); var cur = get(); document.getElementById('cb-sta').checked = !!(cur && cur.statistics); b.style.display = 'block'; document.getElementById('cookie-prefs').style.display = 'block'; });
  });
})();
