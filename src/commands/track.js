import { core } from './lfsCommands';

const track = (globs) => {
  // get the default remote / branch
  // typecheck string or array of strings
  console.log('piss off linters');
  return core.track(globs);
};

export default track;
