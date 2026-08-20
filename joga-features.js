/* joga-features.js — Módulo compartido de features nuevas para Joga Intelligence
   Shared new-features module for Joga Intelligence
   Versión 1.0 — agosto 2026
   
   Features:
   1. Nombre de usuario / User name (personalized greeting)
   2. Modo nocturno automático / Auto night mode
   3. Niveles de maestría / Mastery levels
   4. Práctica sugerida inteligente / Smart practice suggestion
   5. Botón de emergencia / Emergency button
   6. Mapa de calor / Activity heatmap
*/
'use strict';
(function(W) {

  var JF = W.jogaFeatures = {};

  /* ===== 1. NOMBRE DE USUARIO / USER NAME ===== */
  JF.getName = function() {
    try { return localStorage.getItem('jiUserName') || ''; } catch(e) { return ''; }
  };
  JF.setName = function(n) {
    try { localStorage.setItem('jiUserName', (n || '').trim()); } catch(e) {}
  };
  JF.greetWithName = function(baseGreeting) {
    var name = JF.getName();
    return name ? (baseGreeting + ', ' + name) : baseGreeting;
  };

  /* Modal para pedir nombre (primera vez) / Ask name modal (first time) */
  JF.nameModalHtml = function(lang) {
    var L = lang === 'en' ? {
      title: 'Welcome to Joga Intelligence',
      sub: 'What should we call you?',
      placeholder: 'Your name',
      btn: 'Start my journey',
      skip: 'Skip'
    } : {
      title: 'Bienvenido a Joga Intelligence',
      sub: '\u00bfC\u00f3mo te llamamos?',
      placeholder: 'Tu nombre',
      btn: 'Comenzar mi camino',
      skip: 'Saltar'
    };
    return '<div id="jiNameModal" style="position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.65);' +
      'backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;' +
      'animation:jiFadeIn .4s ease">' +
      '<div style="background:#fff;border-radius:28px;padding:36px 28px;max-width:320px;width:100%;' +
      'text-align:center;box-shadow:0 40px 80px -20px rgba(0,0,0,.5);animation:jiScaleIn .4s ease">' +
        '<div style="font-size:42px;margin-bottom:16px">\u2728</div>' +
        '<div style="font-family:Newsreader,serif;font-weight:600;font-size:22px;color:#242029;margin-bottom:6px">' + L.title + '</div>' +
        '<div style="font-size:13px;color:#8a8296;margin-bottom:22px">' + L.sub + '</div>' +
        '<input id="jiNameInput" type="text" placeholder="' + L.placeholder + '" maxlength="20" autocomplete="off" ' +
          'style="width:100%;box-sizing:border-box;border:1.5px solid rgba(45,38,58,.15);border-radius:14px;' +
          'padding:14px 16px;font:500 15px Inter,system-ui,sans-serif;color:#242029;outline:none;' +
          'text-align:center;background:rgba(45,38,58,.04)">' +
        '<button id="jiNameBtn" style="width:100%;margin-top:14px;border:0;cursor:pointer;border-radius:999px;' +
          'padding:15px;font:600 14px Inter,system-ui,sans-serif;color:#fff;' +
          'background:linear-gradient(135deg,#6d5bb5,#8a78cc);box-shadow:0 12px 28px -10px rgba(109,91,181,.7)">' +
          L.btn + '</button>' +
        '<button id="jiNameSkip" style="border:0;background:none;cursor:pointer;margin-top:12px;' +
          'font:500 12px Inter,system-ui,sans-serif;color:#8a8296;padding:6px 12px">' + L.skip + '</button>' +
      '</div>' +
    '</div>';
  };

  JF.showNameModal = function(lang, onDone) {
    /* Solo mostrar si no tiene nombre y no dijo "skip" / Only show if no name and didn't skip */
    if (JF.getName() || JF._nameSkipped()) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = JF.nameModalHtml(lang);
    document.body.appendChild(wrap);
    var input = document.getElementById('jiNameInput');
    var btn = document.getElementById('jiNameBtn');
    var skip = document.getElementById('jiNameSkip');
    var modal = document.getElementById('jiNameModal');
    function close() { try { document.body.removeChild(wrap); } catch(e) {} }
    btn.addEventListener('click', function() {
      var v = (input.value || '').trim();
      if (v) JF.setName(v);
      close();
      if (onDone) onDone(v);
    });
    skip.addEventListener('click', function() {
      try { localStorage.setItem('jiNameSkipped', '1'); } catch(e) {}
      close();
      if (onDone) onDone('');
    });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') btn.click();
    });
    setTimeout(function() { input.focus(); }, 400);
  };
  JF._nameSkipped = function() {
    try { return localStorage.getItem('jiNameSkipped') === '1'; } catch(e) { return false; }
  };


  /* ===== 2. MODO NOCTURNO AUTOMÁTICO / AUTO NIGHT MODE ===== */
  JF.isNightMode = function() {
    var h = new Date().getHours();
    return h >= 20 || h < 6;
  };
  JF.isDuskMode = function() {
    var h = new Date().getHours();
    return h >= 18 && h < 20;
  };
  JF.getTimeMode = function() {
    var h = new Date().getHours();
    if (h >= 5 && h < 12) return 'morning';
    if (h >= 12 && h < 18) return 'afternoon';
    if (h >= 18 && h < 20) return 'dusk';
    return 'night';
  };

  /* CSS variables for night mode overlay */
  JF.nightModeCSS = '' +
    '@keyframes jiFadeIn{from{opacity:0}to{opacity:1}}' +
    '@keyframes jiScaleIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}' +
    '.ji-night-tint{position:absolute;inset:0;z-index:1;pointer-events:none;' +
      'background:linear-gradient(180deg,rgba(10,8,20,.3),rgba(15,10,30,.5));' +
      'transition:opacity .8s ease}' +
    '.ji-dusk-tint{position:absolute;inset:0;z-index:1;pointer-events:none;' +
      'background:linear-gradient(180deg,rgba(40,20,10,.08),rgba(60,30,20,.15));' +
      'transition:opacity .8s ease}';

  JF.injectNightCSS = function() {
    if (document.getElementById('jiNightCSS')) return;
    var s = document.createElement('style');
    s.id = 'jiNightCSS';
    s.textContent = JF.nightModeCSS;
    document.head.appendChild(s);
  };

  /* Apply night tint to a screen element */
  JF.applyNightTint = function(screenEl) {
    if (!screenEl) return;
    /* Remove existing tints */
    var old = screenEl.querySelector('.ji-night-tint,.ji-dusk-tint');
    if (old) old.parentNode.removeChild(old);

    JF.injectNightCSS();
    var mode = JF.getTimeMode();
    if (mode === 'night') {
      var tint = document.createElement('div');
      tint.className = 'ji-night-tint';
      screenEl.insertBefore(tint, screenEl.firstChild);
    } else if (mode === 'dusk') {
      var tint2 = document.createElement('div');
      tint2.className = 'ji-dusk-tint';
      screenEl.insertBefore(tint2, screenEl.firstChild);
    }
  };


  /* ===== 3. NIVELES DE MAESTRÍA / MASTERY LEVELS ===== */
  JF.LEVELS = [
    {min: 0,   es: 'Semilla',  en: 'Seed',     emoji: '\ud83c\udf31'},
    {min: 10,  es: 'Brote',    en: 'Sprout',    emoji: '\ud83c\udf3f'},
    {min: 30,  es: '\u00c1rbol',    en: 'Tree',      emoji: '\ud83c\udf33'},
    {min: 60,  es: 'Bosque',   en: 'Forest',    emoji: '\ud83c\udf32'},
    {min: 100, es: 'Monta\u00f1a',  en: 'Mountain',  emoji: '\u26f0\ufe0f'},
    {min: 200, es: 'Cosmos',   en: 'Cosmos',    emoji: '\u2728'}
  ];

  JF.getMasteryData = function(appKey) {
    var total = JF.getTotalPractices(appKey);
    var level = JF.LEVELS[0];
    var nextLevel = JF.LEVELS[1];
    for (var i = JF.LEVELS.length - 1; i >= 0; i--) {
      if (total >= JF.LEVELS[i].min) {
        level = JF.LEVELS[i];
        nextLevel = JF.LEVELS[i + 1] || null;
        break;
      }
    }
    var progress = nextLevel
      ? Math.min(1, (total - level.min) / (nextLevel.min - level.min))
      : 1;
    return {
      level: level,
      nextLevel: nextLevel,
      total: total,
      progress: progress
    };
  };

  JF.getTotalPractices = function(appKey) {
    try {
      return parseInt(localStorage.getItem('jiTotalPractices_' + appKey) || '0', 10) || 0;
    } catch(e) { return 0; }
  };

  JF.incrementPractices = function(appKey) {
    var n = JF.getTotalPractices(appKey) + 1;
    try { localStorage.setItem('jiTotalPractices_' + appKey, String(n)); } catch(e) {}
    /* Track in heatmap */
    JF.recordActivity(appKey);
    return n;
  };

  /* Mastery badge HTML */
  JF.masteryBadgeHtml = function(appKey, lang, accentColor) {
    var d = JF.getMasteryData(appKey);
    var label = lang === 'en' ? d.level.en : d.level.es;
    var nextLabel = d.nextLevel ? (lang === 'en' ? d.nextLevel.en : d.nextLevel.es) : '';
    var pct = Math.round(d.progress * 100);
    var nextText = d.nextLevel
      ? ((lang === 'en' ? 'Next: ' : 'Siguiente: ') + nextLabel + ' (' + (d.nextLevel.min - d.total) + (lang === 'en' ? ' more)' : ' m\u00e1s)'))
      : (lang === 'en' ? 'Maximum level reached!' : '\u00a1Nivel m\u00e1ximo alcanzado!');
    var color = accentColor || '#6d5bb5';

    return '<div style="border:1px solid rgba(45,38,58,.12);border-radius:18px;padding:14px 16px;' +
      'background:linear-gradient(160deg,rgba(255,255,255,.9),rgba(245,240,255,.6));margin-bottom:18px">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">' +
        '<span style="font-size:22px">' + d.level.emoji + '</span>' +
        '<div>' +
          '<div style="font:600 14px Inter,system-ui,sans-serif;color:#242029">' + label + '</div>' +
          '<div style="font:400 11px Inter,system-ui,sans-serif;color:#8a8296">' + d.total + (lang === 'en' ? ' practices' : ' pr\u00e1cticas') + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="height:6px;background:rgba(45,38,58,.08);border-radius:3px;overflow:hidden;margin-bottom:6px">' +
        '<div style="height:100%;width:' + pct + '%;background:' + color + ';border-radius:3px;transition:width .5s ease"></div>' +
      '</div>' +
      '<div style="font:400 11px Inter,system-ui,sans-serif;color:#8a8296">' + nextText + '</div>' +
    '</div>';
  };


  /* ===== 4. PRÁCTICA SUGERIDA INTELIGENTE / SMART PRACTICE SUGGESTION ===== */
  JF.smartPracticeIndex = function(practices, appKey) {
    if (!practices || !practices.length) return 0;
    var h = new Date().getHours();
    var total = JF.getTotalPractices(appKey);
    var len = practices.length;

    /* Beginner (< 10 practices): start with easy ones (first 5) */
    if (total < 10 && len > 5) {
      return Math.floor(Date.now() / 86400000) % Math.min(5, len);
    }

    /* Morning (5-11): prefer energizing/activation practices (first third) */
    if (h >= 5 && h < 12) {
      var pool = Math.ceil(len / 3);
      return Math.floor(Date.now() / 86400000) % pool;
    }

    /* Afternoon (12-17): middle practices */
    if (h >= 12 && h < 18) {
      var start = Math.ceil(len / 3);
      var end = Math.ceil(len * 2 / 3);
      return start + (Math.floor(Date.now() / 86400000) % (end - start));
    }

    /* Night (18+): calming practices (last third) */
    var nightStart = Math.ceil(len * 2 / 3);
    return nightStart + (Math.floor(Date.now() / 86400000) % (len - nightStart));
  };


  /* ===== 5. BOTÓN DE EMERGENCIA / EMERGENCY BUTTON ===== */
  JF.emergencyButtonHtml = function(lang, accentColor) {
    var L = lang === 'en' ? {
      label: 'I need calm NOW',
      sub: '2-min guided breathing'
    } : {
      label: 'Necesito calma AHORA',
      sub: 'Respiraci\u00f3n guiada de 2 min'
    };
    var color = accentColor || '#e74c3c';
    return '<button id="jiEmergencyBtn" class="tapfx" style="width:100%;cursor:pointer;border:0;' +
      'border-radius:18px;padding:16px 20px;margin-bottom:18px;' +
      'background:linear-gradient(135deg,' + color + ',#c0392b);' +
      'box-shadow:0 12px 30px -12px rgba(231,76,60,.7);' +
      'display:flex;align-items:center;gap:14px;text-align:left">' +
      '<div style="flex:0 0 auto;width:44px;height:44px;border-radius:50%;' +
        'background:rgba(255,255,255,.2);display:grid;place-items:center;font-size:22px">\ud83c\udd98</div>' +
      '<div style="flex:1">' +
        '<div style="font:700 14px Inter,system-ui,sans-serif;color:#fff">' + L.label + '</div>' +
        '<div style="font:400 11px Inter,system-ui,sans-serif;color:rgba(255,255,255,.8);margin-top:2px">' + L.sub + '</div>' +
      '</div>' +
    '</button>';
  };


  /* ===== 6. MAPA DE CALOR / ACTIVITY HEATMAP ===== */
  JF.recordActivity = function(appKey) {
    try {
      var key = 'jiHeatmap_' + appKey;
      var data = JSON.parse(localStorage.getItem(key) || '{}');
      var today = new Date().toISOString().slice(0, 10);
      data[today] = (data[today] || 0) + 1;
      /* Keep last 90 days / Mantener últimos 90 días */
      var cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 90);
      var cutStr = cutoff.toISOString().slice(0, 10);
      var clean = {};
      Object.keys(data).forEach(function(d) {
        if (d >= cutStr) clean[d] = data[d];
      });
      localStorage.setItem(key, JSON.stringify(clean));
    } catch(e) {}
  };

  JF.getHeatmapData = function(appKey, days) {
    days = days || 30;
    try {
      var raw = JSON.parse(localStorage.getItem('jiHeatmap_' + appKey) || '{}');
      var result = [];
      var d = new Date();
      for (var i = days - 1; i >= 0; i--) {
        var dt = new Date(d);
        dt.setDate(dt.getDate() - i);
        var key = dt.toISOString().slice(0, 10);
        result.push({ date: key, count: raw[key] || 0, day: dt.getDay() });
      }
      return result;
    } catch(e) { return []; }
  };

  JF.heatmapHtml = function(appKey, lang, accentColor, days) {
    days = days || 28;
    var data = JF.getHeatmapData(appKey, days);
    var color = accentColor || '#6d5bb5';
    var title = lang === 'en' ? 'Your activity' : 'Tu actividad';
    var totalDays = data.filter(function(d) { return d.count > 0; }).length;
    var sub = lang === 'en'
      ? totalDays + ' active day' + (totalDays !== 1 ? 's' : '') + ' in the last ' + days + ' days'
      : totalDays + ' d\u00eda' + (totalDays !== 1 ? 's' : '') + ' activo' + (totalDays !== 1 ? 's' : '') + ' en los \u00faltimos ' + days + ' d\u00edas';

    var cells = '';
    data.forEach(function(d) {
      var opacity = d.count === 0 ? '.08' : d.count === 1 ? '.35' : d.count <= 3 ? '.6' : '.9';
      cells += '<div title="' + d.date + ': ' + d.count + '" style="width:12px;height:12px;border-radius:3px;' +
        'background:' + color + ';opacity:' + opacity + '"></div>';
    });

    return '<div style="border:1px solid rgba(45,38,58,.1);border-radius:18px;padding:14px 16px;' +
      'background:rgba(255,255,255,.6);margin-bottom:18px">' +
      '<div style="font:600 11px Inter,system-ui,sans-serif;color:#242029;margin-bottom:4px">' + title + '</div>' +
      '<div style="font:400 10px Inter,system-ui,sans-serif;color:#8a8296;margin-bottom:10px">' + sub + '</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:3px">' + cells + '</div>' +
    '</div>';
  };


  /* ===== UTILIDADES COMPARTIDAS / SHARED UTILITIES ===== */
  JF.hasFeatureData = function() {
    return !!(JF.getName() || JF._nameSkipped());
  };

})(window);
