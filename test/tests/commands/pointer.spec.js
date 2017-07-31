import path from 'path';
import pointer from '../../../build/src/commands/pointer';

describe('Pointer', () => {
  it('does generate pointer response', () => {
    const packageJson = path.join(__dirname, '../../repos/workdir/package.json');
    return pointer(packageJson).then(response => console.log(response));
  });
});
