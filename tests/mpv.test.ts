//import { CardData } from '../sub2srs'
//import data fixtures
//import * as client from 'node-mpv'
//todo: add status type in .d.ts file
const client = require('node-mpv');


test('home variable is correct', () => {
  expect(process.env.HOME).toBe('/home/massimo');
})
const player = new client();
const init = async () => {
    await player.start();
    await player.load('./tests/fixtures/shokugeki.mkv');
}

describe('MPV grabbing information', () => {
  it('gets the correct filename', async () => {
    await init();
    const name: string = await player.getFilename('stripped');
    expect(name).toBe('shokugeki.mkv');
    player.on('status', async (status: any) => {
      console.log(status);
    })
    await player.seek(5);
    await player.pause();
    console.log(await player.getProperty('sub-text'));
    console.log(await player.getProperty('sub-start'));
    console.log(await player.getProperty('sub-end'));

    })
  it('gets correct picture timestamp', async () => {
    const name: string = await player.getFilename('stripped');
    expect(name).toBe('shokugeki.mkv');

  })
})
