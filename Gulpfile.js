var gulp = require('gulp'),
    requireDir = require('require-dir');

// Require all tasks in gulp/tasks and subfolders
requireDir('gulp/tasks', { recurse: true });

gulp.task('default', ['build']);
