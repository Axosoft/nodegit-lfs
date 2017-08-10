import { exec } from '../utils/spawnHelper';

const core = {
  checkout: (args = '', options, callback) => exec(`git lfs checkout ${args}`, options, callback),
  clone: (args = '', options, callback) => exec(`git lfs clone ${args}`, options, callback),
  fetch: (args = '', options, callback) => exec(`git lfs fetch ${args}`, options, callback),
  fsck: options => exec('git lfs fsck', options),
  git: (args = '', options) => exec(`git ${args}`, options),
  install: (args = '', options) => exec(`git lfs install ${args}`, options),
  logs: (args = '', options) => exec(`git lfs logs ${args}`, options),
  ls: (args = '', options) => exec(`git lfs ls-files ${args}`, options),
  pointer: (args = '', options) => exec(`git lfs pointer ${args}`, options),
  prune: (args = '', options) => exec(`git lfs prune ${args}`, options),
  pull: (args = '', options, callback) => exec(`git lfs pull ${args}`, options, callback),
  push: (args = '', options, callback) => exec(`git lfs push ${args}`, options, callback),
  status: (args = '', options) => exec(`git lfs status ${args}`, options),
  track: (args = '', options) => exec(`git lfs track ${args}`, options),
  untrack: (args = '', options) => exec(`git lfs untrack ${args}`, options),
  update: (args = '', options) => exec(`git lfs update ${args}`, options),
  version: options => exec('git lfs version', options),
};

export { core };
