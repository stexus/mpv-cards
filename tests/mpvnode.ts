//import { CardData } from '../sub2srs'
//import data fixtures
//import * as client from 'node-mpv'
//todo: add status type in .d.ts file
const client = require('node-mpv');


const player = new client();
const startSequence = async () => {
  await player.start();
  await player.load('./fixtures/shokugeki.mkv');
  player.on('status', async (status: any) => {
   console.log(status);
   console.log(await player.getProperty('sub-text'));
  })
  await player.subtitleSeek(5);
  const subs: string = await player.getProperty('file-size');
  console.log(subs);
}

//startSequence();

