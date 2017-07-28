import track from '../../../build/src/commands/track';

describe.only('Track', () => {
  it('does generate track response', () => {
    console.log('TEST: ');
    return track(['*.png', '*.dmg']).then(response => console.log(response));
  });
});
