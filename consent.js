/* YesNoWheel cookie consent. Works with Google Consent Mode v2.
   Defaults are set inline in each page <head> (denied) before any Google tag loads. */
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
  var css = '#ynw-cc{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:560px;margin:0 auto;' +
    'background:var(--card,#fffaf0);color:var(--text,#1d1633);border:2px solid var(--ink,#1d1633);border-radius:14px;' +
    'box-shadow:0 8px 30px rgba(0,0,0,.25);padding:16px 18px;font:15px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}' +
    '#ynw-cc h2{margin:0 0 6px;font-size:17px}#ynw-cc p{margin:0 0 12px}#ynw-cc a{color:var(--primary,#7a4dff);text-decoration:underline}' +
    '#ynw-cc .ynw-row{display:flex;gap:10px;flex-wrap:wrap}' +
    '#ynw-cc button{flex:1 1 140px;cursor:pointer;font:inherit;font-weight:700;padding:10px 14px;border-radius:10px;border:2px solid var(--ink,#1d1633)}' +
    '#ynw-cc .acc{background:var(--primary,#7a4dff);color:var(--primary-text,#fff)}' +
    '#ynw-cc .rej{background:transparent;color:var(--text,#1d1633)}' +
    '#ynw-cc button:focus-visible{outline:3px solid var(--primary,#7a4dff);outline-offset:2px}';
  function close() { var el = document.getElementById('ynw-cc'); if (el) el.remove(); }
  function choose(granted) { save(granted ? 'granted' : 'denied'); apply(granted); close(); }
  function show() {
    if (document.getElementById('ynw-cc')) return;
    if (!document.getElementById('ynw-cc-css')) {
      var st = document.createElement('style'); st.id = 'ynw-cc-css'; st.textContent = css; document.head.appendChild(st);
    }
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
  function init() {
    var saved = read();
    if (saved === 'granted' || saved === 'denied') apply(saved === 'granted'); else show();
    var legal = document.querySelector('.sitefoot .cols > div:last-child');
    if (legal && !legal.querySelector('[data-cookie-settings]')) {
      var a = document.createElement('a'); a.href = '#'; a.textContent = 'Cookie settings'; a.setAttribute('data-cookie-settings', '');
      a.addEventListener('click', function (e) { e.preventDefault(); show(); });
      legal.appendChild(a);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
