'use strict';
function assert(value,message){if(!value)throw new Error(message||'assertion failed');}
const mind=readFile('subment.html');
const ui=readFile('jogamind-compact-ui.js');
const sw=readFile('sw.js');
[
  'jogamind-compact-core.js','jogamind-compact-ui.js','id="jogaMindCompact"',
  'Host.complete(this,cycle,window.jogaFeatures)','Host.audio(this)','Host.affirm(this)',
  'Host.openPractice(this,i)','Host.flushPractice(this,document)','id="{{ p.anchorId }}"'
].forEach(token=>assert(mind.includes(token),'subment missing '+token));
assert(mind.includes('if(this._compact && this._compact.el===host)'),'Compact must remount when React replaces its host');
assert(!mind.includes('if(this._compact){ this._compact.setLanguage(L); return; }'),'stale-host mount regression returned');
assert(ui.includes('Cada día, entiende un patrón y elige un pequeño paso.'));
assert(ui.includes('Each day, understand one pattern and choose one small step.'));
["aria-label=\"'+t.edit+'\"","aria-label=\"'+t.ownLabel+'\"","aria-label=\"'+t.memoryHyp+'\"","aria-label=\"'+t.actionEdit+'\"","aria-label=\"'+t.reflectionEdit+'\"",'id="jmc-affirm-confirm"'].forEach(token=>assert(ui.includes(token),'UI missing '+token));
assert(sw.includes("const CACHE_VERSION = 'joga-v94'"));
assert(sw.includes("'./jogamind-compact-core.js'"));
assert(sw.includes("'./jogamind-compact-ui.js'"));
print('verify-production.js: OK');
