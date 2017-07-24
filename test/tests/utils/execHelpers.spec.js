import { expect } from 'chai';
import { exec } from '../../../src/utils/execHelpers';

describe('Exec Helpers', () => {
  describe('exec', () => {
    it('returns a promise', () => {
      const result = exec('woo', {}).catch(() => {});
      expect(result).to.be.a('Promise');
    });
  });
});
