const fse = require('fs-extra');
const path = require('path');
const NodeGit = require('nodegit');
const LFS = require('../build/src');

const exec = require('../build/src/utils/execHelper').default;
const git = require('../build/src/commands/lfsCommands').core.git;

const testLFSServer = require('./server/server');

const testReposPath = path.join(__dirname, 'repos');
before(function () { // eslint-disable-line prefer-arrow-callback
  this.timeout(30000);

  this.NodeGitLFS = LFS(NodeGit);

  this.emptyRepoPath = path.join(testReposPath, 'empty');
  this.lfsTestRepoPath = path.join(testReposPath, 'lfs-test-repository');

  const testRepoUrl = 'https://github.com/jgrosso/nodegit-lfs-test-repo';
  return testLFSServer.start()
    .then(() => fse.remove(testReposPath))
    .then(() => fse.mkdir(testReposPath))
    .then(() => fse.mkdir(this.lfsTestRepoPath))
    .then(() => fse.mkdir(this.emptyRepoPath))
    .then(() => git(`init ${this.emptyRepoPath}`))
    .then(() => git(`clone ${testRepoUrl} ${this.lfsTestRepoPath}`, {
      env: {
        GIT_SSL_NO_VERIFY: 1
      }
    }))
    .then(() => fse.appendFile(
      path.join(this.lfsTestRepoPath, '.git', 'config'),
`[http]
  sslverify = false`
    ))
    .catch((err) => {
      throw new Error(err);
    });
});

beforeEach(function () {
  return exec('git clean -xdf && git reset --hard', { cwd: this.lfsTestRepoPath })
    .then(() => exec('git clean -xdff', { cwd: this.emptyRepoPath }));
});

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
