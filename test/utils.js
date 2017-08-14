import { expect } from 'chai';

export const fail = (msg) => {
  expect.fail(true, true, msg);
};

export const todo = () => {
  fail('TODO');
};
