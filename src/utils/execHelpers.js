import child from 'child_process';

const exec = (command, opts) => new Promise(
  (resolve, reject) => {
    const proc = child.exec(command, opts, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        // console.log('FILTER STDOUT: ', stdout);
        resolve({ proc, stdout, stderr });
      }
    });
  });

export {
  exec,
};
