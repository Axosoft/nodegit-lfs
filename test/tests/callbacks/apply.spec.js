import {
  expect
} from 'chai';
import fse from 'fs-extra';
import NodeGit from 'nodegit';
import path from 'path';

import {
  createDummyFile,
  getFilePointer
} from '../../utils';

import LFS from '../../../build/src';
import trackCommand from '../../../build/src/commands/track';

const NodeGitLFS = LFS(NodeGit);

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
  beforeEach(function () {
    const testFileSize = 20;

    this.lfsTestRepoPath = path.resolve(__dirname, '..', '..', 'repos', 'lfs-test-repository');
    this.testFileName = 'bigFileTest.md';

    this.verifyTestFileTracked = () =>
      fse.readFile(path.join(this.lfsTestRepoPath, this.testFileName), 'utf8')
        .then((contents) => {
          expect(contents).to.equal(this.dummyContents);
        })
        .then(() => getFilePointer(this.lfsTestRepoPath, this.testFileName))
        .then((pointer) => {
          expect(pointer).to.have.string(`size ${testFileSize}`);
        });

    this.trackTestFile = () =>
      NodeGitLFS.Repository.open(this.lfsTestRepoPath)
        .then((repo) => {
          this.repository = repo;
          return track(repo, [this.testFileName]);
        })
        .then(() => NodeGitLFS.LFS.register())
        .then(() => createDummyFile(
          path.join(this.lfsTestRepoPath, this.testFileName),
          testFileSize
        ))
        .then((contents) => {
          this.dummyContents = contents;
        })
        .then(() => commitFile(this.repository, this.testFileName, 'LFS filter tests'));
  });

  it('Clean', function () {
    return this.trackTestFile()
      .then(() => this.verifyTestFileTracked());
  });

  it('Smudge', function () {
    return this.trackTestFile()
      .then(() => createDummyFile(path.join(this.lfsTestRepoPath, this.testFileName), 5))
      .then(() => NodeGit.Checkout.head(this.repository, {
        checkoutStrategy: NodeGit.Checkout.STRATEGY.FORCE
      }))
      .then(() => this.verifyTestFileTracked());
  });
});
