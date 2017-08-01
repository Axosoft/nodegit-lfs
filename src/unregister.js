import { LFS_FILTER_NAME } from './constants';

/**
 * Wrapper to unregister nodegit LFS filter and append status to NodeGit module
 * @return Promise
 */
function unregister() {
  return this.NodeGit.FilterRegistry.unregister(LFS_FILTER_NAME);
}

export default unregister;
