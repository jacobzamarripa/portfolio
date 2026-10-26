'use strict';
/* Real-browser integration checks. No dependency is fetched by this test. */
const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path');
if(process.env.PORTFOLIO_BROWSERS_PATH)process.env.PLAYWRIGHT_BROWSERS_PATH=process.env.PORTFOLIO_BROWSERS_PATH;
const pw=require(process.env.PORTFOLIO_PLAYWRIGHT_MODULE||'playwright');
const E=require('./explore-data.js'),root=path.resolve(__dirname,'..');
const engines=(process.env.PORTFOLIO_ENGINES||'chromium,webkit,firefox').split(',');
const output=process.env.PORTFOLIO_QA_OUTPUT;let server,base;
before(async()=>{server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png'})[path.extname(file)]||'application/octet-stream');res.end(data);});});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base='http://127.0.0.1:'+server.address().port+'/';if(output)fs.mkdirSync(output,{recursive:true});});
after(()=>new Promise(resolve=>server.close(resolve)));
function url(e,role){const u=new URL(e.path,base);u.searchParams.set('focus',role);u.searchParams.set('evidence',e.id);return u.href;}
async function opened(p){await p.waitForFunction(()=>{const b=document.querySelector('.px-journey'),c=document.querySelector('.px-j-curtain');return b&&!b.classList.contains('px-enter')&&!c.classList.contains('px-on')&&!document.documentElement.classList.contains('px-arriving');}).catch(async err=>{err.message+=' '+JSON.stringify(await p.evaluate(()=>({url:location.href,bar:document.querySelector('.px-journey')?.className,curtain:document.querySelector('.px-j-curtain')?.className,html:document.documentElement.className})));throw err;});await p.waitForTimeout(420);}
async function stable(p,label){const y=await p.evaluate(()=>scrollY);await p.waitForTimeout(1000);assert.ok(Math.abs(await p.evaluate(()=>scrollY)-y)<2,label+' moved after reveal');}
function errors(p){
 const result=[],nativeSkips=[];
 p.on('pageerror',e=>{
   // Chromium can reject an internal transition before exposing its promises.
   // Record only this exact stackless native cancellation; never suppress script errors.
   if(e.name==='AbortError'&&e.message==='Transition was skipped'&&!e.stack)nativeSkips.push({url:p.url(),message:e.message});
   else result.push('pageerror: '+e.name+' '+e.message+' at '+p.url()+' '+e.stack);
 });
 p.on('console',m=>{if(m.type()!=='error')return;if(m.text().includes('Transition was aborted because of invalid state. ViewTransition opt-in disabled'))nativeSkips.push({url:p.url(),message:m.text()});else if(!/Failed to load resource|favicon/.test(m.text()))result.push('console: '+m.text());});
 p.on('close',()=>{if(nativeSkips.length)console.log('native transition fallback diagnostics',JSON.stringify(nativeSkips));});
 return result;
}
for(const engine of engines){
 test(engine+': all five paths, four stops, both widths',{timeout:240000},async()=>{const b=await pw[engine].launch({headless:process.env.PORTFOLIO_HEADED!=='1',ignoreDefaultArgs:engine==='chromium'?['--disable-back-forward-cache']:[]});try{for(const width of [1280,390]){const c=await b.newContext({viewport:{width,height:900}});const p=await c.newPage(),errs=errors(p);for(const [role,r]of Object.entries(E.roles)){
 await p.goto(base+'?focus='+role+'#explore');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(450);assert.equal(await p.locator('.px-lens-hits a').count(),4);assert.equal(await p.locator('.px-lenses button[aria-pressed=true]').getAttribute('data-role'),role);await p.locator('.px-lens-start').click();
 for(let i=0;i<4;i++){await opened(p);const entry=E.routeFor(role)[i];assert.equal(new URL(p.url()).searchParams.get('evidence'),entry.id);const data=await p.evaluate(()=>{const t=document.querySelector('.px-evidence-target'),bar=document.querySelector('.px-journey');return {top:t?.getBoundingClientRect().top,width:innerWidth,sw:document.documentElement.scrollWidth,pad:parseFloat(document.body.style.getPropertyValue('--px-journey-h')),height:bar.offsetHeight,heading:t?.matches('h1,h2,h3,h4,h5,h6')?t.textContent:t?.querySelector('h1,h2,h3,h4')?.textContent};});assert.equal(data.sw,data.width,role+' overflow');assert.ok(data.top>=-1&&data.top<125,entry.id+' target '+data.top);assert.ok(data.pad>=data.height);assert.ok(data.heading,entry.id+' leading heading');assert.equal(await p.locator('.px-j-tl [aria-current=step]').count(),1);await p.waitForFunction(()=>document.querySelector('.px-hl-layer'));const marks=await p.evaluate(()=>{const t=document.querySelector('.px-evidence-target'),h=t.matches('h1,h2,h3,h4,h5,h6')?t:t.querySelector('h1,h2,h3,h4');const range=document.createRange();range.selectNodeContents(h);const rects=[...range.getClientRects()];return [...document.querySelectorAll('.px-hl:not([hidden])')].map(m=>{const r=m.getBoundingClientRect();return rects.some(hr=>Math.abs(r.top-hr.top)<2&&Math.abs(r.left-hr.left)<2&&Math.abs(r.width-hr.width)<2&&Math.abs(r.height-hr.height)<2);});});assert.ok(marks.length&&marks.every(Boolean),entry.id+' highlight covers leading heading');await stable(p,entry.id);
 if(output)await p.screenshot({path:path.join(output,engine+'-'+width+'-'+role+'-'+i+'.png')});
 if(i<3)await p.locator('.px-j-next').click();else{await p.locator('.px-j-next').click();await p.waitForURL(u=>!u.searchParams.has('evidence'));assert.equal(new URL(p.url()).searchParams.get('focus'),role);await p.locator('.px-lenses').waitFor({state:'visible'});await p.waitForTimeout(400);}
 } }assert.deepEqual(errs,[]);await c.close();}}finally{await b.close();}});
 test(engine+': lifecycle, access, storage, history and fallbacks',{timeout:180000},async()=>{const b=await pw[engine].launch({headless:process.env.PORTFOLIO_HEADED!=='1',ignoreDefaultArgs:engine==='chromium'?['--disable-back-forward-cache']:[]});try{const c=await b.newContext({viewport:{width:390,height:844}}),p=await c.newPage(),errs=errors(p),e=E.routeFor('ops')[0];
 await p.goto(url(e,'ops'));await opened(p);
 await p.locator('.px-j-title').click();assert.equal(await p.locator('.px-j-title').getAttribute('aria-expanded'),'false');assert.equal(await p.locator('#px-j-look').isVisible(),false);await p.locator('.px-j-title').click();assert.equal(await p.locator('.px-j-title').getAttribute('aria-expanded'),'true');
 await p.locator('.px-j-tools button').first().click();assert.equal(await p.locator('.px-j-map').isVisible(),true);assert.ok(await p.evaluate(()=>document.querySelector('.px-j-map').contains(document.activeElement)));assert.ok(await p.evaluate(()=>parseFloat(document.body.style.getPropertyValue('--px-journey-h'))>=document.querySelector('.px-journey').offsetHeight));await p.keyboard.press('Escape');assert.equal(await p.locator('.px-j-map').isVisible(),false);assert.equal(await p.locator('.px-j-tools button').first().getAttribute('aria-expanded'),'false');
 // Keyboard focus on body content is never hidden under the fixed dock.
 await p.evaluate(()=>{const a=document.createElement('button');a.id='qa-focus';a.textContent='QA';document.querySelector('.px-evidence-target').append(a);a.scrollIntoView({block:'end',behavior:'instant'});a.focus();});assert.ok(await p.evaluate(()=>document.querySelector('#qa-focus').getBoundingClientRect().bottom<document.querySelector('.px-journey').getBoundingClientRect().top));
 // Modified and middle clicks remain native and never raise the curtain.
 for(const opts of [{modifiers:['Meta']},{modifiers:['Control']},{modifiers:['Alt']},{button:'middle'}]){
   await p.goto(url(e,'ops'));await opened(p);
   await p.evaluate(()=>{for(const name of ['click','auxclick'])document.addEventListener(name,ev=>sessionStorage.setItem('qa-native-click',String(ev.defaultPrevented)));});
   await p.locator('.px-j-next').click(opts);assert.equal(await p.evaluate(()=>sessionStorage.getItem('qa-native-click')),'false');
   for(const extra of c.pages())if(extra!==p)await extra.close();
 }
 await p.goto(url(e,'ops'));await opened(p);
 await p.locator('.px-j-close').click();await p.evaluate(()=>{dispatchEvent(new Event('resize'));dispatchEvent(new Event('scroll'));});assert.equal(await p.locator('.px-journey,.px-j-curtain,.px-hl-layer').count(),0);assert.equal(await p.evaluate(()=>document.body.style.getPropertyValue('--px-journey-h')),'');assert.equal(new URL(p.url()).searchParams.has('evidence'),false);await p.getByRole('link',{name:'Resume the path'}).click();await opened(p);
 await p.evaluate(()=>window.scrollBy({top:300,behavior:'instant'}));await p.waitForFunction(()=>document.querySelector('.px-journey').classList.contains('px-j-compact'));
 // History exercises the real browser; explicit persisted pageshow checks cancellation too.
 const original=p.url();await p.locator('.px-j-next').click();await opened(p);const next=p.url();await p.goBack({waitUntil:'commit'});await opened(p);assert.equal(p.url(),original);await p.goForward({waitUntil:'commit'});await opened(p);assert.equal(p.url(),next);await p.evaluate(()=>{document.querySelector('.px-j-curtain').classList.add('px-on');dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}));});assert.equal(await p.locator('.px-j-curtain').evaluate(x=>x.classList.contains('px-on')),false);
 await p.goto(base+'apple-rtl/?focus=ops&evidence=invalid');await p.waitForTimeout(100);assert.equal(await p.locator('.px-journey').count(),0);assert.equal(await p.locator('html').evaluate(x=>x.classList.contains('px-arriving')),false);
 for(const value of ['{}','"oops"','42','not-json']){await p.evaluate(v=>sessionStorage.setItem('px-seen-ops',v),value);await p.goto(url(e,'ops'));await opened(p);}
 await p.addInitScript(()=>{Object.defineProperty(window,'sessionStorage',{get(){throw new Error('storage blocked');}});});await p.goto(url(e,'ops'));await opened(p);assert.deepEqual(errs,[]);await c.close();
 const rm=await b.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),rp=await rm.newPage();await rp.goto(url(e,'ops'));await opened(rp);assert.equal(await rp.locator('.px-j-curtain').evaluate(x=>getComputedStyle(x).display),'none');assert.equal(await rp.locator('.px-hl').first().evaluate(x=>getComputedStyle(x).animationName),'none');await rp.waitForTimeout(3800);assert.equal(await rp.locator('.px-hl-layer').count(),0);await rm.close();
 const fallback=await b.newContext(),fb=await fallback.newPage();await fb.route('**/portfolio-explore.css',async r=>{const res=await r.fetch();await r.fulfill({response:res,body:(await res.text())+'\n@view-transition{navigation:none}'});});await fb.goto(url(e,'ops'));await opened(fb);await fb.locator('.px-j-next').click();await opened(fb);assert.equal(new URL(fb.url()).searchParams.get('evidence'),E.routeFor('ops')[1].id);await stable(fb,'native transitions disabled');await fallback.close();
 const nj=await b.newContext({javaScriptEnabled:false}),np=await nj.newPage();for(const path of ['','apple-rtl/','centric-fiberops/','ci-fleet/','omni-pmo/']){await np.goto(base+path+'?focus=ops&evidence=invalid');assert.equal(await np.locator('html').evaluate(x=>x.classList.contains('px-arriving')),false);assert.ok(await np.locator('main').isVisible());}await nj.close();
 // Even a missing enhancement script cannot leave the inline head cover stuck.
 const fc=await b.newContext(),fp=await fc.newPage();await fp.route('**/portfolio-explore.js',r=>r.abort());await fp.goto(url(e,'ops'));await fp.waitForTimeout(2700);assert.equal(await fp.locator('body').evaluate(x=>getComputedStyle(x,'::after').visibility),'hidden');await fc.close();
 }finally{await b.close();}});
}
