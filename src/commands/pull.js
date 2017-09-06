import R from 'ramda';
import { core } from './lfsCommands';
import {
  regex,
  BAD_CORE_RESPONSE,
  BAD_REGEX_PARSE_RESULT
} from '../constants';
import generateResponse from '../utils/generateResponse';
import {
  verifyOutput,
  errorCatchHandler
} from '../helpers';

const isValidLine = str => str !== '';

const generatePullStats = (raw) => {
  if (raw && typeof raw === 'string') {
    const stats = {};
    const outputLines = raw.split('Git LFS:');
    const filteredLines = R.filter(isValidLine, outputLines);
    const statLine = filteredLines.pop();

    const byteResults = statLine.match(regex.TOTAL_BYTES);

    stats.total_bytes_pulled =
      byteResults !== null ?
        byteResults[0].trim() : BAD_REGEX_PARSE_RESULT;

    stats.total_bytes =
      byteResults !== null ?
        byteResults[1].trim() : BAD_REGEX_PARSE_RESULT;

    const fileResults = statLine.match(regex.TOTAL_FILES);

    stats.total_files_pulled =
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
      stats.pull_error = statLine.split('error:')[1].trim();
    }

    return stats;
  }
  return {};
};

function pull(repo, options) {
  const args = [];
  const {
    remoteName,
    callback
  } = (options || {});

  if (remoteName) {
    args.push(remoteName);
  }
  const argsString = R.join(' ', args);

  return core.pull(argsString, { cwd: repo.workdir(), shell: true }, callback)
    .then(({ stdout }) => {
      const response = generateResponse();
      response.raw = stdout;
      response.pull = generatePullStats(stdout);

      if (response.pull.pull_error) {
        response.errno = BAD_CORE_RESPONSE;
        response.stderr = response.pull.pull_error;
        response.success = false;
      }

      return response;
    }, errorCatchHandler);
}

export default pull;
