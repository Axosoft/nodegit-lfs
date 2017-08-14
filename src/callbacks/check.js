import ignore from 'ignore';
import { Error } from 'nodegit';

import { loadGitattributeFiltersFromRepo } from '../helpers';

export const check = src => loadGitattributeFiltersFromRepo(src.repo())
  .then((filters) => {
    const file = src.path();
    const filterIgnore = ignore().add(filters);

    // these ignore rules are the closest to the .gitignore rules I have found
    if (filterIgnore.ignores(file)) {
      return Error.CODE.OK;
    }

    return Error.CODE.PASSTHROUGH;
  })
  .catch(() => Error.CODE.PASSTHROUGH);
