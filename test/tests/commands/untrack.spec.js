import NodeGit from 'nodegit';
import path from 'path';
import { todo } from '../../utils';
import { default as LFS } from '../../../build/src';
import track from '../../../build/src/commands/track';
import untrack from '../../../build/src/commands/untrack';

describe('Untrack', () => {
  it('does generate untrack response', () => {
    const workdirPath = path.join(__dirname, '../../repos/workdir');
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
