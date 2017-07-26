import { LFS_FILTER_NAME } from './constants';

/**
 * Wrapper to unregister nodegit LFS filter and append status to NodeGit module
 * @param {NodeGit} nodegit
 * @return Promise
 */
const unregister = nodegit => () => nodegit.FilterRegistry.unregister(LFS_FILTER_NAME);

export default unregister;
