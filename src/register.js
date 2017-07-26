import { apply } from './callbacks/apply';
import { check } from './callbacks/check';
import { initialize } from './callbacks/initialize';
import { LFS_FILTER_NAME } from './constants';

const filter = {
  apply,
  check,
  initialize,
  attribute: 'filter=lfs',
};

/**
 * Wrapper to register nodegit lfs filter and append status to LFS in nodegit
 * @param {NodeGit} nodegit
 * @return Promise
 */
const register = nodegit => () => nodegit.FilterRegistry.register(LFS_FILTER_NAME, filter, 0);

export default register;
