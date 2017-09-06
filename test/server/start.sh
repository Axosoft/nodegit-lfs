set -eu
set -o pipefail

# Download LFS test server
GOPATH="$(pwd)/lfs-test-server" go get github.com/github/lfs-test-server

# Configure LFS test server
LFS_LISTEN="tcp://:9001"
LFS_HOST="127.0.0.1:9001"
LFS_ADMINUSER="admin"
LFS_ADMINPASS="admin"
LFS_CERT="$(pwd)/server.crt"
LFS_KEY="$(pwd)/server.key"
LFS_SCHEME="https"
export LFS_LISTEN LFS_HOST LFS_ADMINUSER LFS_ADMINPASS LFS_CERT LFS_KEY LFS_SCHEME

# Run LFS test server
# We `cd` into the `lfs-test-server` directory so that server-created files don't pollute `test/server`
cd lfs-test-server
./bin/lfs-test-server&
cd ..
echo "pid=$!" # Echo the server's PID so that it can be manually killed
