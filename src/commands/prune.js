import { core } from './lfsCommands';
import generateResponse from '../utils/generateResponse';
import { BAD_CORE_RESPONSE } from '../constants';

const prune = (repo, args) => {
  const response = generateResponse();

  return core.prune(args, { cwd: repo.workdir() })
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
