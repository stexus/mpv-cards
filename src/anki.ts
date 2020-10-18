import {user_config as config} from './main';
export interface CardData { 
  Word?: string;
  Sentence: string;
  Picture: string;
  Audio: string;
  Misc?: string;
}
const ANKICONNECT_VER: number = 6;
interface Result {
  result: null | unknown,
  error:  null | unknown,
}
interface Fields {
  [key: string]: {
    value: string,
    order: string
  },
}

const sendreq = (action: string, params: {[key: string]: unknown}): unknown => { 
  const address = '127.0.0.1:8765';
  const request = JSON.stringify({action, version: ANKICONNECT_VER, params})
  mp.msg.warn(request);
  const command = [ 'curl', '-s', address, '-X', 'POST', '-d', request]
  const raw = mp.command_native({
    name: 'subprocess',
    playback_only: false,
    capture_stdout: true,
    args: command
  })

  if (raw.stdout) {
    mp.msg.warn('anki> ' + raw.stdout);
  } else {
    mp.msg.warn('ANKI RESPONSE: ' + JSON.stringify(raw));
    if (raw.status === 7) {
      mp.msg.warn(`Couldn't connect to Anki.`);
    }
  }
  const req: Result= JSON.parse(raw.stdout);
  if (req.error) return null;
  return req.result;
}

const getLastNoteId = () => {
  mp.msg.warn("last note");
  //findNotes will always return either an emtpy array or array of numbers
  const res = sendreq("findNotes", { query: "added:1" }) as number[];
  if (res && res.length > 1) {
      return res.reduce(function (a, b) {
        return Math.max(a, b);
      });
  }
  return res[0] ? res[0] : -1;
}

const getLastAudio = (id: number, updateLast: boolean) => {
  mp.msg.warn("last audio note");
  if (!updateLast) {
    return "";
  }
  //will always return an array of fields or an empty object
  const res = sendreq("notesInfo", { notes: [id] }) as any;
  if (Object.keys(res[0]).length) {
    const fields: Fields = res[0].fields;
    try {
      if (fields[config.sentence_field].value) {
        mp.msg.warn('Overriding updated field. Are you sure? y/n');
      }
      mp.msg.warn(fields[config.audio_field].value);
      const audio = fields[config.audio_field].value;
      return audio;
    } catch(e) {
      mp.msg.warn(e);
      mp.msg.warn('Field doesn\'t exist');
    }
  }

  return "";
}
export const updateLastNote = (data: CardData) => {
  const lastId = getLastNoteId();
  if (lastId < 0) {
    mp.osd_message('No cards found');
    return;
  } 
  const lastAudio = getLastAudio(lastId, true);
  data.Audio = lastAudio + data.Audio;
  sendreq("updateNoteFields", {
    note: {
      id: lastId,
      fields: data,
      tags: [config.tag_name],
    },
  });
}

export const addNote = (data: CardData) => {
  sendreq('addNote', {
    note: {
      deckName: config.deck_name,
      modelName: config.note_type,
      fields: data,
      tags: [config.tag_name],
    }
  })
  return;
}
