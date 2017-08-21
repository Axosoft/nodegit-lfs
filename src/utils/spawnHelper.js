import defaultShell from 'default-shell';
import { EOL } from 'os';
import net from 'net';
import R from 'ramda';
import path from 'path';
import * as pty from 'node-pty';
import _tmp from 'tmp';
import promisify from 'promisify-node';

import { regex } from '../constants';

const tmp = promisify(_tmp);

const IS_WINDOWS = process.platform === 'win32';

const buildSocketPath = () => tmp.dir()
  .then(tmpPath => tmp.file()
    .then((tmpFile) => {
      const prefix = IS_WINDOWS ? '\\\\.\\pipe' : '';
      return path.join(prefix, tmpPath, tmpFile);
    }));

const buildCredentialsCallbackProcess = (spawnedProcess, callback, reject) => {
  let credentials = {};
  const credentialsCallback = (username, password, cancel) => {
    if (cancel) {
      // we are done here
      spawnedProcess.destroy();
      return reject(new Error('LFS action cancelled'));
    }

    credentials = { username, password };
    spawnedProcess.write(credentials.username);
    spawnedProcess.write(EOL);
  };

  return (chunk) => {
    const output = chunk.toString();

    if (output.match(regex.USERNAME)) {
      if (credentials.username) {
        spawnedProcess.write(credentials.username);
        spawnedProcess.write(EOL);
      } else {
        callback(credentialsCallback);
      }
    } else if (output.match(regex.PASSWORD)) {
      const password = credentials.password || EOL;
      spawnedProcess.write(password);
      spawnedProcess.write(EOL);
    }
    return output;
  };
};

const buildSocket = (size, closeProcess, socketName, mainResolve, mainReject) => new Promise(
  (resolve, reject) => {
    const bufferList = [];
    let currentSize = 0;
    let resolved = false;

    const closedOrEnded = () => {
      // For some reason this fires twice so after
      // the first fire let's move on
      if (!resolved) {
        mainResolve({ stdout: Buffer.concat(bufferList) });
        resolved = true;
        closeProcess();
      }
    };

    const socketServer = net.createServer((socket) => {
      socket.on('end', closedOrEnded);
      socket.on('close', closedOrEnded);
      socket.on('data', (data) => {
        currentSize += data.length;
        bufferList.push(data);
        if (currentSize === size) {
          socketServer.close(() => {});
        }
      });
      socket.on('error', mainReject);
    });
    socketServer.listen(socketName);
    socketServer.on('listening', () => resolve(socketName));
    socketServer.on('error', reject);
    socketServer.on('close', closedOrEnded);
  });

export const spawnShell = (command, opts, size, callback) => new Promise(
  (resolve, reject) => {
    debugger;
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
      });
  });

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

    const closeOrExit = (code = 0) => resolve({
      code,
      stdout,
    });

    spawnedProcess.on('close', closeOrExit);
    spawnedProcess.on('exit', closeOrExit);
    spawnedProcess.on('error', reject);
  });

export default spawn;
