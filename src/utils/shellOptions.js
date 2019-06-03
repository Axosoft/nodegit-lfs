import R from 'ramda';

let defaultShellOptions = { env: R.clone(process.env) };

export const setDefaultShellOptions = (options) => {
  defaultShellOptions = R.mergeDeepRight(
    { env: R.clone(process.env) },
    R.clone(options)
  );
};

export const combineShellOptions = (options, requiredOptions) => R.mergeDeepRight(
  R.mergeDeepRight(defaultShellOptions, options || {}),
  requiredOptions || {}
);
