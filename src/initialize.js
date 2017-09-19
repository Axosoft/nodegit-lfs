import fse from 'fs-extra';
import path from 'path';
import R from 'ramda';
import { core } from './commands/lfsCommands';

const builldArgs = (options) => {
  const opts = (options || {});
  const args = [];
  if (opts.local) {
    args.push('--local');
  }
  return R.join(' ', args);
};

const initialize = (repo, options) => {
  const workdir = repo.workdir();
  const lfsDir = path.join(workdir, '.git', 'lfs');

  return fse.pathExists(lfsDir)
    .then((exists) => {
      if (exists) {
        return Promise.resolve();
      }
      return core.install(builldArgs(options), { cwd: workdir });
    });
};

export default initialize;
