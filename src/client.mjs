import {initAnalytics} from './analytics.mjs';
import {loadCalendar} from './calculator-loader.mjs';
import {dateFromParts,splitDate} from './date-parts.mjs';
initAnalytics();
const menu=document.querySelector('.menu-toggle');
const mobileNav=document.querySelector('#mobile-nav');
menu?.addEventListener('click',()=>{
  const open=menu.getAttribute('aria-expanded')==='true';
  menu.setAttribute('aria-expanded',String(!open));
  menu.setAttribute('aria-label',open?'Open navigation':'Close navigation');
  if(mobileNav)mobileNav.hidden=open;
  if(!open)mobileNav?.querySelector('a')?.focus();
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){
    menu.setAttribute('aria-expanded','false');
    if(mobileNav)mobileNav.hidden=true;
    menu.setAttribute('aria-label','Open navigation');
    menu.focus();
  }
  if(event.key==='Tab'&&menu?.getAttribute('aria-expanded')==='true'&&mobileNav&&!mobileNav.hidden){
    const links=[...mobileNav.querySelectorAll('a'),menu];
    const first=links[0],last=links[links.length-1];
    if(event.shiftKey&&document.activeElement===first){last.focus();event.preventDefault();}
    else if(!event.shiftKey&&document.activeElement===last){first.focus();event.preventDefault();}
  }
});
document.addEventListener('click',event=>{
  if(menu?.getAttribute('aria-expanded')==='true'&&!event.target.closest('.site-header')){
    menu.setAttribute('aria-expanded','false');
    if(mobileNav)mobileNav.hidden=true;
    menu.setAttribute('aria-label','Open navigation');
  }
});
document.querySelectorAll('[data-print]').forEach(el=>el.addEventListener('click',()=>window.print()));
const form=document.querySelector('#predictor-form, #age-form');
let predict,lunarAge,conceptionWindows;
let calendarReady=false;
let loadingStatus;
let resultSummary;
const instrument=document.querySelector('#lunar-instrument');
const originalInstrument=instrument?.innerHTML;
const result=document.querySelector('#result-content');
const panel=document.querySelector('#result-panel');
const originalResult=result?.innerHTML;
const birth=document.querySelector('#birth-date'),target=document.querySelector('#target-date');
function dateControls(field){return [...field.querySelectorAll('[data-date-part]')];}
function readDate(field){return dateFromParts(Object.fromEntries(dateControls(field).map(el=>[el.dataset.datePart,el.value])));}
function setDate(field,value){const parts=splitDate(value);dateControls(field).forEach(el=>{el.value=parts[el.dataset.datePart];});}
function dateError(field,part,message){
  const control=field.querySelector(`[data-date-part="${part}"]`);
  const error=document.querySelector('#form-error');
  error.textContent=`${field.querySelector('legend').textContent}: ${message}`;
  error.hidden=false;
  control.setAttribute('aria-invalid','true');
  const describedBy=(control.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
  if(!describedBy.includes('form-error'))describedBy.push('form-error');
  control.setAttribute('aria-describedby',describedBy.join(' '));
  control.focus();
}
function niceDate(value){return new Intl.DateTimeFormat('en-US',{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'));}
function clearResult(){
  if(!panel?.classList.contains('has-result')&&!document.querySelector('#form-error:not([hidden])'))return;
  if(instrument)instrument.innerHTML=originalInstrument;
  document.querySelector('.chart-scroll')?.setAttribute('aria-label','Traditional Chinese gender chart');
  if(result){result.innerHTML=originalResult;panel.classList.remove('has-result');delete panel.dataset.prediction;}
  document.querySelectorAll('.gender-chart .selected').forEach(td=>{td.classList.remove('selected');td.removeAttribute('aria-label');});
  const error=document.querySelector('#form-error');if(error)error.hidden=true;
  form?.querySelectorAll('[aria-invalid]').forEach(el=>{
    el.removeAttribute('aria-invalid');
    const parts=(el.getAttribute('aria-describedby')||'').split(/\s+/).filter(id=>id&&id!=='form-error');
    if(parts.length)el.setAttribute('aria-describedby',parts.join(' '));
    else el.removeAttribute('aria-describedby');
  });
}
document.querySelectorAll('[name="date-mode"]').forEach(input=>input.addEventListener('change',()=>{clearResult();const due=input.value==='due';document.querySelector('#target-label').textContent=due?'Due date':'Conception date';document.querySelector('#target-hint').textContent=due?'The date you expect your baby.':'Your best estimate is fine.';setDate(target,'');}));
form?.querySelectorAll('[data-date-part]').forEach(input=>{input.addEventListener('input',clearResult);input.addEventListener('change',clearResult);});
document.querySelector('[data-example]')?.addEventListener('click',()=>{clearResult();setDate(birth,'1995-06-15');const due=document.querySelector('[name="date-mode"]:checked')?.value==='due';setDate(target,due?'2027-01-22':'2026-05-01');form.requestSubmit();});
function generateShareCard(prediction,age,month,isLeap,dateText,zodiacName){
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;
  const ctx=canvas.getContext('2d');const isBoy=prediction==='Boy';
  const bgGrad=ctx.createLinearGradient(0,0,0,1920);
  bgGrad.addColorStop(0,'#fff9f6');bgGrad.addColorStop(1,isBoy?'#edf4fa':'#faeaef');
  ctx.fillStyle=bgGrad;ctx.fillRect(0,0,1080,1920);
  ctx.strokeStyle=isBoy?'#cde0ee':'#eed2dc';ctx.lineWidth=16;ctx.strokeRect(40,40,1000,1840);
  ctx.strokeStyle='#e8d5dc';ctx.lineWidth=2;ctx.strokeRect(60,60,960,1800);
  ctx.fillStyle='#74616d';ctx.font='600 32px Manrope,system-ui,sans-serif';ctx.textAlign='center';
  ctx.fillText('CHINESE GENDER PREDICTOR',540,240);
  ctx.fillStyle='#493b45';ctx.font='400 42px Cormorant,serif';
  ctx.fillText('A little guess for your growing family',540,310);
  ctx.save();ctx.strokeStyle=isBoy?'#b3d1e6':'#e4b6c6';ctx.lineWidth=4;
  ctx.beginPath();ctx.arc(540,680,220,0,Math.PI*2);ctx.stroke();
  for(let i=0;i<12;i++){
    const angle=(i*30-90)*(Math.PI/180);
    const x=540+Math.cos(angle)*220,y=680+Math.sin(angle)*220;
    ctx.fillStyle=(i+1===month)?(isBoy?'#3d6788':'#97415f'):'#d8c2cc';
    ctx.beginPath();ctx.arc(x,y,(i+1===month)?14:7,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
  ctx.fillStyle='#74616d';ctx.font='600 28px Manrope,system-ui,sans-serif';
  ctx.fillText('TRADITIONAL GUESS',540,600);
  ctx.fillStyle=isBoy?'#3d6788':'#97415f';ctx.font='800 130px Cormorant,serif';
  ctx.fillText(prediction.toUpperCase(),540,740);
  ctx.fillStyle='#ffffff';ctx.beginPath();
  if(ctx.roundRect)ctx.roundRect(140,1000,800,500,28);else ctx.rect(140,1000,800,500);
  ctx.fill();ctx.strokeStyle='#e8d5dc';ctx.lineWidth=2;ctx.stroke();
  ctx.textAlign='left';ctx.fillStyle='#74616d';ctx.font='600 26px Manrope,system-ui,sans-serif';
  ctx.fillText('LUNAR AGE AT CONCEPTION',200,1070);
  ctx.fillStyle='#493b45';ctx.font='800 44px Manrope,system-ui,sans-serif';
  ctx.fillText(`${age} years`,200,1125);
  ctx.fillStyle='#74616d';ctx.font='600 26px Manrope,system-ui,sans-serif';
  ctx.fillText('LUNAR CONCEPTION MONTH',200,1210);
  ctx.fillStyle='#493b45';ctx.font='800 44px Manrope,system-ui,sans-serif';
  ctx.fillText(`${isLeap?'Leap ':''}Month ${month}`,200,1265);
  if(zodiacName){
    ctx.fillStyle='#74616d';ctx.font='600 26px Manrope,system-ui,sans-serif';
    ctx.fillText('ESTIMATED BABY ZODIAC',200,1350);
    ctx.fillStyle='#493b45';ctx.font='800 44px Manrope,system-ui,sans-serif';
    ctx.fillText(zodiacName,200,1405);
  }
  ctx.fillStyle='#74616d';ctx.font='400 24px Manrope,system-ui,sans-serif';
  ctx.fillText(dateText,200,1465);
  ctx.textAlign='center';ctx.fillStyle='#74616d';ctx.font='400 28px Manrope,system-ui,sans-serif';
  ctx.fillText('Folklore for entertainment · Not a medical prediction',540,1640);
  ctx.fillStyle='#ad466b';ctx.font='600 32px Manrope,system-ui,sans-serif';
  ctx.fillText('chinesegenderpredictor.net',540,1710);
  return new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
}
form?.addEventListener('submit',event=>{
  event.preventDefault();clearResult();
  if(!calendarReady){loadingStatus?.focus();return;}
  const error=document.querySelector('#form-error');
  let birthValue,targetValue;
  for(const field of [birth,target]){try{const value=readDate(field);if(field===birth)birthValue=value;else targetValue=value;}catch(e){dateError(field,e.part,e.message);return;}}
  try{
    if(form.id==='age-form'){
      const r=lunarAge(birthValue,targetValue);
      resultSummary=`Traditional lunar age ${r.age}, regular age ${r.gregorianAge} years, on ${niceDate(targetValue)}.`;
      result.innerHTML=`<p class="result-label">Your traditional Chinese age</p><h2 class="prediction-value">${r.age}</h2><p class="result-description">Lunar years old on ${niceDate(targetValue)}</p><dl class="result-stats"><div><dt>Your regular age</dt><dd>${r.gregorianAge} years</dd></div><div><dt>Traditional lunar age</dt><dd>${r.age} years</dd></div><div><dt>Lunar birth year</dt><dd>${r.born.year}</dd></div><div><dt>Lunar year on this date</dt><dd>${r.at.year}</dd></div></dl><p class="result-date">${r.at.year} − ${r.born.year} + 1 = <strong>${r.age}</strong></p><p class="result-date">Your regular age changes on your birthday. Your traditional age changes at Chinese New Year.${birthValue.endsWith('-02-29')?' For February 29 birthdays, we use March 1 in a non-leap year for your regular age.':''}</p><div class="result-actions"><a href="/">Use the gender predictor</a><button class="text-button" data-reset type="button">Start over</button></div>`;
    } else {
      const mode=document.querySelector('[name="date-mode"]:checked').value;
      const r=predict(birthValue,targetValue,mode);
      panel.dataset.prediction=r.prediction;
      resultSummary=`The traditional chart guesses ${r.prediction}. Lunar age ${r.age}, lunar month ${r.lunar.month}. For entertainment only.`;
      if(instrument){instrument.querySelector('.lunar-dial-center').innerHTML=`<strong>${r.age}</strong><span>Lunar age</span>`;instrument.querySelector(`[data-lunar-month="${r.lunar.month}"]`).classList.add('is-selected');instrument.querySelector('.instrument-caption').textContent=`Your lunar month: ${r.lunar.leap?'leap month ':''}${r.lunar.month}`;}
      const zodiacHtml=r.babyZodiac?`<div class="result-zodiac"><span class="zodiac-tag">Baby’s Chinese Zodiac</span><p class="zodiac-title">Year of the ${r.babyZodiac.name} ${r.babyZodiac.emoji}</p><p class="zodiac-traits">${r.babyZodiac.traits}</p></div>`:'';
      let plannerHtml='';
      if(conceptionWindows){
        const w26=conceptionWindows(birthValue,2026),w27=conceptionWindows(birthValue,2027);
        const fmtMonths=(list,pred)=>list.filter(w=>w.prediction===pred).map(w=>`${w.leap?'Leap ':''}M${w.month}`).join(', ')||'None';
        plannerHtml=`<details class="conception-planner"><summary><span class="summary-label"><strong>Plan ahead: 2026 &amp; 2027 conception windows</strong></span><span class="planner-arrow">▼</span></summary><div class="planner-content"><p class="planner-desc">Based on the traditional chart at your lunar age, here are the lunar months predicting a Boy or Girl:</p><div class="planner-grid"><div class="planner-col"><h4>2026 (Lunar Age ${w26[0]?.age||''})</h4><div class="planner-group"><span class="planner-tag boy">Boy</span> <span>${fmtMonths(w26,'Boy')}</span></div><div class="planner-group"><span class="planner-tag girl">Girl</span> <span>${fmtMonths(w26,'Girl')}</span></div></div><div class="planner-col"><h4>2027 (Lunar Age ${w27[0]?.age||''})</h4><div class="planner-group"><span class="planner-tag boy">Boy</span> <span>${fmtMonths(w27,'Boy')}</span></div><div class="planner-group"><span class="planner-tag girl">Girl</span> <span>${fmtMonths(w27,'Girl')}</span></div></div></div></div></details>`;
      }
      result.innerHTML=`<p class="result-label">The traditional chart guesses</p><h2 class="prediction-value">${r.prediction}</h2><p class="result-description">A little folklore, just for fun. Not a medical result.</p><dl class="result-stats"><div><dt>Lunar age at conception</dt><dd>${r.age} years</dd></div><div><dt>Lunar conception month</dt><dd>${r.lunar.leap?'Leap ':''}Month ${r.lunar.month}</dd></div></dl>${zodiacHtml}<p class="result-date">${r.estimated?'Estimated conception':'Conception'}: ${niceDate(r.conception)}<br>Lunar date: ${r.lunar.year}, month ${r.lunar.month}, day ${r.lunar.day}${r.lunar.leap?' (leap month)':''}.</p>${r.lunar.leap?'<p class="result-warning">For a leap month, we use the same month number on the chart. Other charts may follow a different rule.</p>':''}${r.estimated?'<p class="result-warning">We estimated conception from your due date. The actual day may differ.</p>':''}${r.nearBoundary?'<p class="result-warning">Your date is close to the start or end of a lunar month. A different conception estimate may change the guess.</p>':''}<div class="result-actions"><a href="#chinese-gender-chart" data-show-cell>See my chart match</a><button class="text-button" type="button" data-share-card>Share card</button><button class="text-button" type="button" data-copy>Copy text</button><button class="text-button" data-reset type="button">Start over</button></div><p class="copy-status" role="status" hidden></p><aside class="result-party-kit" aria-label="Printable party games"><div class="party-kit-content"><span class="party-kit-tag">Free party kit</span><p class="party-kit-title">Planning a gender reveal?</p><p class="party-kit-sub">Download our free 9-page kit with voting, bingo & prediction cards.</p></div><a class="button secondary small" href="/gender-reveal-games/">Get free games</a></aside>${plannerHtml}`;
      const cell=document.querySelector(`tr[data-age="${r.age}"] td[data-month="${r.lunar.month}"]`);
      if(cell){cell.classList.add('selected');cell.setAttribute('aria-label',`Your match: age ${r.age}, month ${r.lunar.month}, ${r.prediction}`);}
      document.querySelector('[data-show-cell]').addEventListener('click',event=>{event.preventDefault();const scroller=document.querySelector('.chart-scroll');if(scroller&&cell){const a=scroller.getBoundingClientRect(),b=cell.getBoundingClientRect();scroller.scrollTop+=b.top-a.top-90;scroller.scrollLeft+=b.left-a.left-scroller.clientWidth/2+b.width/2;scroller.setAttribute('aria-label',`Traditional Chinese gender chart. Your match: lunar age ${r.age}, month ${r.lunar.month}, ${r.prediction}.`);document.querySelector('#chinese-gender-chart').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});scroller.focus({preventScroll:true});}});
      document.querySelector('[data-copy]').addEventListener('click',async()=>{
        const text=`The Chinese gender chart guessed ${r.prediction.toLowerCase()}! Just for fun, not a medical prediction. Try it at ${location.origin}/`;
        const status=document.querySelector('.copy-status');status.hidden=false;
        try{await navigator.clipboard.writeText(text);status.textContent='Copied. Your dates are not included.';}catch{status.textContent=`Copy this text: ${text}`;}
      });
      document.querySelector('[data-share-card]')?.addEventListener('click',async()=>{
        const status=document.querySelector('.copy-status');status.hidden=false;
        status.textContent='Preparing your share card…';
        try{
          const dateText=`${r.estimated?'Estimated conception':'Conception'}: ${niceDate(r.conception)}`;
          const blob=await generateShareCard(r.prediction,r.age,r.lunar.month,r.lunar.leap,dateText,r.babyZodiac?.name);
          const file=new File([blob],`chinese-gender-prediction-${r.prediction.toLowerCase()}.png`,{type:'image/png'});
          let shared=false;
          if(navigator.canShare&&navigator.canShare({files:[file]})){
            try{
              await navigator.share({title:'Chinese Gender Prediction',text:`The Chinese gender chart guessed ${r.prediction.toLowerCase()}!`,files:[file]});
              shared=true;status.textContent='Shared! Your dates stay private.';
            }catch(shareErr){
              if(shareErr.name==='AbortError'){status.textContent='';return;}
            }
          }
          if(!shared){
            const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;
            a.download=`chinese-gender-prediction-${r.prediction.toLowerCase()}.png`;a.click();
            setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Card saved to your downloads!';
          }
        }catch(err){
          status.textContent='Could not create card. You can still copy text.';
        }
      });
    }
    panel.classList.add('has-result');
    const resultHeading=result.querySelector('h2');resultHeading.tabIndex=-1;resultHeading.setAttribute('aria-label',resultSummary);resultHeading.focus({preventScroll:true});
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches){try{result.animate?.([{opacity:.35,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'cubic-bezier(.2,.7,.2,1)'});}catch{}}
    document.querySelector('[data-reset]').addEventListener('click',()=>{form.reset();if(form.id==='predictor-form'){document.querySelector('#target-label').textContent='Conception date';document.querySelector('#target-hint').textContent='Your best estimate is fine.';}clearResult();birth.querySelector('[data-date-part="month"]').focus();});
    if(matchMedia('(max-width: 767px)').matches)panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  }catch(e){const field=e.field==='birth'?birth:e.field==='target'?target:null;if(field){dateError(field,e.message==='Enter a valid calendar date.'?'day':'month',e.message);}else{error.textContent=e.message;error.hidden=false;error.tabIndex=-1;error.focus();}}
});
if(form){
  const submit=form.querySelector('[type="submit"]');
  const example=form.querySelector('[data-example]');
  loadingStatus=form.querySelector('#calculator-status');
  function startLoading(){
    form.setAttribute('aria-busy','true');
    submit?.setAttribute('disabled','');
    if(example)example.disabled=true;
    if(loadingStatus){loadingStatus.className='field-hint calculator-status';loadingStatus.hidden=false;loadingStatus.textContent='Loading the lunar calendar…';}
    void loadCalendar({
      load:()=>import('./calendar.mjs'),
      onReady:calendar=>{
        ({predict,lunarAge,conceptionWindows}=calendar);calendarReady=true;
        if(loadingStatus)loadingStatus.hidden=true;
        form.setAttribute('aria-busy','false');
        submit?.removeAttribute('disabled');if(example)example.disabled=false;
      },
      onFailure:()=>{
        form.setAttribute('aria-busy','false');
        if(loadingStatus){
          loadingStatus.className='form-error is-stalled';loadingStatus.hidden=false;
          loadingStatus.innerHTML='The calculator could not load. Please check your connection and <button class="text-button" type="button" data-retry>try again</button>.';
          loadingStatus.querySelector('[data-retry]')?.addEventListener('click',startLoading);
          loadingStatus.focus();
        }
      }
    });
  }
  startLoading();
}
