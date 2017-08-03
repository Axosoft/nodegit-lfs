import path from 'path';
import { exec } from '../../../build/src/utils/spawnHelper';
//eslint-disable-next-line
describe('Spawn', function(){
  //eslint-disable-next-line
  it('Spawn acts like exec', function(){
    return exec('ls', ['-lart'])
      .then(({ stdout, stderr }) => {
        console.log('Spawn test [STDOUT]: ', stdout);
        console.log('Spawn test [STDERR]: ', stderr);
      })
      .catch(err => console.log('Spawn test [ERR]: ', err));
  });
  //eslint-disable-next-line
  it('Spawn works with exec style calls', function(){
    return exec('git lfs version')
      .then(({ stdout, stderr }) => {
        console.log('Spawn test [STDOUT]: ', stdout);
        console.log('Spawn test [STDERR]: ', stderr);
      })
      .catch(err => console.log('Spawn test [ERR]: ', err));
  });
  //eslint-disable-next-line
  it('Spawn works with exec options', function(){
    return exec('ls -lart', { cwd: path.join(__dirname, '../../repos/workdir') })
      .then(({ stdout, stderr }) => {
        console.log('Spawn test [STDOUT]: ', stdout);
        console.log('Spawn test [STDERR]: ', stderr);
      })
      .catch(err => console.log('Spawn test [ERR]: ', err));
  });
});
