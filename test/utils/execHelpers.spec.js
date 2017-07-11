const helpers = require('../../src/utils/execHelpers');
const expect = require('chai').expect;

describe('Exec Helpers', () => {
  describe('exec', () => {
    it('returns a promise', () => {
      const result = helpers.exec('woo', {});
      expect(result).to.be.a('Promise');
    });
  });
});
