set -eu
set -o pipefail

current_branch="$(git rev-parse --abbrev-ref HEAD)"

# Push objects to LFS server
git lfs track README.md
git add -A
git commit -m "Create objects to push"
GIT_SSL_NO_VERIFY=1 git lfs push origin "$current_branch"
