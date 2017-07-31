import { core } from './lfsCommands';
import { BAD_CORE_RESPONSE } from '../constants';
import generateResponse from '../utils/generateResponse';

function fetch(repo, remoteArg, branchArg) {
  //eslint-disable-next-line
  let response = generateResponse();

  if (repo && branchArg && remoteArg) {
    return core.fetch(`${remoteArg} ${branchArg}`, { cwd: repo.path() }).then(({ stdout, stderr }) => {
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
      return core.fetch(`${remoteName} ${branch}`, { cwd: repo.path() });
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

export default fetch;
