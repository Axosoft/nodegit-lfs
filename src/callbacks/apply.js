import { EOL } from 'os';
import fse from 'fs-extra';
import path from 'path';
import { Error } from '../constants';
import { spawnShell } from '../utils/spawnHelper';
import exec from '../utils/execHelper';

const clean = (to, from, source) => {
  const ticks = process.platform === 'win32' ? '"' : '\'';
  const workdir = source.repo().workdir();
  const filePath = path.join(workdir, source.path());
  const command = `git lfs clean ${source.path()}`;

  return fse.readFile(filePath)
    .then(buf => exec(command, buf, { cwd: workdir }))
    .then(({ stdout }) => {
      const sha = new Buffer(stdout);
      return to.set(sha, sha.length).then(() => Error.CODE.OK);
    });
};

const smudge = (to, from, source) => {
  const workdir = source.repo().workdir();

  const fakecb = (cb) => {
    console.log('we did it!');
    cb('admin', 'admin', false);
  };

  const parts = source.path().split('/');
  const filepath = parts[parts.length - 1];
  const ptr = from.ptr();
  const ptrparts = ptr.split(EOL);
  const sizeLine = ptrparts[ptrparts.length - 2];
  const idx = sizeLine.indexOf('size ') + 5;
  const size = Number(sizeLine.substring(idx).trim());

  return spawnShell(`echo -ne "${ptr}" | git lfs smudge ${filepath}`, { cwd: workdir }, size, `git lfs smudge ${filepath}`, fakecb)
    .then(({ stdout }) => {
      // const sha = new Buffer(stdout);
      return to.set(stdout, stdout.length).then(() => Error.CODE.OK);
    })
    .catch((e) => {
      console.log(e);
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
