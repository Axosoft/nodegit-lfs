const NodeGit = require('nodegit');
const initialize = require('./initialize');

const LFS = {
  initialize,
};

NodeGit.LFS = LFS;

NodeGit.FilterRegistry.register('test', {
  apply: () => 0,
  check: () => 0,
}, 0);

module.exports = NodeGit;
