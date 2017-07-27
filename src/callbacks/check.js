import minimatch from 'minimatch';
import { Error } from 'nodegit';

import { loadGitattributeFiltersFromRepo } from '../helpers';

const check = src => loadGitattributeFiltersFromRepo(src.repo())
  .then((filters) => {
    const file = src.path();

    for (let i = 0; i < filters.length; i++) { // eslint-disable-line no-plusplus
      const f = filters[i];
      if (minimatch(file, f)) {
        return Error.CODE.OK;
      }
    }

    return Error.CODE.PASSTHROUGH;
  })
  .catch(() => Error.CODE.PASSTHROUGH);

export { check };
