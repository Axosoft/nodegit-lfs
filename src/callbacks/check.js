import R from 'ramda';
import { Error } from '../constants';

const buildCheck = NodeGit => src =>
  NodeGit.Repository.open(src.repo().workdir())
    .then(readonlyRepo => Promise.all(
        R.map(
          attr => NodeGit.Attr.get(readonlyRepo, 0, src.path(), attr),
          ['text', 'diff', 'merge', 'filter']
        )
      )
        .then((attributes) => {
          const [text, ...lfsAttributes] = attributes;
          return (
            R.all(R.identity, attributes) &&
            R.all(R.pipe(R.toLower, R.equals('lfs')), lfsAttributes) &&
            R.contains('false', R.toLower(text))
          )
            ? Error.CODE.OK
            : Error.CODE.PASSTHROUGH;
        })
        .catch(() => Error.CODE.PASSTHROUGH));

export default buildCheck;
