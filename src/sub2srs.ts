import { CardData, addNote, updateLastNote } from './anki';
import { screenshot, clipaudio }from './ffmpeg';
import { TreeSet } from 'jstreemap';

interface Sub {
    ss: number, 
    to: number
    text: string
}
const getSubInfo = (): {ss: number, to: number, text: string} => {
    const text: string = mp.get_property('sub-text') as string;
    const ss = mp.get_property('sub-start') as string;
    const to = mp.get_property('sub-end') as string;
    return {
      ss: adjusted(+ss),
      to: adjusted(+to),
      text,
    }
}

const adjusted = (timing: number): number => {
  const delay = mp.get_property_native('sub-delay');
  if (delay === undefined) return timing;
  const new_timings: number = +delay + timing;
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
  if (isNaN(curr_sub.ss) || isNaN(curr_sub.to) || curr_sub === undefined) {
    return;
  }
  subs.add({
    ss: curr_sub.ss,
    to: curr_sub.to,
    text: curr_sub.text
  });
  //mp.msg.warn(adjusted(+curr_sub.ss).toString());
  //mp.msg.warn(adjusted(+curr_sub.to).toString());

}

const exportHandler = (ss: number, to: number, sentence: string, updateLast: boolean, lastN: number) => {
  const audio = `[sound:${clipaudio(ss, to)}]`;
  const picture = `<img src=\"${screenshot(ss, to)}\" />`;
  const data: CardData = {
    Word: 'replace',
    Sentence: sentence,
    Picture: picture,
    Audio: audio,
  };
  if (updateLast) {
    delete data.Word;
    updateLastNote(data, lastN);
  } else {
    addNote(data);
  }
}

export const nSubs = (num_words:number, num_subs: number, updateLast: boolean) => {
  try {
    const curr_sub: {ss: number, to: number, text: string} = getSubInfo();
    let sentence: string = '';
    const start: number = curr_sub.ss;
    let end: number = start;
    //TODO: make sure ss, to are adjusted
    for(let it = subs.find({ss: curr_sub.ss, to: curr_sub.to, text: curr_sub.text}); !it.equals(subs.end()) && num_subs > 0; num_subs--, it.next()) {
      const temp: Sub = it.key as Sub;
      sentence = `${sentence} ${temp.text.trim()}`;
      //if next sub time is over 5 seconds away, don't add 
      if (temp.to - end >= 5) break;
      end = temp.to;
      mp.msg.warn(`sentence key: ${sentence}`);
    }
    if (isNaN(start) || isNaN(end)) {
      throw 'Invalid start and end times';
    }
    exportHandler(start, end, sentence, updateLast, num_words);

  } catch(error) {
    mp.osd_message(error);
    mp.msg.warn('No subs available');
  }
}


mp.observe_property('sub-text', 'string', pushSubs);



