import {
  expect
} from 'chai';
import fse from 'fs-extra';
import path from 'path';

import {
  fail,
  todo
} from '../utils';

import {
  getGitattributesPathFromRepo,
  loadGitattributeFiltersFromRepo,
  repoHasLfsFilters,
  repoHasLfsObjectBin
} from '../../build/src/helpers';
import track from '../../build/src/commands/track';

describe('helpers', () => {
  describe.only('errorCatchHandler', () => {
    describe('when the error is from LFS', () => {
      it('returns a response object', todo);
    });

    describe('when the error is not from LFS', () => {
      it('rethrows the error code', todo);
    });
  });

  describe('getGitattributesPathFromRepo', () => {
    it("gets the location of a repository's `.gitattributes` file", function () {
      const {
        lfsTestRepo
      } = this;

      expect(getGitattributesPathFromRepo(lfsTestRepo))
        .to.equal(path.join(lfsTestRepo.workdir(), '.gitattributes'));
    });
  });

  describe('loadGitattributeFiltersFromRepo', () => {
    it('reads globs from `.gitattributes`', function () {
      const {
        lfsTestRepo
      } = this;

      return track(lfsTestRepo, ['*.md', 'test.txt'])
        .then(() => loadGitattributeFiltersFromRepo(lfsTestRepo))
        .then((result) => {
          expect(result).to.have.members(['*.md', 'test.txt']);
        });
    });

    describe('when `.gitattributes` does not exist', () => {
      it('errors', function () {
        const {
          emptyRepo
        } = this;

        return loadGitattributeFiltersFromRepo(emptyRepo)
          .then(() => fail('Expected promise to fail!'))
          .catch((err) => {
            expect(err.message).to.equal('No .gitattributes found');
          });
      });
    });
  });

  describe('repoHasLfs', () => {
    describe('when the provided repository does not have LFS support enabled', () => {
      it('returns `true`', todo);
    });

    describe('when the provided repository has LFS support enabled', () => {
      it('returns `false`', todo);
    });
  });

  describe('repoHasLfsFilters', () => {
    describe('when the provided repository has `.gitattributes` filters', () => {
      it('returns `true`', function () {
        const {
          lfsTestRepo
        } = this;

        return track(lfsTestRepo, ['*.md'])
          .then(() => repoHasLfsFilters(lfsTestRepo))
          .then((result) => {
            expect(result).to.be.true;
          });
      });
    });

    describe('when the provided repository has no `.gitattributes` filters', () => {
      it('returns `false`', function () {
        const {
          lfsTestRepo
        } = this;

        return repoHasLfsFilters(lfsTestRepo)
          .then((result) => {
            expect(result).to.be.false;
          });
      });
    });
  });

  describe('repoHasLfsObjectBin', () => {
    describe('when `.git/lfs` exists in the provided repository', () => {
      it('returns `true`', function () {
        const {
          lfsTestRepo
        } = this;

        return fse.mkdir(path.join(lfsTestRepo.path(), 'lfs'))
          .then(() => repoHasLfsObjectBin(lfsTestRepo))
          .then((result) => {
            expect(result).to.be.true;
          });
      });
    });

    describe('when `.git/lfs` does not exist in the provided repository', () => {
      it('returns `false`', function () {
        const {
          emptyRepo
        } = this;

        return repoHasLfsObjectBin(emptyRepo)
          .then((result) => {
            expect(result).to.be.false;
          });
      });
    });
  });

  describe('verifyOutput', () => {
    describe('when the provided stats ')
  });
});
