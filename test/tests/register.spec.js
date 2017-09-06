import { expect } from 'chai';

describe('register', () => {
  beforeEach(function () {
    const {
      NodeGitLFS
    } = this;

    // Undo the global `beforeEach`'s registration of the LFS filters
    // so these tests can re-register them
    return NodeGitLFS.LFS.unregister();
  });

  describe('the default export', () => {
    it('registers the LFS filters', function () {
      const {
        NodeGitLFS
      } = this;

      return NodeGitLFS.LFS.register()
        .then((result) => {
          expect(result).to.be.a('number');
          expect(result).to.equal(0);
        });
    });

    describe('when the LFS filters are already registered', () => {
      it('errors', function () {
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
  });
});
