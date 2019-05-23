const net = require('net');

const {
  NODEGIT_LFS_ASKPASS_STATE,
  NODEGIT_LFS_ASKPASS_PORT
} = process.env;

const request = {
  credsRequestId: NODEGIT_LFS_ASKPASS_STATE,
  property: null
};

if (process.argv[2] === 'Username') {
  request.property = 'username';
} else if (process.argv[2] === 'Password') {
  request.property = 'password';
}

if (!request.property) {
  process.exit(1);
}

const client = net.createConnection(
  {
    port: NODEGIT_LFS_ASKPASS_PORT,
    host: 'localhost'
  },
  () => {
    client.pipe(process.stdout);
    client.write(JSON.stringify(request));
  }
);
