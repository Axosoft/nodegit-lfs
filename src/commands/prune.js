import R from 'ramda';
import { core } from './lfsCommands';
import generateResponse from '../utils/generateResponse';
import { BAD_CORE_RESPONSE } from '../constants';

const prune = (repo, options) => {
  const response = generateResponse();
  const repoPath = repo.workdir();

  const {
    callback,
    shellOpts
  } = (options || {});

  return core.prune('', R.merge({ cwd: repoPath }, shellOpts), callback)
    .then(({ stdout, stderr }) => {
      response.raw = stdout;

      if (stderr) {
        response.errno = BAD_CORE_RESPONSE;
        response.stderr = stderr;
        response.success = false;
        return response;
      }

      return response;
    });
};

export default prune;
