/* Analytics, loaded once the wheel is usable.
   gtag.js is ~180 KiB and costs more main-thread time than the wheel itself, so
   it is not fetched during first paint: analytics starts on the first spin end,
   with a fallback timer for visitors who never spin. The consent defaults in
   each page head still run before anything else, and every gtag command queues
   in dataLayer until the library arrives, so the page view is still recorded -
   it just does not block the wheel.

   AdSense is no longer loaded here. Every page carries the static AdSense tag
   in its <head> so the review crawler finds it in the HTML source. Google Tag
   Manager has also been removed: it loaded a container with no GA4 or Ads tags
   in it, while the direct gtag.js below is what actually records visits. */
(function () {
  'use strict';
  var GTAG = 'https://www.googletagmanager.com/gtag/js?id=G-P04LW13SBM';
  var started = false;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-P04LW13SBM');

  /* Consent-gated events for app.js. The consent defaults in each page head stop
     Google storing anything, but a queued event is still a request, so nothing is
     pushed until the visitor has accepted analytics cookies; Reject, or a later
     change in Cookie settings, stops it again. Event names and fixed values only:
     custom wheel labels, titles and descriptions never leave the device. */
  window.ynwTrack = function (name, params) {
    var granted = false;
    try { granted = localStorage.getItem('ynw_consent_v1') === 'granted'; } catch (e) { /* private mode */ }
    if (!granted) return false;
    window.dataLayer = window.dataLayer || [];
    (function () { window.dataLayer.push(arguments); })('event', name, params || {});
    return true;
  };

  function startAnalytics() {
    if (started) return;
    started = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = GTAG;
    document.head.appendChild(s);
  }

  function afterLoad(fn) {
    if (document.readyState === 'complete') fn();
    else window.addEventListener('load', fn, { once: true });
  }

  /* Parsing gtag.js blocks the main thread for a moment, and on a phone that
     moment is long enough to freeze the wheel mid-spin. The app fires
     ynw:spin-end when a spin finishes, which is the first genuinely quiet
     point, so that is where analytics starts; visitors who never spin fall back
     to the timer below. */
  var busy = false;
  function whenQuiet(fn) {
    return function () { if (busy) setTimeout(whenQuiet(fn), 700); else fn(); };
  }
  document.addEventListener('ynw:spin-start', function () { busy = true; });
  document.addEventListener('ynw:spin-end', function () { busy = false; startAnalytics(); });
  afterLoad(function () { setTimeout(whenQuiet(startAnalytics), 6000); });
})();
