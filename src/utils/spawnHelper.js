import child from 'child_process';
import { EOL } from 'os';
import { regex } from '../constants';

const sanitizeStringForStdin = str => `${str}${EOL}`;

const exec = (command, opts, callback) => new Promise(
  (resolve, reject) => {
    const options = Object.assign({}, opts, { shell: true });
    let args = [];
    let cmd = command;
    if (command.includes(' ')) {
      const argList = command.split(' ');
      cmd = argList.shift();
      args = argList;
    }

    let stdout = '';
    let stderr = '';
    let processChunk = chunk => chunk.toString();
    const process = child.spawn(cmd, args, options);

    /**
     * If provided with a callback, we will create a new callback which will take user
     * credentials and use the credentials in this scope.
     * Caller would need to hookup right credentials to the inner callback.
     */
    if (callback && typeof callback === 'function') {
      let credentials = {};
      const innerCb = (username, password, cancel) => {
        if (cancel) {
          // we are done here, hopefully this works
          process.kill();
        }

        credentials = { username, password };
        process.stdin.write(Buffer.from(sanitizeStringForStdin(credentials.username)));
      };

      processChunk = (chunk) => {
        const output = chunk.toString();

        if (output.match(regex.USERNAME)) {
          callback(innerCb);
        } else if (output.match(regex.PASSWORD)) {
          const password = sanitizeStringForStdin(credentials.password) || EOL;
          process.stdin.write(Buffer.from(password));
        }

        return output;
      };
    }

    process.stdout.on('data', (chunk) => {
      stdout += processChunk(chunk);
    });
    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    process.on('close', code => resolve({ code, stdout, stderr }));
    process.on('error', code => reject(code));
  });

export {
  exec,
};
