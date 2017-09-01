import R from 'ramda';
import { core } from './lfsCommands';
import {
  regex,
  BAD_REGEX_PARSE_RESULT,
  BAD_CORE_RESPONSE,
} from '../constants';
import generateResponse from '../utils/generateResponse';
import {
  regexResult,
  verifyOutput,
  errorCatchHandler } from '../helpers';

const addPullStats = (response) => {
  if (!response.raw) {
    //TODO
    return {};
  }

  const statLine = R.pipe(
    R.split('Git LFS:'),
    R.reject(R.isEmpty),
    R.head
  )(response.raw);

  const byteResults = statLine.match(regex.TOTAL_BYTES);

  const totalBytesPulled =
    byteResults !== null
      ? byteResults[0].trim()
      : BAD_REGEX_PARSE_RESULT;

  const totalBytes =
    byteResults !== null
      ? byteResults[1].trim()
      : BAD_REGEX_PARSE_RESULT;

  const fileResults = statLine.match(regex.TOTAL_FILES);

  const totalFilesPulled =
    fileResults !== null
      ? fileResults[0].trim()
      : BAD_REGEX_PARSE_RESULT;

  const skippedByteResults = statLine.match(regex.SKIPPED_BYTES);

  const totalBytesSkipped =
    skippedByteResults !== null
      ? skippedByteResults[0].trim()
      : BAD_REGEX_PARSE_RESULT;

  const skippedFileResults = statLine.match(regex.SKIPPED_FILES);

  const totalFilesSkipped =
    skippedFileResults !== null
      ? skippedFileResults[0].trim()
      : BAD_REGEX_PARSE_RESULT;

  const stats = {
    total_bytes: totalBytes,
    total_bytes_pulled: totalBytesPulled,
    total_bytes_skipped: totalBytesSkipped,
    total_files_pulled: totalFilesPulled,
    total_files_skipped: totalFilesSkipped
  };

  if (verifyOutput(stats)) {
    return {
      ...response,
      pull: stats
    };
  }

  const stderr =
    statLine.includes('error:')
      ? statLine.split('error:')[1].trim()
      : '';
  return {
    ...response,
    errno: BAD_CORE_RESPONSE,
    stderr,
    success: false
  };
};

export default (repo, options = {}) => {
  const {
    remoteName,
    branchName,
    callback,
  } = options;

  const args = [];

  if (remoteName) {
    args.push(remoteName);
  }
  if (branchName) {
    args.push(branchName);
  }
  const argsString = R.join(' ', args);

  return core.pull(argsString, { cwd: repoPath, shell: true }, callback)
    .then(
      ({ stdout }) => addPullStats({
        ...generateResponse(),
        raw: stdout
      }),
      errorCatchHandler
    );
};