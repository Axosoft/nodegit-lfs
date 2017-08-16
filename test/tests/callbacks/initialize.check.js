import {
  expect
} from 'chai';
import {
  Error
} from 'nodegit';

import initialize from '../../../build/src/callbacks/initialize';

describe('Initialize', () => {
  it('returns `OK`', () => {
    expect(initialize()).to.equal(Error.CODE.OK);
  });
});
