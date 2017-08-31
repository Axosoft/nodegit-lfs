import {
  expect
} from 'chai';
import fse from 'fs-extra';
import path from 'path';
import sinon from 'sinon';

import {
  emptyRepoPath,
  lfsTestRepoPath
} from '../../constants';

import {
  BAD_CORE_RESPONSE,
  BAD_VERSION,
  Error,
  minimumVersions
} from '../../../build/src/constants';
import {
  core
} from '../../../build/src/commands/lfsCommands';
import {
  __TESTING__,
  dependencyCheck,
  isLfsRepo,
  parseVersion
} from '../../../build/src/utils/checkDependencies';

const {
  handleVersionResponse,
  normalizeVersion
} = __TESTING__;

describe('checkDependencies', () => {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    const {
      sandbox
    } = this;

    sandbox.restore();
  });

  describe('normalizeVersion', () => {
    it('converts an array of version segments into a version string', () => {
      expect(normalizeVersion(['12'])).to.equal('12');
      expect(normalizeVersion(['12', '34', '56', '78'])).to.equal('12.34.56.78');
    });

    describe('when no array is provided', () => {
      it('returns `BAD_VERSION`', () => {
        expect(normalizeVersion()).to.equal(BAD_VERSION);
      });
    });

    describe('when an empty array is provided', () => {
      it('returns `BAD_VERSION`', () => {
        expect(normalizeVersion([])).to.equal(BAD_VERSION);
      });
    });
  });

  describe('parseVersion', () => {
    const versionRegex = /\s(.+)-(.+)-(.+)\//;

    it('extracts a version string from the provided input', () => {
      expect(parseVersion('my-program 12-34-56/', versionRegex)).to.equal('12.34.56');
    });

    describe('when no input is provided', () => {
      it('returns `BAD_VERSION`', () => {
        expect(parseVersion('', versionRegex)).to.equal(BAD_VERSION);
      });
    });

    describe('when the provided input does not match the provided regex', () => {
      it('returns `BAD_VERSION`', () => {
        expect(parseVersion('nope', versionRegex)).to.equal(BAD_VERSION);
      });
    });

    describe('when the matched version segments are not numbers', () => {
      it('returns `BAD_VERSION`', () => {
        expect(parseVersion(' test1-test2-test3/', versionRegex)).to.equal(BAD_VERSION);
      });
    });
  });

  describe('isLfsRepo', () => {
    describe('when the provided working directory contains a `.git/lfs` folder', () => {
      it('returns `true`', () =>
        fse.mkdir(path.join(lfsTestRepoPath, '.git', 'lfs'))
          .then(() => isLfsRepo(lfsTestRepoPath))
          .then((result) => {
            expect(result).to.be.true;
          })
      );
    });

    describe('when the provided working directory does not contain a `.git/lfs` folder', () => {
      it('returns `false`', () =>
        isLfsRepo(emptyRepoPath)
          .then((result) => {
            expect(result).to.be.false;
          })
      );
    });
  });

  describe('handleVersionResponse', () => {
    it('handles a Git version check response', () => {
      expect(handleVersionResponse(
        'GIT',
        {
          errno: Error.CODE.OK,
          raw: `git version ${minimumVersions.GIT}.windows.1`,
          stderr: '',
          success: true,
          version: minimumVersions.GIT
        }
      )).to.eql({
        git_exists: true,
        git_meets_version: true,
        git_raw: `git version ${minimumVersions.GIT}.windows.1`
      });

      expect(handleVersionResponse(
        'GIT',
        {
          errno: Error.CODE.OK,
          raw: 'git version 100.100.100.windows.1',
          stderr: '',
          success: true,
          version: '100.100.100'
        }
      )).to.eql({
        git_exists: true,
        git_meets_version: true,
        git_raw: 'git version 100.100.100.windows.1'
      });
    });

    it('handles an LFS version check response', () => {
      expect(handleVersionResponse(
        'LFS',
        {
          errno: Error.CODE.OK,
          raw: `git-lfs/${minimumVersions.LFS} (GitHub; windows amd64; go 1.5.3; git 7de0397)`,
          stderr: '',
          success: true,
          version: minimumVersions.LFS
        }
      )).to.eql({
        lfs_exists: true,
        lfs_meets_version: true,
        lfs_raw: `git-lfs/${minimumVersions.LFS} (GitHub; windows amd64; go 1.5.3; git 7de0397)`
      });

      expect(handleVersionResponse(
        'LFS',
        {
          errno: Error.CODE.OK,
          raw: 'git-lfs/100.100.100 (GitHub; windows amd64; go 1.5.3; git 7de0397)',
          stderr: '',
          success: true,
          version: '100.100.100'
        }
      )).to.eql({
        lfs_exists: true,
        lfs_meets_version: true,
        lfs_raw: 'git-lfs/100.100.100 (GitHub; windows amd64; go 1.5.3; git 7de0397)'
      });
    });

    describe('when a dependency does not exist', () => {
      it('sets `<dependency name>_exists` to `false`', () => {
        expect(handleVersionResponse(
          'SOME_DEPENDENCY',
          {
            errno: Error.CODE.OK,
            raw: 'invalid output even though the exit code was presumably `0`',
            stderr: '',
            success: true,
            version: BAD_VERSION
          }
        )).to.eql({
          some_dependency_exists: false,
          some_dependency_meets_version: false,
          some_dependency_raw: 'invalid output even though the exit code was presumably `0`'
        });
      });
    });

    describe('when Git is incompatible', () => {
      it('sets `git_meets_version` to `false`', () => {
        expect(handleVersionResponse(
          'GIT',
          {
            errno: Error.CODE.OK,
            raw: 'git version 0.100.100.windows.1',
            stderr: '',
            success: true,
            version: '0.100.100'
          }
        )).to.eql({
          git_exists: true,
          git_meets_version: false,
          git_raw: 'git version 0.100.100.windows.1'
        });
      });
    });

    describe('when LFS is incompatible', () => {
      it('sets `lfs_meets_version` to `false`', () => {
        expect(handleVersionResponse(
          'LFS',
          {
            errno: Error.CODE.OK,
            raw: 'git-lfs/0.100.100 (GitHub; windows amd64; go 1.5.3; git 7de0397)',
            stderr: '',
            success: true,
            version: '0.100.100'
          }
        )).to.eql({
          lfs_exists: true,
          lfs_meets_version: false,
          lfs_raw: 'git-lfs/0.100.100 (GitHub; windows amd64; go 1.5.3; git 7de0397)'
        });
      });
    });

    describe('when the provided version check response failed', () => {
      it('throws the provided response', () => {
        const response = {
          errno: BAD_CORE_RESPONSE,
          raw: '',
          stderr: 'some_dependency not found!',
          success: false
        };

        expect(() => handleVersionResponse('SOME_DEPENDENCY', response))
          .throw().and.to.equal(response);
      });
    });
  });

  describe('dependencyCheck', () => {
    it('checks the versions of Git and LFS', function () {
      const {
        sandbox
      } = this;

      sandbox.stub(core, 'git').returns(Promise.resolve({
        stdout: 'git version 100.100.100.windows.1'
      }));
      sandbox.stub(core, 'version').returns(Promise.resolve({
        stdout: 'git-lfs/100.100.100 (GitHub; windows amd64; go 1.5.3; git 7de0397)'
      }));

      return dependencyCheck()
        .then((result) => {
          expect(result).to.eql({
            errno: Error.CODE.OK,
            git_exists: true,
            git_meets_version: true,
            git_raw: 'git version 100.100.100.windows.1',
            lfs_exists: true,
            lfs_meets_version: true,
            lfs_raw: 'git-lfs/100.100.100 (GitHub; windows amd64; go 1.5.3; git 7de0397)',
            raw: '',
            stderr: '',
            success: true
          });
        });
    });
  });
});
