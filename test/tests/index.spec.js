import { expect } from 'chai';

describe('LFS', () => {
  it('LFS exists', function () {
    const {
      NodeGitLFS
    } = this;

    expect(NodeGitLFS).to.have.property('LFS');
  });

  it('initialize exists', function () {
    const {
      NodeGitLFS
    } = this;

    expect(NodeGitLFS.LFS).to.have.property('initialize');
  });

  it('register exists', function () {
    const {
      NodeGitLFS
    } = this;

    expect(NodeGitLFS.LFS).to.have.property('register');
    expect(NodeGitLFS.LFS.register).to.be.a('function');
  });

  it('unregister exists', function () {
    const {
      NodeGitLFS
    } = this;

    expect(NodeGitLFS.LFS).to.have.property('unregister');
    expect(NodeGitLFS.LFS.unregister).to.be.a('function');
  });
});
