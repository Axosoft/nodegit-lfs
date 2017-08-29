import {
  expect
} from 'chai';
import path from 'path';

import {
  emptyRepoPath,
  lfsTestRepoPath
} from '../constants';
import {
  fail
} from '../utils';

import * as helpers from '../../build/src/helpers';
import track from '../../build/src/commands/track';

describe('helpers', () => {
  beforeEach(function () {
    const {
      NodeGitLFS
    } = this;

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then((repo) => {
        this.repo = repo;
      });
  });

  describe('getGitattributesPathFromRepo', () => {
    beforeEach(function () {
      const {
        NodeGitLFS
      } = this;

      return NodeGitLFS.Repository.open(lfsTestRepoPath)
        .then((repo) => {
          this.repo = repo;
        });
    });

    it("gets the location of a repository's `.gitattributes` file", function () {
      const {
        repo
      } = this;

      expect(helpers.getGitattributesPathFromRepo(repo))
        .to.equal(path.join(lfsTestRepoPath, '.gitattributes'));
    });
  });

  describe('loadGitattributeFiltersFromRepo', () => {
    it('reads globs from `.gitattributes`', function () {
      const {
        repo
      } = this;

      return track(repo, ['*.md', 'test.txt'])
        .then(() => helpers.loadGitattributeFiltersFromRepo(repo))
        .then((result) => {
          expect(result).to.have.members(['*.md', 'test.txt']);
        });
    });

    it('errors if `.gitattributes` does not exist', function () {
      const {
        NodeGitLFS
      } = this;

      return NodeGitLFS.Repository.open(emptyRepoPath)
        .then(repo => helpers.loadGitattributeFiltersFromRepo(repo))
        .then(() => fail('Expected promise to fail!'))
        .catch((err) => {
          expect(err.message).to.equal('No .gitattributes found');
        });
    });
  });

  describe('hasLfsFilters', () => {
    it('returns `false` if the repo has no filters', function () {
      const {
        repo
      } = this;

      return helpers.hasLfsFilters(repo)
        .then((result) => {
          expect(result).to.be.false;
        });
    });

    it('returns `true` if the repo has filters', function () {
      const {
        repo
      } = this;

      return track(repo, ['test.txt'])
        .then(() => helpers.hasLfsFilters(repo))
        .then((result) => {
          expect(result).to.be.true;
        });
    });
  });
});
