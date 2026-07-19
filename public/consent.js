/* Cookie consent + Google Consent Mode v2.
   Loaded synchronously in <head> BEFORE gtag.js so the consent default is set
   before any measurement call. Injects its own styles and markup, so adding it
   to a page is a single <script> line. */
(function () {
  var KEY = 'sb-consent';                     // stored value: 'granted' | 'denied'
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) { /* private mode */ }

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  /* Denied by default: GA4 then sends cookieless pings until the visitor accepts. */
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: stored === 'granted' ? 'granted' : 'denied'
  });

  if (stored === 'denied') clearGaCookies();  // returning decliner — keep it clean
  if (stored) return;                         // already answered — no banner

  var CSS = [
    '#sb-consent{position:fixed;left:20px;bottom:20px;z-index:100;max-width:332px;',
    'background:var(--paper,#FBFAF5);border:1px solid var(--line-strong,#C9C5B6);border-radius:13px;',
    'padding:15px 16px 13px;box-shadow:0 18px 40px -22px rgba(19,18,24,.45);',
    'opacity:0;transform:translateY(8px);transition:opacity .22s ease,transform .22s ease}',
    '#sb-consent.in{opacity:1;transform:none}',
    '#sb-consent.out{opacity:0;transform:translateY(8px)}',
    '#sb-consent p{margin:0;font-family:"JetBrains Mono",ui-monospace,monospace;font-size:12.5px;',
    'line-height:1.55;color:var(--soft,#56544D)}',
    '#sb-consent p a{color:var(--violet,#5B3DF5);text-decoration:none;border-bottom:1px solid transparent}',
    '#sb-consent p a:hover{border-bottom-color:currentColor}',
    '#sb-consent .sb-row{display:flex;gap:8px;margin-top:13px}',
    '#sb-consent button{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:11.5px;font-weight:500;',
    'padding:7px 13px;border-radius:8px;cursor:pointer;border:1px solid var(--ink,#111110);',
    'transition:transform .12s ease,box-shadow .12s ease}',
    '#sb-consent button:hover{transform:translateY(-1px);box-shadow:2px 2px 0 var(--violet,#5B3DF5)}',
    '#sb-consent button:focus-visible{outline:2px solid var(--violet,#5B3DF5);outline-offset:2px}',
    '#sb-consent .sb-yes{background:var(--ink,#111110);color:var(--paper,#FBFAF5)}',
    '#sb-consent .sb-no{background:transparent;color:var(--ink,#111110)}',
    '#sb-consent .sb-no:hover{box-shadow:2px 2px 0 var(--ink,#111110)}',
    '@media (max-width:540px){#sb-consent{left:16px;right:16px;bottom:16px;max-width:none}}',
    '@media (prefers-reduced-motion:reduce){#sb-consent,#sb-consent button{transition:none}}'
  ].join('');

  /* Consent Mode stops GA from writing new cookies, but any _ga cookie set on an
     earlier visit survives for ~2 years. Declining has to clear those too. The
     domain GA used isn't knowable from here, so expire the name against every
     candidate: host-only, the host, and each parent domain. */
  function clearGaCookies() {
    var host = location.hostname;
    var domains = [''], parts = host.split('.'), i;
    for (i = 0; i < parts.length - 1; i++) domains.push('.' + parts.slice(i).join('.'));
    domains.push(host);
    document.cookie.split('; ').forEach(function (c) {
      var name = c.split('=')[0];
      if (name.indexOf('_ga') !== 0) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' +
          (d ? '; domain=' + d : '');
      });
    });
  }

  function decide(choice) {
    try { localStorage.setItem(KEY, choice); } catch (e) {}
    gtag('consent', 'update', { analytics_storage: choice });
    if (choice === 'denied') clearGaCookies();
    var el = document.getElementById('sb-consent');
    if (!el) return;
    el.className = 'out';
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 240);
  }

  function build() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var box = document.createElement('div');
    box.id = 'sb-consent';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Cookie notice');
    box.innerHTML =
      '<p>Analytics cookies help us see which pages land. Nothing personal, ' +
      'nothing about what you type. <a href="/privacy">Details</a>.</p>' +
      '<div class="sb-row">' +
        '<button type="button" class="sb-yes">Accept</button>' +
        '<button type="button" class="sb-no">No thanks</button>' +
      '</div>';
    document.body.appendChild(box);

    box.querySelector('.sb-yes').addEventListener('click', function () { decide('granted'); });
    box.querySelector('.sb-no').addEventListener('click', function () { decide('denied'); });

    requestAnimationFrame(function () { box.className = 'in'; });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
