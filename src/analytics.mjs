export const ANALYTICS_ORIGIN='https://chinesegenderpredictor.net';
export const ANALYTICS_CHOICE_KEY='cgp_analytics_choice';
const routes=new Set([
  '/', '/lunar-age-calculator/', '/chinese-gender-calendar-2026/',
  '/chinese-gender-calendar-2027/', '/chinese-gender-calendar-2028/',
  '/gender-reveal-games/', '/old-wives-tales-gender-prediction/',
  '/how-it-works/', '/accuracy/', '/about/', '/privacy/', '/terms/'
]);
const controllers=new WeakMap();
const denied={analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
// Explicit campaign fields override URL-based UTM attribution; arbitrary query values stay private.
const campaign={campaign_id:'',campaign_name:'',campaign_source:'',campaign_medium:'',campaign_content:'',campaign_term:''};

export function analyticsPageLocation(value){
  try{
    const url=new URL(value);
    return url.origin===ANALYTICS_ORIGIN&&routes.has(url.pathname)?ANALYTICS_ORIGIN+url.pathname:'';
  }catch{return '';}
}
export function analyticsReferrer(value){
  try{
    const url=new URL(value);
    if(!['http:','https:'].includes(url.protocol))return '';
    return url.origin===ANALYTICS_ORIGIN?ANALYTICS_ORIGIN+(routes.has(url.pathname)?url.pathname:'/'):url.origin;
  }catch{return '';}
}
export function parseAnalyticsChoice(value){
  try{
    const saved=JSON.parse(value);
    return saved?.version===1&&['accepted','declined'].includes(saved.choice)?saved.choice:null;
  }catch{return null;}
}
function storedChoice(window){
  // A session fallback keeps a withdrawal effective if persistent storage is blocked.
  try{if(parseAnalyticsChoice(window.sessionStorage.getItem(ANALYTICS_CHOICE_KEY))==='declined')return 'declined';}catch{}
  try{return parseAnalyticsChoice(window.localStorage.getItem(ANALYTICS_CHOICE_KEY));}catch{return null;}
}
function saveChoice(window,choice){
  const value=JSON.stringify({version:1,choice});
  try{
    window.localStorage.setItem(ANALYTICS_CHOICE_KEY,value);
    try{window.sessionStorage.removeItem(ANALYTICS_CHOICE_KEY);}catch{}
    return true;
  }catch{
    if(choice==='declined'){
      try{window.sessionStorage.setItem(ANALYTICS_CHOICE_KEY,value);return true;}catch{}
    }
    return false;
  }
}
function clearAnalyticsCookies(document){
  let names=[];
  try{names=document.cookie.split(';').map(cookie=>cookie.trim().split('=')[0]).filter(name=>/^_ga(?:_[A-Za-z0-9]+)?$/.test(name));}catch{return;}
  for(const name of names){
    for(const domain of ['', '; Domain=chinesegenderpredictor.net', '; Domain=.chinesegenderpredictor.net']){
      try{document.cookie=`${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax; Secure`;}catch{}
    }
  }
}

// The optional environment argument is used by unit tests, never to bypass the production gate.
export function initAnalytics({window=globalThis.window,document=globalThis.document}={}){
  if(!window||!document)return null;
  if(controllers.has(window))return controllers.get(window);
  const measurementId=document.body?.dataset.gaMeasurementId||'';
  const pageLocation=analyticsPageLocation(window.location.href);
  if(!/^G-[A-Z0-9]+$/.test(measurementId)||!pageLocation)return null;
  const preferences=document.querySelector('#analytics-preferences');
  const status=document.querySelector('#analytics-status');
  const accept=document.querySelector('[data-analytics-accept]');
  const decline=document.querySelector('[data-analytics-decline]');
  const settings=document.querySelector('[data-analytics-settings]');
  if(!preferences||!status||!accept||!decline||!settings)return null;
  let choice=storedChoice(window);
  let started=false;
  let script;
  let persisted=true;
  const disableKey=`ga-disable-${measurementId}`;
  window[disableKey]=true;
  function render(){
    settings.hidden=false;
    accept.textContent=choice==='accepted'?'Keep analytics on':'Accept analytics';
    decline.textContent=choice==='accepted'?'Turn off analytics':'Decline analytics';
    status.textContent=choice==='accepted'?'Optional analytics are on. Your dates and results stay private.':choice==='declined'?'Optional analytics are off. Your dates and results stay private.':'';
    if(!persisted)status.textContent+=' Your browser could not save this choice; it applies to this page.';
  }
  function start(){
    if(choice!=='accepted')return;
    if(started){
      // A withdrawn tag cannot safely be reinitialized in place. Once the new choice
      // is saved, a fresh page starts it without duplicating this page's view.
      if(window[disableKey]){
        if(persisted)window.location.reload();
        else{choice='declined';render();}
      }
      return;
    }
    started=true;
    window[disableKey]=false;
    window.dataLayer=Array.isArray(window.dataLayer)?window.dataLayer:[];
    window.gtag=function(){window.dataLayer.push(arguments);};
    const page={page_location:pageLocation,page_referrer:analyticsReferrer(document.referrer),page_title:document.title};
    // Set these globally so GA's automatic session/engagement events also use sanitized URLs.
    window.gtag('consent','default',{...denied});
    window.gtag('set',{...page,...campaign});
    window.gtag('set','ads_data_redaction',true);
    window.gtag('set','url_passthrough',false);
    window.gtag('consent','update',{...denied,analytics_storage:'granted'});
    window.gtag('js',new Date());
    window.gtag('config',measurementId,{
      ...page,...campaign,send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,
      cookie_domain:'chinesegenderpredictor.net',cookie_path:'/',cookie_flags:'SameSite=Lax;Secure'
    });
    window.gtag('event','page_view',{...page,...campaign,send_to:measurementId});
    script=document.createElement('script');
    script.async=true;
    script.referrerPolicy='origin';
    script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.analyticsTag='';
    document.head.append(script);
  }
  function stop(){
    window[disableKey]=true;
    if(started)window.gtag?.('consent','update',{...denied});
    script?.remove();
    clearAnalyticsCookies(document);
    // Removing a script does not unload it. A reload also stops timers in an already loaded tag.
    // Never reload into an old stored grant when the withdrawal could not be saved.
    if(started&&persisted)window.location.reload();
  }
  function close(){
    if(!choice)return;
    if(!persisted){preferences.hidden=false;preferences.focus();return;}
    preferences.hidden=true;
    settings.focus();
  }
  accept.addEventListener('click',()=>{
    choice='accepted';persisted=saveChoice(window,choice);render();start();close();
  });
  decline.addEventListener('click',()=>{
    choice='declined';persisted=saveChoice(window,choice);render();close();stop();
  });
  settings.addEventListener('click',()=>{render();preferences.hidden=false;preferences.focus();});
  preferences.addEventListener('keydown',event=>{if(event.key==='Escape'&&choice){event.preventDefault();close();}});
  window.addEventListener('storage',event=>{
    if(event.key!==ANALYTICS_CHOICE_KEY||parseAnalyticsChoice(event.newValue)!=='declined')return;
    choice='declined';persisted=true;render();preferences.hidden=true;stop();
  });
  render();
  preferences.hidden=Boolean(choice);
  if(choice==='accepted')start();
  else clearAnalyticsCookies(document);
  const controller={getChoice:()=>choice};
  controllers.set(window,controller);
  return controller;
}
