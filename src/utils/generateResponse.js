import { Error } from 'nodegit';

const generateResponse = () => ({
  success: true,
  errno: Error.CODE.OK,
  raw: '',
  stderr: '',
});

export default generateResponse;
