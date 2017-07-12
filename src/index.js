import NodeGit from 'nodegit';
import initialize from './initialize';
import register from './utils/registerLfsFilter';
import * as R from 'ramda';

/* const _getNodeGit = R.propOr({}, 'LFS');
const _setLFS = R.assoc('isLfsRegistered');
const _LFS = R.lens(_getLFS, _setLFS); */
let NodeGitLfs = NodeGit;

const LFS = {
  initialize,
};

NodeGitLfs.LFS = LFS;

async function registerLfsFilter() {
  NodeGitLfs = await register(NodeGitLfs);
  console.log('now: ', NodeGitLfs);
}
/* 
const register(NodeGitLfs).then((result) => {
  console.info('Registering LFS Filter: ', result.LFS);
  return result;
}).catch(err => console.log("error: ", err)); */

export default NodeGitLFS;
