import chai from 'chai';
import fse from 'fs-extra';
import path from 'path';
import NodeGit from 'nodegit';
import sinonChai from 'sinon-chai';

import {
  core
} from '../build/src/commands/lfsCommands';
import {
  emptyRepoPath,
  lfsTestRepoPath,
  lfsTestRepoUrl,
  testReposPath
} from './constants';

import LFS from '../build/src';
import exec from '../build/src/utils/execHelper';

import * as testLFSServer from './server/server';

before(function () { // eslint-disable-line prefer-arrow-callback
  this.timeout(30000);

  this.NodeGitLFS = LFS(NodeGit);

  return testLFSServer.start()
    .then(() => fse.remove(testReposPath))
    .then(() => fse.mkdir(testReposPath))
    .then(() => fse.mkdir(lfsTestRepoPath))
    .then(() => fse.mkdir(emptyRepoPath))
    .then(() => core.git(`init ${emptyRepoPath}`))
    .then(() => core.git(`clone ${lfsTestRepoUrl} ${lfsTestRepoPath}`, {
      env: {
        GIT_SSL_NO_VERIFY: 1
      }
    }))
    .then(() => fse.appendFile(
      path.join(lfsTestRepoPath, '.git', 'config'),
`[http]
  sslverify = false`
    ))
    .catch((err) => {
      throw new Error(err);
    });
});

beforeEach(() =>
  exec('git clean -xdf && git reset --hard', { cwd: lfsTestRepoPath })
    .then(() => exec('git clean -xdff', { cwd: emptyRepoPath })));

after(() => {
  testLFSServer.stop();
});

afterEach(function () {
  return this.NodeGitLFS.LFS.unregister()
    .catch((error) => {
      // -3 implies LFS filter was not registered
      if (error.errno !== -3) {
        throw error;
      }
    });
});
