import fse from 'fs-extra';
import path from 'path';
import R from 'ramda';

import { LFS_ATTRIBUTE } from './constants';

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
