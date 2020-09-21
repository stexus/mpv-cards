import * as subs2srs from './sub2srs';
//probably useless
interface config {
  audio_threshold: number,
  image_width: number,// negative num for auto width
  image_height: number,
  image_delay_percent: number,
  screenshot_quality: number, //0 - 100, 100 is best
  deck_name: string,
  note_type: string,
  tag_name: string ,
  media_collection_dir: string,
}

export const user_config: config = {
  audio_threshold: 0.25,
  image_width: 520,
  image_height: 520,
  image_delay_percent: 0.08,
  screenshot_quality: 70, 
  deck_name: 'Manual Mine',
  note_type: 'Audio Cards',
  tag_name: 'animecards',
  media_collection_dir: process.env.HOME + '/.local/share/Anki2/User 1/collection.media'
}
const curl: string = 'curl';
//todo: utility functions

mp.add_key_binding('g', 'mpv-cards', () => subs2srs.nSubs(1));
mp.add_key_binding('b', 'mpv-cards multiple', subs2srs.nSubs);
mp.add_key_binding('Ctrl+b', 'flexible subs2srs', subs2srs.flexibleSubs)
