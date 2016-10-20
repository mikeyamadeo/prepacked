'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = getConfig;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var argv = process.argv;
var cwd = process.cwd;
var exit = process.exit;

var configFile = argv[2] || 'webpack.config.js';

function getConfig() {
  var config = undefined;

  try {
    config = require(_path2['default'].join(cwd(), configFile));
  } catch (e) {
    console.error(e.stack);
    console.error('Failed to load webpack config');
    exit(1);
  }

  return config;
}

module.exports = exports['default'];