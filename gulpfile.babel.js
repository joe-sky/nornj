import gulp from 'gulp';
import babel from 'gulp-babel';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import jasmine from 'gulp-jasmine';
import rename from 'gulp-rename';
import gulpIf from 'gulp-if';
import eslint from 'gulp-eslint';
import notify from 'gulp-notify';
import { argv } from 'yargs';
import env from 'gulp-env';
import { Server } from 'karma';

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
        screw_ie8: true,
        warnings: false
      },
      sourceMap: true
    }));
  }

  return gulp.src('./src/base.js')
    .pipe(env.set({
      BABEL_ENV: 'webpack'
    }))
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
gulp.task('lib', () => gulp.src('./src/**/*.js')
  .pipe(env.set({
    BABEL_ENV: 'development'
  }))
  .pipe(babel())
  .pipe(gulp.dest('./lib'))
);

//Unit testing
gulp.task('tdd', () => gulp.src('./test/compileStringSpec.js')
  .pipe(jasmine({
    includeStackTrace: true
  }))
);

//Run test specs with Karma
gulp.task('test', done => {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, () => done()).start();
});

//Run eslint
gulp.task('eslint', () => gulp.src('./src/**/*.js')
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
);

//Default task
gulp.task('default', ['build'], () => gulp.start('lib'));