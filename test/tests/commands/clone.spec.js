import path from 'path';
import { todo } from '../../utils';

describe('Clone', () => {
  it('should generate clone repsonse', function () {
    const {
      NodeGitLFS
    } = this;

    const emptyRepoPath = path.resolve(__dirname, '..', '..', 'repos', 'empty');
    const url = 'https://github.com/jgrosso/nodegit-lfs-test-repo';

    return NodeGitLFS.LFS.clone(url, emptyRepoPath, { branch: 'test', env: { GIT_SSL_NO_VERIFY: 1 } })
      .then(() => todo());
  });
});
