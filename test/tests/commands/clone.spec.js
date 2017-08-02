import path from 'path';
import NodeGit from 'nodegit';
import { default as LFS } from '../../../build/src';

//eslint-disable-next-line
describe('Clone', function() {
  this.timeout(5000);
  //eslint-disable-next-line
  it.only('should generate clone repsonse', function() {
    const emptyrepoPath = path.join(__dirname, '../../repos/empty');
    const NodeGitLFS = LFS(NodeGit);
    const url = 'https://github.com/mohseenrm/nodegit-lfs-test-repo';

    return NodeGitLFS.LFS.clone(emptyrepoPath, `-b test ${url}`)
      .then(response => console.log('Response: ', response));
  });
});
