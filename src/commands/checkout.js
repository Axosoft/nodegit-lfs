import { core } from './lfsCommands';
import generateResponse from '../utils/generateResponse';
import { BAD_CORE_RESPONSE } from '../constants';

const checkout = () => {
  //eslint-disable-next-line
  let response = generateResponse();
  return core.checkout()
    .then(({ stdout, stderr }) => {
      response.raw = stdout;
      response.stderr = stderr;
      return response;
    })
    .catch((error) => {
      response.success = false;
      response.error = error.errno || BAD_CORE_RESPONSE;
      response.raw = error;
      return response;
    });
};
export default checkout;
