import { core } from './lfsCommands';
import { parseVersion } from '../utils/checkDependencies';
import { regex } from '../constants';

const version = () => core.version()
  .then(({ stdout }) => parseVersion(stdout, regex.LFS));

// parse output

export default version;
