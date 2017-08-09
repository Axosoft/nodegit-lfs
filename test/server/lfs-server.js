#!/usr/bin/env node
/* eslint-disable */
const cp = require('child_process');

const runScript = `
et -eu
set -o pipefail


LFS_LISTEN="tcp://:9001"
LFS_HOST="127.0.0.1:9001"
LFS_CONTENTPATH="content"
LFS_ADMINUSER="admin"
LFS_ADMINPASS="admin"
LFS_SCHEME="http"

export LFS_LISTEN LFS_HOST LFS_CONTENTPATH LFS_ADMINUSER LFS_ADMINPASS LFS_SCHEME

$TRAVIS_BUILD_DIR/test/server/bin/lfs-test-server
`;

const lfsConfig = `
[lfs]
    url = "http://127.0.0.1:9001/"
[http]
	sslverify = false
`;

cp.execSync(`echo "${runScript}" > run.sh && chmod +x run.sh`, { 
  cwd: __dirname,
  shell: true
});
cp.execSync('go get github.com/github/lfs-test-server', { 
  cwd: __dirname,
  shell: true
});
