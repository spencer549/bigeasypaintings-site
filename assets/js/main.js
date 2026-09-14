/* Shown once the hero is behind the reader. rAF throttled, and it runs once on
   load so a deep link or a restored scroll position does not start it hidden
   halfway down the page. */
(function () {
  var b = document.querySelector('[data-totop]');
  if (!b) return;
  var t = false;
  function sync() {
    t = false;
    b.classList.toggle('is-on', window.scrollY > (window.innerHeight * 0.9));
  }
  addEventListener('scroll', function () {
    if (!t) { t = true; requestAnimationFrame(sync); }
  }, { passive: true });
  /* href="#top" is the no-JS path and it lands on the anchor, which is 159px
     down once the fixed header and the panel above it are counted. With JS,
     go to 0 exactly. */
  b.addEventListener('click', function (ev) {
    ev.preventDefault();
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
                 && document.documentElement.dataset.motion !== 'force';
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    var h = document.getElementById('top');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  });
  sync();
})();
/* Every "#estimate" button opens the GHL popup form. Without JavaScript the
   link still lands on the banner form in the hero, which carries that id. */
(function () {
  var pop = document.getElementById('ghl-pop');
  if (!pop) return;
  var x = pop.querySelector('.ghl-pop-x'), last = null;
  /* html.ghl-pop-on hides GHL's chat widget while the dialog is open: at 360x640 its
     greeting bubble sat over the form's submit button (Opus crosscheck, 2026-09-14) */
  var root = document.documentElement;
  function close() { pop.hidden = true; root.classList.remove('ghl-pop-on'); document.body.style.overflow = ''; if (last) last.focus(); }
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href="#estimate"]');
    if (!a) return;
    ev.preventDefault(); last = a;
    /* opened from the mobile menu: shut the menu first, or it stays open behind the
       dialog and its own toggle later unlocks the page scroll (Opus crosscheck) */
    var t = document.querySelector('[data-navtoggle][aria-expanded="true"]');
    if (t) { t.click(); last = t; }
    pop.hidden = false; root.classList.add('ghl-pop-on'); document.body.style.overflow = 'hidden'; x.focus();
  });
  /* keep focus inside the dialog while it is open */
  document.addEventListener('focusin', function (ev) {
    if (!pop.hidden && !pop.contains(ev.target)) x.focus();
  });
  x.addEventListener('click', close);
  pop.addEventListener('click', function (ev) { if (ev.target === pop) close(); });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !pop.hidden) close(); });
})();

/* Preview-only. The estimate form has nowhere to post on a static host, and a form that
   silently reloads the page reads as broken. The live WordPress build wires this to the real
   handler; nothing here changes the design. */
(function () {
  var f = document.getElementById('hero');
  if (!f) return;
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = f.querySelector('[data-preview-note]');
    if (!n) {
      n = document.createElement('p');
      n.setAttribute('data-preview-note', '');
      n.style.cssText = 'margin-top:16px;padding:12px 14px;border-radius:4px;font-size:13px;' +
        'background:var(--alt);color:var(--ink);border:1px solid var(--line)';
      f.appendChild(n);
    }
    n.textContent = 'This is a design preview, so the form is not connected. ' +
      'On the live site this sends the estimate request. Call 504-226-6252 to reach the team.';
  });
})();
