import { core } from './lfsCommands';
import { parseVersion } from '../utils/checkDependencies';
import {
  regex,
  BAD_CORE_RESPONSE,
} from '../constants';
import generateResponse from '../utils/generateResponse';

const version = () => {
  //eslint-disable-next-line
  let response = generateResponse();
  return core.version()
    .then(({ stdout, stderr }) => {
      response.raw = stdout;
      response.stderr = stderr;
      return parseVersion(stdout, regex.LFS);
    })
    .then((ver) => {
      response.version = ver;
      return response;
    })
    .catch((error) => {
      response.success = false;
      response.error = error.errno || BAD_CORE_RESPONSE;
      response.raw = error;
      return response;
    });
};

export default version;
