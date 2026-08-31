(function(){
  var root = document.documentElement;
  var forced = root.getAttribute('data-motion') === 'force';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches && !forced;

  var sel = '[data-rv],.we-wipe,.coat,.tc-word,.tc-swatch,.oc-stop';
  var rv = [].slice.call(document.querySelectorAll(sel));
  if(!('IntersectionObserver' in window)){
    rv.forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        var el = e.target;
        var d = reduced ? 0 : parseInt(el.getAttribute('data-rv-delay') || '0', 10);
        setTimeout(function(){ el.classList.add('in'); }, d);
        io.unobserve(el);
      });
    }, {rootMargin: '0px 0px -10% 0px', threshold: 0.12});
    rv.forEach(function(el){ io.observe(el); });
  }

  /* the wet edge needs its own travel distance so the leading line exits at the right width */
  function sizeEdges(){
    [].slice.call(document.querySelectorAll('.we-wipe')).forEach(function(el){
      el.style.setProperty('--we-w', el.offsetWidth + 'px');
    });
  }
  sizeEdges();
  window.addEventListener('resize', sizeEdges, {passive:true});

  /* scroll-linked fills: the G rail and the I thread, rAF-throttled */
  var fills = [].slice.call(document.querySelectorAll('.we-rail i, .thread i'));
  var ticking = false;
  function paint(){
    ticking = false;
    fills.forEach(function(f){
      if(reduced){ f.style.height = '100%'; return; }
      var host = f.parentNode;
      var isRail = host.classList.contains('we-rail');
      var box = isRail ? document.body.getBoundingClientRect() : host.getBoundingClientRect();
      var vh = window.innerHeight;
      var p;
      if(isRail){
        var max = document.body.scrollHeight - vh;
        p = max <= 0 ? 1 : window.pageYOffset / max;
      } else {
        var run = box.height - vh * 0.35;
        p = run <= 0 ? 1 : (vh * 0.65 - box.top) / run;
      }
      p = p < 0 ? 0 : (p > 1 ? 1 : p);
      f.style.height = (p * 100) + '%';
    });
  }
  function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(paint); } }
  if(fills.length){
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll, {passive:true});
    paint();
  }

  /* sticky bar: only up once the hero is behind us */
  var bar = document.querySelector('[data-stickybar]');
  var after = document.querySelector('[data-stickybar-after]');
  if(bar && after && 'IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      es.forEach(function(e){ bar.classList.toggle('up', !e.isIntersecting); });
    }, {threshold: 0}).observe(after);
  } else if(bar){ bar.classList.add('up'); }

  /* scroll-reveal-minimal header: hidden going down, shown coming back up */
  var sh = document.querySelector('[data-revealheader]');
  if(sh){
    var last = window.pageYOffset;
    window.addEventListener('scroll', function(){
      var y = window.pageYOffset;
      if(y < 80){ sh.classList.remove('hide'); sh.classList.remove('solid'); }
      else {
        sh.classList.add('solid');
        if(y > last){ sh.classList.add('hide'); } else { sh.classList.remove('hide'); }
      }
      last = y;
    }, {passive:true});
  }

  /* FAQ accordions: height is a layout property, so the panel animates on a grid-rows
     track instead of height, which stays off the layout-transition ban list. */
  [].slice.call(document.querySelectorAll('[data-acc]')).forEach(function(btn){
    btn.addEventListener('click', function(){
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      var p = document.getElementById(btn.getAttribute('aria-controls'));
      if(p) p.classList.toggle('open', !open);
    });
  });
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
