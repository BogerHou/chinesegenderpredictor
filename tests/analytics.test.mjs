import test from 'node:test';
import assert from 'node:assert/strict';
import {ANALYTICS_CHOICE_KEY,analyticsPageLocation,analyticsReferrer,parseAnalyticsChoice,initAnalytics} from '../src/analytics.mjs';
import {routes} from '../src/templates.mjs';

class Element extends EventTarget{
  hidden=true;dataset={};textContent='';focusCount=0;removed=false;
  focus(){this.focusCount++;}
  remove(){this.removed=true;}
  click(){this.dispatchEvent(new Event('click'));}
}
function environment({url='https://chinesegenderpredictor.net/',id='G-TEST123',choice=null,referrer=''}={}){
  const elements=new Map(['#analytics-preferences','#analytics-status','[data-analytics-accept]','[data-analytics-decline]','[data-analytics-settings]'].map(key=>[key,new Element()]));
  const scripts=[];const cookieWrites=[];let cookies='';const saved=new Map();const sessionSaved=new Map();
  if(choice!==null)saved.set(ANALYTICS_CHOICE_KEY,JSON.stringify({version:1,choice}));
  const storage=values=>({getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)});
  const window=new EventTarget();
  window.location={href:url,reloads:0,reload(){this.reloads++;}};
  window.localStorage=storage(saved);window.sessionStorage=storage(sessionSaved);
  const document={body:{dataset:{gaMeasurementId:id}},title:'Chinese Gender Predictor',referrer,head:{append:script=>scripts.push(script)},querySelector:key=>elements.get(key)||null,createElement:()=>new Element()};
  Object.defineProperty(document,'cookie',{get:()=>cookies,set:value=>cookieWrites.push(value)});
  return {window,document,elements,scripts,cookieWrites,saved,sessionSaved,setCookies:value=>{cookies=value;},click:key=>elements.get(key).click(),commands:()=>window.dataLayer?.map(args=>[...args])||[]};
}
function storageEvent(value){const event=new Event('storage');Object.assign(event,{key:ANALYTICS_CHOICE_KEY,newValue:value});return event;}

test('analytics locations allow only canonical public pages and remove query strings and fragments',()=>{
  assert.equal(analyticsPageLocation('https://chinesegenderpredictor.net/accuracy/?birth=1995-06-15#girl'),'https://chinesegenderpredictor.net/accuracy/');
  for(const [route] of routes)assert.equal(analyticsPageLocation('https://chinesegenderpredictor.net'+route),'https://chinesegenderpredictor.net'+route);
  for(const url of ['http://chinesegenderpredictor.net/','https://www.chinesegenderpredictor.net/','https://chinesegenderpredictor.vercel.app/','http://localhost:3000/','https://chinesegenderpredictor.net/private/1995-06-15/','invalid'])assert.equal(analyticsPageLocation(url),'');
});
test('referrers keep only known internal paths or an external origin',()=>{
  assert.equal(analyticsReferrer('https://chinesegenderpredictor.net/how-it-works/?due=2027-01-22#girl'),'https://chinesegenderpredictor.net/how-it-works/');
  assert.equal(analyticsReferrer('https://chinesegenderpredictor.net/private/1995-06-15/?x=1'),'https://chinesegenderpredictor.net/');
  assert.equal(analyticsReferrer('https://user:pass@example.com/pregnancy/1995-06-15/?secret=1#girl'),'https://example.com');
  for(const value of ['', 'javascript:alert(1)','file:///private/test','invalid'])assert.equal(analyticsReferrer(value),'');
});
test('invalid, old or unversioned consent is never treated as permission',()=>{
  for(const value of [null,'accepted','{}','{"choice":"accepted"}','{"version":2,"choice":"accepted"}','{"version":1,"choice":"yes"}'])assert.equal(parseAnalyticsChoice(value),null);
  assert.equal(parseAnalyticsChoice('{"version":1,"choice":"accepted"}'),'accepted');
});
test('no Google tag, data layer or GA cookie write occurs before consent or after decline',()=>{
  const env=environment();initAnalytics(env);
  assert.equal(env.elements.get('#analytics-preferences').hidden,false);
  assert.equal(env.elements.get('#analytics-status').textContent,'');
  assert.equal(env.elements.get('[data-analytics-accept]').textContent,'Accept analytics');
  assert.equal(env.elements.get('[data-analytics-decline]').textContent,'Decline analytics');
  assert.equal(env.scripts.length,0);assert.equal(env.window.dataLayer,undefined);assert.deepEqual(env.cookieWrites,[]);
  env.click('[data-analytics-decline]');
  assert.equal(env.scripts.length,0);assert.equal(env.window.dataLayer,undefined);
  assert.equal(parseAnalyticsChoice(env.saved.get(ANALYTICS_CHOICE_KEY)),'declined');
  assert.equal(env.window.location.reloads,0);
});
test('preview hosts, unknown routes and invalid IDs expose no analytics controls or tag',()=>{
  for(const options of [{url:'http://localhost:3000/'},{url:'https://test.vercel.app/'},{url:'https://chinesegenderpredictor.net/404/'},{id:'UA-123-1'},{id:'G-TEST\"<script>'},{id:''}]){
    const env=environment({...options,choice:'accepted'});assert.equal(initAnalytics(env),null);
    assert.equal(env.scripts.length,0);assert.equal(env.elements.get('[data-analytics-settings]').hidden,true);
  }
});
test('acceptance queues one sanitized page view and refuses advertising permissions',()=>{
  const env=environment({url:'https://chinesegenderpredictor.net/?birth=1995-06-15&utm_content=test-private-marker#girl',referrer:'https://example.com/private?due=2027-01-22'});initAnalytics(env);env.click('[data-analytics-accept]');
  env.click('[data-analytics-settings]');env.click('[data-analytics-accept]');initAnalytics(env);
  assert.equal(env.scripts.length,1);assert.equal(env.scripts[0].referrerPolicy,'origin');
  const commands=env.commands();const events=commands.filter(([command])=>command==='event');
  assert.equal(events.length,1);assert.equal(events[0][1],'page_view');
  assert.equal(events[0][2].page_location,'https://chinesegenderpredictor.net/');assert.equal(events[0][2].page_referrer,'https://example.com');
  const config=commands.find(([command])=>command==='config')[2];
  assert.equal(config.send_page_view,false);assert.equal(config.allow_google_signals,false);assert.equal(config.allow_ad_personalization_signals,false);
  const globals=commands.find(([command,fields])=>command==='set'&&typeof fields==='object')[1];assert.equal(globals.page_location,config.page_location);assert.equal(globals.page_referrer,config.page_referrer);
  for(const parameter of ['campaign_id','campaign_name','campaign_source','campaign_medium','campaign_content','campaign_term']){
    assert.equal(globals[parameter],'');assert.equal(config[parameter],'');assert.equal(events[0][2][parameter],'');
  }
  for(const [,command,permissions] of commands.filter(([command])=>command==='consent')){
    assert.equal(permissions.ad_storage,'denied');assert.equal(permissions.ad_user_data,'denied');assert.equal(permissions.ad_personalization,'denied');
    if(command==='default')assert.equal(permissions.analytics_storage,'denied');
  }
  const payload=JSON.stringify(commands);assert(!payload.includes('1995-06-15'));assert(!payload.includes('2027-01-22'));assert(!payload.includes('#girl'));assert(!payload.includes('test-private-marker'));
});
test('revocation disables the tag immediately, saves decline and removes only GA cookies before reload',()=>{
  const env=environment({choice:'accepted'});env.setCookies('_ga=one; _ga_TEST123=two; security=keep; cgp_analytics_choice=keep');initAnalytics(env);
  env.click('[data-analytics-settings]');env.click('[data-analytics-decline]');
  assert.equal(env.window['ga-disable-G-TEST123'],true);assert.equal(env.scripts[0].removed,true);
  assert.equal(parseAnalyticsChoice(env.saved.get(ANALYTICS_CHOICE_KEY)),'declined');assert.equal(env.window.location.reloads,1);
  assert.equal(env.cookieWrites.length,6);assert(env.cookieWrites.every(value=>/^_ga(?:_TEST123)?=; Max-Age=0; Path=\//.test(value)));
});
test('withdrawal in another tab disables a previously accepted tag',()=>{
  const env=environment({choice:'accepted'});initAnalytics(env);
  env.window.dispatchEvent(storageEvent('{"version":1,"choice":"declined"}'));
  assert.equal(env.window['ga-disable-G-TEST123'],true);assert.equal(env.window.location.reloads,1);
});
test('Escape never accepts an undecided banner and closes saved preferences with focus restored',()=>{
  const env=environment();const controller=initAnalytics(env);const banner=env.elements.get('#analytics-preferences');
  const escape=()=>{const event=new Event('keydown',{cancelable:true});Object.assign(event,{key:'Escape'});banner.dispatchEvent(event);};
  escape();assert.equal(controller.getChoice(),null);assert.equal(banner.hidden,false);assert.equal(env.scripts.length,0);
  env.click('[data-analytics-decline]');env.click('[data-analytics-settings]');escape();
  assert.equal(banner.hidden,true);assert(env.elements.get('[data-analytics-settings]').focusCount>0);assert.equal(env.scripts.length,0);
});
test('blocked browser storage cannot crash the site or reload a withdrawn choice into an old grant',()=>{
  const env=environment({choice:'accepted'});initAnalytics(env);
  env.window.localStorage.setItem=()=>{throw Error('blocked');};env.window.sessionStorage.setItem=()=>{throw Error('blocked');};
  assert.doesNotThrow(()=>env.click('[data-analytics-decline]'));assert.equal(env.window['ga-disable-G-TEST123'],true);assert.equal(env.window.location.reloads,0);
  assert.match(env.elements.get('#analytics-status').textContent,/could not save/);
  assert.equal(env.elements.get('#analytics-preferences').hidden,false);assert(env.elements.get('#analytics-preferences').focusCount>0);assert.equal(env.scripts.length,1);
  const first=environment();Object.defineProperty(first.window,'localStorage',{get(){throw Error('blocked');}});Object.defineProperty(first.window,'sessionStorage',{get(){throw Error('blocked');}});
  assert.doesNotThrow(()=>initAnalytics(first));assert.equal(first.scripts.length,0);assert.doesNotThrow(()=>first.click('[data-analytics-accept]'));assert.equal(first.scripts.length,1);
});
test('failed storage leaves a declined choice and its readable explanation visible without network or reload',()=>{
  const env=environment();env.window.localStorage.setItem=()=>{throw Error('blocked');};env.window.sessionStorage.setItem=()=>{throw Error('blocked');};
  const controller=initAnalytics(env);env.click('[data-analytics-decline]');env.click('[data-analytics-decline]');
  const banner=env.elements.get('#analytics-preferences');
  assert.equal(controller.getChoice(),'declined');assert.equal(banner.hidden,false);assert(banner.focusCount>0);
  assert.match(env.elements.get('#analytics-status').textContent,/analytics are off/i);assert.match(env.elements.get('#analytics-status').textContent,/could not save this choice/);
  assert.equal(env.scripts.length,0);assert.equal(env.window.dataLayer,undefined);assert.equal(env.window.location.reloads,0);assert.deepEqual(env.cookieWrites,[]);
});
test('unsaved reaccept after an unsaved withdrawal truthfully keeps analytics off',()=>{
  const env=environment({choice:'accepted'});const controller=initAnalytics(env);
  env.window.localStorage.setItem=()=>{throw Error('blocked');};env.window.sessionStorage.setItem=()=>{throw Error('blocked');};
  env.click('[data-analytics-decline]');
  const commandCount=env.commands().length;env.click('[data-analytics-accept]');
  assert.equal(controller.getChoice(),'declined');assert.equal(env.window['ga-disable-G-TEST123'],true);
  assert.equal(env.elements.get('#analytics-preferences').hidden,false);assert.match(env.elements.get('#analytics-status').textContent,/analytics are off/i);
  assert.match(env.elements.get('#analytics-status').textContent,/could not save this choice/);
  assert.equal(env.scripts.length,1);assert.equal(env.scripts[0].removed,true);assert.equal(env.window.location.reloads,0);
  assert.equal(env.commands().length,commandCount);assert.equal(env.commands().filter(([command,event])=>command==='event'&&event==='page_view').length,1);
});
test('a saved session withdrawal takes precedence over an older persistent grant',()=>{
  const env=environment({choice:'accepted'});env.sessionSaved.set(ANALYTICS_CHOICE_KEY,'{"version":1,"choice":"declined"}');initAnalytics(env);
  assert.equal(env.scripts.length,0);assert.equal(env.window['ga-disable-G-TEST123'],true);
});
test('persistent storage failure uses session storage to keep a withdrawal effective after reload',()=>{
  const env=environment({choice:'accepted'});initAnalytics(env);
  env.window.localStorage.setItem=()=>{throw Error('blocked');};env.click('[data-analytics-decline]');
  assert.equal(env.window.location.reloads,1);assert.equal(parseAnalyticsChoice(env.sessionSaved.get(ANALYTICS_CHOICE_KEY)),'declined');
  const next=environment({choice:'accepted'});next.sessionSaved.set(ANALYTICS_CHOICE_KEY,env.sessionSaved.get(ANALYTICS_CHOICE_KEY));initAnalytics(next);assert.equal(next.scripts.length,0);
});
