import version from '../../../build/src/commands/version';

describe('Version', () => {
  it('does provide version number', () => {
    console.log('TEST: ');
    return version().then(response => console.log(response));
  });
});
