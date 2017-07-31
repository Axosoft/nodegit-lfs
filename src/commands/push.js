// import { core } from './lfsCommands';

function push(repo) {
  //eslint-disable-next-line
  let reference, remoteRef, branch;
  // let branch;
  console.log('this: ', this.NodeGit.Repository);
  return repo.getCurrentBranch()
    .then((Reference) => {
      reference = Reference;
      // console.log('Ref name: ', Reference.name());
      // TODO: pester Tyler later about reference
      // return this.NodeGit.Remote.lookup(repo, reference);
      return this.NodeGit.Branch.upstream(Reference);
    })
    .then((RemoteRef) => {
      remoteRef = RemoteRef;
      console.log(RemoteRef.name());
      // return this.NodeGit.Branch.name(reference);
      return remoteRef.peel();
    })
    .then((branchName) => {
      branch = branchName;
      console.log('Branch: ', branchName);
      console.log('TEST: ', remoteRef.name());
      return this.NodeGit.Reference.peel(repo, remoteRef);
      // return this.NodeGit.Remote.lookup(repo, remoteRef.name());
    })
    .then((remote) => {
      console.log('New ref: ', remote);
    });
}

/* const push = (repo) => {
  // get the default remote / branch
  /* const remote = 'origin';
  const branch = 'master';
  const args = `${remote} ${branch}`;
  core.push(args) */
  /* console.log('Push called');
  return repo.getCurrentBranch()
    .then(reference => console.log(reference));
}; */

export default push;
