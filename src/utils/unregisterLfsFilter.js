import * as R from 'ramda';

const _getLfs = R.propOr({}, 'LFS');
const _setLfsFlag = R.assoc('isLfsRegistered');
const _Lfs = R.lens(_getLfs, _setLfsFlag);

const _setLfs = R.assoc('LFS');

// unregister needs the nodegit object to unregister LFS filters
// NodeGitLFS.LFS.unregister(NodeGitLFS);

/**
 * Wrapper to unregister nodegit LFS filter and append status to NodeGit module
 * @param {NodeGit} nodegit 
 * @return Promise
 */
const unregister = nodegit => new Promise((resolve, reject) => {
  if (nodegit.FilterRegistry) {
    nodegit.FilterRegistry.unregister('nodegit_lfs')
        .then((result) => {
          const LFS = R.view(_Lfs, nodegit);
          const unregisterResult = R.set(_Lfs, result !== 0, LFS);
          resolve(_setLfs(unregisterResult, nodegit));
        });
  } else {
    reject(new Error('Error: pass valid NodeGit object to unregister LFS filter'));
  }
});

export default unregister;
