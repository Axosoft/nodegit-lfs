import child from 'child_process';

const exec = (command, input, opts) => new Promise(
  (resolve, reject) => {
    const proc = child.exec(command, opts, (err, stdout, stderr) => {
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
