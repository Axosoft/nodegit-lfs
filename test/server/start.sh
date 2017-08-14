set -eu
set -o pipefail

# Download LFS test server
GOPATH=`pwd`/lfs-test-server go get github.com/github/lfs-test-server

# Configure LFS test server
LFS_LISTEN="tcp://:9001"
LFS_HOST="127.0.0.1:9001"
LFS_CONTENTPATH="content"
LFS_ADMINUSER="admin"
LFS_ADMINPASS="admin"
LFS_CERT="server.crt"
LFS_KEY="server.key"
LFS_SCHEME="https"
export LFS_LISTEN LFS_HOST LFS_CONTENTPATH LFS_ADMINUSER LFS_ADMINPASS LFS_CERT LFS_KEY LFS_SCHEME

# Run LFS test server
./lfs-test-server/bin/lfs-test-server
