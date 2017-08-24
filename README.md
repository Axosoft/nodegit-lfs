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