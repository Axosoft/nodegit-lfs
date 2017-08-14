import { expect } from 'chai';
import * as checker from '../../../src/utils/checkDependencies';
import { regex, BAD_VERSION } from '../../../src/constants';
import { core } from '../../../src/commands/lfsCommands';

describe('Depenendency Helpers', function () {
  describe('parseVersion', function () {
    it('parses the LFS version', function () {
      const versionText = 'git-lfs/2.1.0 (GitHub; windows 386; go 1.8.1; git bd2c9987)';
      const version = checker.parseVersion(versionText, regex.LFS);
      expect(version).to.equal('2.1.0');
    });

    it('parses the Git version', function () {
      const versionText = 'git version 2.13.0.windows.1';
      const version = checker.parseVersion(versionText, regex.GIT);
      expect(version).to.equal('2.13.0');
    });

    it('returns null when the regex matches nothing', function () {
      const versionText = 'dsadsadas';
      const version = checker.parseVersion(versionText, regex.GIT);
      expect(version).to.equal(BAD_VERSION);
    });

    it('returns null when the regex does not match numbers', function () {
      const versionText = 'dsadsadas';
      const version = checker.parseVersion(versionText, /w+/);
      expect(version).to.equal(BAD_VERSION);
    });
  });

  describe('isAtleastGitVersion', function () {
    it('is at least version 2.0.0', function () {
      expect(checker.isAtleastGitVersion('git version 2.13.0.windows.1')).to.be.true;
    });

    it('is not at least version 2.0.0', function () {
      expect(checker.isAtleastGitVersion('git version 1.13.0.windows.1')).to.be.false;
    });
  });

  describe('isAtleastLfsVersion', function () {
    it('is at least version 2.0.0', function () {
      expect(checker.isAtleastLfsVersion('git-lfs/2.1.1')).to.be.true;
    });

    it('is not at least version 2.0.0', function () {
      expect(checker.isAtleastLfsVersion('git-lfs/1.1.1')).to.be.false;
    });
  });

  describe('checkDependencies', function () {
    it('check git version number is at least the minimum version', function () {
      return core.git('--version')
        .then(({ stdout }) => checker.isAtleastGitVersion(stdout))
        .then(result => expect(result).to.equal(true))
        .catch(() => expect.fail('sould not have done this'));
    });

    it('check LFS version number is at least the minimum version', function () {
      return core.git('lfs version')
        .then(({ stdout }) => checker.isAtleastLfsVersion(stdout))
        .then(result => expect(result).to.equal(true))
        .catch(() => expect.fail('sould not have done this'));
    });
  });

  describe('Dependency Check', function () {
    it('generate valid response', function () {
      return checker.dependencyCheck()
        .then(response => console.log(response));
    });
  });
});
