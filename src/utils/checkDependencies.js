import fse from 'fs-extra';
import path from 'path';
import R from 'ramda';
import { gitVersion, lfsVersion } from '../commands/version';
import generateResponse from './generateResponse';

import {
  dependencies,
  minimumVersions,
  BAD_VERSION
} from '../constants';

/**
 * @function normalizeVersion
 * @param {Array<string>} versionArray Array of version number sections
 * @returns {Number} Constructed version number
 *
 * @example
 * normalizeVersion(['1', '8', '3']) === '1.8.3'
 *
 * @example
 * normalizeVersion([]) === BAD_VERSION
 */
const normalizeVersion = (versionArray) => {
  if (!versionArray || versionArray.length === 0) {
    return BAD_VERSION;
  }
  return R.join('.', versionArray);
};

/**
 * @function parseVersion
 * @param {String} input Version to parse
 * @param {Regexp} regex Regex to parse version with
 * @returns {String} Normalized version number
 */
export const parseVersion = (input, regex) => {
  if (!input) {
    return BAD_VERSION;
  }

  const matches = input.match(regex);
  if (!matches || R.isEmpty(matches)) {
    return BAD_VERSION;
  }

  const numericVersionNumbers = R.filter(match => !isNaN(match), matches);
  return normalizeVersion(numericVersionNumbers);
};

export const isLfsRepo = workDir => fse.pathExists(path.join(workDir, '.git', 'lfs'));

export const dependencyCheck = () => {
  const processVersionResponse = (dependencyName, { raw, version }) => {
    const exists = version !== BAD_VERSION;
    const meetsMinimumVersion = exists && version >= minimumVersions[dependencyName];

    const prefixes = {
      [dependencies.GIT]: 'git',
      [dependencies.LFS]: 'lfs'
    };
    const constructKey = suffix => `${prefixes[dependencyName]}_${suffix}`;
    return {
      [constructKey('exists')]: exists,
      [constructKey('meets_version')]: meetsMinimumVersion,
      [constructKey('raw')]: raw
    };
  };

  return Promise.all([
    gitVersion(),
    lfsVersion()
  ])
    .then(([gitResponse, lfsResponse]) => ({
      ...generateResponse(),
      ...processVersionResponse(dependencies.GIT, gitResponse),
      ...processVersionResponse(dependencies.LFS, lfsResponse)
    }));
};

