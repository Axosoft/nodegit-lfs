import { core } from './lfsCommands';

const pull = () => {
  // get the default remote / branch
  const remote = 'origin';
  const branch = 'master';
  const args = `${remote} ${branch}`;
  return core.pull(args);
};

export default pull;
