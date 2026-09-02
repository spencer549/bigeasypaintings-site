(function () {
  var b = document.querySelector('.burger'), m = document.getElementById('mnav');
  if (b && m) {
    function set(open) {
      m.setAttribute('data-open', open ? 'true' : 'false');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      b.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    b.addEventListener('click', function () { set(m.getAttribute('data-open') !== 'true'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    m.addEventListener('click', function (e) { if (e.target.tagName === 'A') set(false); });
  }
  /* Preview-only. The estimate form has nowhere to post on a static host, and a
     form that silently reloads the page reads as broken. */
  var f = document.querySelector('.qform');
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
