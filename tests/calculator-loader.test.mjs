import test from 'node:test';
import assert from 'node:assert/strict';
import {loadCalendar} from '../src/calculator-loader.mjs';

test('calculator becomes ready only after the entire calendar module has loaded', async () => {
  let resolve;
  let ready=false;
  const module={predict(){},lunarAge(){}};
  const pending=loadCalendar({load:()=>new Promise(r=>{resolve=r;}),onReady:value=>{assert.equal(value,module);ready=true;},onFailure:assert.fail});
  await Promise.resolve();
  assert.equal(ready,false,'submit must remain unavailable while the download is pending');
  resolve(module);
  assert.equal(await pending,true);
  assert.equal(ready,true);
});

test('failed calendar requests expose recovery instead of enabling a broken calculator', async () => {
  const failure=new Error('Network request failed');
  const failures=[];
  const ready=await loadCalendar({load:()=>Promise.reject(failure),onReady:()=>assert.fail('cannot enable a failed calculator'),onFailure:error=>failures.push(error)});
  assert.equal(ready,false);
  assert.deepEqual(failures,[failure]);
});

test('a stalled calendar request exposes recovery and a late download cannot overwrite it', async () => {
  let resolve;
  const failures=[];
  const ready=await loadCalendar({load:()=>new Promise(r=>{resolve=r;}),onReady:()=>assert.fail('timed-out requests cannot enable the form'),onFailure:error=>failures.push(error),timeoutMs:10});
  assert.equal(ready,false);
  assert.equal(failures.length,1);
  assert.match(failures[0].message,/timed out/);
  resolve({predict(){},lunarAge(){}});
  await Promise.resolve();
  assert.equal(failures.length,1);
});

test('an incomplete module also leaves the calculator disabled with a recovery path', async () => {
  let failed=false;
  assert.equal(await loadCalendar({load:()=>({predict(){}}),onReady:()=>assert.fail('missing age calculation'),onFailure:error=>{assert.match(error.message,/incomplete/);failed=true;}}),false);
  assert.equal(failed,true);
});
