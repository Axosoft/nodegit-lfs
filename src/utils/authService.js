import net from 'net';
import R from 'ramda';
import uuid from 'uuid';

let tcpServer = null;

const usernameAndPasswordByRequestId = {};

export const createCredRequestId = () => uuid.v4();

export const getUsernameAndPassword =
  credsRequestId => usernameAndPasswordByRequestId[credsRequestId];

export const storeUsernameAndPassword = (credsRequestId, username, password) => {
  usernameAndPasswordByRequestId[credsRequestId] = { username, password };
};

export const clearUsernameAndPassword = (credsRequestId) => {
  delete usernameAndPasswordByRequestId[credsRequestId];
};

const socketListener = (socket) => {
  socket.on('data', (data) => {
    const input = data.toString();
    const { credsRequestId, property } = JSON.parse(input) || {};

    if (!credsRequestId || !property || !R.contains(property, ['username', 'password'])) {
      socket.end();
      throw new Error('Malformed request');
    }

    const credentials = getUsernameAndPassword(credsRequestId);
    if (!credentials) {
      socket.end();
      throw new Error('No matching credentials for credsRequestId');
    }

    socket.end(credentials[property]);
  });
};

export const ensureAuthServer = () => new Promise((resolve, reject) => {
  if (tcpServer) {
    resolve();
    return;
  }

  tcpServer = net.createServer(socketListener);
  tcpServer.on('error', reject);
  tcpServer.listen({ port: 0, host: 'localhost' }, resolve);
});

export const getAuthServerPort = () => (
  tcpServer
    ? tcpServer.address().port
    : undefined
);

let nodeBinaryPath = '';

export const setNodeBinaryPath = (binaryPath) => {
  nodeBinaryPath = binaryPath;
};

export const getNodeBinaryPath = () => nodeBinaryPath;
