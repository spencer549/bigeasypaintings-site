(function () {
  'use strict';
  var D = window.PCDATA;
  if (!D) throw new Error('paint-colors-content.js did not load');
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* Extracted verbatim from preview-paint-colors.js wireB(). Full file with
     all three reviewed designs is preview-paint-colors.js in the project
     root. EDIT THAT FILE AND REBUILD; do not hand-edit here. */
  function wireB(root) {
      var wall = root.querySelector('.pcwall');
      if (!wall) return;
      var canvas = root.querySelector('#pcCanvasB');
      var ctx = canvas.getContext('2d', { willReadFrequently: true });
      var img = new Image();
      var current = { room: D.ROOMS[0], swatch: D.SWATCHES[0] };
  
      /* WALL-ONLY recolour, not a full-photo tint. Furniture, floors and trim
         stay their own colour: only pixels close in colour to a sampled patch
         of the room's OWN wall (current.room.seed, hand-verified per photo)
         get repainted, with a soft ramp between "clearly wall" and "clearly
         not" so the edge doesn't look cut out with scissors. */
      function sampleSeed(imgData, w, h, seed) {
        var x0 = Math.floor(seed[0] * w), x1 = Math.floor(seed[2] * w);
        var y0 = Math.floor(seed[1] * h), y1 = Math.floor(seed[3] * h);
        var d = imgData.data, sr = 0, sg = 0, sb = 0, n = 0;
        for (var y = y0; y < y1; y += 2) {
          for (var x = x0; x < x1; x += 2) {
            var i = (y * w + x) * 4;
            sr += d[i]; sg += d[i + 1]; sb += d[i + 2]; n++;
          }
        }
        return n ? [sr / n, sg / n, sb / n] : [210, 210, 210];
      }
  
      /* The mask used to compare raw RGB (Euclidean distance) to the seed
         sample. That conflates HUE with LIGHTNESS, and a real photographed
         wall is not one flat RGB value: it has a lighting gradient (brighter
         near the window/top edge, darker in the corners) that is easily 60-90
         RGB units wide even though it is visibly the same painted surface.
         That gradient routinely pushed real wall pixels past the old T2=68
         cutoff, leaving large, uneven patches of the wall unpainted no matter
         which swatch was picked (worst on the bedroom photo's upper wall).
  
         Converting to a hue/saturation "chroma vector" (u,v) fixes that: a
         diffusely-lit surface keeps roughly the same hue and saturation as
         its brightness changes, so distance in (u,v) space tracks "is this
         the same painted surface" far better than raw RGB distance.
  
         It has its own failure mode on a near-white/grey wall, though (the
         hallway photo, seed saturation ~0.03): once the seed's own (u,v) is
         almost exactly the origin, EVERY low-saturation pixel in the photo
         (floor, doors, ceiling) also lands near the origin regardless of its
         hue, so the vector distance stops discriminating at all and a
         saturated swatch washes the entire photo. Confirmed live: "Golden
         Hour" on the hallway tinted the floor and doors along with the wall.
         Hue is numerically meaningless at near-zero saturation anyway (tiny
         sensor noise flips it), so below SAT_FLOOR this falls back to the
         original per-pixel RGB distance, which does not have that collapse
         (a wood floor is still ~150-200 RGB units from a near-white wall)
         and is what the page shipped and was verified with. */
      function rgbToUV(r, g, b) {
        var max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, h = 0;
        if (d !== 0) {
          if (max === r) h = ((g - b) / d) % 6;
          else if (max === g) h = (b - r) / d + 2;
          else h = (r - g) / d + 4;
          h *= 60; if (h < 0) h += 360;
        }
        var s = max === 0 ? 0 : d / max;
        var rad = h * Math.PI / 180;
        return [s, s * Math.cos(rad), s * Math.sin(rad)];
      }
  
      var SAT_FLOOR = 0.12;
      var T1 = 0.10, T2 = 0.30; /* chroma-vector units, full mask under T1, feathered to 0 by T2 */
      var RT1 = 22, RT2 = 68;   /* RGB-distance units, same shape, used below SAT_FLOOR */
      function buildMask(imgData, w, h, seed) {
        var rgb = sampleSeed(imgData, w, h, seed);
        var suv0 = rgbToUV(rgb[0], rgb[1], rgb[2]);
        var useChroma = suv0[0] >= SAT_FLOOR;
        var d = imgData.data, mask = new Uint8ClampedArray(w * h);
        for (var i = 0, p = 0; i < d.length; i += 4, p++) {
          var dist, t1, t2;
          if (useChroma) {
            var suv = rgbToUV(d[i], d[i + 1], d[i + 2]);
            var du = suv[1] - suv0[1], dv = suv[2] - suv0[2];
            dist = Math.sqrt(du * du + dv * dv); t1 = T1; t2 = T2;
          } else {
            var dr = d[i] - rgb[0], dg = d[i + 1] - rgb[1], db = d[i + 2] - rgb[2];
            dist = Math.sqrt(dr * dr + dg * dg + db * db); t1 = RT1; t2 = RT2;
          }
          mask[p] = dist <= t1 ? 255 : dist >= t2 ? 0 : Math.round(255 * (1 - (dist - t1) / (t2 - t1)));
        }
        return mask;
      }
  
      function hexToRgb(hex) {
        return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
      }
  
      /* The canvas's PIXEL BACKING STORE is sized to match its box directly,
         rather than left at a fixed 1000x667 and stretched to fit with CSS
         object-fit. object-fit does not apply to <canvas> in every browser
         (support is inconsistent, unlike <img>), and where it does not apply
         the element just stretches non-uniformly to its CSS box, which is
         what produced a squashed, fragmented-looking render. drawImage below
         does the "cover" crop itself, in pixels, so nothing depends on that
         CSS property working at all. */
      function sizeCanvas() {
        var rect = canvas.parentElement.getBoundingClientRect();
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w = Math.max(1, Math.round(rect.width * dpr));
        var h = Math.max(1, Math.round(rect.height * dpr));
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      }
  
      function drawCover(image, w, h) {
        var iw = image.naturalWidth, ih = image.naturalHeight;
        var scale = Math.max(w / iw, h / ih);
        var dw = iw * scale, dh = ih * scale;
        ctx.drawImage(image, (w - dw) / 2, (h - dh) / 2, dw, dh);
      }
  
      function paint() {
        sizeCanvas();
        var w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        drawCover(img, w, h);
        var base = ctx.getImageData(0, 0, w, h);
        var mask = buildMask(base, w, h, current.room.seed);
        var rgb = hexToRgb(current.swatch.hex);
        var tint = ctx.createImageData(w, h), td = tint.data;
        for (var i = 0, p = 0; i < td.length; i += 4, p++) {
          td[i] = rgb[0]; td[i + 1] = rgb[1]; td[i + 2] = rgb[2]; td[i + 3] = mask[p];
        }
        var off = document.createElement('canvas');
        off.width = w; off.height = h;
        off.getContext('2d').putImageData(tint, 0, 0);
        ctx.globalCompositeOperation = 'color';
        ctx.drawImage(off, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        root.querySelector('#pcLabelB').innerHTML = 'Showing <strong>' + esc(current.swatch.name) +
          '</strong> on the wall in the ' + esc(current.room.label.toLowerCase());
      }
  
      function loadRoom(r) {
        current.room = r;
        img = new Image();
        img.onload = paint;
        img.src = r.img;
      }
  
      wall.addEventListener('click', function (e) {
        var tab = e.target.closest('.pctab');
        if (tab) {
          wall.querySelectorAll('.pctab').forEach(function (t) {
            t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
          });
          var r = D.ROOMS.filter(function (rr) { return rr.key === tab.getAttribute('data-room'); })[0];
          loadRoom(r);
          return;
        }
        var pill = e.target.closest('.pcpill');
        if (pill) {
          wall.querySelectorAll('.pcpill').forEach(function (p) { p.setAttribute('aria-pressed', p === pill ? 'true' : 'false'); });
          var mood = pill.getAttribute('data-mood');
          root.querySelectorAll('#pcSwatchGridB .pcswatch').forEach(function (s) {
            s.hidden = mood !== 'all' && s.getAttribute('data-mood') !== mood;
          });
          return;
        }
        var sw = e.target.closest('.pcswatch');
        if (sw) {
          current.swatch = { hex: sw.getAttribute('data-hex'), name: sw.getAttribute('data-name') };
          root.querySelectorAll('#pcSwatchGridB .pcswatch').forEach(function (s) { s.classList.toggle('on', s === sw); });
          if (img.complete && img.naturalWidth) paint();
          return;
        }
      });
  
      var firstChip = root.querySelector('.pcswatch[data-hex="' + current.swatch.hex + '"]');
      if (firstChip) firstChip.classList.add('on');
      loadRoom(current.room);
    }

  document.addEventListener('DOMContentLoaded', function () { wireB(document); });
})();
