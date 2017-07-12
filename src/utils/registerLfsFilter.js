// import NodeGit from 'nodegit';
import * as R from 'ramda';
import { apply } from '../applyCallback';
import { check } from '../checkCallback';
import { initialize } from '../initializeCallback';

const _getLfs = R.propOr({}, 'LFS');
const _setLfs = R.assoc('LFS');

const _setLfsFlag = R.assoc('isLfsRegistered');
const _Lfs = R.lens(_getLfs, _setLfsFlag);

/**
 * Wrapper to register nodegit lfs filter and append status to LFS in nodegit
 * @param {NodeGit} nodegit
 * @return Promise
 */
const register = nodegit => new Promise((resolve, reject) => {
  if (nodegit.FilterRegistry) {
    nodegit.FilterRegistry.register('nodegit_lfs', {
      apply,
      check,
      initialize,
    }, 0).then((result) => {
      const LFS = R.view(_Lfs, nodegit);
      const registerResult = R.set(_Lfs, result === 0, LFS);
      resolve(_setLfs(registerResult, nodegit));
    });
  } else {
    reject(new Error('Error: pass valid NodeGit object to register LFS filter'));
  }
});

export default register;
