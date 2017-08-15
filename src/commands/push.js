import R from 'ramda';
import { core } from './lfsCommands';
import {
  regex,
  BAD_CORE_RESPONSE,
  BAD_REGEX_PARSE_RESULT,
} from '../constants';
import generateResponse from '../utils/generateResponse';
import { regexResult } from '../helpers';

/**
 * Note to future maintainers, I do not like this; at all. But at the moment this is the
 * best we got, inorder to parse the result from git core. Any slight change to the LFS output
 * in subsequent versions of CORE for LFS, will surely break this. Until we migrate off
 * git core dependency, we will have to regex the output. Godspeed.
 */

const isValidLine = str => str !== '';

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

  // We need to handle this manually because LFS isn't returning stderr
  const props = Object.keys(stats);
  const errCount = R.reduce((acc, p) => {
    if (p === BAD_REGEX_PARSE_RESULT) {
      acc += 1;
    }
    return acc;
  }, 0, props);

  // We have all errors
  if (errCount === props.length) {
    const e = new Error(raw);
    e.errno = BAD_CORE_RESPONSE;
    throw e;
  }

  if (statLine.includes('error:')) {
    stats.error = statLine.split('error:')[1].trim();
  }

  return stats;
};

function push(repo, options) {
  const response = generateResponse();

  const {
    remoteName,
    branchName,
    callback,
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
        remoteRef = results[0];
        branch = branch || results[1];
        return this.NodeGit.Branch.remoteName(repo, remoteRef.name());
      })
      .then((name) => {
        remote = remote || name;
        return Promise.resolve();
      });
  }

  return getRemoteAndBranchPromise
    .then(() => core.push(`${remote} ${branch}`, { cwd: repo.workdir() }, callback))
    .then(({ stdout, stderr }) => {
      response.raw = stdout;

      if (stderr) {
        response.stderr = stderr;
        response.errno = BAD_CORE_RESPONSE;
        response.success = false;
        return response;
      }

      response.push = generatePushStats(stdout);
      return response;
    })
    .catch((err) => {
      // This is a manually detected error we get from LFS
      if (err.errno === BAD_CORE_RESPONSE) {
        response.stderr = response.raw;
        response.errno = BAD_CORE_RESPONSE;
        response.success = false;
        return response;
      }

      throw err;
    });
}

export default push;
