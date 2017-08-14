const fse = require('fs-extra');
const path = require('path');
const NodeGit = require('nodegit');
const LFS = require('../build/src');

const exec = require('../build/src/utils/execHelpers').exec;
const gitExec = require('../build/src/commands/lfsCommands').core.git;

const testLFSServer = require('./server/server');

const testReposPath = path.join('test', 'repos');
const workdirPath = path.join(testReposPath, 'workdir');
const emptyrepoPath = path.join(testReposPath, 'empty');

const git = (...args) =>
  gitExec(...args)
    .then(({ stderr }) =>
      stderr
        ? Promise.reject(stderr)
        : Promise.resolve());

before(function () { // eslint-disable-line prefer-arrow-callback
  this.timeout(300000);

  const testRepoUrl = 'https://github.com/jgrosso/nodegit-lfs-test-repo';
  return testLFSServer.start()
    .then(() => fse.remove(testReposPath))
    .then(() => fse.mkdir(testReposPath))
    .then(() => fse.mkdir(workdirPath))
    .then(() => fse.mkdir(emptyrepoPath))
    .then(() => git(`init ${emptyrepoPath}`))
    .then(() => git(`clone ${testRepoUrl} ${workdirPath}`, {
      env: {
        GIT_SSL_NO_VERIFY: 1
      }
    }))
    .then(() => fse.appendFile(
      path.join(workdirPath, '.git', 'config'),
`[http]
  sslverify = false`
    ))
    .catch((err) => { throw new Error(err); });
});

beforeEach(() => {
  return exec('git clean -xdf && git reset --hard', { cwd: workdirPath })
    .then(() => exec('git clean -xdff', { cwd: emptyrepoPath }));
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
