import path from 'path';
import NodeGit from 'nodegit';
import {
  createDummyFile,
  todo
} from '../../utils';
import LFS from '../../../build/src';
import track from '../../../build/src/commands/track';

const commitFile = (repo, fileName, commitMessage) => {
  let index;
  let treeOid;
  let parent;

  return repo.refreshIndex()
    .then((indexResult) => {
      index = indexResult;
    })
    .then(() => index.addByPath(fileName))
    .then(() => index.write())
    .then(() => index.writeTree())
    .then((oidResult) => {
      treeOid = oidResult;
      return NodeGit.Reference.nameToId(repo, 'HEAD');
    })
    .then(head => repo.getCommit(head))
    .then((parentResult) => {
      parent = parentResult;
      return NodeGit.Signature.default(repo);
    })
    .then(signatures =>
      repo.createCommit(
        'HEAD',
        signatures,
        signatures,
        commitMessage,
        treeOid,
        [parent]));
};

describe('Apply', () => {
  it('Clean', () => {
    const lfsTestRepoPath = path.resolve(__dirname, '..', '..', 'repos', 'lfs-test-repository');
    const NodeGitLFS = LFS(NodeGit);
    let repository;

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then((repo) => {
        repository = repo;
        return track(repo, ['*.md']);
      })
      .then(() => NodeGitLFS.LFS.register())
      .then(() => createDummyFile(path.join(lfsTestRepoPath, 'big_file_test.md'), 20))
      .then(() => commitFile(repository, 'big_file_test.md', 'LFS Clean Test'))
      .then(() => todo());
  });

  it('Smudge', () => {
    const lfsTestRepoPath = path.resolve(__dirname, '..', '..', 'repos', 'lfs-test-repository');
    const NodeGitLFS = LFS(NodeGit);
    let repository;

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then((repo) => {
        repository = repo;
        return repo;
      })
      .then(() => NodeGitLFS.LFS.register())
      .then(() => createDummyFile(path.join(lfsTestRepoPath, 'big_file_test.txt'), 20))
      .then(() => {
        const opts = {
          checkoutStrategy: NodeGit.Checkout.STRATEGY.FORCE,
        };
        return NodeGit.Checkout.head(repository, opts);
      })
      .then(() => todo());
  });
});
