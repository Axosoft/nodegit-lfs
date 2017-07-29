import path from 'path';
import NodeGit from 'nodegit';
import { default as LFS } from '../../../build/src';

describe.only('Push', () => {
  it('should push to default branch', () => {
    const workdirPath = path.join(__dirname, '../../repos/workdir');
    const NodeGitLFS = LFS(NodeGit);
    console.log('Workdir: ', workdirPath);
    console.log('NodeGitLFS: ', NodeGitLFS.Repository);
    return NodeGitLFS.Repository.open(workdirPath)
      .then(repo => NodeGitLFS.LFS.push(repo));
  });
});
