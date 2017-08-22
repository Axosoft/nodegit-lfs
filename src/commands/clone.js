import R from 'ramda';
import { core } from './lfsCommands';
import {
  regex,
  BAD_REGEX_PARSE_RESULT,
} from '../constants';
import generateResponse from '../utils/generateResponse';
import {
  errorCatchHandler,
  verifyOutput
} from '../helpers';

const isValidLine = str => str !== '';

const generateCloneStats = (raw) => {
  if (raw && typeof raw === 'string') {
    const stats = {};
    const outputLines = raw.split('Git LFS:');
    const filteredLines = R.filter(isValidLine, outputLines);
    const statLine = filteredLines.pop();

    const byteResults = statLine.match(regex.TOTAL_BYTES);

    stats.total_bytes_cloned =
      byteResults !== null ?
        byteResults[0].trim() : BAD_REGEX_PARSE_RESULT;

    stats.total_bytes =
      byteResults !== null ?
        byteResults[1].trim() : BAD_REGEX_PARSE_RESULT;

    const fileResults = statLine.match(regex.TOTAL_FILES);

    stats.total_files_cloned =
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
      stats.clone_error = statLine.split('error:')[1].trim();
    }

    return stats;
  }
  return {};
};

function clone(url, cwd, options) {
  if (!url || !cwd) {
    throw new Error('A valid URL and working directory are required');
  }

  const {
    branch,
    callback,
    env = {}
  } = (options || {});
  const args = branch ? `-b ${branch}` : '';

  const response = generateResponse();
  return core.clone(`${url} ${args}`, { cwd, env }, callback)
    .then(({ stdout }) => {
      response.raw = stdout;
      response.clone = generateCloneStats(stdout);
      return response;
    }, errorCatchHandler(response));
}

export default clone;
