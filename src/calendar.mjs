import lunar from 'lunar-javascript';
import { CHART } from './chart.mjs';
const { Solar } = lunar;
export class CalendarInputError extends Error {
  constructor(message,field) { super(message);this.name='CalendarInputError';this.field=field; }
}
function parseInput(value,field) {
  try { return parseDate(value); }
  catch(error) { throw new CalendarInputError(error.message,field); }
}
export function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value||'')) throw new Error('Enter a complete date.');
  const [y,m,d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y,m-1,d));
  if(date.getUTCFullYear()!==y || date.getUTCMonth()!==m-1 || date.getUTCDate()!==d) throw new Error('Enter a valid calendar date.');
  if(y<1900 || y>2099) throw new Error('Choose a date between 1900 and 2099.');
  return {y,m,d,date};
}
export function dateString(date) { return date.toISOString().slice(0,10); }
export function addDays(value,days) { const {date}=parseDate(value); date.setUTCDate(date.getUTCDate()+days); return dateString(date); }
export function lunarDate(value) { const {y,m,d}=parseDate(value);const l=Solar.fromYmd(y,m,d).getLunar();return {year:l.getYear(),month:Math.abs(l.getMonth()),day:l.getDay(),leap:l.getMonth()<0}; }
export function lunarAge(birth,target) {
  if(parseInput(birth,'birth').date>parseInput(target,'target').date) throw new CalendarInputError('Your birth date must be before the selected date.','birth');
  const born=lunarDate(birth), at=lunarDate(target);
  return {age:at.year-born.year+1,born,at};
}
export function predict(birth,input,mode='conception') {
  if(!['conception','due'].includes(mode)) throw new Error('Choose conception date or due date.');
  parseInput(birth,'birth');parseInput(input,'target');
  const conception=mode==='due'?addDays(input,-266):input;
  if(conception<'1900-01-01') throw new CalendarInputError('The estimated conception date is before 1900. Choose a later due date.','target');
  const {age,born,at}=lunarAge(birth,conception);
  if(age<18||age>45) throw new CalendarInputError(`This chart covers lunar ages 18 to 45. Your lunar age is ${age}; we cannot give a chart result.`,'birth');
  const code=CHART[age]?.[at.month-1];
  if(!code) throw new Error('The chart is being prepared. Please try again shortly.');
  const nearby=[-7,7].map(days=>{
    const date=addDays(conception,days);
    return lunarDate(date<'1900-01-01'?'1900-01-01':date>'2099-12-31'?'2099-12-31':date);
  });
  return {age,born,lunar:at,conception,estimated:mode==='due',prediction:code==='B'?'Boy':'Girl',nearBoundary:nearby.some(l=>l.year!==at.year||l.month!==at.month||l.leap!==at.leap)};
}
export function calendarMonths(year) {
  const records=[];
  let date=`${year}-01-01`, previous=null;
  while(date<=`${year}-12-31`){
    const l=lunarDate(date), key=`${l.year}/${l.month}/${l.leap}`;
    if(key!==previous){ records.push({...l,start:date,end:date}); previous=key; }
    else records.at(-1).end=date;
    date=addDays(date,1);
  }
  return records;
}
