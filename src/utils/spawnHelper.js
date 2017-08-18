import child from 'child_process';
import { EOL } from 'os';
import R from 'ramda';
import * as pty from 'node-pty';
import { Writable } from 'stream';
import { regex } from '../constants';

const IS_WINDOWS = process.platform === 'win32';

const sanitizeStringForStdin = str => (str && str.endsWith(EOL) ? str : `${str}${EOL}`);
const trimNixOutput = (output, command) => {
  if (!output || IS_WINDOWS) {
    return output;
  }

  return R.pipe(
    R.split(EOL),
    R.filter((line) => {
      if (!line) {
        return true;
      }

      const normalLine = line.toLowerCase();
      if (R.contains(command, normalLine) ||
          R.contains('downloading', normalLine) ||
          R.contains('username', normalLine) ||
          R.contains('password', normalLine)) {
        return false;
      }
      return true;
    }),
    R.join(EOL)
  )(output.replace(/\$/, '')).trim();
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
      // we are done here
      spawnedProcess.destroy();
      return reject(new Error('LFS action cancelled'));
    }

    credentials = { username, password };
    spawnedProcess.write(sanitizeStringForStdin(credentials.username));
  };

  return (chunk) => {
    const output = chunk.toString();

    if (output.match(regex.USERNAME)) {
      if (credentials.username) {
        spawnedProcess.write(sanitizeStringForStdin(credentials.username));
      } else {
        callback(credentialsCallback);
      }
    } else if (output.match(regex.PASSWORD)) {
      const password = sanitizeStringForStdin(credentials.password) || EOL;
      spawnedProcess.write(password);
    }

    return output;
  };
};

export const spawnShell = (command, opts, callback) => new Promise(
  (resolve, reject) => {
    debugger;
    try {
      const options = R.mergeDeepRight(opts, { env: process.env, encoding: null });
      // cmd = `script --return -c "${command}" /dev/null`;

      const stdout = Buffer.a;
      const spawnedProcess = pty.spawn('/bin/bash', ['-t', '-c', command], options);

      const processChunk = callback && typeof callback === 'function'
        ? buildCredentialsCallbackProcess(spawnedProcess, callback, reject)
        : chunk => chunk.toString();

      // spawnedProcess.write(command);
      // spawnedProcess.write(EOL);

      const bufferList = [];
      spawnedProcess.on('data', (data) => {
        const str = processChunk(data);

        if (R.contains('downloading', str) ||
        R.contains('username', str) ||
        R.contains('password', str)) {
          return;
        }

        bufferList.push(data);
      });

      const closeOrExit = (code = 0) => resolve({
        code,
        stdout: Buffer.concat(bufferList)
      });

      spawnedProcess.on('close', closeOrExit);
      spawnedProcess.on('exit', closeOrExit);
      spawnedProcess.on('error', err => {
        console.log(stdout);
        console.log('got an error but oh well!');
        reject(err);
      });
    } catch (e) {
      console.log(e);
    }
  });

const spawn = (command, opts, callback) => new Promise(
  (resolve, reject) => {
    const options = R.mergeDeepRight(opts, { env: process.env });

    const argList = command.trim().split(' ');
    const cmd = argList.shift();
    const args = argList;

    let stdout = '';
    const spawnedProcess = pty.spawn(cmd, args, options);

    const processChunk = callback && typeof callback === 'function'
      ? buildCredentialsCallbackProcess(spawnedProcess, callback, reject)
      : chunk => chunk.toString();

    spawnedProcess.on('data', (data) => {
      stdout += processChunk(data);
    });

    const closeOrExit = (code = 0) => resolve({
      code,
      stdout,
    });

    spawnedProcess.on('close', closeOrExit);
    spawnedProcess.on('exit', closeOrExit);
    spawnedProcess.on('error', err => {
      console.log(stdout);
      console.log(err);
      console.log('got an error but oh well!');
      //reject(err);
    });
  });

export default spawn;
