import { core } from './lfsCommands';
import { parseVersion } from '../utils/checkDependencies';
import {
  regex,
  BAD_CORE_RESPONSE
} from '../constants';
import generateResponse from '../utils/generateResponse';

const version = () =>
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

export default version;
