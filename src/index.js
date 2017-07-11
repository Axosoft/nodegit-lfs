import NodeGit from 'nodegit';
import initialize from './initialize';

const LFS = {
  initialize,
};

NodeGit.LFS = LFS;

NodeGit.FilterRegistry.register('test', {
  apply: () => 0,
  check: () => 0,
}, 0);

export default NodeGit;
