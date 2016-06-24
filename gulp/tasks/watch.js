var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('../config');

// outputs changes to files to the console
function reportChange(event){
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

// this task watches for changes to gulp, scripts, templates, and stylesheets.
// tt runs the a gulp task and then call the reportChange method. By depending
// the serve task, it will also start a browserSync session
gulp.task('watch', ['serve'], function() {
  // watch for changes to project config and gulp tasks
  gulp.watch([
    config.paths.root + '/{package.json,config.js,Gulpfile.js}',
    // config.paths.root + '/gulp/**/*.js',
    config.paths.src + '/_settings.scss',
  ], ['build', browserSync.reload]).on('change', reportChange);
  // watch for changes to scripts
  gulp.watch(config.paths.scripts, ['build-system', browserSync.reload]).on('change', reportChange);
  // watch for changes to templates
  gulp.watch(config.paths.templates, ['build-templates', browserSync.reload]).on('change', reportChange);
  // watch for changes to stylesheets
  gulp.watch(config.paths.styles, ['build-styles', browserSync.reload]).on('change', reportChange);
});
