import NodeGit from 'nodegit'; // eslint-disable-line import/no-unresolved
import path from 'path';
import { todo } from '../../utils';
import LFS from '../../../build/src';
import track from '../../../build/src/commands/track';
import untrack from '../../../build/src/commands/untrack';

describe('Untrack', () => {
  it('does generate untrack response', () => {
    const workdirPath = path.resolve(__dirname, '..', '..', 'repos', 'lfs-test-repository');
    const NodeGitLFS = LFS(NodeGit);
    let repository;
    return NodeGitLFS.Repository.open(workdirPath)
      .then((repo) => {
        repository = repo;
        return track(repo, ['*.png', '*.dmg', '*.txt', '*.a']);
      })
      .then(() => untrack(repository, ['*.dmg', '*.a']))
      .then(() => todo());
  });
});
