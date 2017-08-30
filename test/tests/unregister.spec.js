import {
  expect
} from 'chai';

describe('unregister', () => {
  afterEach(function () {
    const {
      NodeGitLFS
    } = this;

    // Prepare for the global `afterEach`'s unregistration of the LFS filters by re-registering them
    return NodeGitLFS.LFS.register();
  });

  describe('the default export', () => {
    it('unregisters the LFS filters', function () {
      const {
      NodeGitLFS
    } = this;

      return NodeGitLFS.LFS.unregister()
        .then((result) => {
          expect(result).to.equal(0);
        });
    });

    describe('when the LFS filters are not registered', () => {
      it('errors', function () {
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
  });
});
