import { expect } from 'chai';

const NodeGitLfs = require('../../../build/src');

describe('Register LFS filter for nodegit-lfs', () => {
  it('Attempt to register lfs filter', () => {
    const NodeGit = {};
    NodeGitLfs(NodeGit).then((nodegit) => {
      expect(nodegit.LFS.isLfsRegistered).to.equal(true);
    });
  });
});
