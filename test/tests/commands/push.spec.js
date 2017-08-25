import path from 'path';

import {
  lfsTestRepoPath
} from '../../constants';
import {
  createDummyFile,
  todo
} from '../../utils';

import exec from '../../../build/src/utils/execHelper';

describe('Push', () => {
  it('should generate push response', function () {
    const {
      NodeGitLFS
    } = this;

    return createDummyFile(path.join(lfsTestRepoPath, 'test_file.txt'), 20)
      .then(() => exec('git add test_file.txt', { cwd: lfsTestRepoPath }))
      .then(() => exec('git commit -m "LFS: push unit test"', { cwd: lfsTestRepoPath }))
      .then(() => NodeGitLFS.Repository.open(lfsTestRepoPath))
      .then(repo => NodeGitLFS.LFS.push(repo, 'origin', 'test'))
      .then(() => todo());
  });
}).timeout(5000);
