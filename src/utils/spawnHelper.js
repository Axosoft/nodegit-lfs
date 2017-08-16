import child from 'child_process';
import pty from 'pty.js';
import { EOL } from 'os';
import R from 'ramda';
import { regex } from '../constants';

const sanitizeStringForStdin = str => (str && str.endsWith(EOL) ? str : `${str}${EOL}`);
const trimLinuxOutput = (output) => {
  if (!output || process.platform !== 'linux') {
    return output;
  }

  return R.pipe(
    R.split(EOL),
    R.filter((line) => {
      if (!line) {
        return true;
      }

      const normalLine = line.toLowerCase();
      if (R.contains('script started, file is /dev/null', normalLine) ||
          R.contains('script done, file is /dev/null', normalLine)) {
        return false;
      }
      return true;
    }),
    R.join(EOL)
  )(output);
};

/**
 * If provided with a callback, we will create a new callback which will take user
 * credentials and use the credentials in this scope.
 * Caller would need to hookup right credentials to the inner callback.
 */
const buildCredentialsCallbackProcess = (spawnedProcess, callback, reject) => {
  let credentials = {};
  const credentialsCallback = (username, password, cancel) => {
    if (cancel) {
      // we are done here, hopefully this works
      spawnedProcess.unref();
      spawnedProcess.kill();
      return reject(new Error('LFS action cancelled'));
    }

    credentials = { username, password };
    spawnedProcess.stdin.write(sanitizeStringForStdin(credentials.username));
  };

  return (chunk) => {
    const output = chunk.toString();

    if (output.match(regex.USERNAME)) {
      if (credentials.username) {
        spawnedProcess.stdin.write(sanitizeStringForStdin(credentials.username));
      } else {
        callback(credentialsCallback);
      }
    } else if (output.match(regex.PASSWORD)) {
      const password = sanitizeStringForStdin(credentials.password) || EOL;
      spawnedProcess.stdin.write(password);
      spawnedProcess.stdin.end();
    }

    return output;
  };
};

const spawn = (command, opts, callback) => new Promise(
  (resolve, reject) => {
    const detached = process.platform === 'linux';
    const options = R.mergeDeepRight(opts, { env: process.env, shell: true, detached });

    const input = options.input;
    delete options.input;

    let args = [];
    let cmd = command;
    if (process.platform !== 'linux' && command.includes(' ')) {
      const argList = command.split(' ');
      cmd = argList.shift();
      args = argList;
    } else {
      cmd = `script --return -c "${command}" /dev/null`;
    }

    let stdout = '';
    let stderr = '';
    const spawnedProcess = child.spawn(cmd, args, options);

    const processChunk = callback && typeof callback === 'function'
      ? buildCredentialsCallbackProcess(spawnedProcess, callback, reject)
      : chunk => chunk.toString();

    spawnedProcess.stdout.on('data', (data) => {
      stdout += processChunk(data);
    });
    spawnedProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    spawnedProcess.on('close', code => resolve({
      code,
      stdout: trimLinuxOutput(stdout),
      stderr: trimLinuxOutput(stderr)
    }));
    spawnedProcess.on('error', err => reject(err));

    if (input) {
      spawnedProcess.stdin.write(input);
      spawnedProcess.stdin.end();
    }
  });

export default spawn;
