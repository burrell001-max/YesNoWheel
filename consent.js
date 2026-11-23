/* YesNoWheel cookie consent. Works with Google Consent Mode v2.
   Defaults are set inline in each page <head> (denied) before any Google tag loads.
   The dialog styles ship in style.css; this file only builds the markup, so the
   banner can render on the first paint instead of after app.js boots. */
(function () {
  var KEY = 'ynw_consent_v1';
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function apply(granted) {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    var s = granted ? 'granted' : 'denied';
    gtag('consent', 'update', { ad_storage: s, ad_user_data: s, ad_personalization: s, analytics_storage: s });
  }
  function close() { var el = document.getElementById('ynw-cc'); if (el) el.remove(); }
  function choose(granted) { save(granted ? 'granted' : 'denied'); apply(granted); close(); }
  function show() {
    if (document.getElementById('ynw-cc')) return;
    var d = document.createElement('div');
    d.id = 'ynw-cc'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-labelledby', 'ynw-cc-t'); d.setAttribute('aria-live', 'polite');
    d.innerHTML = '<h2 id="ynw-cc-t">Your privacy choices</h2>' +
      '<p>We use cookies to measure traffic and, later, to show and measure ads. Your wheels and settings stay on your device either way. ' +
      'Accept to allow analytics and advertising cookies, or reject to keep them off. See our <a href="cookies.html">Cookie Policy</a> and <a href="privacy.html">Privacy Policy</a>.</p>' +
      '<div class="ynw-row"><button type="button" class="rej">Reject non-essential</button><button type="button" class="acc">Accept all</button></div>';
    d.querySelector('.acc').addEventListener('click', function () { choose(true); });
    d.querySelector('.rej').addEventListener('click', function () { choose(false); });
    document.body.appendChild(d);
  }
  window.openCookieSettings = show;

  function footerLink() {
    var legal = document.querySelector('.sitefoot .cols > div:last-child');
    if (legal && !legal.querySelector('[data-cookie-settings]')) {
      var a = document.createElement('a'); a.href = '#'; a.textContent = 'Cookie settings'; a.setAttribute('data-cookie-settings', '');
      a.addEventListener('click', function (e) { e.preventDefault(); show(); });
      legal.appendChild(a);
    }
  }

  var saved = read();
  if (saved === 'granted' || saved === 'denied') apply(saved === 'granted'); else show();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', footerLink); else footerLink();
})();
