import {
  expect
} from 'chai';
import {
  Error
} from 'nodegit';

import generateResponse from '../../../build/src/utils/generateResponse';

describe('generateResponse', () => {
  it('generates a default successful response', () => {
    expect(generateResponse()).to.eql({
      success: true,
      errno: Error.CODE.OK,
      raw: '',
      stderr: ''
    });
  });
});
