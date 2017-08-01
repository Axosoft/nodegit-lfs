import path from 'path';
import R from 'ramda';
import { core } from './lfsCommands';
import {
  BAD_CORE_RESPONSE,
} from '../constants';
import generateResponse from '../utils/generateResponse';

const isValidFileOutput = str => str.includes('*') || str.includes('-');

const extractOnlyFileNames = (str) => {
  if (str.includes('*')) { return str.split('*')[1].trim(); }
  return str.split('-')[1].trim();
};

const extractFileNames = (raw) => {
  if (raw && typeof raw === 'string') {
    const outputLines = raw.split('\n');
    const filteredLines = R.filter(isValidFileOutput, outputLines);
    return R.map(extractOnlyFileNames, filteredLines);
  }
  return null;
};

const ls = (repo, args) => {
  //eslint-disable-next-line
  let response = generateResponse();
  // repo.path() leads into workdir/.git
  const repoPath = path.join(repo.path(), '..');

  return core.ls(args, { cwd: repoPath })
    .then(({ stdout, stderr }) => {
      // let files = [];
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
