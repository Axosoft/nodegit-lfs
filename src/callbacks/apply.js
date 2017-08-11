import cp from 'child_process';
import { Error } from 'nodegit';
import fse from 'fs-extra';
import path from 'path';
import { exec } from '../utils/execHelpers';
import { exec as spawn } from '../utils/spawnHelper';

const clean = (to, from, source) => {
  debugger;
  const workdir = source.repo().workdir();
  const filePath = path.join(source.repo().workdir(), source.path());
  const command = 'git lfs clean';

  try {
    const buf = fse.readFileSync(filePath);
    // const stdout = cp.execSync(command, { env: process.env, cwd: workdir, input: buf, maxBuffer: buf.length * 2, shell: true })
    return spawn(command, { cwd: workdir, input: buf, shell: true })
      .then(({ stdout, stderr }) => {
        console.log(stdout);
        const sha = new Buffer(stdout);
        return to.set(sha, sha.length).then(() => Error.CODE.OK);
      })
      .catch((err) => {
        console.log(err);
      });
    // const sha = new Buffer(stdout);
    // return to.set(sha, sha.length).then(() => Error.CODE.OK);
  } catch (e) {
    return Error.CODE.PASSTHROUGH;
  }
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
