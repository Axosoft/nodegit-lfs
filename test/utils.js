import { expect } from 'chai';
import crypto from 'crypto';
import fse from 'fs-extra';

export const createDummyFile = (fileName, length) => {
  // https://github.com/sindresorhus/crypto-random-string/blob/master/index.js#L9
  const contents = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  return fse.writeFile(fileName, contents);
};

export const fail = (msg) => {
  expect.fail(true, true, msg);
};

export const todo = () => {
  fail('TODO');
};
