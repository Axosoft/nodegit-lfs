/* eslint-disable consistent-return */
import path from 'path';
import { exec } from './utils/execHelpers';

const apply = (to, from, source) => {
  const mode = source.mode();
  // const sourcePath = source.path();
  /* Clean */
  if (mode === 1) {
    console.log('Clean Path: ', source.path());
    const realPath = path.join(source.repo().workdir(), source.path());
    const command = `cat ${realPath} | git lfs clean`;

    return exec(command).then(({ stdout }) => {
      const sha = new Buffer(stdout);
      return to.set(sha, sha.length).then(() => 0);
    }).catch((err) => {
      console.log('\nFilter Error: ', err);
      return 0;
    });
  } /* Smudge */ else if (mode === 0) {
    return console.log('Smudge Path: ', source.path());
  }
};

export { apply };
