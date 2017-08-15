import path from 'path';
import NodeGit from 'nodegit';
import { todo } from '../../utils';
import LFS from '../../../build/src';

describe('Clone', () => {
  it('should generate clone repsonse', () => {
    const emptyRepoPath = path.resolve(__dirname, '..', '..', 'repos', 'empty');
    const NodeGitLFS = LFS(NodeGit);
    const url = 'https://github.com/jgrosso/nodegit-lfs-test-repo';

    return NodeGitLFS.LFS.clone(url, emptyRepoPath, { branch: 'test', env: { GIT_SSL_NO_VERIFY: 1 } })
      .then(() => todo());
  });
});
