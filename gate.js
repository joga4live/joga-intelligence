/* gate.js — Joga Intelligence
   Validación de códigos de licencia por hash SHA-256 (sin códigos en claro).
   License code validation via SHA-256 hash (no plaintext codes here).
   NUNCA agregar códigos en texto plano en este archivo.
   NEVER add plaintext codes in this file.
   Fase A (28-jul): de 71 hashes (1 maestro + 50 originales + 20 vendibles) a 1 solo —
   el código personal de José. Los 50 originales quedaron expuestos en el historial
   público de git y los 20 vendibles ya no hacen falta: cada venta futura (Fase B)
   generará el suyo, con su propia lista de apps.
   Phase A (Jul 28): from 71 hashes (1 master + 50 original + 20 sellable) down to just
   1 — José's personal code. The 50 originals were exposed in git's public history and
   the 20 sellable ones are no longer needed: each future sale (Phase B) will generate
   its own, with its own app list.
   Uso / usage: await window.jogaGate.validate(code) -> { valid, apps } */
(function () {
  "use strict";

  // Cada entrada: hash SHA-256 (hex, minúsculas) del código + qué apps abre.
  // Fase B añadirá más entradas (una por venta) sin tocar el resto de este archivo:
  // un código de app suelta traerá una lista de 1 app; el de las 6, la lista completa.
  // Each entry: SHA-256 hash (hex, lowercase) of the code + which apps it unlocks.
  // Phase B will add more entries (one per sale) without touching the rest of this
  // file: a single-app code will carry a 1-app list; the 6-app one, the full list.
  var ENTRIES = [
    {
      hash: "1569b405a3d87c672b34ffe27e9c520a287122da200ab0e65b1d8d93f7174ba1",
      // Código personal de José: abre las 6 apps de pago.
      // José's personal code: unlocks the 6 paid apps.
      apps: ["subment", "jogatime", "protoneutron", "pasley", "monexium", "ventmex"]
    }
  ];

  // bytes -> hex (minúsculas) / bytes -> hex (lowercase)
  function bufToHex(buf) {
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

  // Valida un código contra los hashes y dice QUÉ apps abre (no solo si es válido).
  // Nunca lanza error. Fase B extiende esto con caducidad/gracia sin rehacer la forma.
  // Validates a code against the hashes and says WHICH apps it opens (not just valid
  // or not). Never throws. Phase B extends this with expiry/grace without reshaping it.
  // Retorno / return: { valid: boolean, apps: string[] } — apps vacío si valid es false.
  // apps is empty when valid is false.
  async function validate(code) {
    try {
      if (!(window.crypto && window.crypto.subtle && window.crypto.subtle.digest)) {
        return { valid: false, apps: [] }; // fallback sin crypto.subtle / no-crypto fallback
      }
      var v = (code == null ? "" : String(code)).trim().toUpperCase();
      if (!v) return { valid: false, apps: [] };
      var hash = await sha256Hex(v);
      for (var i = 0; i < ENTRIES.length; i++) {
        if (ENTRIES[i].hash === hash) return { valid: true, apps: ENTRIES[i].apps.slice() };
      }
      return { valid: false, apps: [] };
    } catch (e) {
      return { valid: false, apps: [] };
    }
  }

  window.jogaGate = { validate: validate };
})();
