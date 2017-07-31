import track from '../../../build/src/commands/track';

//eslint-disable-next-line
describe('Track', function() {
  //eslint-disable-next-line
  it('does generate track response', function() {
    return track(['*.png', '*.dmg']).then(response => console.log(response));
  });
});
