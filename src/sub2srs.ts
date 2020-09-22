export interface CardData { 
  sentence: string;
  picture: string;
  audio: string;
}
interface Sub {
    ss: string, 
    to: string
    index: number
}
interface SubMap {
  [index: string]: Sub
}
const subs: SubMap = {};

const adjusted = (timings: string): string => {
  const delay = mp.get_property_native('sub-delay');
  if (delay === undefined) return timings;
  const new_timings = Number(delay) + Number(timings);
  return new_timings.toString();
}

//change to linked list
let count: number = 0;
const pointer: Sub[] = [];
const pushSubs = () => {
  const curr_sub = mp.get_property('sub-text');
  if (curr_sub === undefined) {
    return;
  }
  const ss = mp.get_property('sub-start') as string;
  const to = mp.get_property('sub-end') as string;
  subs[curr_sub] = {
    ss: adjusted(ss),
    to: adjusted(to),
    index: count,
  };
  pointer.push(subs[curr_sub]);
  count += 1;
}

export const nSubs = (num_subs: number) => {
  mp.msg.warn('working!!');
  try {
    const curr_subs = mp.get_property('sub-text') as string;
    const sub_info = subs[curr_subs];
    if (num_subs > 1) {
      const all_subs: Sub[] = [sub_info]
      const index: number = sub_info.index;
      for(let i = 1; i < num_subs; i++) {
        all_subs.push(pointer[i + index]);
      }
    }
  } catch(error) {
    mp.msg.warn('No subs available');
  }
}

mp.observe_property('sub-text', 'string', pushSubs);



