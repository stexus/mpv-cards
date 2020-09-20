export interface CardData { 
  sentence: string;
  picture: string;
  audio: string;
}

export class Sub2SRS {
  let sentence: string;
  let picture: string;
  let audio: string;
  constructor(data: CardData) {
    sentence = data.sentence;
    picture = data.picture;
    audio = data.audio;
  }
}

