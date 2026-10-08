// A failed or stalled calendar download must leave a visible recovery path.
export async function loadCalendar({load,onReady,onFailure,timeoutMs=15000}) {
  let timer;
  try {
    const calendar=await Promise.race([
      Promise.resolve().then(load),
      new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Calendar download timed out.')),timeoutMs);})
    ]);
    if(typeof calendar?.predict!=='function'||typeof calendar?.lunarAge!=='function')throw new Error('Calendar module is incomplete.');
    onReady(calendar);
    return true;
  } catch(error) {
    onFailure(error);
    return false;
  } finally {
    clearTimeout(timer);
  }
}
