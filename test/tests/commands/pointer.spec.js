import path from 'path';
import { todo } from '../../utils';
import pointer from '../../../build/src/commands/pointer';

describe('Pointer', () => {
  it('does generate pointer response', function () {
    const {
      NodeGitLFS
    } = this;

    const lfsTestRepoPath = path.resolve(__dirname, '..', '..', 'repos', 'lfs-test-repository');

    const packageJson = path.join(lfsTestRepoPath, 'package.json');

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then(repo => pointer(repo, packageJson))
      .then(() => todo());
  });
});
