import R from 'ramda';
import { core } from './lfsCommands';
import {
  regex,
  BAD_CORE_RESPONSE,
  BAD_REGEX_PARSE_RESULT,
} from '../constants';
import generateResponse from '../utils/generateResponse';
import { regexResult } from '../helpers';

const isValidLine = str => str !== '';

const generatePullStats = (raw) => {
  if (raw && typeof raw === 'string') {
    const stats = {};
    const outputLines = raw.split('Git LFS:');
    const filteredLines = R.filter(isValidLine, outputLines);
    const statLine = filteredLines.pop();

    const byteResults = regexResult(statLine, regex.TOTAL_BYTES);

    stats.total_bytes_pulled =
      byteResults !== null ?
        byteResults[0].trim() : BAD_REGEX_PARSE_RESULT;

    stats.total_bytes =
      byteResults !== null ?
        byteResults[1].trim() : BAD_REGEX_PARSE_RESULT;

    const fileResults = regexResult(statLine, regex.TOTAL_FILES);

    stats.total_files_pulled =
      fileResults !== null ?
        fileResults[0].trim() : BAD_REGEX_PARSE_RESULT;

    const skippedByteResults = regexResult(statLine, regex.SKIPPED_BYTES);

    stats.total_bytes_skipped =
      skippedByteResults !== null ?
        skippedByteResults[0].trim() : BAD_REGEX_PARSE_RESULT;

    const skippedFileResults = regexResult(statLine, regex.SKIPPED_FILES);

    stats.total_files_skipped =
      skippedFileResults !== null ?
        skippedFileResults[0].trim() : BAD_REGEX_PARSE_RESULT;

    if (statLine.includes('error:')) {
      stats.pull_error = statLine.split('error:')[1].trim();
    }

    return stats;
  }
  return {};
};

function pull(repo, options) {
  const response = generateResponse();

  const args = [];
  const {
    remoteName,
    branchName,
    callback,
  } = (options || {});

  if (remoteName) {
    args.push(remoteName);
  }
  if (branchName) {
    args.push(branchName);
  }
  const argsString = R.join(' ', args);

  return core.pull(argsString, { cwd: repo.workdir(), shell: true }, callback)
    .then(({ stdout, stderr }) => {
      response.raw = stdout;

      if (stderr) {
        response.stderr = stderr;
        response.success = false;
        response.errno = BAD_CORE_RESPONSE;
        return response;
      }

      response.pull = generatePullStats(stdout);
      return response;
    });
}

export default pull;
