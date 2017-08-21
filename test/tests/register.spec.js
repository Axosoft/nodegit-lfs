import { expect } from 'chai';

describe('Register', () => {
  it('has register callback', function () {
    const {
      NodeGitLFS
    } = this;

    return NodeGitLFS.LFS.register()
      .then((result) => {
        expect(result).to.be.a('number');
        expect(result).to.equal(0);
      });
  });

  it('cannot re-register LFS filter twice', function () {
    const {
      NodeGitLFS
    } = this;

    return NodeGitLFS.LFS.register()
      .then((result) => {
        expect(result).to.be.a('number');
        expect(result).to.equal(0);
      })
      .then(() => NodeGitLFS.LFS.register())
      .then(() => expect.fail('Failed to re-register'))
      .catch((err) => {
        expect(err.errno).to.be.a('number');
        expect(err.errno).to.equal(-4);
      });
  });
});
