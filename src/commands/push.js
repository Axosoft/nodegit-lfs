import R from 'ramda';
import { core } from './lfsCommands';
import {
  regex,
  BAD_REGEX_PARSE_RESULT,
} from '../constants';
import generateResponse from '../utils/generateResponse';
import {
  regexResult,
  errorCatchHandler,
  verifyOutput
} from '../helpers';

/**
 * Note to future maintainers, I do not like this; at all. But at the moment this is the
 * best we got, inorder to parse the result from git core. Any slight change to the LFS output
 * in subsequent versions of CORE for LFS, will surely break this. Until we migrate off
 * git core dependency, we will have to regex the output. Godspeed.
 */

const isValidLine = (str) => str !== '';

const generatePushStats = (raw) => {
  if (!raw || typeof raw !== 'string') {
    return {
      error: 'invalid output',
    };
  }
  const stats = {};

  const outputLines = raw.split('Git LFS:');
  const filteredLines = R.filter(isValidLine, outputLines);
  const statLine = filteredLines.pop();

  const byteResults = regexResult(statLine, regex.TOTAL_BYTES);

  stats.total_bytes_transferred = byteResults !== null
    ? byteResults[0].trim()
    : BAD_REGEX_PARSE_RESULT;

  stats.total_bytes = byteResults !== null
    ? byteResults[1].trim()
    : BAD_REGEX_PARSE_RESULT;

  const fileResults = regexResult(statLine, regex.TOTAL_FILES);

  stats.total_files_transferred = fileResults !== null
    ? fileResults[0].trim()
    : BAD_REGEX_PARSE_RESULT;

  const skippedByteResults = regexResult(statLine, regex.SKIPPED_BYTES);

  stats.total_bytes_skipped = skippedByteResults !== null
    ? skippedByteResults[0].trim()
    : BAD_REGEX_PARSE_RESULT;

  const skippedFileResults = regexResult(statLine, regex.SKIPPED_FILES);

  stats.total_files_skipped = skippedFileResults !== null
    ? skippedFileResults[0].trim()
    : BAD_REGEX_PARSE_RESULT;

  verifyOutput(stats, raw);

  if (statLine.includes('error:')) {
    stats.error = statLine.split('error:')[1].trim();
  }

  return stats;
};

function push(repo, options) {
  const response = generateResponse();
  const repoPath = repo.workdir();

  const {
    remoteName,
    branchName,
    callback,
    shellOptions
  } = (options || {});

  let branch = branchName;
  let remote = remoteName;
  let getRemoteAndBranchPromise = Promise.resolve();

  if (!remote || !branch) {
    let remoteRef;
    getRemoteAndBranchPromise = repo.getCurrentBranch()
      .then((Reference) => {
        const promises = [];
        promises.push(this.NodeGit.Branch.upstream(Reference));
        promises.push(this.NodeGit.Branch.name(Reference));
        return Promise.all(promises);
      })
      .then((results) => {
        ([remoteRef] = results);
        branch = branch || results[1];
        return this.NodeGit.Branch.remoteName(repo, remoteRef.name());
      })
      .then((name) => {
        remote = remote || name;
        return Promise.resolve();
      });
  }

  return getRemoteAndBranchPromise
    .then(() => core.push(`${remote} ${branch}`, R.mergeDeepRight(shellOptions, { cwd: repoPath }), repoPath, callback))
    .then(({ stdout }) => {
      response.raw = stdout;
      response.push = generatePushStats(stdout);
      return response;
    }, errorCatchHandler(response));
}

export default push;
