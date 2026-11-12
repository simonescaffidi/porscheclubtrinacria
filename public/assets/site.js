// Menu mobile, header, calendario, lightbox, video YouTube su click, form contatti, animazioni
(function () {
  var en = document.documentElement.lang === 'en';
  document.addEventListener('DOMContentLoaded', function () {
    // menu
    var burger = document.querySelector('.burger'), nav = document.getElementById('main-nav');
    if (burger) burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', open);
    });
    // header trasparente solo in cima alla home
    var header = document.querySelector('.site-header');
    var onScroll = function () { header.classList.toggle('solid', window.scrollY > 40); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

    // calendario: segna eventi passati, nella home mostra solo i prossimi
    var oggi = new Date(); oggi.setHours(0, 0, 0, 0);
    document.querySelectorAll('.cal-list').forEach(function (list) {
      var limit = +list.getAttribute('data-limit') || 0, shown = 0;
      list.querySelectorAll('.cal-item').forEach(function (li) {
        var fine = new Date(li.getAttribute('data-end') + 'T23:59:59');
        var passato = fine < oggi;
        if (limit) {
          if (passato || li.classList.contains('pausa') || shown >= limit) li.remove(); else shown++;
        } else if (passato) li.classList.add('passato');
      });
      if (limit && !shown) list.insertAdjacentHTML('beforeend', '<li class="cal-empty">' + (en ? 'The new calendar is coming soon.' : 'Il nuovo calendario è in arrivo.') + '</li>');
    });

    // galleria: anteprima nella pagina, tutte le foto nel visualizzatore interno
    var preview = document.querySelector('.preview');
    var lb = document.getElementById('lightbox');
    if (preview && lb) {
      var foto = JSON.parse(preview.getAttribute('data-photos'));
      var titolo = preview.getAttribute('data-title');
      var img = lb.querySelector('.lb-stage img'), count = lb.querySelector('.lb-count'), strip = lb.querySelector('.lb-strip'), cur = 0, ultimoFocus = null;
      lb.querySelector('.lb-title').textContent = titolo;
      var stripPronta = false;
      var preparaStrip = function () {
        if (stripPronta) return; stripPronta = true;
        strip.innerHTML = foto.map(function (f, i) { return '<button type="button" data-i="' + i + '"><img src="' + f[0] + '" alt="" loading="lazy"></button>'; }).join('');
        strip.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) show(+b.getAttribute('data-i')); });
      };
      var precarica = function (i) { var k = (i + foto.length) % foto.length; var p = new Image(); p.src = foto[k][1]; };
      var show = function (i) {
        cur = (i + foto.length) % foto.length;
        img.src = foto[cur][1]; img.alt = titolo + ' – ' + (cur + 1);
        count.textContent = (cur + 1) + ' / ' + foto.length;
        strip.querySelectorAll('button').forEach(function (b, k) { b.classList.toggle('on', k === cur); });
        var on = strip.children[cur]; if (on) on.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        precarica(cur + 1); precarica(cur - 1);
      };
      var apri = function (i) { ultimoFocus = document.activeElement; preparaStrip(); lb.hidden = false; document.body.style.overflow = 'hidden'; show(i); lb.querySelector('.lb-close').focus(); };
      var chiudi = function () { lb.hidden = true; document.body.style.overflow = ''; if (ultimoFocus) ultimoFocus.focus(); };
      document.querySelectorAll('.pv-item, .pv-all').forEach(function (b) { b.addEventListener('click', function () { apri(+b.getAttribute('data-i')); }); });
      lb.querySelector('.lb-close').onclick = chiudi;
      lb.querySelector('.lb-prev').onclick = function () { show(cur - 1); };
      lb.querySelector('.lb-next').onclick = function () { show(cur + 1); };
      lb.querySelector('.lb-stage').addEventListener('click', function (e) { if (e.target === this) chiudi(); });
      document.addEventListener('keydown', function (e) {
        if (lb.hidden) return;
        if (e.key === 'Escape') chiudi(); else if (e.key === 'ArrowLeft') show(cur - 1); else if (e.key === 'ArrowRight') show(cur + 1);
      });
      var x0 = null;
      img.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      img.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); x0 = null; });
    }

    // YouTube: caricato solo al click (youtube-nocookie)
    document.querySelectorAll('.video.yt').forEach(function (v) {
      v.querySelector('button').addEventListener('click', function () {
        v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + v.getAttribute('data-yt') + '?autoplay=1" title="YouTube" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      });
    });

    // form contatti
    var form = document.getElementById('contact-form');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.form-msg'), btn = form.querySelector('button[type=submit]');
      msg.className = 'form-msg';
      if (!form.checkValidity()) { msg.classList.add('err'); msg.textContent = en ? 'Please fill in the required fields and accept the privacy policy.' : 'Compila i campi obbligatori e accetta l’informativa privacy.'; form.reportValidity(); return; }
      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; }); data.privacy = !!form.privacy.checked; data.lang = en ? 'en' : 'it';
      btn.disabled = true;
      fetch('/api/contatti', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (res.ok) { form.reset(); msg.classList.add('ok'); msg.textContent = en ? 'Thank you! Your message has been sent. We’ll reply as soon as possible.' : 'Grazie! Messaggio inviato. Ti risponderemo il prima possibile.'; }
          else { msg.classList.add('err'); msg.textContent = (res.j && res.j.errore) || (en ? 'Sending failed. Please email us directly.' : 'Invio non riuscito. Scrivici direttamente via email.'); }
        })
        .catch(function () { msg.classList.add('err'); msg.textContent = en ? 'Network error. Please try again.' : 'Errore di rete. Riprova.'; })
        .finally(function () { btn.disabled = false; });
    });

    // animazioni ingresso
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
      document.querySelectorAll('.section h2, .feature-txt, .card, .people li, .cal-item, .partner-txt, .band-in').forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
    }
  });
})();
