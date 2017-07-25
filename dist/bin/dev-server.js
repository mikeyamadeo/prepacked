#!/usr/bin/env node


// Based on
// https://github.com/gaearon/react-transform-boilerplate/blob/master/devServer.js
// see as example for autoreload https://github.com/stsiarzhanau/webpack-react-redux-starter/blob/master/tools/devServer.js

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _getConfig = require('./getConfig');

var _getConfig2 = _interopRequireDefault(_getConfig);

var config = (0, _getConfig2['default'])();
var app = (0, _express2['default'])();
var compiler = (0, _webpack2['default'])(config);
var devServer = config.devServer;
var contentBase = devServer.contentBase;
var port = devServer.port;
var host = devServer.host;

app.use(require('webpack-dev-middleware')(compiler, {
  hot: true,
  publicPath: config.output.publicPath,
  stats: { colors: true }
}));

app.use(require('webpack-hot-middleware')(compiler));

if (contentBase) {
  app.use(_express2['default']['static'](contentBase));
}

app.listen(port, host, function (err) {
  if (err) {
    console.error(err);
    return;
  }

  console.log('🚀 Listening at http://' + host + ':' + port);
});