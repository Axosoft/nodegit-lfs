import R from 'ramda';
import { core } from './lfsCommands';
import {
  regex,
  BAD_CORE_RESPONSE,
  BAD_REGEX_PARSE_RESULT
} from '../constants';
import generateResponse from '../utils/generateResponse';
import {
  errorCatchHandler,
  verifyOutput
} from '../helpers';

const isValidLine = str => str !== '';

const generateFetchStats = (raw) => {
  if (raw && typeof raw === 'string') {
    const stats = {};
    const outputLines = raw.split('Git LFS:');
    const filteredLines = R.filter(isValidLine, outputLines);
    const statLine = filteredLines.pop();

    const byteResults = statLine.match(regex.TOTAL_BYTES);

    stats.total_bytes_fetched =
      byteResults !== null ?
        byteResults[0].trim() : BAD_REGEX_PARSE_RESULT;

    stats.total_bytes =
      byteResults !== null ?
        byteResults[1].trim() : BAD_REGEX_PARSE_RESULT;

    const fileResults = statLine.match(regex.TOTAL_FILES);

    stats.total_files_fetched =
      fileResults !== null ?
        fileResults[0].trim() : BAD_REGEX_PARSE_RESULT;

    const skippedByteResults = statLine.match(regex.SKIPPED_BYTES);

    stats.total_bytes_skipped =
      skippedByteResults !== null ?
        skippedByteResults[0].trim() : BAD_REGEX_PARSE_RESULT;

    const skippedFileResults = statLine.match(regex.SKIPPED_FILES);

    stats.total_files_skipped =
      skippedFileResults !== null ?
        skippedFileResults[0].trim() : BAD_REGEX_PARSE_RESULT;

    verifyOutput(stats, raw);

    if (statLine.includes('error:')) {
      stats.fetch_error = statLine.split('error:')[1].trim();
    }

    return stats;
  }
  return {};
};

function fetch(repo, options) {
  const response = generateResponse();

  const args = [];
  const {
    remoteName,
    branchName,
    callback
  } = (options || {});

  if (remoteName) {
    args.push(remoteName);
  }

  if (branchName) {
    args.push(branchName);
  }

  const argsString = R.join(' ', args);
  return core.fetch(argsString, { cwd: repoPath, shell: true }, callback)
    .then(({ stdout }) => {
      response.raw = stdout;
      response.fetch = generateFetchStats(stdout);

      if (response.fetch.fetch_error) {
        response.success = false;
        response.stderr = response.fetch.fetch_error;
        response.errno = BAD_CORE_RESPONSE;
      }

      return response;
    }, errorCatchHandler(response));
}

export default fetch;
