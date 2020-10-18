//import { CardData } from '../sub2srs'
//import data fixtures
//import * as client from 'node-mpv'
//todo: add status type in .d.ts file
import {TreeSet} from 'jstreemap';
//const client = require('node-mpv');
//
//const player = new client({
//  'audio_only': true
//});
//const init = async () => {
//    await player.start();
//    await player.load('./tests/fixtures/shokugeki.mkv');
//}
//
//describe('subs2srs class', () => {
//  it('automatically grabs correct subs', async () => {
//    init();
//    player.quit();
//    })
//})
const CompareSub = (sub_x: any, sub_y: any) => {
  if (sub_x.time > sub_y.time) {
    return 1
  }
  else if (sub_x.time < sub_y.time) {
    return -1
  }
  return 0
}
describe('test treemap function', () => {
  const subs = new TreeSet();
  subs.compareFunc = CompareSub;
  it('correctly stores values', () => {
    const expectedSubs: {text: string, time: number}[] = [{text: "the", time: 5}, {text: "over", time: 4}, {text: "lazy", time: 6}, {text: "jumps", time: 3} ,{text: "the", time: 0}, {text: "brown", time: 1}, {text: "fox", time: 2}];
    for (let someSub of expectedSubs) {
      subs.add(someSub);
    }
    const actual: {text: string, time: number}[] = [];
    for(let it = subs.find({time: 4, text: "over"}); !it.equals(subs.end()); it.next()) {
      actual.push(it.key as {text: string, time: number});
    }
   // expect(actual[0].text).toBe("the");
   // expect(actual[1].text).toBe("brown");
   // expect(actual[2].text).toBe("fox");
   // expect(actual[3].text).toBe("jumps");
    expect(actual[0].text).toBe("over");
    expect(actual[1].text).toBe("the");
    expect(actual[2].text).toBe("lazy");

  })
  it('correctly stores sub values', () => {
    interface Sub {
      ss: number, 
      to: number
      text: string
    }
    const subs = new TreeSet();
    subs.compareFunc = (x: any, y: any) => {
      if (x.to < y.to) {
        return 1;
      } else if (x.to > y.to) {
        return -1;
      } return 0
    }
    const curr_sub: string = "神様が願いを叶えさせたくないのかもしれませんわね";

    for(let it = subs.find({text: curr_sub}); !it.equals(subs.end()); it.next()) {
      const test: Sub = it.key as Sub;
      console.log(test.text);
    }
  })


})
