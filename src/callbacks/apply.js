import { Error } from 'nodegit';
import fse from 'fs-extra';
import path from 'path';
import exec from '../utils/execHelper';

const clean = (to, from, source) => {
  const workdir = source.repo().workdir();
  const filePath = path.join(workdir, source.path());
  const command = `git lfs clean ${source.path()}`;

  return fse.readFile(filePath)
    .then(buf => exec(command, buf, { cwd: workdir, detached: true }))
    .then(({ stdout }) => {
      const sha = new Buffer(stdout);
      return to.set(sha, sha.length).then(() => Error.CODE.OK);
    });
};

const smudge = (to, from, source) => {
  const workdir = source.repo().workdir();

  return exec('git lfs smudge', from.ptr(), { cwd: workdir })
    .then(({ stdout }) => {
      const sha = new Buffer(stdout);
      return to.set(sha, sha.length).then(() => Error.CODE.OK);
    });
};

let previousFilterPromise = Promise.resolve();

export const apply = (to, from, source) => {
  const mode = source.mode();

  const runNextFilter = () => Promise.resolve()
    .then(() => {
      if (mode === 1) {
        return clean(to, from, source);
      }
      return smudge(to, from, source);
    })
    .then(
      () => Error.CODE.OK,
      () => Error.CODE.PASSTHROUGH
    );

  previousFilterPromise = previousFilterPromise
    .then(runNextFilter, runNextFilter);

  return previousFilterPromise;
};
