import path from 'path';
import NodeGit from 'nodegit';
import { default as LFS } from '../../../build/src';

describe('Clone', function () {
  this.timeout(5000);

  it('should generate clone repsonse', function () {
    const emptyrepoPath = path.join(__dirname, '../../repos/empty');
    const NodeGitLFS = LFS(NodeGit);
    const url = 'https://github.com/mohseenrm/nodegit-lfs-test-repo';

    return NodeGitLFS.LFS.clone(url, emptyrepoPath, { branch: 'test' })
      .then(response => console.log('Response: ', response));
  });
});
