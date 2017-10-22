import gulp from 'gulp';
import webpack from 'webpack';
import jasmine from 'gulp-jasmine';
import notify from 'gulp-notify';
import { argv } from 'yargs';

//Handle error
function handleError() {
  // Send error to notification center with gulp-notify
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, arguments);

  // Keep gulp from hanging on this task
  this.emit('end');
}

//Unit testing
gulp.task('test', () => gulp.src(`./test/${argv.s != null ? argv.s : '**/*.spec'}.js`)
  .pipe(jasmine({
    includeStackTrace: true
  }))
  .on('error', handleError)
);

//Default task
gulp.task('default', ['test']);