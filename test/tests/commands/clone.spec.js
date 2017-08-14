import path from 'path';
import NodeGit from 'nodegit';
import { todo } from '../../utils';
import { default as LFS } from '../../../build/src';

describe('Clone', () => {
  beforeEach(function () { // eslint-disable-line prefer-arrow-callback
    this.timeout(5000);
  });

  it('should generate clone repsonse', () => {
    const emptyrepoPath = path.join(__dirname, '../../repos/empty');
    const NodeGitLFS = LFS(NodeGit);
    const url = 'https://github.com/mohseenrm/nodegit-lfs-test-repo';

    return NodeGitLFS.LFS.clone(url, emptyrepoPath, { branch: 'test' })
      .then(() => todo());
  });
});
