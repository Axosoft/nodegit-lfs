import {
  expect
} from 'chai';

import {
  Error
} from '../../../build/src/constants';
import track from '../../../build/src/commands/track';
import checkCallback from '../../../build/src/callbacks/check';

describe('check', () => {
  beforeEach(function () {
    const {
      lfsTestRepo
    } = this;

    this.check = fileName => checkCallback({
      path: () => fileName,
      repo: () => lfsTestRepo
    });
  });

  describe('the default export', () => {
    describe('when the provided file is directly specified in `.gitattributes`', () => {
      it('returns `OK` for the provided file', function () {
        const {
          check,
          lfsTestRepo
        } = this;

        return track(lfsTestRepo, ['test.txt'])
          .then(() => check('test.txt'))
          .then((result) => {
            expect(result).to.equal(Error.CODE.OK);
          });
      });
    });

    describe('when the provided file is included in a glob in `.gitattributes`', () => {
      it('returns `OK` for the provided file', function () {
        const {
           check,
          lfsTestRepo
         } = this;

        return track(lfsTestRepo, ['*.txt'])
          .then(() => check('test.txt'))
          .then((result) => {
            expect(result).to.equal(Error.CODE.OK);
          });
      });
    });

    describe('when the provided file is not included in `.gitattributes`', () => {
      it('returns `PASSTHROUGH`', function () {
        const {
          check,
          lfsTestRepo
        } = this;

        return track(lfsTestRepo, ['other.txt'])
          .then(() => check('test.txt'))
          .then((result) => {
            expect(result).to.equal(Error.CODE.PASSTHROUGH);
          });
      });
    });

    it('returns `PASSTHROUGH` on error', function () {
      const {
        check
      } = this;

      return check('test.txt')
        .then((result) => {
          expect(result).to.equal(Error.CODE.PASSTHROUGH);
        });
    });
  });
});
