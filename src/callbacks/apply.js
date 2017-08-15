import cp from 'child_process';
import { Error } from 'nodegit';
import fse from 'fs-extra';
import path from 'path';

const clean = (to, from, source) => {
  const workdir = source.repo().workdir();
  const filePath = path.join(workdir, source.path());
  const command = `git lfs clean ${source.path()}`;

  // Does not work with async
  const buf = fse.readFileSync(filePath);
  const stdout = cp.execSync(command, { cwd: workdir, input: buf });
  const sha = new Buffer(stdout);
  return to.set(sha, sha.length).then(() => Error.CODE.OK);
};

const smudge = (to, from, source) => {
  // Does not work with async
  const stdout = cp.execSync('git lfs smudge', { cwd: source.repo().workdir(), input: from.ptr() });
  const sha = new Buffer(stdout);

  return to.set(sha, sha.length).then(() => Error.CODE.OK);
};

export const apply = (to, from, source) => {
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
