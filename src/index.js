import initialize from './initialize';
import register from './utils/registerLfsFilter';

const LFS = {
  initialize,
};

module.exports = (ng) => {
  // TODO: NodeGit check
  const _NodeGit = ng;
  _NodeGit.LFS = LFS;
  return register(_NodeGit).then((result) => {
    console.info('Registering LFS Filter: ', result.LFS);
    module.exports = result;
    return result;
  }).catch(err => console.log('error: ', err));
};
