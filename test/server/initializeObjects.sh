set -eu
set -o pipefail

# Push objects to LFS server
git lfs track README.md
git add -A
git commit -m "Create objects to push"
git lfs push origin master
