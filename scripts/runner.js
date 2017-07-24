/* global before */
const path = require('path');
const promisify = require('promisify-node');
const exec = require('../build/src/utils/execHelpers').exec;
const git = require('../build/src/utils/lfsCommands').git;

const fse = promisify('fs-extra');
const local = path.join.bind(path, __dirname);
const testRepoPath = local('..', 'test', 'repos');
const workdirPath = local('..', 'test', 'repos', 'workdir');
const emptyrepoPath = local('..', 'test', 'repos', 'empty');
const homePath = local('..', 'test', 'home');

console.log(testRepoPath);
console.log(workdirPath);

// TODO: hook this script up in mocha

before(() => {
  const url = 'https://github.com/nodegit/test';
  return fse.remove(testRepoPath)
    .then(() => fse.remove(homePath))
    .then(() => fse.mkdir(local('repos')))
    .then(() => git(`init ${emptyrepoPath}`))
    .then(() => git(`clone ${url} ${workdirPath}`))
    .then(() => exec('git checkout rev-walk', { cwd: workdirPath }))
    .then(() => exec('git checkout checkout-test', { cwd: workdirPath }))
    .then(() => exec('git checkout master', { cwd: workdirPath }))
    .then(() => fse.mkdir(homePath))
    .then(() => fse.writeFile(path.join(homePath, '.gitconfig'),
        '[user]\n  name = John Doe\n  email = johndoe@example.com'))
    .catch(err => console.log('Error initializing test suite\n', err));
});
