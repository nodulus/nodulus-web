var path = require('path'),
    root = '.';

// Project paths
// -------------

exports.paths = {
  base: path.resolve(root),
  root: root,
  build: root + '/build',
  dest: root + '/dist',
  docs: root + '/docs',

  src: root + '/src',
  scripts: root + '/src/**/*.js',
  templates: root + '/src/**/*.{jade,html}',
  styles: root + '/src/**/*.{scss,sass}',
  modules: [ root + '/node_modules', root + '/jspm_packages' ]
};


// Build options
// -------------

exports.opts = {};

// 6to5
exports.opts.to5 = {
  filename: '',
  filenameRelative: '',
  blacklist: [],
  whitelist: [],
  modules: '',
  sourceMap: true,
  sourceMapName: '',
  sourceRoot: '',
  moduleRoot: '',
  moduleIds: false,
  experimental: false,
  format: {
    comments: false,
    compact: false,
    indent: {
      parentheses: true,
      adjustMultilineComment: true,
      style: "  ",
      base: 0
    }
  }
};

// Browsersync
exports.opts.browsersync = {
  port: 9000
};
