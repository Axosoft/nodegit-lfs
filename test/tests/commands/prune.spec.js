import path from 'path';
import { todo } from '../../utils';
import prune from '../../../build/src/commands/prune';

describe('Prune', () => {
  it('does generate prune response', function () {
    const {
      NodeGitLFS
    } = this;

    const lfsTestRepoPath = path.resolve(__dirname, '..', '..', 'repos', 'lfs-test-repository');

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then(repo => prune(repo))
      .then(() => todo());
  });
});
