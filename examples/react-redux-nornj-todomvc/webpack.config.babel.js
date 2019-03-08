import path from 'path';
import webpack from 'webpack';

export default {
  mode: 'production',
  entry: __dirname + '/index.js',
  output: {
    path: path.join(__dirname, 'assets'),
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  devtool: 'source-map',

  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules'],
    alias: {
      'nornj': 'nornj/dist/nornj.runtime.common'
    }
  }
};