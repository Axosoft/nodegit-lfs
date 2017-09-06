import {
  todo
} from '../../utils';

describe('fetch', () => {
  describe('the default export', () => {
    it('runs fetch in the provided repo', todo);

    describe('when a remote name is provided', () => {
      it('adds the provided remote name to the arguments', todo);
    });

    describe('when a remote name and a branch name are provided', () => {
      it('adds the provided remote name and branch name to the arguments', todo);
    });

    describe('when a callback is provided', () => {
      it('passes the provided callback to `spawn`', todo);
    });

    describe('when fetch returns invalid output', () => {
      it('returns an error response', todo);
    });

    it('handles errors', todo);
  });
});
