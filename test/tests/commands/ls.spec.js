import {
  lfsTestRepoPath
} from '../../constants';
import {
  todo
} from '../../utils';

import ls from '../../../build/src/commands/ls';

describe('ls-files', () => {
  it('does generate ls response', function () {
    const {
      NodeGitLFS
    } = this;

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then(repo => ls(repo, { long: true }))
      .then(() => todo());
  });
});
