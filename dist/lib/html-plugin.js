'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var config = {};
var setConfig = function setConfig(c) {
  return config = c;
};
var getConfig = function getConfig() {
  return config;
};

var defaultHtml = function defaultHtml(_ref) {
  var main = _ref.main;
  var css = _ref.css;
  return '<!doctype html>\n  <meta charset="utf-8"/>\n  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>\n  ' + (css ? '<link href="/' + css + '" rel="stylesheet" type="text/css" />' : '') + '\n<body><div id="app"></div></body>\n<script src="' + main + '"></script>';
};

/**
 * Liberally borrowed & tweaked from Henrik Joreteg:
 * https://github.com/HenrikJoreteg/hjs-webpack/blob/master/lib/html-plugin.js
 */
function HtmlPlugin(_ref2) {
  var _ref2$html = _ref2.html;
  var html = _ref2$html === undefined ? defaultHtml : _ref2$html;
  var _ref2$filename = _ref2.filename;
  var filename = _ref2$filename === undefined ? 'index.html' : _ref2$filename;

  setConfig({
    html: html,
    filename: filename
  });
}

/**
 * 1. Webpack outputs an array for each chunk when using sourcemaps
 * ex: { main: [ 'bundle.js', 'bundle.js.map' ] }
 * 2. If we've got a CSS file add it here
 * 3. The main bundle seems like it's always the first
 */
var getAssets = function getAssets(_ref3) {
  var assetsByChunkName = _ref3.assetsByChunkName;

  var assets = {};
  var value = undefined,
      chunk = undefined;

  for (chunk in assetsByChunkName) {
    value = assetsByChunkName[chunk];

    if (value instanceof Array) {
      /* [1] */

      if (chunk === 'main') {
        /* [2] */
        assets.css = value[1];
      }

      value = value[0];
    }

    assets[chunk] = value; /* [3] */
  }

  return assets;
};

/**
 * 1. if it's a string, we assume it's an html string for the index file
 */
var addAssets = function addAssets(compiler, data) {
  var _getConfig = getConfig();

  var filename = _getConfig.filename;

  var dataType = typeof data;
  var pages = undefined;

  if (dataType === 'string') {
    /* [1] */
    pages = {};
    pages[filename] = data;
  } else if (dataType === 'object') {
    pages = data;
  } else {
    throw new Error('Result from `html` callback must be a string or an object');
  }

  for (var _name in pages) {
    compiler.assets[_name] = (function (asset) {
      return {
        source: function source() {
          return asset;
        },
        size: function size() {
          return asset.length;
        }
      };
    })(pages[_name]);
  }
};

HtmlPlugin.prototype.apply = function (compiler) {
  var _getConfig2 = getConfig();

  var htmlFunction = _getConfig2.html;

  compiler.plugin('emit', function (compiler, callback) {
    var stats = compiler.getStats().toJson();
    addAssets(compiler, htmlFunction(getAssets(stats)));
    callback();
  });
};

exports['default'] = HtmlPlugin;
module.exports = exports['default'];