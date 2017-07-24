import { exec } from './execHelpers';

export default {
  checkout: (args = '') => exec(`git lfs checkout ${args}`),
  clone: (args = '') => exec(`git lfs clone ${args}`),
  fetch: (args = '') => exec(`git lfs fetch ${args}`),
  fsck: () => exec('git lfs fsck'),
  git: (args = '') => exec(`git ${args}`),
  install: (args = '') => exec(`git lfs install ${args}`),
  logs: (args = '') => exec(`git lfs logs ${args}`),
  ls: (args = '') => exec(`git lfs ls-files ${args}`),
  prune: (args = '') => exec(`git lfs prune ${args}`),
  pull: (args = '') => exec(`git lfs pull ${args}`),
  push: (args = '') => exec(`git lfs push ${args}`),
  status: (args = '') => exec(`git lfs status ${args}`),
  track: (args = '') => exec(`git lfs track ${args}`),
  update: (args = '') => exec(`git lfs update ${args}`),
  version: () => exec('git lfs version'),
};
