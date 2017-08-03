import child from 'child_process';
import { regex } from '../constants';

const sanitizeStringForStdin = str => `${str}\r\n`;

const exec = (command, opts, callback) => new Promise(
  (resolve, reject) => {
    let stdout = '';
    let stderr = '';
    let process;
    if (command.includes(' ')) {
      //eslint-disable-next-line
      let argList = command.split(' ');
      const bin = argList.shift();
      const args = argList;
      process = child.spawn(bin, args, opts);
    } else {
      process = child.spawn(command, opts);
    }

    if (callback && typeof callback === 'function') {
      let credentials = {};

      process.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        console.log('[DEBUG]output: ', output);
        if (output.match(regex.USERNAME)) {
          //eslint-disable-next-line
          const innerCb = (username, password) => {
            credentials = { username, password };
            process.stdin.write(Buffer.from(sanitizeStringForStdin(credentials.username)));
          };

          callback(innerCb);
        } else if (output.match(regex.PASSWORD)) {
          const password = sanitizeStringForStdin(credentials.password) || '\r\n';
          process.stdin.write(Buffer.from(password));
        }
      });
    } else {
      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });
    }
    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    process.on('close', code => resolve({ code, stdout, stderr }));
    process.on('error', code => reject(code));
  });

export {
  exec,
};
