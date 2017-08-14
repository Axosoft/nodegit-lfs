import path from 'path';
import NodeGit from 'nodegit';
import { todo } from '../../utils';
import LFS from '../../../build/src';

describe('Clone', () => {
  it('should generate clone repsonse', () => {
    const emptyrepoPath = path.join(__dirname, '../../repos/empty');
    const NodeGitLFS = LFS(NodeGit);
    const url = 'https://github.com/mohseenrm/nodegit-lfs-test-repo';

    return NodeGitLFS.LFS.clone(url, emptyrepoPath, { branch: 'test' })
      .then(() => todo());
  });
});
