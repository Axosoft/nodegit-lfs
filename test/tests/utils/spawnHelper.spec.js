import path from 'path';
import { exec } from '../../../build/src/utils/spawnHelper';

describe('Spawn', function () {
  beforeEach(function () {
    this.timeout(5000);
  });

  it('Spawn acts like exec', function () {
    return exec('ls', ['-lart'])
      .then(({ stdout, stderr }) => {
        console.log('Spawn test [STDOUT]: ', stdout);
        console.log('Spawn test [STDERR]: ', stderr);
      })
      .catch(err => console.log('Spawn test [ERR]: ', err));
  });

  it('Spawn works with exec style calls', function () {
    return exec('git lfs version')
      .then(({ stdout, stderr }) => {
        console.log('Spawn test [STDOUT]: ', stdout);
        console.log('Spawn test [STDERR]: ', stderr);
      })
      .catch(err => console.log('Spawn test [ERR]: ', err));
  });

  it('Spawn works with exec options', function () {
    return exec('ls -lart', { cwd: path.join(__dirname, '../../repos/workdir') })
      .then(({ stdout, stderr }) => {
        console.log('Spawn test [STDOUT]: ', stdout);
        console.log('Spawn test [STDERR]: ', stderr);
      })
      .catch(err => console.log('Spawn test [ERR]: ', err));
  });

  it('Spawn works with callback', function () {
    const callback = innerCb => innerCb('John Doe', 'password');
    console.log(path.join(__dirname, '../../'));
    return exec('./mock-creds', { cwd: path.join(__dirname, '../../') }, callback)
      .then(({ stdout, stderr }) => {
        console.log('Spawn test [STDOUT]: ', stdout);
        console.log('Spawn test [STDERR]: ', stderr);
      })
      .catch(err => console.log('Spawn test [ERR]: ', err));
  });
});
