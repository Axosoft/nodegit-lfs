import {
  expect
} from 'chai';

describe('Unregister', () => {
  beforeEach(function () {
    const {
      NodeGitLFS
    } = this;

    return NodeGitLFS.LFS.register();
  });

  it('can unregister the LFS filter', function () {
    const {
      NodeGitLFS
    } = this;

    return NodeGitLFS.LFS.unregister()
      .then((result) => {
        expect(result).to.equal(0);
      });
  });

  it('cannot unregister the LFS filter twice', function () {
    const {
      NodeGitLFS
    } = this;

    return NodeGitLFS.LFS.unregister()
      .then((result) => {
        expect(result).to.equal(0);
      })
      .then(() => NodeGitLFS.LFS.unregister())
      .then(() => expect.fail('Failed to re-unregister!'))
      .catch((err) => {
        expect(err.errno).to.equal(-3);
      });
  });
});
