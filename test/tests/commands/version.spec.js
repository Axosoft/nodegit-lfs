import path from 'path';
import { todo } from '../../utils';
import version from '../../../build/src/commands/version';

describe('Version', () => {
  it('does provide version number', function () {
    const {
      NodeGitLFS
    } = this;

    const lfsTestRepoPath = path.resolve(__dirname, '..', '..', 'repos', 'lfs-test-repository');

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then(repo => version(repo))
      .then(() => todo());
  });
});
