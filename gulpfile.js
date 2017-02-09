'use strict';

const gulp = require('gulp'),
  babel = require('gulp-babel'),
  webpack = require('webpack'),
  webpackStream = require('webpack-stream'),
  jasmine = require('gulp-jasmine'),
  rename = require('gulp-rename'),
  gulpif = require('gulp-if'),
  eslint = require('gulp-eslint'),
  notify = require('gulp-notify'),
  argv = require('yargs').argv;

//Handle error
function handlebuildError() {
  // Send error to notification center with gulp-notify
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, arguments);

  // Keep gulp from hanging on this task
  this.emit('end');
}

//Build js
gulp.task('build', () => {
  let libName = 'nornj.js';
  if (argv.p) {
    libName = 'nornj.min.js';
  }

  let plugins = [];
  if (argv.p) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: false,
        warnings: false
      },
      sourceMap: true
    }));
  }

  return gulp.src('./src/base.js')
    .pipe(webpackStream({
      devtool: argv.p ? 'source-map' : false,
      watch: argv.w ? true : false,
      output: {
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
    }, webpack))
    .on('error', handlebuildError)
    .pipe(gulp.dest('./dist'));
});

//Convert es6 code to es5 from src to lib
gulp.task("lib", () => gulp.src('./src/**/*.js')
  .pipe(babel())
  .pipe(gulp.dest('./lib'))
);

//Unit testing
gulp.task("test", () => gulp.src(["./test/**/**Spec.js"])
  .pipe(jasmine({
    includeStackTrace: true
  }))
);

//Run eslint
gulp.task('eslint', () => gulp.src(['./src/**/*.js'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
);

//Default task
gulp.task('default', ['build', 'lib']);