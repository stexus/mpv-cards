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

const getLastNoteId = (lastN: number) => {
  mp.msg.warn("last note");
  //findNotes will always return either an emtpy array or array of numbers
  const res = sendreq("findNotes", { query: "added:1" }) as number[];
  return res.slice(res.length - lastN, res.length);
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
        mp.osd_message("Overwriting sentence field");
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
export const updateLastNote = (data: CardData, lastN: number) => {
  const lastIds = getLastNoteId(lastN);
  if (lastIds.length === 0) return;
  for (let i = 0; i < lastIds.length; i++) {
    const lastAudio = getLastAudio(lastIds[i], true);
    data.Audio = lastAudio + data.Audio;
    sendreq("updateNoteFields", {
      note: {
        id: lastIds[i],
        fields: data,
        tags: [config.tag_name],
      },
    });
  }

  mp.osd_message("Updated last note");
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
  mp.osd_message("Added card");
  return;
}
