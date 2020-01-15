import { expect } from 'chai';
import exec from '../../../build/src/utils/execHelper';

describe('exec', () => {
  it('returns a promise', () => {
    const result = exec('woo', null, {}).catch(() => {});
    expect(result).to.be.a('Promise');
  });
});
