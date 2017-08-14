import NodeGit from 'nodegit';
import path from 'path';
import { todo } from '../../utils';
import { default as LFS } from '../../../build/src';
import ls from '../../../build/src/commands/ls';

describe('ls-files', function () {
  it('does generate ls response', function () {
    const workdirPath = path.join(__dirname, '../../repos/workdir');
    const NodeGitLFS = LFS(NodeGit);

    return NodeGitLFS.Repository.open(workdirPath)
      .then(repo => ls(repo, { long: true }))
      .then(() => todo());
  });
});
