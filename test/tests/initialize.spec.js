import path from 'path';
import fs from 'fs';
import { expect } from 'chai';

describe('Initialize', () => {
  it('initialize is a promise', () => {
    const {
      NodeGitLFS
    } = this;

    const lfsTestRepoPath = path.resolve(__dirname, '..', 'repos', 'lfs-test-repository');

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then((repo) => {
        const init = NodeGitLFS.LFS.initialize(repo);
        expect(init).to.be.a('promise');
      });
  });

  it('creates .gitattributes for empty repo', function () {
    const {
      NodeGitLFS
    } = this;

    const emptyRepoPath = path.resolve(__dirname, '..', 'repos', 'empty');

    expect(fs.existsSync(path.join(emptyRepoPath, '.gitattributes'))).to.be.false;

    return NodeGitLFS.Repository.open(emptyRepoPath)
      .then(repo => NodeGitLFS.LFS.initialize(repo))
      .then(() => {
        expect(fs.existsSync(path.join(emptyRepoPath, '.gitattributes'))).to.be.true;
      });
  });
});
