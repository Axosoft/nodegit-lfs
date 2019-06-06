import initialize from './initialize';
import register from './register';
import unregister from './unregister';
import { core } from './commands/lfsCommands';
import {
  loadGitattributeFiltersFromRepo,
  repoHasLfs
} from './helpers';
import checkout from './commands/checkout';
import push from './commands/push';
import track from './commands/track';
import untrack from './commands/untrack';
import version from './commands/version';
import fetch from './commands/fetch';
import prune from './commands/prune';
import list from './commands/ls';
import testPointer from './commands/pointer';
import pull from './commands/pull';
import clone from './commands/clone';
import {
  setNodeBinaryPath,
  setGitAskPassPath,
  setGitAskPassClientPath
} from './utils/authService';
import { dependencyCheck } from './utils/checkDependencies';
import { setDefaultShellOptions } from './utils/shellOptions';

function LFS(nodegit) {
  this.NodeGit = nodegit;
}

LFS.prototype = {
  core,
  checkout,
  clone,
  dependencyCheck,
  fetch,
  filters: loadGitattributeFiltersFromRepo,
  repoHasLfs,
  initialize,
  list,
  register,
  testPointer,
  track,
  prune,
  pull,
  push,
  version,
  unregister,
  untrack,
};

module.exports = (
  nodegit,
  {
    nodeBinaryPath = process.execPath,
    defaultShellOptions = null,
     // when built, askpass.sh will be two directories above index.js
    gitAskPassPath = require.resolve('../../askpass.sh'),
    gitAskPassClientPath = require.resolve('./utils/GitAskPass')
  }
) => {
  const _NodeGit = nodegit; // eslint-disable-line no-underscore-dangle

  Object.getPrototypeOf(_NodeGit).LFS = new LFS(_NodeGit);

  module.exports = _NodeGit;

  if (nodeBinaryPath) {
    setNodeBinaryPath(nodeBinaryPath);
  }

  if (gitAskPassPath) {
    setGitAskPassPath(gitAskPassPath);
  }

  if (gitAskPassClientPath) {
    setGitAskPassClientPath(gitAskPassClientPath);
  }

  if (defaultShellOptions) {
    setDefaultShellOptions(defaultShellOptions);
  }

  return _NodeGit;
};
