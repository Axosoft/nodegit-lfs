const lfs = require('../src');
const expect = require('chai').expect;

describe('LFS', () => {
  it('init', () => {
    const val = lfs();
    expect(val).to.equal(0);
  });
});