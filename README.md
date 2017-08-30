# NodeGit LFS

Nodegit LFS is an extension library used to augment [NodeGit](http://www.nodegit.org/) with the capability to use [git lfs](https://git-lfs.github.com/) via the command line.

To use this package, you must have [git](https://git-scm.com/) and [git lfs](https://git-lfs.github.com/) installed.

This project is new, and is highly volatile. It should be noted that any subsequesnt releases may have breaking changes for the foreseeable future.

## How to get started

`NodeGit` is a peer dependency of the `NodeGit LFS` package, so you should make sure to install `NodeGit` before `NodeGit LFS`.

To install `NodeGit` run:

`yarn add nodegit`

To install `NodeGit LFS` run:

`yarn add nodegit-lfs`

Once installed, you only need to bootstrap `NodeGit LFS` once:

```javascript
const nodegit = require('nodegit');
const addLfs = require('nodegit-lfs');

// Call the function returned from nodegit-lfs with nodegit as a parameter
// and you are good to go!
addLfs(nodegit);

// After nodegit has been augmented you can use LFS via the LFS object
nodegit.LFS.register()
  .then(() => {
    console.log('The LFS filter has been registered!');
  });
```

## Building from source

Clone the repo:

`git clone https://github.com/axosoft/nodegit-lfs`

Once cloned:

```
cd nodegit-lfs
yarn
```

## Tests

**Tests are still a Work In Progress.**
The tests rely on `mocha`, `chai`, `sinon`, and `sinon-chai`, and are currently a mix of system and unit tests.

### Naming

**TODO:** Split out system tests from unit tests and then revise the below guidlines.

These guidelines are inspired by [Better Specs { rspec guidelines with ruby }](https://www.betterspecs.org). Given that these guidelines are, by necessity, quite subjective, consider them as beneficial for the consistency rather than the "correctness" that they provide.

The linter should catch basic stylistic errors (e.g. prefer arrow functions unless `this` is needed).

---

When naming individual `it` blocks, the resulting test name should read like a sentence. For example: `it('returns false if the repo has no filters')`.

Directly describe what the test should do. Use verbs like `returns`, `errors`, `responds`, `reads`, etc. rather than prefixing tests with `should`, suffixing them with `correctly`, etc.. For example:

``` javascript
/* Bad */
it('should read globs from `.gitattributes` correctly', function () {
  // ...
});

/* Good */
it('reads globs from `.gitattributes`', function () {
  // ...
});
```

---

If you have the temptation to start a test with `can`, try to restructure the test to use a nested `describe` instead (whose message starts with `when`). For example:

``` javascript
/* Bad */
it('can initialize a non-LFS repo', function () {
  // ...
});

/* Good */
describe('when provided a non-LFS repo', () => {
  it('initializes the repo', function () {
    // ...
  });
});
```

---

For tests whose behavior varies cross-platform, surround the tests with a `process.platform` test. Be sure to add tests for all platforms where behavior could vary, even if you cannot run them locally. Because CI will run on Windows, macOS, and Linux, this should not be an obstacle to thorough test coverage. For example:

``` javascript
/* Bad */
describe('when on Windows', () => {
  beforeEach(() => {
    sinon.stub(process, 'platform').returns('win32');
  });

  it('runs the provided command', function () {
    // ...
  });
});

describe('when on macOS', () => {
  beforeEach(() => {
    sinon.stub(process, 'platform').returns('darwin');
  });

  it('runs the provided command', function () {
    // ...
  });
});

describe('when on Linux', () => {
  beforeEach(() => {
    sinon.stub(process, 'platform').returns('linux');
  });

  it('runs the provided command', function () {
    // ...
  });
});

/* Good */
switch (process.platform) {
  case 'win32':
    it('runs the provided command', function () {
      // ...
    });
    break;
  case 'macOS':
    it('runs the provided command', function () {
      // ...
    });
    break;
  case 'linux':
    it('runs the provided command', function () {
      // ...
    });
    break;
}
```

---

When referring to parameters, use `provided` rather than `passed-in`, `given`, etc. For example:

``` javascript
/* Bad */
it('runs the passed-in command', function () {
  // ...
});

/* Good */
it('runs the provided command', function () {
  // ...
});
```

---

Each implementation file should correspond to a similarly-named `<file name>.spec.js` test file in the same relative location. For example, `src/callbacks/check.js` should have a test file located in `test/tests/callbacks/check.spec.js`.

The top-level `describe` should be named after the file. `describe`s for each function should be named after the function itself. On a related note, each function should have its own `describe` block, even if there is only `it` block inside it. In the case that a function does not have a pre-defined name (e.g. it's an anonymous function exported as the default), refer to it as `the default export`. For example:

``` javascript
/* For named exports: */
describe('helpers', () => { // Named after the file name, `helpers.spec.js`
  describe('hasLfsFilters', () => { // Named after the exported function name, `hasLfsFilters`
    // ...
  });
});

/* For default exports: */
describe('check', () => {
  describe('the default export', () => {
    // ...
  });
});
```
