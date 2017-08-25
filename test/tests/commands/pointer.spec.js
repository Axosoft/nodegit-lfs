import path from 'path';

import {
  lfsTestRepoPath
} from '../../constants';
import {
  todo
} from '../../utils';

import pointer from '../../../build/src/commands/pointer';

describe('Pointer', () => {
  it('does generate pointer response', function () {
    const {
      NodeGitLFS
    } = this;

    const packageJson = path.join(lfsTestRepoPath, 'package.json');

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then(repo => pointer(repo, packageJson))
      .then(() => todo());
  });
});
