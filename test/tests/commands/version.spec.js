import version from '../../../build/src/commands/version';

//eslint-disable-next-line
describe('Version', function() {
  //eslint-disable-next-line
  it('does provide version number', function() {
    return version().then(response => console.log(response));
  });
});
