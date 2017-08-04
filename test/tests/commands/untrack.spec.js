import NodeGit from 'nodegit';
import path from 'path';
import { default as LFS } from '../../../build/src';
import track from '../../../build/src/commands/track';
import untrack from '../../../build/src/commands/untrack';

//eslint-disable-next-line
describe('Untrack', function() {
  //eslint-disable-next-line
  it('does generate untrack response', function() {
    const workdirPath = path.join(__dirname, '../../repos/workdir');
    const NodeGitLFS = LFS(NodeGit);
    //eslint-disable-next-line
    let repository;
    return NodeGitLFS.Repository.open(workdirPath)
      .then((repo) => {
        repository = repo;
        return track(repo, ['*.png', '*.dmg', '*.txt', '*.a']);
      })
      .then(() => untrack(repository, ['*.dmg', '*.a']))
      .then(response => console.log(response));
  });
});
