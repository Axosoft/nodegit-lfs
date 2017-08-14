import path from 'path';
import fs from 'fs';
import NodeGit from 'nodegit';
import { expect } from 'chai';
import LFS from '../../build/src';

describe('Initialize', () => {
  it('initialize is a promise', () => {
    const NodeGitLFS = LFS(NodeGit);
    const workdirPath = path.resolve(__dirname, '..', 'repos', 'lfs-test-repository');

    return NodeGitLFS.Repository.open(workdirPath)
      .then((repo) => {
        const init = NodeGitLFS.LFS.initialize(repo);
        expect(init).to.be.a('promise');
      });
  });

  it('creates .gitattributes for empty repo', () => {
    const NodeGitLFS = LFS(NodeGit);
    const emptydirPath = path.resolve(__dirname, '..', 'repos', 'empty');
    expect(fs.existsSync(path.join(emptydirPath, '.gitattributes'))).to.be.false;

    return NodeGitLFS.Repository.open(emptydirPath)
      .then(repo => NodeGitLFS.LFS.initialize(repo))
      .then(() => {
        expect(fs.existsSync(path.join(emptydirPath, '.gitattributes'))).to.be.true;
      });
  });
});
