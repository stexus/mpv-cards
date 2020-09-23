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

describe('subs2srs class', () => {
  it('automatically grabs correct subs', async () => {
    })
})
