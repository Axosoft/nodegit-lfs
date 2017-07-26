import initialize from './initialize';
import register from './register';
import unregister from './unregister';

function LFS(nodegit) {
  this.NodeGit = nodegit;
}

LFS.prototype = {
  initialize,
};

module.exports = (nodegit) => {
  const _NodeGit = nodegit;

  LFS.prototype.register = register(_NodeGit);
  LFS.prototype.unregister = unregister(_NodeGit);

  _NodeGit.prototype.LFS = new LFS(_NodeGit);
  module.exports = _NodeGit;
  return _NodeGit;
};
