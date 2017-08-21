import fse from 'fs-extra';
import path from 'path';
import R from 'ramda';

import {
  LFS_ATTRIBUTE,
  BAD_CORE_RESPONSE,
  BAD_REGEX_PARSE_RESULT,
  regex,
} from './constants';

export const getGitattributesPathFromRepo = repo => path.join(repo.workdir(), '.gitattributes');

export const loadGitattributeFiltersFromRepo = (repo) => {
  const gitattrPath = getGitattributesPathFromRepo(repo);
  return fse.pathExists(gitattrPath)
    .then((exists) => {
      if (!exists) {
        throw new Error('No .gitattributes found');
      }

      return fse.readFile(gitattrPath, 'utf8');
    })
    .then((fileContents) => {
      const attributes = fileContents.split('\n');
      const lfsFilters = R.reduce((acc, line) => {
        if (!R.contains(LFS_ATTRIBUTE, line)) {
          return acc;
        }

        const start = line.indexOf(LFS_ATTRIBUTE);
        const filter = line.substring(0, start);
        acc.push(filter.trim());

        return acc;
      }, [], attributes);

      return lfsFilters;
    });
};

export const repoHasLfsFilters = repo => loadGitattributeFiltersFromRepo(repo)
  .then(filters => filters.length > 0)
  .catch(() => false);

export const repoHasLfsObjectBin = repo =>
  fse.pathExists(path.join(repo.workdir(), '.git', 'lfs'));

export const repoHasLfs = repo => repoHasLfsFilters(repo)
    .then(hasFilters => hasFilters || repoHasLfsObjectBin(repo));

export const verifyOutput = (stats, raw) => {
  // Check to see if it was a permissions error
  const wasPermissionDenied = raw.trim().toLowerCase().match(regex.PERMISSION_DENIED);
  if (wasPermissionDenied) {
    const e = new Error(wasPermissionDenied[0]);
    e.errno = BAD_CORE_RESPONSE;
    throw e;
  }

  // We need to handle this manually because LFS isn't returning stderr
  const props = R.values(stats);
  const allErrored = R.pipe(
    R.filter(R.equals(BAD_REGEX_PARSE_RESULT)),
    R.sum,
    R.equals(props.length)
  )(props);

  // We have all errors
  if (allErrored) {
    const e = new Error(raw);
    e.errno = BAD_CORE_RESPONSE;
    throw e;
  }
};

export const errorCatchHandler = response => (err) => {
  // This is a manually detected error we get from LFS
  if (err.errno === BAD_CORE_RESPONSE) {
    response.stderr = response.raw;
    response.errno = BAD_CORE_RESPONSE;
    response.success = false;
    return response;
  }

  throw err;
};
