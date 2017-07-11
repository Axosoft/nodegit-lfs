import { expect } from 'chai';
import helpers from '../../src/utils/execHelpers';

describe('Exec Helpers', () => {
  describe('exec', () => {
    it('returns a promise', () => {
      const result = helpers.exec('woo', {}).catch(() => {});
      expect(result).to.be.a('Promise');
    });
  });
});
