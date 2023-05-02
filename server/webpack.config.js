const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './index.mjs',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../')
  },
  target: 'node'
};
