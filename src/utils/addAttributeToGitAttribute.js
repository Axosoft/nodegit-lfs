import * as fs from 'fs';
// addAttribute(path.join(process.cwd(), '.gitattributes'));
const addAttribute = (filePath, pattern = '', filter = '') => {
  fs.appendFileSync(filePath, `${pattern} filter=${filter}`);
};
export { addAttribute };
