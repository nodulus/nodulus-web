var gulp = require('gulp');
var jspm = require('gulp-jspm-build')
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var symlink = require('gulp-symlink');
var runSequence = require('run-sequence');
var assign = Object.assign || require('object.assign');
var config = require('../config');
var compilerOptions = config.opts.to5;

// transpile es6 files to SystemJS
// plumber prevents 'pipe breaking' caused by errors from other gulp plugins:
// see: https://www.npmjs.com/package/gulp-plumber
gulp.task('build-system', function () {
  return gulp.src(config.paths.scripts)
    .pipe(plumber())
    .pipe(changed(config.paths.dest, {extension: '.js'}))
    .pipe(sourcemaps.init())
    // .pipe(jspm({
    //     bundles: [
    //         { src: 'app', dst: 'app.js' }
    //     ]
    // }))
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/' + config.paths.src }))
    .pipe(gulp.dest(config.paths.dest));

  // return gulp.src(config.paths.scripts)
  //   .pipe(plumber())
  //   .pipe(changed(config.paths.dest, {extension: '.js'}))
  //   .pipe(sourcemaps.init())
  //   .pipe(to5(assign({}, compilerOptions)))
  //   .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/' + config.paths.src }))
  //   .pipe(gulp.dest(config.paths.dest));
});

// copy changed html files to the output directory
gulp.task('build-templates', function () {
  return gulp.src(config.paths.templates)
    .pipe(changed(config.paths.dest, {extension: '.html'}))
    .pipe(gulp.dest(config.paths.dest));
});

// compile sass into output directory
gulp.task('build-styles', function () {
  return gulp.src(config.paths.styles)
    .pipe(changed(config.paths.dest, {extension: '.css'}))
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [config.paths.src].concat(config.paths.modules),
      errLogToConsole: true
    }))
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/' + config.paths.src }))
    .pipe(gulp.dest(config.paths.dest));
});

// copy config to the output directory
gulp.task('build-config', function () {
  return gulp.src(config.paths.root + '/config.js')
    .pipe(changed(config.paths.dest, {extension: '.js'}))
    .pipe(gulp.dest(config.paths.dest));
});

gulp.task('link-modules', function() {
  return gulp.src(config.paths.modules)
    // .pipe(symlink(config.paths.dest))
    .pipe(symlink([ config.paths.dest + '/node_modules', config.paths.dest + '/jspm_packages' ]));
});

// clean, then build system + templates
gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-system', 'build-templates', 'build-styles', 'build-config', 'link-modules'],
    callback
  );
});
