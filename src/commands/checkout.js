import R from 'ramda';
import { core } from './lfsCommands';
import {
  regex,
  BAD_CORE_RESPONSE,
  BAD_REGEX_PARSE_RESULT,
} from '../constants';

import generateResponse from '../utils/generateResponse';
import {
  regexResult,
  verifyOutput,
  errorCatchHandler
} from '../helpers';

const isValidLine = str => str !== '';

const generateCheckoutStats = (raw) => {
  if (raw && typeof raw === 'string') {
    const stats = {};
    const outputLines = raw.split('Git LFS:');
    const filteredLines = R.filter(isValidLine, outputLines);
    const statLine = filteredLines.pop();

    const byteResults = regexResult(statLine, regex.TOTAL_BYTES);

    stats.total_bytes_checked_out =
      byteResults !== null ?
        byteResults[0].trim() : BAD_REGEX_PARSE_RESULT;

    stats.total_bytes =
      byteResults !== null ?
        byteResults[1].trim() : BAD_REGEX_PARSE_RESULT;

    const fileResults = regexResult(statLine, regex.TOTAL_FILES);

    stats.total_files_checked_out =
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

    verifyOutput(stats, raw);

    if (statLine.includes('error:')) {
      stats.checkout_error = statLine.split('error:')[1].trim();
    }

    return stats;
  }
  return {};
};

function checkout(repo, options) {
  const response = generateResponse();
  const repoPath = repo.workdir();

  const {
    callback,
    shellOpts
  } = (options || {});

  return core.checkout('', R.merge({ cwd: repoPath }, shellOpts), repoPath, callback)
    .then(({ stdout }) => {
      response.raw = stdout;
      response.checkout = generateCheckoutStats(stdout);

      if (response.checkout.checkout_error) {
        response.success = false;
        response.stderr = response.checkout.checkout_error;
        response.errno = BAD_CORE_RESPONSE;
      }

      return response;
    }, errorCatchHandler(response));
}

export default checkout;
