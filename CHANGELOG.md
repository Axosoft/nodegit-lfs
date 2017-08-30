# Changelog for v0.0.4

- Changed the `node-pty` dependency to be a forked version found [here](https://github.com/implausible/node-pty)

# Changelog for v0.0.3

- Changed the username/password prompt to have a `needsUsername` param instead of `sshOnly` as `needsUsername` is more correct.

# Changelog for v0.0.2

 - Altered the `hasLfsFilters` to be `repoHasLfs` as it now checks for filters in the `.gitattributes` file or for the `.git/lfs` file in the working directory of the current repo.