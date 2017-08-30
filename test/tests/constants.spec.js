import {
  todo
} from '../utils';

describe('constants', () => {
  describe('regex', () => {
    describe('GIT', () => {
      it('parses `git` version output', todo);
    });

    describe('LFS', () => {
      it('parses `git-lfs` version output', todo);
    });

    describe('PASSWORD', () => {
      it('parses a password prompt', todo);
    });

    describe('SKIPPED_BYTES', () => {
      it('matches the number of skipped bytes in `git-lfs` output', todo);
    });

    describe('SKIPPED_FILES', () => {
      it('matches the number of skipped files in `git-lfs` output', todo);
    });

    describe('TOTAL_BYTES', () => {
      it('matches the number of total bytes in `git-lfs` output', todo);
    });

    describe('TOTAL_FILES', () => {
      it('matches the number of total files in `git-lfs` output', todo);
    });

    describe('TRACK', () => {
      it('matches a glob in `git-lfs-track` or `git-lfs-untrack` output', todo);
    });

    it('USERNAME', () => {
      it('parses a username prompt', todo);
    });
  });
});
