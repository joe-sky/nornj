var gulp = require('gulp'),
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
  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
}

//Build js
gulp.task('build', function () {
  var libName = 'nornj.js';
  if (argv.p) {
    libName = 'nornj.min.js';
  }

  var plugins = [];
  if (argv.p) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    }));
  }

  return gulp.src('./src/base.js')
    .pipe(webpackStream({
      devtool: argv.p ? 'source-map' : null,
      watch: argv.w ? true : false,
      output: {
        filename: libName,
        library: 'NornJ',
        libraryTarget: 'umd'
      },
      plugins: plugins
    }))
    .on('error', handlebuildError)
    .pipe(gulp.dest('./dist'));
});

//Unit testing
gulp.task("test", function () {
  return gulp.src(["./test/**/**Spec.js"])
    .pipe(jasmine());
});

//Run eslint
gulp.task('eslint', function () {
  return gulp.src(['./src/**/*.js'])
    .pipe(eslint({
      "rules": {
        "camelcase": [2, { "properties": "always" }],
        "comma-dangle": [2, "never"],
        "semi": [2, "always"],
        "quotes": [2, "single"],
        "strict": [2, "global"]
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

//Default task
gulp.task('default', ['build']);