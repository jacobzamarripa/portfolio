'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'portfolio-explore.js'),'utf8');
function helpers(storage){
  const window={PortfolioEvidence:require('./explore-data.js')};
  const context={window,URL,URLSearchParams,location:{href:'https://example.test/portfolio/',search:'',origin:'https://example.test'},document:{currentScript:{src:'https://example.test/portfolio/assets/portfolio-explore.js'},readyState:'loading',addEventListener(){}},matchMedia:()=>({matches:false}),sessionStorage:storage};
  vm.runInNewContext(source.replace(/\}\)\(\);\s*$/, 'window.testHelpers={store:store,pathClick:pathClick,pathTransition:pathTransition};})();'),context);
  return window.testHelpers;
}
function anchor(extra={}){return {href:'https://example.test/portfolio/apple-rtl/?focus=pm&evidence=apple-results',target:'',hasAttribute:()=>false,...extra};}
test('only unmodified, same-origin, same-window path clicks are intercepted',()=>{
  const {pathClick}=helpers();
  assert.ok(pathClick({},anchor()));
  for(const event of [{defaultPrevented:true},{metaKey:true},{ctrlKey:true},{shiftKey:true},{altKey:true},{button:1},{button:2}])assert.ok(!pathClick(event,anchor()));
  for(const link of [null,anchor({target:'_blank'}),anchor({hasAttribute:n=>n==='download'}),anchor({href:'https://other.test/'})])assert.ok(!pathClick({},link));
});
test('storage parse errors, access denial and write denial are safe',()=>{
  const bad=helpers({getItem(){return '{broken';},setItem(){throw Error('quota');}});
  assert.equal(bad.store('seen'),null);assert.equal(bad.store('seen',['one']),null);
  const blocked=helpers({getItem(){throw Error('denied');}});assert.equal(blocked.store('seen'),null);
  let value=null;const good=helpers({getItem:()=>value,setItem:(k,v)=>{value=v;}});good.store('seen',['one']);assert.equal(JSON.stringify(good.store('seen')),'["one"]');
});
test('outgoing transition readiness rejection is handled without changing navigation',async()=>{
  const {pathTransition}=helpers();let tag='';let caught=false;
  const promise={catch(fn){caught=true;fn(new Error('Transition was skipped'));}};const vt={ready:promise,updateCallbackDone:promise,finished:promise,types:{add(value){tag=value;}}};
  pathTransition({viewTransition:vt},true);assert.equal(caught,true);assert.equal(tag,'px-path');
  tag='';pathTransition({viewTransition:vt},false);assert.equal(tag,'');pathTransition({},true);
});
function bootstrap(file,reduced=false,throws=false){
  const html=fs.readFileSync(path.join(__dirname,'..',file),'utf8');
  const script=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes('pagereveal'));
  assert.ok(script,file+' needs early transition handling');
  let arriving=false;const events={};vm.runInNewContext(script,{addEventListener:(name,fn)=>{events[name]=fn;},location:{search:'?evidence=apple-results'},matchMedia:()=>{if(throws)throw Error('unavailable');return {matches:reduced};},document:{documentElement:{classList:{add:()=>{arriving=true;}}}}});
  return {events,arriving};
}
test('all five heads handle skipped incoming transitions synchronously',()=>{
  for(const file of ['index.html','apple-rtl/index.html','centric-fiberops/index.html','ci-fleet/index.html','omni-pmo/index.html']){
    let handled=false;const {events}=bootstrap(file);const promise={catch:fn=>{handled=true;fn();}};events.pagereveal({viewTransition:{ready:promise,updateCallbackDone:promise,finished:promise}});assert.equal(handled,true,file);events.pagereveal({});
  }
});
test('case arrival heads respect reduced motion and tolerate missing media APIs',()=>{
  for(const file of ['apple-rtl/index.html','centric-fiberops/index.html','ci-fleet/index.html','omni-pmo/index.html']){
    assert.equal(bootstrap(file).arriving,true);assert.equal(bootstrap(file,true).arriving,false);assert.equal(bootstrap(file,false,true).arriving,false);
  }
});
