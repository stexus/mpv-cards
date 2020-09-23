import * as anki from './anki'
import * as std from 'tstl'
export interface CardData { 
  sentence: string;
  picture: string;
  audio: string;
}
interface Sub {
    ss: number, 
    to: number
    text: string
}
//interface SubMap {
//  [index: string]: Sub
//}

const adjusted = (timings: string): number => {
  const delay = mp.get_property_native('sub-delay');
  if (delay === undefined) return +timings;
  const new_timings = Number(delay) + Number(timings);
  return new_timings
}

//use treeset instead
//const pointer: Sub[] = [];
//const subs: SubMap = {};

const CompareSub = (sub_x: Sub, sub_y: Sub) => {
  return sub_x.to < sub_y.ss;
}
const subs: std.TreeSet<Sub> = new std.TreeSet(CompareSub);

const pushSubs = () => {
  const curr_sub = mp.get_property('sub-text');
  //test if adding multiple subs doesn't result in duplicates
  if (curr_sub === undefined) {
    return;
  }
  const ss = mp.get_property('sub-start') as string;
  const to = mp.get_property('sub-end') as string;
  subs.insert({
    ss: +ss,
    to: +to,
    text: curr_sub
  });
  mp.msg.warn(adjusted(ss).toString());
  mp.msg.warn(adjusted(to).toString());
}

export const nSubs = (num_subs: number, updateLast: boolean) => {
  //commented out in favor of treeset
  try {
    //const curr_subs = mp.get_property('sub-text') as string;
    //const sub_info = subs[curr_subs];
    if (num_subs > 1) {
     // const all_subs: Sub[] = [sub_info]
      //const index: number = sub_info.index;
      for(let i = 1; i < num_subs; i++) {
       // all_subs.push(pointer[i + index]);
      }
    }
    updateLast ? anki.updateLastNote() : anki.addNote();
  } catch(error) {
    mp.msg.warn('No subs available');
  }
}

mp.observe_property('sub-text', 'string', pushSubs);



