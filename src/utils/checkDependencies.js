import promisify from 'promisify-node';
import path from 'path';

const fse = promisify('fs-extra');

const isAtleastGitVersion = (actualVersion, minVersion) => {
  const gitVersionRegex = /(?:git version\s+)?(\d+)(?:.(\d+))?(?:.(\d+))?.*/g;

  let filteredActualVersion;
  let filteredMinVersion;

  try {
    const minVersionMatch = gitVersionRegex.exec(minVersion);
    const actualVersionMatch = gitVersionRegex.exec(actualVersion);
    filteredActualVersion = actualVersionMatch.filter(match => !isNaN(parseInt(match, 10)));
    filteredMinVersion = minVersionMatch.filter(match => !isNaN(parseInt(match, 10)));
    // remove the full string match
    filteredActualVersion.shift();
    filteredMinVersion.shift();
  } catch (e) {
    console.log('Git version number provided is inconsistent');
    throw e;
  }

  const minorScale = 1000;
  const majorScale = minorScale * 1000;

  let actualVersionNormalized = 0;
  let minVersionNormailzed = 0;
  /* Major */
  actualVersionNormalized += parseInt(filteredActualVersion[0] * majorScale, 10);
  /* Minor */
  if (filteredActualVersion.length > 1) {
    actualVersionNormalized += parseInt(filteredActualVersion[1] * minorScale, 10);
  }
  /* Patch */
  if (filteredActualVersion.length > 2) {
    actualVersionNormalized += parseInt(filteredActualVersion[2], 10);
  }

  /* Major */
  minVersionNormailzed += parseInt(filteredMinVersion[0] * majorScale, 10);
  /* Minor */
  if (filteredActualVersion.length > 1) {
    minVersionNormailzed += parseInt(filteredMinVersion[1] * minorScale, 10);
  }
  /* Patch */
  if (filteredActualVersion.length > 2) {
    minVersionNormailzed += parseInt(filteredMinVersion[2], 10);
  }

  return actualVersionNormalized >= minVersionNormailzed;
};

const isLfsRepo = workingDir => fse.pathExists(path.join(workingDir), '.git', 'lfs');

module.exports = {
  isAtleastGitVersion,
  isLfsRepo,
};
