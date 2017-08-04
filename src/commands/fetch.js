import R from 'ramda';
import { core } from './lfsCommands';
import {
  regex,
  BAD_CORE_RESPONSE,
  BAD_REGEX_PARSE_RESULT,
} from '../constants';
import generateResponse from '../utils/generateResponse';

// FIXME: refactor this to util
import { regexResult } from './push';

const isValidLine = str => str !== '';

const generateFetchStats = (raw) => {
  if (raw && typeof raw === 'string') {
    //eslint-disable-next-line
    let stats = {};

    const outputLines = raw.split('Git LFS:');
    const filteredLines = R.filter(isValidLine, outputLines);
    const statLine = filteredLines.pop();

    const byteResults = regexResult(statLine, regex.TOTAL_BYTES);

    stats.total_bytes_fetched =
      byteResults !== null ?
        byteResults[0].trim() : BAD_REGEX_PARSE_RESULT;

    stats.total_bytes =
      byteResults !== null ?
        byteResults[1].trim() : BAD_REGEX_PARSE_RESULT;

    const fileResults = regexResult(statLine, regex.TOTAL_FILES);

    stats.total_files_fetched =
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
      stats.fetch_error = statLine.split('error:')[1].trim();
    }

    return stats;
  }
  return {};
};

function fetch(repo, remoteArg, branchArg) {
  //eslint-disable-next-line
  let response = generateResponse();
  const repoPath = repo.workdir();

  if (branchArg && remoteArg) {
    return core.fetch(`${remoteArg} ${branchArg}`, { cwd: repoPath }).then(({ stdout, stderr }) => {
      response.raw = stdout;
      response.stderr = stderr;
      response.fetch = generateFetchStats(stdout);
      return response;
    }).catch((error) => {
      response.success = false;
      response.error = error.errno || BAD_CORE_RESPONSE;
      response.raw = error;
      return response;
    });
  }

  let remoteRef;
  //eslint-disable-next-line
  let branch;
  let remoteName;

  return repo.getCurrentBranch()
    .then((Reference) => {
      //eslint-disable-next-line
      let promises = [];
      promises.push(this.NodeGit.Branch.upstream(Reference));
      promises.push(this.NodeGit.Branch.name(Reference));
      return Promise.all(promises);
    })
    .then((results) => {
      remoteRef = results[0];
      branch = branchArg || results[1];
      //eslint-disable-next-line
      return this.NodeGit.Branch.remoteName(repo, remoteRef.name());
    })
    .then((name) => {
      remoteName = remoteArg || name;
      return core.fetch(`${remoteName} ${branch}`, { cwd: repoPath });
    })
    .then(({ stdout, stderr }) => {
      response.raw = stdout;
      response.stderr = stderr;
      response.fetch = generateFetchStats(stdout);
      return response;
    })
    .catch((error) => {
      response.success = false;
      response.error = error.errno || BAD_CORE_RESPONSE;
      response.raw = error;
      return response;
    });
}

export default fetch;
