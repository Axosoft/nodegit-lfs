import path from 'path';
import NodeGit from 'nodegit';
import { todo } from '../../utils';
import LFS from '../../../build/src';
import exec from '../../../build/src/utils/execHelper';

describe('Push', () => {
  it('should generate push response', () => {
    const workdirPath = path.resolve(__dirname, '..', '..', 'repos', 'lfs-test-repository');
    const NodeGitLFS = LFS(NodeGit);

    return exec('base64 /dev/urandom | head -c 20 > test_file.txt', { cwd: workdirPath })
      .then(() => exec('git add test_file.txt', { cwd: workdirPath }))
      .then(() => exec('git commit -m "LFS: push unit test"', { cwd: workdirPath }))
      .then(() => NodeGitLFS.Repository.open(workdirPath))
      .then(repo => NodeGitLFS.LFS.push(repo, 'origin', 'test'))
      .then(() => todo());
  });
}).timeout(5000);
