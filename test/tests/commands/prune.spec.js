import prune from '../../../build/src/commands/prune';

//eslint-disable-next-line
describe('Prune', function() {
  //eslint-disable-next-line
  it('does generate prune response', function() {
    return prune().then(response => console.log(response));
  });
});
