const child = require('child_process');

const exec = (command, opts) => new Promise(
  (resolve, reject) => {
    const proc = child.exec(command, opts, (err, stdout, stdin) => {
      if (err) {
        reject(err);
      } else {
        resolve(proc, stdout, stdin);
      }
    });
  });

module.exports = {
  exec,
};
