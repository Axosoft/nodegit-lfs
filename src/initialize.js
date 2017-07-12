import promisify from 'promisify-node';
import path from 'path';
import { exec } from './utils/execHelpers';

const fse = promisify('fs-extra');
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
      return exec('git lfs install');
    })
    .then(() => createGitattributes(workingDir));
};

export default initialize;
