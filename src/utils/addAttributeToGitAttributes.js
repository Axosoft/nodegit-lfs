import fs from 'fs';
import { checkAttribute } from './checkAttribute';

const addAttribute = (filePath, pattern, filter = 'lfs') => {
  if (fs.existsSync(filePath) && pattern && !checkAttribute(filePath, pattern)) {
    fs.appendFileSync(filePath, `${pattern} filter=${filter} diff=${filter} merge=${filter} -text\n`);
  } else { throw new Error(`Error adding glob ${pattern} to repository`); }
};
export { addAttribute };
