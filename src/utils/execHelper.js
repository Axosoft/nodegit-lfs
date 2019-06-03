import child from 'child_process';
import R from 'ramda';

const exec = (command, input, options = {}) => new Promise(
  (resolve, reject) => {
    if (process.platform !== 'win32' && !R.contains('/usr/local/bin', options.env.PATH)) {
      options.env.PATH = `${options.env.PATH}${':/usr/local/bin'}`;
    }

    const proc = child.exec(command, options, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ proc, stdout, stderr });
      }
    });

    if (input) {
      proc.stdin.write(input);
      proc.stdin.end();
    }
  });

export default exec;
