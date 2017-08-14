import spawn from '../utils/spawnHelper';

export const core = {
  checkout: (args = '', options, callback) => spawn(`git lfs checkout ${args}`, options, callback),
  clone: (args = '', options, callback) => spawn(`git lfs clone ${args}`, options, callback),
  fetch: (args = '', options, callback) => spawn(`git lfs fetch ${args}`, options, callback),
  fsck: options => spawn('git lfs fsck', options),
  git: (args = '', options) => spawn(`git ${args}`, options),
  install: (args = '', options) => spawn(`git lfs install ${args}`, options),
  logs: (args = '', options) => spawn(`git lfs logs ${args}`, options),
  ls: (args = '', options) => spawn(`git lfs ls-files ${args}`, options),
  pointer: (args = '', options) => spawn(`git lfs pointer ${args}`, options),
  prune: (args = '', options) => spawn(`git lfs prune ${args}`, options),
  pull: (args = '', options, callback) => spawn(`git lfs pull ${args}`, options, callback),
  push: (args = '', options, callback) => spawn(`git lfs push ${args}`, options, callback),
  status: (args = '', options) => spawn(`git lfs status ${args}`, options),
  track: (args = '', options) => spawn(`git lfs track ${args}`, options),
  untrack: (args = '', options) => spawn(`git lfs untrack ${args}`, options),
  update: (args = '', options) => spawn(`git lfs update ${args}`, options),
  version: options => spawn('git lfs version', options),
};
