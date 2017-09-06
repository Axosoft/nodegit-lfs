import {
  todo
} from '../utils';

describe('initialize', () => {
  describe('the default export', () => {
    it('correctly calculates arguments from options', todo);

    describe('when provided a non-LFS repo', () => {
      it('initializes the provided repo', todo);
    });

    describe('when provided an already-initialized repo', () => {
      it('skips initialization', todo);
    });
  });
});
