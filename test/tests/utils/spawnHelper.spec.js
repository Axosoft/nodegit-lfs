import {
  expect
} from 'chai';
import path from 'path';
import R from 'ramda';

import { todo } from '../../utils';
import spawn from '../../../build/src/utils/spawnHelper';

describe('spawn', () => {
  it('mimics child_process.spawn when no process credentials needed', () =>
    spawn('ls')
      .then(() => todo()));

  it('can take a callback', () => {
    const callback = (message) => R.cond([
      [R.propEq('type', 'CREDS_REQUESTED'), () => ({ username: 'foo', password: 'bar' })],
      [R.propEq('type', 'CREDS_SUCCEEDED'), () => {}],
      [R.propEq('type', 'CREDS_FAILED'), () => {}]
    ])(message);

    return spawn('./mock-creds', null, { cwd: path.resolve(__dirname, '..', '..') }, callback)
      .then((output) => {
        expect(output.stdout).eq(Buffer.from('Great success!'));
      });
  });
});
