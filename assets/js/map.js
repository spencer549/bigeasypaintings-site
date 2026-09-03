
(function () {
  'use strict';
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  function init() {
    /* Iterate the MAPS, not one wrapper class. The homepage wraps its map in
       .areamap and the three "Where we work" directions use .wk-map and .wk-wide,
       so a selector on the wrapper found nothing on two of the three and the whole
       behaviour silently did not run. */
    Array.prototype.forEach.call(document.querySelectorAll('svg.mp'), function (svg) {
      var fig = svg.closest('figure') || svg.parentElement;
      if (!fig || svg.getAttribute('data-wired') === 'true') return;
      svg.setAttribute('data-wired', 'true');
      var band = fig.closest('section') || document;

      /* ---- 1. the list and the pins are the same object seen twice ---------- */
      var pins = {};
      Array.prototype.forEach.call(svg.querySelectorAll('.mp-g[data-town]'), function (g) {
        pins[g.getAttribute('data-town')] = g;
      });
      function light(name, on) {
        var g = pins[name];
        if (g) g.classList.toggle('on', !!on);
        Array.prototype.forEach.call(band.querySelectorAll('[data-town-link]'), function (a) {
          if (a.getAttribute('data-town-link') === name) a.classList.toggle('on', !!on);
        });
      }
      Array.prototype.forEach.call(band.querySelectorAll('[data-town-link]'), function (a) {
        var n = a.getAttribute('data-town-link');
        a.addEventListener('mouseenter', function () { light(n, true); });
        a.addEventListener('mouseleave', function () { light(n, false); });
        /* focus, not just hover: the town links are real anchors and a keyboard has to
           reach the same highlight a pointer does */
        a.addEventListener('focus', function () { light(n, true); });
        a.addEventListener('blur', function () { light(n, false); });
      });
      Object.keys(pins).forEach(function (n) {
        var g = pins[n];
        g.addEventListener('mouseenter', function () { light(n, true); });
        g.addEventListener('mouseleave', function () { light(n, false); });
        g.addEventListener('click', function () {
          var a = band.querySelector('[data-town-link="' + n + '"]');
          if (a && a.getAttribute('href')) window.location.href = a.getAttribute('href');
        });
      });

      /* ---- 2. the ground filter -------------------------------------------- */
      var filters = band.querySelectorAll('[data-ground-filter]');
      var active = null;
      Array.prototype.forEach.call(filters, function (b) {
        b.addEventListener('click', function () {
          var k = b.getAttribute('data-ground-filter');
          active = (active === k) ? null : k;
          Array.prototype.forEach.call(filters, function (o) {
            o.setAttribute('aria-pressed',
              o.getAttribute('data-ground-filter') === active ? 'true' : 'false');
          });
          svg.classList.toggle('filtered', !!active);
          Array.prototype.forEach.call(svg.querySelectorAll('.mp-g[data-ground]'), function (g) {
            g.classList.toggle('in', g.getAttribute('data-ground') === active);
          });
          Array.prototype.forEach.call(band.querySelectorAll('[data-ground-of]'), function (el) {
            el.classList.toggle('dim', !!active && el.getAttribute('data-ground-of') !== active);
          });
          var live = band.querySelector('[data-filter-status]');
          if (live) {
            /* Read the label from data-label, not from textContent. Every filter button
               on the fleet carries its town count INSIDE the button, so textContent
               returned "Under the canopy2 towns" and the status line announced
               "2 towns shown, Under the canopy2 towns" to a screen reader. Fixed at the
               component rather than per page, because all three pages that run this map
               had it. textContent stays as the fallback for any button without a label. */
            var name = b.getAttribute('data-label') || b.textContent.trim();
            live.textContent = active
              ? (b.getAttribute('data-count') + ' towns shown, ' + name)
              : 'All ten towns shown.';
          }
        });
      });

      /* ---- 3. ink it in ----------------------------------------------------- */
      var strokes = svg.querySelectorAll('.mp-water,.mp-river,.mp-road');
      Array.prototype.forEach.call(strokes, function (p) {
        var len = 0;
        try { len = p.getTotalLength(); } catch (e) { len = 0; }
        if (!len) return;
        p.style.strokeDasharray = len;
        p.style.setProperty('--len', len);
      });
      fig.setAttribute('data-draw', 'pending');
      var i = 0;
      Array.prototype.forEach.call(svg.querySelectorAll('.mp-g,.mp-hubg'), function (g) {
        g.style.transitionDelay = (600 + (i++) * 55) + 'ms';
      });
      function run() {
        fig.setAttribute('data-draw', 'done');
        Array.prototype.forEach.call(strokes, function (p) { p.style.strokeDashoffset = 0; });
        /* the delay was only ever for the entrance; leaving it on makes every later
           hover highlight lag by up to a second */
        window.setTimeout(function () {
          Array.prototype.forEach.call(svg.querySelectorAll('.mp-g,.mp-hubg'), function (g) {
            g.style.transitionDelay = '';
          });
        }, 1400);
      }
      if (!('IntersectionObserver' in window)) { run(); return; }
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { run(); io.disconnect(); } });
      }, { threshold: 0.2 });
      io.observe(fig);
    });
  }

  /* Exposed, and idempotent via data-wired. The location and service previews build their
     DOM with JS AFTER DOMContentLoaded has already fired, so a script that only ran on that
     event wired nothing on either of them. A behaviour that works only when the markup
     happens to be there already is not wired, it is lucky. */
  window.BEPMAP = { init: init };
  ready(init);
})();
