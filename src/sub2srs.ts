import * as anki from './anki';
import { TreeSet } from 'jstreemap';
interface Sub {
    ss: number, 
    to: number
    text: string
}
const getSubInfo = (): {ss: string, to: string, text: string} => {
    const text: string = mp.get_property('sub-text') as string;
    const ss = mp.get_property('sub-start') as string;
    const to = mp.get_property('sub-end') as string;
    return {
      ss,
      to,
      text,
    }
}
const adjusted = (timings: string): number => {
  const delay = mp.get_property_native('sub-delay');
  if (delay === undefined) return +timings;
  const new_timings = Number(delay) + Number(timings);
  return new_timings
}

//assigning params to an interface type seems to not be supported at the moment
const subs = new TreeSet();
subs.compareFunc = (x: any, y: any) => {
  if (x.to < y.to) {
    return -1;
  } else if (x.to > y.to) {
    return 1;
  } return 0
}

const pushSubs = () => {
  const curr_sub = getSubInfo();
  //test if adding multiple subs doesn't result in duplicates
  if (isNaN(adjusted(curr_sub.ss)) || isNaN(adjusted(curr_sub.to)) || curr_sub === undefined) {
    return;
  }
  subs.add({
    ss: +curr_sub.ss,
    to: +curr_sub.to,
    text: curr_sub.text
  });
  mp.msg.warn(adjusted(curr_sub.ss).toString());
  mp.msg.warn(adjusted(curr_sub.to).toString());

}

export const nSubs = (num_subs: number, updateLast: boolean) => {
  //test treeset iteration
  updateLast;
  try {
    const curr_sub = getSubInfo();
    let sentence: string = '';
    //if next sub time is over 10 seconds away, don't add 
    //make sure ss, to are adjusted
    for(let it = subs.find({ss: +curr_sub.ss, to: +curr_sub.to, text: curr_sub.text}); !it.equals(subs.end()) && num_subs > 0; num_subs--, it.next()) {
      const temp: Sub = it.key as Sub;
      sentence += temp.text;
      mp.msg.warn(`sentence key: ${sentence}`);
    }

    const audio = '[audio]';
    const picture = '[picture]';
    const data: anki.CardData = {
      Sentence: sentence,
      Picture: picture,
      Audio: audio,
    };
    data;
    anki;
    //anki.addNote(data);
    //anki.addNote();
    //anki.updateLast();
  } catch(error) {
    mp.msg.warn(error);
    mp.msg.warn('No subs available');
  }
}


mp.observe_property('sub-text', 'string', pushSubs);



