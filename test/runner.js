const fse = require('fs-extra');
const path = require('path');
const NodeGit = require('nodegit');
const LFS = require('../build/src');

const exec = require('../build/src/utils/execHelper').default;
const git = require('../build/src/commands/lfsCommands').core.git;

const testLFSServer = require('./server/server');

const testReposPath = path.join(__dirname, 'repos');
const lfsRepoPath = path.join(testReposPath, 'lfs-test-repository');
const emptyRepoPath = path.join(testReposPath, 'empty');

before(function () { // eslint-disable-line prefer-arrow-callback
  this.timeout(30000);

  const testRepoUrl = 'https://github.com/jgrosso/nodegit-lfs-test-repo';
  return testLFSServer.start()
    .then(() => fse.remove(testReposPath))
    .then(() => fse.mkdir(testReposPath))
    .then(() => fse.mkdir(lfsRepoPath))
    .then(() => fse.mkdir(emptyRepoPath))
    .then(() => git(`init ${emptyRepoPath}`))
    .then(() => git(`clone ${testRepoUrl} ${lfsRepoPath}`, {
      env: {
        GIT_SSL_NO_VERIFY: 1
      }
    }))
    .then(() => fse.appendFile(
      path.join(lfsRepoPath, '.git', 'config'),
`[http]
  sslverify = false`
    ))
    .catch((err) => { throw new Error(err); });
});

beforeEach(() => {
  return exec('git clean -xdf && git reset --hard', null, { cwd: lfsRepoPath })
    .then(() => exec('git clean -xdff', null, { cwd: emptyRepoPath }));
});

after(() => {
  testLFSServer.stop();
});

afterEach(() => {
  const NodeGitLFS = LFS(NodeGit);
  return NodeGitLFS.LFS.unregister()
    .catch((error) => {
      // -3 implies LFS filter was not registered
      if (error.errno !== -3) { throw error; }
    });
});
