import promisify from 'promisify-node';
import path from 'path';

const fse = promisify('fs-extra');

/**
 * @function generateNormalizedVersionNumber
 * @param  Array<string> versionArray array of version number eg: ['1', '8', '3'] => 1.8.3
 * @return Number normalized version number
 */
const generateNormalizedVersionNumber = (versionArray) => {
  if (versionArray && versionArray.length > 0) {
    let normalizedVersionNumber = 0;
    const minorScale = 1000;
    const majorScale = minorScale * 1000;
    /* Major */
    normalizedVersionNumber += parseInt(versionArray[0] * majorScale, 10);
    /* Minor */
    if (versionArray.length > 1) {
      normalizedVersionNumber += parseInt(versionArray[1] * minorScale, 10);
    }
    /* Patch */
    if (versionArray.length > 2) {
      normalizedVersionNumber += parseInt(versionArray[2], 10);
    }
    return normalizedVersionNumber;
  }
  return null;
};

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
    console.log('Git version number is inconsistent');
    throw e;
  }

  const actualVersionNormalized = generateNormalizedVersionNumber(filteredActualVersion);
  const minVersionNormailzed = generateNormalizedVersionNumber(filteredMinVersion);

  return actualVersionNormalized >= minVersionNormailzed;
};

const isAtleastLfsVersion = (actualVersion, minVersion) => {
  const lfsVersionRegex = /(?:git-lfs\/\s+)?(\d+)(?:.(\d+))?(?:.(\d+))?.*/g;

  let filteredActualVersion;
  let filteredMinVersion;

  try {
    const minVersionMatch = lfsVersionRegex.exec(minVersion);
    const actualVersionMatch = lfsVersionRegex.exec(actualVersion);
    filteredActualVersion = actualVersionMatch.filter(match => !isNaN(parseInt(match, 10)));
    filteredMinVersion = minVersionMatch.filter(match => !isNaN(parseInt(match, 10)));
    // remove the full string match
    filteredActualVersion.shift();
    filteredMinVersion.shift();
  } catch (e) {
    console.log('Git LFS version number is inconsistent');
    throw e;
  }

  const actualVersionNormalized = generateNormalizedVersionNumber(filteredActualVersion);
  const minVersionNormailzed = generateNormalizedVersionNumber(filteredMinVersion);

  return actualVersionNormalized >= minVersionNormailzed;
};

const isLfsRepo = workingDir => fse.pathExists(path.join(workingDir), '.git', 'lfs');

module.exports = {
  isAtleastGitVersion,
  isAtleastLfsVersion,
  isLfsRepo,
};
