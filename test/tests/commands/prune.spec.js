import prune from '../../../build/src/commands/prune';

describe.only('Prune', () => {
  it('does generate prune response', () => {
    console.log('TEST: ');
    return prune().then(response => console.log(response));
  });
});
