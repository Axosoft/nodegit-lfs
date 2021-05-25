import { spawn as nodeSpawn } from 'child_process';
import R from 'ramda';
import {
  createCredRequestId,
  clearUsernameAndPassword,
  ensureAuthServer,
  getAuthServerPort,
  getNodeBinaryPath,
  storeUsernameAndPassword,
  getGitAskPassPath,
  getGitAskPassClientPath
} from './authService';
import {
  regex
} from '../constants';
import { combineShellOptions } from './shellOptions';

const parseUrlFromErrorMessage = (errorMessage) => {
  let url = null;
  const matches = regex.CREDENTIALS_NOT_FOUND.exec(errorMessage);
  if (matches && matches.length > 1) {
    ([url] = matches);
  }
  return url;
};

const spawnCommand = (command, opts, stdin = '') => new Promise((resolve, reject) => {
  const [cmd, ...args] = command.trim().split(' ');
  const childProcess = nodeSpawn(cmd, args, R.mergeDeepRight(opts, { stdio: 'pipe' }));

  const stdoutData = [];
  const stderrData = [];

  const makeDataAccumulator = (accumulator) => (data) => {
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

const spawn = async (command, stdin, opts = {}, credentialsCallback, repoPath = null) => {
  const resolvedStdin = stdin || '';
  const resolvedRepoPath = repoPath || R.path('cwd', opts);
  const noAuthResult = await spawnCommand(
    command,
    combineShellOptions(
      opts,
      {
        env: {
          GIT_TERMINAL_PROMPT: 0
        }
      }
    ),
    resolvedStdin
  );
  if (noAuthResult.status === 0) {
    // then we're done, return the data
    return { stdout: noAuthResult.stdout };
  }

  const errorMessage = noAuthResult.stderr.toString();
  if (!regex.CREDENTIALS_ERROR.test(errorMessage)) {
    throw new Error(errorMessage);
  }

  await ensureAuthServer();
  const url = parseUrlFromErrorMessage(errorMessage);
  const credRequestId = createCredRequestId(resolvedRepoPath);
  const tryCredentialsUntilCanceled = async () => {
    const { username, password } = await credentialsCallback({
      type: 'CREDS_REQUESTED',
      credRequestId,
      repoPath: resolvedRepoPath,
      url
    });
    storeUsernameAndPassword(credRequestId, username, password);
    try {
      const authResult = await spawnCommand(
        command,
        combineShellOptions(
          opts,
          {
            env: {
              GIT_TERMINAL_PROMPT: 0,
              GIT_ASKPASS: getGitAskPassPath(),
              NODEGIT_LFS_ASKPASS_STATE: credRequestId,
              NODEGIT_LFS_ASKPASS_PORT: getAuthServerPort(),
              NODEGIT_LFS_ASKPASS_PATH: getGitAskPassClientPath(),
              NODEGIT_LFS_NODE_PATH: getNodeBinaryPath()
            }
          }
        ),
        resolvedStdin
      );
      if (authResult.status === 0) {
        await credentialsCallback({
          type: 'CREDS_SUCCEEDED',
          credRequestId,
          repoPath: resolvedRepoPath,
          verifiedCredentials: { username, password },
          url
        });
        clearUsernameAndPassword(credRequestId);
        return { stdout: authResult.stdout };
      }

      const stderr = authResult.stderr.toString();
      if (regex.CREDENTIALS_ERROR.test(stderr)) {
        const authError = new Error('Auth error');
        authError.isAuthError = true;
        throw authError;
      }

      throw new Error(stderr);
    } catch (e) {
      if (e.isAuthError) {
        clearUsernameAndPassword(credRequestId);
        await credentialsCallback({
          type: 'CREDS_FAILED',
          credRequestId,
          repoPath: resolvedRepoPath,
          url
        });
        return tryCredentialsUntilCanceled();
      }

      throw e;
    }
  };

  try {
    return await tryCredentialsUntilCanceled();
  } catch (e) {
    await credentialsCallback({
      type: 'CREDS_SPAWN_FAILED',
      error: e,
      credRequestId,
      repoPath
    });
    throw e;
  }
};

export default spawn;
