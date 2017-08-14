import NodeGit from 'nodegit';
import path from 'path';
import { todo } from '../../utils';
import { default as LFS } from '../../../build/src';
import pointer from '../../../build/src/commands/pointer';

describe('Pointer', function () {
  it('does generate pointer response', function () {
    const workdirPath = path.join(__dirname, '../../repos/workdir');
    const NodeGitLFS = LFS(NodeGit);

    const packageJson = path.join(__dirname, '../../repos/workdir/package.json');

    return NodeGitLFS.Repository.open(workdirPath)
      .then(repo => pointer(repo, packageJson))
      .then(() => todo());
  });
});
