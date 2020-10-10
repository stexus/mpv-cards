import * as api from './replicas/anki'
import * as helper from './replicas/helper'
it("adds note with correct information given", () => {
  const spy = jest.spyOn(helper, 'sendreq');
  spy.mockReturnValue("hello");
  api.addNote();
  console.log(spy.mock.calls[0][1])
  expect(spy).toHaveBeenCalled();
  expect(spy.mock.calls[0][0]).toBe('addNote');
})
it("updates fields with right values", () => {
})

