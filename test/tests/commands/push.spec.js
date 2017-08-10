import path from 'path';
import NodeGit from 'nodegit';
import { default as LFS } from '../../../build/src';
import { exec } from '../../../build/src/utils/execHelpers';

describe('Push', function () {
  this.timeout(5000);

  it('should generate push repsonse', () => {
    const workdirPath = path.join(__dirname, '../../repos/workdir');
    const NodeGitLFS = LFS(NodeGit);

    return exec('base64 /dev/urandom | head -c 20 > test_file.txt', { cwd: workdirPath })
      .then(() => exec('git add test_file.txt', { cwd: workdirPath }))
      .then(() => exec('git commit -m "LFS: push unit test"', { cwd: workdirPath }))
      .then(() => NodeGitLFS.Repository.open(workdirPath))
      .then(repo => NodeGitLFS.LFS.push(repo, 'origin', 'test'))
      .then(response => console.log('Response: ', response));
  });
});
