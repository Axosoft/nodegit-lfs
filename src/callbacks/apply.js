import { Error } from 'nodegit';
import { exec } from '../utils/execHelpers';

const clean = (to, from, source) => {
  const workdir = source.repo().workdir();
  const command = `cat ${source.path()} | git lfs clean`;

  return exec(command, { cwd: workdir })
    .then(({ stdout }) => {
      const sha = new Buffer(stdout);
      return to.set(sha, sha.length).then(() => 0);
    });
};

const smudge = (to, from, source) => {
  console.log('smudging ', source.path());
  const workdir = source.repo().workdir();
  const command = `cat ${source.path()} | git lfs smudge`;

  return exec(command, { cwd: workdir })
    .then(({ stdout }) => {
      console.log('STDOUT ', stdout.toString());
      const sha = new Buffer(stdout);
      return to.set(sha, sha.length).then(() => 0);
    });
};

const apply = (to, from, source) => {
  const mode = source.mode();
  console.log('applying mode for smudge ', mode);
  console.log(source);
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
