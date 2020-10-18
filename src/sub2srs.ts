import { TreeSet } from 'jstreemap';
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
const adjusted = (timings: string): number => {
  const delay = mp.get_property_native('sub-delay');
  if (delay === undefined) return +timings;
  const new_timings = Number(delay) + Number(timings);
  return new_timings
}

//assigning params to an interface type seems to not be supported at the moment
const CompareSub = (x: any, y: any) => {
  if (x.to < y.to) {
    return 1;
  } else if (x.to > y.to) {
    return -1;
  } return 0
}
const subs = new TreeSet();
subs.compareFunc = CompareSub;

const pushSubs = () => {
  const curr_sub = mp.get_property('sub-text');
  //test if adding multiple subs doesn't result in duplicates
  const ss = mp.get_property('sub-start') as string;
  const to = mp.get_property('sub-end') as string;
  if (isNaN(adjusted(ss)) || isNaN(adjusted(to)) || curr_sub === undefined) {
    return;
  }
  subs.add({
    ss: +ss,
    to: +to,
    text: curr_sub
  });
  mp.msg.warn(adjusted(ss).toString());
  mp.msg.warn(adjusted(to).toString());
}
export const nSubs = (num_subs: number, updateLast: boolean) => {
  //test treeset iteration
  updateLast;
  try {
    const curr_sub: string = mp.get_property('sub-text') as string;
    mp.msg.warn(curr_sub);
    for(let it = subs.find({text: curr_sub}); !it.equals(subs.end()); it.next()) {
      const test: Sub = it.key as Sub;
      mp.msg.warn(test.text);
      mp.msg.warn(test.to.toString());
      //add to string and remove format
    }
    //if next sub time is over 10 seconds away, don't add 
    if (num_subs > 1) {
      for(let it = subs.find({text: curr_sub}); !it.equals(subs.end()) || num_subs <= 0; num_subs--, it.next()) {
        //add to string and remove format
      }
      //add to anki
    }
  } catch(error) {
    mp.msg.warn('No subs available');
  }
}

mp.observe_property('sub-text', 'string', pushSubs);



