import minimatch from 'minimatch';

import { loadGitattributeFiltersFromRepo } from '../helpers';

const check = src => loadGitattributeFiltersFromRepo(src.repo())
  .then((filters) => {
    const file = src.path();

    for (let i = 0; i < filters.length; i++) { // eslint-disable-line no-plusplus
      const f = filters[i];
      if (minimatch(file, f)) {
        return 0;
      }
    }

    return -31;
  })
  .catch(() => -31 /* GIT_PASSTHROUGH */);

export { check };
