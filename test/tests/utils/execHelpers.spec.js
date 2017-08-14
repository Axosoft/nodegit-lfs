import { expect } from 'chai';
import { exec } from '../../../src/utils/execHelpers';

describe('Exec Helpers', function () {
  describe('exec', function () {
    it('returns a promise', function () {
      const result = exec('woo', {}).catch(() => {});
      expect(result).to.be.a('Promise');
    });
  });
});
