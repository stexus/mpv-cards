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
  sentence_field: string,
  picture_field: string,
  audio_field: string,
}

export const user_config: config = {
  audio_threshold: 0.25,
  image_width: -2,
  image_height: 300,
  image_delay_percent: 0.08,
  screenshot_quality: 70, 
  //these do not matter as much unless using the "flexible" feature, which is not recommended
  deck_name: 'Manual Mine',
  note_type: 'Audio Cards',
  tag_name: 'animecards',


  /*the below options must be changed to match user Anki settings 
  (i.e the field you want the sentence to go to should be in sentence_field) */
  //linux default
  media_collection_dir: process.env.HOME + '/.local/share/Anki2/User 1/collection.media',
  //macos default
  //media_collection_dir: process.env.HOME + '/Library/Application Support/Anki2/User 1/collection.media'
  
  //change below options up to "sentence_field" as necessary for your Anki configuration
  sentence_field: 'Sentence',
  picture_field: 'Picture',
  audio_field: 'Audio',

}
//const curl: string = 'curl';
//todo: utility functions

/* @source pigoz/mpv-nihongo */
const key_handler = (n_words: number, n_lines: number, updateLast: boolean) => {
  return () => {
    close();
    mp.osd_message(`processing ${n_lines} lines and exporting ${n_words} word(s)`);
    subs2srs.nSubs(n_words, n_lines, updateLast);
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
function open(updateLast: boolean, n: number): void { 
  close();
  mp.osd_message('[mpv-cards] # of lines? [0..9]', 9999);
  for (let i = 1; i < 10; i++) {
    mp.add_key_binding(i.toString(), `${i}`, key_handler(n, i, updateLast));
  }
  mp.add_forced_key_binding('g', 'grab-subs', key_handler(n, 1, updateLast));
  mp.add_forced_key_binding('Esc', 'close-mpv-cards', close);
  //for (let bind of otherBindings) {
  //  mp.add_forced_key_binding(bind.key, bind.name, bind.fn);
  //}
}

const open_multiple = () => {
  for (let i = 1; i < 10; i++) {
    mp.add_key_binding(i.toString(), `${i}`, () => open(true, i));
  }
  mp.osd_message('[mpv-cards] # of words to update? [0..9]', 9999);
  mp.add_forced_key_binding('Esc', 'close-mpv-cards', close);
}

mp.add_key_binding('g', 'mpv-cards', () => open(true, 1));
mp.add_key_binding('ctrl+g', 'flexible-mpv-cards', () => open(false, 1));
mp.add_key_binding('alt+g', 'update-multiple', () => open_multiple());
//mp.add_key_binding('b', 'mpv-cards', () => subs2srs.nSubs(key_handler()));
//mp.add_key_binding('Ctrl+b', 'flexible subs2srs', () => subs2srs.flexibleSubs(key_handler()))
