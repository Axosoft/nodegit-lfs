import fse from 'fs-extra';
import path from 'path';
import { install as lfsInstaller } from './commands/lfsCommands';

const ENOENT = 34;

const createGitattributes = (workingDir) => {
  const gitattrpath = path.join(workingDir, '.gitattributes');
  return fse.ensureFile(gitattrpath);
};

const initialize = (workingDir) => {
  const lfsDir = path.join(workingDir, '.git', 'lfs');
  return fse.stat(lfsDir)
    .catch((err) => {
      if (err.code !== ENOENT) {
        return Promise.resolve();
      }
      return lfsInstaller();
    })
    .then(() => createGitattributes(workingDir));
};

export default initialize;
