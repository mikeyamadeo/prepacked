'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackMerge = require('webpack-merge');

var _webpackMerge2 = _interopRequireDefault(_webpackMerge);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _compressionWebpackPlugin = require('compression-webpack-plugin');

var _compressionWebpackPlugin2 = _interopRequireDefault(_compressionWebpackPlugin);

var _libHtmlPlugin = require('./lib/html-plugin');

var _libHtmlPlugin2 = _interopRequireDefault(_libHtmlPlugin);

var _utils = require('./utils');

exports['default'] = function (settings) {
  (0, _utils.checkRequired)(settings, {
    isDev: 'A boolean to indicate whether or not everything is in production mode or development mode',
    src: 'This should just be the path to the file that serves as the main entry point of your application.',
    out: "Path to directory where we're going to put generated files."
  });

  // checkRequiredPackages (babel-loader)
  // checkForConfigErrors (e.g. resolves should be an array of strings vs. string)

  var _withDefaults = (0, _utils.withDefaults)(settings);

  var isDev = _withDefaults.isDev;
  var src = _withDefaults.src;
  var
  // styleSrc,
  out = _withDefaults.out;
  var resolves = _withDefaults.resolves;
  var html = _withDefaults.html;
  var devServer = _withDefaults.devServer;
  var featureFlags = _withDefaults.featureFlags;

  // const polyfills = {
  //   Promise: 'imports?this=>global!exports?global.Promise!es6-promise'
  // }
  var common = {
    entry: src,
    output: { filename: '[name].js', path: out, publicPath: '/' },
    resolve: {
      extensions: ['.js', '.css'],
      /**
      * 1. Enables absolute url imports. With file structure:
      *
      * src
      *  - App
      *    - shared
      *      - Btn
      *    - views
      *      - Main
      *        - components
      *          - Header
      *
      * from Header/index.js you can import Btn from
      *   'App/shared/Btn'
      *   vs.
      *   '../../../../../shared/Btn'
      *
      * 2. Allows user to add additional directories for webpack to check when resolving
      * imports. While potentially overkill, by adding 'shared' & using the above (1)
      * file structure you can:
      *   import Btn from 'Btn'
      *   vs.
      *   import Btn from 'App/shared/Btn'
      */
      modules: [src].concat(_toConsumableArray(resolves), [
      /* [2] */
      'node_modules'])
    },
    module: {
      rules: [
      // es6 support
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader',
          options: {
            // env == polyfills all es6 not supported by browsers
            // react === jsx support
            presets: ['env', 'stage-1', 'react'],
            // support for spread/rest
            plugins: [require('babel-plugin-transform-object-rest-spread'), require('babel-plugin-transform-export-extensions')]
          }
        }
      }]
    },
    plugins: [new _libHtmlPlugin2['default']({ html: html }), new _webpack2['default'].DefinePlugin(featureFlags)]
  };

  var dev = {
    devtool: 'cheap-module-source-map',
    devServer: _extends({
      // makes hostnames like http://mikeys-hackbook-pro.local:PORT/ possible
      disableHostCheck: true
    }, devServer),
    module: {
      rules: [
      // load styles
      {
        test: /\.css$/,
        exclude: '/node_modules/',
        use: ['style-loader', 'css-loader']
      }]
    }
  };

  var prod = {
    module: {
      rules: [
      // load styles
      {
        test: /\.css$/,
        exclude: '/node_modules/',
        use: _extractTextWebpackPlugin2['default'].extract({ use: 'css-loader' })
      }]
    },
    plugins: [new _webpack2['default'].LoaderOptionsPlugin({ minimize: true, debug: false }), new _webpack2['default'].DefinePlugin(_extends({
      'process.env.NODE_ENV': '"production"'
    }, featureFlags)), new _extractTextWebpackPlugin2['default']('style.css'), new _webpack2['default'].optimize.UglifyJsPlugin({
      beautify: false,
      mangle: { screw_ie8: true, keep_fnames: true },
      compress: { screw_ie8: true, warnings: false },
      comments: false
    }), new _compressionWebpackPlugin2['default']({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|html|css)$/,
      threshold: 10240,
      minRatio: 0.8
    })]
  };

  return isDev ? (0, _webpackMerge2['default'])(common, dev) : (0, _webpackMerge2['default'])(common, prod);
};

module.exports = exports['default'];

/* [1] */