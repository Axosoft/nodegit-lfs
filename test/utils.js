import {
  expect
} from 'chai';
import crypto from 'crypto';
import fse from 'fs-extra';

import spawn from '../build/src/utils/spawnHelper';

export const createDummyFile = (fileName, length) => {
  // https://github.com/sindresorhus/crypto-random-string/blob/master/index.js#L9
  const contents = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  return fse.writeFile(fileName, contents)
    .then(() => contents);
};

export const fail = (msg) => {
  expect.fail(true, true, msg);
};

export const getFilePointer = (workdir, fileName) =>
  spawn(`git show HEAD:${fileName}`, { cwd: workdir, env: { GIT_PAGER: 'cat' } })
    .then(({ stdout }) => stdout.toString());

export const todo = () => {
  fail('TODO');
};
