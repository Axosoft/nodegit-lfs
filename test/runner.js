import chai from 'chai';
import fse from 'fs-extra';
import path from 'path';
import NodeGit from 'nodegit';
import sinonChai from 'sinon-chai';

import {
  core
} from '../build/src/commands/lfsCommands';
import {
  cachedLfsTestRemotePath,
  emptyRepoPath,
  lfsTestRepoPath,
  lfsTestRepoUrl,
  lfsTestRemotePath,
  testReposPath
} from './constants';

import LFS from '../build/src';

import * as testLFSServer from './server/server';

// http://eng.wealthfront.com/2016/11/03/handling-unhandledrejections-in-node-and-the-browser/
process.on('unhandledRejection', (err) => {
  console.error('CAUGHT ERROR:', err); // eslint-disable-line no-console
  process.exit(1);
});

chai.use(sinonChai);

// We cache the test remote to avoid the overhead of re-cloning it before each test.
const cacheLfsTestRemote = () =>
  fse.remove(cachedLfsTestRemotePath)
    .then(() => core.git(`clone ${lfsTestRepoUrl} ${cachedLfsTestRemotePath}`, {
      env: {
        GIT_SSL_NO_VERIFY: 1
      }
    }));

// We have to re-copy the test remote before each test to avoid pollution in pull, fetch, etc. tests
const setupLfsTestRemote = () =>
  fse.remove(lfsTestRemotePath)
    .then(() => fse.copy(cachedLfsTestRemotePath, lfsTestRemotePath));

const setupLfsTestRepo = () =>
  fse.remove(lfsTestRepoPath)
    .then(() => core.git(`clone ${lfsTestRemotePath} ${lfsTestRepoPath}`, {
      env: {
        GIT_SSL_NO_VERIFY: 1
      }
    }))
    .then(() => fse.appendFile(
      path.join(cachedLfsTestRemotePath, '.git', 'config'),
`[http]
  sslverify = false`
    ));

const setupEmptyTestRepo = () =>
  fse.remove(emptyRepoPath)
    .then(() => core.git(`init ${emptyRepoPath}`));

before(function () { // eslint-disable-line prefer-arrow-callback
  this.timeout(30000);

  this.NodeGitLFS = LFS(NodeGit);

  return testLFSServer.start()
    .then(() => fse.remove(testReposPath))
    .then(() => fse.mkdir(testReposPath))
    .then(() => cacheLfsTestRemote());
});

beforeEach(function () {
  const {
    NodeGitLFS
  } = this;

  return NodeGitLFS.LFS.register()
    .then(() => setupEmptyTestRepo())
    .then(() => NodeGitLFS.Repository.open(emptyRepoPath))
    .then((emptyRepo) => {
      this.emptyRepo = emptyRepo;
    })
    .then(() => setupLfsTestRemote())
    .then(() => setupLfsTestRepo())
    .then(() => NodeGitLFS.Repository.open(lfsTestRepoPath))
    .then((lfsTestRepo) => {
      this.lfsTestRepo = lfsTestRepo;
    });
});

after(function () {
  const {
    NodeGitLFS
  } = this;

  testLFSServer.stop();

  return NodeGitLFS.LFS.unregister()
    .catch((error) => {
      // -3 implies LFS filter was not registered
      if (error.errno !== -3) {
        throw error;
      }
    });
});

afterEach(function () {
  const {
    NodeGitLFS
  } = this;

  return NodeGitLFS.LFS.unregister();
});
