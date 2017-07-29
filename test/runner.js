/* global before */
const fse = require('fs-extra');
const path = require('path');

const exec = require('../build/src/utils/execHelpers').exec;
const git = require('../build/src/commands/lfsCommands').core.git;

const local = path.join.bind(path, __dirname);
const testRepoPath = local('..', 'test', 'repos');
const workdirPath = local('..', 'test', 'repos', 'workdir');
const emptyrepoPath = local('..', 'test', 'repos', 'empty');
const homePath = local('..', 'test', 'home');

/* console.log(emptyrepoPath);
console.log(workdirPath);
console.log(git); */

//eslint-disable-next-line
before(function() {
  this.timeout(40000);
  const url = 'https://github.com/mohseenrm/nodegit-lfs-test-repo';
  return fse.remove(testRepoPath)
    .then(() => fse.remove(homePath))
    .then(() => fse.mkdir(local('repos')))
    .then(() => fse.mkdir(workdirPath))
    .then(() => fse.mkdir(emptyrepoPath))
    .then(() => git(`init ${emptyrepoPath}`))
    .then(() => git(`clone -b test ${url} ${workdirPath}`))
    .then(() => fse.mkdir(homePath))
    .then(() => fse.writeFile(path.join(homePath, '.gitconfig'),
        '[user]\n  name = John Doe\n  email = johndoe@example.com'))
    .catch(err => console.log('Error initializing test suite\n', err));
});

//eslint-disable-next-line
beforeEach(function() {
  this.timeout(4000);
  return exec('git clean -xdf', { cwd: workdirPath })
    .then(() => exec('git checkout test', { cwd: workdirPath }))
    .then(() => exec('git reset --hard', { cwd: workdirPath }))
    .then(() => exec('git clean -xdff', { cwd: emptyrepoPath }));
});
