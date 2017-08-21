import {
  expect
} from 'chai';
// import R from 'ramda';
import sinon from 'sinon';

import {
  BAD_VERSION,
  regex,
} from '../../../build/src/constants';
import * as checker from '../../../build/src/utils/checkDependencies';
import * as versionCheckers from '../../../build/src/commands/version';
import generateResponse from '../../../build/src/utils/generateResponse';

describe.only('Depenendency Helpers', () => {
  describe('normalizeVersion', () => {
    it('normalizes valid version number arrays', () => {
      expect(checker.normalizeVersion(['1', '8', '3'])).to.equal('1.8.3');
      expect(checker.normalizeVersion(['10', '100', '1000', '-RC1'])).to.equal('10.100.1000-RC1');
    });

    it('rejects invalid version number arrays', () => {
      expect(checker.normalizeVersion([])).to.equal(BAD_VERSION);
      expect(checker.normalizeVersion(null)).to.equal(BAD_VERSION);
    });
  });

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

  describe('dependencyCheck', () => {
    beforeEach(function () {
      this.sandbox = sinon.sandbox.create();

      const mockVersionCheck = (dependency, version) =>
        this.sandbox.stub(versionCheckers, `${dependency}Version`).returns(
          version
            ? {
              raw: `${dependency}Version raw`,
              version
            }
            : {
              errno: -30,
              raw: '',
              stderr: `${dependency} not found`,
              success: false
            }
        );
      this.mockGitVersionCheck = version =>
        mockVersionCheck('git', version && `git version ${version}.windows.1`);
      this.mockLfsVersionCheck = version =>
        mockVersionCheck('lfs', version && `git-lfs/${version} (GitHub; darwin amd64; go 1.8.3)`);
    });

    afterEach(function () {
      const {
        sandbox
      } = this;

      sandbox.restore();
    });

    const testDependencyCheck = (condition, { git, lfs }, expectedResponse) =>
      it(`generates the correct response when ${condition}`, function () {
        const {
          mockGitVersionCheck,
          mockLfsVersionCheck
        } = this;

        mockGitVersionCheck(git);
        mockLfsVersionCheck(lfs);

        return checker.dependencyCheck()
          .then((response) => {
            expect(response).to.eql({
              ...generateResponse(),
              ...expectedResponse
            });
          });
      });

    testDependencyCheck(
      'Git and LFS are both compatible',
      { git: '1.8.5', lfs: '2.0.0' },
      {
        git_exists: true,
        git_meets_version: true,
        git_raw: 'gitVersion raw',
        lfs_exists: true,
        lfs_meets_version: true,
        lfs_raw: 'lfsVersion raw'
      }
    );

    testDependencyCheck(
      'Git is compatible but not LFS',
      { git: '1.8.5', lfs: '1.9.9' },
      {
        git_exists: true,
        git_meets_version: true,
        git_raw: 'gitVersion raw',
        lfs_exists: true,
        lfs_meets_version: false,
        lfs_raw: 'lfsVersion raw'
      }
    );

    testDependencyCheck(
      'Git is not compatible but LFS is',
      { git: '1.8.4', lfs: '2.0.0' },
      {
        git_exists: true,
        git_meets_version: false,
        git_raw: 'gitVersion raw',
        lfs_exists: true,
        lfs_meets_version: true,
        lfs_raw: 'lfsVersion raw'
      }
    );

    testDependencyCheck(
      'neither Git nor LFS are compatible',
      { git: '1.8.4', lfs: '1.9.9' },
      {
        git_exists: true,
        git_meets_version: false,
        git_raw: 'gitVersion raw',
        lfs_exists: true,
        lfs_meets_version: false,
        lfs_raw: 'lfsVersion raw'
      }
    );

    testDependencyCheck(
      'Git exists but not LFS',
      { git: '1.8.5' },
      {
        git_exists: true,
        git_meets_version: true,
        git_raw: 'gitVersion raw',
        lfs_exists: false,
        lfs_meets_version: false,
        lfs_raw: ''
      }
    );

    testDependencyCheck(
      'Git does not exist but LFS does',
      { lfs: '2.0.0' },
      {
        git_exists: false,
        git_meets_version: false,
        git_raw: '',
        lfs_exists: true,
        lfs_meets_version: true,
        lfs_raw: 'lfsVersion raw'
      }
    );

    testDependencyCheck(
      'neither Git nor LFS exist',
      {},
      {
        git_exists: false,
        git_meets_version: false,
        git_raw: '',
        lfs_exists: false,
        lfs_meets_version: false,
        lfs_raw: ''
      }
    );
  });
});
