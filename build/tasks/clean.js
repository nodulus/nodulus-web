var gulp = require('gulp'),
  del = require('del'),
  vinylPaths = require('vinyl-paths'),
  config = require('../config');

// delete everything in the output dir
gulp.task('clean', function() {
  return gulp.src([config.paths.dest])
    .pipe(vinylPaths(del));
});
