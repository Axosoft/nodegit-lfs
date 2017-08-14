const { spawn } = require('child_process');

let server;

module.exports = {
  start() {
    if (server) {
      throw new Error('LFS test server has already been started!');
    }

    server = spawn('./start.sh', {
      cwd: __dirname,
      shell: true
    });
  },

  stop() {
    if (!server) {
      throw new Error("LFS test server hasn't been started!");
    }

    server.kill('SIGHUP');
  }
};
