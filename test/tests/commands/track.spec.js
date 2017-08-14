import NodeGit from 'nodegit';
import path from 'path';
import { todo } from '../../utils';
import { default as LFS } from '../../../build/src';
import track from '../../../build/src/commands/track';

describe('Track', () => {
  it('does generate track response', () => {
    const workdirPath = path.join(__dirname, '../../repos/workdir');
    const NodeGitLFS = LFS(NodeGit);

    return NodeGitLFS.Repository.open(workdirPath)
      .then(repo => track(repo, ['*.png', '*.dmg']))
      .then(() => todo());
  });
});
