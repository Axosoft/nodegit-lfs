import {
  core
} from './lfsCommands';
import {
  parseVersion
} from '../utils/checkDependencies';
import {
  regex,
  BAD_CORE_RESPONSE,
} from '../constants';
import generateResponse from '../utils/generateResponse';

const checkVersion = (versionRegex, { stderr, stdout }) => {
  const response = generateResponse();

  response.raw = stdout;

  if (stderr) {
    response.stderr = stderr;
    response.success = false;
    response.errno = BAD_CORE_RESPONSE;
  } else {
    response.version = parseVersion(stdout, versionRegex);
  }

  return response;
};

export const gitVersion = () =>
  core.git('--version')
    .then(response => checkVersion(regex.GIT, response));

export const lfsVersion = () =>
  core.version()
    .then(response => checkVersion(regex.LFS, response));
