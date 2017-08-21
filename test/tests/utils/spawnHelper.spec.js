import {
  expect
} from 'chai';
import childProcess from 'child_process';
import sinon from 'sinon';

import {
  fail
} from '../../utils';

import spawn from '../../../build/src/utils/spawnHelper';

describe('spawn', () => {
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

  if (process.platform === 'win32') {
    it('correctly overrides `detached` on Windows', function () {
      const {
        spawnStub
      } = this;

      spawn('command', { detached: true, foo: 'bar' });
      expect(spawnStub).to.have.been.calledWithMatch('command', [], {
        detached: false,
        foo: 'bar',
        env: process.env,
        shell: true
      });
    });
  }

  if (process.platform === 'darwin') {
    it('correctly overrides `detached` on macOS', function () {
      const {
        spawnStub
      } = this;

      spawn('command', { detached: true, foo: 'bar' });
      expect(spawnStub).to.have.been.calledWithMatch('command', [], {
        detached: false,
        foo: 'bar',
        env: process.env,
        shell: true
      });
    });
  }

  if (process.platform === 'linux') {
    it('correctly overrides `detached` on Linux', function () {
      const {
        spawnStub
      } = this;

      spawn('command', { detached: false, foo: 'bar' });
      expect(spawnStub).to.have.been.calledWithMatch('command', [], {
        detached: true,
        foo: 'bar',
        env: process.env,
        shell: true
      });
    });
  }

  it("merges the calling process' env into the provided env", function () {
    const {
      sandbox,
      spawnStub
    } = this;

    sandbox.stub(process, 'env').get(() => ({
      foo: 'override',
      baz: 'quux'
    }));

    spawn('command', { env: { foo: 'bar' } });
    expect(spawnStub).to.have.been.calledWithMatch('command', [], {
      env: {
        foo: 'bar',
        baz: 'quux'
      }
    });
  });

  it('correctly overrides `shell`', function () {
    const {
      spawnStub
    } = this;

    spawn('command', { shell: false });
    expect(spawnStub).to.have.been.calledWithMatch('command', [], {
      shell: true
    });
  });

  if (process.platform === 'darwin' || process.platform === 'win32') {
    it('correctly calculates arguments on Windows or macOS', function () {
      const {
        spawnStub
      } = this;

      spawn('command arg1 arg2');
      expect(spawnStub).to.have.been.calledWithMatch('command', ['arg1', 'arg2'], {
        detached: false,
        env: process.env,
        shell: true
      });
    });
  }

  if (process.platform === 'linux') {
    it('correctly calculates arguments on Linux', function () {
      const {
        spawnStub
      } = this;

      spawn('command arg1 arg2');
      expect(spawnStub).to.have.been.calledWithMatch(
        'script --return -c "command arg1 arg2" /dev/null',
        [],
        {
          detached: true,
          env: process.env,
          shell: true
        }
      );
    });
  }

  if (process.platform === 'linux') {
    it('correctly handles `git lfs smudge` on Linux', function () {
      const {
        spawnStub
      } = this;

      spawn('git lfs smudge', {
        input: 'file.txt'
      });
      expect(spawnStub).to.have.been.calledWithMatch(
        'cat file.txt | git lfs smudge',
        [],
        {
          detached: true,
          env: process.env,
          shell: true
        }
      );
    });
  }

  describe('when passed a callback', () => {
    afterEach(function () {
      const {
        sandbox
      } = this;

      sandbox.restore();
    });

    it('ignores the callback if it is not a `Function`', function () {
      const {
        mockProcess
      } = this;

      spawn('', {}, 'not a callback');
      const stdoutHandler = mockProcess.stdout.on.firstCall.args[1];
      stdoutHandler(new Buffer('some data'));
    });

    it('uses the callback to obtain credentials', function () {
      const {
        mockProcess,
        sandbox
      } = this;

      const cbStub = sandbox.stub().callsFake((cb) => {
        cb('some username', 'some password', false);
      });
      spawn('', {}, cbStub);
      const stdoutHandler = mockProcess.stdout.on.firstCall.args[1];
      stdoutHandler(new Buffer('Username: '));
      expect(mockProcess.stdin.write.firstCall.args[0].toString()).to.equal('some username\n');
      stdoutHandler(new Buffer('Password: '));
      expect(mockProcess.stdin.write.secondCall.args[0].toString()).to.equal('some password\n');

      expect(cbStub).to.have.been.calledOnce;
    });

    it('does not require the callback to send a password', function () {
      const {
        mockProcess,
        sandbox
      } = this;

      const cbStub = sandbox.stub().callsFake((cb) => {
        cb('some username', '', false);
      });
      spawn('', {}, cbStub);
      const stdoutHandler = mockProcess.stdout.on.firstCall.args[1];
      stdoutHandler(new Buffer('Username: '));
      expect(mockProcess.stdin.write.firstCall.args[0].toString()).to.equal('some username\n');
      stdoutHandler(new Buffer('Password: '));
      expect(mockProcess.stdin.write.secondCall.args[0].toString()).to.equal('\n');

      expect(cbStub).to.have.been.calledOnce;
    });

    it('allows the callback to cancel', function () {
      const {
        mockProcess
      } = this;

      const promise = spawn('', {}, (cb) => {
        cb(undefined, undefined, true);
      });
      const stdoutHandler = mockProcess.stdout.on.firstCall.args[1];
      stdoutHandler(new Buffer('Username: '));
      return promise
        .then(() => fail('The promise should have failed!'))
        .catch((err) => {
          expect(err.message).to.equal('LFS action cancelled');
        });
    });
  });

  describe('when `spawn` completes successfully', () => {
    afterEach(function () {
      const {
        sandbox
      } = this;

      sandbox.restore();
    });

    it('resolves with the exit code, processed stdout, and stderr', function () {
      const {
        mockProcess
      } = this;

      const promise = spawn('');
      const closeHandler = mockProcess.on.firstCall.args[1];
      const stderrHandler = mockProcess.stderr.on.firstCall.args[1];
      const stdoutHandler = mockProcess.stdout.on.firstCall.args[1];
      stderrHandler('some stderr, line 1\n');
      stderrHandler('some stderr, line 2');
      stdoutHandler('some stdout, line 1\n');
      stdoutHandler('some stdout, line 2');
      closeHandler(0);
      return promise
        .then((result) => {
          expect(result).to.eql({
            code: 0,
            stderr: 'some stderr, line 1\nsome stderr, line 2',
            stdout: 'some stdout, line 1\nsome stdout, line 2'
          });
        });
    });
  });

  describe('when `spawn` errors', () => {
    afterEach(function () {
      const {
        sandbox
      } = this;

      sandbox.restore();
    });

    it('rejects with the exit code', function () {
      const {
        mockProcess
      } = this;

      const promise = spawn('');
      const errorHandler = mockProcess.on.secondCall.args[1];
      errorHandler(-1337);
      return promise
        .then(() => fail('This promise should have failed!'))
        .catch((err) => {
          expect(err).to.equal(-1337);
        });
    });
  });
});
