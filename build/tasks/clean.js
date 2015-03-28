var gulp = require('gulp'),
  gutil = require('gulp-util'),
  path = require('path'),
  chalk = require('chalk'),
  del = require('del'),
  vinylPaths = require('vinyl-paths'),
  config = require('../config');

// delete everything in the output dir
gulp.task('clean', function() {
  var base = config.paths.base,
    dest = config.paths.dest,
    baser = new RegExp('^' + base + '/');
  
  // safety check - do not delete anytyhing outside the project path
  if (!baser.test(path.resolve(dest))) {
    throw new Error(chalk.yellow(dest) + ': dest path must be a subdirectory of ' + chalk.blue(base));
  }

  return gulp.src([config.paths.dest])
    .pipe(vinylPaths(del));
});
