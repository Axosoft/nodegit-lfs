import spawn from '../utils/spawnHelper';
import exec from '../utils/execHelper';

export const core = {
  checkout: (args = '', options, repoPath, callback) => spawn(`git lfs checkout ${args}`, options, repoPath, callback),
  clone: (args = '', options, repoUrl, callback) => spawn(`git lfs clone ${args}`, options, repoUrl, callback),
  fetch: (args = '', options, repoPath, callback) => spawn(`git lfs fetch ${args}`, options, repoPath, callback),
  fsck: options => exec('git lfs fsck', null, options),
  git: (args = '', options) => exec(`git ${args}`, null, options),
  install: (args = '', options) => exec(`git lfs install ${args}`, null, options),
  logs: (args = '', options) => exec(`git lfs logs ${args}`, null, options),
  ls: (args = '', options) => exec(`git lfs ls-files ${args}`, null, options),
  pointer: (args = '', options) => exec(`git lfs pointer ${args}`, null, options),
  prune: (args = '', options) => exec(`git lfs prune ${args}`, null, options),
  pull: (args = '', options, repoPath, callback) => spawn(`git lfs pull ${args}`, options, repoPath, callback),
  push: (args = '', options, repoPath, callback) => spawn(`git lfs push ${args}`, options, repoPath, callback),
  status: (args = '', options) => exec(`git lfs status ${args}`, null, options),
  track: (args = '', options) => exec(`git lfs track ${args}`, null, options),
  untrack: (args = '', options) => exec(`git lfs untrack ${args}`, null, options),
  update: (args = '', options) => exec(`git lfs update ${args}`, null, options),
  version: options => exec('git lfs version', null, options),
};
