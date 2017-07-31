import NodeGit from 'nodegit';
import path from 'path';
import { default as LFS } from '../../../build/src';
import version from '../../../build/src/commands/version';

//eslint-disable-next-line
describe('Version', function() {
  //eslint-disable-next-line
  it('does provide version number', function() {
    const workdirPath = path.join(__dirname, '../../repos/workdir');
    const NodeGitLFS = LFS(NodeGit);

    return NodeGitLFS.Repository.open(workdirPath)
      .then(repo => version(repo))
      .then(response => console.log(response));
  });
});
