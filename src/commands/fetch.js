import { core } from './lfsCommands';

const fetch = () => {
  // get the default remote / branch
  const remote = 'origin';
  const branch = 'master';
  const args = `${remote} ${branch}`;
  return core.fetch(args);
};
/* {
  success: boolean,
  raw: '',
  errno: '',
  version: '1.8.0'
}
{
  success: boolean,
  raw: '',
  errno: '',
  push: {
    bytes: '',
    objects: ''
  }
} */
export default fetch;
