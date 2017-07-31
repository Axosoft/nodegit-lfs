import path from 'path';
import { core } from './lfsCommands';
import { parseVersion } from '../utils/checkDependencies';
import {
  regex,
  BAD_CORE_RESPONSE,
} from '../constants';
import generateResponse from '../utils/generateResponse';

const version = (repo) => {
  //eslint-disable-next-line
  let response = generateResponse();
  // repo.path() leads into workdir/.git
  const repoPath = path.join(repo.path(), '..');
  return core.version({ cwd: repoPath })
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
