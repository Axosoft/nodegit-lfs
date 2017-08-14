import { expect } from 'chai';
import NodeGit from 'nodegit';
import { default as LFS } from '../../build/src';

describe('LFS', function () {
  it('LFS exists', function () {
    const NodeGitLFS = LFS(NodeGit);
    expect(NodeGitLFS).to.have.property('LFS');
  });

  it('initialize exists', function () {
    const NodeGitLFS = LFS(NodeGit);
    expect(NodeGitLFS.LFS).to.have.property('initialize');
  });

  it('register exists', function () {
    const NodeGitLFS = LFS(NodeGit);
    expect(NodeGitLFS.LFS).to.have.property('register');
    expect(NodeGitLFS.LFS.register).to.be.a('function');
  });

  it('unregister exists', function () {
    const NodeGitLFS = LFS(NodeGit);
    expect(NodeGitLFS.LFS).to.have.property('unregister');
    expect(NodeGitLFS.LFS.unregister).to.be.a('function');
  });
});
