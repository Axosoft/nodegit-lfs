import NodeGit from 'nodegit';
import path from 'path';
import { todo } from '../../utils';
import LFS from '../../../build/src';
import version from '../../../build/src/commands/version';

describe('Version', () => {
  it('does provide version number', () => {
    const lfsTestRepoPath = path.resolve(__dirname, '..', '..', 'repos', 'lfs-test-repository');
    const NodeGitLFS = LFS(NodeGit);

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then(repo => version(repo))
      .then(() => todo());
  });
});
