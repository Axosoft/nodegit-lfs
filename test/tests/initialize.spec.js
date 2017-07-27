import path from 'path';
import fs from 'fs';
import { expect } from 'chai';
import { default as initialize } from '../../build/src/initialize';

const local = path.join.bind(path, __dirname);

describe.only('initialize', () => {
  it('initialize is a promise', () => {
    const workdirPath = local('../repos/workdir');
    const result = initialize(workdirPath);
    expect(result).to.be.a('promise');
  });

  it('creates .gitattributes for empty repo', () => {
    const emptydirPath = local('../repos/empty');
    //eslint-disable-next-line
    expect(fs.existsSync(path.join(emptydirPath, '.gitattributes'))).to.be.false;
    return initialize(emptydirPath)
      .then(() => {
        //eslint-disable-next-line
        expect(fs.existsSync(path.join(emptydirPath, '.gitattributes'))).to.be.true;
      });
  });
});
