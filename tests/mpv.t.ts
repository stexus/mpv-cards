//import { CardData } from '../sub2srs'
//import data fixtures
//import * as client from 'node-mpv'
//todo: add status type in .d.ts file
const client = require('node-mpv');

const player = new client({
  'audio_only': true
});
const init = async () => {
    await player.start();
    await player.load('./tests/fixtures/shokugeki.mkv');
}

describe('MPV grabbing information', () => {
  it('gets the correct filename', async () => {
    await init();
    const name: string = await player.getFilename('stripped');
    expect(name).toBe('shokugeki.mkv');

    })
  it('gets correct picture timestamp', async () => {
    await player.seek(5);
    await player.pause();
    const subs: string = await player.getProperty('sub-text');
    const ss: string = await player.getProperty('sub-start');
    const to: string = await player.getProperty('sub-end');
    await player.quit();
    expect(subs.replace(/\s/g, '')).toBe('（葉山(はやま)アキラ）ケンカふっかけるだろうとは思ってたけどよぉ')
    expect(ss).toBe(4.859);
    expect(to).toBe(7.99);

  })
})

describe('MPV activating plugins', () => {
  it('sends a keypress', async() => {
  })
})
