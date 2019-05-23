import { spawn as nodeSpawn } from 'child_process';
import path from 'path';
import R from 'ramda';
import {
  createCredRequestId,
  clearUsernameAndPassword,
  ensureAuthServer,
  getAuthServerPort,
  getNodeBinaryPath,
  storeUsernameAndPassword
} from './authService';

const spawnCommand = (command, opts, stdin) => new Promise((resolve, reject) => {
  const [cmd, ...args] = command.trim().split(' ');
  const childProcess = nodeSpawn(cmd, args, R.mergeDeepRight(opts, { stdio: 'pipe' }));

  const stdoutData = [];
  const stderrData = [];

  const makeDataAccumulator = accumulator => (data) => {
    accumulator.push(data);
  };

  childProcess.stdout.on('data', makeDataAccumulator(stdoutData));
  childProcess.stderr.on('data', makeDataAccumulator(stderrData));
  childProcess.on('error', () => {
    reject({ status: null, stdout: '', stderr: '' });
  });
  childProcess.on('close', (status) => {
    const stdout = Buffer.concat(stdoutData);
    const stderr = Buffer.concat(stderrData);
    resolve({ status, stdout, stderr });
  });

  childProcess.stdin.write(stdin);
  childProcess.stdin.end();
});

const spawn = async (command, opts, repoPath, callback, stdin = '') => {
  const noAuthResult = await spawnCommand(
    command,
    R.mergeDeepRight(
      opts,
      {
        env: {
          GIT_TERMINAL_PROMPT: 0
        }
      }
    ),
    stdin
  );
  if (noAuthResult.status === 0) {
    // then we're done, return the data
    return { stdout: noAuthResult.stdout };
  }

  await ensureAuthServer();
  const credRequestId = createCredRequestId(repoPath);
  const tryCredentialsUntilCanceled = async () => {
    const { username, password } = await callback({ type: 'CREDS_REQUESTED', credRequestId, repoPath });
    storeUsernameAndPassword(credRequestId, username, password);
    try {
      const authResult = await spawnCommand(
        command,
        R.mergeDeepRight(
          opts,
          {
            env: {
              GIT_TERMINAL_PROMPT: 0,
              GIT_ASKPASS: `${path.join(__dirname, '..', '..', '..', 'askpass.sh')}`,
              NODEGIT_LFS_ASKPASS_STATE: credRequestId,
              NODEGIT_LFS_ASKPASS_PORT: getAuthServerPort(),
              NODEGIT_LFS_ASKPASS_PATH: path.join(__dirname, 'GitAskPass.js'),
              NODEGIT_LFS_NODE_PATH: getNodeBinaryPath()
            }
          }
        ),
        stdin
      );
      if (authResult.status === 0) {
        await callback({ type: 'CREDS_SUCCEEDED', credRequestId, repoPath, verifiedCredentials: { username, password } });
        clearUsernameAndPassword(credRequestId);
        return { stdout: noAuthResult.stdout };
      }

      if (authResult.stderr.includes('Git credentials')) {
        const authError = new Error('Auth error');
        authError.isAuthError = true;
        throw authError;
      }

      throw new Error('A problem occurred');
    } catch (e) {
      if (e.isAuthError) {
        clearUsernameAndPassword(credRequestId);
        await callback({ type: 'CREDS_FAILED', credRequestId, repoPath });
        return tryCredentialsUntilCanceled();
      }

      throw e;
    }
  };

  try {
    return await tryCredentialsUntilCanceled();
  } catch (e) {
    throw e;
  }
};

export default spawn;
