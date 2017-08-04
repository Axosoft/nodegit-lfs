import { core } from './lfsCommands';
import generateResponse from '../utils/generateResponse';
import { BAD_CORE_RESPONSE } from '../constants';

const prune = (repo, args) => {
  //eslint-disable-next-line
  let response = generateResponse();
  const repoPath = repo.workdir();

  return core.prune(args, { cwd: repoPath })
    .then(({ stdout, stderr }) => {
      response.raw = stdout;
      response.stderr = stderr;
      return response;
    })
    .catch((error) => {
      response.success = false;
      response.error = error.errno || BAD_CORE_RESPONSE;
      response.raw = error;
      return response;
    });
};

export default prune;
