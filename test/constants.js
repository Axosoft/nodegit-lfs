import path from 'path';

export const testReposPath = path.join(__dirname, 'repos');
export const emptyRepoPath = path.join(testReposPath, 'empty');
export const lfsTestRepoPath = path.join(testReposPath, 'lfs-test-repository');
export const lfsTestRepoUrl = 'https://github.com/jgrosso/nodegit-lfs-test-repo.git';
export const lfsTestRemotePath = path.join(__dirname, 'server', 'local-repo');
export const cachedLfsTestRemotePath = path.join(__dirname, 'server', 'local-repo-cached');
