
import fse from 'fs-extra';
import path from 'path';
import R from 'ramda';

import {
  regex as versionRegexes,
  BAD_VERSION,
  minimumVersions,
} from '../constants';

/**
 * @function normalizeVersion
 * @param  Array<string> versionArray array of version number eg: ['1', '8', '3'] => 1.8.3
 * @return Number normalized version number
 */
const normalizeVersion = (versionArray) => {
  if (!versionArray || versionArray.length === 0) {
    return BAD_VERSION;
  }
  return R.join('.', versionArray);
};

export const parseVersion = (input, regex) => {
  const matches = input.match(regex);
  if (!matches || R.isEmpty(matches)) {
    return BAD_VERSION;
  }

  const numericVersionNumbers = R.filter(match => !isNaN(match), matches);
  return normalizeVersion(numericVersionNumbers);
};

export const isAtleastGitVersion = gitInput =>
  parseVersion(gitInput, versionRegexes.GIT) >= minimumVersions.GIT;

export const isAtleastLfsVersion = lfsInput =>
  parseVersion(lfsInput, versionRegexes.LFS) >= minimumVersions.LFS;

export const isLfsRepo = workingDir => fse.pathExists(path.join(workingDir), '.git', 'lfs');
