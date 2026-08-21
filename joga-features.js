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


  /* ===== 7. ONBOARDING QUIZ / QUIZ DE BIENVENIDA ===== */
  JF.STRUGGLES = [
    {key:'stress',   emoji:'\ud83e\udee8', es:'Estr\u00e9s y ansiedad',       en:'Stress and anxiety'},
    {key:'habits',   emoji:'\ud83d\udd04', es:'No puedo mantener h\u00e1bitos', en:"Can't stick to habits"},
    {key:'focus',    emoji:'\ud83e\udde0', es:'Me falta enfoque',            en:'I lack focus'},
    {key:'money',    emoji:'\ud83d\udcb0', es:'Problemas con dinero',        en:'Money problems'},
    {key:'energy',   emoji:'\u26a1',       es:'Poca energ\u00eda',                en:'Low energy'},
    {key:'all',      emoji:'\ud83c\udf00', es:'Un poco de todo',             en:'A bit of everything'}
  ];

  JF.getStruggle = function() {
    try { return localStorage.getItem('jiStruggle') || ''; } catch(e) { return ''; }
  };
  JF.setStruggle = function(key) {
    try { localStorage.setItem('jiStruggle', key); } catch(e) {}
  };

  JF.quizModalHtml = function(lang) {
    var L = lang === 'en' ? {
      title: "What's your biggest struggle?",
      sub: "This helps us personalize your experience",
      btn: 'Continue'
    } : {
      title: '\u00bfCu\u00e1l es tu mayor lucha?',
      sub: 'Esto nos ayuda a personalizar tu experiencia',
      btn: 'Continuar'
    };
    var options = '';
    JF.STRUGGLES.forEach(function(s) {
      var label = lang === 'en' ? s.en : s.es;
      options += '<button data-struggle="' + s.key + '" style="width:100%;text-align:left;cursor:pointer;' +
        'border:1.5px solid rgba(45,38,58,.12);background:rgba(45,38,58,.03);border-radius:14px;' +
        'padding:13px 16px;font:500 14px Inter,system-ui,sans-serif;color:#242029;display:flex;' +
        'align-items:center;gap:12px;transition:all .2s ease">' +
        '<span style="font-size:20px">' + s.emoji + '</span>' + label + '</button>';
    });
    return '<div id="jiQuizModal" style="position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.65);' +
      'backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;' +
      'animation:jiFadeIn .4s ease">' +
      '<div style="background:#fff;border-radius:28px;padding:32px 24px;max-width:340px;width:100%;' +
      'text-align:center;box-shadow:0 40px 80px -20px rgba(0,0,0,.5);animation:jiScaleIn .4s ease">' +
        '<div style="font-size:38px;margin-bottom:14px">\ud83c\udfaf</div>' +
        '<div style="font-family:Newsreader,serif;font-weight:600;font-size:20px;color:#242029;margin-bottom:4px">' + L.title + '</div>' +
        '<div style="font-size:12px;color:#8a8296;margin-bottom:18px">' + L.sub + '</div>' +
        '<div style="display:flex;flex-direction:column;gap:8px">' + options + '</div>' +
      '</div>' +
    '</div>';
  };

  JF.showQuizModal = function(lang, onDone) {
    if (JF.getStruggle()) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = JF.quizModalHtml(lang);
    document.body.appendChild(wrap);
    var btns = wrap.querySelectorAll('[data-struggle]');
    function close() { try { document.body.removeChild(wrap); } catch(e) {} }
    Array.prototype.forEach.call(btns, function(b) {
      b.addEventListener('click', function() {
        var key = b.getAttribute('data-struggle');
        JF.setStruggle(key);
        /* Highlight selected */
        b.style.border = '2px solid #6d5bb5';
        b.style.background = 'rgba(109,91,181,.1)';
        setTimeout(function() {
          close();
          if (onDone) onDone(key);
        }, 300);
      });
      b.addEventListener('mouseenter', function() { b.style.background = 'rgba(45,38,58,.06)'; });
      b.addEventListener('mouseleave', function() { b.style.background = 'rgba(45,38,58,.03)'; });
    });
  };

  /* Recommended app based on struggle / App recomendada según lucha */
  JF.recommendedApp = function() {
    var s = JF.getStruggle();
    var map = {
      stress: 'jogaflow',
      habits: 'protoneutron',
      focus: 'jogatime',
      money: 'monexium',
      energy: 'jogaflow',
      all: 'subment'
    };
    return map[s] || 'jogaflow';
  };


  /* ===== 8. JOURNAL POST-PRÁCTICA / POST-PRACTICE JOURNAL ===== */
  JF.journalModalHtml = function(lang, practiceTitle, accentColor) {
    var color = accentColor || '#6d5bb5';
    var L = lang === 'en' ? {
      title: 'How do you feel?',
      sub: 'After: ' + practiceTitle,
      note: 'Optional note...',
      save: 'Save',
      skip: 'Skip'
    } : {
      title: '\u00bfC\u00f3mo te sientes?',
      sub: 'Despu\u00e9s de: ' + practiceTitle,
      note: 'Nota opcional...',
      save: 'Guardar',
      skip: 'Saltar'
    };
    var emojis = [
      {val:1, icon:'\ud83d\ude2b', label: lang==='en'?'Terrible':'Terrible'},
      {val:2, icon:'\ud83d\ude15', label: lang==='en'?'Low':'Bajo'},
      {val:3, icon:'\ud83d\ude10', label: lang==='en'?'Okay':'Normal'},
      {val:4, icon:'\ud83d\ude0a', label: lang==='en'?'Good':'Bien'},
      {val:5, icon:'\ud83e\udd29', label: lang==='en'?'Amazing':'Incre\u00edble'}
    ];
    var emojiHtml = '';
    emojis.forEach(function(e) {
      emojiHtml += '<button data-mood="' + e.val + '" style="flex:1;cursor:pointer;border:1.5px solid rgba(45,38,58,.1);' +
        'background:#fff;border-radius:14px;padding:10px 4px;text-align:center;transition:all .2s ease">' +
        '<div style="font-size:24px">' + e.icon + '</div>' +
        '<div style="font:500 9px Inter,system-ui,sans-serif;color:#8a8296;margin-top:3px">' + e.label + '</div>' +
      '</button>';
    });
    return '<div id="jiJournalModal" style="position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.55);' +
      'backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:center;padding:0;' +
      'animation:jiFadeIn .3s ease">' +
      '<div style="background:#fff;border-radius:24px 24px 0 0;padding:28px 22px 34px;width:100%;max-width:400px;' +
      'box-shadow:0 -20px 60px -10px rgba(0,0,0,.3);animation:jiSlideUp .35s ease">' +
        '<div style="font-family:Newsreader,serif;font-weight:600;font-size:20px;color:#242029;margin-bottom:3px">' + L.title + '</div>' +
        '<div style="font-size:12px;color:#8a8296;margin-bottom:16px">' + L.sub + '</div>' +
        '<div style="display:flex;gap:6px;margin-bottom:16px">' + emojiHtml + '</div>' +
        '<textarea id="jiJournalNote" placeholder="' + L.note + '" maxlength="200" style="width:100%;box-sizing:border-box;' +
          'min-height:60px;resize:none;border:1.5px solid rgba(45,38,58,.12);border-radius:14px;padding:12px;' +
          'font:400 13px Inter,system-ui,sans-serif;color:#242029;outline:none;background:rgba(45,38,58,.03)"></textarea>' +
        '<div style="display:flex;gap:10px;margin-top:14px">' +
          '<button id="jiJournalSkip" style="flex:1;cursor:pointer;border:1.5px solid rgba(45,38,58,.12);' +
            'background:#fff;border-radius:999px;padding:13px;font:600 13px Inter,system-ui,sans-serif;color:#8a8296">' + L.skip + '</button>' +
          '<button id="jiJournalSave" style="flex:2;cursor:pointer;border:0;border-radius:999px;padding:13px;' +
            'font:600 13px Inter,system-ui,sans-serif;color:#fff;background:' + color + ';opacity:.4;pointer-events:none">' + L.save + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  };

  JF.showJournalModal = function(lang, practiceTitle, appKey, accentColor, onDone) {
    var wrap = document.createElement('div');
    wrap.innerHTML = JF.journalModalHtml(lang, practiceTitle, accentColor);
    /* Inject slideUp animation */
    if (!document.getElementById('jiSlideUpCSS')) {
      var s = document.createElement('style');
      s.id = 'jiSlideUpCSS';
      s.textContent = '@keyframes jiSlideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}';
      document.head.appendChild(s);
    }
    document.body.appendChild(wrap);
    var selectedMood = 0;
    var saveBtn = document.getElementById('jiJournalSave');
    var skipBtn = document.getElementById('jiJournalSkip');
    var noteEl = document.getElementById('jiJournalNote');
    var moodBtns = wrap.querySelectorAll('[data-mood]');
    function close() { try { document.body.removeChild(wrap); } catch(e) {} }

    Array.prototype.forEach.call(moodBtns, function(b) {
      b.addEventListener('click', function() {
        selectedMood = parseInt(b.getAttribute('data-mood'), 10);
        Array.prototype.forEach.call(moodBtns, function(ob) {
          ob.style.border = '1.5px solid rgba(45,38,58,.1)';
          ob.style.background = '#fff';
          ob.style.transform = 'scale(1)';
        });
        b.style.border = '2px solid ' + (accentColor || '#6d5bb5');
        b.style.background = 'rgba(109,91,181,.1)';
        b.style.transform = 'scale(1.1)';
        saveBtn.style.opacity = '1';
        saveBtn.style.pointerEvents = 'auto';
      });
    });

    saveBtn.addEventListener('click', function() {
      if (!selectedMood) return;
      var note = (noteEl.value || '').trim();
      JF._saveJournal(appKey, selectedMood, note, practiceTitle);
      close();
      if (onDone) onDone(selectedMood, note);
    });
    skipBtn.addEventListener('click', function() {
      close();
      if (onDone) onDone(0, '');
    });
  };

  JF._saveJournal = function(appKey, mood, note, practiceTitle) {
    try {
      var key = 'jiJournal_' + appKey;
      var data = JSON.parse(localStorage.getItem(key) || '[]');
      var today = new Date().toISOString().slice(0, 10);
      data.push({
        date: today,
        ts: Date.now(),
        mood: mood,
        note: note,
        practice: practiceTitle
      });
      /* Keep last 90 entries */
      if (data.length > 90) data = data.slice(-90);
      localStorage.setItem(key, JSON.stringify(data));
    } catch(e) {}
  };

  JF.getJournalStats = function(appKey, days) {
    days = days || 7;
    try {
      var data = JSON.parse(localStorage.getItem('jiJournal_' + appKey) || '[]');
      var cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      var cutStr = cutoff.toISOString().slice(0, 10);
      var recent = data.filter(function(e) { return e.date >= cutStr; });
      if (!recent.length) return null;
      var sum = 0;
      recent.forEach(function(e) { sum += e.mood; });
      return {
        avg: Math.round(sum / recent.length * 10) / 10,
        count: recent.length,
        entries: recent
      };
    } catch(e) { return null; }
  };


  /* ===== 9. DASHBOARD SEMANAL / WEEKLY DASHBOARD ===== */
  JF.weeklyDashboardHtml = function(appKey, lang, accentColor) {
    var color = accentColor || '#6d5bb5';
    var streak = 0;
    try { streak = parseInt(localStorage.getItem('jiStreak_' + appKey) || localStorage.getItem('jiStreak') || '0', 10) || 0; } catch(e) {}
    var total = JF.getTotalPractices(appKey);
    var mastery = JF.getMasteryData(appKey);
    var journal = JF.getJournalStats(appKey, 7);
    var heatData = JF.getHeatmapData(appKey, 7);
    var activeDays = heatData.filter(function(d) { return d.count > 0; }).length;
    var totalThisWeek = 0;
    heatData.forEach(function(d) { totalThisWeek += d.count; });

    var L = lang === 'en' ? {
      title: 'Your week',
      streak: 'Current streak',
      days: 'days',
      practices: 'Practices this week',
      activeDays: 'Active days',
      of7: '/ 7',
      feeling: 'Average feeling',
      level: 'Level',
      noData: 'Complete practices to see your stats here'
    } : {
      title: 'Tu semana',
      streak: 'Racha actual',
      days: 'd\u00edas',
      practices: 'Pr\u00e1cticas esta semana',
      activeDays: 'D\u00edas activos',
      of7: '/ 7',
      feeling: 'Sentimiento promedio',
      level: 'Nivel',
      noData: 'Completa pr\u00e1cticas para ver tus estad\u00edsticas aqu\u00ed'
    };

    if (total === 0) {
      return '<div style="border:1px solid rgba(45,38,58,.1);border-radius:18px;padding:20px;' +
        'background:rgba(255,255,255,.6);margin-bottom:18px;text-align:center">' +
        '<div style="font-size:28px;margin-bottom:8px">\ud83d\udcca</div>' +
        '<div style="font:600 14px Inter,system-ui,sans-serif;color:#242029;margin-bottom:4px">' + L.title + '</div>' +
        '<div style="font:400 12px Inter,system-ui,sans-serif;color:#8a8296">' + L.noData + '</div>' +
      '</div>';
    }

    var moodEmojis = ['','😫','😕','😐','😊','🤩'];
    var moodText = journal ? (moodEmojis[Math.round(journal.avg)] + ' ' + journal.avg) : '—';
    var levelLabel = lang === 'en' ? mastery.level.en : mastery.level.es;

    return '<div style="border:1px solid rgba(45,38,58,.1);border-radius:18px;padding:16px;' +
      'background:rgba(255,255,255,.6);margin-bottom:18px">' +
      '<div style="font:600 13px Inter,system-ui,sans-serif;color:#242029;margin-bottom:14px">' + L.title + '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
        /* Streak */
        '<div style="background:rgba(45,38,58,.04);border-radius:14px;padding:12px;text-align:center">' +
          '<div style="font:700 22px Inter,system-ui,sans-serif;color:' + color + '">' + streak + '</div>' +
          '<div style="font:500 10px Inter,system-ui,sans-serif;color:#8a8296">' + L.streak + '</div>' +
        '</div>' +
        /* Practices this week */
        '<div style="background:rgba(45,38,58,.04);border-radius:14px;padding:12px;text-align:center">' +
          '<div style="font:700 22px Inter,system-ui,sans-serif;color:' + color + '">' + totalThisWeek + '</div>' +
          '<div style="font:500 10px Inter,system-ui,sans-serif;color:#8a8296">' + L.practices + '</div>' +
        '</div>' +
        /* Active days */
        '<div style="background:rgba(45,38,58,.04);border-radius:14px;padding:12px;text-align:center">' +
          '<div style="font:700 22px Inter,system-ui,sans-serif;color:' + color + '">' + activeDays + ' <span style="font:400 14px Inter;color:#8a8296">' + L.of7 + '</span></div>' +
          '<div style="font:500 10px Inter,system-ui,sans-serif;color:#8a8296">' + L.activeDays + '</div>' +
        '</div>' +
        /* Feeling / Level */
        '<div style="background:rgba(45,38,58,.04);border-radius:14px;padding:12px;text-align:center">' +
          '<div style="font:700 22px Inter,system-ui,sans-serif;color:' + color + '">' + mastery.level.emoji + '</div>' +
          '<div style="font:500 10px Inter,system-ui,sans-serif;color:#8a8296">' + L.level + ': ' + levelLabel + '</div>' +
        '</div>' +
      '</div>' +
      (journal ? '<div style="margin-top:10px;background:rgba(45,38,58,.04);border-radius:14px;padding:10px 12px;' +
        'display:flex;align-items:center;justify-content:space-between">' +
        '<span style="font:500 11px Inter,system-ui,sans-serif;color:#8a8296">' + L.feeling + '</span>' +
        '<span style="font:600 14px Inter,system-ui,sans-serif;color:#242029">' + moodText + '</span>' +
      '</div>' : '') +
    '</div>';
  };


  /* ===== 10. VOZ IA / AI VOICE (ElevenLabs via Worker + MP3 fallback) ===== */
  JF.canSpeak = function() { return true; };

  /* Worker URL — mismo que usa el diagnóstico IA / same URL used by AI diagnosis */
  JF._WORKER_URL = 'https://joga-ai.omhotien90.workers.dev';

  /* Audio player activo / active audio player */
  JF._audioPlayer = null;
  JF._speaking = false;

  /* speak(text, lang, onEnd)
     1. Llama al Worker → ElevenLabs (voz humana real)
     2. Si falla: Web Speech API (robot, siempre disponible)
     Calls Worker → ElevenLabs (real human voice); on failure falls back to Web Speech. */
  JF.speak = function(text, lang, onEnd) {
    if (!text) { if (onEnd) onEnd(); return; }
    JF.stopSpeaking();
    var clean = text.replace(/[*_#`~>\[\]]/g, '').substring(0, 500);
    fetch(JF._WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tts: true, text: clean })
    })
    .then(function(r) {
      if (!r.ok) throw new Error('tts_fail');
      return r.arrayBuffer();
    })
    .then(function(buf) {
      var blob = new Blob([buf], { type: 'audio/mpeg' });
      var url  = URL.createObjectURL(blob);
      var a    = new Audio(url);
      JF._audioPlayer = a;
      JF._speaking = true;
      a.onended = function() {
        JF._speaking = false; JF._audioPlayer = null;
        URL.revokeObjectURL(url);
        if (onEnd) onEnd();
      };
      a.onerror = function() {
        JF._speaking = false; JF._audioPlayer = null;
        URL.revokeObjectURL(url);
        JF._speakWithSynthesis(text, lang, onEnd); /* fallback */
      };
      a.play().catch(function() {
        JF._speaking = false;
        JF._speakWithSynthesis(text, lang, onEnd); /* fallback */
      });
    })
    .catch(function() {
      JF._speakWithSynthesis(text, lang, onEnd); /* fallback sin red */
    });
  };

  /* Reproduce un MP3 pre-grabado de la carpeta audio/
     Plays a pre-recorded MP3 from the audio/ folder */
  JF.playAudio = function(filename, onEnd) {
    JF.stopSpeaking();
    var a = new Audio('./audio/' + filename);
    JF._audioPlayer = a;
    JF._speaking = true;
    a.onended = function() { JF._speaking = false; JF._audioPlayer = null; if (onEnd) onEnd(); };
    a.onerror = function() { JF._speaking = false; JF._audioPlayer = null; if (onEnd) onEnd(); };
    a.play().catch(function() { JF._speaking = false; if (onEnd) onEnd(); });
  };

  /* Saludo del coach: MP3 pre-grabado por hora del día
     Coach greeting: pre-recorded MP3 by time of day */
  JF.speakCoachGreeting = function(lang, onEnd) {
    var h = new Date().getHours();
    var timeKey = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'night';
    var prefix = lang === 'en' ? 'coach_en_' : 'coach_es_';
    JF.playAudio(prefix + timeKey + '.mp3', onEnd);
  };

  /* Respuesta de fallback pre-grabada / Pre-recorded fallback response */
  JF.speakFallbackResponse = function(lang, index, onEnd) {
    var prefix = lang === 'en' ? 'coach_en_r' : 'coach_es_r';
    var idx = (index % 4) + 1;
    JF.playAudio(prefix + idx + '.mp3', onEnd);
  };

  /* Web Speech API — fallback cuando Worker no disponible
     Web Speech API — fallback when Worker unavailable */
  JF._speakWithSynthesis = function(text, lang, onEnd) {
    if (!(W.speechSynthesis && W.SpeechSynthesisUtterance)) { if (onEnd) onEnd(); return; }
    W.speechSynthesis.cancel();
    var u = new W.SpeechSynthesisUtterance(text);
    u.lang = (lang === 'en') ? 'en-US' : 'es-MX';
    u.rate = 0.92; u.pitch = 1.0; u.volume = 0.9;
    var voices = W.speechSynthesis.getVoices();
    var target = (lang === 'en') ? 'en' : 'es';
    var preferred = voices.filter(function(v) { return v.lang.indexOf(target) === 0; });
    if (preferred.length) {
      var natural = preferred.filter(function(v) { return v.name.indexOf('Google') < 0; });
      u.voice = (natural.length ? natural[0] : preferred[0]);
    }
    JF._speaking = true;
    u.onend  = function() { JF._speaking = false; if (onEnd) onEnd(); };
    u.onerror = function() { JF._speaking = false; if (onEnd) onEnd(); };
    W.speechSynthesis.speak(u);
  };

  JF.stopSpeaking = function() {
    if (W.speechSynthesis) W.speechSynthesis.cancel();
    if (JF._audioPlayer) {
      try { JF._audioPlayer.pause(); JF._audioPlayer.currentTime = 0; } catch(e) {}
      JF._audioPlayer = null;
    }
    JF._speaking = false;
  };

  /* Coach greeting based on time + name + struggle */
  JF.coachGreeting = function(lang) {
    var name = JF.getName();
    var h = new Date().getHours();
    var struggle = JF.getStruggle();
    var mastery = null;
    /* Try to get mastery from any app */
    var apps = ['jogaflow','subment','jogatime','protoneutron','monexium','ventmex','pasley'];
    var totalAll = 0;
    apps.forEach(function(a) { totalAll += JF.getTotalPractices(a); });

    if (lang === 'en') {
      var greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
      if (name) greet += ', ' + name;
      greet += '. ';
      if (totalAll === 0) {
        greet += "Welcome to Joga Intelligence. I'm your personal coach. Let's start with today's practice.";
      } else if (totalAll < 10) {
        greet += "You're building a great habit. " + totalAll + " practices so far. Keep going!";
      } else if (totalAll < 30) {
        greet += "You're on fire! " + totalAll + " practices completed. Your consistency is paying off.";
      } else {
        greet += totalAll + " practices and counting. You've become unstoppable. Let's keep growing.";
      }
      return greet;
    } else {
      var saludo = h < 12 ? 'Buenos d\u00edas' : h < 18 ? 'Buenas tardes' : 'Buenas noches';
      if (name) saludo += ', ' + name;
      saludo += '. ';
      if (totalAll === 0) {
        saludo += 'Bienvenido a Joga Intelligence. Soy tu coach personal. Empecemos con la pr\u00e1ctica de hoy.';
      } else if (totalAll < 10) {
        saludo += 'Est\u00e1s construyendo un gran h\u00e1bito. ' + totalAll + ' pr\u00e1cticas hasta ahora. \u00a1Sigue as\u00ed!';
      } else if (totalAll < 30) {
        saludo += '\u00a1Vas con todo! ' + totalAll + ' pr\u00e1cticas completadas. Tu constancia est\u00e1 dando frutos.';
      } else {
        saludo += totalAll + ' pr\u00e1cticas y contando. Te has vuelto imparable. Sigamos creciendo.';
      }
      return saludo;
    }
  };

  /* Voice coach button HTML */
  JF.voiceCoachButtonHtml = function(lang, accentColor) {
    if (!JF.canSpeak()) return '';
    var color = accentColor || '#6d5bb5';
    var label = lang === 'en' ? 'Coach voice' : 'Voz del coach';
    return '<button id="jiVoiceCoach" class="tapfx" style="width:100%;cursor:pointer;border:1.5px solid ' + color + '33;' +
      'background:linear-gradient(135deg,' + color + '11,' + color + '08);border-radius:16px;' +
      'padding:14px 18px;margin-bottom:16px;display:flex;align-items:center;gap:12px;text-align:left">' +
      '<div style="flex:0 0 auto;width:40px;height:40px;border-radius:50%;' +
        'background:linear-gradient(135deg,' + color + ',' + color + 'cc);' +
        'display:grid;place-items:center;color:#fff;font-size:18px">\ud83c\udf99\ufe0f</div>' +
      '<div style="flex:1">' +
        '<div style="font:600 13px Inter,system-ui,sans-serif;color:#242029">' + label + '</div>' +
        '<div id="jiVoiceStatus" style="font:400 11px Inter,system-ui,sans-serif;color:#8a8296;margin-top:1px">' +
          (lang === 'en' ? 'Tap to hear your daily message' : 'Toca para escuchar tu mensaje diario') + '</div>' +
      '</div>' +
      '<span id="jiVoiceIcon" style="font-size:20px;color:' + color + '">\u25b6</span>' +
    '</button>';
  };


  /* ===== 11. BADGES / LOGROS ===== */
  JF.BADGES = [
    {id:'first',    threshold:1,   emoji:'\u2b50',    es:'Primera pr\u00e1ctica',    en:'First practice'},
    {id:'week1',    threshold:7,   emoji:'\ud83d\udd25',    es:'7 d\u00edas seguidos',     en:'7-day streak'},
    {id:'ten',      threshold:10,  emoji:'\ud83c\udfc5',    es:'10 pr\u00e1cticas',         en:'10 practices'},
    {id:'month',    threshold:30,  emoji:'\ud83d\udc8e',    es:'30 pr\u00e1cticas',         en:'30 practices'},
    {id:'fifty',    threshold:50,  emoji:'\ud83d\ude80',    es:'50 pr\u00e1cticas',         en:'50 practices'},
    {id:'hundred',  threshold:100, emoji:'\ud83d\udc51',    es:'100 pr\u00e1cticas',        en:'100 practices'},
    {id:'twohun',   threshold:200, emoji:'\u2728',    es:'200 pr\u00e1cticas',        en:'200 practices'}
  ];

  JF.getEarnedBadges = function(appKey) {
    var total = JF.getTotalPractices(appKey);
    return JF.BADGES.filter(function(b) { return total >= b.threshold; });
  };

  JF.getNextBadge = function(appKey) {
    var total = JF.getTotalPractices(appKey);
    for (var i = 0; i < JF.BADGES.length; i++) {
      if (total < JF.BADGES[i].threshold) return JF.BADGES[i];
    }
    return null;
  };

  JF.checkNewBadge = function(appKey) {
    var total = JF.getTotalPractices(appKey);
    var key = 'jiBadgeShown_' + appKey;
    try {
      var shown = JSON.parse(localStorage.getItem(key) || '[]');
      for (var i = 0; i < JF.BADGES.length; i++) {
        var b = JF.BADGES[i];
        if (total >= b.threshold && shown.indexOf(b.id) < 0) {
          shown.push(b.id);
          localStorage.setItem(key, JSON.stringify(shown));
          return b;
        }
      }
    } catch(e) {}
    return null;
  };

  JF.showBadgeModal = function(badge, lang, accentColor) {
    if (!badge) return;
    var color = accentColor || '#6d5bb5';
    var label = lang === 'en' ? badge.en : badge.es;
    var title = lang === 'en' ? 'Achievement Unlocked!' : '\u00a1Logro desbloqueado!';
    var btn = lang === 'en' ? 'Awesome!' : '\u00a1Genial!';
    var wrap = document.createElement('div');
    wrap.innerHTML = '<div style="position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.7);' +
      'backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;' +
      'animation:jiFadeIn .3s ease">' +
      '<div style="background:#fff;border-radius:28px;padding:36px 28px;max-width:300px;width:100%;' +
      'text-align:center;box-shadow:0 40px 80px -20px rgba(0,0,0,.5);animation:jiScaleIn .5s ease">' +
        '<div style="font-size:60px;margin-bottom:12px;animation:jiBadgePop .6s ease">' + badge.emoji + '</div>' +
        '<div style="font:600 11px Inter,system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:' + color + ';margin-bottom:8px">' + title + '</div>' +
        '<div style="font-family:Newsreader,serif;font-weight:600;font-size:22px;color:#242029;margin-bottom:20px">' + label + '</div>' +
        '<button id="jiBadgeOk" style="width:100%;cursor:pointer;border:0;border-radius:999px;padding:14px;' +
          'font:600 14px Inter,system-ui,sans-serif;color:#fff;background:' + color + '">' + btn + '</button>' +
      '</div>' +
    '</div>';
    /* Inject badge pop animation */
    if (!document.getElementById('jiBadgeCSS')) {
      var s = document.createElement('style');
      s.id = 'jiBadgeCSS';
      s.textContent = '@keyframes jiBadgePop{0%{transform:scale(0) rotate(-20deg);opacity:0}50%{transform:scale(1.3) rotate(5deg)}100%{transform:scale(1) rotate(0);opacity:1}}';
      document.head.appendChild(s);
    }
    document.body.appendChild(wrap);
    document.getElementById('jiBadgeOk').addEventListener('click', function() {
      try { document.body.removeChild(wrap); } catch(e) {}
    });
  };

  JF.badgesHtml = function(appKey, lang, accentColor) {
    var earned = JF.getEarnedBadges(appKey);
    var next = JF.getNextBadge(appKey);
    var total = JF.getTotalPractices(appKey);
    if (total === 0) return '';
    var color = accentColor || '#6d5bb5';
    var title = lang === 'en' ? 'Achievements' : 'Logros';

    var html = '<div style="border:1px solid rgba(45,38,58,.1);border-radius:18px;padding:14px 16px;' +
      'background:rgba(255,255,255,.6);margin-bottom:18px">' +
      '<div style="font:600 11px Inter,system-ui,sans-serif;color:#242029;margin-bottom:10px">' + title + '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">';

    earned.forEach(function(b) {
      html += '<div title="' + (lang==='en'?b.en:b.es) + '" style="width:40px;height:40px;border-radius:12px;' +
        'background:' + color + '18;display:grid;place-items:center;font-size:20px">' + b.emoji + '</div>';
    });

    if (next) {
      var remaining = next.threshold - total;
      html += '<div title="' + remaining + ' more" style="width:40px;height:40px;border-radius:12px;' +
        'background:rgba(45,38,58,.06);display:grid;place-items:center;font-size:14px;color:#8a8296;' +
        'border:1.5px dashed rgba(45,38,58,.15)">?</div>';
    }

    html += '</div>';
    if (next) {
      var remaining2 = next.threshold - total;
      html += '<div style="font:400 10px Inter,system-ui,sans-serif;color:#8a8296;margin-top:8px">' +
        (lang==='en' ? remaining2 + ' more for ' + next.en : remaining2 + ' m\u00e1s para ' + next.es) + '</div>';
    }
    html += '</div>';
    return html;
  };


  /* ===== 12. RITUAL DE CIERRE / DAY CLOSURE RITUAL ===== */
  JF.shouldShowClosure = function() {
    var h = new Date().getHours();
    if (h < 20) return false;
    try {
      var last = localStorage.getItem('jiClosureShown');
      var today = new Date().toISOString().slice(0, 10);
      return last !== today;
    } catch(e) { return false; }
  };

  JF.markClosureShown = function() {
    try {
      localStorage.setItem('jiClosureShown', new Date().toISOString().slice(0, 10));
    } catch(e) {}
  };

  JF.closureModalHtml = function(lang, appKey) {
    var name = JF.getName();
    var total = JF.getTotalPractices(appKey);
    var mastery = JF.getMasteryData(appKey);
    var journal = JF.getJournalStats(appKey, 1);
    var heatData = JF.getHeatmapData(appKey, 1);
    var todayCount = (heatData.length && heatData[heatData.length - 1].count) || 0;
    var levelLabel = lang === 'en' ? mastery.level.en : mastery.level.es;

    var L = lang === 'en' ? {
      title: 'Your day in 30 seconds',
      greeting: 'Good night' + (name ? ', ' + name : ''),
      practices: 'practices today',
      level: 'Level',
      mood: 'You felt',
      noPractice: "You didn't practice today — that's okay. Tomorrow is a new chance.",
      didPractice: 'You showed up today. That matters more than you think.',
      tomorrow: "Tomorrow's affirmation:",
      close: 'Good night \ud83c\udf19'
    } : {
      title: 'Tu d\u00eda en 30 segundos',
      greeting: 'Buenas noches' + (name ? ', ' + name : ''),
      practices: 'pr\u00e1cticas hoy',
      level: 'Nivel',
      mood: 'Te sentiste',
      noPractice: 'Hoy no practicaste \u2014 est\u00e1 bien. Ma\u00f1ana es una nueva oportunidad.',
      didPractice: 'Hoy te presentaste. Eso importa m\u00e1s de lo que crees.',
      tomorrow: 'Afirmaci\u00f3n de ma\u00f1ana:',
      close: 'Buenas noches \ud83c\udf19'
    };

    var moodEmojis = ['','😫','😕','😐','😊','🤩'];
    var moodLine = '';
    if (journal && journal.entries.length) {
      var lastMood = journal.entries[journal.entries.length - 1].mood;
      moodLine = '<div style="font:400 13px Inter;color:#8a8296;margin-bottom:8px">' +
        L.mood + ' ' + moodEmojis[lastMood] + '</div>';
    }

    var message = todayCount > 0 ? L.didPractice : L.noPractice;

    return '<div id="jiClosureModal" style="position:fixed;inset:0;z-index:9998;' +
      'background:linear-gradient(180deg,rgba(10,8,20,.85),rgba(20,15,35,.9));' +
      'backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;padding:20px;' +
      'animation:jiFadeIn .5s ease">' +
      '<div style="max-width:320px;width:100%;text-align:center;animation:jiScaleIn .5s ease">' +
        '<div style="font-size:40px;margin-bottom:16px">\ud83c\udf19</div>' +
        '<div style="font-family:Newsreader,serif;font-weight:500;font-size:24px;color:#fff;margin-bottom:6px">' + L.greeting + '</div>' +
        '<div style="font:400 11px Inter;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:24px">' + L.title + '</div>' +
        '<div style="display:flex;justify-content:center;gap:20px;margin-bottom:20px">' +
          '<div style="text-align:center"><div style="font:700 28px Inter;color:#fff">' + todayCount + '</div><div style="font:400 10px Inter;color:rgba(255,255,255,.6)">' + L.practices + '</div></div>' +
          '<div style="text-align:center"><div style="font-size:28px">' + mastery.level.emoji + '</div><div style="font:400 10px Inter;color:rgba(255,255,255,.6)">' + L.level + ': ' + levelLabel + '</div></div>' +
        '</div>' +
        moodLine +
        '<div style="font:italic 400 14px Newsreader,serif;color:rgba(255,255,255,.85);line-height:1.5;margin-bottom:24px;padding:0 10px">' +
          '"' + message + '"</div>' +
        '<button id="jiClosureBtn" style="cursor:pointer;border:0;border-radius:999px;padding:14px 40px;' +
          'font:600 14px Inter;color:#242029;background:linear-gradient(135deg,#e8d5a0,#f0e6c4);' +
          'box-shadow:0 12px 30px -10px rgba(232,213,160,.6)">' + L.close + '</button>' +
      '</div>' +
    '</div>';
  };

  JF.showClosureModal = function(lang, appKey, onDone) {
    if (!JF.shouldShowClosure()) return;
    JF.markClosureShown();
    var wrap = document.createElement('div');
    wrap.innerHTML = JF.closureModalHtml(lang, appKey);
    document.body.appendChild(wrap);
    var btn = document.getElementById('jiClosureBtn');
    function close() { try { document.body.removeChild(wrap); } catch(e) {} }
    btn.addEventListener('click', function() {
      close();
      if (onDone) onDone();
    });
    /* Auto-close after 30 seconds */
    setTimeout(function() { close(); }, 30000);
    /* Voice the closure if possible */
    if (JF.canSpeak()) {
      var name = JF.getName();
      var msg = lang === 'en'
        ? ('Good night' + (name ? ', ' + name : '') + '. You showed up today. Rest well.')
        : ('Buenas noches' + (name ? ', ' + name : '') + '. Hoy te presentaste. Descansa bien.');
      setTimeout(function() { JF.speak(msg, lang); }, 800);
    }
  };


  /* ===== 13. VOICE CHAT BOT / BOT DE VOZ CONVERSACIONAL ===== */
  var SR = W.SpeechRecognition || W.webkitSpeechRecognition;

  JF.canListen = function() { return !!SR; };

  JF._voiceChatState = { listening: false, processing: false, recognition: null };

  JF.startListening = function(lang, onResult, onError) {
    if (!SR) { if (onError) onError('no_support'); return; }
    var vcs = JF._voiceChatState;
    if (vcs.listening) return;
    try {
      var r = new SR();
      r.lang = (lang === 'en') ? 'en-US' : 'es-MX';
      r.interimResults = false;
      r.maxAlternatives = 1;
      r.continuous = false;
      vcs.recognition = r;
      vcs.listening = true;
      r.onresult = function(e) {
        vcs.listening = false;
        var transcript = '';
        for (var i = e.resultIndex; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        if (onResult) onResult(transcript.trim());
      };
      r.onerror = function(e) {
        vcs.listening = false;
        if (onError) onError(e.error || 'error');
      };
      r.onend = function() {
        vcs.listening = false;
      };
      r.start();
    } catch(e) {
      vcs.listening = false;
      if (onError) onError('start_failed');
    }
  };

  JF.stopListening = function() {
    var vcs = JF._voiceChatState;
    if (vcs.recognition) {
      try { vcs.recognition.stop(); } catch(e) {}
    }
    vcs.listening = false;
  };

  /* Send user's spoken text to Joga AI Worker and get response */
  JF.askCoachAI = function(text, lang, appName, callback) {
    var JOGA_AI_URL = 'https://joga-ai.omhotien90.workers.dev';
    var name = JF.getName() || '';
    var struggle = JF.getStruggle() || '';
    
    var systemContext = lang === 'en'
      ? 'You are a warm, wise personal coach inside Joga Intelligence (a personal development app). '
        + 'The user is talking to you by VOICE so keep your answer natural, conversational, short (max 80 words). '
        + 'Do NOT use markdown, bullet points, or formatting — speak naturally like a real coach. '
        + (name ? 'Their name is ' + name + '. ' : '')
        + (struggle ? 'They struggle with: ' + struggle + '. ' : '')
        + 'Respond in English.'
      : 'Eres un coach personal cálido y sabio dentro de Joga Intelligence (app de desarrollo personal). '
        + 'El usuario te habla por VOZ así que responde natural, conversacional, corto (máx 80 palabras). '
        + 'NO uses markdown, viñetas, ni formato — habla natural como un coach real. '
        + (name ? 'Se llama ' + name + '. ' : '')
        + (struggle ? 'Su mayor lucha es: ' + struggle + '. ' : '')
        + 'Responde en español.';
    
    fetch(JOGA_AI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app: appName || 'jogacoach',
        situacion: text,
        idioma: lang,
        sistema: systemContext
      })
    }).then(function(r) { return r.json(); })
    .then(function(d) {
      if (d && d.texto) {
        callback(null, String(d.texto).trim());
      } else if (d && d.error === 'limite_diario' && d.mensaje) {
        callback(null, String(d.mensaje));
      } else {
        /* Fallback: local response */
        callback(null, JF._localCoachResponse(text, lang));
      }
    }).catch(function() {
      callback(null, JF._localCoachResponse(text, lang));
    });
  };

  /* Offline fallback responses */
  JF._localCoachResponse = function(text, lang) {
    var name = JF.getName();
    if (lang === 'en') {
      var responses = [
        'I hear you' + (name ? ', ' + name : '') + '. Take a deep breath right now. Inhale for 4, hold for 7, exhale for 8. Sometimes the best thing you can do is pause and reset.',
        (name ? name + ', w' : 'W') + 'hat you\'re feeling is valid. Remember: progress isn\'t a straight line. One practice at a time. You\'re already ahead by being here.',
        'Here\'s what I want you to try right now: close your eyes, take 3 deep breaths, and ask yourself — what\'s the ONE thing I can control today? Focus only on that.',
        'You know what separates people who grow from those who don\'t? They show up even when they don\'t feel like it. You\'re showing up right now. That matters.'
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    } else {
      var respuestas = [
        'Te escucho' + (name ? ', ' + name : '') + '. Respira hondo ahora mismo. Inhala 4 segundos, sostén 7, exhala 8. A veces lo mejor que puedes hacer es pausar y reiniciar.',
        (name ? name + ', l' : 'L') + 'o que sientes es válido. Recuerda: el progreso no es una línea recta. Una práctica a la vez. Ya estás adelante por estar aquí.',
        'Esto quiero que hagas ahora: cierra los ojos, toma 3 respiraciones profundas, y pregúntate — ¿cuál es la ÚNICA cosa que puedo controlar hoy? Enfócate solo en eso.',
        '¿Sabes qué separa a la gente que crece de la que no? Se presentan incluso cuando no tienen ganas. Tú te estás presentando ahora mismo. Eso importa.'
      ];
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  };

  /* Full voice chat flow: listen → AI → speak response */
  JF.voiceChat = function(lang, appName, onStateChange) {
    var notify = onStateChange || function() {};
    
    notify('listening');
    JF.startListening(lang, function(transcript) {
      if (!transcript) { notify('idle'); return; }
      notify('thinking', transcript);
      
      JF.askCoachAI(transcript, lang, appName, function(err, response) {
        if (!response) { notify('idle'); return; }
        notify('speaking', response);
        JF.speak(response, lang, function() {
          notify('idle');
        });
      });
    }, function(error) {
      if (error === 'not-allowed') {
        notify('denied');
      } else {
        notify('idle');
      }
    });
  };

  /* Voice chat button HTML — the main conversational mic button */
  JF.voiceChatButtonHtml = function(lang, accentColor) {
    if (!JF.canListen() || !JF.canSpeak()) return '';
    var color = accentColor || '#6d5bb5';
    var label = lang === 'en' ? 'Talk to your coach' : 'Habla con tu coach';
    var sub = lang === 'en' ? 'Tap the mic and speak' : 'Toca el mic y habla';
    return '<div id="jiVoiceChatWrap" style="border:1.5px solid ' + color + '22;' +
      'background:linear-gradient(135deg,' + color + '08,' + color + '04);border-radius:22px;' +
      'padding:18px;margin-bottom:18px;text-align:center">' +
      '<div style="font:600 12px Inter,system-ui,sans-serif;color:#242029;margin-bottom:4px">' + label + '</div>' +
      '<div id="jiVCStatus" style="font:400 11px Inter,system-ui,sans-serif;color:#8a8296;margin-bottom:14px">' + sub + '</div>' +
      '<button id="jiVCMicBtn" class="tapfx" style="cursor:pointer;border:0;width:64px;height:64px;border-radius:50%;' +
        'background:linear-gradient(135deg,' + color + ',' + color + 'cc);' +
        'color:#fff;font-size:26px;box-shadow:0 12px 30px -8px ' + color + '88;' +
        'display:inline-grid;place-items:center;transition:transform .2s,box-shadow .2s">' +
        '\ud83c\udfa4' +
      '</button>' +
      '<div id="jiVCTranscript" style="display:none;margin-top:14px;font:italic 400 13px Newsreader,serif;' +
        'color:#242029;line-height:1.5;padding:12px 16px;background:rgba(45,38,58,.04);border-radius:14px"></div>' +
      '<div id="jiVCResponse" style="display:none;margin-top:10px;font:400 13px Inter,system-ui,sans-serif;' +
        'color:#242029;line-height:1.6;padding:14px 16px;background:linear-gradient(135deg,' + color + '08,' + color + '04);' +
        'border-radius:14px;border:1px solid ' + color + '18;text-align:left"></div>' +
    '</div>';
  };

  /* Wire up voice chat button */
  JF.initVoiceChat = function(lang, appName, accentColor) {
    var btn = document.getElementById('jiVCMicBtn');
    if (!btn) return;
    var color = accentColor || '#6d5bb5';

    btn.addEventListener('click', function() {
      var vcs = JF._voiceChatState;
      if (vcs.listening) {
        JF.stopListening();
        return;
      }

      JF.voiceChat(lang, appName, function(state, data) {
        var status = document.getElementById('jiVCStatus');
        var transcript = document.getElementById('jiVCTranscript');
        var response = document.getElementById('jiVCResponse');

        if (state === 'listening') {
          btn.style.transform = 'scale(1.15)';
          btn.style.boxShadow = '0 0 0 8px ' + color + '22, 0 12px 30px -8px ' + color + '88';
          btn.textContent = '\ud83d\udd34';
          if (status) status.textContent = lang === 'en' ? 'Listening... speak now' : 'Escuchando... habla ahora';
          if (transcript) transcript.style.display = 'none';
          if (response) response.style.display = 'none';
        }
        else if (state === 'thinking') {
          btn.style.transform = 'scale(1)';
          btn.style.boxShadow = '0 12px 30px -8px ' + color + '88';
          btn.textContent = '\u23f3';
          if (status) status.textContent = lang === 'en' ? 'Thinking...' : 'Pensando...';
          if (transcript) { transcript.style.display = 'block'; transcript.textContent = '\u201c' + data + '\u201d'; }
        }
        else if (state === 'speaking') {
          btn.textContent = '\ud83d\udde3\ufe0f';
          if (status) status.textContent = lang === 'en' ? 'Coach is speaking...' : 'El coach est\u00e1 hablando...';
          if (response) { response.style.display = 'block'; response.textContent = data; }
        }
        else if (state === 'denied') {
          btn.textContent = '\ud83c\udfa4';
          btn.style.transform = 'scale(1)';
          btn.style.boxShadow = '0 12px 30px -8px ' + color + '88';
          if (status) status.textContent = lang === 'en'
            ? 'Microphone access denied. Check your browser settings.'
            : 'Acceso al micr\u00f3fono denegado. Revisa la configuraci\u00f3n de tu navegador.';
        }
        else { /* idle */
          btn.textContent = '\ud83c\udfa4';
          btn.style.transform = 'scale(1)';
          btn.style.boxShadow = '0 12px 30px -8px ' + color + '88';
          if (status) status.textContent = lang === 'en' ? 'Tap the mic and speak' : 'Toca el mic y habla';
        }
      });
    });
  };

})(window);
