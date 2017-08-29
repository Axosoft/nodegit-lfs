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

describe('exec', () => {
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

  it('resolves with the spawned process and its stdout and stderr on success', function () {
    const {
      execSpy,
      mockProcess
    } = this;

    const promise = exec('test', { foo: 'bar' });
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

  it('writes out provided input', todo);

  it('rejects with the error on failure', function () {
    const {
      execSpy
    } = this;

    const promise = exec('test', { foo: 'bar' });
    execSpy.firstCall.args[2]('some error');
    return promise
      .then(() => fail('Expected this promise to fail!'))
      .catch((err) => {
        expect(err).to.equal('some error');
      });
  });
});
