import path from 'path';

import { todo } from '../../utils';
import spawn from '../../../build/src/utils/spawnHelper';

describe('spawn', () => {
  it('mimics child_process.spawn when no arguments are provided', () => {
    spawn('git lfs version')
      .then(() => todo());
  });

  it('mimics child_process.spawn when arguments are provided', () => {
    spawn('ls', ['-lart'])
      .then(() => todo());
  });

  it('mimics child_process.spawn when options are provided', () => {
    spawn('ls -lart', { cwd: path.resolve(__dirname, '..', '..', 'repos', 'lfs-test-repository') })
      .then(() => todo());
  });

  it('can take a callback', () => {
    const callback = innerCb => innerCb('John Doe', 'password');
    return spawn('./mock-creds', { cwd: path.resolve(__dirname, '..', '..') }, callback)
      .then(() => todo());
  });
});
