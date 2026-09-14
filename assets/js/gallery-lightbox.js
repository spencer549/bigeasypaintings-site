/* ============================================================================
   Big Easy Paintings, gallery lightbox.

   One overlay (#pglb, in the gallery page's own markup, see preview-pages.js
   gallery()), reused for every photo. This file only ever swaps its <img>
   src and toggles [hidden]; it never builds DOM, so there is nothing here
   that can render before the page's own CSS has loaded.

   Copied verbatim into the theme by canvas/port_pages_to_theme.mjs and
   enqueued only on the gallery template. EDIT THIS FILE AND RE-PORT.
   ========================================================================== */
(function () {
  'use strict';

  /* Exposed as init() rather than run once on DOMContentLoaded, because the
     LOCAL PREVIEW builds this page's markup asynchronously (a fetch for its
     content JSON), so the elements below do not exist yet at
     DOMContentLoaded there. Production's baked HTML has no such delay, so
     it just calls init() on DOMContentLoaded itself below. `bound` guards
     against double-binding if init() is ever called twice on one page. */
  var bound = false;

  function init() {
    if (bound) return;
    var grid = document.querySelector('[data-lightbox="gallery"]');
    var lb = document.getElementById('pglb');
    if (!grid || !lb) return;
    bound = true;

    var img = document.getElementById('pglbImg');
    var count = document.getElementById('pglbCount');
    var shots = [].slice.call(grid.querySelectorAll('.pgshot-btn'));
    var current = -1;
    var opener = null;

    function show(i) {
      if (!shots.length) return;
      current = (i + shots.length) % shots.length;
      var btn = shots[current];
      img.src = btn.getAttribute('data-lb-src');
      img.alt = btn.querySelector('img') ? btn.querySelector('img').alt : '';
      count.textContent = (current + 1) + ' of ' + shots.length;
    }

    function open(i, fromEl) {
      opener = fromEl || null;
      show(i);
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      document.getElementById('pglbClose').focus();
    }

    function close() {
      lb.hidden = true;
      document.body.style.overflow = '';
      if (opener) opener.focus();
    }

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('.pgshot-btn');
      if (!btn) return;
      open(Number(btn.getAttribute('data-lb-index')) || 0, btn);
    });

    document.getElementById('pglbClose').addEventListener('click', close);
    document.getElementById('pglbPrev').addEventListener('click', function () { show(current - 1); });
    document.getElementById('pglbNext').addEventListener('click', function () { show(current + 1); });

    /* backdrop click closes; a click on the image or the buttons must not */
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  window.BEPGalleryLightbox = { init: init };
})();
