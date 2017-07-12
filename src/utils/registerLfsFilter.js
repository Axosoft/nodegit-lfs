import NodeGit from 'nodegit';
import * as R from 'ramda';

const _getLfs = R.propOr({}, 'LFS');
const _setLfsFlag = R.assoc('isLfsRegistered');
const _Lfs = R.lens(_getLfs, _setLfsFlag);

const _setLfs = R.assoc('LFS');

const register = (ng) => new Promise((resolve, reject) => {
  if(ng.FilterRegistry){
    ng.FilterRegistry.register('nodegit_lfs', {
      apply: () => 0,
      check: () => 0,
    }, 0).then((result) => {
      const LFS = R.view(_Lfs, ng);
      const registerResult = R.set(_Lfs, result === 0, LFS);
      resolve(_setLfs(registerResult, ng));
    });
  } else {
    reject(new Error('Error: pass valid NodeGit object to register'));
  }
});

export default register;