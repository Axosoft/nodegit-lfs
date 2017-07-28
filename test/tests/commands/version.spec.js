import version from '../../../build/src/commands/version';

describe.only('generateResponse', () => {
  it('does generate response', () => {
    console.log('TEST: ');
    return version().then(response => console.log(response));
  });
});
