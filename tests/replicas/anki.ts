import * as test from './helper'
import {user_config as config} from './main'
interface CardData { 
  Word?: string;
  Sentence: string;
  Picture: string;
  Audio: string;
}
interface Fields {
  [key: string]: {
    value: string,
    order: string
  },
}

export const sendreq = (action: string, params: {[key: string]: unknown}): unknown => { 
  console.log(params, action);
  return;
}

export const getLastNoteId = () => {
  //mp.msg.warn("last note");
  //findNotes will always return either an emtpy array or array of numbers
  const res = test.sendreq("findNotes", { query: "added:1" }) as number[];
  if (res && res.length > 1) {
      return res.reduce(function (a, b) {
        return Math.max(a, b);
      });
  }
  return res[0] ? res[0] : -1;
}

export const getLastAudio = (id: number, updateLast: boolean) => {
  //mp.msg.warn("last audio note");
  if (!updateLast) {
    return "";
  }
  //will always return an array of fields or an empty object
  const res = test.sendreq("notesInfo", { notes: [id] }) as any;
  if (Object.keys(res[0]).length) {
    const fields: Fields = res[0].fields;
    try {
      if (fields[config.sentence_field].value) {
   //     mp.msg.warn('Overriding updated field. Are you sure? y/n');
      }
    //  mp.msg.warn(fields[config.audio_field].value);
      const audio = fields[config.audio_field].value;
      return audio;
    } catch(e) {
     // mp.msg.warn(e);
      //mp.msg.warn('Field doesn\'t exist');
    }
  }
  return "";
}
export const updateLastNote = (data: CardData) => {
  const lastId = getLastNoteId();
  if (lastId < 0) return;
  const lastAudio = getLastAudio(lastId, true);
  //change to real audio adding
  data.Audio = lastAudio + data.Audio;
  test.sendreq("updateNoteFields", {
    note: {
      id: lastId,
      fields: data,
      tags: [config.tag_name],
    },
  });
}

export const addNote = (data: CardData) => {
  test.sendreq('addNote', {
    note: {
      deckName: config.deck_name,
      modelName: config.note_type,
      fields: data,
      tags: [config.tag_name],
    }
  })
}
