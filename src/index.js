import initialize from './initialize';
import register from './register';
import unregister from './unregister';
import { core } from './commands/lfsCommands';
import checkout from './commands/checkout';
import push from './commands/push';
import track from './commands/track';
import version from './commands/version';

function LFS(nodegit) {
  this.NodeGit = nodegit;
}

// LFS.prototype.constructor = LFS;
LFS.prototype = {
  core,
  checkout,
  initialize,
  track,
  push,
  version,
};

// LFS.prototype.push = push;

module.exports = (nodegit) => {
  const _NodeGit = nodegit;

  LFS.prototype.register = register(_NodeGit);
  LFS.prototype.unregister = unregister(_NodeGit);
  // LFS.prototype.NodeGit = _NodeGit;

  Object.getPrototypeOf(_NodeGit).LFS = new LFS(_NodeGit);

  module.exports = _NodeGit;
  return _NodeGit;
};
