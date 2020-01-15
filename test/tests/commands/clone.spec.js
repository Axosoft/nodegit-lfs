import path from 'path';
import NodeGit from 'nodegit'; // eslint-disable-line import/no-unresolved
import { todo } from '../../utils';
import LFS from '../../../build/src';

describe('Clone', () => {
  it('should generate clone repsonse', () => {
    const emptyRepoPath = path.resolve(__dirname, '..', '..', 'repos', 'empty');
    const NodeGitLFS = LFS(NodeGit);
    const url = 'https://github.com/mohseenrm/nodegit-lfs-test-repo';

    return NodeGitLFS.LFS.clone(url, emptyRepoPath, { branch: 'test' })
      .then(() => todo());
  });
});
