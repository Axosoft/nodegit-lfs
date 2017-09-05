import childProcess from 'child_process';
import sinon from 'sinon';

import {
  todo
} from '../../utils';

describe('spawnHelper', () => {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();

    this.mockProcess = {
      kill: this.sandbox.spy(),
      on: this.sandbox.spy(),
      stderr: {
        on: this.sandbox.spy()
      },
      stdin: {
        write: this.sandbox.spy()
      },
      stdout: {
        on: this.sandbox.spy()
      },
      unref: this.sandbox.spy()
    };
    this.spawnStub = this.sandbox.stub(childProcess, 'spawn').returns(this.mockProcess);
  });

  afterEach(function () {
    const {
      sandbox
    } = this;

    sandbox.restore();
  });

  describe('the default export', () => {
    it('defaults `opts` to `{}`', todo);

    it("merges the calling process' env into the provided env", todo);

    if (process.platform === 'win32') {
      it('adds the `.exe` prefix to commands', todo);
    } else {
      it('does not add a `.exe` prefix to commands', todo);
    }

    it('parses arguments', todo);

    describe('when a callback argument is provided', () => {
      it('uses it for credentials if it is a function', todo);

      it('ignores it if it is not a function', todo);
    });

    it('spawns the command', todo);

    it('resolves with the correct data on a successful exit', todo);

    it('rejects on spawn error', todo);

    it('rejects on non-0 exit code', todo);
  });

  describe('winSpawn', () => {
    it('defaults `opts` to `{}`', todo);

    it("merges the calling process' env into the provided env", todo);

    it('overwrites `shell` to `true`', todo);

    it('parses arguments', todo);

    it('spawns the command', todo);

    it('resolves with the correct data on a successful exit', todo);

    it('writes to standard input');

    it('rejects on spawn error', todo);

    it('rejects on non-0 exit code', todo);
  });

  describe('spawnShell', () => {
    it('defaults `opts` to `{}`', todo);

    it("merges the calling process' env into the provided env", todo);

    it('builds the socket with the right arguments', todo);

    it('uses raw `Buffer`s', todo);

    describe('when a callback argument is provided', () => {
      it('uses it for credentials if it is a function', todo);

      it('ignores it if it is not a function', todo);

      if (process.platform === 'win32') {
        it('pipes the command output', todo);
      } else {
        it('pipes the command output', todo);
      }

      it('spawns the command', todo);

      it('closes when the socket closes', todo);
    });
  });

  describe('buildSocket', () => {
    it('resolves the calling `Promise` with the correct data on a successful exit', todo);

    it('only runs the successful close logic once', todo);

    it('calls the close callback when the socket ends', todo);

    it('calls the close callback when the socket closes', todo);

    it('reads incoming data, closing the socket server when enough bytes have been read', todo);

    it('rejects the calling `Promise` on socket error', todo);

    it('listens to the socket', todo);

    it('resolves with the socket name when the server is ready', todo);

    it('calls the close callback on server close', todo);

    it('rejects on server error', todo);
  });

  describe('buildCredentialsCallbackProcess', () => {
    describe('when prompted for a username', () => {
      it('calls the callback to obtain a username and writes it out', todo);
    });

    describe('when prompted for a password', () => {
      it('calls the callback to obtain a password and writes it out', todo);
    });

    describe('when prompted for a passphrase', () => {
      it('calls the callback to obtain a passphrase and writes it out', todo);
    });

    it('allows the callback to cancel', todo);
  });

  describe('buildSocketPath', () => {
    if (process.platform === 'win32') {
      it('prefixes `.pipe` to the socket path', todo);

      it('removes `C:\\` from the socket path', todo);

      it('removes `.tmp` from the socket path', todo);
    } else {
      it('removes `.tmp` from the socket path', todo);
    }
  });
});
