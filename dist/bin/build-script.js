#!/usr/bin/env node
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _getConfig = require('./getConfig');

var _getConfig2 = _interopRequireDefault(_getConfig);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var log = console.log;

var compiler = (0, _webpack2['default'])((0, _getConfig2['default'])());

compiler.run(function (err, stats) {
  if (err) {
    log(err);
  }

  var _stats$toJson = stats.toJson();

  var assets = _stats$toJson.assets;

  assets.sort(sortAssets);
  assets.forEach(function (asset) {
    log(formatAsset(asset));
  });
});

function formatAsset(_ref) {
  var name = _ref.name;
  var size = _ref.size;

  return _chalk2['default'].green(name) + ': ' + formatSize(size);
}

function formatSize(size) {
  var sizeInKb = size * 0.001;
  return sizeInKb.toFixed(0) > 0 ? sizeInKb.toFixed(1) + ' kB' : size + ' bytes';
}

function sortAssets(a, b) {
  return alphabetical(a.name, b.name);
}

function alphabetical(a, b) {
  var A = a.toLowerCase();
  var B = b.toLowerCase();

  if (A < B) {
    return -1;
  } else if (A > B) {
    return 1;
  } else {
    return 0;
  }
}