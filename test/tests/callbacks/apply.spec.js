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
      lfsTestRepo,
      NodeGitLFS
    } = this;

    const testFileSize = 2000000;
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
      track(lfsTestRepo, [this.testFileName])
        .then(() => createDummyFile(
          path.join(lfsTestRepoPath, this.testFileName),
          testFileSize
        ))
        .then((contents) => {
          this.contents = contents;
        })
        .then(() => this.commitFile(lfsTestRepo, this.testFileName, 'LFS filter tests'));

    this.verifyTestFileTracked = () =>
      fse.readFile(path.join(lfsTestRepoPath, this.testFileName), 'utf8')
      .then((contents) => {
        expect(contents).to.equal(this.contents);
      })
      .then(() => getFilePointer(lfsTestRepoPath, this.testFileName))
      .then((pointer) => {
        expect(pointer).to.have.string(`size ${testFileSize}`);
      });
  });

  describe('clean', () => {
    it('cleans LFS-tracked files', function () {
      const {
      trackTestFile,
        verifyTestFileTracked
    } = this;

      return trackTestFile()
        .then(() => verifyTestFileTracked());
    });
  });

  describe('smudge', () => {
    it('smudges LFS blobs', function () {
      const {
        NodeGitLFS,
        lfsTestRepo,
        testFileName,
        trackTestFile,
        verifyTestFileTracked
      } = this;

      return trackTestFile()
        .then(() => createDummyFile(path.join(lfsTestRepoPath, testFileName), 5))
        .then(() => NodeGitLFS.Checkout.head(lfsTestRepo, {
          checkoutStrategy: NodeGitLFS.Checkout.STRATEGY.FORCE
        }))
        .then(() => verifyTestFileTracked());
    }).timeout(10000);
  });
});
