import child from 'child_process';

const exec = (command, opts) => new Promise(
  (resolve, reject) => {
    /* const proc = child.exec(command, opts, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ proc, stdout, stderr });
      }
    }); */
    let stdout = '';
    let stderr = '';

    if (command.includes(' ')) {
      //eslint-disable-next-line
      let argList = command.split(' ');
      const bin = argList.shift();
      const args = argList;
      const process = child.spawn(bin, args, opts);
      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      process.on('close', code => resolve({ code, stdout, stderr }));
      process.on('error', code => reject(code));
    } else {
      const process = child.spawn(command, opts);
      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      process.on('close', code => resolve({ code, stdout, stderr }));
      process.on('error', code => reject(code));
    }
  });

export {
  exec,
};
