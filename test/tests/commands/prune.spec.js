import NodeGit from 'nodegit';
import path from 'path';
import { default as LFS } from '../../../build/src';
import prune from '../../../build/src/commands/prune';

//eslint-disable-next-line
describe('Prune', function() {
  //eslint-disable-next-line
  it('does generate prune response', function() {
    const workdirPath = path.join(__dirname, '../../repos/workdir');
    const NodeGitLFS = LFS(NodeGit);

    return NodeGitLFS.Repository.open(workdirPath)
      .then(repo => prune(repo))
      .then(response => console.log(response));
  });
});
