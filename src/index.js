import initialize from './initialize';
import register from './register';
import unregister from './unregister';
import { core } from './commands/lfsCommands';
import { loadGitattributeFiltersFromRepo } from './helpers';
import checkout from './commands/checkout';
import push from './commands/push';
import track from './commands/track';
import version from './commands/version';
import fetch from './commands/fetch';
import prune from './commands/prune';
import list from './commands/ls';
import testPointer from './commands/pointer';
import pull from './commands/pull';
import clone from './commands/clone';


function LFS(nodegit) {
  this.NodeGit = nodegit;
}

// LFS.prototype.constructor = LFS;
LFS.prototype = {
  core,
  checkout,
  clone,
  fetch,
  filters: loadGitattributeFiltersFromRepo,
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
};

// LFS.prototype.push = push;

module.exports = (nodegit) => {
  const _NodeGit = nodegit;

  Object.getPrototypeOf(_NodeGit).LFS = new LFS(_NodeGit);

  module.exports = _NodeGit;
  return _NodeGit;
};
