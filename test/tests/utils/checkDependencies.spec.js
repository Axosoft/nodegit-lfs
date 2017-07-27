import { expect } from 'chai';
import * as checker from '../../../src/utils/checkDependencies';
import { regex, BAD_VERSION } from '../../../src/constants';
import { core } from '../../../src/commands/lfsCommands';

describe('Depenendency Helpers', () => {
  describe('parseVersion', () => {
    it('parses the LFS version', () => {
      const versionText = 'git-lfs/2.1.0 (GitHub; windows 386; go 1.8.1; git bd2c9987)';
      const version = checker.parseVersion(versionText, regex.LFS);
      expect(version).to.equal('2.1.0');
    });

    it('parses the Git version', () => {
      const versionText = 'git version 2.13.0.windows.1';
      const version = checker.parseVersion(versionText, regex.GIT);
      expect(version).to.equal('2.13.0');
    });

    it('returns null when the regex matches nothing', () => {
      const versionText = 'dsadsadas';
      const version = checker.parseVersion(versionText, regex.GIT);
      expect(version).to.equal(BAD_VERSION);
    });

    it('returns null when the regex does not match numbers', () => {
      const versionText = 'dsadsadas';
      const version = checker.parseVersion(versionText, /w+/);
      expect(version).to.equal(BAD_VERSION);
    });
  });

  describe('isAtleastGitVersion', () => {
    it('is at least version 2.0.0', () => {
      expect(checker.isAtleastGitVersion('git version 2.13.0.windows.1')).to.be.true; // eslint-disable-line
    });

    it('is not at least version 2.0.0', () => {
      expect(checker.isAtleastGitVersion('git version 1.13.0.windows.1')).to.be.false; // eslint-disable-line
    });
  });

  describe('isAtleastLfsVersion', () => {
    it('is at least version 2.0.0', () => {
      expect(checker.isAtleastLfsVersion('git-lfs/2.1.1')).to.be.true; // eslint-disable-line
    });

    it('is not at least version 2.0.0', () => {
      expect(checker.isAtleastLfsVersion('git-lfs/1.1.1')).to.be.false; // eslint-disable-line
    });
  });

  describe('checkDependencies', () => {
    //eslint-disable-next-line
    it('check git version number is at least the minimum version', () => {
      return core.git('--version')
        .then(({ stdout }) => checker.isAtleastGitVersion(stdout))
        .then(result => expect(result).to.equal(true))
        .catch(() => expect.fail('sould not have done this'));
    });

    //eslint-disable-next-line
    it('check LFS version number is at least the minimum version', function() {
      return core.git('lfs version')
        .then(({ stdout }) => checker.isAtleastLfsVersion(stdout))
        .then(result => expect(result).to.equal(true))
        .catch(() => expect.fail('sould not have done this'));
    });
  });
});
