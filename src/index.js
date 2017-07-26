// import NodeGit from 'nodegit';
import * as R from 'ramda';
import initialize from './initialize';
import register from './utils/registerLfsFilter';
import unregister from './utils/unregisterLfsFilter';
import { addAttribute } from './utils/addAttributeToGitAttributes';
import { core } from './utils/lfsCommands';

const LFS = {
  addAttribute,
  core,
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
  return register(_NodeGit)
    .then((NodeGitLFS) => {
      module.exports = NodeGitLFS;
      return NodeGitLFS;
    })
    .catch(err => console.log('Error registering LFS filter for NodeGit\n\n', err));
};
