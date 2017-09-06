import {
  expect
} from 'chai';
import sinon from 'sinon';

import {
  todo
} from '../../utils';

import {
  BAD_CORE_RESPONSE,
  Error
} from '../../../build/src/constants';
import {
  core
} from '../../../build/src/commands/lfsCommands';
import {
  gitVersion,
  lfsVersion
} from '../../../build/src/commands/version';

describe('version', () => {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    const {
      sandbox
    } = this;

    sandbox.restore();
  });

  describe('gitVersion', () => {
    it("parses `git --version`'s output", function () {
      const {
        sandbox
      } = this;

      sandbox.stub(core, 'git').returns(Promise.resolve({
        stdout: 'git version 2.0.0.windows.1'
      }));

      return gitVersion()
        .then((result) => {
          expect(core.git).to.have.been.calledWith('--version');

          expect(result).to.eql({
            errno: Error.CODE.OK,
            raw: 'git version 2.0.0.windows.1',
            stderr: '',
            success: true,
            version: '2.0.0'
          });
        });
    });

    it('handles errors', function () {
      const {
        sandbox
      } = this;

      sandbox.stub(core, 'git').returns(Promise.reject(BAD_CORE_RESPONSE));

      return gitVersion()
        .then((result) => {
          expect(result).to.eql({
            errno: BAD_CORE_RESPONSE,
            raw: '',
            stderr: '',
            success: false
          });
        });
    });
  });

  describe('lfsVersion', () => {
    it("parses `git-lfs-version`'s output", function () {
      const {
        sandbox
      } = this;

      sandbox.stub(core, 'version').returns(Promise.resolve({
        stdout: 'git-lfs/100.100.100 (GitHub; windows amd64; go 1.5.3; git 7de0397)'
      }));

      return lfsVersion()
        .then((result) => {
          expect(core.version).to.have.been.called;

          expect(result).to.eql({
            errno: Error.CODE.OK,
            raw: 'git-lfs/100.100.100 (GitHub; windows amd64; go 1.5.3; git 7de0397)',
            stderr: '',
            success: true,
            version: '100.100.100'
          });
        });
    });

    it('handles errors', function () {
      const {
        sandbox
      } = this;

      sandbox.stub(core, 'version').returns(Promise.resolve({
        stdout: 'Some stdout',
        stderr: 'git-lfs-version not found!'
      }));

      return lfsVersion()
        .then((result) => {
          expect(result).to.eql({
            errno: BAD_CORE_RESPONSE,
            raw: 'Some stdout',
            stderr: 'git-lfs-version not found!',
            success: false
          });
        });
    });
  });
});
