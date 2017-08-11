import cp from 'child_process';
import { Error } from 'nodegit';

const clean = (to, from, source) => {
  const workdir = source.repo().workdir();
  const command = `cat ${source.path()} | git lfs clean ${source.path()}`;

  // also does not work with async
  const stdout = cp.execSync(command, { cwd: workdir });
  const sha = new Buffer(stdout);
  return to.set(sha, sha.length).then(() => Error.CODE.OK);
};

const smudge = (to, from, source) => {
  const workdir = source.repo().workdir();

  // for some reason I have not gotten this to work with async
  const stdout = cp.execSync('git lfs smudge', { cwd: workdir, input: from.ptr() });
  const sha = new Buffer(stdout);

  return to.set(sha, sha.length).then(() => Error.CODE.OK);
};

const apply = (to, from, source) => {
  const mode = source.mode();

  let filterPromise;
  if (mode === 1) {
    filterPromise = clean(to, from, source);
  } else if (mode === 0) {
    filterPromise = smudge(to, from, source);
  }

  return filterPromise
    .then(() => Error.CODE.OK)
    .catch(() => Error.CODE.PASSTHROUGH);
};

export { apply };
