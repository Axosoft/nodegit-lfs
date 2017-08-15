import NodeGit from 'nodegit';
import path from 'path';
import { todo } from '../../utils';
import LFS from '../../../build/src';
import pointer from '../../../build/src/commands/pointer';

describe('Pointer', () => {
  it('does generate pointer response', () => {
    const lfsTestRepoPath = path.resolve(__dirname, '..', '..', 'repos', 'lfs-test-repository');
    const NodeGitLFS = LFS(NodeGit);

    const packageJson = path.join(lfsTestRepoPath, 'package.json');

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then(repo => pointer(repo, packageJson))
      .then(() => todo());
  });
});
