import fse from 'fs-extra';
import path from 'path';
import R from 'ramda';

import {
  gitVersion,
  lfsVersion
} from '../commands/version';
import generateResponse from './generateResponse';

import {
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
const normalizeVersion = versionArray => (
  (versionArray && versionArray.length > 0)
    ? R.join('.', versionArray)
    : BAD_VERSION
);

export const parseVersion = (input, regex) => {
  if (!input) {
    return BAD_VERSION;
  }

  const matches = input.match(regex);
  if (!matches) {
    return BAD_VERSION;
  }

  const validSegments = R.filter(R.complement(isNaN), matches);

  return R.isEmpty(validSegments)
    ? BAD_VERSION
    : normalizeVersion(validSegments);
};

export const isLfsRepo = workDir => fse.pathExists(path.join(workDir, '.git', 'lfs'));

const handleVersionResponse = (dependencyName, response) => {
  const {
    raw,
    stderr,
    success,
    version
  } = response;

  if (!success) {
    throw new Error(stderr);
  }

  const exists = version !== BAD_VERSION;
  const meetsVersion = exists && version >= minimumVersions[dependencyName];

  const constructKey = key => `${R.toLower(dependencyName)}_${key}`;
  return {
    [constructKey('exists')]: exists,
    [constructKey('meets_version')]: meetsVersion,
    [constructKey('raw')]: raw
  };
};

export const dependencyCheck = () =>
  Promise.all([
    gitVersion(),
    lfsVersion()
  ])
    .then(([gitResponse, lfsResponse]) => ({
      ...generateResponse(),
      ...handleVersionResponse('GIT', gitResponse),
      ...handleVersionResponse('LFS', lfsResponse)
    }));

export const __TESTING__ = { // eslint-disable-line no-underscore-dangle
  handleVersionResponse,
  normalizeVersion
};
