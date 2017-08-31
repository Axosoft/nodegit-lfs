import { core } from './lfsCommands';
import {
  BAD_CORE_RESPONSE
} from '../constants';
import generateResponse from '../utils/generateResponse';

const pointer = (repo, filePath, pointerPath) => {
  let args = '';
  if (filePath) {
    args += `--file=${filePath} `;
  }
  if (pointerPath) {
    args += `--file=${pointerPath} `;
  }


  return core.pointer(args, { cwd: repo.workdir() })
    .then(({ stdout, stderr }) => {
      const response = generateResponse();
      response.raw = stdout;

      if (stderr) {
        response.errno = BAD_CORE_RESPONSE;
        response.stderr = stderr;
        response.success = false;
        return response;
      }

      response.buffer = Buffer.from(stdout);
      return response;
    });
};

export default pointer;
