import R from 'ramda';
import generateResponse from './generateResponse';
import { core } from '../commands/lfsCommands';

import {
  regex as versionRegexes,
  minimumVersions,
  BAD_VERSION
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
  if (!input) {
    return BAD_VERSION;
  }

  const matches = input.match(regex);
  if (!matches || R.isEmpty(matches)) {
    return BAD_VERSION;
  }

  const numericVersionNumbers = R.filter((match) => !Number.isNaN(match), matches);
  if (numericVersionNumbers.length > 0) {
    return normalizeVersion(numericVersionNumbers);
  }
  return matches[1];
};

export const isAtleastGitVersion = (gitInput) =>
  parseVersion(gitInput, versionRegexes.GIT) >= minimumVersions.GIT;

export const isAtleastLfsVersion = (lfsInput) =>
  parseVersion(lfsInput, versionRegexes.LFS) >= minimumVersions.LFS;

const setLfsFailed = (response) => {
  response.success = false;
  response.errno = BAD_VERSION;
  response.lfs_meets_version = false;
  response.lfs_exists = false;
  response.lfs_raw = null;
  response.lfs_version = null;
};

const setGitFailed = (response) => {
  response.success = false;
  response.errno = BAD_VERSION;
  response.git_meets_version = false;
  response.git_exists = false;
  response.git_raw = null;
  response.git_version = null;
};

export const dependencyCheck = () => {
  const response = generateResponse();
  return core.git('--version')
    .then(({ stdout, stderr }) => {
      if (stderr) {
        setGitFailed(response);
      } else {
        response.git_version = parseVersion(stdout, versionRegexes.GIT);
        response.git_meets_version = isAtleastGitVersion(stdout);
        response.git_exists = response.git_version !== BAD_VERSION;
        response.git_raw = stdout;
      }
    })
    .catch(() => {
      setGitFailed(response);
    })
    .then(() => core.git('lfs version'))
    .then(({ stdout, stderr }) => {
      if (stderr) {
        setLfsFailed(response);
      } else {
        response.lfs_version = parseVersion(stdout, versionRegexes.LFS);
        response.lfs_meets_version = isAtleastLfsVersion(stdout);
        response.lfs_exists = response.lfs_version !== BAD_VERSION;
        response.lfs_raw = stdout;
      }

      return response;
    })
    .catch(() => {
      setLfsFailed(response);
      return response;
    });
};
