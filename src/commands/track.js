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

const track = (repo, globs) => {
  if (!globs) { return; }

  const filteredGlobs = R.filter(isString, globs);
  //eslint-disable-next-line
  let response = generateResponse();
  const repoPath = repo.workdir();

  return core.track(R.join(' ', filteredGlobs), { cwd: repoPath })
    .then(({ stdout, stderr }) => {
      response.raw = stdout;
      response.stderr = stderr;
      response.new_globs = extractGlobs(stdout, Regex.TRACK);
      return response;
    })
    .catch((error) => {
      response.success = false;
      response.error = error.errno || BAD_CORE_RESPONSE;
      response.raw = error;
      return response;
    });
};

export default track;
