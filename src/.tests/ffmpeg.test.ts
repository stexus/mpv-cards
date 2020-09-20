//import * as ffmpeg from '../ffmpeg'
import { CardData } from '../sub2srs'

const expected1: CardData = {
  sentence: 'test sentence',
  picture: 'test picture',
  audio: 'test audio'
}

const init = function(): CardData {
  return {
    sentence: 'test sentence',
    picture: 'test picture',
    audio: 'test audio',
  }
}

test('initial test', () => {
  expect(init()).toStrictEqual(expected1);
})
