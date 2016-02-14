var gulp = require('gulp'),
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    jasmine = require('gulp-jasmine'),
    rename = require('gulp-rename');

var isJsMin = true,
    libName = "nornj.js";
if(isJsMin) {
    libName = "nornj.min.js";
}

//compress js
function jsMin(obj) {
    if (isJsMin) {
        return obj.pipe(uglify());
    }

    return obj;
}

gulp.task('build js', function () {
    return jsMin(browserify({
            entries: './src/base.js',
            standalone: 'NornJ'
        })
        .bundle()
        .pipe(source(libName))
        .pipe(buffer()))
        .pipe(gulp.dest('./dist'));
});

//unit testing
gulp.task("test", function (callback) {
    return gulp.src(["./test/**/**Spec.js"])
        .pipe(jasmine());
});

//default task
gulp.task('default', ['build js']);