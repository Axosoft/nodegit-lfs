import path from 'path';
import { todo } from '../../utils';
import ls from '../../../build/src/commands/ls';

describe('ls-files', () => {
  it('does generate ls response', function () {
    const {
      NodeGitLFS
    } = this;

    const lfsTestRepoPath = path.resolve(__dirname, '..', '..', 'repos', 'lfs-test-repository');

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then(repo => ls(repo, { long: true }))
      .then(() => todo());
  });
});
