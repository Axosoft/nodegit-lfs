import fse from 'fs-extra';
import path from 'path';
import R from 'ramda';

import {
  LFS_ATTRIBUTE,
  BAD_CORE_RESPONSE,
  BAD_REGEX_PARSE_RESULT
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

export const hasLfsFilters = repo => loadGitattributeFiltersFromRepo(repo)
  .then(filters => filters.length > 0)
  .catch(() => false);

export const regexResult = (input, regularExpression) => input.match(regularExpression);

export const verifyOutput = (stats, raw) => {
   // We need to handle this manually because LFS isn't returning stderr
  const props = Object.keys(stats);
  const errCount = R.reduce((acc, p) => {
    if (p === BAD_REGEX_PARSE_RESULT) {
      acc += 1;
    }
    return acc;
  }, 0, props);

  // We have all errors
  if (errCount === props.length) {
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
