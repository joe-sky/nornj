import path from 'path';
import webpack from 'webpack';

export default {
  entry: __dirname + '/index.js',
  output: {
    path: path.join(__dirname, 'assets'),
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  devtool: 'source-map',

  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.nj.html(\?[\s\S]+)*$/,
        loader: 'nornj-loader',
        options: {
          outputH: true,
          delimiters: 'react'
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules']
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: false,
        warnings: false
      },
      sourceMap: true
    })
  ]
};