export interface CardData { 
  sentence: string;
  picture: string;
  audio: string;
}
interface SubMap {
  [index: string]: {
    ss: string, 
    to: string
    index: number
  };
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
  count += 1;
}

const nSubs = (num_subs: number) => {
  const curr_subs = mp.get_property('sub-text') as string;
  if (num_subs > 1) {
    subs[curr_subs].index
  }

}

mp.observe_property('sub-text', 'string', pushSubs);



