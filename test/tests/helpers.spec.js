import {
  expect
} from 'chai';
import path from 'path';

import {
  fail,
  todo
} from '../utils';

import * as helpers from '../../build/src/helpers';
import track from '../../build/src/commands/track';

describe('helpers', () => {
  describe('getGitattributesPathFromRepo', () => {
    it("gets the location of a repository's `.gitattributes` file", function () {
      const {
        lfsTestRepo
      } = this;

      expect(helpers.getGitattributesPathFromRepo(lfsTestRepo))
        .to.equal(path.join(lfsTestRepo.workdir(), '.gitattributes'));
    });
  });

  describe('loadGitattributeFiltersFromRepo', () => {
    it('reads globs from `.gitattributes`', function () {
      const {
        lfsTestRepo
      } = this;

      return track(lfsTestRepo, ['*.md', 'test.txt'])
        .then(() => helpers.loadGitattributeFiltersFromRepo(lfsTestRepo))
        .then((result) => {
          expect(result).to.have.members(['*.md', 'test.txt']);
        });
    });

    describe('when `.gitattributes` does not exist', () => {
      it('errors', function () {
        const {
          emptyRepo
        } = this;

        return helpers.loadGitattributeFiltersFromRepo(emptyRepo)
          .then(() => fail('Expected promise to fail!'))
          .catch((err) => {
            expect(err.message).to.equal('No .gitattributes found');
          });
      });
    });
  });

  describe('repoHasLfsFilters', () => {
    describe('when the provided repository has `.gitattributes` filters', () => {
      it('returns `true`', todo);
    });

    describe('when the provided repository has no `.gitattributes` filters', () => {
      it('returns `false`', todo);
    });
  });

  describe('repoHasLfsObjectBin', () => {
    describe('when `.git/lfs` exists in the provided repository', () => {
      it('returns `true`', todo);
    });

    describe('when `.git/lfs` does not exist in the provided repository', () => {
      it('returns `false`', todo);
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

  describe('errorCatchHandler', () => {
    describe('when the error is from LFS', () => {
      it('returns a response object', todo);
    });

    describe('when the error is not from LFS', () => {
      it('rethrows the error code', todo);
    });
  });
});
