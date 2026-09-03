/* ============================================================================
   Runtime behaviour for the ported location and service pages.

   Copied into the theme verbatim by canvas/port_pages_to_theme.mjs. Two things
   live here and nothing else, because two things is all these pages need.

   1. THE STAGE REVEAL, and it is NOT decorative. The stylesheet sets
      `.stages[data-reveal] .stage { opacity: 0 }` and only the `.shown` class
      brings it back. The reduced-motion rule drops the transform and LEAVES the
      opacity at zero. Ship the page without this and the whole process section
      is invisible to every visitor on every machine. That is why there is a
      no-IntersectionObserver fallback that simply shows everything: failing to
      animate is fine, failing to render is not.

   2. THE FINISHES COMPARATOR on the interior service page. Direction B, picked
      2026-09-03. The divider wipes and either side swaps finish. Neither
      autoplays, so reduced motion has nothing to switch off and the section
      means the same thing with motion on or off.

   Both are guarded on their own anchor element, so this file is harmless on a
   page that carries neither.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- 1. stage reveal --------------------------------------------------- */
  function revealStages() {
    var lists = document.querySelectorAll('.stages[data-reveal]');
    if (!lists.length) return;
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(lists, function (l) { l.classList.add('shown'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('shown'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    Array.prototype.forEach.call(lists, function (l) { io.observe(l); });
  }

  /* ---- 2. the finishes comparator ---------------------------------------- */
  function initFinishes() {
    var stage = document.getElementById('finstage');
    if (!stage) return;                      // exterior page carries no comparator
    var grip = document.getElementById('fingrip');
    var top = stage.querySelector('.b-scene.top .b-wall');
    var base = stage.querySelector('.b-scene.base .b-wall');
    var tagL = document.getElementById('finTagL');
    var tagR = document.getElementById('finTagR');
    /* The #finstage guard alone is not enough. Every one of these is dereferenced
       below, two of them at boot and two only when a visitor clicks a swatch, so a
       partial render would throw immediately or much later. The parts always ship
       together today because one porter writes them all, which is a reason to check
       cheaply rather than a reason not to check: a deferred throw on click is the
       kind of defect that reaches a visitor and never reaches us. */
    if (!grip || !top || !base || !tagL || !tagR) return;
    var cards = [].slice.call(document.querySelectorAll('[data-fin-card]'));
    var split = 50;

    function mark(name) {
      cards.forEach(function (c) {
        c.classList.toggle('on', c.getAttribute('data-fin-card') === name);
      });
    }
    function setSplit(pct) {
      split = Math.max(4, Math.min(96, pct));
      stage.style.setProperty('--split', split + '%');
      grip.setAttribute('aria-valuenow', String(Math.round(split)));
    }
    function fromEvent(e) {
      var r = stage.getBoundingClientRect();
      setSplit(((e.clientX - r.left) / r.width) * 100);
    }

    var dragging = false;
    stage.addEventListener('pointerdown', function (e) {
      dragging = true;
      stage.setPointerCapture(e.pointerId);
      fromEvent(e);
    });
    stage.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
    stage.addEventListener('pointerup', function () { dragging = false; });
    stage.addEventListener('pointercancel', function () { dragging = false; });

    /* the keyboard route in, which a pointer-only wipe never had */
    grip.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'ArrowLeft' || k === 'ArrowDown') { setSplit(split - 4); e.preventDefault(); }
      if (k === 'ArrowRight' || k === 'ArrowUp') { setSplit(split + 4); e.preventDefault(); }
      if (k === 'Home') { setSplit(4); e.preventDefault(); }
      if (k === 'End') { setSplit(96); e.preventDefault(); }
    });

    [].forEach.call(stage.parentNode.querySelectorAll('[data-side]'), function (row) {
      var side = row.getAttribute('data-side');
      [].forEach.call(row.querySelectorAll('[data-fin-pick]'), function (b) {
        b.addEventListener('click', function () {
          var name = b.getAttribute('data-fin-pick');
          [].forEach.call(row.querySelectorAll('[data-fin-pick]'), function (o) {
            o.setAttribute('aria-pressed', String(o === b));
          });
          if (side === 'l') { top.setAttribute('data-fin', name); tagL.textContent = name; }
          else { base.setAttribute('data-fin', name); tagR.textContent = name; }
          mark(name);
        });
      });
    });
    setSplit(50);
  }

  /* revealStages runs FIRST and in its own try, because it is the one that decides
     whether the process section is visible at all. If the comparator ever throws, the
     page must still render its content. Relying on call order alone for that is luck,
     not design. */
  function boot() {
    try { revealStages(); } catch (e) {}
    try { initFinishes(); } catch (e) {}
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
