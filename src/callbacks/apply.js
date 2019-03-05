import fse from 'fs-extra';
import path from 'path';
import { Error } from '../constants';
import { spawnShell, winSpawn } from '../utils/spawnHelper';
import exec from '../utils/execHelper';

const IS_WINDOWS = process.platform === 'win32';
const ticks = IS_WINDOWS ? '"' : '\'';

const parseSize = (ptr) => {
  const idx = ptr.indexOf('size ') + 5;
  return Number(ptr.substring(idx).trim());
};

export default (credentialsCallback) => {
  const clean = (to, from, source) => source.repo()
    .then((repo) => {
      const workdir = repo.workdir();
      const filePath = path.join(workdir, source.path());
      const command = `git lfs clean ${ticks}${source.path()}${ticks}`;

      return fse.readFile(filePath)
        .then(buf => exec(command, buf, { cwd: workdir }));
    })
    .then(({ stdout }) => {
      const sha = new Buffer(stdout);
      return to.set(sha, sha.length);
    })
    .then(() => Error.CODE.OK);

  const smudge = (to, from, source) => source.repo()
    .then((repo) => {
      const workdir = repo.workdir();
      const parts = source.path().split('/');
      const filepath = parts[parts.length - 1];
      const ptr = from.ptr();
      const size = parseSize(ptr);
      const echo = IS_WINDOWS ? `echo|set /p="${ptr}"` : `echo -ne "${ptr}"`;

      const promise = IS_WINDOWS
        ? winSpawn(`git lfs smudge ${ticks}${filepath}${ticks}`, ptr, { cwd: workdir })
        : spawnShell(
          `${echo} | git lfs smudge ${ticks}${filepath}${ticks}`,
          { cwd: workdir },
          size,
          credentialsCallback
        );

      return promise;
    })
    .then(({ stdout }) => to.set(stdout, stdout.length))
    .then(() => Error.CODE.OK);

  let previousFilterPromise = Promise.resolve();

  return (to, from, source) => {
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
};
