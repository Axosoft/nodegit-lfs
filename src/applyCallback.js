/* eslint-disable consistent-return */
import path from 'path';
import { exec } from './utils/execHelpers';

const apply = (to, from, source) => {
  console.log('Inside Apply');
  const mode = source.mode();
  /* Clean */
  if (mode === 1) {
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
    return console.log('Smudge Source Path: ', source.path());
  }
};

export { apply };
