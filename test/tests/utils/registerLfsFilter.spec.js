import { expect } from 'chai';

const NodeGit = require('nodegit');
const NodeGitLfs = require('../../../build/src');

describe('Register LFS filter for nodegit-lfs', () => {
  it('Attempt to register lfs filter', () => {
    NodeGitLfs(NodeGit).then((nodegit) => {
      expect(nodegit.LFS.isLfsRegistered).to.equal(true);
    });
  });
});
