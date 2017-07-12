// import NodeGit from 'nodegit';
import initialize from './initialize';
import register from './utils/registerLfsFilter';

// let NodeGitLfs = NodeGit;

const LFS = {
  initialize,
};

// NodeGitLfs.LFS = LFS;

/* const NodeGitLFS = (ng) => {
  const _NodeGit = ng;
  _NodeGit.LFS = LFS;
  register(_NodeGit).then((result) => {
    console.info('Registering LFS Filter: ', result.LFS);
    return result;
  }).catch(err => console.log('error: ', err));
};*/

module.exports = (ng) => {
  // TODO: NodeGit check
  const _NodeGit = ng;
  _NodeGit.LFS = LFS;
  return register(_NodeGit).then((result) => {
    console.info('Registering LFS Filter: ', result.LFS);
    return result;
  }).catch(err => console.log('error: ', err));
};
