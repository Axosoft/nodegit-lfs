import NodeGit from 'nodegit';
import path from 'path';
import { todo } from '../../utils';
import LFS from '../../../build/src';
import track from '../../../build/src/commands/track';

describe('Track', () => {
  it('does generate track response', () => {
    const lfsTestRepoPath = path.resolve(__dirname, '..', '..', 'repos', 'lfs-test-repository');
    const NodeGitLFS = LFS(NodeGit);

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then(repo => track(repo, ['*.png', '*.dmg']))
      .then(() => todo());
  });
});
