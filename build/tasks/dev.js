var gulp = require('gulp'),
  tools = require('aurelia-tools');

// update dependencies in this folder from the repos in the parent directory
gulp.task('update-own-deps', function(){
  tools.updateOwnDependenciesFromLocalRepositories();
});

// pull in all aurelia github repos, placing them one directory up from where
// the command is executed, running `npm install` and `gulp build` for each
gulp.task('build-dev-env', function () {
  tools.buildDevEnv();
});
