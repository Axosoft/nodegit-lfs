import {
  expect
} from 'chai';
import fse from 'fs-extra';
import path from 'path';

import {
  lfsTestRepoPath
} from '../../constants';
import {
  createDummyFile,
  getFilePointer
} from '../../utils';

import trackCommand from '../../../build/src/commands/track';

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

describe('apply', () => {
  beforeEach(function () {
    const {
      NodeGitLFS
    } = this;

    const testFileSize = 20;
    this.testFileName = 'bigFileTest.md';

    this.commitFile = (repo, fileName, commitMessage) => {
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
          return NodeGitLFS.Reference.nameToId(repo, 'HEAD');
        })
        .then(head => repo.getCommit(head))
        .then((parentResult) => {
          parent = parentResult;
          return NodeGitLFS.Signature.default(repo);
        })
        .then(signatures =>
          repo.createCommit(
            'HEAD',
            signatures,
            signatures,
            commitMessage,
            treeOid,
            [parent]
          ));
    };

    this.trackTestFile = () =>
      track(this.repo, [this.testFileName])
        .then(() => createDummyFile(
          path.join(lfsTestRepoPath, this.testFileName),
          testFileSize
        ))
        .then((contents) => {
          this.contents = contents;
        })
        .then(() => this.commitFile(this.repo, this.testFileName, 'LFS filter tests'));

    this.verifyTestFileTracked = () =>
      fse.readFile(path.join(lfsTestRepoPath, this.testFileName), 'utf8')
      .then((contents) => {
        expect(contents).to.equal(this.contents);
      })
      .then(() => getFilePointer(lfsTestRepoPath, this.testFileName))
      .then((pointer) => {
        expect(pointer).to.have.string(`size ${testFileSize}`);
      });

    return NodeGitLFS.LFS.register()
      .then(() => NodeGitLFS.Repository.open(lfsTestRepoPath))
      .then((repo) => {
        this.repo = repo;
      });
  });

  it('Clean', function () {
    const {
      trackTestFile,
      verifyTestFileTracked
    } = this;

    return trackTestFile()
      .then(() => verifyTestFileTracked());
  });

  it('Smudge', function () {
    const {
      NodeGitLFS,
      repo,
      testFileName,
      trackTestFile,
      verifyTestFileTracked
    } = this;

    return trackTestFile()
      .then(() => createDummyFile(path.join(lfsTestRepoPath, testFileName), 5))
      .then(() => NodeGitLFS.Checkout.head(repo, {
        checkoutStrategy: NodeGitLFS.Checkout.STRATEGY.FORCE
      }))
      .then(() => verifyTestFileTracked());
  });
});
