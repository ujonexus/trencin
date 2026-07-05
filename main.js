// TRENČÍN — správanie stránky: video podklad, reveal, menu, lightbox
(function () {
  'use strict';

  var obmedzPohyb = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- rok v pätičke ----------
  var rok = document.getElementById('rok');
  if (rok) rok.textContent = new Date().getFullYear();

  // ---------- hlavička pri scrolle ----------
  var hlavicka = document.getElementById('hlavicka');
  function scrollStav() {
    hlavicka.classList.toggle('je-scrollnuta', window.scrollY > 60);
  }
  window.addEventListener('scroll', scrollStav, { passive: true });
  scrollStav();

  // ---------- mobilné menu ----------
  var menuTlacidlo = document.getElementById('menu-tlacidlo');
  var menu = document.getElementById('menu');
  menuTlacidlo.addEventListener('click', function () {
    var otvorene = menu.classList.toggle('je-otvorene');
    menuTlacidlo.setAttribute('aria-expanded', otvorene ? 'true' : 'false');
    menuTlacidlo.setAttribute('aria-label', otvorene ? 'Zavrieť menu' : 'Otvoriť menu');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      menu.classList.remove('je-otvorene');
      menuTlacidlo.setAttribute('aria-expanded', 'false');
    }
  });

  // ---------- video podklad ----------
  // Načíta sa až po window.load, len na väčších obrazovkách,
  // bez šetriča dát a bez obmedzeného pohybu. Inak zostáva poster.
  var video = document.getElementById('podklad-video');
  var spojenie = navigator.connection || {};
  var chceVideo = window.matchMedia('(min-width: 768px)').matches &&
    !obmedzPohyb && !spojenie.saveData;

  if (video && chceVideo) {
    window.addEventListener('load', function () {
      var zdroj = video.querySelector('source');
      zdroj.src = zdroj.dataset.src;
      video.load();
      video.addEventListener('canplay', function () {
        video.play().then(function () {
          video.classList.add('hra');
        }).catch(function () { /* autoplay zablokovaný — zostáva poster */ });
      }, { once: true });
    });
    // šetrenie batérie: pauza keď karta nie je viditeľná
    document.addEventListener('visibilitychange', function () {
      if (!video.classList.contains('hra')) return;
      if (document.hidden) { video.pause(); } else { video.play().catch(function () {}); }
    });
  }

  // ---------- scroll reveal ----------
  var prvky = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !obmedzPohyb) {
    var pozorovatel = new IntersectionObserver(function (zaznamy) {
      var poradie = 0;
      zaznamy.forEach(function (z) {
        if (!z.isIntersecting) return;
        z.target.style.setProperty('--oneskorenie', Math.min(poradie * 0.07, 0.42) + 's');
        z.target.classList.add('je-viditelna');
        pozorovatel.unobserve(z.target);
        poradie++;
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    prvky.forEach(function (p) { pozorovatel.observe(p); });
  } else {
    prvky.forEach(function (p) { p.classList.add('je-viditelna'); });
  }

  // ---------- lightbox ----------
  var fotky = [
    { s: 'assets/img/k_hrad.webp', w: 1600, h: 1066, popis: 'Trenčiansky hrad vo večernom svetle — foto: Ingo Mehling · CC BY-SA 4.0' },
    { s: 'assets/img/k_namestie.webp', w: 1600, h: 1200, popis: 'Mierové námestie a hrad — foto: Palickap · CC BY 4.0' },
    { s: 'assets/img/k_napis.webp', w: 1600, h: 1200, popis: 'Rímsky nápis Laugaricio z roku 179 — voľné dielo' },
    { s: 'assets/img/k_schody.webp', w: 1600, h: 2134, popis: 'Farské schody (1568) — foto: Jan Polák · CC BY-SA 3.0' },
    { s: 'assets/img/g_hrad_vzduch.webp', w: 1600, h: 1200, popis: 'Hrad z vtáčej perspektívy — foto: Parik.zak · CC BY-SA 4.0' },
    { s: 'assets/img/g_matusova_veza.webp', w: 1600, h: 2446, popis: 'Matúšova veža — foto: Scotch Mist · CC BY-SA 4.0' },
    { s: 'assets/img/g_namestie_hrad.webp', w: 1600, h: 1200, popis: 'Mierové námestie pod hradom — foto: Jakub CA · CC BY 4.0' },
    { s: 'assets/img/g_hrad_noc.webp', w: 1600, h: 1200, popis: 'Osvetlený hrad v noci — foto: Marián Hubinský · CC BY-SA 3.0' },
    { s: 'assets/img/g_hradna_vezicka.webp', w: 1600, h: 2406, popis: 'Hradná vežička — foto: Scotch Mist · CC BY-SA 4.0' },
    { s: 'assets/img/g_veza_synagoga.webp', w: 1600, h: 956, popis: 'Mestská veža a synagóga — foto: Krzysztof Golik · CC BY-SA 4.0' },
    { s: 'assets/img/g_hrad_zapad.webp', w: 1600, h: 1066, popis: 'Hrad od juhozápadu — foto: Ingo Mehling · CC BY-SA 4.0' },
    { s: 'assets/img/g_korzo.webp', w: 1600, h: 1200, popis: 'Pešia zóna pri námestí — foto: Akul59 · CC BY-SA 4.0' },
    { s: 'assets/img/g_namestie_ludia.webp', w: 1600, h: 1200, popis: 'Život na Mierovom námestí — foto: Palickap · CC BY 4.0' },
    { s: 'assets/img/g_hrad_strechy.webp', w: 1600, h: 914, popis: 'Hrad nad strechami starého mesta — foto: Scotch Mist · CC BY-SA 4.0' },
    { s: 'assets/img/g_panorama.webp', w: 2200, h: 738, popis: 'Panoráma striech s piaristickým kostolom — foto: Scotch Mist · CC BY-SA 4.0' },
    { s: 'assets/img/g_hrad_lietadlo.webp', w: 1600, h: 1200, popis: 'Hrad z lietadla — foto: Marián Hubinský · CC BY-SA 3.0' }
  ];

  var lightbox = document.getElementById('lightbox');
  var lbObraz = document.getElementById('lightbox-obraz');
  var lbPopis = document.getElementById('lightbox-popis');
  var aktualna = 0;
  var poslednySpustac = null;

  function ukazFotku(i) {
    aktualna = (i + fotky.length) % fotky.length;
    var f = fotky[aktualna];
    lbObraz.src = f.s;
    lbObraz.width = f.w;
    lbObraz.height = f.h;
    lbObraz.alt = f.popis;
    lbPopis.textContent = (aktualna + 1) + ' / ' + fotky.length + ' — ' + f.popis;
  }

  function otvorLightbox(i, spustac) {
    poslednySpustac = spustac || null;
    ukazFotku(i);
    if (typeof lightbox.showModal === 'function') {
      lightbox.showModal();
    } else {
      lightbox.setAttribute('open', '');
    }
  }

  document.querySelectorAll('[data-lightbox]').forEach(function (tlacidlo) {
    tlacidlo.addEventListener('click', function () {
      otvorLightbox(parseInt(tlacidlo.dataset.lightbox, 10), tlacidlo);
    });
  });

  document.getElementById('lightbox-zavriet').addEventListener('click', function () { lightbox.close(); });
  document.getElementById('lightbox-predosla').addEventListener('click', function () { ukazFotku(aktualna - 1); });
  document.getElementById('lightbox-dalsia').addEventListener('click', function () { ukazFotku(aktualna + 1); });

  lightbox.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') ukazFotku(aktualna - 1);
    if (e.key === 'ArrowRight') ukazFotku(aktualna + 1);
  });
  // klik mimo fotky zatvára
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('close', function () {
    lbObraz.src = '';
    if (poslednySpustac) poslednySpustac.focus();
  });
})();
