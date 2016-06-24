var path = require('path'),
    root = '.',
    base = path.resolve(root);

// Project paths
// -------------

exports.paths = {
  base: base,
  root: root,
  build: root + '/build',
  dist: root + '/dist',
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
  sourceMapTarget: '',
  moduleIds: false,
  presets: ["stage-3"],
  plugins: [
    "transform-decorators",
    "transform-class-properties"
  ]
};

// Browsersync
exports.opts.browsersync = {
  port: 9000
};
