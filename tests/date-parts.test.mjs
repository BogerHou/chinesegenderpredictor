import test from 'node:test';
import assert from 'node:assert/strict';
import {dateFromParts,splitDate,DatePartsError} from '../src/date-parts.mjs';
import {parseDate} from '../src/calendar.mjs';

test('English date fields preserve month and day order for calculator input',()=>{
  assert.equal(dateFromParts({month:'5',day:'1',year:'2026'}),'2026-05-01');
  assert.equal(dateFromParts({month:'12',day:'6',year:'1995'}),'1995-12-06');
  assert.deepEqual(splitDate('1995-06-15'),{month:'6',day:'15',year:'1995'});
  assert.deepEqual(splitDate(''),{month:'',day:'',year:''});
});

test('partial and malformed fields identify the control that needs attention',()=>{
  for(const [parts,part] of [[{month:'',day:'',year:''},'month'],[{month:'2',day:'',year:'2026'},'day'],[{month:'2',day:'15',year:'26'},'year'],[{month:'2',day:'15',year:'abcd'},'year']]){
    assert.throws(()=>dateFromParts(parts),error=>error instanceof DatePartsError&&error.part===part);
  }
});

test('years are strict, bounded, and never silently repaired',()=>{
  for(const year of ['1899','2100','0','2026abc','2026-'])assert.throws(()=>dateFromParts({month:'1',day:'1',year}),error=>error.part==='year');
  assert.equal(dateFromParts({month:'1',day:'1',year:'1900'}),'1900-01-01');
  assert.equal(dateFromParts({month:'12',day:'31',year:'2099'}),'2099-12-31');
});

test('complete date parts still use strict calendar validation for impossible dates',()=>{
  const date=(month,day,year)=>parseDate(dateFromParts({month,day,year}));
  assert.equal(date('2','29','2024').d,29);
  assert.throws(()=>date('2','29','2026'),/valid calendar date/);
  assert.throws(()=>date('2','30','2024'),/valid calendar date/);
  assert.throws(()=>date('4','31','2026'),/valid calendar date/);
});
