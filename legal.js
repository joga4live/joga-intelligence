/* legal.js — Joga Intelligence
   i18n para legal.html (Términos, Privacidad, Reembolsos).
   i18n for legal.html (Terms, Privacy, Refunds).
   Mismo patrón que index.html: localStorage 'joga.language', objetos I18N.es/I18N.en
   con paridad exacta de llaves, textContent por id. Un solo texto nuevo: LIST_KEYS,
   para renderizar listas <ul> desde arreglos (evita <li> repetidos en el HTML).
   Same pattern as index.html: 'joga.language' in localStorage, I18N.es/I18N.en objects
   with exact key parity, textContent by id. One addition: LIST_KEYS, to render <ul>
   lists from arrays (avoids repeating <li> markup in the HTML). */
(function () {
  "use strict";
  var LANGUAGE_STORAGE_KEY = "joga.language";
  var LIST_KEYS = ["privacyLocalItems"]; // llaves que son arreglos, no texto / keys that are arrays, not text

  var I18N = {
    es: {
      pageKicker: "Legal", pageTitle: "Términos, privacidad y reembolsos",
      pageIntro: "Un resumen honesto de las reglas de uso, qué datos se recogen de verdad y cómo funciona un reembolso. No somos un despacho de abogados: este texto está escrito en español claro, sin plantillas genéricas, como punto de partida razonable — no como un documento revisado por un abogado.",
      pageUpdated: "Última actualización: 28 de julio de 2026.",
      navTerms: "Términos", navPrivacy: "Privacidad", navRefunds: "Reembolsos",
      termsKicker: "01 · Términos", termsTitle: "Términos de servicio",
      termsIntro: "Joga Intelligence es un proyecto operado por su fundador, conocido públicamente como “Joga”, como persona física — sin una empresa registrada detrás. Es una PWA (una app web instalable) con varias mini-apps de crecimiento personal, servida desde GitHub Pages y desbloqueada con un código de licencia personal.",
      termsAccounts: "No hay cuentas ni contraseñas. Tu acceso vive en tu propio navegador: al ingresar tu código válido, tu dispositivo recuerda qué apps desbloqueaste. Si cambias de navegador o de teléfono, necesitas volver a ingresar tu código.",
      termsSubscription: "Se vende como suscripción anual: $50 USD al año por una app, o $150 USD al año por las seis. Se renueva automáticamente cada 12 meses salvo que la canceles antes de la renovación.",
      termsSharing: "Tu código es personal e intransferible. Compartirlo cancela tu suscripción sin derecho a reembolso.",
      termsAdvice: "El contenido de las apps es educativo y general — no es asesoría profesional. JogaCapital y JogaBody tienen su propio aviso, visible junto al diagnóstico de IA, sobre finanzas y salud respectivamente.",
      termsCredits: "Cuando una idea se apoya claramente en el trabajo de otro autor, lo decimos dentro de la app — por ejemplo, JogaMind, JogaBit y JogaPath acreditan a los autores en los que se inspiran.",
      termsLiability: "No prometemos resultados ni magia — como decimos en la portada, el cambio depende de ti. Usas la app bajo tu propio criterio; para decisiones importantes de dinero o salud, consulta siempre a un profesional calificado.",
      termsChanges: "Estos términos pueden actualizarse; la fecha de arriba indica la última revisión.",
      termsContact: "Preguntas sobre estos términos: hola.joga@gmail.com.",
      privacyKicker: "02 · Privacidad", privacyTitle: "Política de privacidad",
      privacyIntro: "Esta política describe lo que la app hace de verdad, revisado directamente en el código — no es una plantilla genérica. Dato a favor: no hay analítica, píxeles de rastreo ni cookies de terceros en ningún archivo del sitio.",
      privacyLocalTitle: "Lo que se guarda en tu propio dispositivo",
      privacyLocalBody: "Todo esto vive únicamente en el almacenamiento local de tu navegador (localStorage / IndexedDB). Nunca se envía a ningún servidor nuestro:",
      privacyLocalItems: [
        "Tu idioma y tu preferencia de sonido (ES/EN, silenciado o no).",
        "Qué apps desbloqueaste con tu código — la validación ocurre en tu propio navegador, no en un servidor.",
        "Tu racha y tus prácticas o afirmaciones completadas cada día, por app.",
        "Si usas el certificado del reto de 30 días: el nombre que escribiste para imprimirlo.",
        "Si activas el recordatorio diario: si está encendido y a qué hora — lo usa tu propio dispositivo para mostrarte una notificación, sin pasar por ningún servidor."
      ],
      privacyAITitle: "El diagnóstico con inteligencia artificial",
      privacyAIBody: "Cuando escribes tu situación en el cuadro de diagnóstico de una app (hasta 1200 caracteres), ese texto se envía a nuestro servidor (un Worker de Cloudflare) para generar la respuesta del coach. El Worker también lee la dirección IP de tu conexión, únicamente para contar cuántas consultas hiciste hoy y este mes y aplicar el límite diario/mensual gratuito — ese contador se borra solo: en 48 horas el del día, en 40 días el del mes.",
      privacyAnthropic: "El texto de tu consulta se procesa con la API de Anthropic (Claude) para generar la respuesta — sujeto a la propia política de privacidad de Anthropic.",
      privacyHosting: "El sitio se sirve desde GitHub Pages. Como cualquier sitio web, es posible que GitHub guarde registros técnicos estándar de acceso (ej. IP, navegador) por su cuenta — no es algo que nosotros controlemos ni pidamos; ver la política de privacidad de GitHub. Las tipografías del sitio se cargan desde Google Fonts, así que Google también recibe la IP de tu navegador al abrir cualquier página, incluida esta — no usamos ningún otro servicio de Google.",
      privacyPurchase: "Cuando compras a través de Gumroad, es Gumroad quien procesa el pago y ve tu correo — nosotros no vemos tu tarjeta. Si en cambio nos escribes por WhatsApp para pedir tu código, vemos directamente tu número y tu mensaje.",
      privacyNoTracking: "No usamos Google Analytics ni ninguna otra analítica, ni píxeles de rastreo, ni cookies de terceros — lo revisamos directamente en el código de las páginas del sitio antes de escribir esta política, y no encontramos ninguno.",
      privacyRights: "No hay cuentas que borrar: puedes eliminar todos tus datos locales borrando el almacenamiento del sitio desde tu navegador, en cualquier momento. Para cualquier pregunta o solicitud sobre tus datos: hola.joga@gmail.com.",
      privacyContact: "Preguntas sobre privacidad: hola.joga@gmail.com.",
      refundsKicker: "03 · Reembolsos", refundsTitle: "Política de reembolsos",
      refundsGuarantee: "Garantía de 7 días: si no sientes el cambio, te devolvemos tu dinero completo — para cualquiera de los dos planes (una app o las seis), sin preguntas incómodas.",
      refundsHow: "Para pedir tu reembolso dentro de esos 7 días desde la compra, escribe a hola.joga@gmail.com con el correo o el código con el que compraste.",
      refundsProcessing: "El pago lo procesa Gumroad, así que el reembolso también pasa por Gumroad — puede tardar unos días hábiles en reflejarse según tu banco.",
      refundsRenewals: "Pasados los 7 días, la renovación anual ya no es reembolsable ni se prorratea por los días sin usar. Puedes cancelar la renovación automática cuando quieras; tu acceso sigue activo hasta el final del periodo ya pagado.",
      refundsException: "Excepción: compartir tu código personal con otra persona cancela tu suscripción de inmediato, sin derecho a reembolso.",
      refundsContact: "Preguntas sobre un reembolso: hola.joga@gmail.com.",
      footerNote: "Joga Intelligence · Este documento es un punto de partida razonable, no un texto revisado por un abogado.",
      footerBack: "← Volver a Joga Intelligence"
    },
    en: {
      pageKicker: "Legal", pageTitle: "Terms, privacy & refunds",
      pageIntro: "An honest summary of the rules of use, what data is actually collected, and how a refund works. We are not a law firm: this text is written in plain English, without generic templates, as a reasonable starting point — not a document reviewed by a lawyer.",
      pageUpdated: "Last updated: July 28, 2026.",
      navTerms: "Terms", navPrivacy: "Privacy", navRefunds: "Refunds",
      termsKicker: "01 · Terms", termsTitle: "Terms of service",
      termsIntro: "Joga Intelligence is a project run by its founder, publicly known as “Joga,” as an individual — with no registered company behind it. It's a PWA (an installable web app) with several personal-growth mini-apps, served from GitHub Pages and unlocked with a personal license code.",
      termsAccounts: "There are no accounts or passwords. Your access lives in your own browser: once you enter a valid code, your device remembers which apps you unlocked. If you switch browsers or phones, you'll need to enter your code again.",
      termsSubscription: "Sold as an annual subscription: $50 USD a year for one app, or $150 USD a year for all six. It renews automatically every 12 months unless you cancel before renewal.",
      termsSharing: "Your code is personal and non-transferable. Sharing it cancels your subscription with no right to a refund.",
      termsAdvice: "The content in the apps is educational and general — it is not professional advice. JogaCapital and JogaBody each carry their own notice, visible next to the AI diagnosis, about finance and health respectively.",
      termsCredits: "When an idea clearly builds on another author's work, we say so inside the app — for example, JogaMind, JogaBit, and JogaPath credit the authors that inspired them.",
      termsLiability: "We don't promise results or magic — as the homepage says, the change depends on you. You use the app at your own judgment; for important money or health decisions, always consult a qualified professional.",
      termsChanges: "These terms may be updated; the date above shows the last revision.",
      termsContact: "Questions about these terms: hola.joga@gmail.com.",
      privacyKicker: "02 · Privacy", privacyTitle: "Privacy policy",
      privacyIntro: "This policy describes what the app actually does, checked directly in the code — not a generic template. A point in our favor: there is no analytics, tracking pixel, or third-party cookie anywhere on the site.",
      privacyLocalTitle: "What's stored on your own device",
      privacyLocalBody: "All of this lives only in your browser's local storage (localStorage / IndexedDB). It is never sent to any server of ours:",
      privacyLocalItems: [
        "Your language and sound preference (ES/EN, muted or not).",
        "Which apps you unlocked with your code — validation happens inside your own browser, not on a server.",
        "Your streak and the practices or affirmations you complete each day, per app.",
        "If you use the 30-day challenge certificate: the name you typed to print it.",
        "If you turn on the daily reminder: whether it's on and at what hour — used by your own device to show a notification, without going through any server."
      ],
      privacyAITitle: "The AI diagnosis",
      privacyAIBody: "When you write your situation in an app's diagnosis box (up to 1,200 characters), that text is sent to our server (a Cloudflare Worker) to generate the coach's reply. The Worker also reads your connection's IP address, only to count how many requests you made today and this month and apply the free daily/monthly limit — that counter deletes itself automatically: in 48 hours for the daily one, in 40 days for the monthly one.",
      privacyAnthropic: "The text of your query is processed through Anthropic's (Claude) API to generate the reply — subject to Anthropic's own privacy policy.",
      privacyHosting: "The site is served from GitHub Pages. Like any website, GitHub may keep standard technical access logs (e.g. IP, browser) on its own — something we don't control or request; see GitHub's privacy statement. The site's fonts are loaded from Google Fonts, so Google also receives your browser's IP address when you open any page, including this one — we don't use any other Google service.",
      privacyPurchase: "When you buy through Gumroad, Gumroad processes the payment and sees your email — we never see your card. If you message us on WhatsApp instead to request a code, we see your number and message directly.",
      privacyNoTracking: "We don't use Google Analytics or any other analytics, tracking pixels, or third-party cookies — we checked directly in the code of the site's pages before writing this policy, and found none.",
      privacyRights: "There are no accounts to delete: you can erase all your local data anytime by clearing this site's storage from your browser. For any question or request about your data: hola.joga@gmail.com.",
      privacyContact: "Privacy questions: hola.joga@gmail.com.",
      refundsKicker: "03 · Refunds", refundsTitle: "Refund policy",
      refundsGuarantee: "7-day guarantee: if you don't feel the change, we refund you in full — for either plan (one app or all six), no awkward questions.",
      refundsHow: "To request your refund within those 7 days of purchase, email hola.joga@gmail.com with the email or code you purchased with.",
      refundsProcessing: "Gumroad processes the payment, so the refund goes through Gumroad too — it can take a few business days to show up depending on your bank.",
      refundsRenewals: "After the 7 days, the annual renewal is no longer refundable or prorated for unused days. You can cancel auto-renewal anytime; your access stays active until the end of the period you already paid for.",
      refundsException: "Exception: sharing your personal code with someone else cancels your subscription immediately, with no right to a refund.",
      refundsContact: "Refund questions: hola.joga@gmail.com.",
      footerNote: "Joga Intelligence · This document is a reasonable starting point, not text reviewed by a lawyer.",
      footerBack: "← Back to Joga Intelligence"
    }
  };

  function getInitialLanguage() {
    try {
      var stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === "es" || stored === "en") return stored;
    } catch (e) {}
    var browserLang = (navigator.language || "").toLowerCase();
    return browserLang.indexOf("en") === 0 ? "en" : "es";
  }

  function applyLanguage(lang) {
    var dict = I18N[lang];
    document.documentElement.lang = lang;
    Object.keys(dict).forEach(function (key) {
      if (LIST_KEYS.indexOf(key) !== -1) {
        var list = document.getElementById(key);
        if (!list) return;
        list.innerHTML = "";
        dict[key].forEach(function (item) {
          var li = document.createElement("li");
          li.textContent = item;
          list.appendChild(li);
        });
        return;
      }
      var el = document.getElementById(key);
      if (el) el.textContent = dict[key];
    });
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
  }

  function setLanguage(lang) {
    try { localStorage.setItem(LANGUAGE_STORAGE_KEY, lang); } catch (e) {}
    applyLanguage(lang);
  }

  window.setLegalLanguage = setLanguage;
  document.addEventListener("DOMContentLoaded", function () {
    applyLanguage(getInitialLanguage());
    // El navegador resuelve el #hash antes de que el texto llene la página (documento
    // más chico de lo que será). Reintentamos el salto ya con el contenido pintado.
    // The browser resolves the #hash before the text fills the page (document is
    // shorter than it will be). Re-do the jump now that content is painted.
    if (location.hash) {
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }
  });
})();
