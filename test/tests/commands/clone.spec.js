import {
  expect
} from 'chai';
import fse from 'fs-extra';
import path from 'path';
import sinon from 'sinon';

import {
  lfsTestRemotePath,
  testReposPath
} from '../../constants';
import {
  populateRemoteBranch
} from '../../server/server';
import {
  fail,
  todo
} from '../../utils';

import {
  BAD_REGEX_PARSE_RESULT
} from '../../../build/src/constants';
import {
  core
} from '../../../build/src/commands/lfsCommands';

const tempRepoPath = path.join(testReposPath, 'nodegit-lfs-test-repo');

describe('Clone', () => {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();

    return fse.remove(tempRepoPath);
  });

  afterEach(function () {
    const {
      sandbox
    } = this;

    sandbox.restore();
  });

  it('should clone a repo', function () {
    const {
      NodeGitLFS
    } = this;

    // We are testing the returned value in the specific branch test, because the test repo's
    // `master` branch doesn't have LFS enabled by default
    return NodeGitLFS.LFS.clone(
      `${lfsTestRemotePath} ${tempRepoPath}`,
      testReposPath,
      {
        env: {
          GIT_SSL_NO_VERIFY: 1
        }
      }
    )
      .then(() => NodeGitLFS.Repository.open(tempRepoPath));
  });

  it('should clone a repo at a specific branch', function () {
    const {
      NodeGitLFS
    } = this;

    const branchName = 'other-branch';

    return populateRemoteBranch(branchName)
      .then(() => NodeGitLFS.LFS.clone(
        // https://github.com/git-lfs/git-lfs/issues/2523
        `${lfsTestRemotePath} ${tempRepoPath}`,
        testReposPath,
        {
          branch: branchName,
          env: {
            GIT_SSL_NO_VERIFY: 1
          }
        }
      ))
      .then((result) => {
        expect(result.clone).to.eql({
          total_bytes: '24 B',
          total_bytes_cloned: '24 B',
          total_bytes_skipped: BAD_REGEX_PARSE_RESULT,
          total_files_cloned: '1',
          total_files_skipped: BAD_REGEX_PARSE_RESULT
        });
      })
        .then(() => NodeGitLFS.Repository.open(tempRepoPath))
        .then(repo => repo.getCurrentBranch())
        .then((branch) => {
          expect(branch.shorthand()).to.equal(branchName);
        });
  }).timeout(10000);

  it('should allow the environment to be customized', function () {
    const {
      NodeGitLFS,
      sandbox
    } = this;

    const cloneStub = sandbox.stub(core, 'clone').returns(Promise.resolve({}));

    NodeGitLFS.LFS.clone(
      lfsTestRemotePath,
      testReposPath,
      {
        env: {
          foo: 'bar'
        }
      }
    );
    expect(cloneStub).to.have.been.calledWithMatch(`${lfsTestRemotePath} `, {
      cwd: testReposPath,
      env: {
        foo: 'bar'
      }
    });
  });

  it('should pass a callback through into `spawn`', function () {
    const {
      NodeGitLFS,
      sandbox
    } = this;

    const callback = () => { };

    const cloneStub = sandbox.stub(core, 'clone').returns(Promise.resolve({}));

    NodeGitLFS.LFS.clone(lfsTestRemotePath, testReposPath, { callback });
    expect(cloneStub.firstCall.args[2]).to.equal(callback);
  });

  it('requires the repository URL to be passed in', function () {
    const {
      NodeGitLFS
    } = this;

    try {
      NodeGitLFS.LFS.clone(
        null,
        testReposPath
      );

      fail('This should throw an error!');
    } catch (e) {
      expect(e.message).to.equal('A valid URL and working directory are required');
    }
  });

  it('requires the directory to clone into to be passed in', function () {
    const {
      NodeGitLFS
    } = this;

    try {
      NodeGitLFS.LFS.clone(
        lfsTestRemotePath,
        null
      );

      fail('This should throw an error!');
    } catch (e) {
      expect(e.message).to.equal('A valid URL and working directory are required');
    }
  });

  it('should return an appropriate result on error', todo);
});
