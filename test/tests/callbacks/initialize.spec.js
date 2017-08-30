import {
  expect
} from 'chai';
import {
  Error
} from 'nodegit';

import initialize from '../../../build/src/callbacks/initialize';

describe('initialize', () => {
  describe('the default export', () => {
    it('returns `OK`', () => {
      expect(initialize()).to.equal(Error.CODE.OK);
    });
  });
});
