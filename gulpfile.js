var gulp = require('gulp'),
  browserify = require('browserify'),
  uglify = require('gulp-uglify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  jasmine = require('gulp-jasmine'),
  rename = require('gulp-rename'),
  gulpif = require('gulp-if'),
  argv = require('yargs').argv;

gulp.task('build', function () {
  var libName = 'nornj.js';
  if(argv.min) {
    libName = 'nornj.min.js';
  }

  return browserify({
    entries: './src/base.js',
    standalone: 'NornJ'
  })
    .bundle()
    .pipe(source(libName))
    .pipe(buffer())
    .pipe(gulpif(argv.min, uglify()))
    .pipe(gulp.dest('./dist'));
});

//unit testing
gulp.task("test", function () {
  return gulp.src(["./test/**/**Spec.js"])
    .pipe(jasmine());
});

//default task
gulp.task('default', ['build']);