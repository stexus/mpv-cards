import * as api from './replicas/anki'
import * as helper from './replicas/helper'
afterEach(() => {
  jest.clearAllMocks();
})
it("sends correct addNote command with information given", () => {
  const spy = jest.spyOn(helper, 'sendreq');
  const data = {
    Word: "replace",
    Sentence: "test sentence",
    Picture: "some picture replacement",
    Audio: "some audio replacement",
  }
  api.addNote(data);
  const request = JSON.stringify({action: 'addNote', version: 6, 'params': spy.mock.calls[0][1]})
  const expected = 	"{\"action\": \"addNote\",\"version\": 6,\"params\": {\"note\": {\"deckName\": \"Manual Mine\",\"modelName\": \"Audio Cards\",\"fields\": {\"Word\": \"replace\",\"Sentence\": \"test sentence\",\"Picture\": \"some picture replacement\",\"Audio\": \"some audio replacement\"},\"tags\": [\"animecards\"]}}}"
  expect(request.replace(/\s+/g, '')).toBe(expected.replace(/\s+/g, ''));
})

describe("updates fields with right values", () => {
  const spy = jest.spyOn(helper, 'sendreq');
  it('gets correct last note id', () => {
    spy.mockReturnValueOnce([1602361222569, 1602361507119, 1602362135119, 1602362721419, 1602363287294, 1602363455545, 1602363505944, 1602363677044, 1602365437319, 1602370663594]);
    expect(api.getLastNoteId()).toBe(1602370663594);
    spy.mockReturnValueOnce([]);
    expect(api.getLastNoteId()).toBe(-1);
  })
  it('gets the correct last audio field', () => {
    const raw = '{"result": [{"noteId": 1601159298407,"tags": ["yomichan"],"fields": {"Word": {"value": "some word","order": 0},"Reading": {"value": "some reading","order": 1},"Glossary": {"value": "some glossary","order": 2},"Sentence": {"value": "some sentence","order": 3},"Picture": {"value": "some picture","order": 4},"Audio": {"value": "IMPORTANT AUDIO","order": 5},"Hint": {"value": "","order": 6}},"modelName": "Audio Cards","cards": [1601159298409]}],"error": null}';
    const req = JSON.parse(raw);
    spy.mockReturnValueOnce(req.result);
    const lastAudio = api.getLastAudio(-1, true);
    expect(lastAudio).toBe('IMPORTANT AUDIO');
  })
  it("handles non-existent or empty cards", () => {
    const raw = '{"result": [{}], "error": null}';
    const req = JSON.parse(raw);
    spy.mockReturnValueOnce(req.result);
    const lastAudio = api.getLastAudio(-1, true);
    expect(lastAudio).toBe('');
    expect(spy).toHaveBeenCalledTimes(1);
  })

  it("sends the correct parameters", () => {
    spy.mockImplementation((action: string, params: {[key: string]: unknown}) => {
      params;
      if (action === 'findNotes') return [1602361222569, 1602361507119, 1602362135119, 1602362721419, 1602363287294, 1602363455545, 1602363505944, 1602363677044, 1602365437319, 1602370663594];
      else if (action === 'notesInfo') {
        const raw = '{"result": [{"noteId": 1601159298407,"tags": ["yomichan"],"fields": {"Word": {"value": "some word","order": 0},"Reading": {"value": "some reading","order": 1},"Glossary": {"value": "some glossary","order": 2},"Sentence": {"value": "some sentence","order": 3},"Picture": {"value": "some picture","order": 4},"Audio": {"value": "IMPORTANT AUDIO","order": 5},"Hint": {"value": "","order": 6}},"modelName": "Audio Cards","cards": [1601159298409]}],"error": null}';
        const req = JSON.parse(raw);
        return req.result;
      }
    });
    const data = {
      Sentence: "update sentence",
      Picture: "update picture",
      Audio: "update audio",
    }
    const lastAudio = api.getLastAudio(-1, true);
    expect(lastAudio).toBe("IMPORTANT AUDIO");
    const lastId = api.getLastNoteId();
    expect(lastId).toBe(1602370663594);
    api.updateLastNote(data);
    expect(spy).toHaveBeenCalledTimes(5);
    const request = JSON.stringify({action: spy.mock.calls[4][0], version: 6, 'params': spy.mock.calls[4][1]})
    const expected = '{"action": "updateNoteFields","version": 6,"params": {"note": {"id": 1602370663594,"fields": {"Sentence": "update sentence","Picture": "update picture","Audio": "IMPORTANT AUDIOupdate audio"},"tags": ["animecards"]}}}';
    expect(request.replace(/\s+/g, '')).toBe(expected.replace(/\s+/g, ''));
  })

})

