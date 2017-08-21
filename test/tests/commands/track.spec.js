import path from 'path';
import { todo } from '../../utils';
import track from '../../../build/src/commands/track';

describe('Track', () => {
  it('does generate track response', function () {
    const {
      NodeGitLFS
    } = this;

    const lfsTestRepoPath = path.resolve(__dirname, '..', '..', 'repos', 'lfs-test-repository');

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then(repo => track(repo, ['*.png', '*.dmg']))
      .then(() => todo());
  });
});
