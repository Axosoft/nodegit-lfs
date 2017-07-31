import path from 'path';
import { core } from './lfsCommands';
import { BAD_CORE_RESPONSE } from '../constants';
import generateResponse from '../utils/generateResponse';

function checkout(repo, remoteArg, branchArg) {
  //eslint-disable-next-line
  let response = generateResponse();
  // repo.path() leads into workdir/.git
  const repoPath = path.join(repo.path(), '..');

  if (repo && branchArg && remoteArg) {
    return core.checkout(`${remoteArg} ${branchArg}`, { cwd: repoPath }).then(({ stdout, stderr }) => {
      response.raw = stdout;
      response.stderr = stderr;
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
      return core.checkout(`${remoteName} ${branch}`, { cwd: repo.path() });
    })
    .then(({ stdout, stderr }) => {
      response.raw = stdout;
      response.stderr = stderr;
      return response;
    })
    .catch((error) => {
      response.success = false;
      response.error = error.errno || BAD_CORE_RESPONSE;
      response.raw = error;
      return response;
    });
}

export default checkout;
