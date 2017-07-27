import { expect } from 'chai';
import { core } from '../../../build/src/commands/lfsCommands';
import {
  isAtleastGitVersion,
  isAtleastLfsVersion,
} from '../../../build/src/utils/checkDependencies';
//eslint-disable-next-line
describe.only('checkDependencies', function() {
  //eslint-disable-next-line
  it('check git version number is atleast 1.8.0', function() {
    return core.git('--version')
      .catch(error => console.log('Error executing git --version\n', error))
      .then(({ stdout }) => isAtleastGitVersion(stdout, '1.8.0'))
      .then(result => expect(result).to.equal(true));
  });
  //eslint-disable-next-line
  it('check LFS version number is atleast 1.0.0', function() {
    return core.git('lfs version')
      .catch(error => console.log('Error executing git --version\n', error))
      .then(({ stdout }) => isAtleastLfsVersion(stdout, '1.0.0'))
      .then(result => expect(result).to.equal(true));
  });
});
