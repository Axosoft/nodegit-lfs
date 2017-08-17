import fse from 'fs-extra';
import {
  spawn
} from 'child_process';

let serverPid = null;

const getWin32BashCommand = () => {
  let shPath = 'C:\\Program Files\\Git\\bin\\sh.exe';
  if (fse.pathExistsSync(shPath)) {
    return `"${shPath}" `;
  }

  shPath = 'C:\\Program Files (x86)\\Git\\bin\\sh.exe';
  if (!fse.pathExistsSync(shPath)) {
    throw new Error('Cannot find git-bash. Please install it in the Program Files directory');
  }

  return `"${shPath}" `;
};

export const start = () => {
  if (serverPid) {
    throw new Error('LFS test server has already been started!');
  }

  return new Promise((resolve, reject) => {
    const cmdRunner = process.platform === 'win32'
      ? getWin32BashCommand()
      : './';
    const server = spawn(`${cmdRunner}start.sh`, {
      cwd: __dirname,
      shell: true
    });
    server.stdout.on('data', (data) => {
      // Store outputted server PID
      const pid = data.toString().match(/pid=(\d+)/);
      if (pid) {
        serverPid = parseInt(pid[1], 10);
        return resolve();
      }

      // Handle Go errors
      const err = data.toString().match(/ err=(.*)/);
      if (err) {
        throw new Error(err[1]);
      }
    });
    server.stderr.on('data', (err) => {
      throw new Error(err.toString());
    });
  });
};

export const stop = () => {
  if (!serverPid) {
    throw new Error("LFS test server hasn't been started!");
  }

  process.kill(serverPid, 'SIGKILL');
};
