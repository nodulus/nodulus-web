var gulp = require('gulp');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var to5 = require('gulp-6to5');
var sourcemaps = require('gulp-sourcemaps');
var config = require('../config');
var compilerOptions = config.opts.to5;
var assign = Object.assign || require('object.assign');

// transpile es6 files to SystemJS
// plumber prevents 'pipe breaking' caused by errors from other gulp plugins:
// see: https://www.npmjs.com/package/gulp-plumber
gulp.task('build-system', function () {
  return gulp.src(config.paths.src)
    .pipe(plumber())
    .pipe(changed(config.paths.dest, {extension: '.js'}))
    .pipe(sourcemaps.init())
    .pipe(to5(assign({}, compilerOptions, {modules:'system'})))
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/' + config.paths.root }))
    .pipe(gulp.dest(config.paths.dest));
});

// copy changed html files to the output directory
gulp.task('build-templates', function () {
  return gulp.src(config.paths.templates)
    .pipe(changed(config.paths.dest, {extension: '.html'}))
    .pipe(gulp.dest(config.paths.dest));
});

// clean, then build system + templates
gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-system', 'build-templates'],
    callback
  );
});
