# Changelog for v1.0.0-alpha.3
- init function now takes override paths for askpass.sh and GitAskPass.js for those in an asar

# Changelog for v1.0.0-alpha.1
- Changed credentials system for LFS to use GIT_ASKPASS
- major change to credentials callback, now implemented as a channel.
  - Messages (all messages are of { type, credsRequestId } format):
    - CREDS_REQUESTED
    - CREDS_SUCCEEDED
      - Expects { username, password } as reply
    - CREDS_FAILED
    - CREDS_SPAWN_FAILED

# Changelog for v0.2.0
- Requires nodegit v0.25.0-alpha.9 and later because of change in NodeGit API

# Changelog for v0.1.0

- Removed the `repoHasLfsBin` helper

# Changelog for v0.0.19

- Update `node-pty` to fix the high sierra issue

# Changelog for v0.0.18

- `spawnHelper` now destroys sockets manually

# Changelog for v0.0.17

- `spawnHelper` now uses the `-i` flag with `node-pty` to allow for ssh agents to be recognized.
- `spawnHelper` ignores the `EIO` error from `node-pty`

# Changelog for v0.0.16

- `dependencyCheck` now checks git and lfs even if one of them fails, and returns the parsed version number as well.

# Changelog for v0.0.15

- Linter errors...

# Changelog for v0.0.14

- Updated the `check` callback for filters to use the filter api properly to find the `gitattributes` associated with a file
- Updated the `commands/ls` command to sort by files and not sha to avoid sha conflicts

# Changelog for v0.0.13

- Updated the `check` callback for filters to use the NodeGit api to find the `gitattributes` associated with a file

# Changelog for v0.0.12

- Updated the install routine to no longer create a `.gitattributes` for the repo.

# Changelog for v0.0.11

- Updated the `spawnHelper` to successfully kill processes. It was leaving rogue processes around before.

# Changelog for v0.0.10

- Added the credentials callback to `git lfs checkout` in case it invokes the smudge filters manually
- Fixed `helpers.verifyOutput` to actually check for errors and ssh permission errors
- Removed dead code
- Refactored the `spawnHelper` credentials routine to do less work and just shell out to the parent process with the potential prompt results

# Changelog for v0.0.9

- Changed `version` to write errors to `stderr` only and not `raw`
- Changed `checkDependencies` to use the correct response object on errors
- Updated the version regexes

# Changelog for v0.0.8

- Fixed adding `/usr/local/bin` to exec path when it does not exist on `darwin` or `linux` as it was exploding in some situations and returning false negatives

# Changelog for v0.0.6

- Updated `/src/commands/fetch.js` to properly return error output when parsing fails
- Updated `/src/commands/pull.js` to properly return error output when parsing fails
- Removed the `tests` directory from the `eslint` command and addedd `eslint-full` to be able to lint tests

# Changelog for v0.0.6

- Added `/usr/local/bin` to exec path when it does not exist on `darwin` or `linux`
- Added error handling in `checkDependencies` so we get nicer output when version checks fail or the binaries do not exist

# Changelog for v0.0.5

- Changed the `node-pty` dependency again to be a different forked version found [here](https://github.com/implausible/node-pty)

# Changelog for v0.0.4

- Changed the `node-pty` dependency to be a forked version found [here](https://github.com/implausible/node-pty)

# Changelog for v0.0.3

- Changed the username/password prompt to have a `needsUsername` param instead of `sshOnly` as `needsUsername` is more correct.

# Changelog for v0.0.2

 - Altered the `hasLfsFilters` to be `repoHasLfs` as it now checks for filters in the `.gitattributes` file or for the `.git/lfs` file in the working directory of the current repo.
