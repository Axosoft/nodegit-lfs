import spawn from '../utils/spawnHelper';
import exec from '../utils/execHelper';

export const core = {
  checkout: (args = '', options, callback) => spawn(`git lfs checkout ${args}`, options, callback),
  clone: (args = '', options, callback) => spawn(`git lfs clone ${args}`, options, callback),
  fetch: (args = '', options, callback) => spawn(`git lfs fetch ${args}`, options, callback),
  fsck: options => exec('git lfs fsck', null, options),
  git: (args = '', options) => spawn(`git ${args}`, options),
  install: (args = '', options) => exec(`git lfs install ${args}`, null, options),
  logs: (args = '', options) => exec(`git lfs logs ${args}`, null, options),
  ls: (args = '', options) => exec(`git lfs ls-files ${args}`, null, options),
  pointer: (args = '', options) => exec(`git lfs pointer ${args}`, null, options),
  prune: (args = '', options) => exec(`git lfs prune ${args}`, null, options),
  pull: (args = '', options, callback) => spawn(`git lfs pull ${args}`, options, callback),
  push: (args = '', options, callback) => spawn(`git lfs push ${args}`, options, callback),
  status: (args = '', options) => exec(`git lfs status ${args}`, null, options),
  track: (args = '', options) => exec(`git lfs track ${args}`, null, options),
  untrack: (args = '', options) => exec(`git lfs untrack ${args}`, null, options),
  update: (args = '', options) => exec(`git lfs update ${args}`, null, options),
  version: options => exec('git lfs version', null, options),
};
