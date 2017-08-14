import path from 'path';

import { todo } from '../../utils';
import { exec } from '../../../build/src/utils/spawnHelper';

describe('exec', () => {
  it('mimics child_process.exec when no arguments are provided', () => {
    exec('git lfs version')
      .then(() => todo());
  });

  it('mimics child_process.exec when arguments are provided', () => {
    exec('ls', ['-lart'])
      .then(() => todo());
  });

  it('mimics child_process.exec when options are provided', () => {
    exec('ls -lart', { cwd: path.join(__dirname, '../../repos/workdir') })
      .then(() => todo());
  });

  it('can take a callback', () => {
    const callback = innerCb => innerCb('John Doe', 'password');
    return exec('./mock-creds', { cwd: path.join(__dirname, '../../') }, callback)
      .then(() => todo());
  });
});
