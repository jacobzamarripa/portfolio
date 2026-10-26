(function(){
  'use strict';
  var E=window.PortfolioEvidence;if(!E)return;
  var currentScript=document.currentScript;
  var ROOT=new URL('../',currentScript.src);
  var params=new URLSearchParams(location.search),role=E.hasRole(params.get('focus'))?params.get('focus'):'';
  var reduced=matchMedia('(prefers-reduced-motion: reduce)');
  var names={apple:'Apple',nexus:'Nexus',fleet:'Fleet',omni:'OmniSight'};
  var CASES=['apple','nexus','fleet','omni'];
  function node(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
  function button(text,fn){var b=node('button','',text);b.type='button';b.addEventListener('click',fn);return b;}
  function href(entry,lens){var u=new URL(entry.path,ROOT);if(lens){u.searchParams.set('focus',lens);u.searchParams.set('evidence',entry.id);}return u.href;}
  function link(text,url,cls){var a=node('a',cls||'',text);a.href=url;return a;}
  function controls(label){var c=node('div','px-controls');c.setAttribute('role','group');c.setAttribute('aria-label',label);return c;}
  function scrollTo(el){if(el)el.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'center'});}
  function home(){
    var host=document.getElementById('explore'),tl=document.querySelector('.h-tl');if(!host||!tl)return;
    host.hidden=false;
    var lenses=node('div','px-lenses');lenses.setAttribute('role','group');lenses.setAttribute('aria-label','Show evidence for a role');
    var status=node('div','px-lens-status'),intro=node('p','px-lens-intro'),preview=node('p','px-lens-preview'),start=link('','#','px-lens-start');status.setAttribute('aria-live','polite');status.append(intro,preview,start);
    var buttons=[];
    function select(k){role=k;buttons.forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.role===k));});var u=new URL(location.href);if(k)u.searchParams.set('focus',k);else u.searchParams.delete('focus');history.replaceState(null,'',u);update();}
    [''].concat(Object.keys(E.roles)).forEach(function(k){var b=button('',function(){select(k);});if(k)b.append(node('span','px-full',E.roles[k].label),node('span','px-chip',E.roles[k].chip));else b.textContent='All work';b.dataset.role=k;b.setAttribute('aria-pressed',String(role===k));buttons.push(b);lenses.append(b);});
    host.append(node('p','px-lens-label','Evidence for a role'),lenses,status);
    var keys=['apple','nexus','fleet','omni'];
    function update(){
      var r=role?E.roles[role]:null,route=r?E.routeFor(role):[];
      tl.classList.toggle('px-lens-on',!!r);status.hidden=!r;
      if(r){intro.textContent=r.intro;preview.textContent=route.length+' stops, a few minutes. Starts with '+route[0].at+': '+route[0].title+'.';start.href=href(route[0],role);start.textContent='Start the '+r.short+' path';}
      var c=0;
      tl.querySelectorAll(':scope > .h-stop').forEach(function(stop){
        var old=stop.querySelector('.px-lens-hits');if(old)old.remove();
        if(!stop.classList.contains('h-stop--case')){stop.classList.toggle('px-lens-miss',!!r);return;}
        var key=keys[c++],hits=[];route.forEach(function(e,i){if(e.case===key)hits.push([i,e]);});
        stop.classList.toggle('px-lens-hit',hits.length>0);stop.classList.toggle('px-lens-miss',!!r&&!hits.length);
        if(!hits.length)return;
        var box=node('div','px px-lens-hits');box.append(node('p','px-kicker',r.label+' path'));var ol=node('ol');
        hits.forEach(function(h){var li=node('li');li.append(node('span','px-lens-num',(h[0]<9?'0':'')+(h[0]+1)),link(h[1].title,href(h[1],role)),node('small','',h[1].source));ol.append(li);});
        box.append(ol);var go=stop.querySelector('.h-go');if(go)go.before(box);
      });
    }
    update();if(location.hash==='#explore')requestAnimationFrame(function(){host.scrollIntoView({block:'start'});});
    var previewNotes={apple:'Measured comparisons across four periods',nexus:'One record, shared between devices',fleet:'A specification made visible',omni:'From a diagnostic to its next action'};
    keys.forEach(function(k){var e=document.querySelector('.pv-'+k);if(!e)return;e.classList.add('px-preview');var note=node('span','px-preview-note',previewNotes[k]);e.append(note);});
  }
  function improvePreviews(){
    var grid=document.querySelector('.pv-a-grid');if(grid){var labels=Array.from(grid.children).filter(function(e){return e.tagName==='SPAN'&&e.textContent.trim();});['Customer-facing time','Issue resolution','Satisfaction','Handle time'].forEach(function(t,i){if(labels[i])labels[i].textContent=t;});}
    var side=document.querySelector('.pv-n-side');if(side){side.replaceChildren(node('span','','Selected record'),node('b','','J-2291'),node('span','','Format checked · ready to encode'));side.style.justifyContent='start';}
    var ph=document.querySelector('.pv-n-pscreen');if(ph){var id=node('b','','J-2291');id.style.cssText='font:700 10px ui-monospace,monospace;color:#0f172a';ph.prepend(id);}
    var chart=document.querySelector('.pv-o-card');if(chart){var finding=node('p','px-preview-finding','FHV02-F10 · stale report · 58% production / 79% elapsed');chart.append(finding);}
  }
  function store(k,v){try{if(v===undefined)return JSON.parse(sessionStorage.getItem(k)||'null');sessionStorage.setItem(k,JSON.stringify(v));}catch(err){}return null;}
  function flash(t){
    if(!t)return;var h=/^H[1-6]$/.test(t.tagName)?t:t.querySelector('h1,h2,h3');if(!h||h.querySelector('.px-hl'))return;
    var span=document.createElement('span');span.className='px-hl';while(h.firstChild)span.append(h.firstChild);h.append(span);
    setTimeout(function(){if(!span.isConnected)return;while(span.firstChild)h.insertBefore(span.firstChild,span);span.remove();},reduced.matches?2200:3600);
  }
  function roleRoute(){
    if(!role||document.getElementById('explore'))return;
    var r=E.roles[role],route=E.routeFor(role),id=params.get('evidence'),i=route.findIndex(function(e){return e.id===id;});if(i<0)return;
    var e=route[i],actual=new URL(e.path,ROOT);if(actual.pathname!==location.pathname)return;
    var homeUrl=new URL('?focus='+role+'#explore',ROOT).href,motion=!reduced.matches;
    if(!document.querySelector('link[href*="family=Archivo"]')){var f=document.createElement('link');f.rel='stylesheet';f.href='https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&display=swap';document.head.append(f);}
    var seen=store('px-seen-'+role)||[];if(seen.indexOf(e.id)<0)seen.push(e.id);store('px-seen-'+role,seen);
    function state(k){return k===i?'here':seen.indexOf(route[k].id)>=0?'seen':'ahead';}
    var target=document.getElementById(actual.hash.slice(1));if(target){target.classList.add('px-evidence-target');target.setAttribute('tabindex','-1');}
    var live=store('px-dock-live'),fromPath=!!live&&Date.now()-live<20000;store('px-dock-live',null);
    var bar=node('nav','px-journey'+(motion&&!fromPath?' px-enter':''));bar.setAttribute('aria-label',r.label+' path, stop '+(i+1)+' of '+route.length);
    /* map */
    var map=node('div','px-j-map');map.id='px-journey-map';map.hidden=true;
    var list=node('ol','px-j-list');
    route.forEach(function(stop,k){var li=node('li','px-j-'+state(k)),body=node('div'),a=link(stop.title,href(stop,role));if(k===i)a.setAttribute('aria-current','step');body.append(a,node('small','',stop.at+(k===i?' · You are here':state(k)==='seen'?' · Viewed':'')));li.append(node('span','px-j-num',String(k+1)),body);list.append(li);});
    var foot=node('div','px-j-mapfoot'),free=button('Close the path and explore freely',function(){leave();});free.className='px-j-btn';foot.append(free,link('Choose another role',homeUrl));
    map.append(node('p','px-j-kicker','The '+r.label.toLowerCase()+' path · strongest evidence first'),list,foot);
    /* head */
    var head=node('div','px-j-head'),info=node('div','px-j-info');
    var title=button('',function(){setCompact(!bar.classList.contains('px-j-compact'));});title.className='px-j-title';title.append(node('span','',e.title),node('span','px-j-caret'));
    var look=node('p','px-j-look');look.id='px-j-look';look.append(node('b','','Look for '),document.createTextNode(e.text));title.setAttribute('aria-controls',look.id);
    info.append(node('p','px-j-kicker',r.label+' path · Stop '+(i+1)+' of '+route.length+' · '+e.at),title,look);
    var strip=node('ol','px-j-tl');strip.setAttribute('aria-label','Stops placed on the career timeline');
    CASES.forEach(function(c){var col=node('li','px-j-case'+(c===e.case?' px-j-case-here':'')),stops=node('span','px-j-case-stops');
      route.forEach(function(stop,k){if(stop.case!==c)return;var a=link(String(k+1),href(stop,role),'px-j-dot px-j-'+state(k));a.title=stop.title;a.setAttribute('aria-label','Stop '+(k+1)+': '+stop.title+(k===i?' (current)':''));if(k===i)a.setAttribute('aria-current','step');stops.append(a);});
      col.append(stops,node('span','px-j-case-name',names[c]));strip.append(col);});
    var acts=node('div','px-j-actions'),tools=node('div','px-j-tools'),nxt=route[i+1];
    var next=nxt?link((nxt.case===e.case?'Next section':'Next: '+names[nxt.case])+' →',href(nxt,role),'px-j-next'):link('Finish path',homeUrl,'px-j-next');if(nxt)next.title=nxt.title;
    var toggle=button('Map',function(){openMap(map.hidden);});toggle.className='px-j-btn';toggle.setAttribute('aria-controls',map.id);toggle.setAttribute('aria-expanded','false');
    var close=button('×',function(){leave();});close.className='px-j-btn px-j-close';close.setAttribute('aria-label','Close the path and explore freely');
    acts.append(next);tools.append(toggle,close);head.append(info,strip,acts,tools);bar.append(map,head);document.body.append(bar);document.body.classList.add('px-path-active');
    function pad(){document.body.style.setProperty('--px-journey-h',bar.querySelector('.px-j-head').offsetHeight+'px');}
    function setCompact(on){bar.classList.toggle('px-j-compact',on);title.setAttribute('aria-expanded',String(!on));pad();}
    function openMap(on){map.hidden=!on;toggle.setAttribute('aria-expanded',String(on));toggle.textContent=on?'Hide map':'Map';}
    setCompact(false);
    bar.addEventListener('keydown',function(ev){if(ev.key==='Escape'&&!map.hidden){openMap(false);toggle.focus();}});
    window.addEventListener('resize',pad);
    /* arrival: land on the section, then let the guide settle out of the way once reading starts */
    var userMoved=false,landed=null;['wheel','touchstart','keydown'].forEach(function(t){window.addEventListener(t,function(){userMoved=true;},{once:true,passive:true});});
    function land(behavior){if(!target)return;target.style.scrollMarginTop='28px';target.scrollIntoView({block:'start',behavior:behavior});}
    function settle(){if(userMoved||!target)return;var top=target.getBoundingClientRect().top;if(top<0||top>80)land('instant');landed=window.scrollY;}
    requestAnimationFrame(function(){land('instant');requestAnimationFrame(function(){bar.classList.remove('px-enter');});
      setTimeout(settle,600);if(document.readyState!=='complete')window.addEventListener('load',function(){setTimeout(settle,50);},{once:true});
      setTimeout(function(){flash(target);},fromPath?320:520);});
    window.addEventListener('pagehide',function(){if(bar.isConnected)store('px-dock-live',Date.now());});
    window.addEventListener('scroll',function(){if(landed!==null&&Math.abs(window.scrollY-landed)>220&&!bar.classList.contains('px-j-compact')&&map.hidden)setCompact(true);},{passive:true});
    function leave(){store('px-dock-live',null);var u=new URL(location.href);u.searchParams.delete('focus');u.searchParams.delete('evidence');history.replaceState(null,'',u);bar.remove();document.body.classList.remove('px-path-active');document.body.style.removeProperty('--px-journey-h');if(target){target.classList.remove('px-evidence-target');target.removeAttribute('tabindex');}
      var t=node('div','px-j-toast');t.setAttribute('role','status');t.append(node('span','','Path closed. You are exploring freely.'),link('Resume the path',href(e,role)));document.body.append(t);setTimeout(function(){t.classList.add('px-j-toast-out');setTimeout(function(){t.remove();},400);},7000);}
  }
  function cloneSVG(svg,prefix){var copy=svg.cloneNode(true),map={};copy.querySelectorAll('[id]').forEach(function(e){map[e.id]=prefix+e.id;e.id=prefix+e.id;});copy.querySelectorAll('*').forEach(function(e){Array.from(e.attributes).forEach(function(a){var value=a.value;Object.keys(map).forEach(function(id){value=value.split('url(#'+id+')').join('url(#'+map[id]+')');if(value==='#'+id)value='#'+map[id];});if(value!==a.value)e.setAttribute(a.name,value);});});copy.querySelectorAll('.wipe').forEach(function(e){e.setAttribute('width',e.dataset.w);});return copy;}
  function fleet(){
    var fig=document.querySelector('figure.zones');if(!fig)return;var top=fig.querySelector('svg'),ext=document.querySelector('figure.render svg');if(!top||!ext)return;
    var inspector=node('div','px px-compare');inspector.id='fleet-inspector';inspector.append(node('p','px-kicker','Storage study · illustrative'));
    var stage=node('div','px-compare-stage'),base=cloneSVG(ext,'inspect-'),upper=node('div','px-compare-top');base.setAttribute('viewBox',top.getAttribute('viewBox'));base.setAttribute('aria-label','Exterior of the proposed compact pickup');top.querySelectorAll('.wipe').forEach(function(e){e.setAttribute('width',e.dataset.w);});upper.append(top);stage.append(base,upper,node('span','px-compare-line'));inspector.append(stage);
    var label=node('label','px-range-label','Exterior / storage comparison'),range=node('input');range.type='range';range.min='0';range.max='100';range.value='65';range.id='fleet-reveal';range.setAttribute('aria-label','Reveal storage cutaway');range.setAttribute('aria-valuetext','65 percent storage cutaway');label.htmlFor=range.id;label.append(range);inspector.append(label);
    function reveal(v){stage.style.setProperty('--reveal',v+'%');stage.classList.toggle('px-compare-edge',Number(v)===0||Number(v)===100);range.value=v;range.setAttribute('aria-valuetext',v+' percent storage cutaway');}
    range.addEventListener('input',function(){reveal(range.value);});var modes=controls('Comparison view');modes.append(button('Exterior',function(){reveal(0);}),button('Compare',function(){reveal(50);}),button('Storage',function(){reveal(100);}));inspector.append(modes);
    var zones=controls('Explore storage zones'),panel=node('div','px-zone-panel'),heading=node('h3'),body=node('div'),desc=node('p');panel.id='fleet-zone-explanation';panel.setAttribute('aria-live','polite');body.append(desc);panel.append(heading,body);
    var sketch=node('div');sketch.hidden=true;sketch.innerHTML='<svg class="px-drawer-sketch" viewBox="0 0 540 130" role="img" aria-label="Conceptual tailgate access: a lower drawer extends toward the technician. Travel and clearances are not specified."><rect x="128" y="20" width="350" height="65" rx="3"/><path d="M128 63H478M138 85V101M468 85V101"/><g class="px-access-drawer"><rect x="128" y="65" width="195" height="22" rx="2"/><path d="M136 72V80"/></g><path d="M110 110H59M59 110L68 104M59 110L68 116"/><text x="145" y="118">Conceptual access · no dimensions or travel specified</text></svg>';body.append(sketch);var access=button('Illustrate tailgate access',function(){var g=sketch.querySelector('.px-access-drawer'),on=g.classList.toggle('drawer-open');access.setAttribute('aria-pressed',String(on));access.textContent=on?'Close access sketch':'Illustrate tailgate access';});access.hidden=true;access.setAttribute('aria-pressed','false');access.className='px-access-toggle';body.append(access);
    var zoneButtons=[];['A','B','C','D'].forEach(function(letter){var source=document.querySelector('.zlegend .zk-'+letter.toLowerCase()),title=source.querySelector('dt').textContent.trim().replace(/^'+letter+'/,'');var b=button(letter+' · '+source.querySelector('dt').textContent.replace(/^\s*[ABCD]\s*/,''),function(){zoneButtons.forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});heading.textContent=source.querySelector('dt').textContent;desc.textContent=source.querySelector('dd').textContent;sketch.hidden=access.hidden=letter!=='C';reveal(100);var positions={A:[411,119,92,44],B:[118,84,246,96],C:[118,180,246,48],D:[112,37,240,24]},pos=positions[letter];var roi=top.querySelector('.px-zone-region');if(!roi){roi=document.createElementNS('http://www.w3.org/2000/svg','rect');roi.setAttribute('class','px-zone-region');roi.setAttribute('aria-hidden','true');top.append(roi);}['x','y','width','height'].forEach(function(k,i){roi.setAttribute(k,pos[i]);});top.querySelectorAll('.cut-label').forEach(function(g){g.classList.toggle('px-zone-muted',g.querySelector('text').textContent!==letter);});});b.setAttribute('aria-pressed','false');b.setAttribute('aria-controls',panel.id);zoneButtons.push(b);zones.append(b);});
    heading.textContent='Four zones, one loadout';desc.textContent='The comparison explains where the proposed storage belongs. Equipment positions, clearances and mechanical operation remain illustrative.';
    inspector.append(zones,panel,node('p','px-boundary','Illustrative reconstruction. The approved loadout is preserved; this view does not establish scale accuracy, payload approval, clearances or verified fitment.'));
    fig.prepend(inspector);reveal(65);
  }
  function apple(){
    var bench=document.querySelector('.rv-bench');if(!bench||!window.ReviewFigures)return;
    var wrap=node('div','px'),c=controls('Compare the same fiscal period across all four measures'),values=node('div','px-period-values');values.setAttribute('aria-live','polite');var selected=-1,buttons=[];
    function apply(){var pairs=bench.querySelectorAll('.rv-panel');pairs.forEach(function(panel){panel.querySelectorAll('.rv-pair').forEach(function(p,i){p.classList.toggle('px-period-on',i===selected);});});}
    function set(i){selected=i;buttons.forEach(function(b,k){b.setAttribute('aria-pressed',String(k-1===i));});if(i<0)bench.removeAttribute('data-period');else bench.dataset.period=i;values.replaceChildren();if(i>=0)['cft','ir','csat','aht'].map(function(id){return window.ReviewFigures.BENCH.find(function(s){return s.id===id;});}).forEach(function(s){var d=node('div');d.append(node('b','',s.name),node('span','','Team '+s.team[i].toFixed(2)+s.unit),node('span','','Site '+s.site[i].toFixed(2)+s.unit));values.append(d);});apply();}
    ['All periods','Nov 2020','Dec 2020','Jan 2021','Feb 2021'].forEach(function(t,k){var b=button(t,function(){set(k-1);});buttons.push(b);c.append(b);});wrap.append(node('p','px-kicker','One period across all four measures'),c,values);bench.querySelector('.rv-fig-head').after(wrap);set(-1);
    new MutationObserver(apply).observe(bench,{childList:true,subtree:true});
  }
  function tourPanel(host,title,steps){
    var box=node('div','px px-tour'),kicker=node('div','px-step'),h=node('h3','',title),p=node('p','',steps[0].intro),c=controls(title),active=false,index=0,target=null;
    p.setAttribute('role','status');
    var prev=button('Back',function(){run(index-1);}),next=button('Next',function(){run(index+1);}),exit=button('Exit tour',function(){stop();}),start=button('Start guided tour',function(){active=true;box.classList.add('px-tour-active');run(0);});
    function untarget(){if(target){target.classList.remove('px-tour-target');target=null;}}
    function run(i){untarget();if(i>=steps.length){stop(true);return;}index=Math.max(0,i);var s=steps[index];s.act();kicker.textContent='Guided tour · '+(index+1)+' of '+steps.length;h.textContent=s.title;p.textContent=s.text;start.hidden=true;prev.hidden=next.hidden=exit.hidden=false;prev.disabled=index===0;next.textContent=index===steps.length-1?'Finish tour':'Next';target=document.querySelector(s.target);if(target){target.classList.add('px-tour-target');requestAnimationFrame(function(){scrollTo(target);});}}
    function stop(finished){untarget();active=false;box.classList.remove('px-tour-active');kicker.textContent=finished?'Tour complete':'Guided walkthrough';h.textContent=title;p.textContent=steps[0].intro;start.textContent=finished?'Replay guided tour':'Start guided tour';start.hidden=false;prev.hidden=next.hidden=exit.hidden=true;start.focus({preventScroll:true});}
    c.append(start,prev,next,exit);box.append(kicker,h,p,c);host.append(box);prev.hidden=next.hidden=exit.hidden=true;kicker.textContent='Guided walkthrough';box.addEventListener('keydown',function(e){if(e.key==='Escape'&&active)stop();});
    return box;
  }
  function click(sel){var e=document.querySelector(sel);if(e)e.click();}
  function omni(){
    var section=document.getElementById('walkthrough');if(!section)return;var app=section.querySelector('.app'),host=node('div');host.style.display='contents';app.before(host);function selectDemo(scope){click('[data-view="portfolio"]');click('.email-card[data-project="FHV02-F10"]');click('[data-scope="'+scope+'"]');}
    tourPanel(host,'Follow a flagged build',[
      {title:'1. Find the disagreement',intro:'One invented project, from the dashboard finding to the schedule, ownership boundary and next action. The full walkthrough remains available.',text:'FHV02-F10 appears in the diagnostic breakdown. The finding is the starting point for checking the build, rather than accepting a status field on its own.',target:'[data-goto="FHV02-F10"]',act:function(){click('[data-view="dashboard"]');click('button[data-sev="all"]');}},
      {title:'2. Keep the identity across screens',text:'The same project opens in Active Portfolio. Its dates, owner, production and notes belong to this selected record.',target:'#portfolio .detail-id',act:function(){click('[data-view="portfolio"]');click('.email-card[data-project="FHV02-F10"]');}},
      {title:'3. Read the boundary of the work',text:'On the civil card, the fill stops at fiber placement. The remaining span belongs to the splicing vendor; assigning the whole bar to civil would overstate its standing.',target:'.detail-schedule-bar',act:function(){selectDemo('civil');}},
      {title:'4. Change the owner, change the reading',text:'On the splicing card the handoff becomes the start gate. The visual boundary follows responsibility for the work.',target:'.detail-schedule-bar',act:function(){selectDemo('splicing');}},
      {title:'5. Turn the finding into an action',text:'The existing demo calls for a written commitment on a splicing crew date. This illustrates a management decision; the project and its outcome here are invented.',target:'#portfolio .risk-advice-list',act:function(){selectDemo('civil');}}
    ]);
  }
  function nexus(){
    var section=document.getElementById('nexus');if(!section)return;var rig=section.querySelector('.rig'),host=node('div');host.style.display='contents';rig.before(host);
    function prepare(id,count){click('[data-view="jobs"]');click('[data-job="'+id+'"]');click('[data-view="qr"]');click('#btnReset');for(var i=0;i<count;i++)click('#btnStep');}
    tourPanel(host,'One record, on both devices',[
      {title:'1. Start with the source record',intro:'Follow a clean record through closeout, then see a malformed source stop before a QR code exists. Both devices use the same state. Starting a tour step resets the demo.',text:'J-2291 is selected on the tablet and phone. The workflow starts with the technician pasting the assignment into the sheet.',target:'#recList .led-row',act:function(){prepare('J-2291',1);}},
      {title:'2. Normalize and validate',text:'The received values stay beside the normalized fields. Casing and spacing change visibly; validation is a separate check.',target:'#recList .led-row.is-norm',act:function(){prepare('J-2291',2);}},
      {title:'3. Encode the checked record',text:'The QR code contains only the displayed invented values. The phone and tablet present the same selected record.',target:'#qrCanvasWrap',act:function(){prepare('J-2291',3);}},
      {title:'4. Scan, then distribute',text:'The prototype simulates the scan and matching code distribution. The original deployed workflow used spreadsheet formulas and manual movement between systems.',target:'.pipe-detail',act:function(){prepare('J-2291',5);}},
      {title:'5. Stop a bad record at the source',text:'J-2286 has a truncated serial. Validation rejects it before encoding. No QR code is issued for the rejected record.',target:'#recList .led-row.is-bad',act:function(){prepare('J-2286',2);}},
      {title:'6. Correct the source, then retry',text:'The source correction is explicit. The workflow can continue only after the record passes its format check.',target:'#recList .led-row:last-child',act:function(){prepare('J-2286',3);}}
    ]);
    var flow=node('div','px px-record-flow');['Paste','Normalize','Encode','Scan','Distribute'].forEach(function(s){flow.append(node('span','',s));});var record=node('div','px px-record-id');record.append(node('span','','Shared record'),node('b','','J-2291'));host.append(record,flow);
    var last='';function update(){var source=document.getElementById('qrJobTag'),title=document.getElementById('pipeTitle');if(!source||!title)return;var sig=source.textContent+title.textContent;if(sig===last)return;last=sig;record.querySelector('b').textContent=source.textContent;var steps=document.querySelectorAll('.pipe-step');Array.from(flow.children).forEach(function(e,i){e.classList.toggle('px-done',steps[i].classList.contains('is-done'));e.classList.toggle('px-now',steps[i].classList.contains('is-active'));});flow.classList.toggle('px-blocked',title.textContent.indexOf('Rejected')>=0);record.classList.remove('px-record-flash');void record.offsetWidth;record.classList.add('px-record-flash');}
    new MutationObserver(update).observe(document.getElementById('pipeTitle'),{childList:true,subtree:true});new MutationObserver(update).observe(document.getElementById('qrJobTag'),{childList:true});update();
  }
  function init(){home();improvePreviews();roleRoute();fleet();apple();omni();nexus();}
  if(document.readyState!=='complete')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
