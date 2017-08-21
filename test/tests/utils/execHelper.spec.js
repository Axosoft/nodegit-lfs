import {
  expect
} from 'chai';
import childProcess from 'child_process';
import sinon from 'sinon';

import {
  fail
} from '../../utils';

import exec from '../../../src/utils/execHelper';

describe('exec', () => {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();

    this.execSpy = this.sandbox.stub(childProcess, 'exec').returns('proc object');
  });

  afterEach(function () {
    const {
      sandbox
    } = this;

    sandbox.restore();
  });

  it('resolves with the spawned process and its stdout and stderr on success', function () {
    const {
      execSpy
    } = this;

    const promise = exec('test', { foo: 'bar' });
    execSpy.firstCall.args[2](null, 'some stdout', 'some stderr');
    return promise
      .then((result) => {
        expect(result).to.eql({
          proc: 'proc object',
          stderr: 'some stderr',
          stdout: 'some stdout'
        });
      });
  });

  it('rejects with the error on failure', function () {
    const {
      execSpy
    } = this;

    const promise = exec('test', { foo: 'bar' });
    execSpy.firstCall.args[2]('some error');
    return promise
      .then(() => fail('Expected this promise to fail!'))
      .catch((result) => {
        expect(result).to.equal('some error');
      });
  });
});
