import {
  regex,
  BAD_CORE_RESPONSE
} from '../constants';
import {
  errorCatchHandler
} from '../helpers';
import { parseVersion } from '../utils/checkDependencies';
import generateResponse from '../utils/generateResponse';

import {
  core
} from './lfsCommands';

export const gitVersion = () =>
  core.git('--version')
    .then(({ stdout }) => ({
      ...generateResponse(),
      raw: stdout,
      version: parseVersion(stdout, regex.GIT)
    }), errorCatchHandler);

export const lfsVersion = () =>
  core.version()
    .then(({ stdout, stderr }) => {
      const response = generateResponse();
      response.raw = stdout;

      if (stderr) {
        response.errno = BAD_CORE_RESPONSE;
        response.stderr = stderr;
        response.success = false;
        return response;
      }

      response.version = parseVersion(stdout, regex.LFS);
      return response;
    });

export default lfsVersion;
