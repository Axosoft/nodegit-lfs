import R from 'ramda';
import { core } from './lfsCommands';
import {
  BAD_CORE_RESPONSE
} from '../constants';
import generateResponse from '../utils/generateResponse';

const isValidFileOutput = str => str.includes('*') || str.includes('-');

const reduceResults = (acc, value) => {
  const separatorRegex = /[*-]/;
  const match = value.match(separatorRegex);
  if (!match || !match[0]) {
    return acc;
  }

  const shaAndFileName = value.split(match[0]);
  acc[shaAndFileName[0].trim()] = shaAndFileName[1].trim();

  return acc;
};

const extractFileNames = (raw) => {
  const output = (raw || '');

  const outputLines = output.toString().split('\n');
  const filteredLines = R.filter(isValidFileOutput, outputLines);
  // creating the object in which sha's point to the file name
  return R.reduce(reduceResults, {}, filteredLines);
};

const buildArgs = (options) => {
  const opts = (options || {});
  const args = [];

  // returns the full length OID with the file
  if (opts.long) {
    args.push('--long');
  }

  // this should probably be last?
  if (opts.commitSha && opts.commitSha > '') {
    args.push(options.commitSha);
  }

  return R.join(' ', args);
};

const ls = (repo, options) => {
  const args = buildArgs(options);

  return core.ls(args, { cwd: repo.workdir() })
    .then(({ stdout, stderr }) => {
      const response = generateResponse();
      response.raw = stdout;

      if (stderr) {
        response.errno = BAD_CORE_RESPONSE;
        response.stderr = stderr;
        response.success = false;
        return response;
      }

      response.files = extractFileNames(stdout);
      return response;
    });
};

export default ls;
