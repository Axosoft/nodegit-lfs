import { spawn as nodeSpawn } from 'child_process';
import defaultShell from 'default-shell';
import { EOL } from 'os';
import net from 'net';
import R from 'ramda';
import path from 'path';
import * as pty from 'node-pty';
import _tmp from 'tmp';
import promisify from 'promisify-node';

import { regex, promptTypes } from '../constants';

const tmp = promisify(_tmp);
// Cleanup even when there are errors
tmp.setGracefulCleanup();

const IS_WINDOWS = process.platform === 'win32';

const buildSocketPath = () => tmp.dir()
  .then((tmpPath) => {
    const prefix = IS_WINDOWS ? '\\\\.\\pipe' : '';
    let cleanedPath = IS_WINDOWS ? tmpPath.replace('C:\\', '') : tmpPath;
    cleanedPath = cleanedPath.replace('.tmp', '');
    return path.join(prefix, cleanedPath, 'echo.sock');
  });

const buildCredentialsCallbackProcess = (spawnedProcess, callback, reject) => {
  const credentialsCallback = promptType => (username, password, cancel) => {
    if (cancel) {
      // we are done here
      spawnedProcess.destroy();
      return reject(new Error('LFS action cancelled'));
    }

    spawnedProcess.write(
      promptType === promptTypes.USERNAME
        ? username
        : password);
    spawnedProcess.write(EOL);
  };

  return (chunk) => {
    const output = chunk.toString().trim().toLowerCase();

    if (output.match(regex.USERNAME)) {
      callback(output, credentialsCallback(promptTypes.USERNAME));
    } else if (output.match(regex.PASSWORD)) {
      callback(output, credentialsCallback(promptTypes.PASSWORD));
    } else if (output.match(regex.PASSPHRASE)) {
      callback(output, credentialsCallback(promptTypes.PASSPHRASE));
    }
    return output;
  };
};

const buildSocket = (size, closeProcess, socketName, mainResolve, mainReject) => new Promise(
  (resolve, reject) => {
    const bufferList = [];
    let currentSize = 0;
    let shouldReject = false; // in case an error is thrown but it is null or undefined
    let error;
    let rejectionHandler;

    const handleErrorWith = _rejectionHandler => (_error) => {
      error = _error;
      rejectionHandler = _rejectionHandler;
      shouldReject = true;
    };

    const closed = () => {
      closeProcess();

      if (shouldReject) {
        rejectionHandler(error);
        return;
      }

      mainResolve({ stdout: Buffer.concat(bufferList) });
    };

    const socketServer = net.createServer((socket) => {
      socket.on('close', closed);
      socket.on('data', (data) => {
        currentSize += data.length;
        bufferList.push(data);
        if (currentSize === size) {
          socketServer.close(() => {});
        }
      });
      socket.on('error', handleErrorWith(mainReject));
    });
    socketServer.listen(socketName);
    socketServer.on('listening', () => {
      resolve(socketName);
    });
    socketServer.on('error', handleErrorWith(reject));
    socketServer.on('close', closed);
  });

export const spawnShell = (command, opts, size, callback) => new Promise(
  (resolve, reject) => {
    let spawnedProcess;
    const destroyProcess = () => spawnedProcess.destroy();
    return buildSocketPath()
      .then(socket => buildSocket(size, destroyProcess, socket, resolve, reject))
      .then((socketName) => {
        const options = R.mergeDeepRight(opts, { env: process.env, encoding: null });

        spawnedProcess = pty.spawn(defaultShell, [], options);

        const processChunk = callback && typeof callback === 'function'
          ? buildCredentialsCallbackProcess(spawnedProcess, callback, reject)
          : chunk => chunk.toString();

        const commandSuffix = IS_WINDOWS
          ? ` >${socketName}`
          : ` | nc -U ${socketName}`;

        spawnedProcess.write(`${command}${commandSuffix}`);
        spawnedProcess.write(EOL);

        spawnedProcess.on('data', (data) => {
          processChunk(data);
        });

        spawnedProcess.on('error', reject);
      })
      .catch(reject);
  });

export const winSpawn = (command, input, opts) => new Promise(
  (resolve, reject) => {
    const options = R.mergeDeepRight(opts, { env: process.env, shell: true });

    const argList = command.trim().split(' ');
    const cmd = argList.shift();
    const args = argList;

    const spawnedProcess = nodeSpawn(cmd, args, options);

    const bufferList = [];
    spawnedProcess.stdout.on('data', (data) => {
      bufferList.push(data);
    });

    const closeOrExit = (code = 0) => resolve({
      code,
      stdout: Buffer.concat(bufferList),
    });

    spawnedProcess.on('close', closeOrExit);
    spawnedProcess.on('exit', closeOrExit);
    spawnedProcess.stderr.on('data', (data) => {
      reject(new Error(data.toString()));
    });

    spawnedProcess.stdin.write(input);
    spawnedProcess.stdin.write(EOL);
  }
);

const spawn = (command, opts, callback) => new Promise(
  (resolve, reject) => {
    const options = R.mergeDeepRight(opts, { env: process.env });

    const argList = command.trim().split(' ');
    const cmd = argList.shift() + (IS_WINDOWS ? '.exe' : '');
    const args = argList;

    let stdout = '';
    const spawnedProcess = pty.spawn(cmd, args, options);

    const processChunk = callback && typeof callback === 'function'
      ? buildCredentialsCallbackProcess(spawnedProcess, callback, reject)
      : chunk => chunk.toString();

    spawnedProcess.on('data', (data) => {
      stdout += processChunk(data);
    });

    let shouldReject = false; // in case an error is thrown but it is null or undefined
    let error;
    spawnedProcess.on('error', (_error) => {
      error = _error;
      shouldReject = true;
    });
    spawnedProcess.on('exit', (code = 0) => {
      // without this call, we will leave winpty-agents around.
      spawnedProcess.destroy();

      if (shouldReject) {
        reject(error);
        return;
      }

      resolve({
        code,
        stdout,
      });
    });
  });

export default spawn;
