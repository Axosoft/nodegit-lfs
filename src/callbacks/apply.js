import fse from 'fs-extra';
import path from 'path';
import { Error } from '../constants';
import spawn from '../utils/spawnHelper';
import exec from '../utils/execHelper';

const IS_WINDOWS = process.platform === 'win32';
const ticks = IS_WINDOWS ? '"' : '\'';

export default (credentialsCallback) => {
  const clean = (to, from, source) => source.repo()
    .then((repo) => {
      const workdir = repo.workdir();
      const filePath = path.join(workdir, source.path());
      const command = `git lfs clean ${ticks}${source.path()}${ticks}`;

      return fse.readFile(filePath)
        .then((buf) => exec(command, buf, { cwd: workdir }));
    })
    .then(({ stdout }) => {
      const sha = Buffer.from(stdout);
      return to.set(sha, sha.length);
    })
    .then(() => Error.CODE.OK);

  const smudge = (to, from, source) => source.repo()
    .then((repo) => {
      const workdir = repo.workdir();
      const parts = source.path().split('/');
      const filepath = parts[parts.length - 1];
      const ptr = from.ptr();

      const promise = spawn(
        `git lfs smudge ${ticks}${filepath}${ticks}`,
        ptr,
        { cwd: workdir },
        credentialsCallback,
        workdir
      );

      return promise;
    })
    .then(({ stdout }) => to.set(stdout, stdout.length))
    .then(() => Error.CODE.OK);

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

    return runNextFilter();
  };
};
