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
