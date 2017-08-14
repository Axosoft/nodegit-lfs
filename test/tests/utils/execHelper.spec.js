import { expect } from 'chai';
import exec from '../../../src/utils/execHelper';

describe('exec', () => {
  it('returns a promise', () => {
    const result = exec('woo', {}).catch(() => {});
    expect(result).to.be.a('Promise');
  });
});
