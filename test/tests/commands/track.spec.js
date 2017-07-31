import NodeGit from 'nodegit';
import path from 'path';
import { default as LFS } from '../../../build/src';
import track from '../../../build/src/commands/track';

//eslint-disable-next-line
describe('Track', function() {
  //eslint-disable-next-line
  it('does generate track response', function() {
    const workdirPath = path.join(__dirname, '../../repos/workdir');
    const NodeGitLFS = LFS(NodeGit);

    return NodeGitLFS.Repository.open(workdirPath)
      .then(repo => track(repo, ['*.png', '*.dmg']))
      .then(response => console.log(response));
  });
});
