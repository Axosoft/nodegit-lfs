import { core } from './lfsCommands';
import { parseVersion } from '../utils/checkDependencies';
import {
  regex,
  BAD_CORE_RESPONSE,
} from '../constants';
import generateResponse from '../utils/generateResponse';
import { combineShellOptions } from '../utils/shellOptions';

const version = () => {
  const response = generateResponse();
  return core.version(combineShellOptions())
    .then(({ stdout, stderr }) => {
      response.raw = stdout;

      if (stderr) {
        response.stderr = stderr;
        response.success = false;
        response.errno = BAD_CORE_RESPONSE;
      } else {
        response.version = parseVersion(stdout, regex.LFS);
      }

      return response;
    });
};

export default version;
