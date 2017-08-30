import {
  expect
} from 'chai';
import NodeGit from 'nodegit';

import checkout from '../../build/src/commands/checkout';
import clone from '../../build/src/commands/clone';
import fetch from '../../build/src/commands/fetch';
import initialize from '../../build/src/initialize';
import {
  core
} from '../../build/src/commands/lfsCommands';
import list from '../../build/src/commands/ls';
import prune from '../../build/src/commands/prune';
import pull from '../../build/src/commands/pull';
import push from '../../build/src/commands/push';
import testPointer from '../../build/src/commands/pointer';
import register from '../../build/src/register';
import track from '../../build/src/commands/track';
import unregister from '../../build/src/unregister';
import untrack from '../../build/src/commands/untrack';
import version from '../../build/src/commands/version';
import {
  loadGitattributeFiltersFromRepo,
  repoHasLfs
} from '../../build/src/helpers';
import {
  dependencyCheck
} from '../../build/src/utils/checkDependencies';

// NOTE These tests depend on `LFS(NodeGit)` being called in the global `beforeEach`.
describe('index', () => {
  describe('the default export', () => {
    it('adds LFS to NodeGit permanently', () => {
      expect(NodeGit.LFS).to.eql({
        checkout,
        clone,
        core,
        dependencyCheck,
        fetch,
        filters: loadGitattributeFiltersFromRepo,
        initialize,
        list,
        NodeGit,
        register,
        repoHasLfs,
        testPointer,
        track,
        prune,
        pull,
        push,
        version,
        unregister,
        untrack
      });
    });
  });
});
