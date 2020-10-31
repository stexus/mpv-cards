import * as subs2srs from './sub2srs';
//probably useless
interface config {
  audio_threshold: number,
  image_width: number,// negative -2 for auto width
  image_height: number,
  image_delay_percent: number,
  screenshot_quality: number, //0 - 100, 100 is best
  deck_name: string,
  note_type: string,
  tag_name: string ,
  media_collection_dir: string,
  audio_field: string,
  sentence_field: string,
}

export const user_config: config = {
  audio_threshold: 0.25,
  image_width: -2,
  image_height: 520,
  image_delay_percent: 0.08,
  screenshot_quality: 70, 
  deck_name: 'Manual Mine',
  note_type: 'Audio Cards',
  tag_name: 'animecards',
  media_collection_dir: process.env.HOME + '/.local/share/Anki2/User 1/test',
  //media_collection_dir: process.env.HOME + '/.local/share/Anki2/User 1/collection.media',
  audio_field: 'Audio',
  sentence_field: 'Sentence',
}
//const curl: string = 'curl';
//todo: utility functions

/* @source pigoz/mpv-nihongo */
const key_handler = (n: number, updateLast: boolean) => {
  return () => {
    close();
    mp.osd_message(`Processing ${n} contiguous subs`);
    subs2srs.nSubs(n, updateLast);
  }
}

/* @source pigoz/mpv-nihongo */
//const otherBindings: {key: string, name: string, fn: () => void}[] = [
//  {key: 'g', name: 'grab-subs', fn: () => subs2srs.nSubs(1, true)},
//  {key: 'Esc', name: 'closeMpvCards', fn: close},
//];
function close(): void {
    for (let i = 0; i < 10; i++) {
      mp.remove_key_binding(i.toString());
    }
    mp.remove_key_binding('grab-subs');
    mp.remove_key_binding('close-mpv-cards');
    mp.osd_message('');
    //for (let bind of otherBindings) {
    //  mp.remove_key_binding(bind.name);
    //}
}
function open(updateLast: boolean): void { 
  mp.osd_message('[mpv-cards] How many contiguous subs? [0..9]', 9999);
  for (let i = 1; i < 10; i++) {
    mp.add_key_binding(i.toString(), `${i}-lines`, key_handler(i, updateLast));
  }
  mp.add_forced_key_binding('g', 'grab-subs', key_handler(1, updateLast));
  mp.add_forced_key_binding('Esc', 'close-mpv-cards', close);
  //for (let bind of otherBindings) {
  //  mp.add_forced_key_binding(bind.key, bind.name, bind.fn);
  //}
}

mp.add_key_binding('g', 'mpv-cards', () => open(true));
//mp.add_key_binding('b', 'mpv-cards', () => subs2srs.nSubs(key_handler()));
//mp.add_key_binding('Ctrl+b', 'flexible subs2srs', () => subs2srs.flexibleSubs(key_handler()))
