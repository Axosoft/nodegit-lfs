
import fse from 'fs-extra';
import path from 'path';
import R from 'ramda';
import { default as LFSVersion } from '../commands/version';
import generateResponse from './generateResponse';
import { core } from '../commands/lfsCommands';

import {
  regex as versionRegexes,
  minimumVersions,
  BAD_VERSION,
  BAD_CORE_RESPONSE,
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

export const dependencyCheck = () => {
  //eslint-disable-next-line
  let response = generateResponse();
  return LFSVersion().then((responseObject) => {
    response.lfs_meets_version = isAtleastLfsVersion(responseObject.version);
    response.lfs_exists = parseVersion(
      responseObject.version,
      versionRegexes.LFS,
    ) !== BAD_VERSION;
    response.lfs_raw = responseObject.raw;
    return core.git('--version');
  })
    .then(({ stdout }) => {
      response.git_meets_version = isAtleastGitVersion(stdout);
      response.git_exists = parseVersion(
        stdout,
        versionRegexes.GIT,
      ) !== BAD_VERSION;
      response.git_raw = stdout;
      return response;
    })
    .catch((error) => {
      response.success = false;
      response.error = error.errno || BAD_CORE_RESPONSE;
      response.raw = error;
      return response;
    });
};
