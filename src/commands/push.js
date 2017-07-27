import { core } from './lfsCommands';

const push = () => {
  // get the default remote / branch
  const remote = 'origin';
  const branch = 'master';
  const args = `${remote} ${branch}`;
  return core.push(args);
};

export default push;
