import {
  expect
} from 'chai';
import fse from 'fs-extra';
import NodeGit from 'nodegit';
import path from 'path';

import {
  createDummyFile,
  getFilePointer,
  todo
} from '../../utils';

import LFS from '../../../build/src';
import trackCommand from '../../../build/src/commands/track';

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

const track = (repo, globs) => {
  let index;

  return trackCommand(repo, globs)
    .then(() => repo.index())
    .then((_index) => {
      index = _index;
      return index.addByPath('.gitattributes');
    })
    .then(() => index.write());
};

describe('Apply', () => {
  it.only('Clean', () => {
    const lfsTestRepoPath = path.resolve(__dirname, '..', '..', 'repos', 'lfs-test-repository');
    const NodeGitLFS = LFS(NodeGit);
    let repository;
    let dummyContents;

    return NodeGitLFS.Repository.open(lfsTestRepoPath)
      .then((repo) => {
        repository = repo;
        return track(repo, ['big_file_test.md']);
      })
      .then(() => NodeGitLFS.LFS.register())
      .then(() => createDummyFile(path.join(lfsTestRepoPath, 'big_file_test.md'), 20))
      .then((contents) => {
        dummyContents = contents;
      })
      .then(() => commitFile(repository, 'big_file_test.md', 'LFS Clean Test'))
      .then(() => fse.readFile(path.join(lfsTestRepoPath, 'big_file_test.md'), 'utf8'))
      .then((contents) => {
        expect(contents).to.equal(dummyContents);
      })
      .then(() => getFilePointer(lfsTestRepoPath, 'big_file_test.md'))
      .then((pointer) => {
        expect(pointer).to.have.string('size 20');
      });
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
