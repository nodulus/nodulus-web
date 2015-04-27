var path = require('path'),
    root = '.',
    base = path.resolve(root);

// Project paths
// -------------

exports.paths = {
  base: base,
  root: root,
  dest: root + '/dist',
  docs: root + '/docs',

  src: root + '/src',
  scripts: root + '/src/**/*.js',
  templates: root + '/src/**/*.{jade,html}',
  styles: root + '/src/**/*.{scss,sass,css}',
  modules: [ path.relative(base, 'node_modules'), path.relative(base, 'jspm_packages') ]
};


// Build options
// -------------

exports.opts = {};

// 6to5
exports.opts.to5 = {
  comments: false,
  compact: false,
  sourceMap: true,
  sourceMapName: '',
  moduleIds: false,
  stage: 2,
  modules: 'system',
  optional: [
    "es7.decorators",
    "es7.classProperties"
  ]
};

// Browsersync
exports.opts.browsersync = {
  port: 9000
};
