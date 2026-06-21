/* ============================================================
   TRIBUTO — runtime configuration (edit at DEPLOY time, no rebuild).
   The UI never hardcodes the backend. It reads the API base from
   here, so the same static bundle can point at any backend:
     - same origin (default):   apiBase: ""
     - separate API host:       apiBase: "https://api.tributo.gov.uk"
   You can also override at runtime without editing this file:
     - set window.TRIBUTO_CONFIG before this script loads, or
     - append ?api=https://host  to the URL (persisted to localStorage), or
     - add <meta name="tributo-api-base" content="https://host">.
   ============================================================ */
(function () {
  var cfg = window.TRIBUTO_CONFIG || {};

  // 1) <meta name="tributo-api-base" content="...">
  var meta = document.querySelector('meta[name="tributo-api-base"]');
  if (meta && meta.content) cfg.apiBase = meta.content;

  // 2) ?api=... query override (handy for demos / multi-env), persisted.
  try {
    var q = new URLSearchParams(window.location.search).get('api');
    if (q !== null) { cfg.apiBase = q; localStorage.setItem('tributo_api_base', q); }
    else if (cfg.apiBase == null) {
      var saved = localStorage.getItem('tributo_api_base');
      if (saved !== null) cfg.apiBase = saved;
    }
  } catch (e) {}

  // 3) Default: same origin as wherever the UI is served from.
  if (cfg.apiBase == null) cfg.apiBase = '';

  // Normalise: strip a trailing slash so `${apiBase}/api/...` is always clean.
  cfg.apiBase = String(cfg.apiBase).replace(/\/+$/, '');

  window.TRIBUTO_CONFIG = cfg;
  // Helper every page uses to build endpoint URLs.
  window.tributoApi = function (path) {
    return cfg.apiBase + (path.charAt(0) === '/' ? path : '/' + path);
  };
})();
