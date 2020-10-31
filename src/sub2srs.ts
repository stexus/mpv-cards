import { CardData, addNote, updateLastNote } from './anki';
import { screenshot, clipaudio }from './ffmpeg';
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
/* @source pigoz/mpv-nihongo */
const compressDialogLines = (text: string) => {
  const loneCCRegex = /^（[^）]+）$/g;
  // If the whole text is just one CC line, assume we want to keep it
  if (loneCCRegex.test(text)) {
    return text;
  }
  const regex = /(^|\s)（[^）]+）/gm;
  let stripped;
  if ((text.match(regex) || []).length >= 2) {
    // Replace with simple dash when there are multiple speakers
    stripped = text.replace(regex, '$1- ');
  } else {
    // Remove CC dialog speaker name
    stripped = text.replace(regex, '$1');
  }
  return stripped.replace(/(^|\s)\n/g, '$1');
}
const adjusted = (timing: number): number => {
  const delay = mp.get_property_native('sub-delay');
  if (delay === undefined) return timing;
  const new_timings = +delay + timing;
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
  if (isNaN(adjusted(+curr_sub.ss)) || isNaN(adjusted(+curr_sub.to)) || curr_sub === undefined) {
    return;
  }
  subs.add({
    ss: +curr_sub.ss,
    to: +curr_sub.to,
    text: curr_sub.text
  });
  mp.msg.warn(adjusted(+curr_sub.ss).toString());
  mp.msg.warn(adjusted(+curr_sub.to).toString());

}

export const nSubs = (num_subs: number, updateLast: boolean) => {
  //test treeset iteration
  updateLast;
  try {
    const curr_sub: {ss: string, to: string, text: string} = getSubInfo();
    let sentence: string = '';
    const start: number = +curr_sub.ss;
    let end: number = start;
    //if next sub time is over 5 seconds away, don't add 
    //
    //TODO: make sure ss, to are adjusted
    //
    for(let it = subs.find({ss: +curr_sub.ss, to: +curr_sub.to, text: curr_sub.text}); !it.equals(subs.end()) && num_subs > 0; num_subs--, it.next()) {
      const temp: Sub = it.key as Sub;

      //TODO: format sentences:compressDialogue(temp.text) or something of the sort;
      sentence = `${sentence} ${temp.text.trim()}`;
      if (temp.to - end >= 5) continue;
      end = temp.to;
      mp.msg.warn(`sentence key: ${sentence}`);
    }
    if (isNaN(start) || isNaN(end)) {
      throw 'Invalid start and end times';
    }
    //for ffmpeg 
    const audio = `[sound:${clipaudio(adjusted(start), adjusted(end))}]`;
    const picture = `<img src=\"${screenshot(adjusted(start), adjusted(end))}\" />`;
    sentence = compressDialogLines(sentence);
    //===============
    const data: CardData = {
      Word: 'replace',
      Sentence: sentence,
      Picture: picture,
      Audio: audio,
    };
    if (updateLast) {
      delete data.Word;
      updateLastNote(data);
    } else {
      addNote(data);
    }

  } catch(error) {
    mp.osd_message(error);
    mp.msg.warn('No subs available');
  }
}


mp.observe_property('sub-text', 'string', pushSubs);



