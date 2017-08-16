import ignore from 'ignore';
import { Error } from 'nodegit';

import { loadGitattributeFiltersFromRepo } from '../helpers';

export const check = src => loadGitattributeFiltersFromRepo(src.repo())
  .then((filters) => {
    const file = src.path();
    const filterIgnore = ignore().add(filters);

    // The rules for `.gitignore` are close enough to those for `.gitattributes`
    return filterIgnore.ignores(file)
      ? Error.CODE.OK
      : Error.CODE.PASSTHROUGH;
  })
  .catch(() => Error.CODE.PASSTHROUGH);
