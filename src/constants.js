export const LFS_ATTRIBUTE = 'filter=lfs diff=lfs merge=lfs';

export const LFS_FILTER_NAME = 'nodegit_lfs';

export const regex = {
  LFS: /(?:git-lfs\/\s*)?(\d+)(?:.(\d+))?(?:.(\d+))?.*/,
  GIT: /(?:git\s+version\s+)(\d+)\.(\d+)\.(\d+)/,
  VERSION: /(\d+\.){2}\d+/,
  TRACK: /([a-zA-Z*.]+(?="))/g,
  SKIPPED_BYTES: /[\d]+\s+B\s+(?=skipped)/g,
  SKIPPED_FILES: /[\d]\s+(?=skipped)/g,
  TOTAL_BYTES: /[\d]+\s+B/g,
  TOTAL_FILES: /[\d]\s+(?=files)/g,
  USERNAME: /username/i,
  PASSWORD: /password|passphrase/i,
};

export const BAD_VERSION = '0';
export const BAD_CORE_RESPONSE = '-1';
export const BAD_REGEX_PARSE_RESULT = '-2';

export const minimumVersions = {
  GIT: '1.8.5',
  LFS: '2.0.0',
};

// Copied from NodeGit for now... eventually we will find a way to change that
export const Error = {
  CODE: {
    OK: 0,
    PASSTHROUGH: -30,
  }
};
