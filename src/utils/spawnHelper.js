import child from 'child_process';
import { EOL } from 'os';
import R from 'ramda';
import { regex } from '../constants';

const sanitizeStringForStdin = str => `${str}${EOL}`;

const spawn = (command, opts, callback) => new Promise(
  (resolve, reject) => {
    let detached = false;
    if (process.platform === 'linux') {
      detached = true;
    }

    const options = R.mergeDeepRight(opts, { env: process.env, shell: true, detached });
    let args = [];
    let cmd = command;
    if (process.platform !== 'linux' && command.includes(' ')) {
      const argList = command.split(' ');
      cmd = argList.shift();
      args = argList;
    } else {
      let augmentedCommand = command;
      if (command === 'git lfs smudge') {
	augmentedCommand = `cat ${options.input} | ${command}`;
      }
      cmd = `script --return -c "${augmentedCommand}" /dev/null`;
    }

    let stdout = '';
    let stderr = '';
    let processChunk = chunk => chunk.toString();
    const spawnedProcess = child.spawn(cmd, args, options);

    /**
     * If provided with a callback, we will create a new callback which will take user
     * credentials and use the credentials in this scope.
     * Caller would need to hookup right credentials to the inner callback.
     */
    debugger;
    if (callback && typeof callback === 'function') {
      let credentials = {};
      const innerCb = (username, password, cancel) => {
        if (cancel) {
          // we are done here, hopefully this works
	  spawnedProcess.unref();
          spawnedProcess.kill();
	  return reject(new Error('LFS action cancelled'));
        }

        credentials = { username, password };
        spawnedProcess.stdin.write(Buffer.from(sanitizeStringForStdin(credentials.username)));
      };

      processChunk = (chunk) => {
        const output = chunk.toString();

        if (output.match(regex.USERNAME)) {
          callback(innerCb);
        } else if (output.match(regex.PASSWORD)) {
          const password = sanitizeStringForStdin(credentials.password) || EOL;
          spawnedProcess.stdin.write(Buffer.from(password));
        }

        return output;
      };
    }

    spawnedProcess.stdout.on('data', (data) => {
      stdout += processChunk(data);
    });
    spawnedProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    spawnedProcess.on('close', code => resolve({ code, stdout, stderr }));
    spawnedProcess.on('error', code => reject(code));
  });

export default spawn;
