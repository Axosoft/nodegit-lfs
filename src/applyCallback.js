import path from 'path';
import { exec } from './utils/execHelpers';

const apply = (to, from, source) => {
  const realPath = path.join(source.repo().workdir(), source.path());
  const command = `cat ${realPath} | git lfs clean`;

  return exec(command).then(({ stdout }) => {
    const sha = new Buffer(stdout);
    return to.set(sha, sha.length).then(() => 0);
  }).catch((err) => {
    console.log('Filter Error: ', err);
    return 0;
  });
};

export { apply };
