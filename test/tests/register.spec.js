import { expect } from '../../build/src/register';
import { default as NodeGitLFS } from '../../build/src';

describe('Register:', () => {
  it('has register callback', () => {
    console.log('LFS TEST: ', NodeGitLFS);
    console.log('LFS TEST: ', typeof NodeGitLFS);
    const NodeGit = {};
    const result = NodeGitLFS(NodeGit);
    console.log('Result: ', result);
    expect(result).to.be.a('Promise');
  });
});
