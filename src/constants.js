export const dependencies = {
  GIT: 'GIT',
  LFS: 'LFS'
};

export const LFS_ATTRIBUTE = 'filter=lfs diff=lfs merge=lfs';

export const LFS_FILTER_NAME = 'nodegit_lfs';

export const regex = {
  [dependencies.LFS]: /(?:git-lfs\/\s+)?(\d+)(?:.(\d+))?(?:.(\d+))?.*/,
  [dependencies.GIT]: /(?:git version\s+)?(\d+)(?:.(\d+))?(?:.(\d+))?.*/,
  TRACK: /([a-zA-Z*.]+(?="))/g,
  SKIPPED_BYTES: /[\d]+\s+B\s+(?=skipped)/g,
  SKIPPED_FILES: /[\d]\s+(?=skipped)/g,
  TOTAL_BYTES: /[\d]+\s+B/g,
  TOTAL_FILES: /[\d]\s+(?=files)/g,
  USERNAME: /username/i,
  PASSWORD: /password/i,
};

export const BAD_VERSION = '0';
export const BAD_CORE_RESPONSE = '-1';
export const BAD_REGEX_PARSE_RESULT = '-2';

export const minimumVersions = {
  [dependencies.GIT]: '1.8.5',
  [dependencies.LFS]: '2.0.0',
};
