var gulp = require('gulp'),
    requireDir = require('require-dir');

// Require all tasks in build/tasks and subfolders
requireDir('build/tasks', { recurse: true });

gulp.task('default', ['build']);
