import R from 'ramda';
import { core } from './lfsCommands';
import generateResponse from '../utils/generateResponse';
import {
  regex as Regex,
  BAD_CORE_RESPONSE,
} from '../constants';

const isString = str => typeof str === 'string';

const extractGlobs = (input, regex) => {
  const matches = input.match(regex);
  if (!matches || R.isEmpty(matches)) { return []; }
  return matches;
};

const untrack = (repo, globs) => {
  if (!globs) { return; }

  const filteredGlobs = R.filter(isString, globs);
  const response = generateResponse();

  return core.untrack(R.join(' ', filteredGlobs), { cwd: repo.workdir() })
    .then(({ stdout, stderr }) => {
      response.raw = stdout;

      if (stderr) {
        response.success = false;
        response.errno = BAD_CORE_RESPONSE;
        response.stderr = stderr;
        return response;
      }

      response.untracked_globs = extractGlobs(stdout, Regex.TRACK);
      return response;
    });
};

export default untrack;
