import { expect } from 'chai';
import NodeGit from 'nodegit'; // eslint-disable-line import/no-unresolved
import LFS from '../../build/src';

describe('LFS', () => {
  it('LFS exists', () => {
    const NodeGitLFS = LFS(NodeGit);
    expect(NodeGitLFS).to.have.property('LFS');
  });

  it('initialize exists', () => {
    const NodeGitLFS = LFS(NodeGit);
    expect(NodeGitLFS.LFS).to.have.property('initialize');
  });

  it('register exists', () => {
    const NodeGitLFS = LFS(NodeGit);
    expect(NodeGitLFS.LFS).to.have.property('register');
    expect(NodeGitLFS.LFS.register).to.be.a('function');
  });

  it('unregister exists', () => {
    const NodeGitLFS = LFS(NodeGit);
    expect(NodeGitLFS.LFS).to.have.property('unregister');
    expect(NodeGitLFS.LFS.unregister).to.be.a('function');
  });
});
