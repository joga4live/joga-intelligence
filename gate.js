/* gate.js — Joga Intelligence
   Validación de códigos de licencia: primero el código personal de José (hash
   SHA-256 local, offline, sin códigos en claro), y si no es ese, contra los 7
   productos reales de Gumroad (POST /v2/licenses/verify, en paralelo).
   License code validation: José's personal code first (local SHA-256 hash,
   offline, no plaintext codes), then — if it's not that — the 7 real Gumroad
   products (POST /v2/licenses/verify, in parallel).
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
   Fase B (05-ago): agrega el camino de Gumroad. El código de José se sigue probando
   primero y sigue funcionando exactamente igual, offline, sin tocar la red. Solo si NO
   es el código de José se consulta Gumroad. `validate()` sigue devolviendo
   { valid, apps } — se le suma un campo opcional `productId` cuando el acierto viene de
   Gumroad, sin quitar ni cambiar los dos campos que ya existían.
   Phase B (Aug 5): adds the Gumroad path. José's code is still tried first and still
   works exactly the same, offline, without touching the network. Only if it's NOT
   José's code does it query Gumroad. `validate()` still returns { valid, apps } — an
   optional `productId` field is added when the match comes from Gumroad, without
   removing or changing the two fields that already existed.
   Uso / usage: await window.jogaGate.validate(code) -> { valid, apps, productId? } */
(function () {
  "use strict";

  // Cada entrada: hash SHA-256 (hex, minúsculas) del código + qué apps abre.
  // Each entry: SHA-256 hash (hex, lowercase) of the code + which apps it unlocks.
  var ENTRIES = [
    {
      hash: "1569b405a3d87c672b34ffe27e9c520a287122da200ab0e65b1d8d93f7174ba1",
      // Código personal de José: abre las 6 apps de pago.
      // José's personal code: unlocks the 6 paid apps.
      apps: ["subment", "jogatime", "protoneutron", "pasley", "monexium", "ventmex"]
    }
  ];

  // Mapa producto de Gumroad -> qué apps abre. Los 7 product_id son los reales,
  // confirmados en pantalla por José (ver .joga/handoff/estado.md) — no inventar
  // ni cambiar estos valores. Las claves de apps son los nombres de archivo/variable
  // exactos que ya usa el resto del proyecto (no los nombres bonitos de marca).
  // Gumroad product -> apps it unlocks map. The 7 product_ids are the real ones,
  // confirmed on-screen by José (see .joga/handoff/estado.md) — do not invent or
  // change these values. The app keys are the exact file/variable names the rest of
  // the project already uses (not the pretty brand names).
  var PRODUCTOS = [
    { id: "FIR5ex737E3w3ZhJSMYe6A==", apps: ["subment"] },      // JogaMind
    { id: "MOPITeFr2uk-aJVy4oyoDw==", apps: ["jogatime"] },     // JogaTime
    { id: "IPOWU7xbXHpCH8FxYc-J5A==", apps: ["monexium"] },     // JogaCapital
    { id: "qeGGuidKBaAt-1dhMPM7vw==", apps: ["pasley"] },       // JogaPath
    { id: "4mNWy38AGMWXN3FtRIBc8Q==", apps: ["protoneutron"] }, // JogaBit
    { id: "91_zOPTy6LlBmvfvKi24Ww==", apps: ["ventmex"] },      // JogaVentix
    {
      id: "Rkm_T0TEEiq45fl1lzd4Rg==", // Acceso Completo (las 6 + bono JogaBody)
      apps: ["subment", "jogatime", "protoneutron", "pasley", "monexium", "ventmex", "jogaflow"]
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

  // Prueba un código contra UN producto de Gumroad. Nunca lanza error: cualquier
  // falla de red o respuesta inesperada se trata como "no coincide".
  // Tries a code against ONE Gumroad product. Never throws: any network failure or
  // unexpected response is treated as "no match".
  async function verifyGumroad(productId, licenseKey) {
    try {
      var body = new URLSearchParams();
      body.set("product_id", productId);
      body.set("license_key", licenseKey);
      body.set("increment_uses_count", "false"); // solo probar, no gastar el contador de usos
      var res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString()
      });
      // Ojo: Gumroad responde 404 (no 200) hasta para códigos inválidos, pero SIEMPRE
      // con un cuerpo JSON legible — confirmado con curl real contra un product_id de
      // este proyecto. Por eso no filtramos por res.ok: leemos el JSON pase lo que
      // pase con el status y decidimos solo por el campo success.
      // Careful: Gumroad answers 404 (not 200) even for invalid codes, but ALWAYS with
      // a readable JSON body — confirmed with a real curl call against one of this
      // project's product_ids. That's why we don't filter on res.ok: we read the JSON
      // no matter the status and decide only from the success field.
      if (!res) return null;
      var data = await res.json();
      return (data && data.success === true) ? data : null;
    } catch (e) {
      return null;
    }
  }

  // Valida un código: primero contra el hash local (offline), y si no coincide,
  // contra los 7 productos de Gumroad en paralelo. Nunca lanza error.
  // Validates a code: first against the local hash (offline), and if it doesn't
  // match, against the 7 Gumroad products in parallel. Never throws.
  // Retorno / return: { valid: boolean, apps: string[], productId?: string } —
  // apps vacío si valid es false. productId solo presente si el acierto es de Gumroad.
  // apps is empty when valid is false. productId only present on a Gumroad match.
  async function validate(code) {
    try {
      if (!(window.crypto && window.crypto.subtle && window.crypto.subtle.digest)) {
        return { valid: false, apps: [] }; // fallback sin crypto.subtle / no-crypto fallback
      }
      var v = (code == null ? "" : String(code)).trim().toUpperCase();
      if (!v) return { valid: false, apps: [] };

      // 1) Código personal de José: hash local, offline, sin tocar la red.
      // 1) José's personal code: local hash, offline, no network.
      var hash = await sha256Hex(v);
      for (var i = 0; i < ENTRIES.length; i++) {
        if (ENTRIES[i].hash === hash) return { valid: true, apps: ENTRIES[i].apps.slice() };
      }

      // 2) No es el código de José: probar contra Gumroad, los 7 en paralelo.
      // 2) Not José's code: try Gumroad, all 7 in parallel.
      if (!window.fetch) return { valid: false, apps: [] };
      var results = await Promise.all(
        PRODUCTOS.map(function (p) { return verifyGumroad(p.id, v); })
      );
      for (var j = 0; j < results.length; j++) {
        if (results[j]) {
          return { valid: true, apps: PRODUCTOS[j].apps.slice(), productId: PRODUCTOS[j].id };
        }
      }
      return { valid: false, apps: [] };
    } catch (e) {
      return { valid: false, apps: [] };
    }
  }

  window.jogaGate = { validate: validate };
})();
