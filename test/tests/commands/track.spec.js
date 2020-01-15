import NodeGit from 'nodegit'; // eslint-disable-line import/no-unresolved
import path from 'path';
import { todo } from '../../utils';
import LFS from '../../../build/src';
import track from '../../../build/src/commands/track';

describe('Track', () => {
  it('does generate track response', () => {
    const workdirPath = path.resolve(__dirname, '..', '..', 'repos', 'lfs-test-repository');
    const NodeGitLFS = LFS(NodeGit);

    return NodeGitLFS.Repository.open(workdirPath)
      .then((repo) => track(repo, ['*.png', '*.dmg']))
      .then(() => todo());
  });
});
