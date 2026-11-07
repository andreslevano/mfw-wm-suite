/* @ds-bundle: {"format":4,"namespace":"MFW","components":[]} */
(function () {
  var ICONS = {"entradas": "<path d=\"M12 17V3\"/> <path d=\"m6 11 6 6 6-6\"/> <path d=\"M19 21H5\"/>", "salidas": "<path d=\"m18 9-6-6-6 6\"/> <path d=\"M12 3v14\"/> <path d=\"M5 21h14\"/>", "inventario": "<path d=\"M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z\"/> <path d=\"m7 16.5-4.74-2.85\"/> <path d=\"m7 16.5 5-3\"/> <path d=\"M7 16.5v5.17\"/> <path d=\"M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z\"/> <path d=\"m17 16.5-5-3\"/> <path d=\"m17 16.5 4.74-2.85\"/> <path d=\"M17 16.5v5.17\"/> <path d=\"M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z\"/> <path d=\"M12 8 7.26 5.15\"/> <path d=\"m12 8 4.74-2.85\"/> <path d=\"M12 13.5V8\"/>", "traspasos": "<path d=\"M8 3 4 7l4 4\"/> <path d=\"M4 7h16\"/> <path d=\"m16 21 4-4-4-4\"/> <path d=\"M20 17H4\"/>", "utilidades": "<path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"/> <path d=\"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6\"/> <rect x=\"6\" y=\"14\" width=\"12\" height=\"8\" rx=\"1\"/>", "scan": "<path d=\"M3 7V5a2 2 0 0 1 2-2h2\"/> <path d=\"M17 3h2a2 2 0 0 1 2 2v2\"/> <path d=\"M21 17v2a2 2 0 0 1-2 2h-2\"/> <path d=\"M7 21H5a2 2 0 0 1-2-2v-2\"/> <path d=\"M8 7v10\"/> <path d=\"M12 7v10\"/> <path d=\"M17 7v10\"/>", "barcode": "<path d=\"M3 5v14\"/> <path d=\"M8 5v14\"/> <path d=\"M12 5v14\"/> <path d=\"M17 5v14\"/> <path d=\"M21 5v14\"/>", "warehouse": "<path d=\"M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z\"/> <path d=\"M6 18h12\"/> <path d=\"M6 14h12\"/> <rect width=\"12\" height=\"12\" x=\"6\" y=\"10\"/>", "user": "<path d=\"M18 20a6 6 0 0 0-12 0\"/> <circle cx=\"12\" cy=\"10\" r=\"4\"/> <circle cx=\"12\" cy=\"12\" r=\"10\"/>", "logout": "<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"/> <polyline points=\"16 17 21 12 16 7\"/> <line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\"/>", "offline": "<path d=\"M12 20h.01\"/> <path d=\"M8.5 16.429a5 5 0 0 1 7 0\"/> <path d=\"M5 12.859a10 10 0 0 1 5.17-2.69\"/> <path d=\"M19 12.859a10 10 0 0 0-2.007-1.523\"/> <path d=\"M2 8.82a15 15 0 0 1 4.177-2.643\"/> <path d=\"M22 8.82a15 15 0 0 0-11.288-3.764\"/> <path d=\"m2 2 20 20\"/>", "produccion": "<path d=\"M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z\"/> <path d=\"M17 18h1\"/> <path d=\"M12 18h1\"/> <path d=\"M7 18h1\"/>", "maquila": "<path d=\"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z\"/> <path d=\"M12 22V12\"/> <path d=\"m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7\"/> <path d=\"m7.5 4.27 9 5.15\"/>", "entrega": "<path d=\"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2\"/> <path d=\"M15 18H9\"/> <path d=\"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14\"/> <circle cx=\"17\" cy=\"18\" r=\"2\"/> <circle cx=\"7\" cy=\"18\" r=\"2\"/>", "devolucion": "<path d=\"M9 14 4 9l5-5\"/> <path d=\"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11\"/>", "ots": "<rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\"/> <path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"/> <path d=\"M12 11h4\"/> <path d=\"M12 16h4\"/> <path d=\"M8 11h.01\"/> <path d=\"M8 16h.01\"/>", "ubicacion": "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\"/> <circle cx=\"12\" cy=\"10\" r=\"3\"/>", "etiqueta": "<path d=\"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z\"/> <circle cx=\"7.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"/>", "pending": "<circle cx=\"12\" cy=\"12\" r=\"10\"/>", "partial": "<path d=\"M10.1 2.182a10 10 0 0 1 3.8 0\"/> <path d=\"M13.9 21.818a10 10 0 0 1-3.8 0\"/> <path d=\"M17.609 3.721a10 10 0 0 1 2.69 2.7\"/> <path d=\"M2.182 13.9a10 10 0 0 1 0-3.8\"/> <path d=\"M20.279 17.609a10 10 0 0 1-2.7 2.69\"/> <path d=\"M21.818 10.1a10 10 0 0 1 0 3.8\"/> <path d=\"M3.721 6.391a10 10 0 0 1 2.7-2.69\"/> <path d=\"M6.391 20.279a10 10 0 0 1-2.69-2.7\"/>", "complete": "<circle cx=\"12\" cy=\"12\" r=\"10\"/> <path d=\"m9 12 2 2 4-4\"/>", "error": "<path d=\"m15 9-6 6\"/> <path d=\"M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z\"/> <path d=\"m9 9 6 6\"/>", "warning": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\"/> <path d=\"M12 9v4\"/> <path d=\"M12 17h.01\"/>", "blocked": "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"/> <path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/>", "info": "<circle cx=\"12\" cy=\"12\" r=\"10\"/> <path d=\"M12 16v-4\"/> <path d=\"M12 8h.01\"/>", "check": "<path d=\"M20 6 9 17l-5-5\"/>", "close": "<path d=\"M18 6 6 18\"/> <path d=\"m6 6 12 12\"/>", "plus": "<path d=\"M5 12h14\"/> <path d=\"M12 5v14\"/>", "minus": "<path d=\"M5 12h14\"/>", "chevron-down": "<path d=\"m6 9 6 6 6-6\"/>", "arrow-right": "<path d=\"M5 12h14\"/> <path d=\"m12 5 7 7-7 7\"/>", "search": "<circle cx=\"11\" cy=\"11\" r=\"8\"/> <path d=\"m21 21-4.3-4.3\"/>", "retry": "<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"/> <path d=\"M21 3v5h-5\"/> <path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"/> <path d=\"M8 16H3v5\"/>", "empty": "<polyline points=\"22 12 16 12 14 15 10 15 8 12 2 12\"/> <path d=\"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\"/>", "loading": "<path d=\"M21 12a9 9 0 1 1-6.219-8.56\"/>"};
  var esc = function (v) { return v == null ? '' : String(v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* Inline SVG icon (Lucide 0.460.0, ISC). Inherits currentColor. */
  function icon(name, label) {
    var body = ICONS[name] || ICONS.info;
    var a11y = label ? ' role="img" aria-label="' + esc(label) + '"' : ' aria-hidden="true"';
    return '<svg class="mfw-icon mfw-icon--' + esc(name) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' + a11y + '>' + body + '</svg>';
  }

  /* SAP ALPHA output conversion: strip leading zeros of purely numeric keys
     (MATNR 000000000001000123 -> 1000123, AUFNR 000001234567 -> 1234567). Non-numeric keys (HU00000009, A-01-02) stay. */
  function shortId(v) {
    var s = v == null ? '' : String(v);
    return /^\d+$/.test(s) ? (s.replace(/^0+/, '') || '0') : s;
  }
  /* Shortened id with the last 4 characters in bold (pickers check the tail); full value in title. */
  function idHTML(v) {
    var full = v == null ? '' : String(v), s = shortId(full);
    var cut = Math.max(0, s.length - 4);
    return '<span class="mfw-id" title="' + esc(full) + '">' + esc(s.slice(0, cut)) + '<b>' + esc(s.slice(cut)) + '</b></span>';
  }

  /* es-ES quantity with grouping always on (es-ES omits it for 4-digit numbers: 1000 vs 10.000). */
  var nf = {};
  function fmtQty(v, digits) {
    if (v == null || v === '') return '';
    var d = digits == null ? 3 : digits;
    var f = nf[d] || (nf[d] = new Intl.NumberFormat('es-ES', { maximumFractionDigits: d, useGrouping: 'always' }));
    var out = f.format(Number(v));
    /* engines without useGrouping:'always' fall back to es-ES min2 grouping; patch 4-digit integers */
    return /^-?\d{4}(,|$)/.test(out) ? out.replace(/^(-?\d)(\d{3})/, '$1.$2') : out;
  }

  /* Five tones; every domain status maps to one. Label always shown next to the icon. */
  var TONES = { pending: 'pending', partial: 'partial', complete: 'complete', error: 'error', blocked: 'blocked', cancelled: 'cancelled' };
  var TONE_ICON = { pending: 'pending', partial: 'partial', complete: 'complete', error: 'error', blocked: 'blocked', cancelled: 'close' };
  var STATUS = {
    /* TransferOrders.status */
    OPEN: ['pending', 'Abierta'], PARTIAL: ['partial', 'Parcial'], CONFIRMED: ['complete', 'Confirmada'], CANCELLED: ['cancelled', 'Anulada'],
    /* OutboundDocuments.pickStatus */
    PICKED: ['partial', 'Separado'], LOADED: ['partial', 'Cargado'], PGI_DONE: ['complete', 'SM contabilizada'],
    /* BinTransferRequests.status */
    CREATED: ['pending', 'Creado'], POSTED: ['complete', 'Contabilizado'], ERROR: ['error', 'Error'],
    /* StockItems.BESTQ */
    Q: ['blocked', 'En calidad'], S: ['blocked', 'Bloqueado']
  };
  function badge(statusOrTone, label) {
    var m = STATUS[statusOrTone], tone = m ? m[0] : (TONES[statusOrTone] || 'pending');
    var text = label || (m ? m[1] : statusOrTone);
    return '<span class="mfw-badge mfw-badge--' + tone + '">' + icon(TONE_ICON[tone]) + esc(text) + '</span>';
  }
  /* Derived tone for any done/total pair (ProductionOrders GWEMG/GAMNG, OT VERME/GAMNG). */
  function progressTone(done, total) { done = Number(done) || 0; total = Number(total) || 0; return done <= 0 ? 'pending' : done >= total ? 'complete' : 'partial'; }

  function progress(done, total, uom, next) {
    done = Number(done) || 0; total = Number(total) || 0; next = Number(next) || 0;
    var tone = progressTone(done, total), pct = total ? Math.min(100, done / total * 100) : 0;
    var nextPct = total ? Math.min(100 - pct, next / total * 100) : 0;
    var label = fmtQty(done) + ' de ' + fmtQty(total) + ' ' + (uom || '') + ' ingresados';
    return '<div class="mfw-progress" data-state="' + tone + '" role="progressbar" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + done + '" aria-label="' + esc(label) + '">' +
      '<div class="mfw-progress__track"><div class="mfw-progress__fill" style="width:' + pct + '%"></div>' +
      (nextPct ? '<div class="mfw-progress__next" style="left:' + pct + '%;width:' + nextPct + '%"></div>' : '') + '</div>' +
      '<div class="mfw-progress__text"><span><b>' + fmtQty(done) + '</b> / ' + fmtQty(total) + ' ' + esc(uom || '') + '</span><span>' +
      (tone === 'complete' ? 'Completo' : 'Pend. <b>' + fmtQty(total - done) + '</b>') + '</span></div></div>';
  }

  /* Toasts. kind: success | error | warning | info. Errors stay until dismissed; others close after 6 s. */
  function toast(opts) {
    var kind = opts.kind || 'info';
    var region = document.querySelector('.mfw-toasts--fixed');
    if (!region) { region = document.createElement('div'); region.className = 'mfw-toasts mfw-toasts--fixed'; region.setAttribute('aria-live', 'polite'); (document.querySelector('.mfw') || document.body).appendChild(region); }
    var ic = { success: 'complete', error: 'error', warning: 'warning', info: 'info' }[kind];
    var el = document.createElement('div');
    el.className = 'mfw-toast mfw-toast--' + kind;
    el.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    el.innerHTML = '<span class="mfw-toast__icon">' + icon(ic) + '</span><div><p class="mfw-toast__title">' + esc(opts.title) + '</p>' +
      (opts.meta ? '<p class="mfw-toast__meta">' + opts.meta + '</p>' : '') + '</div>' +
      '<button type="button" class="mfw-btn mfw-btn--ghost mfw-btn--icon" aria-label="Cerrar">' + icon('close') + '</button>';
    el.querySelector('button').onclick = function () { el.remove(); };
    region.prepend(el);
    if (kind !== 'error') setTimeout(function () { el.remove(); }, opts.timeout || 6000);
    if (opts.haptic !== false && navigator.vibrate) navigator.vibrate(kind === 'error' ? [80, 60, 80, 60, 80] : 40);
    return el;
  }
  /* Map a CAP PostingResult / ConfirmationResult / TransferResult / PrintResult onto a toast. */
  function toastResult(r) {
    var msgs = (r.messages || []).map(function (m) { return m.text; });
    var meta = [r.TANUM && 'OT <span class="mfw-mono">' + esc(r.TANUM) + '</span>', r.TAPOS && 'Pos. <span class="mfw-mono">' + esc(r.TAPOS) + '</span>',
      r.materialDoc && 'Doc. material <span class="mfw-mono">' + esc(r.materialDoc) + '/' + esc(r.year) + '</span>', r.spoolId && 'Spool <span class="mfw-mono">' + esc(r.spoolId) + '</span>'].filter(Boolean).join(' · ');
    var warn = (r.messages || []).some(function (m) { return m.severity === 'W'; });
    return toast({ kind: r.success ? (warn ? 'warning' : 'success') : 'error', title: msgs[0] || (r.success ? 'Operación realizada' : 'No se pudo completar la operación'), meta: meta });
  }

  /* Confirm dialog — replaces window.confirm(). Resolves true/false. */
  function confirmDialog(opts) {
    return new Promise(function (resolve) {
      var d = document.createElement('dialog');
      d.className = 'mfw-dialog';
      var rows = (opts.summary || []).map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');
      d.innerHTML = '<div class="mfw-dialog__body"><h2 class="mfw-dialog__title">' + esc(opts.title) + '</h2>' +
        (opts.text ? '<p class="mfw-dialog__text">' + esc(opts.text) + '</p>' : '') + (rows ? '<dl class="mfw-summary">' + rows + '</dl>' : '') + '</div>' +
        '<div class="mfw-dialog__foot"><button type="button" class="mfw-btn mfw-btn--secondary" value="0">' + esc(opts.cancel || 'Cancelar') + '</button>' +
        '<button type="button" class="mfw-btn ' + (opts.danger ? 'mfw-btn--danger' : 'mfw-btn--primary') + '" value="1">' + esc(opts.confirm || 'Confirmar') + '</button></div>';
      (document.querySelector('.mfw') || document.body).appendChild(d);
      d.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { d.close(b.value); } });
      d.addEventListener('close', function () { resolve(d.returnValue === '1'); d.remove(); });
      d.showModal();
      d.querySelector('[value="1"]').focus();
    });
  }

  /* Quantity stepper. el = .mfw-stepper; reads data-step, min/max on the input; flags values above data-soft-max (Máx. estiba). */
  function stepper(el) {
    var input = el.querySelector('input'), step = Number(el.dataset.step || 1);
    var minus = el.querySelector('[data-dir="-1"]'), plus = el.querySelector('[data-dir="1"]');
    function sync() {
      var v = Number(input.value || 0), min = input.min === '' ? -Infinity : Number(input.min), max = input.max === '' ? Infinity : Number(input.max);
      if (v < min) v = min; if (v > max) v = max; input.value = v;
      minus.disabled = v <= min; plus.disabled = v >= max;
      el.classList.toggle('is-over', el.dataset.softMax != null && v > Number(el.dataset.softMax));
    }
    el.addEventListener('click', function (e) { var b = e.target.closest('[data-dir]'); if (!b) return; input.value = Number(input.value || 0) + step * Number(b.dataset.dir); sync(); input.dispatchEvent(new Event('change', { bubbles: true })); });
    input.addEventListener('change', sync); sync();
    return { get value() { return Number(input.value); }, set value(v) { input.value = v; sync(); } };
  }

  /* Scan field. Keyboard-wedge scanners type fast and end with Enter (or Tab).
     opts.expect: value or function(v)->true|string(error). Calls opts.onScan(value). */
  function scanField(el, opts) {
    opts = opts || {};
    var input = el.querySelector('input'), state = el.querySelector('.mfw-scan__state');
    function set(s, text) { el.dataset.state = s; if (state) state.innerHTML = text || ''; }
    function commit() {
      var v = input.value.trim(); if (!v) return;
      var ok = true, msg = '';
      if (typeof opts.expect === 'function') { var r = opts.expect(v); ok = r === true; msg = ok ? '' : r; }
      else if (opts.expect != null) { ok = v === String(opts.expect); msg = ok ? '' : 'No coincide'; }
      if (ok) { set('ok', icon('check') + 'Leído'); if (navigator.vibrate) navigator.vibrate(30); if (opts.onScan) opts.onScan(v); }
      else { set('error', icon('error') + esc(msg)); if (navigator.vibrate) navigator.vibrate([80, 60, 80]); input.select(); }
    }
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === 'Tab') { if (input.value.trim()) { e.preventDefault(); commit(); } } });
    input.addEventListener('focus', function () { if (el.dataset.state !== 'error') set('ready', 'Listo'); });
    input.addEventListener('input', function () { if (el.dataset.state !== 'ready') set('ready', 'Listo'); });
    return { commit: commit, reset: function () { input.value = ''; set('idle', ''); } };
  }

  /* Turn a failed fetch into words a handler can act on. The deployed bug: approuter answers an
     expired session with its HTML login page, so res.json() throws "Unexpected token '<'". */
  async function getJSON(url) {
    var res;
    try { res = await fetch(url, { headers: { Accept: 'application/json' }, credentials: 'same-origin' }); }
    catch (e) { var off = new Error('Sin conexión con el servidor. Compruebe la red WiFi y reintente.'); off.kind = 'offline'; throw off; }
    var ct = res.headers.get('content-type') || '';
    if (res.status === 401 || (res.ok && ct.indexOf('json') < 0) || res.redirected) { var s = new Error('La sesión ha caducado. Vuelva a iniciar sesión para continuar.'); s.kind = 'session'; throw s; }
    if (!res.ok) { var body = await res.json().catch(function () { return {}; }); var e2 = new Error((body.error && body.error.message) || ('Error ' + res.status + ' del servidor')); e2.kind = 'server'; e2.status = res.status; throw e2; }
    return (await res.json()).value;
  }

  function state(kind, title, text, action) {
    var ic = { empty: 'empty', loading: 'loading', error: 'error', success: 'complete', offline: 'offline', session: 'user' }[kind] || 'info';
    var cls = kind === 'offline' || kind === 'session' ? 'error' : kind;
    return '<div class="mfw-state mfw-state--' + cls + '" role="' + (cls === 'error' ? 'alert' : 'status') + '"><div class="mfw-state__icon">' + icon(ic) + '</div>' +
      '<p class="mfw-state__title">' + esc(title) + '</p>' + (text ? '<p class="mfw-state__text">' + esc(text) + '</p>' : '') + (action || '') + '</div>';
  }

  /* Pick density from the device: coarse pointer + narrow = handheld (gloves). Users may override (Modo guantes). */
  function autoDensity(root) {
    root = root || document.documentElement;
    var coarse = matchMedia('(pointer: coarse)').matches, w = innerWidth;
    var d = coarse && w < 600 ? 'handheld' : (coarse || w < 1024) && w < 1100 ? 'tablet' : 'desktop';
    try { d = localStorage.getItem('mfw.density') || d; } catch (e) {}
    root.dataset.density = d; return d;
  }

  /* ---- Preview kit (design-system pages only; not needed in the app) ---- */
  var PV_CSS = '.pv{margin:0;padding:16px;background:var(--bg);color:var(--ink)}.pv-row{display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start}' +
    '.pv-frame{flex:none;display:grid;gap:8px;max-width:100%}.pv-frame[data-density=desktop]{flex:1 1 640px;min-width:0}' +
    '.pv-lbl{display:flex;gap:8px;align-items:center;font:600 11px/1.2 var(--font-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ink-muted)}' +
    '.pv-lbl::before{content:"";width:8px;height:8px;border-radius:2px;background:var(--ink-muted)}.pv-frame[data-density=handheld] .pv-lbl::before{background:var(--signal)}' +
    '.pv-body{display:grid;gap:12px;align-content:start;padding:12px;background:var(--bg);border:1px dashed var(--border-control);border-radius:12px;min-width:0}' +
    '.pv-frame[data-density=handheld] .pv-body{border-radius:20px;border-style:solid;border-width:2px}.pv-cap{margin:0;font:12px/1.4 var(--font-sans);color:var(--ink-muted)}';
  function frames(render, opts) {
    opts = opts || {};
    var st = document.createElement('style'); st.textContent = PV_CSS; document.head.appendChild(st);
    document.body.classList.add('mfw', 'pv');
    var sizes = opts.sizes || [['handheld', 360, 'Handheld · 360 px · guantes'], ['tablet', 600, 'Tablet · 600 px'], ['desktop', 0, 'Desktop']];
    var row = document.createElement('div'); row.className = 'pv-row';
    sizes.forEach(function (s) {
      var f = document.createElement('section'); f.className = 'pv-frame'; f.dataset.density = s[0]; if (s[1]) f.style.width = s[1] + 'px';
      f.innerHTML = '<div class="pv-lbl">' + esc(s[2]) + '</div><div class="pv-body">' + render(s[0]) + '</div>';
      row.appendChild(f);
    });
    document.body.appendChild(row);
    return row;
  }

  window.MFW = Object.assign(window.MFW || {}, {
    icon: icon, icons: Object.keys(ICONS), esc: esc, shortId: shortId, idHTML: idHTML, fmtQty: fmtQty,
    STATUS: STATUS, badge: badge, progressTone: progressTone, progress: progress,
    toast: toast, toastResult: toastResult, confirm: confirmDialog, stepper: stepper, scanField: scanField,
    getJSON: getJSON, state: state, autoDensity: autoDensity, _pv: { frames: frames }
  });
})();
