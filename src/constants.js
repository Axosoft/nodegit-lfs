export const LFS_ATTRIBUTE = 'filter=lfs diff=lfs merge=lfs';

export const LFS_FILTER_NAME = 'nodegit_lfs';

export const regex = {
  LFS: /(?:git-lfs\/\s+)?(\d+)(?:.(\d+))?(?:.(\d+))?.*/,
  GIT: /(?:git version\s+)?(\d+)(?:.(\d+))?(?:.(\d+))?.*/,
  TRACK: /([a-zA-Z*.]+(?="))/g,
};

export const BAD_VERSION = '0';

export const BAD_CORE_RESPONSE = '-1';

export const minimumVersions = {
  GIT: '2.0.0',
  LFS: '2.0.0',
};
