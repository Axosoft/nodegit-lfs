import R from 'ramda';
import { Error } from '../constants';

export default (src, attr) => (attr && R.equals('lfs', attr.toLowerCase()) ? Error.CODE.OK : Error.CODE.PASSTHROUGH);
