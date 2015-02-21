var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var config = require('../config');

// runs jshint on all .js files
gulp.task('lint', function() {
  return gulp.src(config.paths.src)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});
