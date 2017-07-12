// import NodeGit from 'nodegit';
import initialize from './initialize';
import register from './utils/registerLfsFilter';
import unregister from './utils/unregisterLfsFilter';

const LFS = {
  initialize,
};
// attach all methods related to LFS here
const _setLfsUnregister = (value, object) => R.assoc('unregister', value, object);
const _LfsWithUnregister = _setLfsUnregister(unregister, LFS);
// NodeGitLfs.LFS = LFS;

// export final object
module.exports = (nodegit) => {
  // TODO: NodeGit check
  const _NodeGit = nodegit;
  _NodeGit.LFS = _LfsWithUnregister;
  return register(_NodeGit).catch(err => console.log('error: ', err));
};
