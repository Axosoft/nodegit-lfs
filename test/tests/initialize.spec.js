import {
  expect
} from 'chai';
import fs from 'fs';
import path from 'path';

import {
  emptyRepoPath,
  lfsTestRepoPath
} from '../constants';

describe('Initialize', () => {
  it('initialize is a promise', function () {
    const {
      NodeGitLFS
    } = this;

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then(repo => NodeGitLFS.LFS.initialize(repo));
  });

  it('creates .gitattributes for empty repo', function () {
    const {
      NodeGitLFS
    } = this;

    expect(fs.existsSync(path.join(emptyRepoPath, '.gitattributes'))).to.be.false;

    return NodeGitLFS.Repository.open(emptyRepoPath)
      .then(repo => NodeGitLFS.LFS.initialize(repo))
      .then(() => {
        expect(fs.existsSync(path.join(emptyRepoPath, '.gitattributes'))).to.be.true;
      });
  });
});
