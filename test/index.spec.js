import { expect } from 'chai';
import nodegit from '../src';

describe('LFS', () => {
  it('LFS exists', () => {
    expect(nodegit.LFS).not.to.be.an('undefined');
  });

  it('initialize exists on LFS', () => {
    expect(nodegit.LFS.initialize).not.to.be.an('undefined');
    expect(nodegit.LFS.initialize).to.be.a('function');
  });
});
