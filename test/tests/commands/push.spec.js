import {
  todo
} from '../../utils';

describe('push', () => {
  describe('the default export', () => {
    describe('when not provided a remote', () => {
      it('defaults to the current branch and its upstream', todo);
    });

    describe('when provided a remote', () => {
      describe('when provided a branch', () => {
        it('pushes', todo);
      });

      describe('when not provided a branch', () => {
        it('pushes', todo);
      });
    });
  });
});
