import NodeGit from 'nodegit';
import path from 'path';
import { todo } from '../../utils';
import LFS from '../../../build/src';
import prune from '../../../build/src/commands/prune';

describe('Prune', () => {
  it('does generate prune response', () => {
    const lfsTestRepoPath = path.resolve(__dirname, '..', '..', 'repos', 'lfs-test-repository');
    const NodeGitLFS = LFS(NodeGit);

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then(repo => prune(repo))
      .then(() => todo());
  });
});
