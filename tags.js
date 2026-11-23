/* Third-party tags, loaded once the wheel is usable.
   gtag.js is ~180 KiB and the AdSense bundle another ~220 KiB of script, and
   together they cost more main-thread time than the wheel itself. Neither is
   fetched during first paint now: AdSense starts shortly after load, and
   analytics starts on the first interaction with a later fallback timer. The
   consent defaults in each page head still run before anything else, and every
   gtag command queues in dataLayer until the library arrives, so the page view
   is still recorded - it just does not block the wheel. */
(function () {
  'use strict';
  var GTAG = 'https://www.googletagmanager.com/gtag/js?id=G-P04LW13SBM';
  var ADS = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5783852883880667';
  var fired = {};

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-P04LW13SBM');

  function load(name, src, cross) {
    if (fired[name]) return;
    fired[name] = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    if (cross) s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  }
  function startAds() { load('ads', ADS, true); }
  function startAnalytics() { load('gtag', GTAG, false); }

  function afterLoad(fn) {
    if (document.readyState === 'complete') fn();
    else window.addEventListener('load', fn, { once: true });
  }

  afterLoad(function () {
    setTimeout(startAds, 2000);
    setTimeout(startAnalytics, 6000);
  });

  ['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(function (ev) {
    window.addEventListener(ev, function () { startAnalytics(); startAds(); }, { once: true, passive: true });
  });
})();
