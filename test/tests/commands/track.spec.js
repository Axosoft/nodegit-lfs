import {
  lfsTestRepoPath
} from '../../constants';
import {
  todo
} from '../../utils';

import track from '../../../build/src/commands/track';

describe('Track', () => {
  it('does generate track response', function () {
    const {
      NodeGitLFS
    } = this;

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then(repo => track(repo, ['*.png', '*.dmg']))
      .then(() => todo());
  });
});
