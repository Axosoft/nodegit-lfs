import fs from 'fs';

const generateRegex = (glob) => {
  if (glob) {
    let globPattern = glob;
    if (glob.includes('*')) {
      globPattern = glob.replace('*', '\\*');
    }
    return new RegExp(globPattern, 'g');
  }
  return null;
};

const checkAttribute = (filePath, pattern) => {
  if (fs.existsSync(filePath)) {
    const gitattributes = fs.readFileSync(filePath);
    const regexPattern = generateRegex(pattern);
    return regexPattern.test(gitattributes);
  }
  return null;
};
export { checkAttribute };
