import path from 'path';
import R from 'ramda';
import { core } from './lfsCommands';
import {
  BAD_CORE_RESPONSE,
} from '../constants';
import generateResponse from '../utils/generateResponse';

const isValidFileOutput = str => str.includes('*') || str.includes('-');

const reduceResults = (acc, value) => {
  let shaAndFileName;
  if (value.includes('*')) {
    shaAndFileName = value.split('*');
    acc[shaAndFileName[0].trim()] = shaAndFileName[1].trim();
  } else {
    shaAndFileName = value.split('-');
    acc[shaAndFileName[0].trim()] = shaAndFileName[1].trim();
  }
  return acc;
};

const extractFileNames = (raw) => {
  if (raw && typeof raw === 'string') {
    const outputLines = raw.split('\n');
    const filteredLines = R.filter(isValidFileOutput, outputLines);
    // creating the object in which sha's point to the file name
    return R.reduce(reduceResults, {}, filteredLines);
  }
  return null;
};

// arg `-l` is for full length sha
const ls = (repo, args = '-l') => {
  //eslint-disable-next-line
  let response = generateResponse();
  // repo.path() leads into workdir/.git
  const repoPath = path.join(repo.path(), '..');

  return core.ls(args, { cwd: repoPath })
    .then(({ stdout, stderr }) => {
      response.raw = stdout;
      response.stderr = stderr;
      response.files = extractFileNames(stdout);
      return response;
    })
    .catch((error) => {
      response.success = false;
      response.error = error.errno || BAD_CORE_RESPONSE;
      response.raw = error;
      return response;
    });
};

export default ls;
