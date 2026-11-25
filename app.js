/* YesNoWheel - application logic (vanilla JS, no dependencies) */
(function () {
  'use strict';

  var I = window.I18N;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var TAU = Math.PI * 2;
  var mod = function (a, n) { return ((a % n) + n) % n; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var rand = function () {
    try { return crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296; } catch (e) { return Math.random(); }
  };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var isHex = function (v) { return typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v); };
  var lum = function (hex) {
    var n = parseInt(hex.slice(1), 16);
    return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  };

  var STORE = 'yesnowheel:v1';
  var LANGKEY = 'yesnowheel:lang';
  var BASE_URL = 'https://yesnowheel.xyz/';
  var FONT = '"Jost", "Segoe UI", Roboto, "Noto Sans", "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", "Noto Sans Arabic", Tahoma, sans-serif';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------- tracking */
  var SLUG = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '');
  var TEMPLATE = SLUG === 'index' ? 'home'
    : /^random-/.test(SLUG) ? 'generator'
      : SLUG === 'custom-picker-wheel' ? 'custom-picker'
        : SLUG === 'truth-or-dare-questions' ? 'truth-or-dare' : 'other';
  var TOOL = TEMPLATE === 'home' ? 'yes-no-wheel'
    : SLUG.replace(/^random-/, '').replace(/-questions$/, '').replace(/(-generator|-picker-wheel)$/, '');
  var pageTracked = false;
  /* events are fire-and-forget: if tags.js is blocked or the visitor has not
     accepted analytics cookies, nothing leaves and the wheel is unaffected */
  function track(name, params) {
    return typeof window.ynwTrack === 'function' && window.ynwTrack(name, params) === true;
  }
  function trackPage() {
    if (pageTracked) return;
    /* stays false while analytics cookies are refused, so accepting the
       banner later still reports the page */
    pageTracked = track('tool_page', { tool: TOOL, template: TEMPLATE, language: lang });
  }

  var PALETTES = {
    vibrant: ['#f9b61e', '#fdee96', '#2d5a0a', '#aeaa3a'],
    pastel: ['#fca5a5', '#fdba74', '#fde68a', '#bbf7d0', '#a5f3fc', '#bfdbfe', '#ddd6fe', '#fbcfe8'],
    neon: ['#ff2d95', '#ff9500', '#f5ff00', '#39ff14', '#00f0ff', '#3d5afe', '#b026ff', '#ff3131'],
    mono: ['#111827', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#4b5563', '#1f2937', '#e5e7eb']
  };

  /* ------------------------------------------------------------------ state */
  var uid = 0;
  var newId = function () { return 'e' + Date.now().toString(36) + (uid++).toString(36); };

  function mkEntry(o) {
    o = o || {};
    var w = parseFloat(o.weight);
    return {
      id: newId(),
      text: String(o.text == null ? '' : o.text).slice(0, 120),
      weight: isFinite(w) ? clamp(w, 0, 999) : 1,
      color: isHex(o.color) ? o.color : null,
      hidden: !!o.hidden,
      img: (typeof o.img === 'string' && /^(https?:\/\/|data:image\/)/i.test(o.img)) ? o.img : ''
    };
  }

  function defaultState() {
    var dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return {
      mode: 'yesno', view: 'list',
      yn: { three: false, sets: 4, tally: { yes: 0, no: 0, maybe: 0 } },
      entries: ['Pizza', 'Burgers', 'Sushi', 'Tacos', 'Salad', 'Pasta'].map(function (t) { return mkEntry({ text: t }); }),
      action: 'normal', mysteryWheel: false, mysteryResult: false,
      title: '', desc: '', history: [], wins: {},
      s: {
        duration: 5, speed: 5, idle: true, tick: true, victory: true, confetti: true,
        theme: dark ? 'dark' : 'light', palette: 'vibrant',
        custom: ['#e11d48', '#f59e0b', '#10b981', '#0ea5e9', '#6366f1', '#d946ef'],
        pageBg: '', centerText: '', centerColor: '#222222'
      }
    };
  }

  function applySettings(t, s) {
    t.duration = clamp(parseFloat(s.duration) || 5, 1, 15);
    t.speed = clamp(parseFloat(s.speed) || 5, 1, 10);
    ['idle', 'tick', 'victory', 'confetti'].forEach(function (k) { if (typeof s[k] === 'boolean') t[k] = s[k]; });
    if (s.theme === 'dark' || s.theme === 'light') t.theme = s.theme;
    if (PALETTES[s.palette] || s.palette === 'custom') t.palette = s.palette;
    if (Array.isArray(s.custom) && s.custom.length >= 6 && s.custom.slice(0, 6).every(isHex)) t.custom = s.custom.slice(0, 6);
    t.pageBg = isHex(s.pageBg) ? s.pageBg : '';
    t.centerText = String(s.centerText || '').slice(0, 12);
    if (isHex(s.centerColor)) t.centerColor = s.centerColor;
  }

  function load() {
    var d = defaultState();
    try {
      var o = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (o && typeof o === 'object') {
        if (o.mode === 'custom' || o.mode === 'yesno') d.mode = o.mode;
        if (o.view === 'text') d.view = 'text';
        if (o.yn) {
          d.yn.three = !!o.yn.three;
          d.yn.sets = clamp(parseInt(o.yn.sets, 10) || 1, 1, 5);
          ['yes', 'no', 'maybe'].forEach(function (k) {
            var v = parseInt(o.yn.tally && o.yn.tally[k], 10);
            if (v > 0) d.yn.tally[k] = v;
          });
        }
        if (Array.isArray(o.entries)) d.entries = o.entries.slice(0, 500).map(mkEntry);
        if (['normal', 'elimination', 'accumulation'].indexOf(o.action) > -1) d.action = o.action;
        d.mysteryWheel = !!o.mysteryWheel;
        d.mysteryResult = !!o.mysteryResult;
        d.title = String(o.title || '').slice(0, 80);
        d.desc = String(o.desc || '').slice(0, 300);
        if (Array.isArray(o.history)) {
          d.history = o.history.slice(0, 200).filter(function (h) { return h && typeof h.label === 'string'; });
        }
        if (o.wins && typeof o.wins === 'object') {
          Object.keys(o.wins).forEach(function (k) {
            var v = parseInt(o.wins[k], 10);
            if (v > 0 && k !== '__proto__') d.wins[k] = v;
          });
        }
        if (o.s) applySettings(d.s, o.s);
      }
    } catch (e) { /* ignore corrupt storage */ }
    return d;
  }

  /* share-link encoding (URL hash, no backend) */
  function encodeShare(o) {
    var bytes = new TextEncoder().encode(JSON.stringify(o));
    var bin = '';
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decodeShare(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    var bin = atob(str);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  var hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));
  var embed = hashParams.get('embed') === '1';
  var shared = null;
  if (hashParams.get('s')) { try { shared = decodeShare(hashParams.get('s')); } catch (e) { shared = null; } }

  var state = load();
  var sandbox = false; // true while viewing a shared link: never overwrite the visitor's own saved data

  function applyShare(o) {
    if (!o || o.v !== 1) return;
    if (o.m === 'custom' || o.m === 'yesno') state.mode = o.m;
    state.title = String(o.t || '').slice(0, 80);
    state.desc = String(o.d || '').slice(0, 300);
    if (['normal', 'elimination', 'accumulation'].indexOf(o.a) > -1) state.action = o.a;
    state.mysteryWheel = !!o.mw;
    state.mysteryResult = !!o.mr;
    if (o.y) { state.yn.three = !!o.y.th; state.yn.sets = clamp(parseInt(o.y.s, 10) || 1, 1, 5); }
    if (o.s) {
      applySettings(state.s, {
        duration: o.s.du, speed: o.s.sp, palette: o.s.pa, custom: o.s.cu, theme: o.s.th,
        pageBg: o.s.bg, centerText: o.s.ct, centerColor: o.s.cc, idle: o.s.id != null ? !!o.s.id : undefined
      });
    }
    if (Array.isArray(o.e)) {
      state.entries = o.e.slice(0, 500).map(function (r) {
        return mkEntry({ text: r[0], weight: r[1], color: r[2], hidden: r[3], img: r[4] });
      });
    }
  }
  if (shared) { applyShare(shared); sandbox = true; }

  var saveTimer;
  function save() {
    if (sandbox) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* quota or private mode */ }
    }, 200);
  }

  /* -------------------------------------------------------------------- i18n */
  function pickLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q && I.has(q)) return q;
    if (shared && shared.l && I.has(shared.l)) return shared.l;
    try { var s = localStorage.getItem(LANGKEY); if (s && I.has(s)) return s; } catch (e) { /* ignore */ }
    var nav = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < nav.length; i++) {
      var c = String(nav[i]).toLowerCase().split('-')[0];
      if (I.has(c)) return c;
    }
    return 'en';
  }
  var lang = pickLang();
  var t = function (k) { return I.t(lang, k); };

  function setMeta(sel, val) { var el = $(sel); if (el) el.setAttribute('content', val); }

  function applyI18n() {
    var de = document.documentElement;
    de.lang = lang;
    de.dir = I.isRtl(lang) ? 'rtl' : 'ltr';
    /* Only the home page uses the translated title and description. Tool pages keep
       the title and description written in their own HTML. */
    if (/(^|\/)(index\.html)?$/.test(location.pathname)) {
      document.title = t('title');
      setMeta('meta[name="description"]', t('desc'));
      setMeta('meta[property="og:title"]', t('title'));
      setMeta('meta[property="og:description"]', t('desc'));
      setMeta('meta[name="twitter:title"]', t('title'));
      setMeta('meta[name="twitter:description"]', t('desc'));
    }
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-ph]').forEach(function (el) { el.placeholder = t(el.dataset.i18nPh); });
    $$('[data-i18n-title]').forEach(function (el) {
      var v = t(el.dataset.i18nTitle);
      el.title = v;
      el.setAttribute('aria-label', v);
    });
    $('#langSelect').value = lang;
    try { localStorage.setItem(LANGKEY, lang); } catch (e) { /* ignore */ }
    try {
      var u = new URL(location.href);
      u.searchParams.set('lang', lang);
      history.replaceState(null, '', u.toString());
    } catch (e) { /* file:// or sandboxed frame */ }
    invalidate();
    renderAll();
  }

  /* --------------------------------------------------------------- slices */
  function pal() { return state.s.palette === 'custom' ? state.s.custom : (PALETTES[state.s.palette] || PALETTES.vibrant); }
  function ynColor(k) { var p = pal(); return { yes: p[3 % p.length], no: p[0], maybe: p[2 % p.length] }[k]; }

  var cache = null;
  var dirty = true;
  /* The wheel repaints every frame while it idles. Drawing the slices from
     vectors each time costs a full raster: a fill and stroke per slice plus a
     text run for every label. Rim, disc and hub are rasterised once and
     composited instead, so an idle frame is three blits and the pixels are the
     same ones the vector path produced. */
  var hubDirty = true;
  function invalidate() { cache = null; dirty = true; hubDirty = true; }
  function slices() { return cache || (cache = computeSlices()); }

  function computeSlices() {
    var out = [];
    if (state.mode === 'yesno') {
      var keys = state.yn.three ? ['yes', 'no', 'maybe'] : ['yes', 'no'];
      for (var r = 0; r < state.yn.sets; r++) {
        keys.forEach(function (k) { out.push({ key: k, label: t(k), weight: 1, color: ynColor(k), img: '' }); });
      }
    } else {
      var p = pal();
      var vis = state.entries.filter(function (e) { return !e.hidden && e.weight > 0 && (e.text.trim() || e.img); });
      out = vis.map(function (e, i) {
        return { id: e.id, key: e.text.trim(), label: e.text.trim() || '·', weight: e.weight, img: e.img, color: e.color || p[i % p.length] };
      });
      var n = out.length;
      if (n > 2 && !vis[n - 1].color && out[n - 1].color === out[0].color) out[n - 1].color = p[n % p.length];
    }
    var total = out.reduce(function (a, s) { return a + s.weight; }, 0);
    var acc = 0;
    out.forEach(function (s) { s.start = acc; s.ang = s.weight / total * TAU; acc += s.ang; });
    return out;
  }

  function changed() { invalidate(); save(); }

  /* ----------------------------------------------------------------- audio */
  var AudioFX = {
    ctx: null, last: 0,
    unlock: function () {
      if (!this.ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        try { this.ctx = new AC(); } catch (e) { return; }
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
    },
    tone: function (freq, start, dur, type, vol, endFreq) {
      var c = this.ctx, o = c.createOscillator(), g = c.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, start);
      if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, start + dur);
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(vol, start + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      o.connect(g);
      g.connect(c.destination);
      o.start(start);
      o.stop(start + dur + 0.02);
    },
    tick: function () {
      if (!state.s.tick || !this.ctx) return;
      var now = this.ctx.currentTime;
      if (now - this.last < 0.03) return;
      this.last = now;
      this.tone(900 + Math.random() * 120, now, 0.05, 'triangle', 0.16, 300);
    },
    fanfare: function () {
      if (!state.s.victory || !this.ctx) return;
      var now = this.ctx.currentTime, self = this;
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { self.tone(f, now + i * 0.11, 0.28, 'triangle', 0.2); });
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f) { self.tone(f, now + 0.5, 0.9, 'sine', 0.09); });
    }
  };

  /* ----------------------------------------------------------------- wheel */
  var canvas = $('#wheel');
  var ctx = canvas.getContext('2d');

  /* Only the disc moves, so only the disc needs a canvas of its own. Rim and hub
     are painted once onto static layers and the disc is rotated by the
     compositor, which leaves an idle wheel with no canvas work at all. */
  var rimCanvas = document.createElement('canvas');
  var hubCanvas = document.createElement('canvas');
  [rimCanvas, hubCanvas].forEach(function (c) {
    c.setAttribute('aria-hidden', 'true');
    c.style.pointerEvents = 'none';
  });
  rimCanvas.style.zIndex = '0';
  canvas.style.zIndex = '1';
  hubCanvas.style.zIndex = '2';
  canvas.style.willChange = 'transform';
  canvas.parentNode.insertBefore(rimCanvas, canvas);
  canvas.parentNode.insertBefore(hubCanvas, canvas.nextSibling);
  var rimCtx = rimCanvas.getContext('2d');
  var hubCtx = hubCanvas.getContext('2d');
  var rotApplied = -1;
  var size = 0, dpr = 1;
  var rot = 0, spinning = false, flap = 0, lastIdx = -1, lastT = 0;
  var spinStart = 0, spinDur = 0, spinFrom = 0, spinDelta = 0;
  var imgCache = new Map();

  /* Landscape phones keep the whole topbar, which may wrap onto a second row, so
     a CSS width cannot know how much height is left for the wheel. Size it from
     the space actually between the wrapper and the viewport bottom instead, and
     the wheel (and its hub) stays on screen without scrolling. */
  var shortViewport = window.matchMedia('(max-height: 560px)');
  /* A phone in portrait has the opposite problem: what is left of the fold is
     height, not width, once the header has wrapped onto its rows. */
  var narrowViewport = window.matchMedia('(max-width: 480px) and (orientation: portrait)');

  /* Everything the stage lays out under the wheel. The scoreboard stays hidden
     until there is a result, so on a narrow stage it is measured with the
     attribute off: reserving its row now keeps it above the fold when the first
     spin reveals it, instead of shoving itself and the wheel down by its own
     height. */
  function stageBelow(wrap, stage, withTally) {
    var cs = getComputedStyle(stage);
    var gap = parseFloat(cs.rowGap) || 0;
    var below = (parseFloat(cs.paddingBottom) || 0) + (parseFloat(cs.borderBottomWidth) || 0) + 1;
    var kids = stage.children, seen = false;
    for (var i = 0; i < kids.length; i++) {
      var el = kids[i];
      if (el === wrap) { seen = true; continue; }
      if (!seen || getComputedStyle(el).position === 'absolute') continue;
      if (el.hidden) {
        if (el.id !== 'tally' || !withTally) continue;
        el.hidden = false;
        below += el.offsetHeight + gap;
        el.hidden = true;
        continue;
      }
      if (!el.offsetHeight) continue;
      below += el.offsetHeight + gap;
    }
    return below;
  }

  function fitViewportWheel() {
    var wrap = $('#wheelWrap');
    var stage = $('#wheelArea') || wrap.parentElement;
    var narrow = narrowViewport.matches;
    if ((!shortViewport.matches && !narrow) || document.body.classList.contains('present') || document.body.classList.contains('embed')) {
      if (wrap.style.width) wrap.style.width = '';
      return;
    }
    var cs = getComputedStyle(stage);
    var top = wrap.getBoundingClientRect().top;
    var below = stageBelow(wrap, stage, narrow);
    var availH = window.innerHeight - top - below;
    var availW = stage.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
    var px = Math.round(Math.max(120, Math.min(availH, availW, 520)));
    if (px !== (parseFloat(wrap.style.width) || 0)) wrap.style.width = px + 'px';
  }

  /* The stage's floating buttons hang over its right edge, so a centred row that
     is wide enough runs underneath them. Both the title and the scoreboard ask
     for the gutter this measures: padding moves a centred box by half its own
     width, so clearing an overlap of n takes 2n. Inputs come from the stage and
     the row, never from the padding we set, so repeat calls settle. */
  function fabGutter(el, fab, stage, berth) {
    var gap = berth || 6;
    var scs = getComputedStyle(stage);
    var padL = (parseFloat(scs.paddingLeft) || 0) + (parseFloat(scs.borderLeftWidth) || 0);
    var avail = stage.clientWidth - (parseFloat(scs.paddingLeft) || 0) - (parseFloat(scs.paddingRight) || 0);
    var contentLeft = stage.getBoundingClientRect().left + padL;
    el.style.paddingRight = '0px';
    el.style.width = 'max-content';
    var natural = Math.ceil(el.getBoundingClientRect().width);
    el.style.width = '';
    var fr = fab.getBoundingClientRect();
    var out = { avail: avail, contentLeft: contentLeft, natural: natural, pad: 0, oneLine: true };
    if (natural && fr.width && avail > 0) {
      var clear = fr.left - gap;
      var shift = contentLeft + avail / 2 + natural / 2 - clear;
      if (shift > 0) {
        out.pad = natural + shift * 2 <= avail
          ? Math.ceil(shift * 2)
          : Math.ceil(avail - (clear - contentLeft));
        out.oneLine = natural + shift * 2 <= avail;
      }
    }
    return out;
  }

  /* Title: reserve the gutter while it holds the same number of lines, and only
     wrap it before the buttons when clearing them would cost a whole line. */
  function fitTitleGutter() {
    var t = $('#stageTitle'), fab = document.querySelector('.fab-col.top');
    if (!t || !fab || !t.offsetHeight) return;
    t.style.fontSize = '';
    var base = parseFloat(getComputedStyle(t).fontSize);
    var g = fabGutter(t, fab, t.parentElement);
    var pad = g.pad, fs = 0;
    if (pad && !g.oneLine) {
      /* The gutter costs a whole line only when the text just misses: give back
         a hair of type size instead of shoving the wheel down. */
      var content = g.avail - pad;
      var plain = Math.ceil(g.natural / g.avail), gutted = Math.ceil(g.natural / content);
      var shortfall = g.natural / plain / content - 1;
      if (content > 0 && gutted > plain && shortfall > 0 && shortfall < 0.03) fs = base / (1 + shortfall + 0.004);
    }
    /* Always written back: both were cleared above to measure the bare row. */
    t.style.paddingRight = pad ? pad + 'px' : '';
    t.style.fontSize = fs ? Math.round(fs * 10) / 10 + 'px' : '';
  }

  /* Scoreboard row: same gutter, so the fullscreen button stops sitting on the
     end of "Reset scoreboard". */
  function fitTallyGutter() {
    var t = $('#tally'), fab = document.querySelector('.fab-col.bottom');
    if (!t) return;
    if (!fab || t.hidden || !t.offsetHeight) {
      if (t.style.paddingRight) t.style.paddingRight = '';
      return;
    }
    /* The row runs alongside the fullscreen button, so it asks for a wider
       berth than the title: a three-digit total still has to clear the circle.
       Only when the stage is too narrow for that — the row would lose a line to
       the padding — does it settle for the title's 6px. */
    var berth = 12;
    var g = fabGutter(t, fab, t.parentElement, berth);
    if (g.pad && g.pad > g.avail - g.natural) {
      berth = 6;
      g = fabGutter(t, fab, t.parentElement, berth);
    }
    var pad = g.pad;
    t.style.paddingRight = pad ? pad + 'px' : '';
    if (!pad) return;
    /* Centring a padded box rounds, and the row is measured mid-layout, so look
       at where its content actually landed instead of trusting the arithmetic. */
    var edge = t.getBoundingClientRect().right - (parseFloat(getComputedStyle(t).paddingRight) || 0);
    var over = edge - (fab.getBoundingClientRect().left - berth);
    if (over > 0) {
      var more = pad + Math.ceil(over * 2);
      if (more <= g.avail - g.natural) t.style.paddingRight = more + 'px';
    }
  }

  function resize() {
    fitTitleGutter();
    fitTallyGutter();
    fitViewportWheel();
    var r = $('#wheelWrap').getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    var w = Math.max(120, Math.round(r.width * dpr));
    /* Ads and webfonts nudge the layout; only a real size change needs the
       cached layers repainted. */
    if (w === size) return;
    size = w;
    [canvas, rimCanvas, hubCanvas].forEach(function (c) { c.width = c.height = w; });
    rotApplied = -1;
    var g = geom();
    canvas.style.transformOrigin = (g.cx / size * 100) + '% ' + (g.cy / size * 100) + '%';
    dirty = true;
    hubDirty = true;
  }

  function geom() { return { cx: size / 2, cy: size / 2 + size * 0.02, R: size / 2 * 0.9 }; }

  function getImg(src) {
    if (!src) return null;
    var im = imgCache.get(src);
    if (!im) {
      im = new Image();
      im.onload = function () { im._ok = true; invalidate(); };
      im.src = src;
      imgCache.set(src, im);
    }
    return im._ok ? im : null;
  }

  function fitText(text, maxW) {
    if (ctx.measureText(text).width <= maxW) return text;
    var lo = 0, hi = text.length;
    while (lo < hi) {
      var mid = Math.ceil((lo + hi) / 2);
      if (ctx.measureText(text.slice(0, mid) + '…').width <= maxW) lo = mid; else hi = mid - 1;
    }
    return text.slice(0, lo) + '…';
  }

  function paintRim(c, cx, cy, R) {
    c.save();
    c.shadowColor = 'rgba(0,0,0,.28)';
    c.shadowBlur = R * 0.05;
    c.shadowOffsetY = R * 0.015;
    c.beginPath();
    c.arc(cx, cy, R, 0, TAU);
    c.fillStyle = '#ffffff';
    c.fill();
    c.restore();
  }

  function paintDisc(c, cx, cy, R) {
    var s = slices();
    // Same white base the rim puts under the slices, so edge AA composites identically.
    c.beginPath();
    c.arc(cx, cy, R, 0, TAU);
    c.fillStyle = '#ffffff';
    c.fill();
    if (!s.length) {
      c.beginPath();
      c.arc(cx, cy, R, 0, TAU);
      c.fillStyle = '#cbd5e1';
      c.fill();
      return;
    }

    var i, sl, a0, a1;
    for (i = 0; i < s.length; i++) {
      sl = s[i];
      a0 = sl.start;                       // rotation is applied when compositing
      a1 = a0 + sl.ang;
      c.beginPath();
      c.moveTo(cx, cy);
      c.arc(cx, cy, R, a0, a1);
      c.closePath();
      c.fillStyle = sl.color;
      c.fill();
      c.lineWidth = 1;
      c.strokeStyle = sl.color;
      c.stroke();
    }

    var mystery = state.mode === 'custom' && state.mysteryWheel;
    for (i = 0; i < s.length; i++) {
      sl = s[i];
      if (sl.ang < 0.04) continue;
      c.save();
      c.translate(cx, cy);
      c.rotate(sl.start + sl.ang / 2);
      var outer = R * 0.93, inner = R * 0.22;
      var fs = Math.max(9 * dpr, Math.min(R * 0.15, sl.ang * R * 0.38));
      if (mystery) fs *= 1.4;
      var right = outer;
      var im = getImg(sl.img);
      if (im) {
        var ir = Math.min(R * 0.1, sl.ang * R * 0.3);
        c.save();
        c.beginPath();
        c.arc(outer - ir, 0, ir, 0, TAU);
        c.clip();
        c.drawImage(im, outer - ir * 2, -ir, ir * 2, ir * 2);
        c.restore();
        right = outer - ir * 2 - R * 0.02;
      }
      c.font = '500 ' + fs + 'px ' + FONT;
      c.textAlign = 'right';
      c.textBaseline = 'middle';
      c.fillStyle = lum(sl.color) > 0.55 ? '#111827' : '#ffffff';
      c.fillText(fitText(mystery ? '?' : (state.mode === 'custom' ? sl.label : sl.label.toUpperCase()), right - inner), right, 0);
      c.restore();
    }
  }

  function draw() {
    if (!size) return;
    var g = geom(), cx = g.cx, cy = g.cy, R = g.R;

    if (dirty) {
      dirty = false;
      rimCtx.clearRect(0, 0, size, size);
      paintRim(rimCtx, cx, cy, R);
      ctx.clearRect(0, 0, size, size);
      paintDisc(ctx, cx, cy, R);        // painted unrotated; the angle comes from CSS
      hubDirty = true;
    }
    if (hubDirty) {
      hubDirty = false;
      hubCtx.clearRect(0, 0, size, size);
      paintCenter(hubCtx, cx, cy, R, spinning ? 0.85 : 1, flap);
    }
  }

  function paintCenter(c, cx, cy, R, alpha, flapAng) {
    var cr = R * 0.15, d = cr * 1.75, phi = Math.acos(cr / d);
    c.save();
    c.globalAlpha = alpha;
    c.translate(cx, cy);
    c.rotate(-flapAng * 0.55);
    c.shadowColor = 'rgba(0,0,0,.35)';
    c.shadowBlur = R * 0.04;
    c.shadowOffsetY = R * 0.01;
    c.beginPath();
    c.moveTo(0, -d);
    c.lineTo(cr * Math.cos(-Math.PI / 2 + phi), cr * Math.sin(-Math.PI / 2 + phi));
    c.arc(0, 0, cr, -Math.PI / 2 + phi, 1.5 * Math.PI - phi, false);
    c.closePath();
    c.fillStyle = state.s.centerColor;
    c.strokeStyle = state.s.centerColor;
    c.lineJoin = 'round';
    c.lineWidth = R * 0.03;
    c.fill();
    c.stroke();
    c.restore();
    c.save();
    c.globalAlpha = alpha;
    var label = state.s.centerText || t('spin').toUpperCase();
    var fs = cr * 0.42;
    c.font = '800 ' + fs + 'px ' + FONT;
    while (c.measureText(label).width > cr * 1.6 && fs > 6 * dpr) {
      fs -= 1;
      c.font = '800 ' + fs + 'px ' + FONT;
    }
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillStyle = lum(state.s.centerColor) > 0.6 ? '#111827' : '#ffffff';
    c.fillText(label, cx, cy + fs * 0.04);
    c.restore();
  }

  function drawPointer() { /* the pointer is now the teardrop above the hub (see paintCenter) */ }

  function indexAt() {
    var s = slices();
    if (!s.length) return -1;
    var p = mod(-Math.PI / 2 - rot, TAU);
    for (var i = 0; i < s.length; i++) { if (p < s[i].start + s[i].ang) return i; }
    return s.length - 1;
  }

  function ease(x) {
    var a = Math.min(1, x / 0.07);
    return (1 - Math.pow(1 - x, 4)) * (a * a * (3 - 2 * a));
  }

  function frame(now) {
    requestAnimationFrame(frame);
    var dt = Math.min(64, now - lastT || 16);
    lastT = now;
    if (spinning) {
      var x = Math.min(1, (now - spinStart) / spinDur);
      rot = spinFrom + spinDelta * ease(x);
      var idx = indexAt();
      if (idx !== lastIdx) { lastIdx = idx; flap = 1; AudioFX.tick(); }
      hubDirty = true;
      if (x >= 1) {
        spinning = false;
        rot = mod(rot, TAU);
        updateSpinUI();
        onFinish();
      }
    } else if (state.s.idle && !reduceMotion && !modalOpen()) {
      rot = mod(rot + dt * 0.0004, TAU);
    }
    if (flap > 0) { flap = Math.max(0, flap - dt / 140); hubDirty = true; }
    if (dirty || hubDirty) draw();

    var deg = rot * 180 / Math.PI;
    if (deg !== rotApplied) {
      rotApplied = deg;
      canvas.style.transform = 'rotate(' + deg + 'deg)';
    }
  }

  function spin() {
    if (spinning || modalOpen()) return;
    var s = slices();
    if (state.mode === 'custom' && s.length < 2) { toast(t('minEntries')); return; }
    if (!s.length) return;
    AudioFX.unlock();
    var turns = Math.floor(3 + state.s.duration * state.s.speed * 0.3);
    var target = rand() * TAU;                      // wheel-frame angle that will end up under the pointer
    var finalRot = mod(-Math.PI / 2 - target, TAU);
    spinFrom = rot;
    spinDelta = mod(finalRot - rot, TAU) + turns * TAU;
    spinDur = state.s.duration * 1000;
    spinStart = performance.now();
    spinning = true;
    lastIdx = indexAt();
    updateSpinUI();
    try { document.dispatchEvent(new CustomEvent('ynw:spin-start')); } catch (e) { /* ignore */ }
  }

  function updateSpinUI() {
    $('#spinBtn').disabled = spinning;
    canvas.style.cursor = spinning ? 'default' : 'pointer';
  }

  /* ---------------------------------------------------------------- result */
  var currentWinner = null, revealed = true, lastFocus = null;
  var modal = $('#resultModal');
  function modalOpen() { return !modal.hidden; }

  function onFinish() {
    var s = slices(), w = s[indexAt()];
    if (!w) return;
    state.history.unshift({ label: w.label, key: w.key, t: Date.now(), mode: state.mode });
    if (state.history.length > 200) state.history.length = 200;
    if (state.mode === 'yesno') state.yn.tally[w.key] = (state.yn.tally[w.key] || 0) + 1;
    else if (state.action === 'accumulation') state.wins[w.label] = (state.wins[w.label] || 0) + 1;
    track('spin', state.mode === 'yesno'
      ? { tool: TOOL, template: TEMPLATE, mode: 'yesno', outcome: w.key }
      : { tool: TOOL, template: TEMPLATE, mode: 'custom', segments: s.length });
    save();
    renderTally();
    renderResults();
    currentWinner = w;
    revealed = !(state.mode === 'custom' && state.mysteryResult);
    lastFocus = document.activeElement;
    renderResultModal();
    modal.hidden = false;
    focusModal();
    /* tags.js starts analytics and AdSense here: the wheel has stopped and the
       visitor is reading the result, so the parsing cannot stall a spin. */
    try { document.dispatchEvent(new CustomEvent('ynw:spin-end')); } catch (e) { /* ignore */ }
    if (revealed) celebrate();
  }

  function celebrate() { AudioFX.fanfare(); confettiBurst(); }

  function focusModal() {
    var b = $('#resultActions button');
    if (b) b.focus();
  }

  function renderResultModal() {
    var w = currentWinner;
    if (!w) return;
    var body = $('#resultBody'), meta = $('#resultMeta'), act = $('#resultActions');
    if (!revealed) {
      body.innerHTML = '<div class="mystery-q">?</div>';
      meta.textContent = '';
      act.innerHTML = '<button class="btn primary big" type="button" data-act="reveal">' + esc(t('tapReveal')) + '</button>';
      return;
    }
    var img = w.img ? '<img class="result-img" src="' + esc(w.img) + '" alt="">' : '';
    body.innerHTML = img + '<div>' + esc(w.label) + '</div>';
    meta.textContent = (state.mode === 'custom' && state.action === 'accumulation') ? (state.wins[w.label] || 0) + ' ' + t('wins') : '';
    var h = '<button class="btn primary" type="button" data-act="done">' + esc(t('done')) + '</button>';
    if (state.mode === 'custom' && state.action === 'elimination' && w.id) {
      h += '<button class="btn" type="button" data-act="hide">' + esc(t('hideChoice')) + '</button>';
      h += '<button class="btn" type="button" data-act="hideall">' + esc(t('hideAll')) + '</button>';
    }
    act.innerHTML = h;
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    if (lastFocus && document.contains(lastFocus) && lastFocus !== canvas) { try { lastFocus.focus(); } catch (e) { /* ignore */ } }
  }

  function hideChoice(all) {
    if (!currentWinner) return;
    var en = state.entries.filter(function (x) { return x.id === currentWinner.id; })[0];
    if (!en) return;
    if (all) {
      var k = en.text.trim().toLowerCase();
      state.entries.forEach(function (x) { if (x.text.trim().toLowerCase() === k) x.hidden = true; });
    } else en.hidden = true;
    closeModal();
    changed();
    renderList();
    renderCustomPanel();
  }

  $('#resultActions').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var a = b.dataset.act;
    if (a === 'done') closeModal();
    else if (a === 'hide') hideChoice(false);
    else if (a === 'hideall') hideChoice(true);
    else if (a === 'reveal') { revealed = true; renderResultModal(); focusModal(); celebrate(); }
  });
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

  /* -------------------------------------------------------------- confetti */
  var cc = $('#confetti'), cctx = cc.getContext('2d');
  var parts = [], cfRunning = false;

  function confettiBurst() {
    if (!state.s.confetti || reduceMotion) return;
    var d = Math.min(window.devicePixelRatio || 1, 2);
    cc.width = Math.round(innerWidth * d);
    cc.height = Math.round(innerHeight * d);
    var colors = pal().concat(['#ffffff', '#fde047']);
    for (var i = 0; i < 160; i++) {
      parts.push({
        x: cc.width / 2 + (Math.random() - 0.5) * cc.width * 0.3, y: cc.height * 0.45,
        vx: (Math.random() - 0.5) * 16 * d, vy: (-Math.random() * 15 - 4) * d, g: 0.38 * d,
        w: (6 + Math.random() * 6) * d, h: (4 + Math.random() * 6) * d,
        r: Math.random() * TAU, vr: (Math.random() - 0.5) * 0.35,
        color: colors[(Math.random() * colors.length) | 0], life: 0, max: 130 + Math.random() * 70
      });
    }
    if (!cfRunning) { cfRunning = true; requestAnimationFrame(cfStep); }
  }

  function cfStep() {
    cctx.clearRect(0, 0, cc.width, cc.height);
    parts = parts.filter(function (p) { return p.life < p.max && p.y < cc.height + 40; });
    parts.forEach(function (p) {
      p.life++;
      p.vy += p.g;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      cctx.save();
      cctx.globalAlpha = Math.min(1, (p.max - p.life) / 30);
      cctx.translate(p.x, p.y);
      cctx.rotate(p.r);
      cctx.fillStyle = p.color;
      cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cctx.restore();
    });
    if (parts.length) requestAnimationFrame(cfStep);
    else { cfRunning = false; cctx.clearRect(0, 0, cc.width, cc.height); }
  }

  /* ----------------------------------------------------------------- toast */
  var toastTimer;
  function toast(msg) {
    var el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }

  /* -------------------------------------------------------------- rendering */
  function updateTitleUI() {
    var title = state.title || (state.mode === 'yesno' ? (lang === 'en' ? t('h1yesno') : t('yesnoMode')) : t('customMode'));
    $('#stageTitle').textContent = title;
    var d = $('#stageDesc');
    d.textContent = state.desc;
    d.hidden = !state.desc;
    var ti = $('#titleInput');
    if (document.activeElement !== ti) ti.value = state.title;
    var st = $('#setTitle');
    if (document.activeElement !== st) st.value = state.title;
  }

  function renderMode() {
    $$('[data-mode]').forEach(function (b) {
      var on = b.dataset.mode === state.mode;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', String(on));
    });
    $('#ynPanel').hidden = state.mode !== 'yesno';
    $('#customPanel').hidden = state.mode !== 'custom';
    /* Showing or hiding the scoreboard changes the row the buttons must clear. */
    var wasHidden = $('#tally').hidden;
    $('#tally').hidden = state.mode !== 'yesno';
    if ($('#tally').hidden !== wasHidden) resize();
    updateTitleUI();
  }

  function renderYesNo() {
    $$('[data-three]').forEach(function (b) { b.classList.toggle('active', (b.dataset.three === '1') === state.yn.three); });
    $('#setsSelect').value = String(state.yn.sets);
  }

  function renderTally() {
    var keys = state.yn.three ? ['yes', 'no', 'maybe'] : ['yes', 'no'];
    $('#tallyItems').innerHTML = keys.map(function (k) {
      return '<span class="chip ' + k + '"><span>' + esc(t(k)) + '</span><b>' + (state.yn.tally[k] || 0) + '</b></span>';
    }).join('');
    /* A wider total makes the row wider, and it is centred: keep the end of it
       clear of the fullscreen button sitting over the stage's lower right. Wait
       for the new chips to be laid out, or the button is measured unpositioned
       and the row reserves the whole stage. */
    if (window.requestAnimationFrame) requestAnimationFrame(fitTallyGutter);
    else fitTallyGutter();
  }

  function renderCustomPanel() {
    $$('[data-view]').forEach(function (b) { b.classList.toggle('active', b.dataset.view === state.view); });
    $('#listView').hidden = state.view !== 'list';
    $('#textView').hidden = state.view !== 'text';
    $('#chkMysteryWheel').checked = state.mysteryWheel;
    $('#chkMysteryResult').checked = state.mysteryResult;
    $$('input[name="action"]').forEach(function (r) { r.checked = r.value === state.action; });
    var n = state.entries.filter(function (e) { return e.hidden; }).length;
    var rb = $('#btnRestore');
    rb.hidden = !n;
    rb.textContent = t('restoreHidden') + ' (' + n + ')';
    if (state.view === 'text') $('#entryText').value = serializeEntries();
  }

  function rowHtml(e) {
    var color = e.color || '#9ca3af';
    var showUrl = /^https?:/i.test(e.img) ? e.img : '';
    return '<li class="row' + (e.hidden ? ' is-hidden' : '') + '" data-id="' + e.id + '">' +
      '<span class="handle" title="' + esc(t('reorder')) + '">⠿</span>' +
      '<input type="color" class="c-color" value="' + (e.color || effectiveColor(e)) + '" title="' + esc(t('color')) + '">' +
      '<input type="text" class="c-text" maxlength="120" value="' + esc(e.text) + '" placeholder="' + esc(t('entryPh')) + '">' +
      '<input type="number" class="c-weight" min="0" max="999" step="0.5" value="' + e.weight + '" title="' + esc(t('weight')) + '">' +
      '<button type="button" class="mini c-img" title="' + esc(t('imageUrl')) + '">🖼</button>' +
      '<button type="button" class="mini c-eye" title="' + esc(t('toggleVisible')) + '">' + (e.hidden ? '🚫' : '👁') + '</button>' +
      '<button type="button" class="mini c-dup" title="' + esc(t('duplicate')) + '">⧉</button>' +
      '<button type="button" class="mini c-del" title="' + esc(t('remove')) + '">🗑</button>' +
      '<div class="img-row"' + (e.img ? '' : ' hidden') + '>' +
      (e.img ? '<img class="thumb" src="' + esc(e.img) + '" alt="">' : '') +
      '<input type="url" class="c-url" value="' + esc(showUrl) + '" placeholder="' + esc(t('imageUrl')) + '">' +
      '<button type="button" class="btn small c-upload">' + esc(t('uploadImage')) + '</button>' +
      '<input type="file" class="c-file" accept="image/*" hidden>' +
      (e.img ? '<button type="button" class="mini c-noimg" title="' + esc(t('remove')) + '">✕</button>' : '') +
      '</div></li>';
  }

  function effectiveColor(e) {
    var vis = state.entries.filter(function (x) { return !x.hidden && x.weight > 0 && (x.text.trim() || x.img); });
    var i = vis.indexOf(e);
    var p = pal();
    return p[(i < 0 ? state.entries.indexOf(e) : i) % p.length];
  }

  function renderList() {
    $('#entryList').innerHTML = state.entries.map(rowHtml).join('');
    applyFilter();
  }

  function applyFilter() {
    var q = $('#searchInput').value.trim().toLowerCase();
    $$('#entryList .row').forEach(function (r) {
      var en = byId(r.dataset.id);
      r.hidden = !!q && !(en && en.text.toLowerCase().indexOf(q) > -1);
    });
  }

  function byId(id) { return state.entries.filter(function (e) { return e.id === id; })[0]; }
  function idxOf(id) { for (var i = 0; i < state.entries.length; i++) if (state.entries[i].id === id) return i; return -1; }

  function fmtTime(ts) {
    try { return new Date(ts).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
  }

  function renderResults() {
    var wins = Object.keys(state.wins).map(function (k) { return [k, state.wins[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 50);
    var showLb = state.mode === 'custom' && (state.action === 'accumulation' || wins.length > 0);
    $('#leaderboardBox').hidden = !showLb;
    var max = wins.length ? wins[0][1] : 1;
    $('#leaderboardList').innerHTML = wins.map(function (w) {
      return '<li><i class="bar" style="width:' + Math.round(w[1] / max * 100) + '%"></i><span>' + esc(w[0]) + '</span><b>' + w[1] + '</b></li>';
    }).join('') || '<li><span>' + esc(t('noResults')) + '</span></li>';
    $('#historyList').innerHTML = state.history.slice(0, 50).map(function (h) {
      var label = h.mode === 'yesno' && h.key ? t(h.key) : h.label;
      return '<li><span>' + esc(label) + '</span><time>' + esc(fmtTime(h.t)) + '</time></li>';
    }).join('') || '<li><span class="empty">' + esc(t('noResults')) + '</span></li>';
  }

  function renderSettings() {
    var s = state.s;
    $('#setDuration').value = s.duration;
    $('#durVal').textContent = s.duration + 's';
    $('#setSpeed').value = s.speed;
    $('#speedVal').textContent = String(s.speed);
    $('#setIdle').checked = s.idle;
    $('#setTick').checked = s.tick;
    $('#setVictory').checked = s.victory;
    $('#setConfetti').checked = s.confetti;
    $('#setDark').checked = s.theme === 'dark';
    $('#setPalette').value = s.palette;
    var cp = $('#customPalette');
    cp.hidden = s.palette !== 'custom';
    cp.innerHTML = s.custom.map(function (c, i) { return '<input type="color" data-i="' + i + '" value="' + c + '">'; }).join('');
    $('#setPageBg').value = s.pageBg || '#fff4dc';
    $('#setCenterText').value = s.centerText;
    $('#setCenterColor').value = s.centerColor;
    var sd = $('#setDesc');
    if (document.activeElement !== sd) sd.value = state.desc;
    var st = $('#setTitle');
    if (document.activeElement !== st) st.value = state.title;
  }

  function applyTheme() {
    var root = document.documentElement;
    root.dataset.theme = state.s.theme;
    if (state.s.pageBg) {
      root.style.setProperty('--bg', state.s.pageBg);
      root.style.setProperty('--stage-text', lum(state.s.pageBg) > 0.5 ? '#111827' : '#f8fafc');
    } else {
      root.style.removeProperty('--bg');
      root.style.removeProperty('--stage-text');
    }
  }

  function renderAll() {
    renderMode();
    renderYesNo();
    renderTally();
    renderCustomPanel();
    renderList();
    renderResults();
    renderSettings();
    applyTheme();
    if (modalOpen()) renderResultModal();
  }

  /* ------------------------------------------------------------ text mode */
  function serializeEntries() {
    return state.entries.map(function (e) {
      var needsW = e.weight !== 1 || /^\s*\d+(\.\d+)?\s*,/.test(e.text);
      return (needsW ? e.weight + ', ' : '') + e.text;
    }).join('\n');
  }

  function parseLine(line) {
    if (!line.trim()) return null;
    var m = line.match(/^\s*(\d+(?:\.\d+)?)\s*,\s*(.*)$/);
    if (m) return { weight: parseFloat(m[1]), text: m[2].trim() };
    return { weight: 1, text: line.trim() };
  }

  function syncFromText(value) {
    var lines = value.split(/\r?\n/).map(parseLine).filter(Boolean).slice(0, 500);
    var old = state.entries.slice(), used = {};
    var res = lines.map(function (l) { return { l: l, e: null }; });
    res.forEach(function (r) {
      for (var i = 0; i < old.length; i++) {
        if (!used[old[i].id] && old[i].text === r.l.text) { r.e = old[i]; used[old[i].id] = true; break; }
      }
    });
    var left = old.filter(function (o) { return !used[o.id]; });
    res.forEach(function (r) { if (!r.e && left.length) r.e = left.shift(); });
    state.entries = res.map(function (r) {
      var e = r.e || mkEntry({});
      e.text = r.l.text.slice(0, 120);
      e.weight = clamp(r.l.weight, 0, 999);
      return e;
    });
    changed();
    /* Keep the editable list in step when entries are set from outside the list view (tool presets). */
    if (state.view !== 'text') renderList();
  }

  /* --------------------------------------------------------- import/export */
  function parseCSV(text) {
    var rows = [], row = [], cur = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cur); cur = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cur); cur = ''; rows.push(row); row = [];
      } else cur += c;
    }
    if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (x) { return x.trim() !== ''; }); });
  }

  function csvCell(v) {
    v = String(v);
    return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }

  function download(name, mime, content) {
    var b = new Blob([content], { type: mime + ';charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  function importText(name, text) {
    text = text.replace(/^\uFEFF/, '');
    var list = [];
    if (/\.json$/i.test(name)) {
      var o = JSON.parse(text);
      var arr = Array.isArray(o) ? o : o.entries;
      if (!Array.isArray(arr)) throw new Error('bad json');
      list = arr.map(function (x) { return typeof x === 'string' ? { text: x } : x; });
      if (!Array.isArray(o) && typeof o.title === 'string') state.title = o.title.slice(0, 80);
      if (!Array.isArray(o) && typeof o.description === 'string') state.desc = o.description.slice(0, 300);
    } else {
      var rows = parseCSV(text);
      var h = rows[0] && rows[0].map(function (c) { return c.trim().toLowerCase(); });
      if (h && h[0] === 'text' && h[1] === 'weight') {
        rows.slice(1).forEach(function (r) {
          list.push({ text: r[0], weight: parseFloat(r[1]), color: r[2], hidden: r[3] === '1' || r[3] === 'true' });
        });
      } else {
        text.split(/\r?\n/).forEach(function (l) { var p = parseLine(l); if (p) list.push(p); });
      }
    }
    list = list.slice(0, 500).map(mkEntry).filter(function (e) { return e.text.trim() || e.img; });
    if (!list.length) throw new Error('empty');
    state.entries = list;
  }

  function fileToThumb(file) {
    return new Promise(function (res, rej) {
      var fr = new FileReader();
      fr.onerror = rej;
      fr.onload = function () {
        var im = new Image();
        im.onerror = rej;
        im.onload = function () {
          var S = 128, c = document.createElement('canvas');
          c.width = c.height = S;
          var x = c.getContext('2d'), sc = Math.max(S / im.width, S / im.height);
          var w = im.width * sc, h = im.height * sc;
          x.drawImage(im, (S - w) / 2, (S - h) / 2, w, h);
          res(c.toDataURL('image/jpeg', 0.82));
        };
        im.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  /* -------------------------------------------------------------- share */
  function shareBase() {
    return /^https?:/.test(location.protocol) ? location.origin + location.pathname : BASE_URL;
  }
  function shareObj() {
    return {
      v: 1, l: lang, m: state.mode, t: state.title, d: state.desc, a: state.action,
      mw: +state.mysteryWheel, mr: +state.mysteryResult,
      y: { th: +state.yn.three, s: state.yn.sets },
      s: { du: state.s.duration, sp: state.s.speed, pa: state.s.palette, cu: state.s.custom, th: state.s.theme, bg: state.s.pageBg, ct: state.s.centerText, cc: state.s.centerColor, id: +state.s.idle },
      e: state.entries.map(function (e) { return [e.text, e.weight, e.color || '', +e.hidden, /^https?:/i.test(e.img) ? e.img : '']; })
    };
  }
  function updateShare() {
    var data = encodeShare(shareObj());
    var base = shareBase() + '?lang=' + lang;
    $('#shareLink').value = base + '#s=' + data;
    $('#embedCode').value = '<iframe src="' + base + '#s=' + data + '&embed=1" width="600" height="700" style="border:0;max-width:100%" loading="lazy" allow="fullscreen" title="YesNoWheel"></iframe>';
  }
  function copyText(value) {
    var done = function () { toast(t('copied')); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(done, function () { fallbackCopy(value); done(); });
    } else { fallbackCopy(value); done(); }
  }
  function fallbackCopy(value) {
    var ta = document.createElement('textarea');
    ta.value = value;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    ta.remove();
  }

  /* ------------------------------------------------- drawer / presentation */
  var drawer = $('#drawer'), scrim = $('#scrim');
  function drawerOpen() { return drawer.classList.contains('open'); }
  function openDrawer() {
    renderSettings();
    updateShare();
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    scrim.hidden = false;
    $('#btnCloseDrawer').focus();
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    scrim.hidden = true;
    $('#btnSettings').focus();
  }
  function setPresent(on) {
    document.body.classList.toggle('present', on);
    if (on) {
      if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () { /* class-only fallback */ });
    } else if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(function () { /* ignore */ });
    }
    setTimeout(resize, 50);
  }
  document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement && document.body.classList.contains('present')) setPresent(false);
  });

  /* ------------------------------------------------------------- events */
  function bindEvents() {
    // language
    var sel = $('#langSelect');
    sel.innerHTML = I.LANGS.map(function (l) { return '<option value="' + l.code + '">' + esc(l.name) + '</option>'; }).join('');
    sel.addEventListener('change', function () {
      lang = sel.value;
      applyI18n();
      if (drawerOpen()) updateShare();
      track('language_change', { language: lang });
    });

    // mode
    $$('[data-mode]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        if (spinning) return;
        /* the tool pages select their own wheel by clicking this tab on boot */
        if (ev.isTrusted && state.mode !== b.dataset.mode) track('wheel_mode', { tool: TOOL, template: TEMPLATE, mode: b.dataset.mode });
        state.mode = b.dataset.mode;
        changed();
        renderMode();
        renderResults();
        b.blur();
      });
    });

    // title / description
    function onTitle(e) { state.title = e.target.value.slice(0, 80); save(); updateTitleUI(); }
    $('#titleInput').addEventListener('input', onTitle);
    $('#setTitle').addEventListener('input', onTitle);
    $('#setDesc').addEventListener('input', function (e) { state.desc = e.target.value.slice(0, 300); save(); updateTitleUI(); });

    // tabs
    $$('[data-tab]').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-tab]').forEach(function (x) { x.classList.toggle('active', x === b); });
        $('#paneInputs').hidden = b.dataset.tab !== 'inputs';
        $('#paneResults').hidden = b.dataset.tab !== 'results';
      });
    });

    // spin
    $('#spinBtn').addEventListener('click', spin);
    /* The disc is turned by the compositor, so its own box grows and shifts as it
       spins; hit-test against the untransformed wrapper instead. */
    canvas.addEventListener('click', function (e) {
      var r = $('#wheelWrap').getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width * size, y = (e.clientY - r.top) / r.height * size;
      var g = geom();
      if (Math.hypot(x - g.cx, y - g.cy) < g.R * 0.17) spin();
    });
    canvas.addEventListener('pointermove', function (e) {
      if (spinning) return;
      var r = $('#wheelWrap').getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width * size, y = (e.clientY - r.top) / r.height * size;
      var g = geom();
      canvas.style.cursor = Math.hypot(x - g.cx, y - g.cy) < g.R * 0.17 ? 'pointer' : 'default';
    });

    // yes/no controls
    $$('[data-three]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (spinning) return;
        state.yn.three = b.dataset.three === '1';
        changed();
        renderYesNo();
        renderTally();
        b.blur();
      });
    });
    $('#setsSelect').addEventListener('change', function (e) {
      if (spinning) return;
      state.yn.sets = clamp(parseInt(e.target.value, 10) || 1, 1, 5);
      changed();
    });
    $('#btnResetTally').addEventListener('click', function () {
      state.yn.tally = { yes: 0, no: 0, maybe: 0 };
      save();
      renderTally();
    });

    // custom controls
    $$('[data-view]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.view = b.dataset.view;
        save();
        renderCustomPanel();
        b.blur();
      });
    });
    $('#entryText').addEventListener('input', function (e) { syncFromText(e.target.value); });
    $('#searchInput').addEventListener('input', applyFilter);
    $('#chkMysteryWheel').addEventListener('change', function (e) { state.mysteryWheel = e.target.checked; changed(); });
    $('#chkMysteryResult').addEventListener('change', function (e) { state.mysteryResult = e.target.checked; save(); });
    $$('input[name="action"]').forEach(function (r) {
      r.addEventListener('change', function () { if (r.checked) { state.action = r.value; save(); renderResults(); } });
    });

    $('#btnAdd').addEventListener('click', function () {
      state.entries.push(mkEntry({}));
      changed();
      renderList();
      var inputs = $$('#entryList .c-text');
      if (inputs.length) inputs[inputs.length - 1].focus();
    });
    $('#btnShuffle').addEventListener('click', function () {
      for (var i = state.entries.length - 1; i > 0; i--) {
        var j = Math.floor(rand() * (i + 1)), tmp = state.entries[i];
        state.entries[i] = state.entries[j];
        state.entries[j] = tmp;
      }
      changed(); renderList(); renderCustomPanel();
    });
    $('#btnSort').addEventListener('click', function () {
      state.entries.sort(function (a, b) { return a.text.localeCompare(b.text, lang); });
      changed(); renderList(); renderCustomPanel();
    });
    $('#btnDelEmpty').addEventListener('click', function () {
      state.entries = state.entries.filter(function (e) { return e.text.trim() || e.img; });
      changed(); renderList(); renderCustomPanel();
    });
    $('#btnClear').addEventListener('click', function () {
      if (!confirm(t('confirmSure'))) return;
      state.entries = [];
      changed(); renderList(); renderCustomPanel();
    });
    $('#btnRestore').addEventListener('click', function () {
      state.entries.forEach(function (e) { e.hidden = false; });
      changed(); renderList(); renderCustomPanel();
    });
    $('#btnImport').addEventListener('click', function () { $('#fileInput').click(); });
    $('#fileInput').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!f) return;
      var fr = new FileReader();
      fr.onerror = function () { toast(t('importFail')); };
      fr.onload = function () {
        try {
          importText(f.name, String(fr.result));
          changed(); updateTitleUI(); renderList(); renderCustomPanel();
        } catch (err) { toast(t('importFail')); }
      };
      fr.readAsText(f);
    });
    $('#btnExportCsv').addEventListener('click', function () {
      var lines = ['text,weight,color,hidden'].concat(state.entries.map(function (e) {
        return [csvCell(e.text), e.weight, e.color || '', e.hidden ? 1 : 0].join(',');
      }));
      download('yesnowheel.csv', 'text/csv', '\uFEFF' + lines.join('\n'));
    });
    $('#btnExportJson').addEventListener('click', function () {
      download('yesnowheel.json', 'application/json', JSON.stringify({
        app: 'YesNoWheel', version: 1, title: state.title, description: state.desc,
        entries: state.entries.map(function (e) { return { text: e.text, weight: e.weight, color: e.color, hidden: e.hidden, img: e.img }; }),
        history: state.history, wins: state.wins
      }, null, 2));
    });

    // entry list (delegated)
    var list = $('#entryList');
    list.addEventListener('input', function (e) {
      var row = e.target.closest('.row');
      if (!row) return;
      var en = byId(row.dataset.id);
      if (!en) return;
      var c = e.target.classList;
      if (c.contains('c-text')) en.text = e.target.value;
      else if (c.contains('c-weight')) { var w = parseFloat(e.target.value); if (isFinite(w)) en.weight = clamp(w, 0, 999); else return; }
      else if (c.contains('c-color')) en.color = e.target.value;
      else if (c.contains('c-url')) en.img = /^https?:\/\//i.test(e.target.value.trim()) ? e.target.value.trim() : '';
      else return;
      changed();
    });
    list.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      var row = e.target.closest('.row');
      if (!b || !row) return;
      var en = byId(row.dataset.id), i = idxOf(row.dataset.id);
      if (!en) return;
      var c = b.classList;
      if (c.contains('c-del')) { state.entries.splice(i, 1); changed(); renderList(); renderCustomPanel(); }
      else if (c.contains('c-dup')) { var cp = mkEntry(en); state.entries.splice(i + 1, 0, cp); changed(); renderList(); }
      else if (c.contains('c-eye')) { en.hidden = !en.hidden; changed(); row.classList.toggle('is-hidden', en.hidden); b.textContent = en.hidden ? '🚫' : '👁'; renderCustomPanel(); }
      else if (c.contains('c-img')) { var ir = $('.img-row', row); ir.hidden = !ir.hidden; }
      else if (c.contains('c-upload')) { $('.c-file', row).click(); }
      else if (c.contains('c-noimg')) { en.img = ''; changed(); renderList(); }
    });
    list.addEventListener('change', function (e) {
      if (!e.target.classList.contains('c-file')) return;
      var row = e.target.closest('.row'), en = row && byId(row.dataset.id), f = e.target.files && e.target.files[0];
      if (!en || !f) return;
      fileToThumb(f).then(function (data) { en.img = data; changed(); renderList(); }, function () { toast(t('importFail')); });
    });

    // drag & drop reorder (grab the handle)
    var dragId = null;
    list.addEventListener('mousedown', function (e) {
      var h = e.target.closest('.handle');
      if (h) h.closest('.row').draggable = true;
    });
    document.addEventListener('mouseup', function () { $$('#entryList .row').forEach(function (r) { if (!dragId) r.draggable = false; }); });
    list.addEventListener('dragstart', function (e) {
      var r = e.target.closest('.row');
      if (!r || !r.draggable) { e.preventDefault(); return; }
      dragId = r.dataset.id;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', dragId);
      r.classList.add('dragging');
    });
    list.addEventListener('dragover', function (e) {
      if (!dragId) return;
      e.preventDefault();
      var r = e.target.closest('.row');
      $$('#entryList .row.over').forEach(function (x) { x.classList.remove('over'); });
      if (r && r.dataset.id !== dragId) r.classList.add('over');
    });
    list.addEventListener('drop', function (e) {
      e.preventDefault();
      var r = e.target.closest('.row');
      var from = dragId ? idxOf(dragId) : -1, to = r ? idxOf(r.dataset.id) : -1;
      dragId = null;
      if (from < 0 || to < 0 || from === to) return;
      var moved = state.entries.splice(from, 1)[0];
      state.entries.splice(to, 0, moved);
      changed();
      renderList();
    });
    list.addEventListener('dragend', function () {
      dragId = null;
      $$('#entryList .row').forEach(function (x) { x.draggable = false; x.classList.remove('dragging', 'over'); });
    });

    // results
    $('#btnClearHistory').addEventListener('click', function () {
      state.history = [];
      state.wins = {};
      save();
      renderResults();
    });
    $('#btnExportHistory').addEventListener('click', function () {
      var lines = ['time,mode,result'].concat(state.history.map(function (h) {
        return [new Date(h.t).toISOString(), h.mode, csvCell(h.mode === 'yesno' && h.key ? t(h.key) : h.label)].join(',');
      }));
      download('yesnowheel-results.csv', 'text/csv', '\uFEFF' + lines.join('\n'));
    });

    // settings drawer
    $('#btnSettings').addEventListener('click', openDrawer);
    $('#btnCloseDrawer').addEventListener('click', closeDrawer);
    scrim.addEventListener('click', closeDrawer);
    $('#btnFullscreen').addEventListener('click', function () { setPresent(true); });
    $('#exitPresent').addEventListener('click', function () { setPresent(false); });

    $('#setDuration').addEventListener('input', function (e) { state.s.duration = clamp(parseFloat(e.target.value) || 5, 1, 15); $('#durVal').textContent = state.s.duration + 's'; save(); });
    $('#setSpeed').addEventListener('input', function (e) { state.s.speed = clamp(parseFloat(e.target.value) || 5, 1, 10); $('#speedVal').textContent = String(state.s.speed); save(); });
    var checks = { setIdle: 'idle', setTick: 'tick', setVictory: 'victory', setConfetti: 'confetti' };
    Object.keys(checks).forEach(function (id) {
      $('#' + id).addEventListener('change', function (e) { state.s[checks[id]] = e.target.checked; save(); dirty = true; });
    });
    $('#setDark').addEventListener('change', function (e) { state.s.theme = e.target.checked ? 'dark' : 'light'; save(); applyTheme(); });
    $('#setPalette').addEventListener('change', function (e) {
      state.s.palette = e.target.value;
      state.entries.forEach(function (en) { en.color = null; });
      changed(); renderSettings(); renderList();
    });
    $('#customPalette').addEventListener('input', function (e) {
      var i = parseInt(e.target.dataset.i, 10);
      if (isNaN(i) || !isHex(e.target.value)) return;
      state.s.custom[i] = e.target.value;
      changed();
    });
    $('#setPageBg').addEventListener('input', function (e) { state.s.pageBg = e.target.value; save(); applyTheme(); });
    $('#btnResetBg').addEventListener('click', function () { state.s.pageBg = ''; save(); applyTheme(); $('#setPageBg').value = '#fff4dc'; });
    $('#setCenterText').addEventListener('input', function (e) { state.s.centerText = e.target.value.slice(0, 12); save(); dirty = true; });
    $('#setCenterColor').addEventListener('input', function (e) { state.s.centerColor = e.target.value; save(); dirty = true; });
    $('#btnCopyLink').addEventListener('click', function () { updateShare(); copyText($('#shareLink').value); });
    $('#btnCopyEmbed').addEventListener('click', function () { updateShare(); copyText($('#embedCode').value); });
    $('#btnResetAll').addEventListener('click', function () {
      if (!confirm(t('confirmSure'))) return;
      try { localStorage.removeItem(STORE); } catch (e) { /* ignore */ }
      location.replace(location.pathname + location.search);
    });

    // keyboard
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (modalOpen()) { closeModal(); e.preventDefault(); }
        else if (drawerOpen()) closeDrawer();
        else if (document.body.classList.contains('present')) setPresent(false);
        return;
      }
      if (e.key === ' ' || e.code === 'Space' || e.key === 'Enter') {
        var tg = e.target, tag = tg && tg.tagName;
        if (/^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(tag) || (tg && tg.isContentEditable)) return;
        if (modalOpen() || drawerOpen()) return;
        e.preventDefault();
        spin();
      }
    });

    if (window.ResizeObserver) new ResizeObserver(resize).observe($('#wheelWrap'));
    /* A title edit changes the stage height without resizing the wrapper. */
    if (window.ResizeObserver && $('#wheelArea')) new ResizeObserver(resize).observe($('#wheelArea'));
    window.addEventListener('resize', resize);
  }

  /* ------------------------------------------------------------------ boot */
  if (embed) document.body.classList.add('embed');
  bindEvents();
  applyI18n();
  /* a first visit accepts the banner after boot, so wait for that decision
     rather than losing the page event */
  document.addEventListener('ynw:consent', function (e) { if (e.detail && e.detail.granted) trackPage(); });
  trackPage();
  resize();
  /* Jost arrives after first paint; repaint the cached layers when it lands,
     and re-fit because the wider face changes how far the title reaches. */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { invalidate(); resize(); });
  requestAnimationFrame(frame);
})();
