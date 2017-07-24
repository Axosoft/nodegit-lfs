import { expect } from 'chai';

const NodeGit = require('nodegit');
const NodeGitLfs = require('../../build/src');

describe('LFS', () => {
  it('LFS exists', () => {
    NodeGitLfs(NodeGit).then((nodegit) => {
      expect(nodegit).not.to.be.an('undefined');
    });
  });

  it('initialize exists on LFS', () => {
    NodeGitLfs(NodeGit).then((nodegit) => {
      expect(nodegit.LFS.initialize).not.to.be.an('undefined');
      expect(nodegit.LFS.initialize).to.be.a('function');
      done();
    });
  });
});
