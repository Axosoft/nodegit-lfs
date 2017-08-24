import buildApply from './callbacks/apply';
import check from './callbacks/check';
import initialize from './callbacks/initialize';
import { LFS_FILTER_NAME } from './constants';

/**
 * Wrapper to register nodegit LFS filter and append status to LFS in nodegit
 * @return Promise
 */
function register(credentialsCallback) {
  const filter = {
    apply: buildApply(credentialsCallback),
    check,
    initialize,
    attribute: 'filter=lfs',
  };

  return this.NodeGit.FilterRegistry.register(LFS_FILTER_NAME, filter, 0);
}

export default register;
