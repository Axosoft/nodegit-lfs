import {
  lfsTestRepoPath
} from '../../constants';
import {
  todo
} from '../../utils';

import prune from '../../../build/src/commands/prune';

describe('Prune', () => {
  it('does generate prune response', function () {
    const {
      NodeGitLFS
    } = this;

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then(repo => prune(repo))
      .then(() => todo());
  });
});
