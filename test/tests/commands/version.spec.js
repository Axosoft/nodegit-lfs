import {
  lfsTestRepoPath
} from '../../constants';

import {
  todo
} from '../../utils';

import version from '../../../build/src/commands/version';

describe('Version', () => {
  it('does provide version number', function () {
    const {
      NodeGitLFS
    } = this;

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then(repo => version(repo))
      .then(() => todo());
  });
});
