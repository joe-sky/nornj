const webpack = require('webpack');
const path = require('path');

const isProd = process.env.NODE_ENV == 'production';
let libName = 'nornj.js';
if (isProd) {
  libName = 'nornj.min.js';
}

let plugins = [new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('development')
})];
if (isProd) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compressor: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      screw_ie8: true,
      warnings: false
    },
    sourceMap: true
  }));
}

module.exports = {
  entry: {
    index: './src/base.js'
  },
  devtool: isProd ? 'source-map' : false,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: libName,
    library: 'NornJ',
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: ['babel-loader'],
      exclude: /node_modules/
    }]
  },
  plugins
};