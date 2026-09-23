/* Dependency-free tests / Pruebas sin dependencias */
'use strict';
function assert(value,message){if(!value)throw new Error(message||'assertion failed');}
function equal(actual,expected,message){assert(actual===expected,(message||'not equal')+': '+actual+' !== '+expected);}
function match(value,regex,message){assert(regex.test(value),message||('no match: '+value));}

function memory(){
  const data={};
  return {getItem:k=>Object.prototype.hasOwnProperty.call(data,k)?data[k]:null,setItem:(k,v)=>{data[k]=String(v);},removeItem:k=>{delete data[k];}};
}
load('jogamind-compact-core.js');
const Compact=globalThis.JogaMindCompact;
assert(Compact,'Compact API is exposed');

const storage=memory();
const store=new Compact.Store(storage);
store.start('Sigo posponiendo una conversación por miedo.','es');
let state=store.snapshot();
equal(state.active.step,'hypothesis');
match(state.active.reflection,/Escucho/);
match(state.active.hypothesis,/Puede haber/);
assert(!/diagnóstico|trastorno/i.test(state.active.hypothesis));

store.decide(false,'Tal vez evito el conflicto cuando siento presión.');
state=store.snapshot();
equal(state.active.accepted,false);
match(state.active.hypothesis,/Tal vez evito/);
store.chooseAction('Respirar antes de responder.');
equal(store.snapshot().active.step,'reflect');
store.complete('Pude responder con más calma.');
state=store.snapshot();
equal(state.active,null);
equal(state.cycles.length,1);
equal(state.cycles[0].completed,true);

const id=state.cycles[0].id;
store.edit(id,{hypothesis:'Patrón editado por mí.',action:'Paso editado.',reflectionAfter:'Reflexión editada.'});
equal(store.snapshot().cycles[0].hypothesis,'Patrón editado por mí.');
equal(store.snapshot().cycles[0].action,'Paso editado.');
equal(store.snapshot().cycles[0].reflectionAfter,'Reflexión editada.');
equal(new Compact.Store(storage).snapshot().cycles.length,1,'persists locally');
store.remove(id);
equal(store.snapshot().cycles.length,0);

store.start('I doubt myself before I begin.','en');
state=store.snapshot();
match(state.active.reflection,/I hear/);
match(state.active.hypothesis,/There may be/);
equal(Compact.ACTIONS.en.length,3);
store.cancel();
store.clear();
equal(storage.getItem(Compact.KEY),null);

const effects=[];
const component={state:{lang:'en'},play:n=>effects.push('play:'+n),setState:p=>{component.state=Object.assign({},component.state,p);},affirm:()=>effects.push('affirm'),open:s=>()=>effects.push('audio:'+s.title)};
Compact.Host.openPractice(component,2);
equal(component.state.view,'library'); equal(component.state.currentPractice,2);
const target={scrollIntoView:()=>effects.push('scroll'),focus:()=>effects.push('focus')};
assert(Compact.Host.flushPractice(component,{getElementById:id=>id==='jmc-practice-2'?target:null},fn=>fn()));
Compact.Host.affirm(component); Compact.Host.audio(component);
const features={incrementPractices:k=>effects.push('progress:'+k),checkNewBadge:k=>{effects.push('badge-check:'+k);return 'badge';},showBadgeModal:()=>effects.push('badge-modal'),showJournalModal:()=>effects.push('journal')};
Compact.Host.complete(component,{action:'One step'},features,fn=>fn());
['play:tap','scroll','focus','affirm','audio:Root','play:boom','progress:subment','badge-check:subment','badge-modal','journal'].forEach(x=>assert(effects.indexOf(x)>=0,'missing host effect '+x));
print('jogamind-compact.test.js: OK');
