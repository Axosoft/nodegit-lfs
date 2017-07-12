import { expect } from 'chai';
import register from '../../src/utils/registerLfsFilter';

describe('Register LFS filter for nodegit-lfs', () => {
  it('Attempt to register lfs filter', () => {
    const result = register();
    expect(result).to.be.a('Promise');
    result.then((res) => {
      expect(res).to.equal(true);
      done();
    });
  });
});
