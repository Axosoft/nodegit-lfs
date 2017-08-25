import {
  expect
} from 'chai';
import {
  Error
} from 'nodegit';

import {
  lfsTestRepoPath
} from '../../constants';

import track from '../../../build/src/commands/track';
import checkCallback from '../../../build/src/callbacks/check';

describe('check', () => {
  beforeEach(function () {
    const {
      NodeGitLFS
    } = this;

    this.check = fileName => checkCallback({
      path: () => fileName,
      repo: () => this.repo
    });

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then((repo) => {
        this.repo = repo;
      });
  });

  it('returns `OK` for a file directly specified in .gitattributes', function () {
    const {
      check,
      repo
    } = this;

    return track(repo, ['test.txt'])
      .then(() => check('test.txt'))
      .then((result) => {
        expect(result).to.equal(Error.CODE.OK);
      });
  });

  it('returns `OK` for a file included in a glob in .gitattributes', function () {
    const {
      check,
      repo
    } = this;

    return track(repo, ['*.txt'])
      .then(() => check('test.txt'))
      .then((result) => {
        expect(result).to.equal(Error.CODE.OK);
      });
  });

  it('returns `PASSTHROUGH` for a file not included in .gitattributes', function () {
    const {
      check,
      repo
    } = this;

    return track(repo, ['other.txt'])
      .then(() => check('test.txt'))
      .then((result) => {
        expect(result).to.equal(Error.CODE.PASSTHROUGH);
      });
  });

  it('returns `PASSTHROUGH` on error', function () {
    const {
      check
    } = this;

    return check('test.txt')
      .then((result) => {
        expect(result).to.equal(Error.CODE.PASSTHROUGH);
      });
  });
});
