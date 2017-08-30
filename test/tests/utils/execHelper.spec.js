import {
  expect
} from 'chai';
import childProcess from 'child_process';
import sinon from 'sinon';

import {
  fail,
  todo
} from '../../utils';

import exec from '../../../src/utils/execHelper';

describe('execHelper', () => {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();

    this.mockProcess = {
      stdin: {
        end: this.sandbox.spy(),
        write: this.sandbox.spy()
      }
    };

    this.execSpy = this.sandbox.stub(childProcess, 'exec').returns(this.mockProcess);
  });

  afterEach(function () {
    const {
      sandbox
    } = this;

    sandbox.restore();
  });

  describe('the default export', () => {
    it('resolves with the spawned process and its stdout and stderr on success', function () {
      const {
        execSpy,
        mockProcess
      } = this;

      const promise = exec('test', '', { foo: 'bar' });
      execSpy.firstCall.args[2](null, 'some stdout', 'some stderr');
      return promise
        .then((result) => {
          expect(result).to.eql({
            proc: mockProcess,
            stderr: 'some stderr',
            stdout: 'some stdout'
          });
        });
    });

    it('allows the environment to be overwritten', todo);

    if (process.platform !== 'win32') {
      describe('if `/usr/local/bin` is not on the `PATH`', () => {
        it('adds `/usr/local/bin` to the `PATH`', todo);
      });

      describe('if `/usr/local/bin` is already on the `PATH`', () => {
        it('does not add `/usr/local/bin` twice', todo);
      });
    }

    it('writes out provided input', todo);

    it('rejects with the error on failure', function () {
      const {
        execSpy
      } = this;

      const promise = exec('test', '', { foo: 'bar' });
      execSpy.firstCall.args[2]('some error');
      return promise
        .then(() => fail('Expected this promise to fail!'))
        .catch((err) => {
          expect(err).to.equal('some error');
        });
    });
  });
});
