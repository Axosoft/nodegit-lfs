import path from 'path';

import { todo } from '../../utils';
import { exec } from '../../../build/src/utils/spawnHelper';

describe('exec', function () {
  beforeEach(function () {
    this.timeout(5000);
  });

  it('mimics child_process.exec when no arguments are provided', function () {
    exec('git lfs version')
      .then(() => todo());
  });

  it('mimics child_process.exec when arguments are provided', function () {
    exec('ls', ['-lart'])
      .then(() => todo());
  });

  it('mimics child_process.exec when options are provided', function () {
    exec('ls -lart', { cwd: path.join(__dirname, '../../repos/workdir') })
      .then(() => todo());
  });

  it('can take a callback', function () {
    const callback = innerCb => innerCb('John Doe', 'password');
    return exec('./mock-creds', { cwd: path.join(__dirname, '../../') }, callback)
      .then(() => todo());
  });
});
