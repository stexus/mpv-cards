import {user_config as config} from './main';
interface CardData { 
  sentence: string;
  picture: string;
  audio: string;
}
interface Fields {
  [key: string]: {
    value: string,
    order: string
  },
}

const sendreq = (action: string, params: {[key: string]: unknown}): unknown => { 
  console.log(params, action);
  return;
}

const getLastNoteId = () => {
  //mp.msg.warn("last note");
  //findNotes will always return either an emtpy array or array of numbers
  const res = sendreq("findNotes", { query: "added:1" }) as number[];
  if (res && res.length > 1) {
      return res.reduce(function (a, b) {
        return Math.max(a, b);
      });
  }
  return res[0];
}

const getLastAudio = (id: number, updateLast: boolean) => {
  //mp.msg.warn("last audio note");
  if (!updateLast) {
    return "";
  }
  //will always return an array of fields or an empty object
  const res = sendreq("notesInfo", { notes: [id] }) as any;
  if (!Object.keys(res[0]).length) {
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
  const lastAudio = getLastAudio(lastId, true);
  //change to real audio adding
  data.audio += lastAudio;
  sendreq("updateNoteFields", {
    note: {
      id: lastId,
      fields: data,
      tags: [config.tag_name],
    },
  });
}

export const addNote = () => {
  const data = ''
  sendreq('addNote', {
    note: {
      deckName: config.deck_name,
      modelName: config.note_type,
      fields: data
    }
  })
}
