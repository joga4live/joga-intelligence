/* Joga Mind Compact — state and local persistence / estado y persistencia local */
(function (root) {
  'use strict';
  var KEY = 'jiCompact_subment';
  var THEMES = [
    { id:'avoidance', keys:['evito','pospongo','después','miedo','avoid','delay','later','fear'], practice:2,
      es:'Puede haber un patrón de evitación cuando aparece incomodidad.', en:'There may be an avoidance pattern when discomfort appears.' },
    { id:'pressure', keys:['debo','perfect','fracaso','exig','should','fail','pressure'], practice:0,
      es:'Puede haber un patrón de exigencia que convierte cada paso en una prueba.', en:'There may be a pressure pattern that turns each step into a test.' },
    { id:'doubt', keys:['duda','no puedo','insegur','capaz','doubt','cannot','insecure','capable'], practice:1,
      es:'Puede haber un patrón de duda antes de actuar.', en:'There may be a pattern of doubt before acting.' },
    { id:'reactivity', keys:['reaccion','enojo','ansiedad','impulso','react','angry','anxiety','impulse'], practice:2,
      es:'Puede haber una respuesta automática que aparece antes de que puedas elegir.', en:'There may be an automatic response arriving before you can choose.' },
    { id:'attention', keys:[], practice:0,
      es:'Podría haber un patrón que merece observarse con más calma.', en:'There may be a pattern worth observing more calmly.' }
  ];
  var ACTIONS = {
    es:['Respirar tres veces antes de responder.','Dedicar cinco minutos al primer paso.','Escribir una alternativa más amable.'],
    en:['Take three breaths before responding.','Give five minutes to the first step.','Write one kinder alternative.']
  };
  function uid(){ return Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7); }
  function day(){ return new Date().toISOString().slice(0,10); }
  function clean(v, max){ return String(v||'').trim().slice(0,max||500); }
  function clone(v){ return JSON.parse(JSON.stringify(v)); }
  function blank(){ return { version:1, active:null, cycles:[] }; }
  function load(storage){
    try {
      var parsed=JSON.parse(storage.getItem(KEY)||'null');
      if(parsed && Array.isArray(parsed.cycles)) return parsed;
    } catch(e){}
    return blank();
  }
  function pickTheme(text, history){
    var s=clean(text,600).toLowerCase(), best=THEMES[THEMES.length-1], score=0;
    THEMES.forEach(function(t){
      var n=t.keys.reduce(function(sum,k){ return sum+(s.indexOf(k)>=0?1:0); },0);
      var prior=(history||[]).filter(function(c){ return c.theme===t.id && c.accepted; }).length;
      n += Math.min(prior,2)*0.15;
      if(n>score){ score=n; best=t; }
    });
    return best;
  }
  function reflect(text, lang){
    var q=clean(text,300);
    return lang==='en'
      ? 'I hear that this is present for you: “'+q+'”. Let’s look at it without judging it.'
      : 'Escucho que esto está presente para ti: «'+q+'». Vamos a observarlo sin juzgarlo.';
  }
  function Store(storage){ this.storage=storage||root.localStorage; this.data=load(this.storage); }
  Store.prototype.save=function(){ this.storage.setItem(KEY,JSON.stringify(this.data)); return this.snapshot(); };
  Store.prototype.snapshot=function(){ return clone(this.data); };
  Store.prototype.start=function(text,lang){
    var input=clean(text,300); if(!input) throw new Error('checkin_required');
    var theme=pickTheme(input,this.data.cycles);
    this.data.active={ id:uid(), date:day(), lang:lang==='en'?'en':'es', step:'hypothesis', checkin:input,
      reflection:reflect(input,lang), theme:theme.id, hypothesis:theme[lang==='en'?'en':'es'], practice:theme.practice,
      accepted:null, action:'', reflectionAfter:'', completed:false };
    return this.save();
  };
  Store.prototype.decide=function(accepted,edited){
    var c=this.data.active; if(!c) throw new Error('no_active_cycle');
    c.accepted=!!accepted; c.hypothesis=clean(edited||c.hypothesis,300); c.step='practice';
    return this.save();
  };
  Store.prototype.chooseAction=function(action){
    var c=this.data.active, value=clean(action,180); if(!c||!value) throw new Error('action_required');
    c.action=value; c.step='reflect'; return this.save();
  };
  Store.prototype.complete=function(note){
    var c=this.data.active, value=clean(note,400); if(!c||!value) throw new Error('reflection_required');
    c.reflectionAfter=value; c.completed=true; c.step='complete'; c.completedAt=new Date().toISOString();
    this.data.cycles.unshift(clone(c)); this.data.cycles=this.data.cycles.slice(0,30); this.data.active=null;
    return this.save();
  };
  Store.prototype.edit=function(id,patch){
    var c=this.data.cycles.find(function(x){return x.id===id;}); if(!c) return this.snapshot();
    ['hypothesis','action','reflectionAfter'].forEach(function(k){ if(patch[k]!=null) c[k]=clean(patch[k],400); });
    return this.save();
  };
  Store.prototype.remove=function(id){ this.data.cycles=this.data.cycles.filter(function(c){return c.id!==id;}); return this.save(); };
  Store.prototype.clear=function(){ this.data=blank(); try{this.storage.removeItem(KEY);}catch(e){} return this.snapshot(); };
  Store.prototype.cancel=function(){ this.data.active=null; return this.save(); };
  var Host={
    openPractice:function(component,index){
      component._compactPracticePending=index;
      if(component.play) component.play('tap');
      component.setState({view:'library',currentPractice:index});
    },
    flushPractice:function(component,doc,defer){
      if(component._compactPracticePending==null) return false;
      var index=component._compactPracticePending; component._compactPracticePending=null;
      (defer||setTimeout)(function(){
        var target=doc.getElementById('jmc-practice-'+index); if(!target) return;
        if(target.scrollIntoView) target.scrollIntoView({behavior:'smooth',block:'center'});
        if(target.focus) target.focus({preventScroll:true});
      },0);
      return true;
    },
    affirm:function(component){ component.affirm(); },
    audio:function(component){
      var en=(component.state.lang||'es')==='en';
      component.open({title:en?'Root':'Raíz',tag:en?'Reprogramming':'Reprogramación',len:7})();
    },
    complete:function(component,cycle,features,defer){
      if(component.play) component.play('boom');
      if(!features) return;
      var later=defer||setTimeout, lang=component.state.lang||'es';
      features.incrementPractices('subment');
      var badge=features.checkNewBadge('subment');
      if(badge) later(function(){features.showBadgeModal(badge,lang,'#B8924A');},300);
      later(function(){features.showJournalModal(lang,cycle.action,'subment','#B8924A',function(){});},500);
    }
  };
  root.JogaMindCompact={ KEY:KEY, Store:Store, Host:Host, THEMES:THEMES, ACTIONS:ACTIONS, pickTheme:pickTheme, reflect:reflect };
})(typeof window!=='undefined'?window:globalThis);
