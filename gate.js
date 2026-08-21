/* gate.js — Joga Intelligence
   Validación: código de José (hash SHA-256 local, offline) primero, luego los 7 productos de Gumroad (POST /v2/licenses/verify, en paralelo). NUNCA códigos en claro aquí. / Validation: José's code (local SHA-256, offline) first, then the 7 Gumroad products (POST /v2/licenses/verify, in parallel). NEVER plaintext codes in this file.
   Historial / History: Fase A (28-jul/Jul 28) 71 hashes -> 1 (José). Fase B (05-ago AM/Aug 5 AM): + camino Gumroad, `productId` opcional / + Gumroad path, optional `productId`.
   Fase B-2 (05-ago PM/Aug 5 PM) — caducidad real / real expiry: un match de Gumroad deja jiLicense/jiProductId/jiLastCheck en localStorage; José no escribe nada de esto, sigue de por vida, intocado / a Gumroad match leaves jiLicense/jiProductId/jiLastCheck in localStorage; José writes none of it, still lifetime, untouched.
   Al cargar, revalida en silencio SOLO si ese trío existe: cierra el acceso si la suscripción terminó o el código fue revocado; 30 días de gracia sin red (pasada la gracia bloquea SIN borrar el trío, así se autorrestaura al volver el internet) / On load, silently revalidates ONLY if that trio exists: closes access if the subscription ended or the code was revoked; 30-day offline grace period (past grace it locks WITHOUT deleting the trio, so it self-restores once back online).
   Uso / usage: await window.jogaGate.validate(code) -> { valid, apps, productId? } */
(function () {
  "use strict";

  // Hash SHA-256 (hex) del código de José + apps que abre / José's code SHA-256 hash (hex) + apps it unlocks.
  var ENTRIES = [
    {
      hash: "1569b405a3d87c672b34ffe27e9c520a287122da200ab0e65b1d8d93f7174ba1",
      apps: ["subment", "jogatime", "protoneutron", "pasley", "monexium", "ventmex"]
    },
    {
      hash: "cf076b84ca88ed1e2d261d266b08e2351ab62817d260592c9293008cef7260a8",
      apps: ["subment", "jogatime", "protoneutron", "pasley", "monexium", "ventmex", "jogaflow"]
    }
  ];

  // Producto Gumroad -> apps que abre. 7 product_id reales, confirmados por José (ver .joga/handoff/estado.md) — no inventar ni cambiar. / Gumroad product -> apps it unlocks. 7 real product_ids, confirmed by José (see .joga/handoff/estado.md) — do not invent or change.
  var PRODUCTOS = [
    { id: "FIR5ex737E3w3ZhJSMYe6A==", apps: ["subment"] },      // JogaMind
    { id: "M0PlTeFr2uk-aJVy4oyoDw==", apps: ["jogatime"] },     // JogaTime
    { id: "lP0WU7xbXHpCH8FxYc-J5A==", apps: ["monexium"] },     // JogaCapital
    { id: "qeGGuidKBaAt-1dhMPM7vw==", apps: ["pasley"] },       // JogaPath
    { id: "4mNWy38AGMWXN3FtRIBc8Q==", apps: ["protoneutron"] }, // JogaBit
    { id: "91_zOPTy6LlBmvfvKi24Ww==", apps: ["ventmex"] },      // JogaVentix
    { id: "Rkm_T0TEEiq45fI1lzd4Rg==", // Acceso Completo (las 6 + bono JogaBody)
      apps: ["subment", "jogatime", "protoneutron", "pasley", "monexium", "ventmex", "jogaflow"] }
  ];

  // Las 6 apps de pago (igual a PAID_KEYS de app.html/index.html) / the 6 paid apps (same as app.html/index.html's PAID_KEYS).
  var PAID_KEYS = ["subment", "jogatime", "protoneutron", "pasley", "monexium", "ventmex"];
  var GRACE_MS = 30 * 24 * 60 * 60 * 1000; // gracia sin red / offline grace: 30 días/days

  function bufToHex(buf) { // bytes -> hex (minúsculas) / bytes -> hex (lowercase)
    var bytes = new Uint8Array(buf), hex = "";
    for (var i = 0; i < bytes.length; i++) {
      var h = bytes[i].toString(16);
      hex += h.length === 1 ? "0" + h : h;
    }
    return hex;
  }

  async function sha256Hex(str) {
    var data = new TextEncoder().encode(str);
    var digest = await crypto.subtle.digest("SHA-256", data);
    return bufToHex(digest);
  }

  // Única llamada real a Gumroad, la reutilizan verifyGumroad() y revalidate() (no duplicar el fetch). Nunca lanza error: networkError:true = sin red/JSON roto; networkError:false = sí hubo respuesta (data = JSON crudo, sin filtrar por res.ok — Gumroad responde 404 hasta para códigos inválidos pero SIEMPRE con JSON legible, confirmado con curl real). / The one real Gumroad call, reused by verifyGumroad() and revalidate() (don't duplicate the fetch). Never throws: networkError:true = no network/broken JSON; networkError:false = got an answer (data = raw JSON, not filtered by res.ok — Gumroad answers 404 even for invalid codes but ALWAYS with readable JSON, confirmed via real curl).
  async function callGumroad(productId, licenseKey) {
    try {
      var body = new URLSearchParams();
      body.set("product_id", productId);
      body.set("license_key", licenseKey);
      body.set("increment_uses_count", "false"); // no gastar el contador de usos / don't spend the uses counter
      var res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString()
      });
      if (!res) return { networkError: true };
      var data = await res.json();
      return { networkError: false, data: data || {} };
    } catch (e) {
      return { networkError: true };
    }
  }

  // Reduce callGumroad() a "coincide o no" para el validate() inicial. Nunca lanza error. / Reduces callGumroad() to "matched or not" for the initial validate() path. Never throws.
  async function verifyGumroad(productId, licenseKey) {
    var r = await callGumroad(productId, licenseKey);
    if (r.networkError) return null;
    return (r.data && r.data.success === true) ? r.data : null;
  }

  // Valida: hash local primero (offline); si no, los 7 de Gumroad en paralelo. Nunca lanza error. Retorno: { valid, apps, productId? }. / Validates: local hash first (offline); if not, all 7 Gumroad products in parallel. Never throws. Returns: { valid, apps, productId? }.
  async function validate(code) {
    try {
      if (!(window.crypto && window.crypto.subtle && window.crypto.subtle.digest)) {
        return { valid: false, apps: [] };
      }
      var v = (code == null ? "" : String(code)).trim().toUpperCase();
      if (!v) return { valid: false, apps: [] };

      // 1) José: hash local, offline, sin red. NUNCA escribe jiLicense/jiProductId/jiLastCheck — de por vida. / 1) José: local hash, offline, no network. NEVER writes jiLicense/jiProductId/jiLastCheck — lifetime.
      var hash = await sha256Hex(v);
      for (var i = 0; i < ENTRIES.length; i++) {
        if (ENTRIES[i].hash === hash) return { valid: true, apps: ENTRIES[i].apps.slice() };
      }

      // 2) No es José: los 7 de Gumroad en paralelo / 2) Not José: all 7 Gumroad products in parallel.
      if (!window.fetch) return { valid: false, apps: [] };
      var results = await Promise.all(PRODUCTOS.map(function (p) { return verifyGumroad(p.id, v); }));
      for (var j = 0; j < results.length; j++) {
        if (results[j]) {
          // Match de Gumroad: guarda el trío para revalidate() (abajo). Si localStorage falla (privado/cuota) no tumba esta validación válida. / Gumroad match: save the trio for revalidate() (below). If localStorage fails (private/quota) it must not break this valid result.
          try {
            localStorage.setItem("jiLicense", v);
            localStorage.setItem("jiProductId", PRODUCTOS[j].id);
            localStorage.setItem("jiLastCheck", String(Date.now()));
          } catch (e) {}
          return { valid: true, apps: PRODUCTOS[j].apps.slice(), productId: PRODUCTOS[j].id };
        }
      }
      return { valid: false, apps: [] };
    } catch (e) {
      return { valid: false, apps: [] };
    }
  }

  // ===== Fase B-2 — Revalidación silenciosa / silent revalidation =====
  // Escribe/borra jiUnlocked_<app> de un producto (+ jiPaid si cubre las 6 de pago, como applyUnlock en app.html/index.html). Nunca lanza error. / Writes/removes a product's jiUnlocked_<app> keys (+ jiPaid if it covers all 6 paid apps, like applyUnlock in app.html/index.html). Never throws.
  function setProductAccess(product, on) {
    try {
      var apps = product.apps || [];
      apps.forEach(function (k) {
        if (on) localStorage.setItem("jiUnlocked_" + k, "1"); else localStorage.removeItem("jiUnlocked_" + k);
      });
      if (PAID_KEYS.every(function (k) { return apps.indexOf(k) >= 0; })) {
        if (on) localStorage.setItem("jiPaid", "1"); else localStorage.removeItem("jiPaid");
      }
    } catch (e) {}
  }

  function clearTrio() { // borra el trío de revalidación / removes the revalidation trio
    try {
      localStorage.removeItem("jiLicense");
      localStorage.removeItem("jiProductId");
      localStorage.removeItem("jiLastCheck");
    } catch (e) {}
  }

  // Corre al cargar, fire-and-forget (no bloquea, no espera DOMContentLoaded). Solo llama a Gumroad si existe jiLicense + jiProductId — José y gratuitos nunca disparan red aquí. / Runs on load, fire-and-forget (doesn't block, no DOMContentLoaded wait). Only calls Gumroad if jiLicense + jiProductId exist — José and free users never trigger network here.
  async function revalidate() {
    try {
      var license, productId, lastCheck;
      try {
        license = localStorage.getItem("jiLicense");
        productId = localStorage.getItem("jiProductId");
        lastCheck = localStorage.getItem("jiLastCheck");
      } catch (e) { return; }
      if (!license || !productId) return; // José o gratuito: cero red / José or free: zero network
      if (!window.fetch) return;

      var product = null;
      for (var i = 0; i < PRODUCTOS.length; i++) {
        if (PRODUCTOS[i].id === productId) { product = PRODUCTOS[i]; break; }
      }
      if (!product) return; // product_id desconocido: no tocar nada / unknown product_id: touch nothing

      var r = await callGumroad(productId, license);

      if (r.networkError) {
        // Fallo de red: gracia de 30 días desde la última revalidación con éxito. / Network failure: 30-day grace since the last successful revalidation.
        var last = parseInt(lastCheck, 10);
        if (!last || isNaN(last)) return; // sin fecha confiable: no castigar / no reliable date: don't punish
        if (Date.now() - last <= GRACE_MS) return; // dentro de gracia: nada cambia / within grace: untouched
        setProductAccess(product, false); // fuera de gracia: bloquea, conserva el trío / past grace: lock, keep trio
        return;
      }

      var data = r.data || {};
      // subscription_ended_at vive dentro de "purchase" en la respuesta real de Gumroad (confirmado en .joga/handoff/investigacion-caducidad.md: doc oficial + librerías de terceros) — null/undefined/ausente = viva; string con fecha = terminada. / subscription_ended_at lives inside "purchase" in Gumroad's real response (confirmed in .joga/handoff/investigacion-caducidad.md: official docs + third-party libraries) — null/undefined/missing = alive; a date string = ended.
      var purchase = data.purchase || {};
      var alive = data.success === true && !purchase.subscription_ended_at;

      if (alive) {
        // Éxito y viva: refresca jiLastCheck, re-escribe las llaves / success and alive: refresh jiLastCheck, re-write keys.
        try { localStorage.setItem("jiLastCheck", String(Date.now())); } catch (e) {}
        setProductAccess(product, true);
      } else {
        // Terminada o success:false: cierre inmediato sin gracia, borra todo + el trío. / Ended or success:false: immediate close, no grace, wipes everything + the trio.
        setProductAccess(product, false);
        clearTrio();
      }
    } catch (e) {
      // nunca una excepción hacia afuera / never throw outward
    }
  }

  window.jogaGate = { validate: validate };
  revalidate();
})();
