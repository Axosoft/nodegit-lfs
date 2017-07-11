const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  entry: {
    'src/index': './src/index.js'
  },
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
