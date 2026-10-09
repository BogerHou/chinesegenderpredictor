import {loadCalendar} from './calculator-loader.mjs';
const menu=document.querySelector('.menu-toggle');menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));menu.setAttribute('aria-label',open?'Open navigation':'Close navigation');document.querySelector('#mobile-nav').hidden=open;});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu){menu.setAttribute('aria-expanded','false');document.querySelector('#mobile-nav').hidden=true;menu.setAttribute('aria-label','Open navigation');}});
document.querySelectorAll('[data-print]').forEach(el=>el.addEventListener('click',()=>window.print()));
const form=document.querySelector('#predictor-form, #age-form');
let predict,lunarAge;
let calendarReady=false;
let loadingStatus;
const result=document.querySelector('#result-content');
const panel=document.querySelector('#result-panel');
const originalResult=result?.innerHTML;
function niceDate(value){return new Intl.DateTimeFormat('en-US',{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'));}
function clearResult(){if(result){result.innerHTML=originalResult;panel.classList.remove('has-result');delete panel.dataset.prediction;}document.querySelectorAll('.gender-chart .selected').forEach(td=>{td.classList.remove('selected');td.removeAttribute('aria-label');});const error=document.querySelector('#form-error');if(error)error.hidden=true;form?.querySelectorAll('[aria-invalid]').forEach(el=>{el.removeAttribute('aria-invalid');el.setAttribute('aria-describedby',el.getAttribute('aria-describedby').replace(' form-error',''));});}
document.querySelectorAll('[name="date-mode"]').forEach(input=>input.addEventListener('change',()=>{clearResult();const due=input.value==='due';document.querySelector('#target-label').textContent=due?'Due date':'Conception date';document.querySelector('#target-hint').textContent=due?'We estimate conception from this date.':'Your best estimate is fine.';document.querySelector('#target-date').value='';}));
form?.querySelectorAll('input[type="date"]').forEach(input=>input.addEventListener('input',clearResult));
document.querySelector('[data-example]')?.addEventListener('click',()=>{clearResult();document.querySelector('#birth-date').value='1995-06-15';const due=document.querySelector('[name="date-mode"]:checked')?.value==='due';document.querySelector('#target-date').value=due?'2027-01-22':'2026-05-01';form.requestSubmit();});
form?.addEventListener('submit',event=>{
  event.preventDefault();clearResult();
  if(!calendarReady){loadingStatus?.focus();return;}
  const error=document.querySelector('#form-error');
  const birth=document.querySelector('#birth-date'),target=document.querySelector('#target-date');
  const empty=[birth,target].find(el=>!el.value);
  if(empty){error.textContent='Please enter both dates to continue.';error.hidden=false;empty.setAttribute('aria-invalid','true');empty.setAttribute('aria-describedby',empty.getAttribute('aria-describedby')+' form-error');empty.focus();return;}
  try{
    if(form.id==='age-form'){
      const r=lunarAge(birth.value,target.value);
      result.innerHTML=`<p class="result-label">Your traditional Chinese age</p><h2 class="prediction-value">${r.age}</h2><p class="result-description">Lunar years old on ${niceDate(target.value)}</p><dl class="result-stats"><div><dt>Gregorian age</dt><dd>${r.gregorianAge} completed years</dd></div><div><dt>Traditional lunar age</dt><dd>${r.age} years</dd></div><div><dt>Lunar birth year</dt><dd>${r.born.year}</dd></div><div><dt>Target lunar year</dt><dd>${r.at.year}</dd></div></dl><p class="result-date">${r.at.year} − ${r.born.year} + 1 = <strong>${r.age}</strong></p><p class="result-date">Gregorian age changes on your birthday; this tradition adds a year at Chinese New Year.${birth.value.endsWith('-02-29')?' For February 29 births, the Gregorian comparison advances on March 1 in a non-leap year.':''}</p><div class="result-actions"><a href="/">Use the gender predictor</a><button class="text-button" data-reset type="button">Start over</button></div>`;
    } else {
      const mode=document.querySelector('[name="date-mode"]:checked').value;
      const r=predict(birth.value,target.value,mode);
      panel.dataset.prediction=r.prediction;
      result.innerHTML=`<p class="result-label">The traditional chart guesses</p><h2 class="prediction-value">${r.prediction}</h2><p class="result-description">A little folklore, just for fun. Not a medical result.</p><dl class="result-stats"><div><dt>Lunar age at conception</dt><dd>${r.age} years</dd></div><div><dt>Lunar conception month</dt><dd>${r.lunar.leap?'Leap ':''}Month ${r.lunar.month}</dd></div></dl><p class="result-date">${r.estimated?'Estimated conception':'Conception'}: ${niceDate(r.conception)}<br>Lunar date: ${r.lunar.year}, month ${r.lunar.month}, day ${r.lunar.day}${r.lunar.leap?' (leap month)':''}.</p>${r.lunar.leap?'<p class="result-warning">This version uses the matching numbered month for a leap month. Traditional interpretations differ.</p>':''}${r.estimated?'<p class="result-warning">Due date minus 266 days is only an estimate.</p>':''}${r.nearBoundary?'<p class="result-warning">Within 7 days of a lunar-month boundary. A different conception estimate may give a different result.</p>':''}<div class="result-actions"><a href="#chinese-gender-chart" data-show-cell>See my chart match</a><button class="text-button" type="button" data-copy>Copy result</button><button class="text-button" data-reset type="button">Start over</button></div><p class="copy-status" role="status" hidden></p>`;
      const cell=document.querySelector(`tr[data-age="${r.age}"] td[data-month="${r.lunar.month}"]`);
      if(cell){cell.classList.add('selected');cell.setAttribute('aria-label',`Your match: age ${r.age}, month ${r.lunar.month}, ${r.prediction}`);}
      document.querySelector('[data-show-cell]').addEventListener('click',()=>{const scroller=document.querySelector('.chart-scroll');if(scroller&&cell){const a=scroller.getBoundingClientRect(),b=cell.getBoundingClientRect();scroller.scrollTop+=b.top-a.top-90;scroller.scrollLeft+=b.left-a.left-scroller.clientWidth/2+b.width/2;}});
      document.querySelector('[data-copy]').addEventListener('click',async()=>{
        const text=`The Chinese gender chart guessed ${r.prediction.toLowerCase()}! Just for fun, not a medical prediction. Try it at ${location.origin}/`;
        const status=document.querySelector('.copy-status');status.hidden=false;
        try{await navigator.clipboard.writeText(text);status.textContent='Copied. Your dates are not included.';}catch{status.textContent=`Copy this text: ${text}`;}
      });
    }
    panel.classList.add('has-result');
    document.querySelector('[data-reset]').addEventListener('click',()=>{form.reset();if(form.id==='predictor-form'){document.querySelector('#target-label').textContent='Conception date';document.querySelector('#target-hint').textContent='Your best estimate is fine.';}clearResult();birth.focus();});
    if(matchMedia('(max-width: 767px)').matches)panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  }catch(e){error.textContent=e.message;error.hidden=false;const field=e.field==='birth'?birth:e.field==='target'?target:null;if(field){field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby',field.getAttribute('aria-describedby')+' form-error');field.focus();}else{error.tabIndex=-1;error.focus();}}
});
// Install local handling before loading the calendar; dates never leave the page.
if(form){
  const submit=form.querySelector('[type="submit"]');
  const example=form.querySelector('[data-example]');
  if(example)example.disabled=true;
  loadingStatus=document.createElement('div');
  loadingStatus.id='calculator-status';loadingStatus.className='field-hint';loadingStatus.tabIndex=-1;
  loadingStatus.setAttribute('role','status');loadingStatus.setAttribute('aria-live','polite');
  loadingStatus.textContent='Loading the lunar calendar…';
  form.querySelector('#form-error').before(loadingStatus);
  void loadCalendar({
    load:()=>import('./calendar.mjs'),
    onReady:calendar=>{
      ({predict,lunarAge}=calendar);calendarReady=true;loadingStatus.hidden=true;
      submit.removeAttribute('disabled');if(example)example.disabled=false;
    },
    onFailure:()=>{
      loadingStatus.className='form-error';
      loadingStatus.textContent='The lunar calendar could not load. Check your connection, then reload the calculator. Your dates have not been sent anywhere. ';
      const retry=document.createElement('button');retry.type='button';retry.className='text-button';retry.textContent='Reload calculator';
      retry.addEventListener('click',()=>window.location.reload());loadingStatus.append(retry);
    }
  });
}
