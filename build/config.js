var path = require('path'),
    root = '.',
    base = path.resolve(root);

console.log('base', base);

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
