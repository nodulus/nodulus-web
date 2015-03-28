var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('../config');

// outputs changes to files to the console
function reportChange(event){
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

// this task wil watch for changes
// to js, html, and css files and call the
// reportChange method. Also, by depending on the
// serve task, it will instantiate a browserSync session
gulp.task('watch', ['serve'], function() {
  gulp.watch(config.paths.src, ['build-system', browserSync.reload]).on('change', reportChange);
  gulp.watch(config.paths.templates, ['build-templates', browserSync.reload]).on('change', reportChange);
  gulp.watch(config.paths.styles, ['build-styles', browserSync.reload]).on('change', reportChange);
});
