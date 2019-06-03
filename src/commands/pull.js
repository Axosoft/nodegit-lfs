import R from 'ramda';
import { core } from './lfsCommands';
import {
  regex,
  BAD_REGEX_PARSE_RESULT,
  BAD_CORE_RESPONSE,
} from '../constants';
import generateResponse from '../utils/generateResponse';
import { combineShellOptions } from '../utils/shellOptions';
import {
  regexResult,
  verifyOutput,
  errorCatchHandler } from '../helpers';

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

    verifyOutput(stats, raw);

    if (statLine.includes('error:')) {
      stats.pull_error = statLine.split('error:')[1].trim();
    }

    return stats;
  }
  return {};
};

function pull(repo, options) {
  const response = generateResponse();
  const repoPath = repo.workdir();

  const args = [];
  const {
    remoteName,
    branchName,
    callback,
    shellOptions
  } = (options || {});

  if (remoteName) {
    args.push(remoteName);
  }
  if (branchName) {
    args.push(branchName);
  }
  const argsString = R.join(' ', args);

  return core.pull(
    argsString,
    combineShellOptions(shellOptions, { cwd: repoPath, shell: true }),
    repoPath,
    callback
  )
    .then(({ stdout }) => {
      response.raw = stdout;
      response.pull = generatePullStats(stdout);

      if (response.pull.pull_error) {
        response.success = false;
        response.stderr = response.pull.pull_error;
        response.errno = BAD_CORE_RESPONSE;
      }

      return response;
    }, errorCatchHandler(response));
}

export default pull;
