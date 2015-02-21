var path = require('path'),
  root = 'src/';

// Project paths
// -------------

exports.paths = {
  root: root,
  dest: 'dist/',
  docs:'./docs',

  src: root + '**/*.js',
  templates: root + '**/*.html',
  styles: root + '**/*.css'
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
